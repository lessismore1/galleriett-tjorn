import { fetchSiteSettings } from '$lib/sanity/site';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const settings = await fetchSiteSettings();
	return {
		site: {
			email: settings?.email || '',
			phone: settings?.phone || '',
			hours: settings?.hours || '',
			address: settings?.address || { street: '', postal: '' },
			mapsUrl: 'https://maps.google.com/?q=Marinvägen+9,+Rönnäng'
		}
	};
}
