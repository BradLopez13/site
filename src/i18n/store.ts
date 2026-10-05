// The visitor's language, shared by the whole page: Astro scripts and React islands read and write
// the same nanostores atom, so nothing needs a separate route per language.
import { atom } from 'nanostores';
import { useStore } from '@nanostores/react';
import { defaultLang, t, type Key, type Lang } from './index';

// The head script sets <html data-lang> before anything renders, so islands start in the visitor's language.
const initial = (): Lang => (typeof document !== 'undefined' && document.documentElement.dataset.lang === 'es' ? 'es' : defaultLang);

export const $lang = atom<Lang>(initial());

export function setLang(lang: Lang) {
	$lang.set(lang);
}

/**
 * The i18n hook for React islands: const tr = useT(); tr('race.run').
 * Islands are rendered in English on the server; their texts carry data-i18n keys, so the page's
 * pre-paint script translates that markup and hydration finds the same words the client renders.
 */
export function useT() {
	const lang = useStore($lang);
	return Object.assign((key: Key, vars?: Record<string, string | number>) => t(key, lang, vars), { lang });
}
