<script lang="ts">
	import { about, site } from '$lib/data/mockData.js';
</script>

<section class="container">
	<p class="label">{about.label}</p>
	<h1 class="serif">{about.headline}</h1>
	<img src={about.image} alt="Galleri Ett" />
	<p class="body">{about.body}</p>
	<p class="meta">
		{site.address.street}, {site.address.postal}<br />
		{site.hours}<br />
		<a href={`mailto:${site.email}`}>{site.email}</a>
	</p>
	<a class="link-arrow" href="/kontakt">Kontakta oss</a>
</section>

<style>
	.container {
		padding-block: 3rem;
		max-width: 48rem;
	}

	h1 {
		font-size: clamp(2rem, 5vw, 3.2rem);
		margin: 0.75rem 0 1.5rem;
	}

	img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		margin-bottom: 1.5rem;
	}

	.body {
		color: var(--text-secondary);
		font-size: 1.05rem;
		max-width: 40rem;
	}

	.meta {
		color: var(--text-muted);
		margin: 1.5rem 0;
	}
</style>
