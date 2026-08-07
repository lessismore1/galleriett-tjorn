/** Mockdata för Galleri Ett — baserad på GUI-mockuper i docs/gui-mockups */

export const site = {
	name: 'Galleri Ett',
	tagline: 'Ett galleri för samtidskonst på Tjörn',
	address: {
		street: 'Skulptörvägen 12',
		postal: '471 78 Skärhamn',
		region: 'Tjörn',
		country: 'Sverige'
	},
	hours: 'Ons – Sön 12–17 eller efter överenskommelse',
	phone: '+46 (0) 709 42 51 95',
	email: 'info@galleriett-tjorn.se',
	social: {
		instagram: 'https://instagram.com/',
		facebook: 'https://facebook.com/'
	},
	partners: [
		{ name: 'Konst med Horisont', url: 'https://horisont.se' },
		{ name: 'Tjörns Konstförening', short: 'TKS' }
	],
	credit: 'Webbplats av Studio Horisont',
	mapsUrl: 'https://maps.google.com/?q=Skulptörvägen+12,+Skärhamn'
};

export const nav = [
	{ href: '/konstnarer', label: 'Konstnärer' },
	{ href: '/utstallningar', label: 'Utställningar' },
	{ href: '/video', label: 'Video' },
	{ href: '/nyheter', label: 'Nyheter' },
	{ href: '/om', label: 'Om' },
	{ href: '/kontakt', label: 'Kontakt' }
];

export const artists = [
	{
		slug: 'sara-lindqvist',
		name: 'Sara Lindqvist',
		specialty: 'Måleri',
		born: '1983, Göteborg, Sverige',
		education: ['MFA Konsthögskolan Valand, 2010', 'BFA HDK, 2007'],
		lives: 'Göteborg, Sverige',
		representedIn: ['Göteborg', 'Stockholm', 'Privat samlingar'],
		intro:
			'Sara Lindqvist arbetar med måleri där landskap, ljus och minne möts i lager av färg och tystnad.',
		bio: 'Sara Lindqvist är verksam i Göteborg och arbetar främst med olja på duk. Hennes verk rör sig mellan horisontlinjer, dimma och inre landskap. Hon har ställt ut nationellt och internationellt och finns representerad i flera privata och offentliga samlingar.',
		website: 'https://example.com',
		image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
		heroImage:
			'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1600&q=80',
		works: [
			{
				title: 'Vintergata',
				year: 2026,
				medium: 'Olja på duk',
				dimensions: '120 × 90 cm',
				image:
					'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=600&q=80'
			},
			{
				title: 'Silentium',
				year: 2025,
				medium: 'Olja på duk',
				dimensions: '100 × 80 cm',
				image:
					'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80'
			},
			{
				title: 'Horisont i dimma',
				year: 2025,
				medium: 'Olja på duk',
				dimensions: '140 × 100 cm',
				image:
					'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80'
			},
			{
				title: 'Nattljus',
				year: 2024,
				medium: 'Olja på duk',
				dimensions: '80 × 60 cm',
				image:
					'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=600&q=80'
			}
		],
		exhibitions: [
			{ year: 2026, title: 'Vintergata', venue: 'Galleri Ett, Tjörn' },
			{ year: 2025, title: 'Ljuslinjer', venue: 'Galleri X, Göteborg' },
			{ year: 2023, title: 'Stillhet', venue: 'Konsthallen, Malmö' },
			{ year: 2021, title: 'Debutalbum', venue: 'Valand, Göteborg' }
		],
		press: [
			{
				quote: 'Ett måleri som andas hav och tystnad.',
				source: 'Dagens Nyheter'
			},
			{
				quote: 'Lindqvist ger landskapet en ny, inre röst.',
				source: 'Svenska Dagbladet'
			}
		]
	},
	{
		slug: 'erik-halvorsen',
		name: 'Erik Halvorsen',
		specialty: 'Skulptur',
		born: '1978, Oslo, Norge',
		education: ['MFA Kunstakademiet i Oslo, 2006'],
		lives: 'Göteborg, Sverige',
		representedIn: ['Norge', 'Sverige'],
		intro: 'Erik Halvorsen skulpterar rum och tystnad i sten, brons och trä.',
		bio: 'Halvorsen arbetar med skulptur där materialets tyngd möter arkitektonisk klarhet.',
		website: null,
		image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
		heroImage:
			'https://images.unsplash.com/photo-1515405295570-fc052892ebd2?auto=format&fit=crop&w=1600&q=80',
		works: [],
		exhibitions: [{ year: 2026, title: 'Tystnadens rum', venue: 'Galleri Ett, Tjörn' }],
		press: []
	},
	{
		slug: 'maja-strom',
		name: 'Maja Ström',
		specialty: 'Måleri',
		born: '1990, Stockholm, Sverige',
		education: ['BFA Konstfack, 2014'],
		lives: 'Stockholm, Sverige',
		representedIn: ['Stockholm'],
		intro: 'Maja Ström målar färgytor där känsla och struktur möts.',
		bio: 'Ström arbetar med abstrakt måleri i stora format.',
		website: null,
		image: 'https://images.unsplash.com/photo-1534528741775-53994d69b58c?auto=format&fit=crop&w=800&q=80',
		heroImage: null,
		works: [],
		exhibitions: [],
		press: []
	},
	{
		slug: 'johan-berg',
		name: 'Johan Berg',
		specialty: 'Fotografi',
		born: '1985, Malmö, Sverige',
		education: ['BFA HDK-Valand, 2012'],
		lives: 'Malmö, Sverige',
		representedIn: ['Skåne'],
		intro: 'Johan Berg fotograferar landskap och vardag i nordiskt ljus.',
		bio: 'Berg arbetar med analog och digital fotografi.',
		website: null,
		image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
		heroImage: null,
		works: [],
		exhibitions: [],
		press: []
	},
	{
		slug: 'annika-viden',
		name: 'Annika Vidén',
		specialty: 'Installation',
		born: '1982, Umeå, Sverige',
		education: ['MFA Kungliga Konsthögskolan, 2011'],
		lives: 'Stockholm, Sverige',
		representedIn: ['Stockholm', 'Umeå'],
		intro: 'Annika Vidén skapar installationer där rum, ljus och objekt samspelar.',
		bio: 'Vidén arbetar med platsbunden konst och installation.',
		website: null,
		image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
		heroImage: null,
		works: [],
		exhibitions: [],
		press: []
	},
	{
		slug: 'per-olofsson',
		name: 'Per Olofsson',
		specialty: 'Skulptur',
		born: '1975, Tjörn, Sverige',
		education: ['BFA HDK, 2001'],
		lives: 'Tjörn, Sverige',
		representedIn: ['Västsverige'],
		intro: 'Per Olofsson arbetar med skulptur i trä och sten, ofta med havet som tema.',
		bio: 'Olofsson är baserad på Tjörn och arbetar nära landskapets material.',
		website: null,
		image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
		heroImage: null,
		works: [],
		exhibitions: [],
		press: []
	},
	{
		slug: 'lisa-werner',
		name: 'Lisa Werner',
		specialty: 'Måleri',
		born: '1988, Göteborg, Sverige',
		education: ['MFA Valand, 2015'],
		lives: 'Göteborg, Sverige',
		representedIn: ['Göteborg'],
		intro: 'Lisa Werner målar figurer och rum i dämpad färgskala.',
		bio: 'Werner arbetar med figurativt måleri.',
		website: null,
		image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
		heroImage: null,
		works: [],
		exhibitions: [],
		press: []
	},
	{
		slug: 'tomas-akesson',
		name: 'Tomas Åkesson',
		specialty: 'Skulptur',
		born: '1980, Linköping, Sverige',
		education: ['MFA Konstfack, 2009'],
		lives: 'Stockholm, Sverige',
		representedIn: ['Stockholm'],
		intro: 'Tomas Åkesson skulpterar i metall och betong med arkitektonisk precision.',
		bio: 'Åkesson arbetar med skulptur och offentlig konst.',
		website: null,
		image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
		heroImage: null,
		works: [],
		exhibitions: [],
		press: []
	}
];

