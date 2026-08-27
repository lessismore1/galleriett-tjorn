import { error } from '@sveltejs/kit';
import { fetchEventPage } from '$lib/sanity/events';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const event = await fetchEventPage(params.slug);
	if (!event) throw error(404, 'Evenemanget hittades inte');
	return { event };
}
