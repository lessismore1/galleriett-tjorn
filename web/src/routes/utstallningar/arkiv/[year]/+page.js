import { error } from '@sveltejs/kit';
import {
	getArchiveYears,
	getArchiveExhibitions
} from '$lib/data/mockData.js';

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return getArchiveYears().map((year) => ({ year: String(year) }));
}

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const year = Number(params.year);
	const archiveYears = getArchiveYears();

	if (!Number.isFinite(year) || !archiveYears.includes(year)) {
		throw error(404, 'Arkivåret hittades inte');
	}

	const list = getArchiveExhibitions(year);

	return {
		filter: /** @type {const} */ ('archive'),
		list,
		archiveYears,
		archiveYear: year,
		emptyLabel: `Inga utställningar ${year}.`,
		seo: {
			title: `Utställningar ${year} · Arkiv · GALLERIett`,
			description: `Arkiv: utställningar på GALLERIett, Tjörn under ${year}.`,
			image: list[0]?.image ?? null
		}
	};
}

export const prerender = true;
