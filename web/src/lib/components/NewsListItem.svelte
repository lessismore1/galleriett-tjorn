<script lang="ts">
	let {
		href = null,
		external = false,
		image,
		category,
		title,
		dateLabel,
		alt = ''
	}: {
		href?: string | null;
		/** Extern presslänk (ny flik) */
		external?: boolean;
		image: string;
		category: string;
		title: string;
		dateLabel: string;
		alt?: string;
	} = $props();
</script>

{#if href}
	<a
		class="item"
		{href}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
	>
		<img src={image} {alt} loading="lazy" decoding="async" />
		<div class="meta">
			<p class="label">{category}</p>
			<strong class="serif title">{title}</strong>
			<p class="date">{dateLabel}</p>
		</div>
	</a>
{:else}
	<article class="item static">
		<img src={image} {alt} loading="lazy" decoding="async" />
		<div class="meta">
			<p class="label">{category}</p>
			<strong class="serif title">{title}</strong>
			<p class="date">{dateLabel}</p>
		</div>
	</article>
{/if}

<style>
	.item {
		display: grid;
		grid-template-columns: 84px 1fr;
		gap: 0.9rem;
		align-items: start;
		min-width: 0;
		color: inherit;
		text-decoration: none;
	}

	.item:not(.static):hover .title,
	.item:not(.static):focus-visible .title {
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	img {
		width: 84px;
		height: 84px;
		object-fit: cover;
		background: #e8e8e2;
		display: block;
	}

	.meta {
		min-width: 0;
	}

	.label {
		margin: 0;
	}

	.title {
		display: block;
		font-size: 1.05rem;
		font-weight: 500;
		margin: 0.15rem 0;
	}

	.date {
		margin: 0;
		font-size: 0.75rem;
		color: var(--text-muted);
	}
</style>
