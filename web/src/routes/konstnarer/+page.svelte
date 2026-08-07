<script lang="ts">
	import { artists } from '$lib/data/mockData.js';

	let filter = $state('Alla konstnärer');
	let query = $state('');

	const filters = ['Alla konstnärer', 'Måleri', 'Skulptur', 'Fotografi', 'Installation'];

	const filtered = $derived(
		artists
			.filter((a) => filter === 'Alla konstnärer' || a.specialty === filter)
			.filter((a) => !query || a.name.toLowerCase().includes(query.toLowerCase()))
			.sort((a, b) => a.name.localeCompare(b.name, 'sv'))
	);
</script>

<section class="container intro">
	<div>
		<h1 class="serif">Konstnärer</h1>
		<p>
			Galleri Ett representerar konstnärer inom måleri, skulptur, fotografi och installation —
			med fokus på samtidskonst.
		</p>
		<a class="link-arrow" href="/om">Om vårt arbete</a>
	</div>
	<img
		src="https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=900&q=80"
		alt="Galleriinteriör"
	/>
</section>

<section class="container">
	<div class="toolbar">
		<div class="filters">
			{#each filters as f}
				<button class:active={filter === f} onclick={() => (filter = f)}>{f}</button>
			{/each}
		</div>
		<label class="search">
			<span class="sr">Sök</span>
			<input type="search" placeholder="Sök" bind:value={query} />
		</label>
	</div>

	<div class="grid">
		{#each filtered as artist}
			<a class="card" href={`/konstnarer/${artist.slug}`}>
				<img src={artist.image} alt={artist.name} />
				<div class="meta">
					<div>
						<h2 class="serif">{artist.name}</h2>
						<p>{artist.specialty}</p>
					</div>
					<span aria-hidden="true">→</span>
				</div>
			</a>
		{/each}
	</div>
</section>

<section class="cta container">
	<div>
		<h2 class="serif">Vill du veta mer?</h2>
		<p>Har du frågor om konstnärer eller verk? Hör gärna av dig.</p>
		<a class="link-arrow" href="/kontakt">Kontakta Galleri Ett</a>
	</div>
	<img
		src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80"
		alt="Galleriets byggnad"
	/>
</section>

<style>
	.intro {
		display: grid;
		gap: 2rem;
		padding-block: 3rem 2rem;
		align-items: center;
	}

	.intro h1 {
		font-size: clamp(2.5rem, 6vw, 4rem);
		margin: 0 0 1rem;
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
		gap: 1.75rem 1.25rem;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		padding-bottom: 3rem;
	}

	.card img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		margin-bottom: 0.75rem;
	}

	.meta {
		display: flex;
		justify-content: space-between;
		align-items: start;
		gap: 0.5rem;
	}

	.meta span {
		color: var(--brand);
		font-weight: 700;
	}

	h2 {
		font-size: 1.2rem;
		margin: 0;
	}

	.meta p {
		margin: 0.2rem 0 0;
		font-size: 0.65rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.cta {
		display: grid;
		gap: 1.5rem;
		padding-block: 2rem 3rem;
	}

	.cta h2 {
		font-size: clamp(1.8rem, 4vw, 2.5rem);
		margin: 0 0 0.75rem;
	}

	.cta p {
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.cta img {
		width: 100%;
		aspect-ratio: 21 / 9;
		object-fit: cover;
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
