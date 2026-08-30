<script lang="ts">
	import ExhibitionCard from '$lib/components/ExhibitionCard.svelte';
	import NewsListItem from '$lib/components/NewsListItem.svelte';
	import SponsorsCarousel from '$lib/components/SponsorsCarousel.svelte';
	import { newsCardHref, newsCardExternal } from '$lib/newsLinks';
	import { sanityImageDims, sanitySrcSet } from '$lib/sanityImageDims';

	let { data } = $props();

	const hero = $derived(data.hero);
	const featuredExhibitions = $derived(data.featuredExhibitions);
	const news = $derived(data.news);
	const featuredNews = $derived(data.featuredNews);
	const about = $derived(data.about);
	const showSponsors = $derived(data.showSponsors === true);
	const homeSponsors = $derived(data.homeSponsors);

	function cardSrc(item: { cardImage?: string; image: string }) {
		return item.cardImage ?? item.image;
	}

	const heroLabel = $derived(
		hero?.status === 'ongoing' ? 'Pågående utställning' : 'Nästa utställning'
	);
	const heroDims = $derived(sanityImageDims(hero?.image, 0.56));
	const heroSrcSet = $derived(sanitySrcSet(hero?.image, [640, 1000, 1600]));
	const aboutSrcSet = $derived(sanitySrcSet(about?.image, [640, 1000, 1400]));
	const aboutDims = $derived(sanityImageDims(about?.image, 0.53));
</script>

