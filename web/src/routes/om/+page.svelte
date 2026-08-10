<script lang="ts">
	import { about, site } from '$lib/data/mockData.js';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
</script>

<Breadcrumbs crumbs={[{ name: 'Om' }]} />

<section class="band-soft band-pad">
	<div class="container narrow">
		<p class="label">{about.label}</p>
		<h1 class="serif">{about.headline}</h1>
	</div>
</section>

<section class="band band-pad">
	<div class="container narrow">
		<img src={about.image} alt="Galleri Ett" />
		<p class="body">{about.body}</p>
		<p class="meta">
			{site.address.street}, {site.address.postal}<br />
			{site.hours}<br />
			<a href={`mailto:${site.email}`}>{site.email}</a>
		</p>
		<a class="link-arrow" href="/kontakt">Kontakta oss</a>
	</div>
</section>

<style>
	.narrow {
		max-width: 48rem;
	}

	h1 {
		font-size: clamp(2rem, 5vw, 3.2rem);
		margin: 0.75rem 0 0;
		font-weight: 500;
	}

	img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		margin-bottom: 1.5rem;
		background: #e8e8e2;
	}

	.body {
		color: var(--text-secondary);
		font-size: 1.05rem;
		max-width: 40rem;
		line-height: 1.7;
	}

	.meta {
		color: var(--text-muted);
		margin: 1.5rem 0;
	}
</style>
