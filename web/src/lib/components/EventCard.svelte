<script lang="ts">
	let {
		href,
		image = null,
		kindLabel = null,
		title,
		dateLabel = null,
		subtitle = null,
		badgeMuted = false,
		alt = ''
	}: {
		href: string;
		image?: string | null;
		kindLabel?: string | null;
		title: string;
		dateLabel?: string | null;
		subtitle?: string | null;
		badgeMuted?: boolean;
		alt?: string;
	} = $props();
</script>

<a class="card" {href}>
	<div class="media">
		{#if image}
			<img src={image} {alt} />
		{:else}
			<div class="placeholder" aria-hidden="true"></div>
		{/if}
		{#if kindLabel}
			<span class="tag" class:muted={badgeMuted}>{kindLabel}</span>
		{/if}
	</div>
	<div class="meta">
		<h3 class="serif">{title}</h3>
		{#if dateLabel}
			<p class="date">{dateLabel}</p>
		{/if}
		{#if subtitle}
			<p class="sub">{subtitle}</p>
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
	}

	.media img,
	.placeholder {
		aspect-ratio: 4 / 3;
		object-fit: cover;
		width: 100%;
		display: block;
		transition: transform 0.5s ease;
	}

	.placeholder {
		background: linear-gradient(135deg, #e4e2da, #d5d2c8);
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

	.date,
	.sub {
		margin: 0;
		font-size: 0.8rem;
		color: var(--text-muted);
		letter-spacing: 0.02em;
	}

	.sub {
		margin-top: 0.25rem;
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
