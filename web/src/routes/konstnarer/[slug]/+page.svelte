<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { workHref } from '$lib/workLinks.js';
	import { newsCardHref, newsCardExternal } from '$lib/newsLinks';
	import ArtworkCard from '$lib/components/ArtworkCard.svelte';
	import ExhibitionRow from '$lib/components/ExhibitionRow.svelte';
	import ExhibitionCard from '$lib/components/ExhibitionCard.svelte';
	import NewsListItem from '$lib/components/NewsListItem.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ContactDialog from '$lib/components/ContactDialog.svelte';
	import { sanityImageDims, sanitySrcSet } from '$lib/sanityImageDims';

	let { data } = $props();
	const artist = $derived(data.artist);
	const next = $derived(data.next);
	const exhibitionRows = $derived(data.exhibitionRows ?? []);
	const artistArticles = $derived(data.artistArticles ?? []);
	const site = $derived(
		(page.data as { site?: { url: string; email: string } }).site ?? {
			url: 'https://galleriett-tjorn.pages.dev',
			email: 'info@galleriett-tjorn.se'
		}
	);

	const nextImage = $derived(
		next?.image || next?.heroImage || next?.works?.[0]?.image || null
	);
	const nextWorkTitle = $derived(next?.works?.[0]?.title ?? null);

	const promoWork = $derived(artist.works?.[0] ?? null);
	const portraitSrc = $derived(artist.image || artist.heroImage || null);
	const lcpSrc = $derived(promoWork?.image || portraitSrc);
	const lcpDims = $derived(sanityImageDims(lcpSrc, 1));
	const portraitDims = $derived(sanityImageDims(portraitSrc, 1));
	const promoSrcSet = $derived(sanitySrcSet(promoWork?.image, [480, 800, 1200]));
	const portraitSrcSet = $derived(sanitySrcSet(portraitSrc, [360, 640, 900]));
	const isHistorical = $derived(
		Boolean(artist.deceased || artist.died || artist.profileKind === 'historical')
	);
	const isStub = $derived(artist.profileKind === 'stub');
	/** Stub/historisk: maila galleriet (kontaktdata saknas eller irrelevant). */
	const mailGallery = $derived(isHistorical || isStub);
	const lifespanLine = $derived.by(() => {
		const born = artist.born?.trim() || '';
		const died = artist.died?.trim() || '';
		if (born && died) return `${born} – ${died}`;
		if (died) return `Dog ${died}`;
		if (born) return isHistorical ? born : `Född ${born}`;
		return '';
	});
	const contactPageUrl = $derived(`${site.url}${page.url.pathname}`);
	const contactSubject = $derived(`Angående ${artist.name}`);
	const contactContext = $derived(
		mailGallery
			? `Hej GALLERIett,\n\nJag vill komma i kontakt angående ${artist.name}.\n\nLänk: ${contactPageUrl}\n\nVänliga hälsningar`
			: `Hej GALLERIett,\n\nJag vill komma i kontakt angående konstnären ${artist.name}.\n\nLänk: ${contactPageUrl}\n\nVänliga hälsningar`
	);
	let contactOpen = $state(false);

	const hasWorks = $derived((artist.works?.length ?? 0) > 0);
	const hasBioText = $derived(Boolean(artist.bio?.trim()));
	const hasBioFacts = $derived(
		Boolean(
			artist.born ||
				artist.died ||
				artist.presentedBy ||
				artist.education?.length ||
				artist.lives ||
				artist.representedIn?.length ||
				artist.website
		)
	);
	const hasBiography = $derived(hasBioText || hasBioFacts);
	const hasExhibitions = $derived(exhibitionRows.length > 0);
	const hasNews = $derived(artistArticles.length > 0 || (artist.press?.length ?? 0) > 0);
	const hasIntro = $derived(Boolean(artist.intro?.trim()));

	const currentExhibitions = $derived(exhibitionRows.filter((ex) => ex.current));
	const pastExhibitions = $derived(exhibitionRows.filter((ex) => !ex.current));

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

