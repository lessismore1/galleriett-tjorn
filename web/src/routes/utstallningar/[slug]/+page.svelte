<script lang="ts">
	import { onMount } from 'svelte';
	import { site } from '$lib/data/mockData.js';
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();
	const ex = $derived(data.exhibition);

	const pageTitle = $derived(`${ex.artist} | ${ex.title} · GALLERIett`);
	const pageDescription = $derived(
		ex.intro?.trim() ||
			`${ex.artist} — ${ex.title}. ${ex.datesLabel}. Utställning på GALLERIett, Tjörn.`
	);

	const facts = $derived([
		{ label: 'Konstnär', value: ex.artist },
		{ label: 'Titel', value: ex.title },
		{ label: 'Period', value: ex.datesLabel },
		{ label: 'Plats', value: ex.location },
		...(ex.vernissage
			? [
					{
						label: 'Vernissage',
						value: new Date(ex.vernissage).toLocaleString('sv-SE', {
							day: 'numeric',
							month: 'long',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						})
					}
				]
			: []),
		{ label: 'Kontakt', value: site.email }
	]);

	let sentinelEl = $state<HTMLElement | null>(null);
	let subnavEl = $state<HTMLElement | null>(null);
	let stuck = $state(false);
	let subnavH = $state(52);

	onMount(() => {
		const header = document.querySelector('header.header') as HTMLElement | null;

		const update = () => {
			if (!sentinelEl) return;
			const headerH = header?.offsetHeight ?? 64;
			if (subnavEl) subnavH = subnavEl.offsetHeight;
			// Handoff när sektionsmenyns topp når headerns botten
			stuck = sentinelEl.getBoundingClientRect().top <= headerH + 0.5;
			document.body.classList.toggle('subnav-stuck', stuck);
		};

		update();
		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update);

		return () => {
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
			document.body.classList.remove('subnav-stuck');
		};
	});
</script>

<Seo title={pageTitle} description={pageDescription} image={ex.image} type="article" />

<section class="band-soft">
	<div class="container top">
		<a class="back" href="/utstallningar">← Till utställningar</a>
		<div class="hero">
			<div class="hero-copy">
				<p class="label">Utställning {ex.id}</p>
				<h1 class="serif">{ex.artist}</h1>
				<p class="title serif">{ex.title}</p>
				<p class="dates">{ex.datesLabel}</p>
				<p class="intro">{ex.intro}</p>
			</div>
			<img class="hero-img" src={ex.image} alt="{ex.artist} — {ex.title}" />
		</div>
	</div>
</section>

