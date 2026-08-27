<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import EventCard from '$lib/components/EventCard.svelte';

	let { data } = $props();

	const filters = [
		{ id: 'alla', label: 'Alla' },
		{ id: 'vernissage', label: 'Vernissage' },
		{ id: 'sip-paint', label: 'Zipp & Paint' },
		{ id: 'other', label: 'Övrigt' }
	] as const;

	let filter = $state<(typeof filters)[number]['id']>('alla');

	const upcoming = $derived(
		(data.upcoming ?? []).filter((e) => filter === 'alla' || e.kind === filter)
	);
	const past = $derived((data.past ?? []).filter((e) => filter === 'alla' || e.kind === filter));
	const empty = $derived(upcoming.length === 0 && past.length === 0);
</script>

<Seo
	title="Evenemang · GALLERIett"
	description="Vernissage, Zipp & Paint och andra evenemang på GALLERIett, Tjörn."
/>

<Breadcrumbs crumbs={[{ name: 'Evenemang' }]} />

<section class="band">
	<div class="container head">
		<h1 class="serif">Evenemang</h1>
	</div>
</section>

<section class="band-soft band-pad">
	<div class="container">
		<div class="filters">
			{#each filters as f}
				<button type="button" class:active={filter === f.id} onclick={() => (filter = f.id)}
					>{f.label}</button
				>
			{/each}
		</div>

		{#if empty}
			<p class="empty">Inga evenemang i den här kategorin just nu.</p>
		{:else}
			{#if upcoming.length}
				<div class="section-head">
					<h2 class="serif section-title">Kommande</h2>
				</div>
				<div class="grid">
					{#each upcoming as item}
						<EventCard
							href={`/evenemang/${item.slug}`}
							image={item.image}
							kindLabel={item.kindLabel}
							title={item.title}
							dateLabel={item.dateLabel}
							subtitle={item.price}
							alt=""
						/>
					{/each}
				</div>
			{/if}

			{#if past.length}
				<div class="section-head" class:spaced={upcoming.length > 0}>
					<h2 class="serif section-title">Tidigare</h2>
				</div>
				<div class="grid">
					{#each past as item}
						<EventCard
							href={`/evenemang/${item.slug}`}
							image={item.image}
							kindLabel={item.kindLabel}
							title={item.title}
							dateLabel={item.dateLabel}
							subtitle={item.price}
							badgeMuted
							alt=""
						/>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</section>

<style>
	.head {
		padding-block: 2.5rem 1rem;
	}

	h1 {
		font-size: clamp(2.2rem, 5vw, 3.5rem);
		margin: 0;
		font-weight: 500;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		border-bottom: 1px solid var(--border);
		padding-bottom: 0.75rem;
		margin-bottom: 2rem;
	}

	.filters button {
		background: none;
		border: none;
		font: inherit;
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
		cursor: pointer;
		padding: 0;
	}

	.filters button.active {
		color: var(--text);
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	.section-head {
		margin-bottom: 1.25rem;
	}

	.section-head.spaced {
		margin-top: 3rem;
	}

	.section-title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 500;
	}

	.grid {
		display: grid;
		gap: 1.5rem 1.25rem;
		grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
	}

	.empty {
		margin: 0;
		color: var(--text-secondary);
	}

	@media (min-width: 900px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 2rem 1.5rem;
		}
	}
</style>
