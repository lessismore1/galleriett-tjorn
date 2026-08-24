import { error, redirect } from '@sveltejs/kit';
import { fetchClickableNewsSlugs, fetchNewsArticle } from '$lib/sanity/articles';
import { getSanityClient, urlForWebp } from '$lib/sanity';

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	const slugs = await fetchClickableNewsSlugs();
	return (slugs || []).map((slug) => ({ slug }));
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	// Gammal slug efter omnumrering Kattis 101 → 103
	if (params.slug === '101-kattis-palmnas-galleri-bagges-torg') {
		throw redirect(301, '/nyheter/103-kattis-palmnas-galleri-bagges-torg');
	}

	const article = await fetchNewsArticle(params.slug);
	if (!article) throw error(404, 'Nyheten hittades inte');

	const client = getSanityClient();
	const relatedArtists = await client.fetch(
		`*[_type == "artist" && slug.current in $slugs] | order(name asc){
      "slug": slug.current,
      name,
      specialty,
      image
    }`,
		{ slugs: article.artistSlugs || [] }
	);

	return {
		article,
		relatedArtists: (relatedArtists || []).map((a) => ({
			slug: a.slug,
			name: a.name,
			specialty: a.specialty || '',
			image: urlForWebp(a.image, 600),
			program: null
		}))
	};
}

export const prerender = true;
