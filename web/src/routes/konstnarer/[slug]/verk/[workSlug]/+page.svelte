<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import {
		site,
		workHref,
		statusLabels
	} from '$lib/data/mockData.js';
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();

	const artist = $derived(data.artist);
	const work = $derived(data.work);
	const prev = $derived(data.prev);
	const next = $derived(data.next);

	const pageTitle = $derived(`${work.title} — ${artist.name} · GALLERIett`);
	const pageDescription = $derived.by(() => {
		const story = typeof work.story === 'string' ? work.story.replace(/\s+/g, ' ').trim() : '';
		if (story) return story.length > 155 ? `${story.slice(0, 155)}…` : story;
		const bits = [artist.name, work.title, String(work.year), work.medium, work.dimensions]
			.filter(Boolean)
			.join(', ');
		return `${bits}. GALLERIett, Tjörn.`;
	});

	const storyParagraphs = $derived(
		typeof work.story === 'string' && work.story.trim()
			? work.story
					.trim()
					.split(/\n+/)
					.map((p) => p.trim())
					.filter(Boolean)
			: []
	);

	const interestMailto = $derived.by(() => {
		const subject = encodeURIComponent(`Intresse: ${work.title} — ${artist.name}`);
		const body = encodeURIComponent(
			`Hej GALLERIett,\n\nJag är intresserad av verket \"${work.title}\" (${work.year}) av ${artist.name}.\n\nLänk: ${page.url.href}\n\nVänliga hälsningar\n`
		);
		return `mailto:${site.email}?subject=${subject}&body=${body}`;
	});

	const shareMail = $derived.by(() => {
		const subject = encodeURIComponent(`${work.title} — ${artist.name}`);
		const body = encodeURIComponent(`${work.title} av ${artist.name}\n${page.url.href}`);
		return `mailto:?subject=${subject}&body=${body}`;
	});

	const facebookShare = $derived(
		`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(page.url.href)}`
	);

	let copied = $state(false);

	async function copyLink() {
		if (!browser) return;
		try {
			await navigator.clipboard.writeText(page.url.href);
			copied = true;
			window.setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			/* ignore */
		}
	}

	const availabilityLabel = $derived(
		work.availability === 'sold'
			? 'Såld'
			: work.availability === 'not_for_sale'
				? 'Ej till salu'
				: work.availability === 'available'
					? 'Tillgänglig'
					: 'Pris vid förfrågan'
	);

	const showInterestCta = $derived(
		work.availability !== 'sold' && work.availability !== 'not_for_sale'
	);
</script>

<Seo title={pageTitle} description={pageDescription} image={work.image} type="article" />

<Breadcrumbs
	crumbs={[
		{ name: 'Konstnärer', href: '/konstnarer' },
		{ name: artist.name, href: `/konstnarer/${artist.slug}` },
		{ name: work.title }
	]}
/>

