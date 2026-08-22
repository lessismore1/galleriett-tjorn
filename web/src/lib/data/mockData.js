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
				image: '/images/work-1.jpg',
				story:
					'Horisonten ligger lågt, som ett minne. Färglagren bygger ett landskap där hav och himmel nästan byter plats — en vintergata inåt snarare än utåt.'
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
				id: 106,
				title: 'Tystnadens rum',
				venue: 'GALLERIett, Tjörn',
				slug: '106-erik-halvorsen-tystnadens-rum'
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
	},
	{
		id: '09',
		slug: '09-robert-oldergaarden',
		name: 'Robert Oldergaarden',
		specialty: 'Glas',
		born: '1967, Öland, Sverige',
		education: [
			'Keramikstudier, Capellagården, 1987–1989',
			'Riksglasskolan i Orrefors, 1989–1997',
			'Lärarhögskolan i Malmö – Lunds universitet, 1997–1999'
		],
		lives: 'Triberga, Öland, Sverige',
		representedIn: ['Sverige', 'Europa'],
		intro:
			'Robert Oldergaarden är glaskonstnär och glasmästare med över 30 års erfarenhet. Han arbetar i varmt och kallt glas — ofta i den avancerade Graaltekniken — med inspiration från Ölands natur, fågelliv och historia.',
		bio: 'Robert Oldergaarden (född 5 februari 1967) är en svensk glaskonstnär och glasmästare verksam på Öland. Han växte upp på ön, började tidigt med keramik och övergick vid 20 års ålder till glaskonst. Under sent 1980-tal kom han som lärling till Orrefors Kosta Boda och lärde sig traditionella tekniker av dåtidens främsta mästare. Därefter arbetade han närmare tio år som lärare på Riksglasskolan i Orrefors, där han utbildade en ny generation glasblåsare och formgivare.\n\nSedan 2010-talet driver han Robert Oldergaarden Glashytta på familjegården i Triberga på sydöstra Öland — en gård som varit i släktens ägo sedan 1700-talet. Här ryms hytta, slipverkstad, ateljé och butik; besökare kan ofta se hantverket på plats.\n\nOldergaarden arbetar med både varmt och kallt glas. Hans signum är unikt konstglas i Graal- och Arielteknik. Inspirationen hämtas från Ölands natur, fågellivet och sagornas värld, liksom lokal historia och vikingatiden — bland annat en stor silverskatt som hans förfäder en gång plöjde upp på ägorna. Han ställer ut i Sverige och internationellt, bland annat i Venedig, Belgien, Nederländerna och på konstmässan i Louvren i Paris.',
		website: 'https://oldergaard.se/',
		image: '/images/artist-robert.jpg',
		heroImage: null,
		works: [
			{
				title: 'Glasverk I',
				year: 2026,
				medium: 'Glas, Graal',
				dimensions: '',
				image: '/images/work-robert-a.jpg',
				story:
					'Graaltekniken låter färgen vila under klarglas. Ljuset går genom lagren och ger verket en stilla, nästan andande närvaro i rummet.'
			},
			{
				title: 'Glasverk II',
				year: 2026,
				medium: 'Glas',
				dimensions: '',
				image: '/images/work-robert-b.jpg'
			},
			{
				title: 'Glasverk III',
				year: 2026,
				medium: 'Glas, Ariel',
				dimensions: '',
				image: '/images/work-robert-c.jpg'
			},
			{
				title: 'Glasverk IV',
				year: 2026,
				medium: 'Glas',
				dimensions: '',
				image: '/images/work-robert-d.jpg'
			},
			{
				title: 'Glas på disk',
				year: 2026,
				medium: 'Glas',
				dimensions: '',
				image: '/images/work-robert-e.jpg'
			}
		],
		exhibitions: [
			{
				year: 2026,
				id: 104,
				title: 'Ljus Färg Form',
				venue: 'GALLERIett, Tjörn',
				slug: '104-ljus-farg-form'
			}
		],
		press: []
	},
	{
		id: '10',
		slug: '10-kattis-palmnas',
		name: 'Kattis Palmnäs',
		specialty: 'Måleri',
		born: '1971, Sverige',
		education: [],
		lives: 'Floda, Lerums kommun, Sverige',
		representedIn: ['Sverige', 'Torrevieja', 'Marbella'],
		intro:
			'Kattis Palmnäs är konstnär och mönsterformgivare med ett färgstarkt, energifyllt uttryck. Genom måleri, mönster och projekt vill hon sprida glädje, reflektion och mod att stå upp för vem man är.',
		bio: 'Katja Katarina ”Kattis” Palmnäs, född 22 januari 1971, är en svensk konstnär, mönsterformgivare och entreprenör baserad i Floda, Lerums kommun. Hon driver sin kreativa verksamhet genom bolaget Tim Tiger K Palmnäs Art AB.\n\nPalmnäs beskriver sig som en född kreatör. Redan som barn sökte hon leran i sandlådan för att skulptera — driven av fart, skaparglädje och ett intuitivt, snabbt arbetssätt. Hennes stil är mångfacetterad: hon experimenterar med material, texturer och tekniker, och rör sig mellan färgstark popkonst, abstrakta ansikten, djurmotiv och natur. Målet är att fånga starka känslor och inspirera betraktaren att våga släppa rädslor.\n\nHon har ställt ut bland annat på Nääs Fabriker, Hägernäs Strands Galleri och i Stockholm, och öppnade hösten 2024 ett eget galleri vid Bagges Torg i Lerum. Verken finns även representerade i Torrevieja och Marbella. Utöver originalmålningar och konsttryck designar hon mönster åt aktörer som Nordiska Designkompaniet.\n\nEtt centralt inslag är engagemanget för medmänniskor: hon har deltagit i flera välgörenhetsgalor där målningar auktionerats ut till förmån för hjälporganisationer.',
		website: 'https://kpalmnasart.se/',
		image: '/images/artist-kattis.jpg',
		heroImage: null,
		works: [
			{
				title: 'Porträtt med jordgubbar',
				year: 2026,
				medium: 'Akryl på duk',
				dimensions: '',
				image: '/images/work-kattis-a.jpg',
				story:
					'Ett lejon och en fjäril — kraft och skörhet i samma bildyta. Jordgubbarna är en lekfull detalj, men blicken är allvarlig: vem vågar vara både vild och öm?\n\nMålningen är tänkt som en påminnelse om att styrka och lätthet kan bo i samma porträtt.'
			},
			{
				title: 'Verk II',
				year: 2025,
				medium: 'Akryl på duk',
				dimensions: '',
				image: '/images/work-kattis-b.jpg',
				story: 'Färg som energi. Ett porträtt där lager av akryl får ansiktet att vibrera mellan närvaro och dröm.'
			},
			{
				title: 'Verk III',
				year: 2025,
				medium: 'Akryl på duk',
				dimensions: '',
				image: '/images/work-kattis-c.jpg'
			}
		],
		exhibitions: [
			{
				year: 2026,
				id: 104,
				title: 'Ljus Färg Form',
				venue: 'GALLERIett, Tjörn',
				slug: '104-ljus-farg-form'
			}
		],
		press: []
	}
];

