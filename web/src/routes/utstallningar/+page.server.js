import { fetchCurrentExhibitions, fetchPastYears } from '$lib/sanity/exhibitions';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const list = await fetchCurrentExhibitions();
	return {
		filter: /** @type {const} */ ('current'),
		list,
		pastYears: await fetchPastYears(),
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
