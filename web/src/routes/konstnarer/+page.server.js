import { fetchArtistsForList } from '$lib/sanity/artists';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const artists = await fetchArtistsForList();
	return { artists };
}

export const prerender = true;
