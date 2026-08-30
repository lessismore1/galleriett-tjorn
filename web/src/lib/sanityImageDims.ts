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
