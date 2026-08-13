import { getArtistWork, getAllWorkEntries, getExhibitionsFeaturingImage } from '$lib/data/mockData.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return getAllWorkEntries();
}

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const found = getArtistWork(params.slug, params.workSlug);
	if (!found) throw error(404, 'Verket hittades inte');

	const { artist, work } = found;
	const works = artist.works ?? [];
	const index = works.findIndex((w) => w.slug === work.slug);
	const prev = works[(index - 1 + works.length) % works.length];
	const next = works[(index + 1) % works.length];
	const featuredIn = getExhibitionsFeaturingImage(work.image);

	return {
		artist,
		work,
		prev,
		next,
		index,
		total: works.length,
		featuredIn
	};
}

export const prerender = true;
