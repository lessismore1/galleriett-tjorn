import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { SANITY_API_READ_TOKEN } from '$env/static/private';
import { env as publicEnv } from '$env/dynamic/public';

const projectId = publicEnv.PUBLIC_SANITY_PROJECT_ID || '81lb9elz';
const dataset = publicEnv.PUBLIC_SANITY_DATASET || 'development';

/**
 * Build-time token for adapter-static prerender.
 * Prefer `$env/static/private` (inlined by Vite) and bracket `process.env` (Pages CI).
 * `$env/dynamic/private` is empty in SvelteKit's postbuild analyse fork.
 */
function getReadToken(): string | undefined {
	const fromStatic = SANITY_API_READ_TOKEN;
	if (fromStatic) return fromStatic;
	// Bracket access avoids Vite statically replacing an unset env with undefined
	const fromProcess =
		typeof process !== 'undefined' ? process.env['SANITY_API_READ_TOKEN'] : undefined;
	return fromProcess || undefined;
}

/** Server-only client (prerender/build). Private dataset requires SANITY_API_READ_TOKEN. */
export function getSanityClient(): SanityClient {
	const token = getReadToken();
	if (!token) {
		throw new Error(
			'SANITY_API_READ_TOKEN saknas. Lokalt: web/.env. Cloudflare Pages: Settings → Variables and secrets → Production (available at build), sedan Retry deployment.'
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
