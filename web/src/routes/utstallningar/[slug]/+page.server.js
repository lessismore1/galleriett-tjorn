import { error, redirect } from '@sveltejs/kit';
import { fetchExhibitionPage } from '$lib/sanity/exhibitions';

/** Gamla slug:ar efter renummerering (kronologisk 101→). */
const SLUG_REDIRECTS = {
	'90-nar-datid-moter-nutid': '101-brytningstid-del-2',
	'90-brytningstid-del-2': '101-brytningstid-del-2',
	'91-brytningstid-del-3': '102-brytningstid-del-3',
	'92-varexpo': '103-varexpo',
	'93-konst-med-horisont-2025': '104-konst-med-horisont-2025',
	'94-konst-i-midsommartid': '105-konst-i-midsommartid',
	'95-mellan-skimmer-form': '106-mellan-skimmer-form',
	'96-himmel-hav': '107-himmel-hav',
	'101-ljus-farg-form': '115-ljus-farg-form',
	'102-hostrusk': '108-hostrusk',
	'103-advent': '109-advent',
	'104-ljus-farg-form': '115-ljus-farg-form',
	'104-det-ljusnar': '110-det-ljusnar',
	'105-cheeky-points': '111-cheeky-points',
	'106-sprakande-farger': '112-sprakande-farger',
	'107-konst-med-horisont-2026': '113-konst-med-horisont-2026',
	'108-kustkonst-sommar-hos-galleriett': '114-kustkonst-sommar-hos-galleriett',
	'109-gott-och-blandat': '116-gott-och-blandat',
	'110-aterbruk-vintage': '117-aterbruk-vintage'
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const next = SLUG_REDIRECTS[params.slug];
	if (next) throw redirect(301, `/utstallningar/${next}`);

	const page = await fetchExhibitionPage(params.slug);
	if (!page) throw error(404, 'Utställningen hittades inte');
	return page;
}
