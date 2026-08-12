<script lang="ts">
	import { artists, getArtistProgram } from '$lib/data/mockData.js';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ArtistCard from '$lib/components/ArtistCard.svelte';

	let filter = $state('Alla konstnärer');
	let query = $state('');

	const filters = [
		'Alla konstnärer',
		'Pågående',
		'Måleri',
		'Skulptur',
		'Glas',
		'Fotografi',
		'Installation'
	];

	const filtered = $derived(
		artists
			.filter((a) => {
				if (filter === 'Alla konstnärer') return true;
				if (filter === 'Pågående') return getArtistProgram(a.slug)?.status === 'ongoing';
				return a.specialty === filter;
			})
			.filter((a) => !query || a.name.toLowerCase().includes(query.toLowerCase()))
			.sort((a, b) => a.name.localeCompare(b.name, 'sv'))
	);
</script>

<Breadcrumbs crumbs={[{ name: 'Konstnärer' }]} />

<section class="band">
	<div class="container intro">
		<div>
			<h1 class="serif">Konstnärer</h1>
			<p>
				GALLERIett representerar konstnärer inom måleri, skulptur, fotografi och installation —
				med fokus på samtidskonst.
			</p>
			<a class="link-arrow" href="/om">Om vårt arbete</a>
		</div>
		<img src="/images/artists-hero.jpg" alt="Galleriinteriör" />
	</div>
</section>

<section class="band-soft">
	<div class="container list-wrap">
		<div class="toolbar">
			<div class="filters">
				{#each filters as f}
					<button type="button" class:active={filter === f} onclick={() => (filter = f)}>{f}</button>
				{/each}
			</div>
			<label class="search">
				<span class="sr">Sök</span>
				<input type="search" placeholder="Sök" bind:value={query} />
			</label>
		</div>

		{#if filtered.length}
			<div class="grid">
				{#each filtered as artist (artist.slug)}
					<ArtistCard {artist} />
				{/each}
			</div>
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
		max-width: 28rem;
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

	.grid {
		display: grid;
		gap: 2rem 1.5rem;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
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
