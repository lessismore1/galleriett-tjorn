import { getSanityClient, urlForWebp } from '$lib/sanity';

/**
 * Alla verk-rutter för prerender.
 * @returns {Promise<Array<{ slug: string, workSlug: string }>>}
 */
export async function fetchAllWorkEntries() {
	const client = getSanityClient();
	return client.fetch(`
    *[_type == "artwork" && defined(slug.current) && defined(artist->slug.current)]{
      "slug": artist->slug.current,
      "workSlug": slug.current
    }
  `);
}

const workPageQuery = `*[_type == "artwork" && slug.current == $workSlug && artist->slug.current == $artistSlug][0]{
  _id,
  "id": idNumber,
  title,
  "slug": slug.current,
  year,
  medium,
  dimensions,
  availability,
  story,
  image,
  "artist": artist->{
    "slug": slug.current,
    name,
    specialty,
    image
  },
  "siblingWorks": *[_type == "artwork" && references(^.artist._ref)] | order(idNumber asc){
    "id": idNumber,
    title,
    "slug": slug.current,
    year,
    medium,
    dimensions,
    image
  },
  "featuredIn": *[_type == "exhibition" && references(^._id)] | order(start desc){
    title,
    "slug": slug.current,
    status,
    datesLabel,
    start,
    image
  }
}`;

/**
 * Verk-sida: verk + konstnär + prev/next bland konstnärens verk + featuredIn.
 */
export async function fetchWorkPage(artistSlug, workSlug) {
	const client = getSanityClient();
	const raw = await client.fetch(workPageQuery, { artistSlug, workSlug });
	if (!raw?.artist) return null;

	const mapWork = (w) => ({
		id: w.id,
		title: w.title,
		slug: w.slug,
		year: w.year,
		medium: w.medium,
		dimensions: w.dimensions,
		availability: w.availability,
		story: w.story,
		image: urlForWebp(w.image, 1400)
	});

	const works = (raw.siblingWorks || []).map(mapWork);
	const work = mapWork(raw);
	const index = works.findIndex((w) => w.slug === work.slug);
	const prev = works[(index - 1 + works.length) % works.length];
	const next = works[(index + 1) % works.length];

	const artist = {
		slug: raw.artist.slug,
		name: raw.artist.name,
		specialty: raw.artist.specialty || '',
		image: urlForWebp(raw.artist.image, 600),
		works
	};

	const featuredIn = (raw.featuredIn || []).map((ex) => ({
		title: ex.title,
		slug: ex.slug,
		status: ex.status,
		datesLabel: ex.datesLabel,
		start: ex.start,
		image: urlForWebp(ex.image, 800)
	}));

	return {
		artist,
		work,
		prev,
		next,
		index: Math.max(index, 0),
		total: works.length,
		featuredIn
	};
}
