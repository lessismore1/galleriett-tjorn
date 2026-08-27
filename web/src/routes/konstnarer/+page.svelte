<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ArtistCard from '$lib/components/ArtistCard.svelte';
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();
	const artists = $derived(data.artists);

	const filters = [
		'Alla',
		'Samtida',
		'Historiska',
		'Aktuellt',
		'Måleri',
		'Skulptur',
		'Glas',
		'Fotografi',
		'Installation'
	] as const;

	type Filter = (typeof filters)[number];
	type Artist = (typeof artists)[number];

	/** Query-värde för filter (UX / tillbaka-knapp). Canonical förblir /konstnarer. */
	const filterToParam: Record<Filter, string | null> = {
		Alla: null,
		Samtida: 'samtida',
		Historiska: 'historiska',
		Aktuellt: 'aktuellt',
		Måleri: 'maleri',
		Skulptur: 'skulptur',
		Glas: 'glas',
		Fotografi: 'fotografi',
		Installation: 'installation'
	};

	const paramToFilter = $derived.by(() => {
		const map: Record<string, Filter> = {};
		for (const f of filters) {
			const p = filterToParam[f];
			if (p) map[p] = f;
		}
		return map;
	});

	function filterFromSearch(search: string): Filter {
		const raw = new URLSearchParams(search).get('filter');
		if (!raw) return 'Alla';
		if (raw === 'alla' || raw === 'alla-konstnarer') return 'Alla';
		return paramToFilter[raw] ?? 'Alla';
	}

	function isHistorical(a: Artist) {
		return a.profileKind === 'historical' || Boolean(a.deceased);
	}

	function matchesMedium(a: Artist, medium: string) {
		const s = (a.specialty || '').toLowerCase();
		const key = medium.toLowerCase();
		if (key === 'måleri') {
			return /måleri|olja|akvarell|akryl|teckn/.test(s);
		}
		return s.includes(key);
	}

	/** Prerender får inte läsa url.search — default vid build, synka från URL i webbläsaren. */
	let filter = $state<Filter>('Alla');
	let query = $state('');

	$effect(() => {
		if (!browser) return;
		const fromUrl = filterFromSearch(page.url.search);
		if (fromUrl !== filter) filter = fromUrl;
	});

	function setFilter(next: Filter) {
		filter = next;
		const param = filterToParam[next];
		const href = param
			? `${page.url.pathname}?filter=${encodeURIComponent(param)}`
			: page.url.pathname;
		goto(href, { keepFocus: true, noScroll: true, replaceState: false });
	}

	const filtered = $derived(
		artists
			.filter((a) => {
				if (filter === 'Alla') return true;
				if (filter === 'Samtida') return !isHistorical(a);
				if (filter === 'Historiska') return isHistorical(a);
				if (filter === 'Aktuellt') {
					const status = a.program?.status;
					return status === 'ongoing' || status === 'upcoming';
				}
				return matchesMedium(a, filter);
			})
			.filter((a) => !query || a.name.toLowerCase().includes(query.toLowerCase()))
			.sort((a, b) => {
				if (filter === 'Aktuellt') {
					const rank = (artist: Artist) => (artist.program?.status === 'ongoing' ? 0 : 1);
					const d = rank(a) - rank(b);
					if (d !== 0) return d;
				}
				return a.name.localeCompare(b.name, 'sv');
			})
	);

	const samtida = $derived(filtered.filter((a) => !isHistorical(a)));
	const historiska = $derived(filtered.filter((a) => isHistorical(a)));
	/** Två sektioner när vi visar blandat (Alla) eller medium/aktuellt med båda grupper. */
	const useSections = $derived(
		filter === 'Alla' ||
			((filter === 'Aktuellt' ||
				filter === 'Måleri' ||
				filter === 'Skulptur' ||
				filter === 'Glas' ||
				filter === 'Fotografi' ||
				filter === 'Installation') &&
				samtida.length > 0 &&
				historiska.length > 0)
	);
</script>

<Seo
	title="Konstnärer · GALLERIett"
	description="Samtida och historiska konstnärer på GALLERIett, Tjörn — island of art med både nutid och lokal konsthistoria."
	image="/images/artists-hero.jpg"
/>

<Breadcrumbs crumbs={[{ name: 'Konstnärer' }]} />

<section class="band">
	<div class="container intro">
		<div>
			<h1 class="serif">Konstnärer</h1>
			<p>
				Samtida konst — och historiska Tjörnkonstnärer. GALLERIett ger plats åt båda, så att
				«island of art» rymmer nutid och lokal konsthistoria.
			</p>
			<a class="link-arrow" href="/om">Om vårt arbete</a>
		</div>
		<img src="/images/artists-hero.jpg" alt="Galleriinteriör" />
	</div>
</section>