export const exhibitions = [
	{
		id: 106,
		slug: '106-erik-halvorsen-tystnadens-rum',
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
		id: 105,
		slug: '105-sara-lindqvist-vintergata',
		artistSlug: '01-sara-lindqvist',
		artist: 'Sara Lindqvist',
		title: 'Vintergata',
		status: 'upcoming',
		start: '2026-08-12',
		end: '2026-09-20',
		datesLabel: '12 AUG – 20 SEP 2026',
		location: 'GALLERIett, Tjörn',
		vernissage: '2026-08-12T18:00:00',
		intro:
			'I Vintergata möter Sara Lindqvist landskapet som minne och närvaro — ett måleri där hav, ljus och tystnad får ta plats.',
		pressRelease:
			'Sara Lindqvist visar nya målningar i utställningen Vintergata på GALLERIett. Verken rör sig mellan horisont och inre landskap, med ett måleri som bygger lager av färg, ljus och stillhet. Utställningen pågår 12 augusti–20 september 2026.',
		image: '/images/work-1.jpg',
		cardImage: '/images/work-1.jpg',
		works: [
			{ title: 'Vintergata', image: '/images/work-1.jpg' },
			{ title: 'Silentium', image: '/images/work-2.jpg' },
			{ title: 'Horisont i dimma', image: '/images/work-3.jpg' },
			{ title: 'Nattljus', image: '/images/work-4.jpg' },
			{ title: 'Innan regnet', image: '/images/work-5.jpg' },
			{ title: 'Låg tid', image: '/images/work-6.jpg' }
		],
		installationViews: [
			'/images/install-a.jpg?v=3',
			'/images/install-b.jpg?v=3',
			'/images/install-c.jpg?v=3'
		]
	},
	{
		id: 104,
		slug: '104-ljus-farg-form',
		artistSlug: '10-kattis-palmnas',
		artistSlugs: ['10-kattis-palmnas', '09-robert-oldergaarden'],
		artist: 'Kattis Palmnäs & Robert Oldergaarden',
		title: 'Ljus Färg Form',
		status: 'ongoing',
		start: '2026-08-01',
		end: '2026-08-09',
		datesLabel: '1 – 9 AUG 2026',
		location: 'GALLERIett, Tjörn',
		vernissage: '2026-08-01T13:00:00',
		intro:
			'Två uttryck — en utställning. Kattis Palmnäs färgsprakande måleri möter Robert Oldergaarden unika glaskonst, där glasets ljus möter dukens färgexplosion.',
		facebookEventUrl: 'https://www.facebook.com/events/1668416974242177',
		pressRelease:
			'Välkommen till utställningen Ljus Färg Form med Kattis Palmnäs och Robert Oldergaarden, 1–9 augusti 2026.\n\nRobert Oldergaarden är mästarutbildad glaskonstnär med rötter från Orrefors/Kosta Boda och tidigare lärare vid Riksglasskolan. Idag verkar han i sin egen hytta på Öland och skapar magiska, stämningsfulla och lysande glasverk.\n\nKattis Palmnäs (K. Palmnäs ART) är känd för storskaliga, färgsprakande akrylmålningar och uttrycksfulla porträtt. Hennes konst sprider energi och har nått bland annat kungliga samlingar hos Prins Albert av Monaco.\n\nTillsammans skapar deras verk en unik helhet där glasets ljus möter dukens färg. Vernissage 1 augusti kl. 13. Öppet alla dagar kl. 13–18. Fri entré.',
		image: '/images/ex-104-ljus-farg-form.jpg',
		cardImage: '/images/ex-104-ljus-farg-form.jpg',
		works: [
			{ title: 'Porträtt med jordgubbar — Kattis Palmnäs', image: '/images/work-kattis-a.jpg' },
			{ title: 'Verk II — Kattis Palmnäs', image: '/images/work-kattis-b.jpg' },
			{ title: 'Verk III — Kattis Palmnäs', image: '/images/work-kattis-c.jpg' },
			{ title: 'Glasverk I — Robert Oldergaarden', image: '/images/work-robert-a.jpg' },
			{ title: 'Glasverk II — Robert Oldergaarden', image: '/images/work-robert-b.jpg' },
			{ title: 'Glasverk III — Robert Oldergaarden', image: '/images/work-robert-c.jpg' },
			{ title: 'Glasverk IV — Robert Oldergaarden', image: '/images/work-robert-d.jpg' },
			{ title: 'Glas på disk — Robert Oldergaarden', image: '/images/work-robert-e.jpg' }
		],
		installationViews: [
			'/images/install-104-ljus-a.jpg',
			'/images/install-104-ljus-b.jpg',
			'/images/install-104-ljus-c.jpg'
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
		id: 101,
		slug: '101-ljus-farg-form',
		kind: 'news',
		category: 'Från galleriet',
		title: 'Ljus Färg Form — Kattis Palmnäs & Robert Oldergaarden',
		date: '2026-07-25',
		dateLabel: '25 JULI 2026',
		image: '/images/ex-104-ljus-farg-form.jpg',
		thumb: '/images/ex-104-ljus-farg-form.jpg',
		excerpt:
			'GALLERIett presenterar sommarutställningen Ljus Färg Form med Kattis Palmnäs och Robert Oldergaarden, 1–9 augusti.',
		clickable: true,
		artistSlugs: ['10-kattis-palmnas', '09-robert-oldergaarden'],
		exhibitionSlug: '104-ljus-farg-form',
		body: 'GALLERIett bjuder in till sommarutställningen Ljus Färg Form med Kattis Palmnäs och Robert Oldergaarden, 1–9 augusti 2026.\n\nTvå uttryck — en utställning: Palmnäs färgsprakande måleri möter Oldergaarden unika glaskonst, där glasets ljus möter dukens färgexplosion.\n\nVernissage 1 augusti kl. 13. Öppet alla dagar kl. 13–18. Fri entré i GALLERIett, Marinvägen 9, Hall 1, Rönnäng.'
	},
	{
		id: 102,
		slug: '102-robert-oldergaarden-louvren-edsbruk',
		kind: 'press',
		category: 'Media',
		title: 'Robert nobbar Manhattan – men tackar ja till Louvren och Edsbruk',
		date: '2025-07-09',
		dateLabel: '9 JULI 2025',
		image: '/images/artist-robert.jpg',
		thumb: '/images/artist-robert.jpg',
		excerpt:
			'Glaskonstnären Robert Oldergaarden har ställt ut på Louvren — och valt att visa konstglas i Edsbruk.',
		clickable: true,
		artistSlug: '09-robert-oldergaarden',
		source: {
			name: 'Västerviks-Tidningen',
			url: 'https://www.vt.se/nyheter/edsbruk/artikel/robert-nobbar-manhattan-men-tackar-ja-till-louvren-och-edsbruk/lyv0yepl'
		},
		body: 'Glaskonstnären Robert Oldergaarden har ställt ut konst på Louvren och sålt glas till shejkar — men väljer att också visa sin konst i den gamla kvarnen i lilla Edsbruk.\n\n– Jag blåser med munnen och formar med handen, det är min melodi, säger Robert Oldergaarden.\n\nHans intresse för hantverk började tidigt. Efter glasskolan i Orrefors och många år vid bruket och Riksglasskolan driver han idag egen glashytta på släktgården på Öland. Den internationella banan har gått via Japan, Monaco och Louvren — samtidigt som han tackar nej till Manhattan för att hinna sköta butiker och möta människor på närmare håll.\n\n– När jag kom till Edsbruk blev jag helt förälskad i stället, och jag älskar människorna. Jag lever för att möta människor, jag är inte uppe i det blå bara för att jag är framgångsrik.'
	},
	{
		id: 103,
		slug: '103-kattis-palmnas-galleri-bagges-torg',
		kind: 'press',
		category: 'Media',
		title: 'Kattis Palmnäs öppnar nytt galleri på Bagges Torg',
		date: '2024-09-21',
		dateLabel: '21 SEPTEMBER 2024',
		image: '/images/artist-kattis.jpg',
		thumb: '/images/artist-kattis.jpg',
		excerpt:
			'Lerums Tidning om Kattis Palmnäs nya galleri vid Bagges Torg — en lokal plats för färgstark konst.',
		clickable: true,
		artistSlug: '10-kattis-palmnas',
		source: {
			name: 'Lerums Tidning',
			url: 'https://www.lerumstidning.se/nyheter/snart-finns-det-chans-att-se-konst-i-kattis-palmnas-nya-galleri-pa-bagges-torg-.95cada5f-8c87-4c86-bc06-3b8dfeba6860'
		},
		body: 'Kattis Palmnäs har etablerat sig med ett färgstarkt, energifyllt måleri — och expanderade hösten 2024 lokalt genom att öppna ett eget galleri vid Bagges Torg i Lerum.\n\nI Lerums Tidning berättas om chansen att se hennes konst på plats i det nya galleriet: en mötespunkt där målningar, uttryck och publik kan mötas i vardagen.\n\nPalmnäs är verksam via Tim Tiger K Palmnäs Art AB och arbetar med storskaliga akrylmålningar, porträtt och mönster. Galleriet i Lerum kompletterar hennes närvaro på andra orter och i samarbeten utanför Sverige.'
	},
	{
		slug: 'paletten',
		kind: 'news',
		category: 'Media',
		title: 'Galleriet i konstmagasinet Paletten',
		date: '2026-07-28',
		dateLabel: '28 JULI 2026',
		image: '/images/news-1.jpg',
		thumb: '/images/news-1.jpg',
		excerpt: 'Reportage om Galleri Ett och samtidskonsten på Tjörn.',
		clickable: false
	},
	{
		slug: 'sommarvernissage',
		kind: 'news',
		category: 'Från galleriet',
		title: 'Sommarvernissage med konstnärssamtal',
		date: '2026-07-15',
		dateLabel: '15 JULI 2026',
		image: '/images/news-2.jpg',
		thumb: '/images/news-2.jpg',
		excerpt: 'Vernissage och samtal med deltagande konstnärer.',
		clickable: false
	},
	{
		slug: 'ny-konstnar-host',
		kind: 'news',
		category: 'Från galleriet',
		title: 'Ny konstnär till hösten 2026',
		date: '2026-07-08',
		dateLabel: '8 JULI 2026',
		image: '/images/news-3.jpg',
		thumb: '/images/news-3.jpg',
		excerpt: 'Galleri Ett välkomnar en ny konstnär till höstens program.',
		clickable: false
	}
];

/** Alla nyheter/media, nyast först */
export function getNewsIndex() {
	return [...news].sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export function getNewsArticle(slug) {
	return news.find((n) => n.slug === slug && n.clickable);
}

export function getArtistNews(artistSlug) {
	return news.filter(
		(n) =>
			n.kind === 'news' &&
			n.clickable &&
			(n.artistSlug === artistSlug || n.artistSlugs?.includes(artistSlug))
	);
}

export function getArtistPress(artistSlug) {
	return news.filter((n) => n.kind === 'press' && n.clickable && n.artistSlug === artistSlug);
}

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
	return [...exhibitions.filter((e) => e.status === 'upcoming')].sort((a, b) =>
		String(a.start).localeCompare(String(b.start))
	);
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

/**
 * Pågående/kommande utställning där konstnären ingår (prioriterar pågående).
 * @param {string} artistSlug
 * @returns {{ status: 'ongoing' | 'upcoming', exhibition: (typeof exhibitions)[number] } | null}
 */
export function getArtistProgram(artistSlug) {
	/** @param {(typeof exhibitions)[number]} e */
	const inShow = (e) =>
		e.artistSlug === artistSlug ||
		(Array.isArray(e.artistSlugs) && e.artistSlugs.includes(artistSlug));

	const ongoing = exhibitions.find((e) => e.status === 'ongoing' && inShow(e));
	if (ongoing) return { status: 'ongoing', exhibition: ongoing };

	const upcoming = exhibitions.find((e) => e.status === 'upcoming' && inShow(e));
	if (upcoming) return { status: 'upcoming', exhibition: upcoming };

	return null;
}

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
 * Verk-slug: `{id}-{titel}-{år}` (id från 1001). Konstnär finns redan i pathen.
 * @param {{ id: number, title: string, year: number }} work
 */
export function workSlugOf(work) {
	return `${work.id}-${slugifySegment(work.title)}-${work.year}`;
}

/** @param {string} src */
function normalizeImageSrc(src) {
	return String(src || '').split('?')[0];
}

/** Tilldela id/slug/availability på konstnärernas verk (mock). */
let nextWorkId = 1001;
for (const artist of artists) {
	for (const work of artist.works ?? []) {
		if (work.id == null) work.id = nextWorkId++;
		if (work.year == null) work.year = new Date().getFullYear();
		if (!work.slug) work.slug = workSlugOf(work);
		if (!work.availability) work.availability = 'enquire';
	}
}

/**
 * @param {string} artistSlug
 * @param {string} workSlug
 */
export function getArtistWork(artistSlug, workSlug) {
	const artist = artists.find((a) => a.slug === artistSlug);
	if (!artist) return null;
	const work = (artist.works ?? []).find((w) => w.slug === workSlug || String(w.id) === workSlug);
	if (!work) return null;
	return { artist, work };
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

/** Hitta verk via bild (för utställningslistor). */
export function findWorkRefByImage(image) {
	const img = normalizeImageSrc(image);
	if (!img) return null;
	for (const artist of artists) {
		for (const work of artist.works ?? []) {
			if (normalizeImageSrc(work.image) === img) {
				return { artist, work };
			}
		}
	}
	return null;
}

/**
 * Utställningens verk i hängningsordning, resolvade till artist+work.
 * @param {string} showSlug
 */
export function getExhibitionWorkSequence(showSlug) {
	const exhibition = exhibitions.find((e) => e.slug === showSlug);
	if (!exhibition) return null;

	/** @type {{ artist: (typeof artists)[number], work: (typeof artists)[number]['works'][number] }[]} */
	const items = [];
	for (const entry of exhibition.works ?? []) {
		const ref = findWorkRefByImage(entry.image);
		if (ref) items.push(ref);
	}
	if (!items.length) return null;
	return { exhibition, items };
}

/**
 * Prev/next bland utställningens verk (alla konstnärer i showen).
 * @param {string} showSlug
 * @param {string} workSlug
 */
export function getShowBrowse(showSlug, workSlug) {
	const seq = getExhibitionWorkSequence(showSlug);
	if (!seq) return null;

	const index = seq.items.findIndex((item) => item.work.slug === workSlug);
	if (index < 0) return null;

	const total = seq.items.length;
	const prev = seq.items[(index - 1 + total) % total];
	const next = seq.items[(index + 1) % total];

	return {
		exhibition: seq.exhibition,
		index,
		total,
		prev,
		next,
		allHref: `/utstallningar/${seq.exhibition.slug}#works`
	};
}

/** Utställningar där bilden ingår i verklistan. */
export function getExhibitionsFeaturingImage(image) {
	const img = normalizeImageSrc(image);
	return exhibitions.filter((e) =>
		(e.works ?? []).some((w) => normalizeImageSrc(w.image) === img)
	);
}

/** Alla verk-rutter för prerender. */
export function getAllWorkEntries() {
	/** @type {{ slug: string, workSlug: string }[]} */
	const list = [];
	for (const artist of artists) {
		for (const work of artist.works ?? []) {
			list.push({ slug: artist.slug, workSlug: work.slug });
		}
	}
	return list;
}
