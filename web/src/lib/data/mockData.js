/** Mockdata för Galleri Ett — baserad på GUI-mockuper i docs/gui-mockups */

export const site = {
	name: 'GALLERIett',
	tagline: 'Ett galleri för samtidskonst på Tjörn',
	address: {
		street: 'Marinvägen 9, Hall 1',
		postal: '471 41 Rönnäng (Stansvik)',
		region: 'Tjörn',
		country: 'Sverige'
	},
	hours: 'Ons – Sön 13–18 eller efter överenskommelse',
	phone: '+46 (0) 70-060 1006',
	email: 'info@galleriett-tjorn.se',
	social: {
		instagram: 'https://www.instagram.com/galleriett.tjorn',
		facebook: 'https://www.facebook.com/galleriett.tjorn'
	},
	partners: [
		{ name: 'tjornkonst.se', url: 'https://tjornkonst.se' },
		{ name: 'konstmedhorisont.se', url: 'https://konstmedhorisont.se' },
		{ name: 'kustkonst.se', url: null },
		{ name: 'ronnang.se', url: 'https://ronnang.se' }
	],
	credit: {
		name: 'Ronny Carlansson',
		url: 'https://www.linkedin.com/in/ronnycarlansson/'
	},
	mapsUrl: 'https://maps.google.com/?q=Marinvägen+9,+Rönnäng'
};

/** Sponsorer — visas i karusell + /sponsorer */
export const sponsors = [
	{
		id: 'tks',
		name: 'Tjörns Konst & Konsthantverk Sällskap',
		shortName: 'TKS',
		logo: '/images/sponsors/tks.webp',
		url: 'https://tjornkonst.se'
	},
	{
		id: 'tjorns-sparbank',
		name: 'Tjörns Sparbank',
		shortName: 'Tjörns Sparbank',
		logo: '/images/sponsors/tjorns-sparbank.webp',
		url: 'https://www.tjorns-sparbank.se/'
	},
	{
		id: 'galleriett',
		name: 'GALLERIett',
		shortName: 'GALLERIett',
		logo: '/images/sponsors/galleriett.webp',
		url: '/'
	}
];

