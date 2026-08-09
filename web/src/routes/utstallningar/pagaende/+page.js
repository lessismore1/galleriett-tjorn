import {
	getOngoingExhibitions,
	getArchiveYears
} from '$lib/data/mockData.js';

/** @type {import('./$types').PageLoad} */
export function load() {
	const list = getOngoingExhibitions();
	return {
		filter: /** @type {const} */ ('ongoing'),
		list,
		archiveYears: getArchiveYears(),
		archiveYear: null,
		emptyLabel: 'Inga pågående utställningar.',
		seo: {
			title: 'Pågående utställningar · GALLERIett',
			description:
				'Pågående utställningar på GALLERIett, Tjörn. Se vad som visas just nu i galleriet.',
			image: list[0]?.image ?? null
		}
	};
}

export const prerender = true;
