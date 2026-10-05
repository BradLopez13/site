// Swaps every [data-i18n] text for the visitor's language on the same route, keeps <html lang>
// right, remembers the choice, and tells the React islands through the shared store.
import { flat, fmt, type Lang } from '../i18n';
import { $lang, setLang } from '../i18n/store';

const dicts: Record<Lang, Record<string, string>> = { en: flat('en'), es: flat('es') };
const root = document.documentElement;

// Once an island has hydrated, React renders its words from the shared store; touching its nodes here
// would detach the text React holds on to.
const owned = (el: Element) => !!el.closest('astro-island:not([ssr])');

export function apply(lang: Lang) {
	const d = dicts[lang];
	document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
		if (owned(el)) return;
		const text = d[el.dataset.i18n!];
		if (text == null) return;
		const vars = el.dataset.i18nVars ? JSON.parse(el.dataset.i18nVars) : undefined;
		const next = fmt(text, vars);
		if (el.textContent !== next) el.textContent = next;
	});
	// Attributes: data-i18n-attr="aria-label:ui.writeMe;alt:projects.reservas.alt"
	document.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach((el) => {
		if (owned(el)) return;
		el.dataset.i18nAttr!.split(';').forEach((pair) => {
			const [attr, key] = pair.split(':');
			if (d[key] != null) el.setAttribute(attr, d[key]);
		});
	});
	root.lang = lang;
	root.dataset.lang = lang;
	const b = document.body.dataset;
	if (b.titleKey) document.title = d[b.titleKey] ?? document.title;
	else if (b.titleEs) document.title = (lang === 'es' ? b.titleEs : b.titleEn) ?? document.title;
	setLang(lang);
	window.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

const initial = (root.dataset.lang === 'es' ? 'es' : 'en') as Lang;
apply(initial);

document.querySelectorAll<HTMLButtonElement>('[data-lang-toggle]').forEach((b) =>
	b.addEventListener('click', () => {
		const next: Lang = $lang.get() === 'es' ? 'en' : 'es';
		try { localStorage.setItem('lang', next); } catch {}
		apply(next);
	}),
);

// Other scripts change a data-i18n key (a button label, a note) and ask for a fresh pass.
window.addEventListener('relabel', () => apply($lang.get()));
