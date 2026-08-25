import { error, redirect } from '@sveltejs/kit';
import { fetchArtistPage } from '$lib/sanity/artists';

const SLUG_REDIRECTS = {
	'09-robert-oldergaarden': '11-robert-oldergaarden',
	'10-kattis-palmnas': '12-kattis-palmnas'
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const next = SLUG_REDIRECTS[params.slug];
	if (next) throw redirect(301, `/konstnarer/${next}`);

	const page = await fetchArtistPage(params.slug);
	if (!page) throw error(404, 'Konstnären hittades inte');
	return page;
}