export const exhibitions = [
	{
		id: 405,
		slug: 'sara-lindqvist-vintergata',
		artistSlug: 'sara-lindqvist',
		artist: 'Sara Lindqvist',
		title: 'Vintergata',
		status: 'ongoing',
		start: '2026-08-12',
		end: '2026-09-20',
		datesLabel: '12 AUG – 20 SEP 2026',
		location: 'Galleri Ett, Tjörn',
		vernissage: '2026-08-12T18:00:00',
		intro:
			'I Vintergata möter Sara Lindqvist landskapet som minne och närvaro — ett måleri där hav, ljus och tystnad får ta plats.',
		pressRelease:
			'Sara Lindqvist visar nya målningar i utställningen Vintergata på Galleri Ett. Verken rör sig mellan horisont och inre landskap, med ett måleri som bygger lager av färg, ljus och stillhet. Utställningen pågår 12 augusti–20 september 2026.',
		image:
			'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1400&q=80',
		works: [
			{
				title: 'Vintergata',
				image:
					'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=600&q=80'
			},
			{
				title: 'Silentium',
				image:
					'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80'
			}
		],
		installationViews: [
			'https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1515405295570-fc052892ebd2?auto=format&fit=crop&w=1200&q=80'
		]
	},
	{
		id: 404,
		slug: 'erik-halvorsen-tystnadens-rum',
		artistSlug: 'erik-halvorsen',
		artist: 'Erik Halvorsen',
		title: 'Tystnadens rum',
		status: 'upcoming',
		start: '2026-10-03',
		end: '2026-11-02',
		datesLabel: '3 OKT – 2 NOV 2026',
		location: 'Galleri Ett, Tjörn',
		vernissage: '2026-10-03T18:00:00',
		intro: 'Erik Halvorsen visar skulpturer som formar tystnad och rum.',
		pressRelease:
			'Tystnadens rum är Erik Halvorsens första separatutställning på Galleri Ett. Skulpturerna arbetar med material, tyngd och tomrum.',
		image:
			'https://images.unsplash.com/photo-1515405295570-fc052892ebd2?auto=format&fit=crop&w=1400&q=80',
		works: [],
		installationViews: []
	},
	{
		id: 403,
		slug: 'langsvagen',
		artistSlug: null,
		artist: 'Grupputställning',
		title: 'Längs vägen / Along the Road',
		status: 'past',
		start: '2026-04-12',
		end: '2026-05-25',
		datesLabel: '12 APR – 25 MAJ 2026',
		location: 'Galleri Ett, Tjörn',
		vernissage: '2026-04-12T15:00:00',
		intro: 'En grupputställning om resa, plats och minne.',
		pressRelease: 'Längs vägen samlar verk som speglar förflyttning och landskap.',
		image:
			'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80',
		works: [],
		installationViews: []
	},
	{
		id: 402,
		slug: 'klara-kristalova-lust-for-life',
		artistSlug: null,
		artist: 'Klara Kristalova',
		title: 'Lust for Life – Nordic',
		status: 'past',
		start: '2026-02-01',
		end: '2026-03-15',
		datesLabel: '1 FEB – 15 MAR 2026',
		location: 'Galleri Ett, Tjörn',
		vernissage: null,
		intro: 'Skulptur och berättelse i nordiskt ljus.',
		pressRelease: '',
		image:
			'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1400&q=80',
		works: [],
		installationViews: []
	},
	{
		id: 401,
		slug: 'ljus-och-horisont',
		artistSlug: 'sara-lindqvist',
		artist: 'Sara Lindqvist m.fl.',
		title: 'Ljus & Horisont',
		status: 'past',
		start: '2025-11-01',
		end: '2025-12-15',
		datesLabel: '1 NOV – 15 DEC 2025',
		location: 'Galleri Ett, Tjörn',
		vernissage: null,
		intro: 'En utställning om ljus, hav och horisont.',
		pressRelease: '',
		image:
			'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=80',
		works: [],
		installationViews: []
	}
];

