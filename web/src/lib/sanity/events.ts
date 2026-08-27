import { getSanityClient, urlForWebp } from '$lib/sanity';

export const eventKindLabels = {
	vernissage: 'Vernissage',
	pub: 'Pub',
	'sip-paint': 'Zipp & Paint',
	samtal: 'Samtal',
	other: 'Övrigt'
};

const MONTHS_SV = [
	'januari',
	'februari',
	'mars',
	'april',
	'maj',
	'juni',
	'juli',
	'augusti',
	'september',
	'oktober',
	'november',
	'december'
];

/** @param {string | null | undefined} iso */
export function formatEventDateLabel(iso, datesLabel) {
	if (datesLabel?.trim()) return datesLabel.trim();
	if (!iso) return '';
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return '';
	const time = d.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
	const hasTime = !/T00:00/.test(iso) && time !== '00:00';
	const day = d.getDate();
	const month = MONTHS_SV[d.getMonth()];
	const year = d.getFullYear();
	return hasTime ? `${day} ${month} ${year} kl. ${time}` : `${day} ${month} ${year}`;
}

/** @param {string | null | undefined} iso @param {string} [today] */
export function isEventUpcoming(iso, today = new Date().toISOString().slice(0, 10)) {
	if (!iso) return false;
	return String(iso).slice(0, 10) >= today;
}

const eventCardFields = `
  title,
  "slug": slug.current,
  kind,
  date,
  datesLabel,
  price,
  capacity,
  bookingUrl,
  bookingMailto,
  body,
  image,
  "exhibitionImage": exhibition->image,
  "exhibitionTitle": exhibition->title,
  "exhibitionSlug": exhibition->slug.current,
  "artistNames": artists[]->name,
  "locationName": location->name
`;

function mapEvent(raw) {
	const kind = raw.kind || 'other';
	const imageSource = raw.image?.asset ? raw.image : raw.exhibitionImage;
	return {
		title: raw.title || 'Evenemang',
		slug: raw.slug,
		kind,
		kindLabel: eventKindLabels[kind] || eventKindLabels.other,
		date: raw.date || null,
		dateLabel: formatEventDateLabel(raw.date, raw.datesLabel),
		upcoming: isEventUpcoming(raw.date),
		price: raw.price || null,
		capacity: raw.capacity ?? null,
		bookingUrl: raw.bookingUrl || null,
		bookingMailto: raw.bookingMailto || null,
		body: raw.body || '',
		image: urlForWebp(imageSource, 1000),
		exhibitionTitle: raw.exhibitionTitle || null,
		exhibitionSlug: raw.exhibitionSlug || null,
		artists: (raw.artistNames || []).filter(Boolean),
		locationName: raw.locationName || 'GALLERIett'
	};
}

/** Lista för /evenemang — kommande först, sedan arkiv. */
export async function fetchEventsForIndex() {
	const client = getSanityClient();
	const rows = await client.fetch(
		`*[_type == "galleryEvent" && defined(slug.current)] | order(date asc) { ${eventCardFields} }`
	);
	const list = (rows || []).map(mapEvent);
	const upcoming = list.filter((e) => e.upcoming);
	const past = list.filter((e) => !e.upcoming).reverse();
	return { upcoming, past, list: [...upcoming, ...past] };
}

/** Detalj för /evenemang/{slug} */
export async function fetchEventPage(slug) {
	const client = getSanityClient();
	const raw = await client.fetch(
		`*[_type == "galleryEvent" && slug.current == $slug][0]{ ${eventCardFields} }`,
		{ slug }
	);
	if (!raw?.slug) return null;
	return mapEvent(raw);
}
