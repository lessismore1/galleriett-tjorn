import { error } from '@sveltejs/kit';
import { env as publicEnv } from '$env/dynamic/public';
import { getSanityClient } from '$lib/sanity';
import type { RequestHandler } from './$types';

/**
 * Dynamisk sitemap från Sanity — samma idé som KmH (`sitemap.xml/+server.ts`),
 * men G1-URL:er (inte årsbundna `/ar/…`).
 */

type SlugRow = { slug: string };
type WorkRow = { artistSlug: string; workSlug: string };

const artistsQuery = `*[_type == "artist"
  && defined(slug.current)
  && !(slug.current match "*tks-medlemmar")
  && defined(image.asset)
  && (profileKind in ["full", "kmh", "historical"] || !defined(profileKind))
]{ "slug": slug.current }`;

const worksQuery = `*[_type == "artwork"
  && defined(slug.current)
  && defined(artist->slug.current)
  && !(artist->slug.current match "*tks-medlemmar")
  && defined(artist->image.asset)
  && (artist->profileKind in ["full", "kmh", "historical"] || !defined(artist->profileKind))
]{
  "artistSlug": artist->slug.current,
  "workSlug": slug.current
}`;

const exhibitionsQuery = `*[_type == "exhibition" && defined(slug.current)]{ "slug": slug.current }`;

const eventsQuery = `*[_type == "galleryEvent" && defined(slug.current)]{ "slug": slug.current }`;

const articlesQuery = `*[_type == "article" && clickable == true && defined(slug.current)]{ "slug": slug.current }`;

const pastYearsQuery = `*[_type == "exhibition" && defined(start)]{ status, start, end }`;

function escapeXml(s: string): string {
	return s
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function urlEntry(loc: string, priority: number, changefreq: string, lastmod: string): string {
	return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

function exhibitionYear(start: string | null | undefined): number {
	return Number(String(start || '').slice(0, 4)) || 0;
}

function resolvePast(ex: { status?: string; start?: string; end?: string }, today: string): boolean {
	if (ex.status === 'past') return true;
	if (ex.status === 'ongoing' || ex.status === 'upcoming') return false;
	const end = ex.end || ex.start;
	return Boolean(end && end < today);
}

export const GET: RequestHandler = async ({ url }) => {
	const base = (publicEnv.PUBLIC_SITE_URL || url.origin).replace(/\/$/, '');
	const today = new Date().toISOString().slice(0, 10);
	const client = getSanityClient();

	let artists: SlugRow[];
	let works: WorkRow[];
	let exhibitions: SlugRow[];
	let events: SlugRow[];
	let articles: SlugRow[];
	let yearRows: { status?: string; start?: string; end?: string }[];
	let showSponsors = false;

	try {
		[artists, works, exhibitions, events, articles, yearRows, showSponsors] = await Promise.all([
			client.fetch<SlugRow[]>(artistsQuery),
			client.fetch<WorkRow[]>(worksQuery),
			client.fetch<SlugRow[]>(exhibitionsQuery),
			client.fetch<SlugRow[]>(eventsQuery),
			client.fetch<SlugRow[]>(articlesQuery),
			client.fetch(pastYearsQuery),
			client
				.fetch<boolean | null>(`*[_id == "siteSettings"][0].showSponsors`)
				.then((v) => v === true)
		]);
	} catch (e) {
		console.error('sitemap.xml: Sanity fetch failed', e);
		throw error(500, 'Kunde inte generera sitemap');
	}

	const pastYears = [
		...new Set(
			(yearRows || [])
				.filter((e) => resolvePast(e, today))
				.map((e) => exhibitionYear(e.start))
				.filter(Boolean)
		)
	].sort((a, b) => b - a);

	const urls: string[] = [];
	const add = (path: string, priority: number, changefreq: string) => {
		urls.push(urlEntry(`${base}${path}`, priority, changefreq, today));
	};

	// Statiska indexerbara sidor (inga redirect-URL:er)
	add('/', 1, 'weekly');
	add('/konstnarer', 0.9, 'weekly');
	add('/utstallningar', 0.9, 'weekly');
	add('/evenemang', 0.8, 'weekly');
	add('/video', 0.6, 'weekly');
	add('/nyheter', 0.8, 'weekly');
	add('/om', 0.5, 'monthly');
	add('/kontakt', 0.5, 'monthly');
	if (showSponsors) add('/sponsorer', 0.4, 'monthly');

	for (const y of pastYears) {
		add(`/utstallningar/tidigare/${y}`, 0.7, 'monthly');
	}

	for (const { slug } of (exhibitions || []).filter((r) => r.slug).sort((a, b) => a.slug.localeCompare(b.slug))) {
		add(`/utstallningar/${slug}`, 0.8, 'weekly');
	}

	for (const { slug } of (artists || []).filter((r) => r.slug).sort((a, b) => a.slug.localeCompare(b.slug))) {
		add(`/konstnarer/${slug}`, 0.75, 'monthly');
	}

	for (const w of (works || [])
		.filter((r) => r.artistSlug && r.workSlug)
		.sort((a, b) => `${a.artistSlug}/${a.workSlug}`.localeCompare(`${b.artistSlug}/${b.workSlug}`))) {
		add(`/konstnarer/${w.artistSlug}/verk/${w.workSlug}`, 0.7, 'monthly');
	}

	for (const { slug } of (events || []).filter((r) => r.slug).sort((a, b) => a.slug.localeCompare(b.slug))) {
		add(`/evenemang/${slug}`, 0.65, 'weekly');
	}

	for (const { slug } of (articles || []).filter((r) => r.slug).sort((a, b) => a.slug.localeCompare(b.slug))) {
		add(`/nyheter/${slug}`, 0.6, 'monthly');
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600'
		}
	});
};