<div class="subnav-sentinel" bind:this={sentinelEl} aria-hidden="true"></div>
{#if stuck}
	<div class="subnav-spacer" style={`height: ${subnavH}px`} aria-hidden="true"></div>
{/if}
<nav class="band subnav" class:stuck bind:this={subnavEl} aria-label="Sektioner">
	<div class="container subnav-inner">
		<strong class="ex-name serif">{ex.artist} <span class="sep">|</span> {ex.title}</strong>
		<div class="subnav-links">
			<a href="#press-release">Pressmeddelande</a>
			<a href="#works">Verk</a>
			<a href="#installation">Installation</a>
		</div>
		<span class="dela">Dela</span>
	</div>
</nav>

<section id="press-release" class="band band-pad">
	<div class="container press">
		<div class="text">
			<div class="section-head">
				<h2 class="serif section-title">Pressmeddelande</h2>
			</div>
			{#each ex.pressRelease.split('\n').filter(Boolean) as para}
				<p>{para}</p>
			{/each}
		</div>
		<aside class="facts">
			{#each facts as fact}
				<div class="fact">
					<span class="fact-label">{fact.label}</span>
					<span class="fact-value">{fact.value}</span>
				</div>
			{/each}
		</aside>
	</div>
</section>

<section id="works" class="band-soft band-pad">
	<div class="container">
		<div class="section-head">
			<h2 class="serif section-title">Verk</h2>
			{#if ex.works.length}
				<a class="link-arrow" href={`/konstnarer/${ex.artistSlug ?? ''}`}>Visa alla verk</a>
			{/if}
		</div>
		{#if ex.works.length}
			<div class="works" style={`--cols: ${Math.min(ex.works.length, 6)}`}>
				{#each ex.works as work}
					<figure>
						<div class="work-media">
							<img src={work.image} alt={work.title} />
						</div>
						<figcaption>{work.title}</figcaption>
					</figure>
				{/each}
			</div>
		{:else}
			<p class="empty">Inga verk publicerade.</p>
		{/if}
	</div>
</section>

<section id="installation" class="band-soft band-pad install-band">
	<div class="container">
		<div class="section-head">
			<h2 class="serif section-title">Installation</h2>
		</div>
		{#if ex.installationViews.length}
			<div class="install" style={`--cols: ${Math.min(ex.installationViews.length, 3)}`}>
				{#each ex.installationViews as src, i}
					<img {src} alt="Installation {i + 1}" />
				{/each}
			</div>
		{:else}
			<p class="empty">Inga installationsbilder ännu.</p>
		{/if}
	</div>
</section>

{#if data.related.length}
	<section class="band band-pad">
		<div class="container">
			<div class="section-head">
				<h2 class="serif section-title">
					{data.related.length === 1 ? 'Utställande konstnär' : 'Utställande konstnärer'}
				</h2>
				<a class="link-arrow" href="/konstnarer">Visa alla konstnärer</a>
			</div>
			<div class="artists">
				{#each data.related as a}
					<a href={`/konstnarer/${a.slug}`}>
						<img src={a.image} alt={a.name} />
						<strong class="serif">{a.name}</strong>
						<span class="label">{a.specialty}</span>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<nav class="band pager-band">
	<div class="pager container">
		{#if data.prev}
			<a href={`/utstallningar/${data.prev.slug}`}>
				<span class="label">Föregående utställning</span>
				<strong>{data.prev.id} · {data.prev.artist} — {data.prev.title}</strong>
			</a>
		{:else}
			<span></span>
		{/if}
		{#if data.next}
			<a class="right" href={`/utstallningar/${data.next.slug}`}>
				<span class="label">Nästa utställning</span>
				<strong>{data.next.id} · {data.next.artist} — {data.next.title}</strong>
			</a>
		{/if}
	</div>
</nav>

<style>
	.top {
		padding-block: 1.35rem 1.75rem;
	}

	.back {
		font-family: var(--font-sans);
		font-size: var(--text-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.hero {
		display: grid;
		gap: 1.5rem;
		padding-top: 0.85rem;
		align-items: start;
	}

	.hero-copy {
		padding-top: 0;
	}

	h1 {
		font-size: clamp(2rem, 4.5vw, 3rem);
		margin: 0.35rem 0 0.15rem;
		font-weight: 500;
	}

	.title {
		font-size: clamp(1.25rem, 2.5vw, 1.75rem);
		margin: 0 0 0.5rem;
		font-style: italic;
	}

	.dates {
		font-family: var(--font-sans);
		color: var(--text-muted);
		font-size: var(--text-meta);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		margin: 0 0 0.75rem;
	}

	.intro {
		font-family: var(--font-sans);
		color: var(--text-secondary);
		max-width: 34rem;
		line-height: 1.6;
		margin: 0;
		font-size: var(--text-body);
	}

	.hero-img {
		width: 100%;
		aspect-ratio: 16 / 11;
		object-fit: cover;
		object-position: center;
		background: #e8e8e2;
	}

	.subnav-sentinel {
		height: 0;
		width: 100%;
		pointer-events: none;
	}

	.subnav-spacer {
		pointer-events: none;
	}

	.subnav {
		border-block: 1px solid var(--border);
		background: rgba(255, 255, 255, 0.96);
		backdrop-filter: blur(8px);
	}

	.subnav.stuck {
		position: fixed;
		top: 0;
		left: var(--brand-edge);
		right: 0;
		z-index: 60;
		box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
	}

	.subnav-inner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		min-height: 3.25rem;
	}

	.ex-name {
		font-size: 0.95rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		flex-shrink: 1;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: min(42vw, 22rem);
	}

	.ex-name .sep {
		font-weight: 400;
		opacity: 0.55;
		margin-inline: 0.15em;
	}

	.subnav-links {
		display: flex;
		gap: 1.35rem;
		overflow-x: auto;
		margin-left: auto;
	}

	.subnav a,
	.dela {
		font-family: var(--font-sans);
		font-size: var(--text-label);
		font-weight: 600;
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--text-muted);
		padding: 1rem 0;
		white-space: nowrap;
	}

	.subnav a:hover {
		color: var(--text);
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	.dela {
		flex-shrink: 0;
		margin-left: 0.5rem;
	}

	.press {
		display: grid;
		gap: 2rem;
		align-items: start;
	}

	.text .section-head {
		margin-bottom: 1.1rem;
	}

	.text p {
		font-family: var(--font-sans);
		color: var(--text-secondary);
		max-width: 40rem;
		line-height: 1.65;
		margin: 0 0 0.85rem;
		font-size: var(--text-body);
	}

	.facts {
		border-top: 1px solid var(--border);
	}

	.fact {
		padding: 0.55rem 0;
		border-bottom: 1px solid var(--border);
		display: grid;
		gap: 0.2rem;
	}

	.fact-label {
		font-family: var(--font-sans);
		font-size: var(--text-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--text-muted);
		font-weight: 600;
	}

	.fact-value {
		font-family: var(--font-sans);
		font-size: var(--text-body);
		color: var(--text);
		word-break: break-word;
		line-height: 1.4;
	}

	.works {
		display: grid;
		gap: 0.85rem;
		grid-template-columns: repeat(var(--cols, 6), minmax(0, 1fr));
	}

	.works figure {
		margin: 0;
		min-width: 0;
	}

	.work-media {
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background: #ddd;
	}

	.work-media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
		transform: scale(1.06);
	}

	.works figcaption {
		font-family: var(--font-sans);
		font-size: var(--text-label);
		margin-top: 0.4rem;
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		font-weight: 600;
		color: var(--text-secondary);
		line-height: 1.35;
	}

	.install-band {
		padding-top: 0;
	}

	.install {
		display: grid;
		gap: 0.85rem;
		grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr));
	}

	.install img {
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		background: #ddd;
	}

	.artists {
		display: grid;
		gap: 1.25rem;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.artists img {
		aspect-ratio: 1;
		object-fit: cover;
		margin-bottom: 0.55rem;
		background: #e8e8e2;
	}

	.artists strong {
		display: block;
		font-weight: 500;
		font-size: 1.05rem;
		margin-bottom: 0.2rem;
	}

	.artists .label {
		margin: 0;
	}

	.pager-band {
		border-top: 1px solid var(--border);
	}

	.pager {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-block: 1.5rem 2.25rem;
	}

	.pager .right {
		text-align: right;
	}

	.pager strong {
		display: block;
		margin-top: 0.25rem;
		font-weight: 500;
		font-family: var(--font-serif);
		font-size: 1rem;
	}

	.empty {
		font-family: var(--font-sans);
		color: var(--text-muted);
		margin: 0;
		font-size: var(--text-body);
	}

	@media (max-width: 900px) {
		.works {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.install {
			grid-template-columns: 1fr;
		}

		.artists {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 901px) {
		.hero {
			grid-template-columns: 0.95fr 1.15fr;
			align-items: center;
		}

		.press {
			grid-template-columns: 1.35fr 0.75fr;
			gap: 3rem;
		}
	}
</style>
