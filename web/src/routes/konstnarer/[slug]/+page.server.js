import { error } from '@sveltejs/kit';
import { fetchArtistPage, fetchArtistSlugs } from '$lib/sanity/artists';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const page = await fetchArtistPage(params.slug);
	if (!page) throw error(404, 'Konstnären hittades inte');
	return page;
}

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	const slugs = await fetchArtistSlugs();
	return (slugs || []).map((slug) => ({ slug }));
}

export const prerender = true;
