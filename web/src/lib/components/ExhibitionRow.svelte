<script lang="ts">
	import { statusLabels } from '$lib/data/mockData.js';

	let {
		href = null,
		leading = null,
		title,
		subtitle = null,
		image = null,
		status = null,
		showPlus = true
	}: {
		href?: string | null;
		leading?: string | number | null;
		title: string;
		subtitle?: string | null;
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
		class:no-thumb={!image}
		class:no-leading={leading == null || leading === ''}
		{...(href ? { href } : {})}
	>
		{#if leading != null && leading !== ''}
			<span class="leading">{leading}</span>
		{/if}
		{#if image}
			<div class="thumb">
				<img src={image} alt="" />
				{#if tag}
					<span class="tag" class:muted={tag.muted}>{tag.text}</span>
				{/if}
			</div>
		{/if}
		<div class="body">
			<strong class="serif">{title}</strong>
			{#if subtitle}
				<p>{subtitle}</p>
			{/if}
		</div>
		{#if showPlus && href}
			<span class="plus" aria-hidden="true">+</span>
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
		grid-template-columns: 3rem 110px 1fr auto;
		gap: 1rem;
		align-items: center;
		padding: 1.15rem 0.35rem;
		margin: 0 -0.35rem;
		border-bottom: 1px solid var(--border);
		color: inherit;
		text-decoration: none;
		transition: background-color 0.18s ease;
	}

	.row.no-thumb {
		grid-template-columns: 3rem 1fr auto;
	}

	.row.no-leading {
		grid-template-columns: 110px 1fr auto;
	}

	.row.no-leading.no-thumb {
		grid-template-columns: 1fr auto;
	}

	.leading {
		font-size: 0.75rem;
		color: var(--brand-dark);
		font-weight: 600;
	}

	.thumb {
		position: relative;
		width: 110px;
		height: 80px;
		background: #e8e8e2;
	}

	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.tag {
		position: absolute;
		top: 0.35rem;
		left: 0.35rem;
		font-size: 0.55rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.2rem 0.35rem;
		background: var(--brand);
		color: var(--brand-dark);
	}

	.tag.muted {
		background: #fff;
		border: 1px solid var(--border);
		color: var(--text);
	}

	.body {
		min-width: 0;
	}

	strong {
		display: block;
		font-size: 1.15rem;
		font-weight: 500;
	}

	p {
		margin: 0.25rem 0 0;
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	.plus {
		color: var(--brand);
		font-size: 1.4rem;
		font-weight: 400;
	}

	@media (hover: hover) and (pointer: fine) {
		a.row:hover,
		a.row:focus-visible {
			background: var(--card-meta-hover);
		}

		a.row:hover strong,
		a.row:focus-visible strong {
			text-decoration: underline;
			text-underline-offset: 0.15em;
			text-decoration-thickness: 1px;
		}
	}

	@media (max-width: 640px) {
		.row {
			grid-template-columns: 72px 1fr auto;
		}

		.row.no-thumb {
			grid-template-columns: 1fr auto;
		}

		.leading {
			display: none;
		}

		.thumb {
			width: 72px;
			height: 56px;
		}
	}
</style>
