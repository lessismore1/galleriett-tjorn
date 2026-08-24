<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';

	let { children, data } = $props();
	const site = $derived(data.site);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
	<title>{site.name} — Tjörn</title>
</svelte:head>

<div class="site">
	<Header {site} />
	<main>
		{@render children()}
	</main>
	<Footer {site} />
</div>
