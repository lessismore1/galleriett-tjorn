<script lang="ts">
	import { statusLabels } from '$lib/labels.js';

	let {
		href = null,
		leading = null,
		title,
		line2 = null,
		subtitle = null,
		intro = null,
		image = null,
		status = null,
		showPlus = true
	}: {
		href?: string | null;
		leading?: string | number | null;
		title: string;
		/** Sekundär rubrik (t.ex. utställningstitel) — italic som på detalj-hero */
		line2?: string | null;
		subtitle?: string | null;
		intro?: string | null;
		image?: string | null;
		status?: string | null;
		showPlus?: boolean;
	} = $props();

	const tag = $derived(
		status === 'ongoing'
			? { text: statusLabels.ongoing, muted: false }
			: status === 'upcoming'
				? { text: statusLabels.upcoming, muted: true }
				: null
	);

	const el = $derived(href ? 'a' : 'div');
</script>

<li class="item">
	<svelte:element
		this={el}
		class="row"
		class:no-media={!image}
		{...(href ? { href } : {})}
	>
		<div class="body">
			{#if leading != null && leading !== ''}
				<p class="leading">{leading}</p>
			{/if}
			<strong class="serif title">{title}</strong>
			{#if line2}
				<p class="line2 serif">{line2}</p>
			{/if}
			{#if subtitle}
				<p class="subtitle">{subtitle}</p>
			{/if}
			{#if intro}
				<p class="intro">{intro}</p>
			{/if}
			{#if showPlus && href}
				<span class="more" aria-hidden="true">Läs mer →</span>
			{/if}
		</div>

		{#if image}
			<div class="media">
				<img src={image} alt="" />
				{#if tag}
					<span class="tag" class:muted={tag.muted}>{tag.text}</span>
				{/if}
			</div>
		{/if}
	</svelte:element>
</li>

<style>
	.item {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.row {
		display: grid;
		/* Samma kolumnrytm som utställningsdetalj-hero */
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.15fr);
		gap: 1.5rem 2.75rem;
		align-items: center;
		padding: 2.25rem 0;
		border-bottom: 1px solid var(--border);
		color: inherit;
		text-decoration: none;
		transition: background-color 0.18s ease;
	}

	.row.no-media {
		grid-template-columns: 1fr;
	}

	.body {
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.leading {
		margin: 0 0 0.35rem;
		font-size: var(--text-label);
		font-weight: 600;
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.title {
		display: block;
		margin: 0;
		font-size: clamp(1.55rem, 3vw, 2.15rem);
		font-weight: 500;
		line-height: 1.12;
	}

	.line2 {
		margin: 0.2rem 0 0;
		font-size: clamp(1.15rem, 2.2vw, 1.45rem);
		font-weight: 500;
		font-style: italic;
		line-height: 1.2;
		color: var(--text);
	}

	.subtitle {
		margin: 0.55rem 0 0;
		font-size: var(--text-meta, 0.75rem);
		font-weight: 600;
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.intro {
		margin: 0.85rem 0 0;
		max-width: 32rem;
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-secondary);
	}

	.more {
		margin-top: 1.35rem;
		font-size: var(--text-label);
		font-weight: 700;
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.media {
		position: relative;
		min-width: 0;
		aspect-ratio: 16 / 11;
		background: #e8e8e2;
		overflow: hidden;
	}

	.media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
		transition: transform 0.35s ease;
	}

	.tag {
		position: absolute;
		top: 0.65rem;
		left: 0.65rem;
		z-index: 1;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.25rem 0.4rem;
		background: var(--brand);
		color: var(--brand-dark);
	}

	.tag.muted {
		background: #fff;
		border: 1px solid var(--border);
		color: var(--text);
	}

	@media (hover: hover) and (pointer: fine) {
		a.row:hover,
		a.row:focus-visible {
			background: var(--card-meta-hover);
		}

		a.row:hover .media img,
		a.row:focus-visible .media img {
			transform: scale(1.025);
		}

		a.row:hover .title,
		a.row:focus-visible .title {
			text-decoration: underline;
			text-underline-offset: 0.15em;
			text-decoration-thickness: 1px;
		}

		a.row:hover .more,
		a.row:focus-visible .more {
			color: var(--text);
		}
	}

	@media (max-width: 799px) {
		.row {
			grid-template-columns: 1fr;
			gap: 1.15rem;
			padding: 1.65rem 0;
		}

		.media {
			order: -1;
		}

		.title {
			font-size: 1.45rem;
		}

		.line2 {
			font-size: 1.15rem;
		}
	}
</style>
