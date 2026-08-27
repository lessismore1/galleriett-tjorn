<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const event = $derived(data.event);

	const bookingHref = $derived.by(() => {
		if (event.bookingUrl) return event.bookingUrl;
		if (event.bookingMailto) {
			const subject = encodeURIComponent(`Bokning: ${event.title}`);
			return `mailto:${event.bookingMailto}?subject=${subject}`;
		}
		return null;
	});
	const bookingExternal = $derived(Boolean(event.bookingUrl));
	const bookingLabel = $derived(
		event.kind === 'sip-paint' || event.price ? 'Boka' : event.bookingUrl ? 'Mer info' : 'Kontakta oss'
	);
</script>

<Seo
	title={`${event.title} · Evenemang · GALLERIett`}
	description={event.body?.slice(0, 160) ||
		`${event.title}. ${event.dateLabel}. Evenemang på GALLERIett, Tjörn.`}
/>

<Breadcrumbs
	crumbs={[{ name: 'Evenemang', href: '/evenemang' }, { name: event.title }]}
/>

<article class="band-soft band-pad">
	<div class="container layout">
		{#if event.image}
			<figure class="hero">
				<img src={event.image} alt="" />
			</figure>
		{/if}

		<div class="copy">
			<p class="kind">{event.kindLabel}</p>
			<h1 class="serif">{event.title}</h1>
			{#if event.dateLabel}
				<p class="when">{event.dateLabel}</p>
			{/if}
			{#if event.price}
				<p class="price">{event.price}</p>
			{/if}
			{#if event.locationName}
				<p class="place">{event.locationName}</p>
			{/if}

			{#if bookingHref}
				<p class="cta">
					<a
						class="btn"
						href={bookingHref}
						target={bookingExternal ? '_blank' : undefined}
						rel={bookingExternal ? 'noreferrer' : undefined}>{bookingLabel}</a
					>
				</p>
			{/if}

			{#if event.body}
				<div class="body">
					{#each event.body.split(/\n\n+/).filter(Boolean) as para}
						<p>{para}</p>
					{/each}
				</div>
			{/if}

			{#if event.exhibitionSlug}
				<p class="ex-link">
					Utställning:
					<a href={`/utstallningar/${event.exhibitionSlug}`}>{event.exhibitionTitle} →</a>
				</p>
			{/if}

			<p class="back">
				<a href="/evenemang">← Alla evenemang</a>
			</p>
		</div>
	</div>
</article>

<style>
	.layout {
		display: grid;
		gap: 2rem;
	}

	.hero {
		margin: 0;
	}

	.hero img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		display: block;
		background: #e8e8e2;
	}

	.kind {
		margin: 0 0 0.5rem;
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	h1 {
		margin: 0 0 0.75rem;
		font-size: clamp(1.85rem, 4vw, 2.75rem);
		font-weight: 500;
	}

	.when,
	.price,
	.place {
		margin: 0 0 0.35rem;
		color: var(--text-secondary);
	}

	.cta {
		margin: 1.5rem 0;
	}

	.btn {
		display: inline-block;
		padding: 0.7rem 1.2rem;
		background: var(--brand);
		color: var(--brand-ink, #111);
		text-decoration: none;
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-weight: 600;
	}

	.body {
		display: grid;
		gap: 1rem;
		margin: 1.5rem 0;
		max-width: 40rem;
		line-height: 1.55;
	}

	.body p {
		margin: 0;
	}

	.ex-link,
	.back {
		margin: 1.5rem 0 0;
	}

	.ex-link a,
	.back a {
		color: inherit;
	}

	@media (min-width: 800px) {
		.layout {
			grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
			align-items: start;
			gap: 2.5rem;
		}
	}
</style>
