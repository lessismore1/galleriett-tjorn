import { error, redirect } from '@sveltejs/kit';
import { getNewsArticle, artists } from '$lib/data/mockData.js';

export function load({ params }) {
	// Gammal slug efter omnumrering Kattis 101 → 103
	if (params.slug === '101-kattis-palmnas-galleri-bagges-torg') {
		throw redirect(301, '/nyheter/103-kattis-palmnas-galleri-bagges-torg');
	}

	const article = getNewsArticle(params.slug);
	if (!article) throw error(404, 'Nyheten hittades inte');

	const relatedSlugs = article.artistSlugs?.length
		? article.artistSlugs
		: article.artistSlug
			? [article.artistSlug]
			: [];

	const relatedArtists = relatedSlugs
		.map((slug) => artists.find((a) => a.slug === slug))
		.filter(Boolean);

	return { article, relatedArtists };
}
