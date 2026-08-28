import type { RequestHandler } from './$types';
import { env as publicEnv } from '$env/dynamic/public';

/** Obs: Cloudflare kan lägga till rader (t.ex. AI Crawl Control) utöver denna fil. */

export const GET: RequestHandler = async ({ url }) => {
	const base = (publicEnv.PUBLIC_SITE_URL || url.origin).replace(/\/$/, '');
	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		`Sitemap: ${base}/sitemap.xml`
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400'
		}
	});
};