<section class="hero">
	{#if hero}
		<img
			src={hero.image}
			srcset={heroSrcSet}
			sizes="100vw"
			alt="{hero.artist} — {hero.title}"
			class="hero-img"
			width={heroDims.width}
			height={heroDims.height}
			fetchpriority="high"
			decoding="async"
		/>
		<div class="hero-copy">
			<p class="label hero-label">{heroLabel}</p>
			<h1 class="serif">
				<span class="hero-artist">{hero.artist}</span>
				<em class="hero-title">{hero.title}</em>
			</h1>
			<p class="dates">{hero.datesLabel}</p>
			<a class="btn" href={`/utstallningar/${hero.slug}`}>Läs mer om utställningen →</a>
		</div>
	{/if}
</section>

<section class="section band">
	<div class="container">
		<div class="section-head">
			<h2 class="label">Aktuellt</h2>
			<a class="link-arrow" href="/utstallningar">Se aktuella utställningar</a>
		</div>
		<div class="cards">
			{#each featuredExhibitions as item}
				<ExhibitionCard
					href={`/utstallningar/${item.slug}`}
					image={cardSrc(item)}
					title="{item.artist} – {item.title}"
					subtitle={item.datesLabel}
					status={item.status}
					alt="{item.artist} — {item.title}"
					sizes="(max-width: 900px) 100vw, 33vw"
				/>
			{/each}
			{#if featuredNews}
				<ExhibitionCard
					href={featuredNews.clickable ? `/nyheter/${featuredNews.slug}` : '/nyheter'}
					image={featuredNews.image}
					title={featuredNews.title}
					subtitle={featuredNews.dateLabel}
					badge={featuredNews.category}
					badgeMuted
					alt={featuredNews.title}
					sizes="(max-width: 900px) 100vw, 33vw"
				/>
			{/if}
		</div>
	</div>
</section>

<section class="about band-soft">
	<div class="container about-grid">
		<div>
			<p class="label">{about.label}</p>
			<h2 class="serif">{about.headline}</h2>
			<p class="body">{about.body}</p>
			<a class="link-arrow" href="/om">Läs mer om GALLERIett</a>
		</div>
		<img
			src={about.image}
			srcset={aboutSrcSet || undefined}
			sizes="(min-width: 901px) 50vw, 100vw"
			alt="Galleri Ett vid kusten"
			width={aboutDims.width}
			height={aboutDims.height}
			loading="lazy"
			decoding="async"
		/>
	</div>
</section>

<section class="section band">
	<div class="container">
		<div class="section-head">
			<h2 class="label">Nyheter</h2>
			<a class="link-arrow" href="/nyheter">Till nyheter</a>
		</div>
		<div class="news-list">
			{#each news.slice(0, 3) as item}
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
	</div>
</section>

{#if showSponsors}
	<section class="section band-soft sponsors">
		<div class="container">
			<div class="section-head">
				<h2 class="label">Sponsorer</h2>
				<a class="link-arrow" href="/sponsorer">Till sponsorer</a>
			</div>
			<p class="sponsors-lead">Ett varmt tack till alla sponsorer</p>
			<SponsorsCarousel sponsors={homeSponsors} />
		</div>
	</section>
{/if}

<style>
	.hero {
		position: relative;
		min-height: min(58vh, 560px);
		display: grid;
		align-items: center;
		justify-items: start;
		padding-inline: var(--pad);
		color: #fff;
		background: #1a1a12;
		overflow: hidden;
	}

	.hero-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 60% center;
	}

	.hero::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			105deg,
			rgba(20, 20, 16, 0.72) 0%,
			rgba(20, 20, 16, 0.35) 42%,
			rgba(20, 20, 16, 0.08) 100%
		);
	}

	.hero-copy {
		position: relative;
		z-index: 1;
		width: min(44rem, 100%);
		/* Mobil: ingen sidoförskjutning (28vw + width:100% stackade ut till höger). */
		margin-left: 0;
		margin-top: -2vh;
		padding: 1.15rem 1.1rem 1.35rem;
		box-sizing: border-box;
		/* Mobil: lokal scrim — dämpar inbakad bildtext bakom CTA */
		background: rgba(20, 20, 16, 0.72);
		box-shadow: 0 0 2.5rem 1.5rem rgba(20, 20, 16, 0.55);
		-webkit-backdrop-filter: blur(8px);
		backdrop-filter: blur(8px);
	}

	@media (max-width: 799px) {
		.hero::after {
			background: linear-gradient(
				180deg,
				rgba(20, 20, 16, 0.4) 0%,
				rgba(20, 20, 16, 0.55) 50%,
				rgba(20, 20, 16, 0.35) 100%
			);
		}

		.hero-artist,
		.hero-title,
		.dates {
			text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35);
		}
	}

	@media (min-width: 800px) {
		.hero-copy {
			/* Desktop: smalare block i vänsterfältet — text i bilden, inte kort */
			width: fit-content;
			max-width: min(32rem, 48vw);
			margin-left: clamp(1.75rem, 18vw, 12rem);
			margin-top: -5vh;
			padding: 0.35rem 0.85rem 0.5rem 0;
			background: transparent;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}

		.hero-artist,
		.hero-title,
		.dates {
			text-shadow: 0 2px 18px rgba(0, 0, 0, 0.45);
		}
	}

	.hero-label {
		color: rgba(255, 255, 255, 0.9);
		border-bottom: 1px solid var(--brand);
		display: inline-block;
		padding-bottom: 0.35rem;
		margin-bottom: 1rem;
	}

	h1 {
		margin: 0 0 0.75rem;
		font-style: italic;
		font-weight: 500;
		line-height: 1.12;
	}

	.hero-artist,
	.hero-title {
		display: block;
	}

	.hero-artist {
		font-size: clamp(1.85rem, 4.2vw, 3.1rem);
		text-wrap: balance;
	}

	.hero-title {
		font-style: normal;
		font-size: clamp(2.1rem, 5vw, 3.5rem);
		margin-top: 0.15em;
	}

	@media (min-width: 900px) {
		.hero-artist {
			white-space: nowrap;
		}
	}

	.dates {
		margin: 0 0 1.5rem;
		letter-spacing: 0.08em;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.section {
		padding-block: 2rem;
	}

	.section.sponsors {
		padding-block: 1.5rem 1.75rem;
	}

	.section-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		margin-bottom: 1rem;
		padding-bottom: 0.55rem;
		border-bottom: 1px solid var(--border);
	}

	.cards {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.about {
		padding-block: 3.5rem;
	}

	.about-grid {
		display: grid;
		gap: 2rem;
		align-items: center;
	}

	.about h2 {
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		margin: 0.75rem 0 1rem;
		font-weight: 500;
	}

	.body {
		color: var(--text-secondary);
		max-width: 36rem;
		margin-bottom: 1.25rem;
		line-height: 1.65;
	}

	.about img {
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		object-position: center;
	}

	.news-list {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.sponsors-lead {
		margin: 0 0 0.85rem;
		font-size: var(--text-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--text-muted);
		font-weight: 600;
	}

	@media (max-width: 900px) {
		.cards,
		.news-list {
			grid-template-columns: 1fr;
		}

		.about-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (min-width: 901px) {
		.about-grid {
			grid-template-columns: 1fr 1.15fr;
		}
	}
</style>
