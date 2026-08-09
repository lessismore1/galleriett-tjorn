import { error } from '@sveltejs/kit';
import { getNewsArticle, artists } from '$lib/data/mockData.js';

export function load({ params }) {
	const article = getNewsArticle(params.slug);
	if (!article) throw error(404, 'Nyheten hittades inte');

	const artist = article.artistSlug
		? artists.find((a) => a.slug === article.artistSlug) ?? null
		: null;

	return { article, artist };
}
