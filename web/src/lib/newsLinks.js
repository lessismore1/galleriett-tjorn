/** Länk-helpers för nyhetskort — säkra i klienten (ingen Sanity-token). */

export function newsCardHref(item) {
	if (item?.kind === 'press' && item.source?.url) return item.source.url;
	if (item?.clickable) return `/nyheter/${item.slug}`;
	return null;
}

export function newsCardExternal(item) {
	return Boolean(item?.kind === 'press' && item.source?.url);
}
