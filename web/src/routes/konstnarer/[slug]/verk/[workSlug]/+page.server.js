import { error } from '@sveltejs/kit';
import { fetchAllWorkEntries, fetchWorkPage } from '$lib/sanity/artworks';

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	return fetchAllWorkEntries();
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const page = await fetchWorkPage(params.slug, params.workSlug);
	if (!page) throw error(404, 'Verket hittades inte');
	return page;
}

export const prerender = true;
