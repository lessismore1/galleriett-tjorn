<script lang="ts">
	import { onMount } from 'svelte';
	import { getRotatedSponsors } from '$lib/data/mockData.js';

	let {
		sponsors = getRotatedSponsors()
	}: {
		sponsors?: {
			id: string;
			name: string;
			shortName: string;
			logo: string;
			url: string | null;
		}[];
	} = $props();

	let trackEl = $state<HTMLElement | null>(null);
	let paused = $state(false);

	onMount(() => {
		if (sponsors.length <= 1) return;

		const id = window.setInterval(() => {
			if (paused || !trackEl) return;
			const step = trackEl.querySelector('.item')?.getBoundingClientRect().width ?? 180;
			const gap = 24;
			const max = trackEl.scrollWidth - trackEl.clientWidth;
			const next = trackEl.scrollLeft + step + gap;
			trackEl.scrollTo({
				left: next >= max - 4 ? 0 : next,
				behavior: 'smooth'
			});
		}, 4000);

		return () => window.clearInterval(id);
	});
</script>

<div
	class="carousel"
	onmouseenter={() => (paused = true)}
	onmouseleave={() => (paused = false)}
	onfocusin={() => (paused = true)}
	onfocusout={() => (paused = false)}
>
	<div class="track" bind:this={trackEl} tabindex="0" aria-label="Sponsorer">
		{#each sponsors as s}
			{#if s.url}
				<a class="item" href={s.url} target={s.url.startsWith('http') ? '_blank' : undefined} rel={s.url.startsWith('http') ? 'noreferrer' : undefined}>
					<img src={s.logo} alt={s.name} />
				</a>
			{:else}
				<div class="item">
					<img src={s.logo} alt={s.name} />
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.carousel {
		overflow: hidden;
	}

	.track {
		display: flex;
		gap: 1.5rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		padding-block: 0.25rem;
		outline: none;
	}

	.track::-webkit-scrollbar {
		display: none;
	}

	.item {
		flex: 0 0 auto;
		scroll-snap-align: start;
		display: flex;
		align-items: center;
		justify-content: center;
		width: clamp(140px, 22vw, 200px);
		height: 72px;
		padding: 0.65rem 1rem;
		background: var(--bg);
		border: 1px solid var(--border);
	}

	.item img {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
	}
</style>
