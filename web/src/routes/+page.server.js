import { fetchCurrentExhibitions } from '$lib/sanity/exhibitions';
import { fetchNewsIndex } from '$lib/sanity/articles';
import { fetchSiteSettings, fetchSponsors, rotateSponsors } from '$lib/sanity/site';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const [current, news, settings, sponsors] = await Promise.all([
		fetchCurrentExhibitions(),
		fetchNewsIndex(),
		fetchSiteSettings(),
		fetchSponsors()
	]);

	const ongoingList = current.filter((e) => e.status === 'ongoing');
	const upcomingList = current.filter((e) => e.status === 'upcoming');
	const ongoing = ongoingList[0] ?? null;
	/** Hero: pågående, annars nästa kommande — undvik tom svart yta mellan utställningar. */
	const hero = ongoing ?? upcomingList[0] ?? null;
	const featuredExhibitions = [...ongoingList, ...upcomingList].slice(0, 2);
	const featuredNews = news.find((n) => n.clickable) ?? news[0] ?? null;

	return {
		hero,
		featuredExhibitions,
		news,
		featuredNews,
		about: settings?.about ?? {
			label: 'Om GALLERIett',
			headline: 'Ett galleri för samtidskonst på Tjörn',
			body: '',
			image: '/images/about-building.jpg'
		},
		showSponsors: settings?.showSponsors === true,
		homeSponsors: settings?.showSponsors === true ? rotateSponsors(sponsors) : []
	};
}
