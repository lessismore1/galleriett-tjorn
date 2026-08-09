<script lang="ts">
	import { news } from '$lib/data/mockData.js';
	import Seo from '$lib/components/Seo.svelte';
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
		<div class="grid">
			{#each news as item}
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

	.grid {
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
</style>
