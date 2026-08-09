import { redirect } from '@sveltejs/kit';
import { getArchiveYears } from '$lib/data/mockData.js';

/** @type {import('./$types').PageLoad} */
export function load() {
	const years = getArchiveYears();
	if (years.length) {
		throw redirect(307, `/utstallningar/arkiv/${years[0]}`);
	}
	return {
		filter: /** @type {const} */ ('archive'),
		list: [],
		archiveYears: [],
		archiveYear: null,
		emptyLabel: 'Inga utställningar i arkivet ännu.',
		seo: {
			title: 'Utställningsarkiv · GALLERIett',
			description: 'Arkiv över tidigare utställningar på GALLERIett, Tjörn.',
			image: null
		}
	};
}

export const prerender = true;