/** Jämlik dagsrotation — ingen personlig spårning */
export function getRotatedSponsors(list = sponsors, date = new Date()) {
	if (!list.length) return [];
	const start = new Date(date.getFullYear(), 0, 0);
	const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
	const offset = dayOfYear % list.length;
	return [...list.slice(offset), ...list.slice(0, offset)];
}

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
		id: '01',
		slug: '01-sara-lindqvist',
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
		image: '/images/artist-sara.jpg',
		heroImage: '/images/hero.jpg',
		works: [
			{
				title: 'Vintergata',
				year: 2026,
				medium: 'Olja på duk',
				dimensions: '120 × 90 cm',
				image: '/images/work-1.jpg'
			},
			{
				title: 'Silentium',
				year: 2025,
				medium: 'Olja på duk',
				dimensions: '100 × 80 cm',
				image: '/images/work-2.jpg'
			},
			{
				title: 'Horisont i dimma',
				year: 2025,
				medium: 'Olja på duk',
				dimensions: '140 × 100 cm',
				image: '/images/work-3.jpg'
			},
			{
				title: 'Nattljus',
				year: 2024,
				medium: 'Olja på duk',
				dimensions: '80 × 60 cm',
				image: '/images/work-4.jpg'
			}
		],
		exhibitions: [
			{
				year: 2026,
				id: 105,
				title: 'Vintergata',
				venue: 'GALLERIett, Tjörn',
				slug: '105-sara-lindqvist-vintergata'
			},
			{
				year: 2025,
				id: 101,
				title: 'Ljus & Horisont',
				venue: 'GALLERIett, Tjörn',
				slug: '101-ljus-och-horisont'
			}
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
		id: '02',
		slug: '02-erik-halvorsen',
		name: 'Erik Halvorsen',
		specialty: 'Skulptur',
		born: '1978, Oslo, Norge',
		education: ['MFA Kunstakademiet i Oslo, 2006'],
		lives: 'Göteborg, Sverige',
		representedIn: ['Norge', 'Sverige'],
		intro: 'Erik Halvorsen skulpterar rum och tystnad i sten, brons och trä.',
		bio: 'Halvorsen arbetar med skulptur där materialets tyngd möter arkitektonisk klarhet.',
		website: null,
		image: '/images/artist-erik.jpg',
		heroImage: '/images/ex-104-hero.jpg',
		works: [
			{
				title: 'Tomrum I',
				year: 2026,
				medium: 'Betong och stål',
				dimensions: '90 × 60 × 45 cm',
				image: '/images/work-104-a.jpg'
			},
			{
				title: 'Bärande',
				year: 2025,
				medium: 'Sten',
				dimensions: '70 × 40 × 40 cm',
				image: '/images/work-104-b.jpg'
			},
			{
				title: 'Axel',
				year: 2025,
				medium: 'Brons',
				dimensions: '55 × 25 × 25 cm',
				image: '/images/work-104-c.jpg'
			},
			{
				title: 'Tyst pelare',
				year: 2024,
				medium: 'Trä och betong',
				dimensions: '180 × 30 × 30 cm',
				image: '/images/work-104-d.jpg'
			}
		],
		exhibitions: [
			{
				year: 2026,
				id: 104,
				title: 'Tystnadens rum',
				venue: 'GALLERIett, Tjörn',
				slug: '104-erik-halvorsen-tystnadens-rum'
			},
			{
				year: 2025,
				id: 101,
				title: 'Ljus & Horisont',
				venue: 'GALLERIett, Tjörn',
				slug: '101-ljus-och-horisont'
			}
		],
		press: [
			{
				quote: 'Skulptur som låter rummet andas.',
				source: 'Göteborgs-Posten'
			}
		]
	},
	{
		id: '03',
		slug: '03-maja-strom',
		name: 'Maja Ström',
		specialty: 'Måleri',
		born: '1990, Stockholm, Sverige',
		education: ['BFA Konstfack, 2014'],
		lives: 'Stockholm, Sverige',
		representedIn: ['Stockholm'],
		intro: 'Maja Ström målar färgytor där känsla och struktur möts.',
		bio: 'Maja Ström är verksam i Stockholm och arbetar med abstrakt måleri i stora format. Hennes färgytor bygger lager av struktur och känsla — ytor som både andas och håller kvar blicken.',
		website: null,
		image: '/images/artist-maja.jpg',
		heroImage: null,
		works: [
			{
				title: 'Färgyta III',
				year: 2025,
				medium: 'Akryl på duk',
				dimensions: '180 × 140 cm',
				image: '/images/work-maja-a.jpg'
			},
			{
				title: 'Skikt',
				year: 2025,
				medium: 'Akryl på duk',
				dimensions: '160 × 120 cm',
				image: '/images/work-maja-b.jpg'
			},
			{
				title: 'Rosa fält',
				year: 2024,
				medium: 'Akryl på duk',
				dimensions: '140 × 100 cm',
				image: '/images/work-maja-c.jpg'
			},
			{
				title: 'Yta / rum',
				year: 2024,
				medium: 'Akryl på duk',
				dimensions: '200 × 150 cm',
				image: '/images/work-maja-d.jpg'
			}
		],
		exhibitions: [
			{
				year: 2025,
				id: 101,
				title: 'Ljus & Horisont',
				venue: 'GALLERIett, Tjörn',
				slug: '101-ljus-och-horisont'
			}
		],
		press: [
			{
				quote: 'Stora ytor som andas — färg som både vägg och landskap.',
				source: 'Konstperspektiv'
			}
		]
	},
	{
		id: '04',
		slug: '04-johan-berg',
		name: 'Johan Berg',
		specialty: 'Fotografi',
		born: '1985, Malmö, Sverige',
		education: ['BFA HDK-Valand, 2012'],
		lives: 'Malmö, Sverige',
		representedIn: ['Skåne'],
		intro: 'Johan Berg fotograferar landskap och vardag i nordiskt ljus.',
		bio: 'Berg arbetar med analog och digital fotografi.',
		website: null,
		image: '/images/artist-johan.jpg',
		heroImage: null,
		works: [
			{
				title: 'Väg 160',
				year: 2026,
				medium: 'Pigmentprint',
				dimensions: '80 × 100 cm',
				image: '/images/work-1-clean.jpg'
			},
			{
				title: 'Morgon vid kajen',
				year: 2025,
				medium: 'Pigmentprint',
				dimensions: '70 × 90 cm',
				image: '/images/work-2-clean.jpg'
			}
		],
		exhibitions: [
			{
				year: 2026,
				id: 103,
				title: 'Längs vägen / Along the Road',
				venue: 'GALLERIett, Tjörn',
				slug: '103-langsvagen'
			}
		],
		press: []
	},
	{
		id: '05',
		slug: '05-annika-viden',
		name: 'Annika Vidén',
		specialty: 'Installation',
		born: '1982, Umeå, Sverige',
		education: ['MFA Kungliga Konsthögskolan, 2011'],
		lives: 'Stockholm, Sverige',
		representedIn: ['Stockholm', 'Umeå'],
		intro: 'Annika Vidén skapar installationer där rum, ljus och objekt samspelar.',
		bio: 'Vidén arbetar med platsbunden konst och installation.',
		website: null,
		image: '/images/artist-annika.jpg',
		heroImage: '/images/hero-annika.jpg',
		works: [
			{
				title: 'Passage',
				year: 2026,
				medium: 'Installation, textil och ljus',
				dimensions: 'Varierande mått',
				image: '/images/work-3-clean.jpg'
			},
			{
				title: 'Markör',
				year: 2025,
				medium: 'Trä och spegel',
				dimensions: '120 × 40 × 40 cm',
				image: '/images/work-4-clean.jpg'
			}
		],
		exhibitions: [
			{
				year: 2026,
				id: 103,
				title: 'Längs vägen / Along the Road',
				venue: 'GALLERIett, Tjörn',
				slug: '103-langsvagen'
			}
		],
		press: []
	},
	{
		id: '06',
		slug: '06-per-olofsson',
		name: 'Per Olofsson',
		specialty: 'Skulptur',
		born: '1975, Tjörn, Sverige',
		education: ['BFA HDK, 2001'],
		lives: 'Tjörn, Sverige',
		representedIn: ['Västsverige'],
		intro: 'Per Olofsson arbetar med skulptur i trä och sten, ofta med havet som tema.',
		bio: 'Olofsson är baserad på Tjörn och arbetar nära landskapets material — drivved, granit och salt.',
		website: null,
		image: '/images/artist-per.jpg',
		heroImage: '/images/ex-102-hero.jpg',
		works: [
			{
				title: 'Tidvatten I',
				year: 2026,
				medium: 'Ek och granit',
				dimensions: '95 × 40 × 35 cm',
				image: '/images/work-102-a.jpg'
			},
			{
				title: 'Drivved',
				year: 2025,
				medium: 'Trä',
				dimensions: '140 × 28 × 22 cm',
				image: '/images/work-102-b.jpg'
			},
			{
				title: 'Klint',
				year: 2025,
				medium: 'Sten',
				dimensions: '55 × 45 × 40 cm',
				image: '/images/work-102-c.jpg'
			},
			{
				title: 'Saltlinje',
				year: 2024,
				medium: 'Trä och stål',
				dimensions: '110 × 30 × 20 cm',
				image: '/images/work-102-d.jpg'
			}
		],
		exhibitions: [
			{
				year: 2026,
				id: 102,
				title: 'Tidvatten',
				venue: 'GALLERIett, Tjörn',
				slug: '102-per-olofsson-tidvatten'
			}
		],
		press: [
			{
				quote: 'Olofsson låter Bohusläns material tala utan att illustrera.',
				source: 'Bohusläningen'
			}
		]
	},
	{
		id: '07',
		slug: '07-lisa-werner',
		name: 'Lisa Werner',
		specialty: 'Måleri',
		born: '1988, Göteborg, Sverige',
		education: ['MFA Valand, 2015'],
		lives: 'Göteborg, Sverige',
		representedIn: ['Göteborg'],
		intro: 'Lisa Werner målar figurer och rum i dämpad färgskala.',
		bio: 'Lisa Werner är verksam i Göteborg och arbetar med figurativt måleri. I hennes bilder möts människor, interiörer och ljus i en tyst, dämpad färgskala — ofta med fönster och rum som bärare av närvaro och avstånd.',
		website: null,
		image: '/images/artist-lisa.jpg',
		heroImage: null,
		works: [
			{
				title: 'Figur vid fönster',
				year: 2025,
				medium: 'Olja på duk',
				dimensions: '100 × 80 cm',
				image: '/images/work-lisa-a.jpg'
			},
			{
				title: 'Rum i grått',
				year: 2025,
				medium: 'Olja på duk',
				dimensions: '90 × 70 cm',
				image: '/images/work-lisa-b.jpg'
			},
			{
				title: 'Still sittande',
				year: 2024,
				medium: 'Olja på duk',
				dimensions: '80 × 60 cm',
				image: '/images/work-lisa-c.jpg'
			},
			{
				title: 'Eftermiddagsljus',
				year: 2024,
				medium: 'Olja på duk',
				dimensions: '120 × 90 cm',
				image: '/images/work-lisa-d.jpg'
			}
		],
		exhibitions: [
			{
				year: 2025,
				id: 101,
				title: 'Ljus & Horisont',
				venue: 'GALLERIett, Tjörn',
				slug: '101-ljus-och-horisont'
			}
		],
		press: [
			{
				quote: 'Ett måleri som låter tystnaden mellan figurerna tala.',
				source: 'Göteborgs-Posten'
			}
		]
	},
	{
		id: '08',
		slug: '08-tomas-akesson',
		name: 'Tomas Åkesson',
		specialty: 'Skulptur',
		born: '1980, Linköping, Sverige',
		education: ['MFA Konstfack, 2009'],
		lives: 'Stockholm, Sverige',
		representedIn: ['Stockholm'],
		intro: 'Tomas Åkesson skulpterar i metall och betong med arkitektonisk precision.',
		bio: 'Åkesson arbetar med skulptur och offentlig konst.',
		website: null,
		image: '/images/artist-tomas.jpg',
		heroImage: null,
		works: [
			{
				title: 'Vägmärke',
				year: 2026,
				medium: 'Stål',
				dimensions: '160 × 40 × 40 cm',
				image: '/images/work-5.jpg'
			},
			{
				title: 'Skarv',
				year: 2025,
				medium: 'Betong och metall',
				dimensions: '75 × 50 × 30 cm',
				image: '/images/work-6.jpg'
			}
		],
		exhibitions: [
			{
				year: 2026,
				id: 103,
				title: 'Längs vägen / Along the Road',
				venue: 'GALLERIett, Tjörn',
				slug: '103-langsvagen'
			}
		],
		press: []
	}
];

