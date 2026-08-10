<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

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
			<p class="label">{relatedArtists.length === 1 ? 'Relaterad konstnär' : 'Relaterade konstnärer'}</p>
			<div class="related-list">
				{#each relatedArtists as artist}
					<a class="related" href={`/konstnarer/${artist.slug}`}>
						<img src={artist.image} alt="" />
						<div>
							<strong class="serif">{artist.name}</strong>
							<span class="label">{artist.specialty}</span>
						</div>
					</a>
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

	.related-band .label {
		margin: 0 0 1rem;
	}

	.related-list {
		display: grid;
		gap: 1.25rem;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
	}

	.related {
		display: grid;
		grid-template-columns: 96px 1fr;
		gap: 1rem;
		align-items: center;
	}

	.related img {
		width: 96px;
		height: 96px;
		object-fit: cover;
		background: #e8e8e2;
	}

	.related strong {
		display: block;
		font-size: 1.35rem;
		font-weight: 500;
		margin-bottom: 0.25rem;
	}

	.related .label {
		margin: 0;
		color: var(--text-muted);
	}

	.related:hover strong {
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	@media (min-width: 901px) {
		.layout {
			grid-template-columns: 1.35fr 0.75fr;
			gap: 3rem;
		}
	}
</style>
