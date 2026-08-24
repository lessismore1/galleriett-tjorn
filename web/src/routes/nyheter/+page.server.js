import { fetchNewsIndex } from '$lib/sanity/articles';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const list = await fetchNewsIndex();
	return { list };
}

export const prerender = true;
