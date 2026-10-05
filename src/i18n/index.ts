// Interface text lives in one JSON per language. en.json is the source of truth: es.json must
// have exactly the same shape, or this file stops compiling. Variables use {name} placeholders.
import en from './en.json';
import es from './es.json';

export const languages = { en: 'English', es: 'Español' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

export type Dict = typeof en;
const dicts: Record<Lang, Dict> = { en, es: es satisfies Dict };

export const dict = (lang: Lang): Dict => dicts[lang];

/** Fills {name} placeholders: fmt('Part {n} of {total}', { n: 1, total: 4 }). */
export function fmt(text: string, vars: Record<string, string | number> = {}): string {
	return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

export const isLang = (v: string | undefined): v is Lang => !!v && v in languages;

/** Prefix for links: '' for English, '/es' for Spanish. */
export const base = (lang: Lang) => (lang === defaultLang ? '' : `/${lang}`);

/** Same page in the other language. */
export function switchPath(path: string, to: Lang): string {
	const bare = path.replace(/^\/es(?=\/|$)/, '') || '/';
	return to === defaultLang ? bare : `/es${bare === '/' ? '/' : bare}`;
}

/** Date formatting follows the page language. */
export const dateFmt = (lang: Lang, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-GB', opts);

/** Language of the page being rendered, from its URL (/es/... is Spanish). */
export const langFromUrl = (url: URL): Lang => (/^\/es(\/|$)/.test(url.pathname) ? 'es' : 'en');

/** getStaticPaths for pages under src/pages/[...lang]: English at the root, Spanish under /es. */
export const langPaths = () => [{ params: { lang: undefined } }, { params: { lang: 'es' } }];
export const langParam = (lang: Lang) => (lang === defaultLang ? undefined : lang);

/* ---------- One route, two dictionaries ----------
   The page is rendered once, in English. Every translatable text carries its key (data-i18n),
   and the client swaps it for the visitor's language; React islands read the same store. */

type Leaves<T, P extends string = ''> = {
	[K in keyof T & string]: T[K] extends string ? `${P}${K}` : T[K] extends readonly unknown[] ? never : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];

/** Every text key in the dictionaries, as a dotted path: 'home.title', 'ui.writeMe'. */
export type Key = Leaves<Dict>;

/** Reads a dotted path from a dictionary. */
export function pick(d: unknown, path: string): unknown {
	return path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), d);
}

/** Text for a key in a language; falls back to English, then to the key itself. */
export function t(key: Key, lang: Lang = defaultLang, vars?: Record<string, string | number>): string {
	const v = pick(dicts[lang], key) ?? pick(dicts.en, key);
	return fmt(typeof v === 'string' ? v : key, vars);
}

/** Flat key → text map of one language, for the client that swaps texts. */
export function flat(lang: Lang): Record<string, string> {
	const out: Record<string, string> = {};
	const walk = (o: unknown, p: string) => {
		if (typeof o === 'string') out[p] = o;
		else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, p ? `${p}.${k}` : k);
	};
	walk(dicts[lang], '');
	return out;
}
