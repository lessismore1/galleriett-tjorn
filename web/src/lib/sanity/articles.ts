import { getSanityClient, urlForWebp } from '$lib/sanity';

function categoryFromKind(kind) {
	return kind === 'press' ? 'I pressen' : 'Från GALLERIett';
}

function mapArticle(row) {
	const kind = row.kind === 'press' ? 'press' : 'gallery';
	return {
		slug: row.slug,
		kind,
		category: categoryFromKind(kind),
		title: row.title,
		date: row.publishedAt,
		dateLabel: row.dateLabel || row.publishedAt || '',
		excerpt: row.excerpt || '',
		body: row.body || '',
		image: urlForWebp(row.image, 1200),
		thumb: urlForWebp(row.thumb || row.image, 600),
		clickable: Boolean(row.clickable),
		source: row.source?.url ? { name: row.source.name, url: row.source.url } : null,
		artistSlug: row.artistSlugs?.[0] || null,
		artistSlugs: row.artistSlugs || [],
		exhibitionSlug: row.exhibitionSlug || null
	};
}

const articleProjection = `{
  title,
  "slug": slug.current,
  kind,
  publishedAt,
  dateLabel,
  excerpt,
  body,
  image,
  thumb,
  clickable,
  source,
  "artistSlugs": artists[]->slug.current,
  "exhibitionSlug": exhibition->slug.current
}`;

export async function fetchNewsIndex() {
	const client = getSanityClient();
	const rows = await client.fetch(
		`*[_type == "article"] | order(publishedAt desc) ${articleProjection}`
	);
	return (rows || []).map(mapArticle);
}

export async function fetchNewsArticle(slug) {
	const client = getSanityClient();
	const row = await client.fetch(
		`*[_type == "article" && slug.current == $slug && clickable == true][0] ${articleProjection}`,
		{ slug }
	);
	return row ? mapArticle(row) : null;
}

export async function fetchClickableNewsSlugs() {
	const client = getSanityClient();
	return client.fetch(
		`*[_type == "article" && clickable == true && defined(slug.current)].slug.current`
	);
}

export async function fetchArtistArticles(artistSlug) {
	const list = await fetchNewsIndex();
	return list.filter(
		(n) =>
			n.clickable &&
			(n.artistSlug === artistSlug || n.artistSlugs?.includes(artistSlug))
	);
}
