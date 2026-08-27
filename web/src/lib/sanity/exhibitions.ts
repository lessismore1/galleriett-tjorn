import { getSanityClient, urlForWebp } from '$lib/sanity';
import { workHref } from '$lib/workLinks.js';
import { formatVideoDate, videoCardArtists, videoCardTitle } from '$lib/sanity/videos';

function exhibitionYear(start) {
	return Number(String(start || '').slice(0, 4));
}

/**
 * Status från datum, om manuell override saknas.
 * Matchar Studio-hjälptexten: lämna status tom — beräkna från start/end.
 * @param {{ status?: string | null, start?: string | null, end?: string | null }} ex
 * @param {string} [today] YYYY-MM-DD
 * @returns {'ongoing' | 'upcoming' | 'past'}
 */
export function resolveExhibitionStatus(ex, today = new Date().toISOString().slice(0, 10)) {
	const override = ex?.status;
	if (override === 'ongoing' || override === 'upcoming' || override === 'past') {
		return override;
	}
	const start = ex?.start || '';
	const end = ex?.end || start;
	if (start && end && today >= start && today <= end) return 'ongoing';
	if (start && today < start) return 'upcoming';
	return 'past';
}

function mapListItem(ex) {
	const status = resolveExhibitionStatus(ex);
	return {
		id: ex.id,
		slug: ex.slug,
		artist: ex.artistLabel || '',
		title: ex.title,
		datesLabel: ex.datesLabel || '',
		status,
		/** Affisch/hero — används i utställningslistor (som live-sajten). */
		image: urlForWebp(ex.image, 1000),
		/** Valfri kortbild — t.ex. startsidans aktuellt-kort. */
		cardImage: urlForWebp(ex.cardImage, 1000) || undefined,
		intro: ex.intro || null,
		start: ex.start
	};
}

const listProjection = `{
  "id": idNumber,
  title,
  "slug": slug.current,
  artistLabel,
  status,
  start,
  end,
  datesLabel,
  intro,
  image,
  cardImage
}`;

export async function fetchPastYears() {
	const client = getSanityClient();
	const rows = await client.fetch(`*[_type == "exhibition" && defined(start)]{ status, start, end }`);
	const past = (rows || []).filter((e) => resolveExhibitionStatus(e) === 'past');
	return [...new Set(past.map((e) => exhibitionYear(e.start)).filter(Boolean))].sort((a, b) => b - a);
}

export async function fetchArchiveYears() {
	const current = new Date().getFullYear();
	return (await fetchPastYears()).filter((y) => y < current);
}

export async function fetchCurrentExhibitions() {
	const client = getSanityClient();
	const rows = await client.fetch(`
    *[_type == "exhibition"] ${listProjection}
    | order(start asc)
  `);
	return (rows || [])
		.map(mapListItem)
		.filter((e) => e.status === 'ongoing' || e.status === 'upcoming')
		.sort((a, b) => {
			if (a.status !== b.status) return a.status === 'ongoing' ? -1 : 1;
			return String(a.start || '').localeCompare(String(b.start || ''));
		});
}

export async function fetchPastExhibitions(year = null) {
	const client = getSanityClient();
	const rows = await client.fetch(`
    *[_type == "exhibition"]
    | order(start desc)
    ${listProjection}
  `);
	let list = (rows || []).map(mapListItem).filter((e) => e.status === 'past');
	if (year != null) {
		list = list.filter((e) => exhibitionYear(e.start) === year);
	}
	return list;
}

export async function fetchExhibitionSlugs() {
	const client = getSanityClient();
	return client.fetch(`*[_type == "exhibition" && defined(slug.current)].slug.current`);
}

