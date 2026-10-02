import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Drafts show up in `astro dev` and never in a build.
const draft = z.boolean().default(false);

const writing = defineCollection({
	loader: glob({ base: './src/content/writing', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		part: z.number().optional(),
		draft,
	}),
});

const work = defineCollection({
	loader: glob({ base: './src/content/work', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.discriminatedUnion('kind', [
			z.object({
				kind: z.literal('project'),
				title: z.string(),
				// One line for cards: what it is, at a glance.
				tagline: z.string(),
				summary: z.string(),
				demo: z.url(),
				repo: z.url(),
				cover: image(),
				role: z.string(),
				period: z.string(),
				stack: z.array(z.string()),
				order: z.number(),
				draft,
			}),
			z.object({
				kind: z.literal('company'),
				title: z.string(),
				tagline: z.string(),
				summary: z.string(),
				// Never the client's name. The employer only once the contract allows it.
				where: z.string(),
				role: z.string(),
				period: z.string(),
				stack: z.array(z.string()),
				order: z.number(),
				// Set to true only after checking the contract or getting written approval.
				// Until then the case never reaches a build, draft or not.
				cleared: z.boolean().default(false),
				draft,
			}),
		]),
});

export const collections = { writing, work };
