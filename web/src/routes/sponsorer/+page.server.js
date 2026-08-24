import { fetchSponsors } from '$lib/sanity/site';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return { sponsors: await fetchSponsors() };
}

export const prerender = true;
