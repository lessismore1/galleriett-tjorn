import { redirect } from '@sveltejs/kit';
import { getPastYears } from '$lib/data/mockData.js';

/** @type {import('./$types').PageLoad} */
export function load() {
	const years = getPastYears();
	if (years.length) {
		throw redirect(307, `/utstallningar/tidigare/${years[0]}`);
	}
	return {
		filter: /** @type {const} */ ('past'),
		list: [],
		pastYears: [],
		pastYear: null,
		emptyLabel: 'Inga tidigare utställningar i arkivet ännu.',
		seo: {
			title: 'Tidigare utställningar · GALLERIett',
			description: 'Tidigare utställningar på GALLERIett, Tjörn.',
			image: null
		}
	};
}

export const prerender = true;
