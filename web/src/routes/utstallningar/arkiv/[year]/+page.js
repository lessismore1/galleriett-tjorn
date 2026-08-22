import { redirect } from '@sveltejs/kit';
import { getArchiveYears } from '$lib/data/mockData.js';

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return getArchiveYears().map((year) => ({ year: String(year) }));
}

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const year = Number(params.year);
	const target = Number.isFinite(year)
		? `/utstallningar/tidigare/${year}`
		: '/utstallningar/tidigare';
	throw redirect(301, target);
}

export const prerender = true;
