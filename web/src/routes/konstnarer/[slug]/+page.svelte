<script lang="ts">
	import { artists, news } from '$lib/data/mockData.js';

	let { data } = $props();
	const artist = $derived(data.artist);

	const next = $derived.by(() => {
		const i = artists.findIndex((a) => a.slug === artist.slug);
		return artists[(i + 1) % artists.length];
	});

	const related = $derived(artists.filter((a) => a.slug !== artist.slug).slice(0, 3));
	const artistNews = $derived(news.slice(0, 3));
</script>

<section class="hero">
	{#if artist.heroImage}
		<img src={artist.heroImage} alt="" class="bg" />
	{/if}
	<div class="container copy">
		<a class="back" href="/konstnarer">← Tillbaka till konstnärer</a>
		<h1 class="serif">{artist.name}</h1>
		<p class="born">Född {artist.born}</p>
		<p class="intro">{artist.intro}</p>
		<a class="link-arrow" href="/kontakt">Kontakta konstnären</a>
	</div>
</section>

<nav class="band subnav" aria-label="Sektioner">
	<div class="container subnav-inner">
		<div class="subnav-links">
			<a href="#works">Works</a>
			<a href="#biography">Biography</a>
			<a href="#exhibitions">Exhibitions</a>
			<a href="#news">News</a>
			<a href="#press">Press</a>
		</div>
		<span class="dela">Dela</span>
	</div>
</nav>

<section id="works" class="band band-pad">
	<div class="container">
		<div class="section-head">
			<h2 class="serif">Works</h2>
			{#if artist.works.length}
				<a class="link-arrow" href="#works">Visa alla verk</a>
			{/if}
		</div>
		{#if artist.works.length}
			<div class="works">
				{#each artist.works as work}
					<article>
						<img src={work.image} alt={work.title} />
						<h3>{work.title}</h3>
						<p>{work.year} · {work.medium} · {work.dimensions}</p>
					</article>
				{/each}
			</div>
		{:else}
			<p class="empty">Inga verk publicerade ännu.</p>
		{/if}
	</div>
</section>

<section id="biography" class="band-soft band-pad">
	<div class="container bio">
		<div>
			<h2 class="serif">Biography</h2>
			<p>{artist.bio}</p>
			{#if artist.website}
				<a class="link-arrow" href={artist.website} target="_blank" rel="noreferrer">Hemsida</a>
			{/if}
		</div>
		<dl>
			<div>
				<dt>Född</dt>
				<dd>{artist.born}</dd>
			</div>
			<div>
				<dt>Utbildning</dt>
				{#each artist.education as e}
					<dd>{e}</dd>
				{/each}
			</div>
			<div>
				<dt>Bor och verkar</dt>
				<dd>{artist.lives}</dd>
			</div>
			<div>
				<dt>Representerad i</dt>
				<dd>{artist.representedIn.join(', ')}</dd>
			</div>
		</dl>
	</div>
</section>

<section id="exhibitions" class="band band-pad">
	<div class="container">
		<div class="section-head">
			<h2 class="serif">Exhibitions</h2>
			<a class="link-arrow" href="/utstallningar">Visa alla</a>
		</div>
		<ul class="list">
			{#each artist.exhibitions as ex}
				<li>
					<span>{ex.year}</span>
					<strong>{ex.title}</strong>
					<em>{ex.venue}</em>
				</li>
			{:else}
				<li class="empty">Inga utställningar listade.</li>
			{/each}
		</ul>
	</div>
</section>

<section id="news" class="band-soft band-pad">
	<div class="container">
		<div class="section-head">
			<h2 class="serif">News</h2>
			<a class="link-arrow" href="/nyheter">Visa alla</a>
		</div>
		<div class="news">
			{#each artistNews as item}
				<a class="news-item" href="/nyheter">
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

<section id="press" class="band band-pad">
	<div class="container">
		<div class="section-head">
			<h2 class="serif">Press</h2>
		</div>
		{#if artist.press.length}
			<div class="press">
				{#each artist.press as p}
					<blockquote>
						<p class="serif">“{p.quote}”</p>
						<footer>{p.source}</footer>
					</blockquote>
				{/each}
			</div>
		{:else}
			<p class="empty">Ingen press ännu.</p>
		{/if}
	</div>
</section>

<section class="band-soft band-pad">
	<div class="container more">
		<div>
			<p class="label">Kanske också intressant</p>
			<div class="related">
				{#each related as a}
					<a href={`/konstnarer/${a.slug}`}>
						<img src={a.image} alt={a.name} />
						<strong class="serif">{a.name}</strong>
						<span>{a.specialty}</span>
					</a>
				{/each}
			</div>
		</div>
		<a class="next" href={`/konstnarer/${next.slug}`}>
			<span class="label">Nästa konstnär</span>
			<strong class="serif">{next.name}</strong>
		</a>
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 420px;
		display: grid;
		align-items: end;
		background: #222;
		color: #fff;
	}

	.bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.55;
	}

	.copy {
		position: relative;
		padding-block: 3rem;
		max-width: 40rem;
	}

	.back {
		display: inline-block;
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin-bottom: 1.25rem;
		opacity: 0.85;
	}

	h1 {
		font-size: clamp(2.4rem, 6vw, 4rem);
		margin: 0 0 0.5rem;
		font-weight: 500;
	}

	.born {
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.8;
	}

	.intro {
		max-width: 32rem;
		margin: 1rem 0 1.25rem;
	}

	.subnav {
		border-block: 1px solid var(--border);
		position: sticky;
		top: 57px;
		z-index: 20;
	}

	.subnav-inner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.subnav-links {
		display: flex;
		gap: 1.25rem;
		overflow-x: auto;
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

	.dela {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.works {
		display: grid;
		gap: 1.25rem;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
	}

	.works img {
		aspect-ratio: 1;
		object-fit: cover;
		width: 100%;
		margin-bottom: 0.5rem;
		background: #e8e8e2;
	}

	.works h3 {
		margin: 0;
		font-size: 0.7rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		font-family: var(--font-sans);
		font-weight: 700;
	}

	.works p {
		margin: 0.25rem 0 0;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.bio {
		display: grid;
		gap: 2rem;
	}

	.bio h2 {
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		margin: 0 0 1rem;
		font-weight: 500;
	}

	.bio p {
		color: var(--text-secondary);
		max-width: 40rem;
		line-height: 1.7;
	}

	dl {
		margin: 0;
	}

	dl > div {
		padding: 0.85rem 0;
		border-bottom: 1px solid var(--border);
	}

	dt {
		font-size: 0.65rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 0.25rem;
		font-weight: 700;
	}

	dd {
		margin: 0;
		font-size: 0.9rem;
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.list li {
		display: grid;
		grid-template-columns: 4rem 1fr;
		gap: 0.5rem 1rem;
		padding: 1rem 0;
		border-bottom: 1px solid var(--border);
	}

	.list em {
		grid-column: 2;
		font-style: normal;
		color: var(--text-muted);
		font-size: 0.85rem;
	}

	.news {
		display: grid;
		gap: 1.25rem;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	}

	.news-item {
		display: grid;
		grid-template-columns: 72px 1fr;
		gap: 0.85rem;
	}

	.news-item img {
		width: 72px;
		height: 72px;
		object-fit: cover;
		background: #e8e8e2;
	}

	.news-item strong {
		display: block;
		font-weight: 500;
		margin: 0.15rem 0;
	}

	.muted {
		margin: 0;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.press {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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

	.related {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		margin-top: 1rem;
	}

	.related img {
		aspect-ratio: 1;
		object-fit: cover;
		margin-bottom: 0.4rem;
		background: #e8e8e2;
	}

	.related strong {
		display: block;
		font-weight: 500;
		font-size: 0.95rem;
	}

	.related span {
		font-size: 0.65rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.next strong {
		display: block;
		font-size: clamp(1.5rem, 3vw, 2rem);
		margin-top: 0.35rem;
		font-weight: 500;
	}

	.empty {
		color: var(--text-muted);
		margin: 0;
	}

	@media (min-width: 900px) {
		.bio {
			grid-template-columns: 1.4fr 0.8fr;
		}

		.more {
			grid-template-columns: 1.4fr 0.6fr;
			align-items: end;
		}
	}
</style>
