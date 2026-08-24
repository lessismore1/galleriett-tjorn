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

/**
 * Konstnärslista för /konstnarer — bild-URL:er som strängar (CDN).
 * @returns {Promise<Array<{
 *   slug: string,
 *   name: string,
 *   specialty: string,
 *   image: string,
 *   works: Array<{ title?: string, image: string }>,
 *   program: { status: 'ongoing' | 'upcoming', exhibition: { title: string, image: string, slug?: string, datesLabel?: string } } | null
 * }>>}
 */
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