<section class="band-soft">
	<div class="container layout">
		<figure class="media">
			<img src={work.image} alt="{artist.name} — {work.title}" />
		</figure>

		<div class="info">
			<p class="label">Verk {work.id}</p>
			<h1 class="serif">{work.title}</h1>
			<p class="artist">
				<a href={`/konstnarer/${artist.slug}`}>{artist.name}</a>
			</p>

			{#if storyParagraphs.length}
				<div class="story">
					{#each storyParagraphs as para}
						<p>{para}</p>
					{/each}
				</div>
			{/if}

			<dl class="meta">
				<div>
					<dt>År</dt>
					<dd>{work.year}</dd>
				</div>
				<div>
					<dt>Teknik</dt>
					<dd>{work.medium}</dd>
				</div>
				{#if work.dimensions}
					<div>
						<dt>Mått</dt>
						<dd>{work.dimensions}</dd>
					</div>
				{/if}
				<div>
					<dt>Status</dt>
					<dd>{availabilityLabel}</dd>
				</div>
			</dl>

			{#if data.featuredIn?.length}
				<div class="context">
					<p class="label">Utställning</p>
					<ul>
						{#each data.featuredIn as ex}
							<li>
								<a href={`/utstallningar/${ex.slug}`}>
									{ex.id} · {ex.title}
									{#if ex.status !== 'past'}
										<span class="tag">{statusLabels[ex.status] ?? ex.status}</span>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if showInterestCta}
				<a class="btn cta" href={interestMailto}>Maila om intresse →</a>
			{:else if work.availability === 'sold'}
				<p class="sold-note">Verket är sålt. Hör gärna av dig om liknande verk.</p>
				<a
					class="btn cta ghost"
					href={`mailto:${site.email}?subject=${encodeURIComponent(`Fråga om liknande: ${work.title} — ${artist.name}`)}`}
					>Kontakta galleriet →</a
				>
			{/if}

			<div class="share" role="group" aria-label="Dela verk">
				<span class="label">Dela</span>
				<a href={facebookShare} target="_blank" rel="noopener noreferrer">Facebook</a>
				<button type="button" onclick={copyLink}>{copied ? 'Kopierad' : 'Kopiera länk'}</button>
				<a href={shareMail}>Mail</a>
			</div>

			<nav class="browse" aria-label="Bläddra bland verk">
				<a href={workHref(artist.slug, prev)} aria-label={`Föregående: ${prev.title}`}>‹ {prev.title}</a>
				<span class="count">{data.index + 1} / {data.total}</span>
				<a href={workHref(artist.slug, next)} aria-label={`Nästa: ${next.title}`}>{next.title} ›</a>
			</nav>
		</div>
	</div>
</section>

<style>
	.layout {
		display: grid;
		gap: 2rem;
		padding-block: 2rem 3rem;
	}

	.media {
		margin: 0;
		background: #e8e8e2;
	}

	.media img {
		width: 100%;
		display: block;
		aspect-ratio: 4 / 5;
		object-fit: cover;
	}

	.label {
		margin: 0 0 0.5rem;
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	h1 {
		margin: 0 0 0.5rem;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		font-weight: 500;
	}

	.artist {
		margin: 0 0 1.25rem;
		font-size: 0.95rem;
	}

	.artist a {
		text-decoration: underline;
		text-underline-offset: 0.18em;
	}

	.story {
		margin: 0 0 1.5rem;
		max-width: 34rem;
	}

	.story p {
		margin: 0 0 0.85rem;
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--text-secondary);
	}

	.story p:last-child {
		margin-bottom: 0;
	}

	.meta {
		display: grid;
		gap: 0.85rem;
		margin: 0 0 1.5rem;
		padding: 0;
	}

	.meta div {
		display: grid;
		grid-template-columns: 6.5rem 1fr;
		gap: 0.75rem;
		border-top: 1px solid var(--border);
		padding-top: 0.75rem;
	}

	.meta dt {
		margin: 0;
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.meta dd {
		margin: 0;
		font-size: 0.95rem;
	}

	.context {
		margin-bottom: 1.5rem;
	}

	.context ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.context li + li {
		margin-top: 0.35rem;
	}

	.context a {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
	}

	.tag {
		padding: 0.15rem 0.35rem;
		background: var(--brand);
		color: var(--brand-dark);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.cta {
		margin-bottom: 1.5rem;
		text-decoration: none;
	}

	.cta.ghost {
		background: transparent;
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--border);
		filter: none;
	}

	.cta.ghost:hover {
		background: #ecebe3;
	}

	.sold-note {
		margin: 0 0 0.75rem;
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.share {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1rem;
		margin-bottom: 2rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}

	.share .label {
		margin: 0;
	}

	.share a,
	.share button {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-secondary);
		cursor: pointer;
		text-decoration: none;
	}

	.share a:hover,
	.share button:hover {
		color: var(--text);
	}

	.browse {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 0.75rem;
		align-items: center;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
		font-size: 0.75rem;
	}

	.browse a:first-child {
		justify-self: start;
	}

	.browse a:last-child {
		justify-self: end;
		text-align: right;
	}

	.browse a {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--text-secondary);
	}

	.browse a:hover {
		color: var(--text);
	}

	.count {
		font-size: 0.65rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	@media (min-width: 900px) {
		.layout {
			grid-template-columns: 1.15fr 0.85fr;
			align-items: start;
			gap: 2.5rem;
			padding-block: 2.5rem 4rem;
		}

		.media img {
			aspect-ratio: 4 / 5;
		}
	}
</style>
