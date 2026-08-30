<script lang="ts">
	import { sanityImageDims, sanitySrcSet, withSanityQuality } from '$lib/sanityImageDims';

	let {
		href = null,
		external = false,
		image,
		category,
		title,
		dateLabel,
		excerpt = null,
		alt = '',
		sizes = '(max-width: 599px) 100vw, (max-width: 899px) 50vw, (max-width: 1099px) 33vw, 25vw'
	}: {
		href?: string | null;
		/** Extern presslänk (ny flik) */
		external?: boolean;
		image: string;
		category: string;
		title: string;
		dateLabel: string;
		excerpt?: string | null;
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

{#if href}
	<a
		class="card"
		{href}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
	>
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
		</div>
		<p class="label">{category}</p>
		<strong class="serif title">{title}</strong>
		<p class="date">{dateLabel}</p>
		{#if excerpt}
			<p class="excerpt">{excerpt}</p>
		{/if}
	</a>
{:else}
	<article class="card static">
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
		</div>
		<p class="label">{category}</p>
		<strong class="serif title">{title}</strong>
		<p class="date">{dateLabel}</p>
		{#if excerpt}
			<p class="excerpt">{excerpt}</p>
		{/if}
	</article>
{/if}

<style>
	.card {
		display: block;
		min-width: 0;
		color: inherit;
		text-decoration: none;
	}

	.card:not(.static):hover .title,
	.card:not(.static):focus-visible .title {
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	.media {
		position: relative;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background: #e8e8e2;
		margin-bottom: 0.75rem;
	}

	.media img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.label {
		margin: 0;
	}

	.title {
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
</style>
