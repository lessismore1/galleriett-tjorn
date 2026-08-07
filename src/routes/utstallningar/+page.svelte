<script lang="ts">
	import { exhibitions, statusLabels } from '$lib/data/mockData.js';

	type Tab = keyof typeof statusLabels;

	let tab = $state<Tab>('ongoing');
	const tabs: { id: Tab; label: string }[] = [
		{ id: 'ongoing', label: 'Pågående' },
		{ id: 'upcoming', label: 'Kommande' },
		{ id: 'past', label: 'Arkiv' }
	];

	const list = $derived(exhibitions.filter((e) => e.status === tab));
</script>

<section class="container">
	<div class="head">
		<h1 class="serif">Utställningar</h1>
		<div class="tabs">
			{#each tabs as t}
				<button class:active={tab === t.id} onclick={() => (tab = t.id)}>{t.label}</button>
			{/each}
		</div>
	</div>

	<ul class="list">
		{#each list as ex}
			<li>
				<a href={`/utstallningar/${ex.slug}`}>
					<span class="id">{ex.id}</span>
					<img src={ex.image} alt="" />
					<div>
						<strong class="serif">{ex.artist} | {ex.title}</strong>
						<p>{ex.datesLabel}</p>
					</div>
					<span class="plus" aria-hidden="true">+</span>
				</a>
			</li>
		{:else}
			<li class="empty">Inga utställningar i {statusLabels[tab].toLowerCase()}.</li>
		{/each}
	</ul>
</section>

<style>
	.head {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: 1rem;
		flex-wrap: wrap;
		padding-block: 2.5rem 1rem;
		border-bottom: 1px solid var(--border);
	}

	h1 {
		font-size: clamp(2.2rem, 5vw, 3.5rem);
		margin: 0;
	}

	.tabs {
		display: flex;
		gap: 1.25rem;
	}

	.tabs button {
		background: none;
		border: none;
		font: inherit;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
		padding: 0 0 0.75rem;
		cursor: pointer;
	}

	.tabs button.active {
		color: var(--text);
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0 0 3rem;
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
		color: var(--text-muted);
	}

	img {
		width: 110px;
		height: 80px;
		object-fit: cover;
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

		img {
			width: 72px;
			height: 56px;
		}
	}
</style>
