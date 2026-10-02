import rss from '@astrojs/rss';
import { SITE_TITLE } from '../consts';
import { base, dict } from '../i18n';
import { getArticles } from './content';

/** One feed per language; drafts never reach it because getArticles skips them in builds. */
export async function feed(context, lang) {
	const posts = await getArticles(lang);
	return rss({
		title: SITE_TITLE,
		description: dict(lang).meta.description,
		site: context.site,
		customData: `<language>${lang === 'es' ? 'es-ES' : 'en-GB'}</language>`,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `${base(lang)}/writing/${post.slug}/`,
		})),
	});
}
