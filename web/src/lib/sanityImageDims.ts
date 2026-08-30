/**
 * Intrinsic width/height from a Sanity CDN URL (`…-2682x1264.jpg?w=1000`)
 * for CLS / LCP attributes.
 */
export function sanityImageDims(
	url: string | null | undefined,
	fallbackRatio = 0.75
): { width: number; height: number } {
	const s = String(url || '');
	const reqW = Number(s.match(/[?&]w=(\d+)/)?.[1]) || 1000;
	const m = s.match(/-(\d+)x(\d+)\./);
	if (!m) return { width: reqW, height: Math.round(reqW * fallbackRatio) };
	const ow = Number(m[1]);
	const oh = Number(m[2]);
	if (!ow || !oh) return { width: reqW, height: Math.round(reqW * fallbackRatio) };
	return { width: reqW, height: Math.round((reqW * oh) / ow) };
}

/** Replace or set `w=` on a Sanity image URL. */
export function withSanityWidth(url: string, width: number): string {
	const s = String(url);
	if (/[?&]w=\d+/.test(s)) return s.replace(/([?&])w=\d+/, `$1w=${width}`);
	return `${s}${s.includes('?') ? '&' : '?'}w=${width}`;
}

/**
 * Responsive srcset from an existing Sanity CDN URL.
 * Widths are capped to the original asset width when present in the filename.
 */
export function sanitySrcSet(
	url: string | null | undefined,
	widths: number[] = [640, 1000, 1600]
): string {
	if (!url) return '';
	const s = String(url);
	// Lokala / externa URL:er utan Sanity-CDN — ingen w=-transform
	if (!s.includes('cdn.sanity.io')) return '';
	const origW = Number(s.match(/-(\d+)x(\d+)\./)?.[1]) || Infinity;
	const unique = [...new Set(widths.map((w) => Math.min(w, origW)).filter((w) => w > 0))].sort(
		(a, b) => a - b
	);
	return unique.map((w) => `${withSanityWidth(s, w)} ${w}w`).join(', ');
}
