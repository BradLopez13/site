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
