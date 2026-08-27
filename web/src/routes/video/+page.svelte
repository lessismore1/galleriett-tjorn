<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import VideoCard from '$lib/components/VideoCard.svelte';

	let { data } = $props();
	const list = $derived(data.list ?? []);
</script>

<Seo
	title="Video · GALLERIett"
	description="Filmer från utställningar och evenemang på GALLERIett, Tjörn."
/>

<Breadcrumbs crumbs={[{ name: 'Video' }]} />

<section class="band">
	<div class="container head">
		<h1 class="serif">Video</h1>
	</div>
</section>

<section class="band-soft band-pad">
	<div class="container">
		{#if list.length}
			<div class="grid">
				{#each list as item}
					<VideoCard
						href={item.url}
						image={item.thumbnail}
						artists={item.artists}
						title={item.title}
						dateLabel={item.dateLabel}
						alt=""
					/>
				{/each}
			</div>
		{:else}
			<p class="empty">Inga filmer publicerade ännu.</p>
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

	.grid {
		display: grid;
		gap: 2rem 1.25rem;
		grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
	}

	.empty {
		margin: 0;
		color: var(--text-secondary);
	}

	@media (min-width: 900px) {
		.grid {
			grid-template-columns: repeat(4, 1fr);
			gap: 2.25rem 1.5rem;
		}
	}
</style>
