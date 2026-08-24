<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import NewsCard from '$lib/components/NewsCard.svelte';
	import { newsCardHref, newsCardExternal } from '$lib/newsLinks';

	let { data } = $props();

	let filter = $state('Alla');
	const filters = ['Alla', 'Från GALLERIett', 'I pressen'];
	const list = $derived(data.list);

	const filtered = $derived(
		list.filter((item) => filter === 'Alla' || item.category === filter)
	);
</script>

<Seo
	title="Nyheter · GALLERIett"
	description="Nyheter och press om GALLERIett, konstnärer och utställningar på Tjörn."
/>

<Breadcrumbs crumbs={[{ name: 'Nyheter' }]} />

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
				<NewsCard
					href={newsCardHref(item)}
					external={newsCardExternal(item)}
					image={item.image}
					category={item.category}
					title={item.title}
					dateLabel={item.dateLabel}
					excerpt={item.excerpt}
					alt=""
				/>
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
