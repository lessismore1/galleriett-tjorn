import { exhibitions, artists } from '$lib/data/mockData.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const exhibition = exhibitions.find((e) => e.slug === params.slug);
	if (!exhibition) throw error(404, 'Utställningen hittades inte');

	const relatedSlugs = exhibition.artistSlugs?.length
		? exhibition.artistSlugs
		: exhibition.artistSlug
			? [exhibition.artistSlug]
			: [];
	const related = relatedSlugs
		.map((slug) => artists.find((a) => a.slug === slug))
		.filter((a) => Boolean(a));
	/** @type {NonNullable<(typeof artists)[number]>[]} */
	const relatedArtists = /** @type {any} */ (related);
	const index = exhibitions.findIndex((e) => e.slug === params.slug);
	const prev = exhibitions[index + 1] ?? null;
	const next = exhibitions[index - 1] ?? null;

	return { exhibition, related: relatedArtists, prev, next };
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return exhibitions.map((e) => ({ slug: e.slug }));
}

export const prerender = true;
