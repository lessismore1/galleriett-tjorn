<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ArtistCard from '$lib/components/ArtistCard.svelte';

	let { data } = $props();
	const article = $derived(data.article);
	const relatedArtists = $derived(data.relatedArtists);
	const paragraphs = $derived(
		String(article.body ?? '')
			.split('\n')
			.map((p: string) => p.trim())
			.filter(Boolean)
	);
</script>

<Seo
	title="{article.title} · GALLERIett"
	description={article.excerpt}
	image={article.image}
	type="article"
/>

<Breadcrumbs
	crumbs={[
		{ name: 'Nyheter', href: '/nyheter' },
		{ name: article.title }
	]}
/>

<section class="band band-pad">
	<div class="container">
		<div class="layout">
			<div class="text">
				<p class="label meta">{article.category} · {article.dateLabel}</p>
				<h1 class="serif">{article.title}</h1>
				{#each paragraphs as para}
					<p>{para}</p>
				{/each}
				{#if article.source}
					<p class="source">
						Källa:
						<a href={article.source.url} target="_blank" rel="noreferrer"
							>{article.source.name} →</a
						>
					</p>
				{/if}
			</div>
			<figure class="media">
				<img src={article.image} alt="" />
			</figure>
		</div>
	</div>
</section>

{#if relatedArtists.length}
	<section class="band-soft related-band">
		<div class="container">
			<div class="section-head">
				<h2 class="serif section-title">
					{relatedArtists.length === 1 ? 'Relaterad konstnär' : 'Relaterade konstnärer'}
				</h2>
			</div>
			<div class="related-list">
				{#each relatedArtists as artist}
					<ArtistCard artist={artist} mediaMode="portrait" showIcon={false} showBadge={false} />
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.layout {
		display: grid;
		gap: 2rem;
		align-items: start;
	}

	.meta {
		margin: 0 0 0.65rem;
		color: var(--text-muted);
	}

	h1 {
		font-size: clamp(1.85rem, 4.2vw, 2.85rem);
		margin: 0 0 1.25rem;
		font-weight: 500;
		line-height: 1.2;
	}

	.text p {
		margin: 0 0 1rem;
		font-size: var(--text-body);
		line-height: 1.65;
		color: var(--text-secondary);
	}

	.source {
		margin-top: 1.5rem !important;
		font-size: 0.9rem !important;
	}

	.source a {
		color: var(--text);
		box-shadow: inset 0 -1px 0 var(--brand);
	}

	.media {
		margin: 0;
		background: #e8e8e2;
	}

	.media img {
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		display: block;
	}

	.related-band {
		padding-block: 2.25rem 2.75rem;
	}

	.related-list {
		display: grid;
		gap: 1.25rem 0.85rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@media (min-width: 900px) {
		.related-list {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (min-width: 1100px) {
		.related-list {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (min-width: 901px) {
		.layout {
			grid-template-columns: 1.35fr 0.75fr;
			gap: 3rem;
		}
	}
</style>
