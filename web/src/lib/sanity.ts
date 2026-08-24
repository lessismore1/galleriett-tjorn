import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const projectId = publicEnv.PUBLIC_SANITY_PROJECT_ID || '81lb9elz';
const dataset = publicEnv.PUBLIC_SANITY_DATASET || 'production';

function getReadToken(): string | undefined {
	// `$env/dynamic/private` — .env lokalt, platform.env på Cloudflare Pages
	return env.SANITY_API_READ_TOKEN || undefined;
}

/**
 * Server-only Sanity client (SSR on Cloudflare / local).
 * Private datasets need SANITY_API_READ_TOKEN (Viewer). Public production can omit it.
 */
export function getSanityClient(): SanityClient {
	const token = getReadToken();
	// development is private — require token. production is public — token optional.
	if (!token && dataset !== 'production') {
		throw new Error(
			'SANITY_API_READ_TOKEN saknas. Lokalt: web/.env. Cloudflare: Variables and secrets (runtime).'
		);
	}
	return createClient({
		projectId,
		dataset,
		apiVersion: '2025-01-01',
		token,
		useCdn: !token
	});
}

const builder = createImageUrlBuilder({ projectId, dataset });

/** Sanity image → URL-builder. */
export function urlFor(source: unknown) {
	return builder.image(source as Parameters<typeof builder.image>[0]);
}

export function sanityImageSource(source: unknown): unknown {
	if (source && typeof source === 'object' && ('w' in source || 'h' in source)) {
		const { w: _w, h: _h, ...rest } = source as Record<string, unknown>;
		return rest;
	}
	return source;
}

/** WebP-URL för listor/kort. Returnerar tom sträng om source saknas. */
export function urlForWebp(source: unknown, width?: number, quality = 75): string {
	if (!source) return '';
	let b = builder.image(sanityImageSource(source) as Parameters<typeof builder.image>[0]).format('webp');
	if (width) b = b.width(width);
	if (quality != null) b = b.quality(quality);
	return b.url();
}
