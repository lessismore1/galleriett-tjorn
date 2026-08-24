import { error } from '@sveltejs/kit';
import { fetchWorkPage } from '$lib/sanity/artworks';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const page = await fetchWorkPage(params.slug, params.workSlug);
	if (!page) throw error(404, 'Verket hittades inte');
	return page;
}
