import { getSanityClient, urlForWebp } from '$lib/sanity';

/** Fält som inte (ännu) finns i siteSettings — behålls som defaults. */
const SITE_DEFAULTS = {
	url: 'https://galleriett-tjorn.pages.dev',
	partners: [
		{ name: 'tjornkonst.se', url: 'https://tjornkonst.se' },
		{ name: 'konstmedhorisont.se', url: 'https://konstmedhorisont.se' },
		{ name: 'kustkonst.se', url: null },
		{ name: 'ronnang.se', url: 'https://ronnang.se' }
	],
	credit: {
		name: 'Ronny Carlansson',
		url: 'https://www.linkedin.com/in/ronnycarlansson/'
	},
	mapsUrl: 'https://maps.google.com/?q=Marinvägen+9,+Rönnäng'
};

export async function fetchSiteSettings() {
	const client = getSanityClient();
	const row = await client.fetch(`*[_id == "siteSettings"][0]{
    siteName,
    tagline,
    email,
    phone,
    address,
    openingHours,
    about,
    aboutImage,
    instagramUrl,
    facebookUrl
  }`);

	const addressLines = String(row?.address || '')
		.split('\n')
		.map((s) => s.trim())
		.filter(Boolean);

	return {
		name: row?.siteName || 'GALLERIett',
		tagline: row?.tagline || 'Ett galleri för samtidskonst på Tjörn',
		url: SITE_DEFAULTS.url,
		email: row?.email || 'info@galleriett-tjorn.se',
		phone: row?.phone || '+46 (0) 70-060 1006',
		hours: row?.openingHours || 'Ons – Sön 13–18 eller efter överenskommelse',
		address: {
			street: addressLines[0] || 'Marinvägen 9, Hall 1',
			postal: addressLines.slice(1).join(', ') || '471 41 Rönnäng (Stansvik)',
			region: 'Tjörn',
			country: 'Sverige'
		},
		social: {
			instagram: row?.instagramUrl || 'https://www.instagram.com/galleriett.tjorn',
			facebook: row?.facebookUrl || 'https://www.facebook.com/galleriett.tjorn'
		},
		partners: SITE_DEFAULTS.partners,
		credit: SITE_DEFAULTS.credit,
		mapsUrl: SITE_DEFAULTS.mapsUrl,
		about: {
			label: 'Om GALLERIett',
			headline: 'Ett galleri för samtidskonst på Tjörn',
			body: row?.about || '',
			image: urlForWebp(row?.aboutImage, 1400) || '/images/about-building.jpg'
		}
	};
}

export async function fetchSponsors() {
	const client = getSanityClient();
	const rows = await client.fetch(`
    *[_type == "sponsor"] | order(order asc) {
      name,
      "id": slug.current,
      logo,
      url
    }
  `);

	return (rows || []).map((s) => ({
		id: s.id,
		name: s.name,
		shortName: s.name,
		logo: urlForWebp(s.logo, 400) || '',
		url: s.url || null
	}));
}

/** Daglig rotation. */
export function rotateSponsors(list, date = new Date()) {
	if (!list?.length) return [];
	const start = date.getDate() % list.length;
	return [...list.slice(start), ...list.slice(0, start)];
}
