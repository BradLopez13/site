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
		draft,
	}),
});

const work = defineCollection({
	loader: glob({ base: './src/content/work', pattern: '**/*.{md,mdx}' }),
	schema: z.discriminatedUnion('kind', [
		z.object({
			kind: z.literal('project'),
			title: z.string(),
			summary: z.string(),
			// What makes it hard: the line /work shows next to the demo and repo links.
			hard: z.string(),
			demo: z.url(),
			repo: z.url(),
			period: z.string(),
			stack: z.array(z.string()),
			order: z.number(),
			draft,
		}),
		z.object({
			kind: z.literal('company'),
			title: z.string(),
			summary: z.string(),
			company: z.string(),
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
