import { error } from '@sveltejs/kit';
import { fetchExhibitionPage } from '$lib/sanity/exhibitions';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const page = await fetchExhibitionPage(params.slug);
	if (!page) throw error(404, 'Utställningen hittades inte');
	return page;
}
