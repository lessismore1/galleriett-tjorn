import {
	getUpcomingExhibitions,
	getArchiveYears
} from '$lib/data/mockData.js';

/** @type {import('./$types').PageLoad} */
export function load() {
	const list = getUpcomingExhibitions();
	return {
		filter: /** @type {const} */ ('upcoming'),
		list,
		archiveYears: getArchiveYears(),
		archiveYear: null,
		emptyLabel: 'Inga kommande utställningar.',
		seo: {
			title: 'Kommande utställningar · GALLERIett',
			description:
				'Kommande utställningar på GALLERIett, Tjörn. Se vad som öppnar härnäst.',
			image: list[0]?.image ?? null
		}
	};
}

export const prerender = true;
