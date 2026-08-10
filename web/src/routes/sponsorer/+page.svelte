<script lang="ts">
	import { sponsors } from '$lib/data/mockData.js';
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
</script>

<Seo
	title="Sponsorer · GALLERIett"
	description="Ett varmt tack till GALLERIetts sponsorer och samarbetspartners på Tjörn."
/>

<Breadcrumbs crumbs={[{ name: 'Sponsorer' }]} />

<section class="band">
	<div class="container head">
		<p class="label">Samarbete</p>
		<h1 class="serif">Sponsorer</h1>
		<p class="intro">
			Ett varmt tack till alla som gör GALLERIetts verksamhet möjlig — genom stöd, samarbete och
			närvaro på Tjörn.
		</p>
	</div>
</section>

<section class="band-soft band-pad">
	<div class="container">
		<ul class="grid">
			{#each sponsors as s}
				<li>
					{#if s.url}
						<a
							class="card"
							href={s.url}
							target={s.url.startsWith('http') ? '_blank' : undefined}
							rel={s.url.startsWith('http') ? 'noreferrer' : undefined}
						>
							<img src={s.logo} alt="" />
							<strong class="serif">{s.shortName}</strong>
							<span>{s.name}</span>
						</a>
					{:else}
						<div class="card">
							<img src={s.logo} alt="" />
							<strong class="serif">{s.shortName}</strong>
							<span>{s.name}</span>
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.head {
		padding-block: 2.5rem 1.5rem;
		max-width: 40rem;
	}

	h1 {
		font-size: clamp(2.2rem, 5vw, 3.5rem);
		margin: 0.35rem 0 0.85rem;
		font-weight: 500;
	}

	.intro {
		margin: 0;
		color: var(--text-secondary);
		font-size: var(--text-body);
		line-height: 1.6;
	}

	.grid {
		list-style: none;
		margin: 0;
		padding: 0 0 3rem;
		display: grid;
		gap: 1.25rem;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	}

	.card {
		display: grid;
		gap: 0.65rem;
		padding: 1.25rem;
		background: var(--bg);
		border: 1px solid var(--border);
		min-height: 100%;
		align-content: start;
	}

	.card img {
		width: 100%;
		height: 72px;
		object-fit: contain;
		object-position: left center;
	}

	.card strong {
		font-weight: 500;
		font-size: 1.15rem;
	}

	.card span {
		font-size: 0.85rem;
		color: var(--text-muted);
		line-height: 1.4;
	}
</style>
