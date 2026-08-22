<script lang="ts">
	let {
		href = null,
		external = false,
		image,
		category,
		title,
		dateLabel,
		excerpt = null,
		alt = ''
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
	} = $props();
</script>

{#if href}
	<a
		class="card"
		{href}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
	>
		<img src={image} {alt} />
		<p class="label">{category}</p>
		<strong class="serif title">{title}</strong>
		<p class="date">{dateLabel}</p>
		{#if excerpt}
			<p class="excerpt">{excerpt}</p>
		{/if}
	</a>
{:else}
	<article class="card static">
		<img src={image} {alt} />
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

	img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		margin-bottom: 0.75rem;
		background: #e8e8e2;
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
