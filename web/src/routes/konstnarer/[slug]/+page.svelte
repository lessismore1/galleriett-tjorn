<script lang="ts">
	import { onMount } from 'svelte';
	import { artists, news } from '$lib/data/mockData.js';

	let { data } = $props();
	const artist = $derived(data.artist);

	const next = $derived.by(() => {
		const i = artists.findIndex((a) => a.slug === artist.slug);
		return artists[(i + 1) % artists.length];
	});

	const related = $derived(artists.filter((a) => a.slug !== artist.slug).slice(0, 3));
	const artistNews = $derived(news.slice(0, 3));

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

<section class="hero">
	{#if artist.heroImage || artist.image}
		<img src={artist.heroImage || artist.image} alt="" class="bg" />
	{/if}
	<div class="container copy">
		<a class="back" href="/konstnarer">← Tillbaka till konstnärer</a>
		<h1 class="serif">{artist.name}</h1>
		<p class="born">Född {artist.born}</p>
		<p class="intro">{artist.intro}</p>
		<a class="link-arrow" href="/kontakt">Kontakta konstnären</a>
	</div>
</section>

<div class="subnav-sentinel" bind:this={sentinelEl} aria-hidden="true"></div>
{#if stuck}
	<div class="subnav-spacer" style={`height: ${subnavH}px`} aria-hidden="true"></div>
{/if}
<nav class="band subnav" class:stuck bind:this={subnavEl} aria-label="Sektioner">
	<div class="container subnav-inner">
		{#if stuck}
			<a class="subnav-home" href="/" aria-label="GALLERIett — startsida">
				<img src="/images/logo.webp" alt="" width="36" height="36" />
			</a>
		{/if}
		<strong class="artist-name serif">{artist.name}</strong>
		<div class="subnav-links">
			<a href="#works">Verk</a>
			<a href="#biography">Biografi</a>
			<a href="#exhibitions">Utställningar</a>
			<a href="#news">Nyheter</a>
			<a href="#press">Media</a>
		</div>
	</div>
</nav>

<section id="works" class="band band-pad">
	<div class="container">
		<div class="section-head">
			<h2 class="serif section-title">Verk</h2>
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
			<div class="section-head">
				<h2 class="serif section-title">Biografi</h2>
			</div>
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
			<h2 class="serif section-title">Utställningar</h2>
			<a class="link-arrow" href="/utstallningar">Visa alla</a>
		</div>
		<ul class="list">
			{#each artist.exhibitions as ex}
				<li>
					<span>{ex.year}</span>
					{#if ex.slug}
						<a class="ex-link" href={`/utstallningar/${ex.slug}`}>
							<strong>{ex.id ? `${ex.id} · ${ex.title}` : ex.title}</strong>
						</a>
					{:else}
						<strong>{ex.title}</strong>
					{/if}
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
			<h2 class="serif section-title">Nyheter</h2>
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
			<h2 class="serif section-title">Media</h2>
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
						<span class="label">{a.specialty}</span>
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

	.subnav-home {
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}

	.subnav-home img {
		width: 2.25rem;
		height: 2.25rem;
		display: block;
		object-fit: contain;
	}

	.artist-name {
		font-size: 0.95rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		flex-shrink: 0;
		white-space: nowrap;
	}

	.subnav-links {
		display: flex;
		gap: 1.25rem;
		overflow-x: auto;
		margin-left: auto;
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

	.list li {
		display: grid;
		grid-template-columns: 4rem 1fr;
		gap: 0.5rem 1rem;
		padding: 1rem 0;
		border-bottom: 1px solid var(--border);
	}

	.list .ex-link {
		grid-column: 2;
		justify-self: start;
	}

	.list .ex-link:hover strong {
		box-shadow: inset 0 -1px 0 var(--brand);
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

	.related .label {
		margin: 0;
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
