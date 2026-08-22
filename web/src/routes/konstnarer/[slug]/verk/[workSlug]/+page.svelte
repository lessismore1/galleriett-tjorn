<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import {
		site,
		workHref,
		statusLabels
	} from '$lib/data/mockData.js';
	import Seo from '$lib/components/Seo.svelte';

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

<nav class="band subnav" aria-label="Verknavigation">
	<div class="container subnav-inner">
		<a class="subnav-home" href="/" aria-label="GALLERIett, Tjörn — startsida">
			<img src="/images/logo.webp" alt="" width="36" height="36" />
			<span class="place">Tjörn</span>
		</a>
		<a class="artist-name serif" href={`/konstnarer/${artist.slug}`}>{artist.name}</a>
		<span class="scope" aria-hidden="true">Verk</span>
		<a class="all-works" href={`/konstnarer/${artist.slug}#works`}>Visa alla</a>
		<div class="browse" role="group" aria-label="Bläddra bland verk">
			<a class="browse-prev" href={workHref(artist.slug, prev)} aria-label={`Föregående: ${prev.title}`}>‹</a>
			<span class="count">{data.index + 1} / {data.total}</span>
			<a class="browse-next" href={workHref(artist.slug, next)} aria-label={`Nästa: ${next.title}`}>›</a>
		</div>
	</div>
</nav>

<section class="band-soft">
	<div class="container layout">
		<figure class="media">
			<img src={work.image} alt="{artist.name} — {work.title}" />
			<div class="media-nav" aria-hidden="true">
				<a
					class="nav-btn"
					href={workHref(artist.slug, prev)}
					aria-label={`Föregående: ${prev.title}`}
					tabindex="-1">‹</a
				>
				<a
					class="nav-btn"
					href={workHref(artist.slug, next)}
					aria-label={`Nästa: ${next.title}`}
					tabindex="-1">›</a
				>
			</div>
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
		</div>
	</div>
</section>

<style>
	.subnav {
		position: sticky;
		top: 0;
		z-index: 60;
		border-bottom: 1px solid var(--border);
		background: rgba(255, 255, 255, 0.96);
		backdrop-filter: blur(8px);
	}

	.subnav-inner {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		min-height: 3.25rem;
		min-width: 0;
	}

	.subnav-home {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		text-decoration: none;
		color: inherit;
	}

	.subnav-home img {
		width: 2.25rem;
		height: 2.25rem;
		display: block;
		object-fit: contain;
	}

	.subnav-home .place {
		font-family: var(--font-sans);
		font-size: 0.5rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-muted);
		line-height: 1;
	}

	.artist-name {
		font-size: 0.95rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		flex-shrink: 1;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 10rem;
		color: var(--text);
		text-decoration: none;
	}

	.artist-name:hover {
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	.scope {
		flex-shrink: 0;
		font-size: var(--text-label);
		font-weight: 600;
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.all-works {
		flex-shrink: 0;
		font-size: var(--text-label);
		font-weight: 600;
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--text-secondary);
		text-decoration: none;
		padding-block: 0.85rem;
		white-space: nowrap;
	}

	.all-works:hover {
		color: var(--text);
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	.browse {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.35rem;
		margin-left: auto;
		flex-shrink: 0;
		font-size: var(--text-label);
		font-weight: 600;
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		line-height: 1.2;
		color: var(--text-secondary);
	}

	.browse a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 2.25rem;
		min-height: 2.25rem;
		color: inherit;
		text-decoration: none;
		font-size: 1.15rem;
		line-height: 1;
	}

	.browse a:hover {
		color: var(--text);
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	.count {
		color: var(--text);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		min-width: 3.25rem;
		text-align: center;
	}

	.layout {
		display: grid;
		gap: 1.5rem;
		padding-block: 1rem 2.5rem;
		align-items: start;
	}

	.media {
		margin: 0;
		min-width: 0;
		align-self: start;
		position: relative;
		background: #e8e8e2;
	}

	.media img {
		display: block;
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: calc(100svh - 3.5rem - 2rem);
		object-fit: contain;
		margin-inline: auto;
	}

	.media-nav {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 0.55rem;
		pointer-events: none;
	}

	.nav-btn {
		pointer-events: auto;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.92);
		color: var(--text);
		font-size: 1.15rem;
		line-height: 1;
		text-decoration: none;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
	}

	.nav-btn:hover {
		background: #fff;
		box-shadow: 0 0 0 1px var(--brand);
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
		gap: 0;
		margin: 0 0 1.5rem;
		padding: 0;
	}

	.meta div {
		display: grid;
		grid-template-columns: 6.5rem 1fr;
		gap: 0.75rem;
		align-items: baseline;
		border-top: 1px solid var(--border);
		padding-block: 0.4rem;
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
		background: var(--card-meta-hover);
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
		margin: 0;
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

	@media (max-width: 699px) {
		.artist-name,
		.scope {
			display: none;
		}
	}

	@media (min-width: 900px) {
		.layout {
			grid-template-columns: minmax(0, 1.2fr) minmax(17rem, 0.8fr);
			gap: 2rem;
			padding-block: 1rem 1.25rem;
			/* En “stage”: hela verket syns; info scrollar i kolumnen om den är längre */
			min-height: calc(100svh - 3.25rem);
			max-height: calc(100svh - 3.25rem);
			box-sizing: border-box;
		}

		.media {
			height: 100%;
			max-height: calc(100svh - 3.25rem - 2rem);
			display: flex;
			align-items: center;
			justify-content: center;
			background: transparent;
		}

		.media img {
			max-width: 100%;
			max-height: 100%;
			width: auto;
			height: auto;
		}

		.info {
			max-height: calc(100svh - 3.25rem - 2rem);
			overflow-y: auto;
			overscroll-behavior: contain;
			scrollbar-gutter: stable;
		}
	}
</style>
