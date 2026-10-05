// The visitor's language and theme, shared by the whole page: Astro scripts and React islands
// read and write the same nanostores atoms, so nothing needs a separate route per language.
import { atom } from 'nanostores';
import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { defaultLang, t, type Key, type Lang } from './index';

export const $lang = atom<Lang>(defaultLang);

export function setLang(lang: Lang) {
	$lang.set(lang);
}

/**
 * The i18n hook for React islands: const tr = useT(); tr('race.run').
 * Islands are rendered in English on the server, so the first client render stays English
 * (no hydration mismatch) and switches to the visitor's language right after mounting.
 */
export function useT() {
	const current = useStore($lang);
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const lang: Lang = mounted ? current : defaultLang;
	return Object.assign((key: Key, vars?: Record<string, string | number>) => t(key, lang, vars), { lang });
}
