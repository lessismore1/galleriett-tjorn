import { getSanityClient, urlForWebp } from '$lib/sanity';

const artistsListQuery = `*[_type == "artist"] | order(name asc) {
  "slug": slug.current,
  name,
  specialty,
  image,
  "works": *[_type == "artwork" && references(^._id)] | order(idNumber asc)[0...1]{
    title,
    image
  },
  "programEx": *[_type == "exhibition" && status in ["ongoing", "upcoming"] && references(^._id)]
    | order(select(status == "ongoing" => 0, 1) asc, start asc)[0]{
      status,
      title,
      "slug": slug.current,
      image,
      datesLabel
    }
}`;

/** Konstnärslista för /konstnarer — bild-URL:er som strängar (CDN). */
export async function fetchArtistsForList() {
	const client = getSanityClient();
	const rows = await client.fetch(artistsListQuery);

	return (rows || []).map((a) => {
		const works = (a.works || [])
			.map((w) => ({
				title: w.title,
				image: urlForWebp(w.image, 900)
			}))
			.filter((w) => w.image);

		const program = a.programEx
			? {
					status: a.programEx.status,
					exhibition: {
						title: a.programEx.title,
						slug: a.programEx.slug,
						datesLabel: a.programEx.datesLabel,
						image: urlForWebp(a.programEx.image, 900)
					}
				}
			: null;

		return {
			slug: a.slug,
			name: a.name,
			specialty: a.specialty || '',
			image: urlForWebp(a.image, 600),
			works,
			program
		};
	});
}

export async function fetchArtistSlugs() {
	const client = getSanityClient();
	return client.fetch(`*[_type == "artist" && defined(slug.current)].slug.current`);
}

const artistPageQuery = `*[_type == "artist" && slug.current == $slug][0]{
  "slug": slug.current,
  name,
  specialty,
  born,
  education,
  intro,
  bio,
  image,
  heroImage,
  "press": pressQuotes[]{ quote, source, url },
  "works": *[_type == "artwork" && references(^._id)] | order(idNumber asc){
    "id": idNumber,
    title,
    "slug": slug.current,
    year,
    medium,
    dimensions,
    availability,
    story,
    image
  },
  "exhibitions": *[_type == "exhibition" && references(^._id)] | order(start desc){
    "id": idNumber,
    title,
    "slug": slug.current,
    status,
    start,
    end,
    datesLabel,
    intro,
    image,
    "venue": location->name
  }
}`;

/** Konstnärssida: artist + verk + utställningar + nästa konstnär. */
export async function fetchArtistPage(slug) {
	const client = getSanityClient();
	const [raw, allSlugs] = await Promise.all([
		client.fetch(artistPageQuery, { slug }),
		client.fetch(
			`*[_type == "artist" && defined(slug.current)] | order(name asc){
        "slug": slug.current,
        name,
        specialty,
        image,
        heroImage,
        "firstWork": *[_type == "artwork" && references(^._id)] | order(idNumber asc)[0]{ title, image }
      }`
		)
	]);

	if (!raw) return null;

	const artist = {
		slug: raw.slug,
		name: raw.name,
		specialty: raw.specialty || '',
		born: raw.born || '',
		education: raw.education || [],
		intro: raw.intro || '',
		bio: raw.bio || '',
		image: urlForWebp(raw.image, 900),
		heroImage: urlForWebp(raw.heroImage, 1400),
		press: raw.press || [],
		works: (raw.works || []).map((w) => ({
			id: w.id,
			title: w.title,
			slug: w.slug,
			year: w.year,
			medium: w.medium,
			dimensions: w.dimensions,
			availability: w.availability,
			story: w.story,
			image: urlForWebp(w.image, 1000)
		})),
		website: null,
		lives: null,
		representedIn: []
	};

	const exhibitionRows = (raw.exhibitions || []).map((ex) => {
		const status = ex.status ?? null;
		const current = status === 'ongoing' || status === 'upcoming';
		const year = ex.start ? Number(String(ex.start).slice(0, 4)) : null;
		return {
			year,
			title: ex.id ? `${ex.id} · ${ex.title}` : ex.title,
			cardTitle: ex.title,
			venue: ex.venue || 'GALLERIett, Tjörn',
			datesLabel: ex.datesLabel || (year != null ? String(year) : ''),
			href: ex.slug ? `/utstallningar/${ex.slug}` : null,
			image: urlForWebp(ex.image, 900) || artist.image || null,
			status,
			intro: ex.intro || null,
			current
		};
	});

	const list = allSlugs || [];
	const i = list.findIndex((a) => a.slug === slug);
	const nextRaw = list.length ? list[(Math.max(i, 0) + 1) % list.length] : null;
	const next = nextRaw
		? {
				slug: nextRaw.slug,
				name: nextRaw.name,
				specialty: nextRaw.specialty || '',
				image: urlForWebp(nextRaw.image, 600),
				heroImage: urlForWebp(nextRaw.heroImage, 900),
				works: nextRaw.firstWork
					? [
							{
								title: nextRaw.firstWork.title,
								image: urlForWebp(nextRaw.firstWork.image, 600)
							}
						]
					: []
			}
		: null;

	return { artist, exhibitionRows, next };
}
