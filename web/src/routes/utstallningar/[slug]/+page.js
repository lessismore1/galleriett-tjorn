import { exhibitions, artists } from '$lib/data/mockData.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const exhibition = exhibitions.find((e) => e.slug === params.slug);
	if (!exhibition) throw error(404, 'Utställningen hittades inte');

	const related = artists.filter((a) => a.slug === exhibition.artistSlug).slice(0, 4);
	const index = exhibitions.findIndex((e) => e.slug === params.slug);
	const prev = exhibitions[index + 1] ?? null;
	const next = exhibitions[index - 1] ?? null;

	return { exhibition, related, prev, next };
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return exhibitions.map((e) => ({ slug: e.slug }));
}

export const prerender = true;
