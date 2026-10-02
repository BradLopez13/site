// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Vercel sets this on every build; it follows a custom domain if one is added later.
	site: process.env.VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
		: 'http://localhost:4321',
	integrations: [
		mdx(),
		// hreflang pairs for /x and /es/x in the sitemap.
		sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en-GB', es: 'es-ES' } } }),
		react(),
	],
	markdown: {
		shikiConfig: { theme: 'vitesse-dark' },
	},
	// Downloaded at build time and served from the site itself: no request to Google from the browser.
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Unbounded',
			cssVariable: '--font-display',
			weights: [600, 800, 900],
			subsets: ['latin'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'Figtree',
			cssVariable: '--font-body',
			weights: [400, 600, 700],
			subsets: ['latin'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'JetBrains Mono',
			cssVariable: '--font-mono',
			weights: [400, 700],
			subsets: ['latin'],
			fallbacks: ['ui-monospace', 'monospace'],
		},
	],
});
