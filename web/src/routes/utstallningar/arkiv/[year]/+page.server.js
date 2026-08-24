import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const year = Number(params.year);
	const target = Number.isFinite(year)
		? `/utstallningar/tidigare/${year}`
		: '/utstallningar/tidigare';
	throw redirect(301, target);
}