<Seo
	title="{artist.name} · GALLERIett"
	description={artist.intro || `${artist.name}, ${artist.specialty}. Representerad av GALLERIett, Tjörn.`}
	image={artist.image}
/>

<Breadcrumbs
	crumbs={[
		{ name: 'Konstnärer', href: '/konstnarer' },
		{ name: artist.name }
	]}
/>

<section class="band-soft">
	<div class="container top">
		<div class="hero">
			<div class="hero-copy">
				<p class="label">Konstnär</p>
				<h1 class="serif">{artist.name}</h1>
				{#if lifespanLine}
					<p class="born">{lifespanLine}</p>
				{/if}
				{#if artist.presentedBy}
					<p class="presented">Verk visas via {artist.presentedBy}</p>
				{/if}
				{#if hasIntro}
					<p class="intro">{artist.intro}</p>
				{/if}
				<button class="btn" type="button" onclick={() => (contactOpen = true)}>
					{mailGallery ? 'Maila GALLERIett →' : 'Maila konstnären →'}
				</button>
			</div>
			{#if promoWork || portraitSrc}
				<div class="hero-media" class:solo={!promoWork || !portraitSrc}>
					{#if promoWork}
						<img
							src={promoWork.image}
							srcset={promoSrcSet}
							sizes="(min-width: 900px) 40vw, 60vw"
							alt={promoWork.title ? `${artist.name} — ${promoWork.title}` : artist.name}
							width={lcpDims.width}
							height={lcpDims.height}
							fetchpriority="high"
							decoding="async"
						/>
					{/if}
					{#if portraitSrc}
						<img
							src={portraitSrc}
							srcset={portraitSrcSet}
							sizes="(min-width: 900px) 30vw, 45vw"
							alt={artist.name}
							width={portraitDims.width}
							height={portraitDims.height}
							loading={promoWork ? 'lazy' : undefined}
							fetchpriority={promoWork ? undefined : 'high'}
							decoding="async"
						/>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</section>

<ContactDialog
	bind:open={contactOpen}
	title={mailGallery ? 'Kontakta GALLERIett' : `Kontakta oss om ${artist.name}`}
	subject={contactSubject}
	contextText={contactContext}
	pageUrl={contactPageUrl}
	kind="artist"
/>

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
		<strong class="artist-name serif">{artist.name}</strong>
		<div class="subnav-links">
			{#if hasWorks}
				<a href="#works">Verk</a>
			{/if}
			{#if hasBiography}
				<a href="#biography">Biografi</a>
			{/if}
			{#if hasExhibitions}
				<a href="#exhibitions">Utställningar</a>
			{/if}
			{#if hasNews}
				<a href="#news">Nyheter</a>
			{/if}
		</div>
	</div>
</nav>

{#if hasWorks}
	<section id="works" class="band band-pad">
		<div class="container">
			<div class="section-head">
				<h2 class="serif section-title">Verk</h2>
			</div>
			<div class="works">
				{#each artist.works as work}
					<ArtworkCard
						href={workHref(artist.slug, work)}
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

{#if hasBiography}
	<section id="biography" class="band-soft band-pad">
		<div class="container bio">
			<div>
				<div class="section-head">
					<h2 class="serif section-title">Biografi</h2>
				</div>
				{#if hasBioText}
					<p>{artist.bio}</p>
				{/if}
				{#if artist.website}
					<a class="link-arrow" href={artist.website} target="_blank" rel="noreferrer">Hemsida</a>
				{/if}
			</div>
			<dl>
				{#if artist.born}
					<div>
						<dt>Född</dt>
						<dd>{artist.born}</dd>
					</div>
				{/if}
				{#if artist.died}
					<div>
						<dt>Dog</dt>
						<dd>{artist.died}</dd>
					</div>
				{/if}
				{#if artist.presentedBy}
					<div>
						<dt>Visas via</dt>
						<dd>{artist.presentedBy}</dd>
					</div>
				{/if}
				{#if artist.education?.length}
					<div>
						<dt>Utbildning</dt>
						{#each artist.education as e}
							<dd>{e}</dd>
						{/each}
					</div>
				{/if}
				{#if artist.lives}
					<div>
						<dt>Bor och verkar</dt>
						<dd>{artist.lives}</dd>
					</div>
				{/if}
				{#if artist.representedIn?.length}
					<div>
						<dt>Representerad i</dt>
						<dd>{artist.representedIn.join(', ')}</dd>
					</div>
				{/if}
			</dl>
		</div>
	</section>
{/if}

{#if hasExhibitions}
	<section id="exhibitions" class="band band-pad">
		<div class="container exhibitions-stack">
			{#if currentExhibitions.length}
				<div>
					<div class="section-head">
						<h2 class="serif section-title">Aktuella utställningar</h2>
					</div>
					<ul class="list">
						{#each currentExhibitions as ex}
							<ExhibitionRow
								href={ex.href}
								leading={ex.year}
								title={ex.title}
								subtitle={ex.venue}
								intro={ex.intro}
								image={ex.image}
								status={ex.status}
								showPlus={Boolean(ex.href)}
							/>
						{/each}
					</ul>
				</div>
			{/if}

			{#if pastExhibitions.length}
				<div>
					<div class="section-head">
						<h2 class="serif section-title">Tidigare utställningar</h2>
					</div>
					<div class="ex-grid">
						{#each pastExhibitions as ex}
							{#if ex.image && ex.href}
								<ExhibitionCard
									href={ex.href}
									image={ex.image}
									title={ex.cardTitle}
									subtitle="{ex.year} · {ex.venue}"
									alt={ex.cardTitle}
								/>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</section>
{/if}

{#if hasNews}
	<section id="news" class="band-soft band-pad">
		<div class="container">
			<div class="section-head">
				<h2 class="serif section-title">Nyheter</h2>
				<a class="link-arrow" href="/nyheter">Visa alla</a>
			</div>
			{#if artistArticles.length}
				<div class="news-list">
					{#each artistArticles as item}
						<NewsListItem
							href={newsCardHref(item)}
							external={newsCardExternal(item)}
							image={item.thumb ?? item.image}
							category={item.category}
							title={item.title}
							dateLabel={item.dateLabel}
						/>
					{/each}
				</div>
			{/if}
			{#if artist.press?.length}
				<div class="press" class:spaced={artistArticles.length > 0}>
					{#each artist.press as p}
						<blockquote>
							<p class="serif">“{p.quote}”</p>
							<footer>{p.source}</footer>
						</blockquote>
					{/each}
				</div>
			{/if}
		</div>
	</section>
{/if}

<section class="band band-pad">
	<div class="container more">
		{#if next}
			<a class="next" href={`/konstnarer/${next.slug}`}>
				{#if nextImage}
					<img class="next-img" src={nextImage} alt="" loading="lazy" decoding="async" />
				{/if}
				<div class="next-copy">
					<span class="label">Nästa konstnär</span>
					<strong class="serif">{next.name}</strong>
					{#if nextWorkTitle}
						<em class="next-work">{nextWorkTitle}</em>
					{:else if next.specialty}
						<span class="next-specialty">{next.specialty}</span>
					{/if}
				</div>
			</a>
		{/if}
	</div>
</section>

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
		margin: 0.35rem 0 0.35rem;
		font-weight: 500;
	}

	.born {
		font-family: var(--font-sans);
		font-size: var(--text-meta);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--text-muted);
		margin: 0 0 0.35rem;
	}

	.presented {
		font-family: var(--font-sans);
		font-size: var(--text-meta);
		color: var(--text-secondary);
		margin: 0 0 0.75rem;
	}

	.intro {
		font-family: var(--font-sans);
		color: var(--text-secondary);
		max-width: 34rem;
		line-height: 1.6;
		margin: 0 0 1.25rem;
		font-size: var(--text-body);
	}

	.hero-media {
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 0.45rem;
		aspect-ratio: 16 / 11;
		min-height: 0;
		background: #e8e8e2;
	}

	.hero-media.solo {
		grid-template-columns: 1fr;
	}

	.hero-media img {
		width: 100%;
		height: 100%;
		min-height: 0;
		object-fit: cover;
		object-position: center;
		display: block;
	}

	.hero-media img:last-child {
		object-position: center top;
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

	#works,
	#biography,
	#exhibitions,
	#news {
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
		max-width: 9.5rem;
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

	.subnav a {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
		padding: 1rem 0;
		white-space: nowrap;
	}

	.subnav a:hover {
		color: var(--text);
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	@media (max-width: 899px) {
		.artist-name {
			display: none;
		}

		.subnav-links {
			mask-image: linear-gradient(to right, #000 0%, #000 calc(100% - 1.25rem), transparent 100%);
		}

		.subnav:not(.stuck) .subnav-links {
			mask-image: none;
		}
	}

	@media (min-width: 900px) {
		.artist-name {
			flex-shrink: 0;
			max-width: none;
			overflow: visible;
			text-overflow: unset;
		}

		.subnav-links {
			flex: 0 1 auto;
			margin-left: auto;
			mask-image: none;
			overflow-x: visible;
		}
	}

	.works {
		display: grid;
		gap: 1.5rem 1.25rem;
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

	.bio {
		display: grid;
		gap: 2rem;
	}

	.bio .section-head {
		margin-bottom: 1.1rem;
	}

	.bio p {
		font-family: var(--font-sans);
		font-size: var(--text-body);
		color: var(--text-secondary);
		max-width: 40rem;
		line-height: 1.65;
		margin: 0;
	}

	dl {
		margin: 0;
	}

	dl > div {
		padding: 0.55rem 0;
		border-bottom: 1px solid var(--border);
	}

	dt {
		font-family: var(--font-sans);
		font-size: var(--text-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 0.2rem;
		font-weight: 600;
	}

	dd {
		margin: 0;
		font-family: var(--font-sans);
		font-size: var(--text-body);
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.exhibitions-stack {
		display: flex;
		flex-direction: column;
		gap: 2.75rem;
	}

	.ex-grid {
		display: grid;
		gap: 2rem 1.5rem;
		grid-template-columns: 1fr;
	}

	@media (min-width: 600px) {
		.ex-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 900px) {
		.ex-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1100px) {
		.ex-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.news-list {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: 1fr;
	}

	@media (min-width: 900px) {
		.news-list {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.press {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	}

	.press.spaced {
		margin-top: 1.5rem;
	}

	blockquote {
		margin: 0;
		padding: 1.25rem;
		background: var(--bg-soft);
		border: 1px solid var(--border);
	}

	blockquote p {
		font-size: 1.2rem;
		margin: 0 0 0.75rem;
	}

	blockquote footer {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.more {
		display: grid;
		gap: 2rem;
	}

	.next {
		display: grid;
		grid-template-columns: minmax(0, 11rem) 1fr;
		gap: 1.25rem;
		align-items: center;
		text-decoration: none;
		color: inherit;
		max-width: 36rem;
	}

	.next:hover .next-img,
	.next:focus-visible .next-img {
		box-shadow: 0 0 0 1px var(--brand);
	}

	.next:hover strong,
	.next:focus-visible strong {
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	.next-img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		background: #e8e8e2;
		display: block;
	}

	.next-copy {
		min-width: 0;
	}

	.next strong {
		display: inline-block;
		font-size: clamp(1.5rem, 3vw, 2rem);
		margin-top: 0.35rem;
		font-weight: 500;
	}

	.next-work {
		display: block;
		margin-top: 0.35rem;
		font-size: 1.05rem;
		font-style: italic;
		font-weight: 500;
		color: var(--text-secondary);
	}

	.next-specialty {
		display: block;
		margin-top: 0.35rem;
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	@media (max-width: 600px) {
		.next {
			grid-template-columns: 5.5rem 1fr;
			gap: 0.9rem;
		}

		.next strong {
			font-size: 1.35rem;
		}
	}

	.empty {
		color: var(--text-muted);
		margin: 0;
	}

	@media (min-width: 900px) {
		.hero {
			grid-template-columns: 0.95fr 1.15fr;
			align-items: center;
		}

		.bio {
			grid-template-columns: 1.4fr 0.8fr;
		}
	}
</style>
