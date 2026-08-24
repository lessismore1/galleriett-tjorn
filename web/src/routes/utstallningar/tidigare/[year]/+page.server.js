import { error } from '@sveltejs/kit';
import { fetchPastYears, fetchPastExhibitions } from '$lib/sanity/exhibitions';

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	const years = await fetchPastYears();
	return years.map((year) => ({ year: String(year) }));
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const year = Number(params.year);
	const pastYears = await fetchPastYears();
	if (!Number.isFinite(year) || !pastYears.includes(year)) {
		error(404, 'År hittades inte');
	}

	const list = await fetchPastExhibitions(year);
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
