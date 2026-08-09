<script lang="ts">
	import {
		about,
		getOngoingExhibitions,
		getUpcomingExhibitions,
		getNewsIndex,
		statusLabels,
		getRotatedSponsors
	} from '$lib/data/mockData.js';
	import SponsorsCarousel from '$lib/components/SponsorsCarousel.svelte';

	const ongoingList = getOngoingExhibitions();
	const ongoing = ongoingList[0];
	const featuredExhibitions = [...ongoingList, ...getUpcomingExhibitions()].slice(0, 2);
	const news = getNewsIndex();
	const featuredNews = news[0];
	const homeSponsors = getRotatedSponsors();

	function cardSrc(item: { cardImage?: string; image: string }) {
		return item.cardImage ?? item.image;
	}

	function statusLabel(status: string) {
		if (status === 'ongoing') return statusLabels.ongoing;
		if (status === 'upcoming') return statusLabels.upcoming;
		return statusLabels.past;
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
			<a class="link-arrow" href="/utstallningar">Se alla utställningar</a>
		</div>
		<div class="cards">
			{#each featuredExhibitions as item}
				<a class="card" href={`/utstallningar/${item.slug}`}>
					<div class="media">
						<img src={cardSrc(item)} alt="{item.artist} — {item.title}" />
						<span class="tag" class:muted={item.status !== 'ongoing'}>{statusLabel(item.status)}</span
						>
					</div>
					<h3 class="serif">{item.artist} – {item.title}</h3>
					<p>{item.datesLabel}</p>
				</a>
			{/each}
			<a class="card" href="/nyheter">
				<div class="media">
					<img src={featuredNews.image} alt={featuredNews.title} />
					<span class="tag muted">{featuredNews.category}</span>
				</div>
				<h3 class="serif">{featuredNews.title}</h3>
				<p>{featuredNews.dateLabel}</p>
			</a>
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
		<div class="news">
			{#each news.slice(0, 3) as item}
				<a class="news-item" href={item.clickable ? `/nyheter/${item.slug}` : '/nyheter'}>
					<img src={item.thumb ?? item.image} alt="" />
					<div>
						<p class="label">{item.category}</p>
						<strong class="serif">{item.title}</strong>
						<p class="muted">{item.dateLabel}</p>
					</div>
				</a>
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

	.media {
		position: relative;
		margin-bottom: 0.85rem;
		overflow: hidden;
		background: #e8e8e2;
	}

	.media img {
		aspect-ratio: 4 / 3;
		object-fit: cover;
		width: 100%;
		transition: transform 0.5s ease;
	}

	.card:hover .media img {
		transform: scale(1.03);
	}

	.media .tag {
		position: absolute;
		top: 0.65rem;
		left: 0.65rem;
		margin: 0;
	}

	.card h3 {
		font-size: 1.2rem;
		margin: 0 0 0.35rem;
		font-weight: 500;
	}

	.card p {
		margin: 0;
		font-size: 0.8rem;
		color: var(--text-muted);
		letter-spacing: 0.02em;
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

	.news {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.news-item {
		display: grid;
		grid-template-columns: 84px 1fr;
		gap: 0.9rem;
		align-items: start;
	}

	.news-item img {
		width: 84px;
		height: 84px;
		object-fit: cover;
		background: #e8e8e2;
	}

	.news-item strong {
		display: block;
		font-size: 1.05rem;
		font-weight: 500;
		margin: 0.15rem 0;
	}

	.muted {
		margin: 0;
		font-size: 0.75rem;
		color: var(--text-muted);
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
		.news {
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
