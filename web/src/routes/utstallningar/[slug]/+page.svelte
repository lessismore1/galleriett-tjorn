<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import ArtworkCard from '$lib/components/ArtworkCard.svelte';
	import ArtistCard from '$lib/components/ArtistCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const ex = $derived(data.exhibition);
	const site = $derived(
		(page.data as { site?: { email: string } }).site ?? {
			email: 'info@galleriett-tjorn.se'
		}
	);

	const worksWithLinks = $derived(
		(ex.works ?? []).map((work) => ({
			title: work.title,
			image: work.image,
			year: work.year ?? null,
			medium: work.medium ?? null,
			dimensions: work.dimensions ?? null,
			href: work.href ?? null
		}))
	);

	const hasWorks = $derived(worksWithLinks.length > 0);
	const hasInstallation = $derived((ex.installationViews?.length ?? 0) > 0);
	const hasVideos = $derived((ex.videos?.length ?? 0) > 0);
	/** Visa alla utställare A–Ö. Stubs utan porträtt får monogramkort. Dölj bara TKS-gruppen. */
	const relatedArtists = $derived(
		(data.related ?? []).filter(
			(a) => a.slug !== '15-tks-medlemmar' && !/tks-medlemmar/i.test(a.slug || '')
		)
	);
	const hasRelatedArtists = $derived(relatedArtists.length > 0);

	function artistInitials(name: string) {
		const parts = (name || '').trim().split(/\s+/).filter(Boolean);
		if (parts.length >= 2) {
			return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
		}
		return (name || '?').slice(0, 2).toUpperCase();
	}
	const hasPress = $derived(Boolean(ex.pressRelease?.trim()));

	const pageTitle = $derived(`${ex.artist} | ${ex.title} · GALLERIett`);
	const pageDescription = $derived(
		ex.intro?.trim() ||
			`${ex.artist} — ${ex.title}. ${ex.datesLabel}. Utställning på GALLERIett, Tjörn.`
	);
	const facebookEventUrl = $derived(
		typeof ex.facebookEventUrl === 'string' ? ex.facebookEventUrl.trim() : ''
	);
	const isLiveRsvp =
		$derived(
			(ex.status === 'ongoing' || ex.status === 'upcoming') &&
				/facebook\.com\/events\//i.test(facebookEventUrl)
		);
	const sources = $derived(
		Array.isArray(ex.sources) ? ex.sources.filter((s) => s?.url) : []
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

<Breadcrumbs
	crumbs={[
		{ name: 'Utställningar', href: '/utstallningar' },
		{ name: ex.title }
	]}
/>

<section class="band-soft">
	<div class="container top">
		<div class="hero">
			<div class="hero-copy">
				<p class="label">Utställning {ex.id}</p>
				<h1 class="serif">{ex.artist}</h1>
				<p class="title serif">{ex.title}</p>
				<p class="dates">{ex.datesLabel}</p>
				<p class="intro">{ex.intro}</p>
				{#if isLiveRsvp}
					<div class="fb-cta">
						<a
							class="fb-link"
							href={facebookEventUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"
								><path
									fill="currentColor"
									d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
								/></svg
							>
							<span>Säg att du kommer på Facebook</span>
							<span class="fb-arrow" aria-hidden="true">→</span>
						</a>
						<p class="fb-hint">På event-sidan: tryck <strong>Kommer</strong> så syns det för dina vänner.</p>
					</div>
				{/if}
				{#if sources.length}
					<div class="sources">
						<p class="sources-label">Källa</p>
						<ul class="sources-list">
							{#each sources as s}
								<li>
									<a href={s.url} target="_blank" rel="noopener noreferrer"
										>{s.label || 'Länk'} →</a
									>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
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
		{#if stuck}
			<a class="subnav-home" href="/" aria-label="GALLERIett, Tjörn — startsida">
				<img src="/images/logo.webp" alt="" width="36" height="36" />
				<span class="place">Tjörn</span>
			</a>
		{/if}
		<strong class="ex-name serif">{ex.artist} <span class="sep">|</span> {ex.title}</strong>
		<div class="subnav-links">
			{#if hasPress}
				<a href="#press-release">Pressmeddelande</a>
			{/if}
			{#if hasWorks}
				<a href="#works">Verk</a>
			{/if}
			{#if hasInstallation}
				<a href="#installation">Installation</a>
			{/if}
			{#if hasVideos}
				<a href="#video">Video</a>
			{/if}
		</div>
		<span class="dela">Dela</span>
	</div>
</nav>

{#if hasPress}
	<section id="press-release" class="band band-pad">
		<div class="container press">
			<div class="text">
				<div class="section-head">
					<h2 class="serif section-title">Pressmeddelande</h2>
				</div>
				{#each (ex.pressRelease || '').split('\n').filter(Boolean) as para}
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
{:else}
	<section class="band band-pad">
		<div class="container press">
			<aside class="facts facts-solo">
				{#each facts as fact}
					<div class="fact">
						<span class="fact-label">{fact.label}</span>
						<span class="fact-value">{fact.value}</span>
					</div>
				{/each}
			</aside>
		</div>
	</section>
{/if}

{#if hasWorks}
	<section id="works" class="band-soft band-pad">
		<div class="container">
			<div class="section-head">
				<h2 class="serif section-title">Verk</h2>
			</div>
			<div class="works">
				{#each worksWithLinks as work}
					<ArtworkCard
						href={work.href}
						title={work.title}
						image={work.image}
						year={work.year}
						medium={work.medium}
						dimensions={work.dimensions}
					/>
				{/each}
			</div>
		</div>
	</section>
{/if}

{#if hasInstallation}
	<section
		id="installation"
		class="band-soft band-pad"
		class:install-band={hasWorks}
	>
		<div class="container">
			<div class="section-head">
				<h2 class="serif section-title">Installation</h2>
			</div>
			<div class="install" style={`--cols: ${Math.min(ex.installationViews.length, 3)}`}>
				{#each ex.installationViews as view, i}
					<figure>
						<img src={view.src} alt={view.alt || `Installation ${i + 1}`} />
						{#if view.caption}
							<figcaption>{view.caption}</figcaption>
						{/if}
					</figure>
				{/each}
			</div>
		</div>
	</section>
{/if}

{#if hasVideos}
	<section id="video" class="band band-pad">
		<div class="container">
			<div class="section-head">
				<h2 class="serif section-title">Video</h2>
			</div>
			<div class="videos" style={`--cols: ${Math.min(ex.videos.length, 2)}`}>
				{#each ex.videos as v}
					<a class="video-card" href={v.url} target="_blank" rel="noreferrer">
						{#if v.thumbnail}
							<img src={v.thumbnail} alt="" />
						{/if}
						<div class="video-meta">
							<strong>{v.title}</strong>
							<span>Öppna på Instagram →</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

{#if hasRelatedArtists}
	<section class="band band-pad">
		<div class="container">
			<div class="section-head">
				<h2 class="serif section-title">
					{relatedArtists.length === 1 ? 'Utställande konstnär' : 'Utställande konstnärer'}
				</h2>
				<a class="link-arrow" href="/konstnarer">Visa alla konstnärer</a>
			</div>
			<div class="artists">
				{#each relatedArtists as a}
					{#if a.image}
						<ArtistCard artist={a} mediaMode="portrait" showIcon={false} showBadge={false} />
					{:else}
						<a class="artist-stub" href={`/konstnarer/${a.slug}`}>
							<div class="monogram" aria-hidden="true">{artistInitials(a.name)}</div>
							<div class="stub-meta">
								<h2 class="serif">{a.name} <span class="arrow" aria-hidden="true">→</span></h2>
								<p>{a.specialty || 'Utställare'}</p>
							</div>
						</a>
					{/if}
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
		<a class="all" href="/utstallningar">
			<span class="label">Alla årets</span>
			<strong>Utställningar</strong>
		</a>
		{#if data.next}
			<a class="right" href={`/utstallningar/${data.next.slug}`}>
				<span class="label">Nästa utställning</span>
				<strong>{data.next.id} · {data.next.artist} — {data.next.title}</strong>
			</a>
		{:else}
			<span></span>
		{/if}
	</div>
</nav>

<style>
	.top {
		padding-block: 1.35rem 1.75rem;
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

	.fb-cta {
		margin-top: 1.15rem;
		max-width: 34rem;
	}

	.fb-link {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-family: var(--font-sans);
		font-size: var(--text-label);
		font-weight: 600;
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.fb-link:hover {
		color: var(--text);
	}

	.fb-arrow {
		color: var(--brand);
	}

	.fb-hint {
		margin: 0.4rem 0 0;
		font-family: var(--font-sans);
		font-size: var(--text-meta);
		line-height: 1.45;
		color: var(--text-muted);
	}

	.fb-hint strong {
		font-weight: 600;
		color: var(--text-secondary);
	}

	.sources {
		margin-top: 1.15rem;
		max-width: 34rem;
	}

	.sources-label {
		margin: 0 0 0.35rem;
		font-family: var(--font-sans);
		font-size: var(--text-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		font-weight: 600;
		color: var(--text-muted);
	}

	.sources-list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.sources-list a {
		font-family: var(--font-sans);
		font-size: var(--text-body);
		color: var(--text-secondary);
	}

	.sources-list a:hover {
		color: var(--text);
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

	#press-release,
	#works,
	#installation {
		scroll-margin-top: 4.25rem;
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
		align-items: center;
		gap: 0.75rem;
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
		max-width: 9.5rem;
	}

	.ex-name .sep {
		font-weight: 400;
		opacity: 0.55;
		margin-inline: 0.15em;
	}

	.subnav-links {
		display: flex;
		gap: 1.1rem;
		flex: 1;
		min-width: 0;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x proximity;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		mask-image: linear-gradient(to right, #000 0%, #000 calc(100% - 1.5rem), transparent 100%);
	}

	.subnav-links::-webkit-scrollbar {
		display: none;
	}

	.subnav-links a {
		scroll-snap-align: start;
		flex-shrink: 0;
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
		margin-left: 0.25rem;
	}

	@media (max-width: 899px) {
		.ex-name {
			display: none;
		}

		.subnav-links {
			mask-image: linear-gradient(to right, #000 0%, #000 calc(100% - 1.25rem), transparent 100%);
		}

		.subnav:not(.stuck) .subnav-links {
			mask-image: none;
		}

		.dela {
			display: none;
		}

		.pager {
			grid-template-columns: 1fr;
			gap: 1.35rem;
		}

		.pager .right,
		.pager .all {
			text-align: left;
			justify-self: stretch;
		}

		.pager strong {
			font-size: 1.05rem;
			line-height: 1.3;
		}

		.pager > span:empty {
			display: none;
		}
	}

	@media (min-width: 900px) {
		.ex-name {
			max-width: min(42vw, 22rem);
		}

		.subnav-links {
			flex: 0 1 auto;
			margin-left: auto;
			mask-image: none;
			overflow-x: visible;
		}
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

	.facts-solo {
		max-width: 28rem;
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
		gap: 1.25rem 0.85rem;
		grid-template-columns: 1fr;
	}

	@media (min-width: 600px) {
		.works {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 900px) {
		.works {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1100px) {
		.works {
			grid-template-columns: repeat(4, 1fr);
		}
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

	.install figcaption {
		margin-top: 0.45rem;
		font-size: var(--text-meta, 0.75rem);
		letter-spacing: var(--track-label, 0.04em);
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.videos {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr));
	}

	.video-card {
		display: grid;
		gap: 0.6rem;
		color: inherit;
		text-decoration: none;
	}

	.video-card img {
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		background: #ddd;
	}

	.video-meta {
		display: grid;
		gap: 0.2rem;
	}

	.video-meta strong {
		font-weight: 600;
	}

	.video-meta span {
		font-size: var(--text-meta, 0.75rem);
		letter-spacing: var(--track-label, 0.04em);
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.artists {
		display: grid;
		gap: 1.25rem 0.85rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.artist-stub {
		display: flex;
		flex-direction: column;
		min-width: 0;
		height: 100%;
		color: inherit;
		text-decoration: none;
	}

	.monogram {
		aspect-ratio: 1;
		display: grid;
		place-items: center;
		background: #e8e8e2;
		color: var(--text-muted);
		font-family: var(--font-serif, Georgia, serif);
		font-size: clamp(2rem, 4vw, 2.75rem);
		font-weight: 500;
		letter-spacing: 0.04em;
	}

	.stub-meta {
		padding-top: 0.65rem;
		min-width: 0;
	}

	.stub-meta h2 {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 500;
	}

	.stub-meta .arrow {
		font-size: 0.95em;
		font-weight: 600;
	}

	.stub-meta p {
		margin: 0.2rem 0 0;
		font-size: var(--text-meta, 0.7rem);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	@media (min-width: 900px) {
		.artists {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (min-width: 1100px) {
		.artists {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	.pager-band {
		border-top: 1px solid var(--border);
	}

	.pager {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 1rem;
		align-items: start;
		padding-block: 1.5rem;
	}

	.pager .right {
		text-align: right;
		justify-self: end;
	}

	.pager .all {
		text-align: center;
		justify-self: center;
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
		.install {
			grid-template-columns: 1fr;
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
