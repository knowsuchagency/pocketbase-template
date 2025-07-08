import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Static adapter for SPA deployment
		adapter: adapter({
			// Build output directory
			out: 'build',
			// SPA fallback for client-side routing
			fallback: 'index.html',
			// Prerender all pages at build time
			precompress: false,
			// Strict mode ensures all pages are prerenderable
			strict: false
		})
	}
};

export default config;
