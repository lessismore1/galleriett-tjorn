import { getSanityClient, urlForWebp } from '$lib/sanity';
import { workHref } from '$lib/workLinks.js';

function exhibitionYear(start) {
	return Number(String(start || '').slice(0, 4));
}

function mapListItem(ex) {
	return {
		id: ex.id,
		slug: ex.slug,
		artist: ex.artistLabel || '',
		title: ex.title,
		datesLabel: ex.datesLabel || '',
		status: ex.status || 'past',
		image: urlForWebp(ex.cardImage || ex.image, 1000),
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
  datesLabel,
  intro,
  image,
  cardImage
}`;

export async function fetchPastYears() {
	const client = getSanityClient();
	const starts = await client.fetch(
		`*[_type == "exhibition" && status != "ongoing" && status != "upcoming" && defined(start)].start`
	);
	return [...new Set((starts || []).map(exhibitionYear).filter(Boolean))].sort((a, b) => b - a);
}

export async function fetchArchiveYears() {
	const current = new Date().getFullYear();
	return (await fetchPastYears()).filter((y) => y < current);
}

export async function fetchCurrentExhibitions() {
	const client = getSanityClient();
	const rows = await client.fetch(`
    *[_type == "exhibition" && status in ["ongoing", "upcoming"]] ${listProjection}
    | order(select(status == "ongoing" => 0, 1) asc, start asc)
  `);
	return (rows || []).map(mapListItem);
}

export async function fetchPastExhibitions(year = null) {
	const client = getSanityClient();
	const rows = await client.fetch(`
    *[_type == "exhibition" && status != "ongoing" && status != "upcoming"] ${listProjection}
    | order(idNumber desc)
  `);
	let list = (rows || []).map(mapListItem);
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
  image,
  cardImage,
  "location": location->name,
  "artistSlugs": artists[]->slug.current,
  "related": artists[]->{
    "slug": slug.current,
    name,
    specialty,
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
  "installationViews": installationViews[].image
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
		status: raw.status,
		start: raw.start,
		end: raw.end,
		datesLabel: raw.datesLabel || '',
		intro: raw.intro || '',
		pressRelease: raw.pressRelease || '',
		facebookEventUrl: raw.facebookEventUrl || '',
		location: raw.location || 'GALLERIett, Tjörn',
		image: urlForWebp(raw.image, 1400),
		cardImage: urlForWebp(raw.cardImage, 1000),
		installationViews: (raw.installationViews || [])
			.map((img) => urlForWebp(img, 1200))
			.filter(Boolean),
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
			image: urlForWebp(a.image, 600),
			program: null
		}));

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
