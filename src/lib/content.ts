import { getCollection } from 'astro:content';

const visible = (draft: boolean) => import.meta.env.DEV || !draft;

export async function getArticles() {
	const articles = await getCollection('writing', ({ data }) => visible(data.draft));
	return articles.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getWork() {
	const work = await getCollection(
		'work',
		({ data }) =>
			visible(data.draft) && (data.kind === 'project' || data.cleared || import.meta.env.DEV),
	);
	return work.sort((a, b) => a.data.order - b.data.order);
}
