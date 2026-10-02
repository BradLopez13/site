import { getCollection } from 'astro:content';
import type { Lang } from '../i18n';

// Content lives in one folder per language: src/content/<collection>/<lang>/<slug>.mdx.
// Drafts show up in `astro dev` and never in a build.
const visible = (draft: boolean) => import.meta.env.DEV || !draft;
const inLang = (id: string, lang: Lang) => id.startsWith(`${lang}/`);
const slugOf = (id: string) => id.slice(id.indexOf('/') + 1);

export async function getArticles(lang: Lang) {
	const articles = await getCollection('writing', ({ id, data }) => inLang(id, lang) && visible(data.draft));
	return articles.map((a) => ({ ...a, slug: slugOf(a.id) })).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getWork(lang: Lang) {
	const work = await getCollection(
		'work',
		({ id, data }) => inLang(id, lang) && visible(data.draft) && (data.kind === 'project' || data.cleared || import.meta.env.DEV),
	);
	return work.map((w) => ({ ...w, slug: slugOf(w.id) })).sort((a, b) => a.data.order - b.data.order);
}
