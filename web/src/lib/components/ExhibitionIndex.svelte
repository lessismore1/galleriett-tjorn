<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ExhibitionRow from '$lib/components/ExhibitionRow.svelte';

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
			intro?: string | null;
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

	const crumbs = $derived.by(() => {
		const base = { name: 'Utställningar', href: '/utstallningar' };
		if (filter === 'year') return [{ name: 'Utställningar' }];
		if (filter === 'ongoing') return [base, { name: 'Pågående' }];
		if (filter === 'upcoming') return [base, { name: 'Kommande' }];
		if (filter === 'archive') {
			return [
				base,
				{
					name: 'Arkiv',
					href: archiveYears[0]
						? `/utstallningar/arkiv/${archiveYears[0]}`
						: '/utstallningar/arkiv'
				},
				...(archiveYear != null ? [{ name: String(archiveYear) }] : [])
			];
		}
		return [{ name: 'Utställningar' }];
	});
</script>

<Seo title={seo.title} description={seo.description} image={seo.image ?? null} />

<Breadcrumbs crumbs={crumbs} />

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
				<ExhibitionRow
					href={`/utstallningar/${ex.slug}`}
					leading={`Utställning ${ex.id}`}
					title={ex.artist}
					line2={ex.title}
					subtitle={ex.datesLabel}
					intro={ex.intro}
					image={ex.image}
					status={ex.status}
				/>
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
		padding-block: 1rem 3.5rem;
	}

	.empty {
		padding: 2rem 0;
		color: var(--text-muted);
	}
</style>
