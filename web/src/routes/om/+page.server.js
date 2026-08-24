import { fetchSiteSettings } from '$lib/sanity/site';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const settings = await fetchSiteSettings();
	return {
		about: settings?.about ?? {
			label: 'Om GALLERIett',
			headline: 'Ett galleri för samtidskonst på Tjörn',
			body: '',
			image: '/images/about-building.jpg'
		},
		site: {
			email: settings?.email || '',
			hours: settings?.hours || '',
			address: settings?.address || { street: '', postal: '' }
		}
	};
}

export const prerender = true;
