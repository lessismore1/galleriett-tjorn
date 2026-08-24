import { redirect } from '@sveltejs/kit';
import { fetchArchiveYears } from '$lib/sanity/exhibitions';

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	const years = await fetchArchiveYears();
	return years.map((year) => ({ year: String(year) }));
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const year = Number(params.year);
	const target = Number.isFinite(year)
		? `/utstallningar/tidigare/${year}`
		: '/utstallningar/tidigare';
	throw redirect(301, target);
}

export const prerender = true;
