import { artists } from '$lib/data/mockData.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const artist = artists.find((a) => a.slug === params.slug);
	if (!artist) throw error(404, 'Konstnären hittades inte');
	return { artist };
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return artists.map((a) => ({ slug: a.slug }));
}

export const prerender = true;
