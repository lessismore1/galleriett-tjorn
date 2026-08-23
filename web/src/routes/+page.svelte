<script lang="ts">
	import {
		about,
		getOngoingExhibitions,
		getUpcomingExhibitions,
		getNewsIndex,
		getRotatedSponsors,
		newsCardHref,
		newsCardExternal
	} from '$lib/data/mockData.js';
	import ExhibitionCard from '$lib/components/ExhibitionCard.svelte';
	import NewsListItem from '$lib/components/NewsListItem.svelte';
	import SponsorsCarousel from '$lib/components/SponsorsCarousel.svelte';

	const ongoingList = getOngoingExhibitions();
	const ongoing = ongoingList[0];
	const featuredExhibitions = [...ongoingList, ...getUpcomingExhibitions()].slice(0, 2);
	const news = getNewsIndex();
	const featuredNews = news.find((n) => n.clickable) ?? news[0];
	const homeSponsors = getRotatedSponsors();

	function cardSrc(item: { cardImage?: string; image: string }) {
		return item.cardImage ?? item.image;
	}
</script>

<section class="hero">
	{#if ongoing}
		<img
			src={ongoing.image}
			alt="{ongoing.artist} — {ongoing.title}"
			class="hero-img"
		/>
		<div class="container hero-copy">
			<p class="label hero-label">Pågående utställning</p>
			<h1 class="serif">
				{ongoing.artist}<br />
				<em>{ongoing.title}</em>
			</h1>
			<p class="dates">{ongoing.datesLabel}</p>
			<a class="btn" href={`/utstallningar/${ongoing.slug}`}>Läs mer om utställningen →</a>
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
		<img src={about.image} alt="Galleri Ett vid kusten" />
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

<style>
	.hero {
		position: relative;
		min-height: min(58vh, 560px);
		display: grid;
		align-items: end;
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
		padding-block: 3.5rem 4rem;
		max-width: 36rem;
	}

	.hero-label {
		color: rgba(255, 255, 255, 0.9);
		border-bottom: 1px solid var(--brand);
		display: inline-block;
		padding-bottom: 0.35rem;
		margin-bottom: 1rem;
	}

	h1 {
		font-size: clamp(2.4rem, 6vw, 4rem);
		margin: 0 0 0.75rem;
		font-style: italic;
		font-weight: 500;
	}

	h1 em {
		font-style: normal;
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