<section class="band-soft">
	<div class="container list-wrap">
		<div class="toolbar">
			<div class="filters" role="tablist" aria-label="Filtrera konstnärer">
				{#each filters as f}
					<button type="button" class:active={filter === f} onclick={() => setFilter(f)}>{f}</button>
				{/each}
			</div>
			<label class="search">
				<span class="sr">Sök</span>
				<input type="search" placeholder="Sök" bind:value={query} />
			</label>
		</div>

		{#if filtered.length}
			{#if useSections}
				<section class="artist-section" id="samtida" aria-labelledby="heading-samtida">
					<header class="section-head">
						<h2 id="heading-samtida" class="serif">Samtida</h2>
						<p>Levande konstnärer i programmet — måleri, skulptur, glas och mer.</p>
					</header>
					{#if samtida.length}
						<div class="grid">
							{#each samtida as artist (artist.slug)}
								<ArtistCard {artist} />
							{/each}
						</div>
					{:else}
						<p class="empty">Inga samtida konstnärer i detta filter.</p>
					{/if}
				</section>

				<section class="artist-section historiska" id="historiska" aria-labelledby="heading-historiska">
					<header class="section-head">
						<h2 id="heading-historiska" class="serif">Historiska</h2>
						<p>
							Tidigare Tjörn- och Bohuslänkonstnärer vars verk fortfarande ställs ut — en del av
							öns konsthistoria som få gallerier ger plats.
						</p>
					</header>
					{#if historiska.length}
						<div class="grid">
							{#each historiska as artist (artist.slug)}
								<ArtistCard {artist} />
							{/each}
						</div>
					{:else}
						<p class="empty">Inga historiska konstnärer i detta filter.</p>
					{/if}
				</section>
			{:else if filter === 'Historiska'}
				<section class="artist-section historiska" aria-labelledby="heading-historiska-only">
					<header class="section-head">
						<h2 id="heading-historiska-only" class="serif">Historiska</h2>
						<p>
							Tidigare Tjörn- och Bohuslänkonstnärer vars verk fortfarande ställs ut — en del av
							öns konsthistoria som få gallerier ger plats.
						</p>
					</header>
					<div class="grid">
						{#each filtered as artist (artist.slug)}
							<ArtistCard {artist} />
						{/each}
					</div>
				</section>
			{:else if filter === 'Samtida'}
				<section class="artist-section" aria-labelledby="heading-samtida-only">
					<header class="section-head">
						<h2 id="heading-samtida-only" class="serif">Samtida</h2>
					</header>
					<div class="grid">
						{#each filtered as artist (artist.slug)}
							<ArtistCard {artist} />
						{/each}
					</div>
				</section>
			{:else}
				<div class="grid">
					{#each filtered as artist (artist.slug)}
						<ArtistCard {artist} />
					{/each}
				</div>
			{/if}
		{:else}
			<p class="empty">Inga konstnärer matchar filtret.</p>
		{/if}
	</div>
</section>

<section class="band band-pad">
	<div class="container cta">
		<div>
			<h2 class="serif">Vill du veta mer?</h2>
			<p>Har du frågor om konstnärer eller verk? Hör gärna av dig.</p>
			<a class="link-arrow" href="/kontakt">Kontakta GALLERIett</a>
		</div>
		<img src="/images/about-building.jpg" alt="Galleriets byggnad" />
	</div>
</section>

<style>
	.intro {
		display: grid;
		gap: 2rem;
		padding-block: 3rem 2.5rem;
		align-items: center;
	}

	.intro h1 {
		font-size: clamp(2.5rem, 6vw, 4rem);
		margin: 0 0 1rem;
		font-weight: 500;
	}

	.intro p {
		color: var(--text-secondary);
		max-width: 32rem;
		margin-bottom: 1rem;
	}

	.intro img {
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		max-height: 420px;
		background: #e8e8e2;
	}

	.list-wrap {
		padding-block: 2rem 3rem;
	}

	.toolbar {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		border-bottom: 1px solid var(--border);
		padding-bottom: 0.75rem;
		margin-bottom: 2rem;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.filters button {
		background: none;
		border: none;
		font: inherit;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
		cursor: pointer;
		padding: 0 0 0.75rem;
	}

	.filters button.active {
		color: var(--text);
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	.search input {
		border: none;
		border-bottom: 1px solid var(--border);
		padding: 0.4rem 0;
		font: inherit;
		min-width: 8rem;
		background: transparent;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	.artist-section {
		margin-bottom: 3rem;
	}

	.artist-section:last-child {
		margin-bottom: 0;
	}

	.section-head {
		margin-bottom: 1.5rem;
		max-width: 40rem;
	}

	.section-head h2 {
		font-size: clamp(1.6rem, 3vw, 2.1rem);
		font-weight: 500;
		margin: 0 0 0.4rem;
	}

	.section-head p {
		margin: 0;
		color: var(--text-secondary);
		font-size: var(--text-body, 1rem);
		line-height: 1.5;
	}

	.historiska .section-head h2 {
		/* ingen lila/glow — bara tydlig sektion */
	}

	.grid {
		display: grid;
		gap: 2rem 1.5rem;
		grid-template-columns: 1fr;
	}

	@media (min-width: 600px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 900px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1100px) {
		.grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.empty {
		margin: 0;
		color: var(--text-secondary);
	}

	.cta {
		display: grid;
		gap: 1.5rem;
	}

	.cta h2 {
		font-size: clamp(1.8rem, 4vw, 2.5rem);
		margin: 0 0 0.75rem;
		font-weight: 500;
	}

	.cta p {
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.cta img {
		width: 100%;
		aspect-ratio: 21 / 9;
		object-fit: cover;
		background: #e8e8e2;
	}

	@media (min-width: 900px) {
		.intro {
			grid-template-columns: 1fr 0.9fr;
		}

		.cta {
			grid-template-columns: 0.8fr 1.2fr;
			align-items: center;
		}
	}
</style>
