import { error } from '@sveltejs/kit';
import { fetchSiteSettings, fetchSponsors } from '$lib/sanity/site';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const settings = await fetchSiteSettings();
	if (!settings.showSponsors) throw error(404, 'Sidan är tillfälligt dold');
	return { sponsors: await fetchSponsors() };
}
