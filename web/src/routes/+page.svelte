<script lang="ts">
	import {
		about,
		getOngoingExhibition,
		news,
		exhibitions,
		statusLabels
	} from '$lib/data/mockData.js';

	const ongoing = getOngoingExhibition();
	const featuredExhibitions = exhibitions.filter((e) => e.status !== 'past').slice(0, 2);
	const featuredNews = news[0];
</script>

<section class="hero">
	{#if ongoing}
		<img src={ongoing.image} alt="{ongoing.artist} — {ongoing.title}" class="hero-img" />
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

<section class="section container">
	<div class="section-head">
		<h2 class="label">Aktuellt</h2>
		<a class="link-arrow" href="/utstallningar">Se alla utställningar</a>
	</div>
	<div class="cards">
		{#each featuredExhibitions as item}
			<a class="card" href={`/utstallningar/${item.slug}`}>
				<img src={item.image} alt="{item.artist} — {item.title}" />
				<span class="tag" class:muted={item.status !== 'ongoing'}>
					{item.status === 'ongoing'
						? statusLabels.ongoing
						: item.status === 'upcoming'
							? statusLabels.upcoming
							: statusLabels.past}
				</span>
				<h3 class="serif">{item.artist} – {item.title}</h3>
				<p>{item.datesLabel}</p>
			</a>
		{/each}
		<a class="card" href="/nyheter">
			<img src={featuredNews.image} alt={featuredNews.title} />
			<span class="tag muted">{featuredNews.category}</span>
			<h3 class="serif">{featuredNews.title}</h3>
			<p>{featuredNews.dateLabel}</p>
		</a>
	</div>
</section>

<section class="about">
	<div class="container about-grid">
		<div>
			<p class="label">{about.label}</p>
			<h2 class="serif">{about.headline}</h2>
			<p class="body">{about.body}</p>
			<a class="link-arrow" href="/om">Läs mer om Galleri Ett</a>
		</div>
		<img src={about.image} alt="Galleri Ett vid kusten" />
	</div>
</section>

<section class="section container">
	<div class="section-head">
		<h2 class="label">Nyheter</h2>
		<a class="link-arrow" href="/nyheter">Till nyheter</a>
	</div>
	<div class="news">
		{#each news.slice(0, 3) as item}
			<a class="news-item" href="/nyheter">
				<img src={item.image} alt="" />
				<div>
					<p class="label">{item.category}</p>
					<strong>{item.title}</strong>
					<p class="muted">{item.dateLabel}</p>
				</div>
			</a>
		{/each}
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: min(78vh, 720px);
		display: grid;
		align-items: end;
		color: #fff;
		background: #222;
	}

	.hero-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.15));
	}

	.hero-copy {
		position: relative;
		z-index: 1;
		padding-block: 3.5rem 4rem;
		max-width: 36rem;
	}

	.hero-label {
		color: rgba(255, 255, 255, 0.85);
		border-bottom: 1px solid var(--brand);
		display: inline-block;
		padding-bottom: 0.35rem;
		margin-bottom: 1rem;
	}

	h1 {
		font-size: clamp(2.4rem, 6vw, 4rem);
		margin: 0 0 0.75rem;
		font-style: italic;
	}

	h1 em {
		font-style: normal;
	}

	.dates {
		margin: 0 0 1.5rem;
		letter-spacing: 0.06em;
		font-size: 0.85rem;
	}

	.section {
		padding-block: 3.5rem;
	}

	.section-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.cards {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	}

	.card img {
		aspect-ratio: 4 / 3;
		object-fit: cover;
		width: 100%;
		margin-bottom: 0.75rem;
	}

	.card .tag {
		margin-bottom: 0.5rem;
	}

	.card h3 {
		font-size: 1.25rem;
		margin: 0 0 0.35rem;
	}

	.card p {
		margin: 0;
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	.about {
		background: var(--bg-soft);
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
	}

	.body {
		color: var(--text-secondary);
		max-width: 36rem;
		margin-bottom: 1.25rem;
	}

	.about img {
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
	}

	.news {
		display: grid;
		gap: 1.25rem;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	}

	.news-item {
		display: grid;
		grid-template-columns: 72px 1fr;
		gap: 0.85rem;
		align-items: start;
	}

	.news-item img {
		width: 72px;
		height: 72px;
		object-fit: cover;
	}

	.news-item strong {
		display: block;
		font-size: 0.95rem;
		margin: 0.15rem 0;
	}

	.muted {
		margin: 0;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	@media (min-width: 900px) {
		.about-grid {
			grid-template-columns: 1fr 1.15fr;
		}
	}
</style>