const detailQuery = `*[_type == "exhibition" && slug.current == $slug][0]{
  "id": idNumber,
  title,
  "slug": slug.current,
  artistLabel,
  status,
  start,
  end,
  datesLabel,
  intro,
  pressRelease,
  facebookEventUrl,
  sources[]{ label, url },
  image,
  cardImage,
  "location": location->name,
  "artistSlugs": artists[]->slug.current,
  "related": artists[]->{
    "slug": slug.current,
    name,
    specialty,
    profileKind,
    deceased,
    kmhSlug,
    image
  },
  "works": works[]->{
    title,
    year,
    medium,
    dimensions,
    "slug": slug.current,
    image,
    "artistSlug": artist->slug.current
  },
  "installationViews": installationViews[]{ image, caption, alt },
  "videos": *[_type == "video" && references(^._id)] | order(publishedAt asc){
    title,
    url,
    description,
    publishedAt,
    thumbnail,
    "artistNames": artists[]->name,
    "artistLabel": ^.artistLabel,
    "exhibitionTitle": ^.title
  }
}`;

export async function fetchExhibitionPage(slug) {
	const client = getSanityClient();
	const [raw, all] = await Promise.all([
		client.fetch(detailQuery, { slug }),
		client.fetch(
			`*[_type == "exhibition"] | order(idNumber desc){
        "id": idNumber,
        title,
        "slug": slug.current,
        artistLabel
      }`
		)
	]);
	if (!raw) return null;

	const exhibition = {
		id: raw.id,
		slug: raw.slug,
		title: raw.title,
		artist: raw.artistLabel || '',
		artistSlug: raw.artistSlugs?.[0] || null,
		artistSlugs: raw.artistSlugs || [],
		status: resolveExhibitionStatus(raw),
		start: raw.start,
		end: raw.end,
		datesLabel: raw.datesLabel || '',
		intro: raw.intro || '',
		pressRelease: raw.pressRelease || '',
		facebookEventUrl: raw.facebookEventUrl || '',
		sources: (raw.sources || []).filter((s) => s?.url),
		location: raw.location || 'GALLERIett, Tjörn',
		image: urlForWebp(raw.image, 1400),
		cardImage: urlForWebp(raw.cardImage, 1000),
		installationViews: (raw.installationViews || [])
			.map((row) => ({
				src: urlForWebp(row?.image ?? row, 1200),
				caption: row?.caption || '',
				alt: row?.alt || row?.caption || 'Installation'
			}))
			.filter((v) => v.src),
		videos: (raw.videos || [])
			.filter((v) => v?.url)
			.map((v) => ({
				title: videoCardTitle({
					title: v.title,
					exhibitionTitle: v.exhibitionTitle || raw.title
				}),
				url: v.url,
				description: v.description || '',
				publishedAt: v.publishedAt || null,
				dateLabel: formatVideoDate(v.publishedAt),
				artists: videoCardArtists({
					artistNames: v.artistNames,
					artistLabel: v.artistLabel || raw.artistLabel
				}),
				thumbnail: urlForWebp(v.thumbnail, 800)
			})),
		works: (raw.works || []).map((w) => ({
			title: w.title,
			year: w.year,
			medium: w.medium,
			dimensions: w.dimensions,
			image: urlForWebp(w.image, 1000),
			href:
				w.artistSlug && w.slug
					? workHref(w.artistSlug, { slug: w.slug }, { show: raw.slug })
					: null
		}))
	};

	const related = (raw.related || [])
		.filter((a) => a?.slug)
		.map((a) => ({
			slug: a.slug,
			name: a.name,
			specialty: a.specialty || '',
			profileKind: a.profileKind || 'stub',
			deceased: Boolean(a.deceased),
			kmhUrl: a.kmhSlug
				? `https://konstmedhorisont.se/ar/2026/konstnarer/${a.kmhSlug}`
				: null,
			image: urlForWebp(a.image, 600),
			program: null
		}))
		.sort((a, b) => a.name.localeCompare(b.name, 'sv'));

	const list = all || [];
	const index = list.findIndex((e) => e.slug === slug);
	const prevRaw = index >= 0 ? list[index + 1] : null;
	const nextRaw = index >= 0 ? list[index - 1] : null;
	const mapNav = (e) =>
		e
			? {
					id: e.id,
					slug: e.slug,
					title: e.title,
					artist: e.artistLabel || ''
				}
			: null;

	return {
		exhibition,
		related,
		prev: mapNav(prevRaw),
		next: mapNav(nextRaw)
	};
}
