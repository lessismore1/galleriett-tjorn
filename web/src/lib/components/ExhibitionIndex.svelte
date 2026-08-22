<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ExhibitionRow from '$lib/components/ExhibitionRow.svelte';
	import ExhibitionCard from '$lib/components/ExhibitionCard.svelte';

	type Filter = 'current' | 'past';

	let {
		filter,
		list,
		pastYears = [],
		pastYear = null,
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
		pastYears?: number[];
		pastYear?: number | null;
		emptyLabel?: string;
		seo: { title: string; description: string; image?: string | null };
	} = $props();

	const tidigareHref = $derived(
		pastYears[0] ? `/utstallningar/tidigare/${pastYears[0]}` : '/utstallningar/tidigare'
	);

	const mainFilters = $derived([
		{ id: 'current' as const, href: '/utstallningar', label: 'Aktuella' },
		{ id: 'past' as const, href: tidigareHref, label: 'Tidigare' }
	]);

	const crumbs = $derived.by(() => {
		const base = { name: 'Utställningar', href: '/utstallningar' };
		if (filter === 'past') {
			return [
				base,
				{ name: 'Tidigare', href: tidigareHref },
				...(pastYear != null ? [{ name: String(pastYear) }] : [])
			];
		}
		return [{ name: 'Utställningar' }];
	});

	const isPast = $derived(filter === 'past');
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

{#if isPast && pastYears.length}
	<section class="band">
		<div class="container years-wrap">
			<nav class="years" aria-label="År">
				{#each pastYears as y}
					<a href={`/utstallningar/tidigare/${y}`} class:active={pastYear === y}>{y}</a>
				{/each}
			</nav>
		</div>
	</section>
{/if}

<section class="band-soft">
	<div class="container">
		{#if isPast}
			{#if list.length}
				<div class="grid">
					{#each list as ex}
						<ExhibitionCard
							href={`/utstallningar/${ex.slug}`}
							image={ex.image}
							title={ex.artist}
							subtitle="{ex.title} · {ex.datesLabel}"
							alt="{ex.artist} — {ex.title}"
						/>
					{/each}
				</div>
			{:else}
				<p class="empty">{emptyLabel}</p>
			{/if}
		{:else}
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
		{/if}
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

	.grid {
		display: grid;
		gap: 2rem 1.5rem;
		grid-template-columns: 1fr;
		padding-block: 1.5rem 3.5rem;
	}

	@media (min-width: 600px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 900px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1100px) {
		.grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.empty {
		padding: 2rem 0;
		margin: 0;
		color: var(--text-muted);
	}
</style>
