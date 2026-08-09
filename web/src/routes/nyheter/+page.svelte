<script lang="ts">
	import { getNewsIndex } from '$lib/data/mockData.js';
	import Seo from '$lib/components/Seo.svelte';

	let filter = $state('Alla');
	const filters = ['Alla', 'Från galleriet', 'Media'];
	const list = getNewsIndex();

	const filtered = $derived(
		list.filter((item) => filter === 'Alla' || item.category === filter)
	);
</script>

<Seo
	title="Nyheter · GALLERIett"
	description="Nyheter och media om GALLERIett, konstnärer och utställningar på Tjörn."
/>

<section class="band">
	<div class="container head">
		<h1 class="serif">Nyheter</h1>
	</div>
</section>

<section class="band-soft band-pad">
	<div class="container">
		<div class="filters">
			{#each filters as f}
				<button type="button" class:active={filter === f} onclick={() => (filter = f)}>{f}</button>
			{/each}
		</div>

		<div class="grid">
			{#each filtered as item}
				{#if item.clickable}
					<a class="card" href={`/nyheter/${item.slug}`}>
						<img src={item.image} alt="" />
						<p class="label">{item.category}</p>
						<h2 class="serif">{item.title}</h2>
						<p class="date">{item.dateLabel}</p>
						<p class="excerpt">{item.excerpt}</p>
					</a>
				{:else}
					<article class="card static">
						<img src={item.image} alt="" />
						<p class="label">{item.category}</p>
						<h2 class="serif">{item.title}</h2>
						<p class="date">{item.dateLabel}</p>
						<p class="excerpt">{item.excerpt}</p>
					</article>
				{/if}
			{/each}
		</div>
	</div>
</section>

<style>
	.head {
		padding-block: 2.5rem 1rem;
	}

	h1 {
		font-size: clamp(2.2rem, 5vw, 3.5rem);
		margin: 0;
		font-weight: 500;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		border-bottom: 1px solid var(--border);
		padding-bottom: 0.75rem;
		margin-bottom: 2rem;
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

	.grid {
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.card {
		display: block;
		min-width: 0;
	}

	.card:not(.static):hover h2 {
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		margin-bottom: 0.75rem;
		background: #e8e8e2;
	}

	h2 {
		font-size: 1.35rem;
		margin: 0.35rem 0;
		font-weight: 500;
		display: inline;
		box-decoration-break: clone;
	}

	.date {
		font-size: 0.75rem;
		color: var(--text-muted);
		margin: 0.45rem 0 0.5rem;
	}

	.excerpt {
		color: var(--text-secondary);
		margin: 0;
		font-size: var(--text-body);
		line-height: 1.55;
	}

	.label {
		margin: 0;
	}

	@media (max-width: 1100px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 600px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
