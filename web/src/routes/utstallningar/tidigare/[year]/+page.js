import { error } from '@sveltejs/kit';
import { getPastYears, getPastExhibitions } from '$lib/data/mockData.js';

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return getPastYears().map((year) => ({ year: String(year) }));
}

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const year = Number(params.year);
	const pastYears = getPastYears();
	if (!Number.isFinite(year) || !pastYears.includes(year)) {
		error(404, 'År hittades inte');
	}

	const list = getPastExhibitions(year);
	return {
		filter: /** @type {const} */ ('past'),
		list,
		pastYears,
		pastYear: year,
		emptyLabel: `Inga tidigare utställningar från ${year}.`,
		seo: {
			title: `Tidigare utställningar ${year} · GALLERIett`,
			description: `Tidigare utställningar på GALLERIett, Tjörn — ${year}.`,
			image: list[0]?.image ?? null
		}
	};
}

export const prerender = true;
