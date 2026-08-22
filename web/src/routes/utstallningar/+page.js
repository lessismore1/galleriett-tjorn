import { getCurrentExhibitions, getPastYears } from '$lib/data/mockData.js';

/** @type {import('./$types').PageLoad} */
export function load() {
	const list = getCurrentExhibitions();
	return {
		filter: /** @type {const} */ ('current'),
		list,
		pastYears: getPastYears(),
		pastYear: null,
		emptyLabel: 'Inga aktuella utställningar just nu.',
		seo: {
			title: 'Utställningar · GALLERIett',
			description:
				'Aktuella utställningar på GALLERIett, Tjörn — pågående och kommande i galleriet.',
			image: list[0]?.image ?? null
		}
	};
}

export const prerender = true;
