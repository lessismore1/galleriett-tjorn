import { fetchVideosForIndex } from '$lib/sanity/videos';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const list = await fetchVideosForIndex();
	return { list };
}
