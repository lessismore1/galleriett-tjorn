<script lang="ts">
	import { news } from '$lib/data/mockData.js';
</script>

<section class="band">
	<div class="container head">
		<h1 class="serif">Nyheter</h1>
	</div>
</section>

<section class="band-soft band-pad">
	<div class="container">
		<div class="grid">
			{#each news as item}
				<article>
					<img src={item.image} alt="" />
					<p class="label">{item.category}</p>
					<h2 class="serif">{item.title}</h2>
					<p class="date">{item.dateLabel}</p>
					<p>{item.excerpt}</p>
				</article>
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
	}

	.date {
		font-size: 0.75rem;
		color: var(--text-muted);
		margin: 0 0 0.5rem;
	}

	p {
		color: var(--text-secondary);
		margin: 0;
	}
</style>
