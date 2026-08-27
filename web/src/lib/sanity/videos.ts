import { getSanityClient, urlForWebp } from '$lib/sanity';

const MONTHS_SV = [
	'JANUARI',
	'FEBRUARI',
	'MARS',
	'APRIL',
	'MAJ',
	'JUNI',
	'JULI',
	'AUGUSTI',
	'SEPTEMBER',
	'OKTOBER',
	'NOVEMBER',
	'DECEMBER'
];

/** @param {string | null | undefined} iso */
export function formatVideoDate(iso) {
	if (!iso) return '';
	const d = new Date(`${String(iso).slice(0, 10)}T12:00:00`);
	if (Number.isNaN(d.getTime())) return '';
	return `${d.getDate()} ${MONTHS_SV[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Rubrik för kort: utställningstitel om den finns, annars video.title utan "— video".
 * @param {{ title?: string | null; exhibitionTitle?: string | null }} v
 */
export function videoCardTitle(v) {
	const ex = v.exhibitionTitle?.trim();
	if (ex) return ex;
	return String(v.title || 'Video')
		.replace(/\s*[—–-]\s*video(\s*\d+)?$/i, '')
		.trim() || 'Video';
}

/**
 * Konstnärrad: namngivna artister, annars exhibition.artistLabel (ej TKS-gruppen).
 * @param {{ artistNames?: string[]; artistLabel?: string | null }} v
 */
export function videoCardArtists(v) {
	const names = (v.artistNames || []).map((n) => String(n).trim()).filter(Boolean);
	if (names.length) return names.join(' · ');
	const label = v.artistLabel?.trim() || '';
	if (!label || /tks-medlemmar/i.test(label)) return '';
	return label.replace(/\s*·\s*/g, ' · ');
}

const videosIndexQuery = `*[_type == "video" && defined(url)] | order(publishedAt desc) {
  title,
  url,
  description,
  publishedAt,
  thumbnail,
  "artistNames": artists[]->name,
  "artistLabel": exhibition->artistLabel,
  "exhibitionTitle": exhibition->title,
  "exhibitionSlug": exhibition->slug.current
}`;

/** Videolista för /video */
export async function fetchVideosForIndex() {
	const client = getSanityClient();
	const rows = await client.fetch(videosIndexQuery);

	return (rows || [])
		.filter((v) => v?.url)
		.map((v) => {
			const artistNames = (v.artistNames || []).filter(Boolean);
			const artists = videoCardArtists({
				artistNames,
				artistLabel: v.artistLabel
			});
			return {
				title: videoCardTitle({
					title: v.title,
					exhibitionTitle: v.exhibitionTitle
				}),
				url: v.url,
				description: v.description || '',
				publishedAt: v.publishedAt || null,
				dateLabel: formatVideoDate(v.publishedAt),
				artists,
				thumbnail: urlForWebp(v.thumbnail, 900),
				exhibitionSlug: v.exhibitionSlug || null
			};
		});
}
