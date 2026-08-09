import {
	getYearExhibitions,
	getArchiveYears,
	getCurrentExhibitionYear
} from '$lib/data/mockData.js';

/** @type {import('./$types').PageLoad} */
export function load() {
	const year = getCurrentExhibitionYear();
	const list = getYearExhibitions(year);
	return {
		filter: /** @type {const} */ ('year'),
		list,
		archiveYears: getArchiveYears(),
		archiveYear: null,
		emptyLabel: 'Inga utställningar i år.',
		seo: {
			title: `Utställningar ${year} · GALLERIett`,
			description: `Årets utställningar på GALLERIett, Tjörn — ${year}. Pågående, kommande och genomförda utställningar under året.`,
			image: list[0]?.image ?? null
		}
	};
}

export const prerender = true;
