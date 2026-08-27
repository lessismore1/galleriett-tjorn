import { fetchEventsForIndex } from '$lib/sanity/events';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return fetchEventsForIndex();
}