export const exhibitions = [
	{
		id: 105,
		slug: '105-sara-lindqvist-vintergata',
		artistSlug: '01-sara-lindqvist',
		artist: 'Sara Lindqvist',
		title: 'Vintergata',
		status: 'ongoing',
		start: '2026-08-12',
		end: '2026-09-20',
		datesLabel: '12 AUG – 20 SEP 2026',
		location: 'GALLERIett, Tjörn',
		vernissage: '2026-08-12T18:00:00',
		intro:
			'I Vintergata möter Sara Lindqvist landskapet som minne och närvaro — ett måleri där hav, ljus och tystnad får ta plats.',
		pressRelease:
			'Sara Lindqvist visar nya målningar i utställningen Vintergata på GALLERIett. Verken rör sig mellan horisont och inre landskap, med ett måleri som bygger lager av färg, ljus och stillhet. Utställningen pågår 12 augusti–20 september 2026.',
		image: '/images/ex-405-hero.jpg',
		cardImage: '/images/card-ongoing.jpg',
		works: [
			{ title: 'Vintergata', image: '/images/work-1.jpg?v=2' },
			{ title: 'Silentium', image: '/images/work-2.jpg?v=2' },
			{ title: 'Horisont i dimma', image: '/images/work-3.jpg?v=2' },
			{ title: 'Nattljus', image: '/images/work-4.jpg?v=2' },
			{ title: 'Innan regnet', image: '/images/work-5.jpg?v=2' },
			{ title: 'Låg tid', image: '/images/work-6.jpg?v=3' }
		],
		installationViews: [
			'/images/install-a.jpg?v=3',
			'/images/install-b.jpg?v=3',
			'/images/install-c.jpg?v=3'
		]
	},
	{
		id: 104,
		slug: '104-erik-halvorsen-tystnadens-rum',
		artistSlug: '02-erik-halvorsen',
		artist: 'Erik Halvorsen',
		title: 'Tystnadens rum',
		status: 'upcoming',
		start: '2026-10-03',
		end: '2026-11-02',
		datesLabel: '3 OKT – 2 NOV 2026',
		location: 'GALLERIett, Tjörn',
		vernissage: '2026-10-03T18:00:00',
		intro: 'Erik Halvorsen visar skulpturer som formar tystnad och rum.',
		pressRelease:
			'Tystnadens rum är Erik Halvorsens första separatutställning på GALLERIett.\n\nSkulpturerna arbetar med material, tyngd och tomrum — betong, sten, brons och trä i former som både bär och lämnar öppningar. Halvorsen låter galleriets rum bli en del av verken: skuggor, avstånd och stillhet får lika stor vikt som massan.\n\nUtställningen samlar nya och tidigare verk i en koncentrerad installation. Vernissage 3 oktober 2026 kl. 18. Utställningen pågår till 2 november 2026.',
		image: '/images/ex-104-hero.jpg',
		cardImage: '/images/ex-104-hero.jpg',
		works: [
			{ title: 'Tomrum I', image: '/images/work-104-a.jpg' },
			{ title: 'Bärande', image: '/images/work-104-b.jpg' },
			{ title: 'Axel', image: '/images/work-104-c.jpg' },
			{ title: 'Tyst pelare', image: '/images/work-104-d.jpg' },
			{ title: 'Vila', image: '/images/work-104-e.jpg' },
			{ title: 'Kant', image: '/images/work-104-f.jpg' }
		],
		installationViews: [
			'/images/install-104-a.jpg',
			'/images/install-104-b.jpg',
			'/images/install-104-c.jpg'
		]
	},
	{
		id: 103,
		slug: '103-langsvagen',
		artistSlug: '04-johan-berg',
		artistSlugs: ['04-johan-berg', '05-annika-viden', '08-tomas-akesson'],
		artist: 'Johan Berg m.fl.',
		title: 'Längs vägen / Along the Road',
		status: 'past',
		start: '2026-04-12',
		end: '2026-05-25',
		datesLabel: '12 APR – 25 MAJ 2026',
		location: 'GALLERIett, Tjörn',
		vernissage: '2026-04-12T15:00:00',
		intro: 'En grupputställning om resa, plats och minne.',
		pressRelease:
			'GALLERIett presenterar Längs vägen / Along the Road, en grupputställning med Johan Berg, Annika Vidén och Tomas Åkesson.\n\nUtställningen tar avstamp i förflyttning — vägen som fysisk sträcka och som inre rörelse. Verken rör sig mellan kustväg, tillfälliga rum och markörer i landskapet.\n\nJohan Berg bidrar med fotografi i nordiskt ljus. Annika Vidén bygger installationer där passage och ljus styr blicken. Tomas Åkesson visar skulptur i stål och betong med arkitektonisk skärpa.\n\nVernissage 12 april 2026 kl. 15. Utställningen pågår till 25 maj 2026.',
		image: '/images/ex-103-hero.jpg',
		cardImage: '/images/ex-103-hero.jpg',
		works: [
			{ title: 'Väg 160 — Johan Berg', image: '/images/work-1-clean.jpg' },
			{ title: 'Morgon vid kajen — Johan Berg', image: '/images/work-2-clean.jpg' },
			{ title: 'Passage — Annika Vidén', image: '/images/work-3-clean.jpg' },
			{ title: 'Markör — Annika Vidén', image: '/images/work-4-clean.jpg' },
			{ title: 'Vägmärke — Tomas Åkesson', image: '/images/work-5.jpg' },
			{ title: 'Skarv — Tomas Åkesson', image: '/images/work-6.jpg' }
		],
		installationViews: [
			'/images/install-a.jpg',
			'/images/install-b.jpg',
			'/images/gallery-interior-clean.jpg'
		]
	},
	{
		id: 102,
		slug: '102-per-olofsson-tidvatten',
		artistSlug: '06-per-olofsson',
		artist: 'Per Olofsson',
		title: 'Tidvatten',
		status: 'past',
		start: '2026-02-01',
		end: '2026-03-15',
		datesLabel: '1 FEB – 15 MAR 2026',
		location: 'GALLERIett, Tjörn',
		vernissage: '2026-02-01T15:00:00',
		intro: 'Skulptur i trä och sten — nära havet, nära materialet.',
		pressRelease:
			'GALLERIett presenterar Tidvatten, Per Olofssons separatutställning med skulptur i ek, granit, drivved och stål.\n\nOlofsson är baserad på Tjörn och arbetar nära landskapets egna material. Verken bär spår av tidvatten, erosion och hantverk — utan att illustrera kustens vyer. Tyngd och yta möts i former som känns både lokala och tidlösa.\n\nVernissage 1 februari 2026 kl. 15. Utställningen pågår till 15 mars 2026.',
		image: '/images/ex-102-hero.jpg',
		cardImage: '/images/ex-102-hero.jpg',
		works: [
			{ title: 'Tidvatten I', image: '/images/work-102-a.jpg' },
			{ title: 'Drivved', image: '/images/work-102-b.jpg' },
			{ title: 'Klint', image: '/images/work-102-c.jpg' },
			{ title: 'Saltlinje', image: '/images/work-102-d.jpg' },
			{ title: 'Skär', image: '/images/work-102-e.jpg' },
			{ title: 'Ebb', image: '/images/work-102-f.jpg' }
		],
		installationViews: [
			'/images/install-102-a.jpg',
			'/images/install-102-b.jpg',
			'/images/install-102-c.jpg'
		]
	},
	{
		id: 101,
		slug: '101-ljus-och-horisont',
		artistSlug: '01-sara-lindqvist',
		artistSlugs: [
			'01-sara-lindqvist',
			'02-erik-halvorsen',
			'07-lisa-werner',
			'03-maja-strom'
		],
		artist: 'Sara Lindqvist m.fl.',
		title: 'Ljus & Horisont',
		status: 'past',
		start: '2025-11-01',
		end: '2025-12-15',
		datesLabel: '1 NOV – 15 DEC 2025',
		location: 'GALLERIett, Tjörn',
		vernissage: '2025-11-01T15:00:00',
		intro:
			'En grupputställning om ljus, hav och horisont — där måleri, skulptur och fotografi möts i den bohuslänska kustens skiftningar.',
		pressRelease:
			'GALLERIett presenterar Ljus & Horisont, en grupputställning med Sara Lindqvist, Erik Halvorsen, Lisa Werner och Maja Ström.\n\nUtställningen tar avstamp i horisontlinjen som både geografisk och inre gräns. Verken rör sig mellan öppet hav, dämpat dagsljus och det stilla mörker som präglar Västkusten under senhösten.\n\nSara Lindqvist bidrar med måleri i lager av ljus och stillhet. Erik Halvorsen visar skulptur där material och rum samspelar. Lisa Werner arbetar med figur och färg i dämpad skala, medan Maja Ström utforskar abstrakta färgytor i stort format.\n\nLjus & Horisont är den första utställningen i GALLERIetts nya numrering och markerar starten på galleriets utställningsarkiv.\n\nVernissage 1 november 2025 kl. 15–18. Utställningen pågår till 15 december 2025.',
		image: '/images/ex-101-hero.jpg',
		cardImage: '/images/ex-thumb-2.jpg',
		works: [
			{ title: 'Horisont I — Sara Lindqvist', image: '/images/work-1.jpg?v=2' },
			{ title: 'Kustljus — Sara Lindqvist', image: '/images/work-2.jpg?v=2' },
			{ title: 'Tyst form — Erik Halvorsen', image: '/images/work-3.jpg?v=2' },
			{ title: 'Figur vid fönster — Lisa Werner', image: '/images/work-lisa-a.jpg' },
			{ title: 'Färgyta III — Maja Ström', image: '/images/work-maja-a.jpg' },
			{ title: 'Stillhet — Sara Lindqvist', image: '/images/work-6.jpg?v=3' }
		],
		installationViews: [
			'/images/install-101-a.jpg',
			'/images/install-101-b.jpg',
			'/images/install-101-c.jpg'
		]
	}
];

