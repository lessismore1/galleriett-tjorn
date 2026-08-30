<script lang="ts">
	import { sanityImageDims, sanitySrcSet, withSanityQuality } from '$lib/sanityImageDims';

	let {
		href,
		image = null,
		artists = null,
		title,
		dateLabel = null,
		external = true,
		alt = '',
		sizes = '(max-width: 599px) 100vw, (max-width: 899px) 50vw, (max-width: 1099px) 33vw, 25vw'
	}: {
		href: string;
		image?: string | null;
		artists?: string | null;
		title: string;
		dateLabel?: string | null;
		external?: boolean;
		alt?: string;
		sizes?: string;
	} = $props();

	const src = $derived(withSanityQuality(image, 65));
	const srcset = $derived(sanitySrcSet(image, [480, 720, 1000, 1400], 65));
	const dims = $derived.by(() => {
		const w = sanityImageDims(image, 0.75).width;
		return { width: w, height: Math.round((w * 3) / 4) };
	});
</script>

<a
	class="card"
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noreferrer' : undefined}
>
	<div class="media">
		{#if image}
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
		{:else}
			<div class="placeholder" aria-hidden="true"></div>
		{/if}
	</div>
	<div class="meta">
		{#if artists}
			<p class="artists serif">{artists}</p>
		{/if}
		<h3 class="serif">{title}</h3>
		{#if dateLabel}
			<p class="date">{dateLabel}</p>
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
	}

	.media {
		position: relative;
		overflow: hidden;
		background: #e8e8e2;
		aspect-ratio: 4 / 3;
	}

	.media img,
	.placeholder {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.5s ease;
	}

	.placeholder {
		background: linear-gradient(135deg, #e4e2da, #d5d2c8);
	}

	.card:hover .media img {
		transform: scale(1.03);
	}

	.meta {
		display: grid;
		gap: 0.35rem;
		padding-top: 0.85rem;
		min-width: 0;
	}

	.artists {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		line-height: 1.35;
	}

	h3 {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		line-height: 1.35;
	}

	.date {
		margin: 0;
		font-size: 0.7rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-muted, #6b6b66);
		line-height: 1.35;
	}
</style>
