import { redirect } from '@sveltejs/kit';
import { fetchPastYears } from '$lib/sanity/exhibitions';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const years = await fetchPastYears();
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