export const news = [
	{
		slug: 'recension-dn',
		category: 'Nyhet',
		title: 'Recension i Dagens Nyheter',
		date: '2026-08-03',
		dateLabel: '3 AUGUSTI 2026',
		image:
			'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
		excerpt: 'DN skriver om den pågående utställningen på Galleri Ett.'
	},
	{
		slug: 'paletten',
		category: 'Press',
		title: 'Galleriet i konstmagasinet Paletten',
		date: '2026-07-28',
		dateLabel: '28 JULI 2026',
		image:
			'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80',
		excerpt: 'Reportage om Galleri Ett och samtidskonsten på Tjörn.'
	},
	{
		slug: 'sommarvernissage',
		category: 'Event',
		title: 'Sommarvernissage med konstnärssamtal',
		date: '2026-07-15',
		dateLabel: '15 JULI 2026',
		image:
			'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80',
		excerpt: 'Vernissage och samtal med deltagande konstnärer.'
	},
	{
		slug: 'ny-konstnar-host',
		category: 'Nyhet',
		title: 'Ny konstnär till hösten 2026',
		date: '2026-07-08',
		dateLabel: '8 JULI 2026',
		image:
			'https://images.unsplash.com/photo-1515405295570-fc052892ebd2?auto=format&fit=crop&w=800&q=80',
		excerpt: 'Galleri Ett välkomnar en ny konstnär till höstens program.'
	}
];

export const about = {
	label: 'Om Galleri Ett',
	headline: 'Ett galleri för samtidskonst på Tjörn',
	body: 'Galleri Ett visar måleri, skulptur och fotografi med fokus på samtidskonst i en unik miljö vid Bohusläns kust. Vi arbetar nära konstnärer och besökare — med utställningar, samtal och möten.',
	image:
		'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=80'
};

export const statusLabels = {
	ongoing: 'Pågående',
	upcoming: 'Kommande',
	past: 'Arkiv'
};

/** @param {string} slug */
export function getArtist(slug) {
	return artists.find((a) => a.slug === slug);
}

/** @param {string} slug */
export function getExhibition(slug) {
	return exhibitions.find((e) => e.slug === slug);
}

export function getOngoingExhibition() {
	return exhibitions.find((e) => e.status === 'ongoing');
}

/** @param {'ongoing' | 'upcoming' | 'past'} status */
export function getExhibitionsByStatus(status) {
	return exhibitions.filter((e) => e.status === status);
}
