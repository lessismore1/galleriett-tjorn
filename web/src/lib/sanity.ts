import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const projectId = publicEnv.PUBLIC_SANITY_PROJECT_ID || '81lb9elz';
const dataset = publicEnv.PUBLIC_SANITY_DATASET || 'development';

/** Server-only client (prerender/build). Private dataset requires SANITY_API_READ_TOKEN. */
export function getSanityClient(): SanityClient {
	const token = env.SANITY_API_READ_TOKEN;
	if (!token) {
		throw new Error(
			'SANITY_API_READ_TOKEN saknas. Skapa en Viewer-token i Sanity Manage och lägg den i web/.env (se .env.example).'
		);
	}
	return createClient({
		projectId,
		dataset,
		apiVersion: '2025-01-01',
		token,
		useCdn: false
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
