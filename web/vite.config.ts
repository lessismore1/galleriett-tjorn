import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/** Produktion / Cloudflare Pages — används som url.origin vid prerender (canonical, OG, mailto). */
const siteOrigin = process.env.PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://galleriett-tjorn.pages.dev';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			prerender: {
				origin: siteOrigin
			}
		})
	]
});
