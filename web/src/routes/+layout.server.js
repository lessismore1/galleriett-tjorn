import { fetchSiteSettings } from '$lib/sanity/site';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	const site = await fetchSiteSettings();
	return { site };
}
