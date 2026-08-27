import { error } from '@sveltejs/kit';
import { fetchArtistPage } from '$lib/sanity/artists';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const page = await fetchArtistPage(params.slug);
	if (!page) throw error(404, 'Konstnären hittades inte');
	return page;
}
