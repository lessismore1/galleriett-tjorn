/** @param {string} text */
export function slugifySegment(text) {
	return String(text)
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * @param {string} artistSlug
 * @param {{ slug: string }} work
 * @param {{ show?: string | null }} [opts]
 */
export function workHref(artistSlug, work, opts = {}) {
	const base = `/konstnarer/${artistSlug}/verk/${work.slug}`;
	const show = opts.show?.trim();
	return show ? `${base}?show=${encodeURIComponent(show)}` : base;
}
