// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Vercel sets this on every build; it follows a custom domain if one is added later.
	site: process.env.VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
		: 'http://localhost:4321',
	integrations: [
		mdx(),
		// One route per page: the language switches in place, so the sitemap lists each page once.
		sitemap(),
		react(),
	],
	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: { include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime'] },
	},
	markdown: {
		shikiConfig: { theme: 'vitesse-dark' },
	},
});
