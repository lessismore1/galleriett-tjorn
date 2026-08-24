import { getSanityClient, urlForWebp } from '$lib/sanity';

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

	if (!row) return null;

	const addressLines = String(row.address || '')
		.split('\n')
		.map((s) => s.trim())
		.filter(Boolean);

	return {
		name: row.siteName || 'GALLERIett',
		tagline: row.tagline || '',
		email: row.email || '',
		phone: row.phone || '',
		hours: row.openingHours || '',
		address: {
			street: addressLines[0] || '',
			postal: addressLines.slice(1).join(', ') || ''
		},
		social: {
			instagram: row.instagramUrl || null,
			facebook: row.facebookUrl || null
		},
		about: {
			label: 'Om GALLERIett',
			headline: 'Ett galleri för samtidskonst på Tjörn',
			body: row.about || '',
			image: urlForWebp(row.aboutImage, 1400) || '/images/about-building.jpg'
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

/** Daglig rotation — samma logik som mock. */
export function rotateSponsors(list, date = new Date()) {
	if (!list?.length) return [];
	const start = date.getDate() % list.length;
	return [...list.slice(start), ...list.slice(0, start)];
}
