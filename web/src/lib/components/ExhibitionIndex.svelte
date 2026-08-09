<script lang="ts">
	import { statusLabels } from '$lib/data/mockData.js';
	import Seo from '$lib/components/Seo.svelte';

	type Filter = 'year' | 'ongoing' | 'upcoming' | 'archive';

	let {
		filter,
		list,
		archiveYears = [],
		archiveYear = null,
		emptyLabel = 'Inga utställningar.',
		seo
	}: {
		filter: Filter;
		list: {
			id: number;
			slug: string;
			artist: string;
			title: string;
			datesLabel: string;
			status: string;
			image: string;
		}[];
		archiveYears?: number[];
		archiveYear?: number | null;
		emptyLabel?: string;
		seo: { title: string; description: string; image?: string | null };
	} = $props();

	const mainFilters = $derived([
		{ id: 'year' as const, href: '/utstallningar', label: 'Alla årets' },
		{ id: 'ongoing' as const, href: '/utstallningar/pagaende', label: 'Pågående' },
		{ id: 'upcoming' as const, href: '/utstallningar/kommande', label: 'Kommande' },
		{
			id: 'archive' as const,
			href: archiveYears[0]
				? `/utstallningar/arkiv/${archiveYears[0]}`
				: '/utstallningar/arkiv',
			label: 'Arkiv'
		}
	]);
</script>

<Seo title={seo.title} description={seo.description} image={seo.image ?? null} />

<section class="band">
	<div class="container head">
		<h1 class="serif">Utställningar</h1>
		<nav class="tabs" aria-label="Filtrera utställningar">
			{#each mainFilters as t}
				<a href={t.href} class:active={filter === t.id}>{t.label}</a>
			{/each}
		</nav>
	</div>
</section>

{#if filter === 'archive' && archiveYears.length}
	<section class="band">
		<div class="container years-wrap">
			<nav class="years" aria-label="Arkivår">
				{#each archiveYears as y}
					<a href={`/utstallningar/arkiv/${y}`} class:active={archiveYear === y}>{y}</a>
				{/each}
			</nav>
		</div>
	</section>
{/if}

<section class="band-soft">
	<div class="container">
		<ul class="list">
			{#each list as ex}
				<li>
					<a href={`/utstallningar/${ex.slug}`}>
						<span class="id">{ex.id}</span>
						<div class="thumb">
							<img src={ex.image} alt="" />
							{#if ex.status === 'ongoing'}
								<span class="tag">{statusLabels.ongoing}</span>
							{:else if ex.status === 'upcoming'}
								<span class="tag muted">{statusLabels.upcoming}</span>
							{/if}
						</div>
						<div>
							<strong class="serif">{ex.artist} | {ex.title}</strong>
							<p>{ex.datesLabel}</p>
						</div>
						<span class="plus" aria-hidden="true">+</span>
					</a>
				</li>
			{:else}
				<li class="empty">{emptyLabel}</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.head {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: 1rem;
		flex-wrap: wrap;
		padding-block: 2.5rem 1rem;
	}

	h1 {
		font-size: clamp(2.2rem, 5vw, 3.5rem);
		margin: 0;
		font-weight: 500;
	}

	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem;
	}

	.tabs a {
		font-size: var(--text-label);
		font-weight: 600;
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--text-muted);
		padding: 0 0 0.75rem;
	}

	.tabs a.active {
		color: var(--text);
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	.years-wrap {
		padding-bottom: 0.25rem;
	}

	.years {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		border-bottom: 1px solid var(--border);
		padding-bottom: 0.75rem;
	}

	.years a {
		font-size: var(--text-label);
		font-weight: 600;
		letter-spacing: var(--track-label);
		color: var(--text-muted);
		padding: 0 0 0.5rem;
	}

	.years a.active {
		color: var(--text);
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
		padding-block: 0.5rem 3rem;
	}

	.list a {
		display: grid;
		grid-template-columns: 3rem 110px 1fr auto;
		gap: 1rem;
		align-items: center;
		padding: 1.15rem 0;
		border-bottom: 1px solid var(--border);
	}

	.id {
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

	.empty {
		padding: 2rem 0;
		color: var(--text-muted);
	}

	@media (max-width: 640px) {
		.list a {
			grid-template-columns: 72px 1fr auto;
		}

		.id {
			display: none;
		}

		.thumb {
			width: 72px;
			height: 56px;
		}
	}
</style>
