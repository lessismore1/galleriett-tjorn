<script lang="ts">
	import { statusLabels } from '$lib/labels.js';
	import { sanityImageDims, sanitySrcSet, withSanityQuality } from '$lib/sanityImageDims';

	let {
		href,
		image,
		title,
		subtitle = null,
		status = null,
		badge = null,
		badgeMuted = false,
		alt = '',
		sizes = '(max-width: 599px) 100vw, (max-width: 899px) 50vw, (max-width: 1099px) 33vw, 25vw'
	}: {
		href: string;
		image: string;
		title: string;
		subtitle?: string | null;
		status?: string | null;
		badge?: string | null;
		badgeMuted?: boolean;
		alt?: string;
		/** Matchar ExhibitionIndex: 1 → 2 → 3 → 4 kolumner */
		sizes?: string;
	} = $props();

	const tag = $derived.by(() => {
		if (badge) return { text: badge, muted: badgeMuted };
		if (status === 'ongoing') return { text: statusLabels.ongoing, muted: false };
		if (status === 'upcoming') return { text: statusLabels.upcoming, muted: true };
		if (status === 'past') return { text: statusLabels.past, muted: true };
		return null;
	});

	const src = $derived(withSanityQuality(image, 60));
	const srcset = $derived(sanitySrcSet(image, [480, 720, 1000, 1400], 60));
	/** Display-box 4:3 — not the asset’s intrinsic ratio. */
	const dims = $derived.by(() => {
		const w = sanityImageDims(image, 0.75).width;
		return { width: w, height: Math.round((w * 3) / 4) };
	});
</script>

<a class="card" {href}>
	<div class="media">
		<img
			src={src}
			srcset={srcset || undefined}
			{sizes}
			{alt}
			width={dims.width}
			height={dims.height}
			loading="lazy"
			decoding="async"
		/>
		{#if tag}
			<span class="tag" class:muted={tag.muted}>{tag.text}</span>
		{/if}
	</div>
	<div class="meta">
		<h3 class="serif">{title}</h3>
		{#if subtitle}
			<p>{subtitle}</p>
		{/if}
	</div>
</a>

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
		position: relative;
		overflow: hidden;
		background: #e8e8e2;
		aspect-ratio: 4 / 3;
	}

	.media img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.5s ease;
	}

	.tag {
		position: absolute;
		top: 0.65rem;
		left: 0.65rem;
		margin: 0;
	}

	.meta {
		flex: 1;
		padding: 0.7rem 0.55rem 0.75rem;
		transition: background-color 0.18s ease;
	}

	.meta h3 {
		font-size: 1.2rem;
		margin: 0 0 0.35rem;
		font-weight: 500;
	}

	.meta p {
		margin: 0;
		font-size: 0.8rem;
		color: var(--text-muted);
		letter-spacing: 0.02em;
	}

	@media (hover: hover) and (pointer: fine) {
		.card:hover,
		.card:focus-visible {
			box-shadow: 0 0 0 1px var(--brand);
		}

		.card:hover .media img,
		.card:focus-visible .media img {
			transform: scale(1.03);
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

	@media (prefers-reduced-motion: reduce) {
		.media img {
			transition: none;
		}
	}
</style>