export const news = [
	{
		slug: 'recension-dn',
		category: 'Nyhet',
		title: 'Recension i Dagens Nyheter',
		date: '2026-08-03',
		dateLabel: '3 AUGUSTI 2026',
		image: '/images/card-news.jpg',
		thumb: '/images/news-1.jpg',
		excerpt: 'DN skriver om den pågående utställningen på Galleri Ett.'
	},
	{
		slug: 'paletten',
		category: 'Media',
		title: 'Galleriet i konstmagasinet Paletten',
		date: '2026-07-28',
		dateLabel: '28 JULI 2026',
		image: '/images/news-1.jpg',
		thumb: '/images/news-1.jpg',
		excerpt: 'Reportage om Galleri Ett och samtidskonsten på Tjörn.'
	},
	{
		slug: 'sommarvernissage',
		category: 'Event',
		title: 'Sommarvernissage med konstnärssamtal',
		date: '2026-07-15',
		dateLabel: '15 JULI 2026',
		image: '/images/news-2.jpg',
		thumb: '/images/news-2.jpg',
		excerpt: 'Vernissage och samtal med deltagande konstnärer.'
	},
	{
		slug: 'ny-konstnar-host',
		category: 'Nyhet',
		title: 'Ny konstnär till hösten 2026',
		date: '2026-07-08',
		dateLabel: '8 JULI 2026',
		image: '/images/news-3.jpg',
		thumb: '/images/news-3.jpg',
		excerpt: 'Galleri Ett välkomnar en ny konstnär till höstens program.'
	}
];

