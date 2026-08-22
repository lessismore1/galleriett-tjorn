import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load() {
	throw redirect(301, '/utstallningar');
}

export const prerender = true;
