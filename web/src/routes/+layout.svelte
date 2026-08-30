<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';

	let { children, data } = $props();
	const site = $derived(data.site);

	const fontsHref =
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://cdn.sanity.io" crossorigin="anonymous" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<!-- Non-blocking: print media until load, then apply to screen (PSI render-blocking fonts) -->
	<link
		rel="stylesheet"
		href={fontsHref}
		media="print"
		onload={(e) => {
			const el = e.currentTarget;
			if (el instanceof HTMLLinkElement) el.media = 'all';
		}}
	/>
	<noscript>
		<link rel="stylesheet" href={fontsHref} />
	</noscript>
	<title>{site.name} — Tjörn</title>
</svelte:head>

<div class="site">
	<Header {site} />
	<main>
		{@render children()}
	</main>
	<Footer {site} />
</div>