export const about = {
	label: 'Om GALLERIett',
	headline: 'Ett galleri för samtidskonst på Tjörn',
	body: 'GALLERIett visar måleri, skulptur och fotografi med fokus på samtidskonst i en unik miljö vid Bohusläns kust. Vi arbetar nära konstnärer och besökare — med utställningar, samtal och möten.',
	image: '/images/about-building.jpg'
};

export const statusLabels = {
	ongoing: 'Pågående',
	upcoming: 'Kommande',
	past: 'Arkiv'
};

/** Kalenderår för utställning (utifrån start) */
/** @param {{ start: string }} ex */
export function exhibitionYear(ex) {
	return Number(String(ex.start).slice(0, 4));
}

export function getCurrentExhibitionYear() {
	return new Date().getFullYear();
}

/** @param {typeof exhibitions[number][]} list */
function sortByIdDesc(list) {
	return [...list].sort((a, b) => b.id - a.id);
}

/** Årets utställningar (kalenderår), fallande */
export function getYearExhibitions(year = getCurrentExhibitionYear()) {
	return sortByIdDesc(exhibitions.filter((e) => exhibitionYear(e) === year));
}

export function getOngoingExhibitions() {
	return sortByIdDesc(exhibitions.filter((e) => e.status === 'ongoing'));
}

export function getUpcomingExhibitions() {
	return sortByIdDesc(exhibitions.filter((e) => e.status === 'upcoming'));
}

/** Arkivår = år före innevarande kalenderår */
export function getArchiveYears() {
	const current = getCurrentExhibitionYear();
	const years = [
		...new Set(exhibitions.map(exhibitionYear).filter((y) => y < current))
	];
	return years.sort((a, b) => b - a);
}

/** @param {number} year */
export function getArchiveExhibitions(year) {
	const current = getCurrentExhibitionYear();
	if (year >= current) return [];
	return getYearExhibitions(year);
}

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
