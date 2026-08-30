<script lang="ts">
	let {
		href = null,
		title,
		image,
		year = null,
		medium = null,
		dimensions = null
	}: {
		href?: string | null;
		title: string;
		image: string;
		year?: number | string | null;
		medium?: string | null;
		dimensions?: string | null;
	} = $props();

	const subtitle = $derived(
		[year, medium, dimensions?.trim() || null].filter(Boolean).join(' · ')
	);

	const tag = $derived(href ? 'a' : 'div');
</script>

<svelte:element this={tag} class="card" {...(href ? { href } : {})}>
	<div class="media">
		<img src={image} alt={title} loading="lazy" decoding="async" />
	</div>
	<div class="meta">
		<h3>{title}</h3>
		{#if subtitle}
			<p>{subtitle}</p>
		{/if}
	</div>
</svelte:element>

<style>
	.card {
		display: flex;
		flex-direction: column;
		min-width: 0;
		height: 100%;
		color: inherit;
		text-decoration: none;
		transition: box-shadow 0.18s ease;
	}

	.media {
		background: #e8e8e2;
		overflow: hidden;
	}

	.media img {
		aspect-ratio: 4 / 5;
		object-fit: cover;
		width: 100%;
		display: block;
		margin: 0;
	}

	.meta {
		flex: 1;
		padding: 0.7rem 0.55rem 0.75rem;
		transition: background-color 0.18s ease;
	}

	.meta h3 {
		margin: 0;
		font-size: 0.7rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		font-family: var(--font-sans);
		font-weight: 700;
	}

	.meta p {
		margin: 0.25rem 0 0;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	@media (hover: hover) and (pointer: fine) {
		.card:hover,
		.card:focus-visible {
			box-shadow: 0 0 0 1px var(--brand);
		}

		.card:hover .meta,
		.card:focus-visible .meta {
			background: var(--card-meta-hover);
		}

		.card:hover .meta h3,
		.card:focus-visible .meta h3 {
			text-decoration: underline;
			text-underline-offset: 0.15em;
			text-decoration-thickness: 1px;
		}
	}
</style>
