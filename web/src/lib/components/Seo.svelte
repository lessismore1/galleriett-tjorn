<script lang="ts">
	import { page } from '$app/state';

	let {
		title,
		description,
		image = null,
		type = 'website'
	}: {
		title: string;
		description: string;
		image?: string | null;
		type?: string;
	} = $props();

	const site = $derived(
		(page.data as { site?: { url: string } }).site ?? {
			url: 'https://galleriett-tjorn.pages.dev'
		}
	);

	/** Prerender defaultar till sveltekit-prerender om kit.prerender.origin saknas — fallback till site.url. */
	const origin = $derived(
		page.url.origin.includes('sveltekit-prerender') ? site.url : page.url.origin
	);
	const canonical = $derived(`${origin}${page.url.pathname}`);
	const ogImage = $derived(
		image ? (image.startsWith('http') ? image : `${origin}${image}`) : null
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
	{/if}

	<meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if ogImage}
		<meta name="twitter:image" content={ogImage} />
	{/if}
</svelte:head>
