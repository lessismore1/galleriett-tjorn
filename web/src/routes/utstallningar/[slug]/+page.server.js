import { error, redirect } from '@sveltejs/kit';
import { fetchExhibitionPage } from '$lib/sanity/exhibitions';

const SLUG_REDIRECTS = {
	'104-ljus-farg-form': '101-ljus-farg-form'
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const next = SLUG_REDIRECTS[params.slug];
	if (next) throw redirect(301, `/utstallningar/${next}`);

	const page = await fetchExhibitionPage(params.slug);
	if (!page) throw error(404, 'Utställningen hittades inte');
	return page;
}
