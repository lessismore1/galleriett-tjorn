<script lang="ts">
	import { artists } from '$lib/data/mockData.js';

	let { data } = $props();
	const artist = $derived(data.artist);
	let activeTab = $state('works');

	const tabs = [
		{ id: 'works', label: 'Works' },
		{ id: 'biography', label: 'Biography' },
		{ id: 'exhibitions', label: 'Exhibitions' },
		{ id: 'news', label: 'News' },
		{ id: 'press', label: 'Press' }
	];

	const next = $derived.by(() => {
		const i = artists.findIndex((a) => a.slug === artist.slug);
		return artists[(i + 1) % artists.length];
	});
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

<nav class="tabs container" aria-label="Sektioner">
	{#each tabs as tab}
		<button class:active={activeTab === tab.id} onclick={() => (activeTab = tab.id)}
			>{tab.label}</button
		>
	{/each}
</nav>

<section class="container content">
	{#if activeTab === 'works'}
		<div class="section-head">
			<h2 class="serif">Works</h2>
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
	{:else if activeTab === 'biography'}
		<div class="bio">
			<div>
				<h2 class="serif">Biography</h2>
				<p>{artist.bio}</p>
				{#if artist.website}
					<a class="link-arrow" href={artist.website} target="_blank" rel="noreferrer"
						>Hemsida</a
					>
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
	{:else if activeTab === 'exhibitions'}
		<h2 class="serif">Exhibitions</h2>
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
	{:else if activeTab === 'press'}
		<h2 class="serif">Press</h2>
		<div class="press">
			{#each artist.press as p}
				<blockquote>
					<p class="serif">“{p.quote}”</p>
					<footer>{p.source}</footer>
				</blockquote>
			{:else}
				<p class="empty">Ingen press ännu.</p>
			{/each}
		</div>
	{:else}
		<p class="empty">Inga nyheter för denna konstnär ännu.</p>
	{/if}
</section>

<section class="next container">
	<a href={`/konstnarer/${next.slug}`}>
		<span class="label">Nästa konstnär</span>
		<strong class="serif">{next.name}</strong>
	</a>
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

	.tabs {
		display: flex;
		gap: 1.25rem;
		overflow-x: auto;
		border-bottom: 1px solid var(--border);
		padding-top: 0.5rem;
	}

	.tabs button {
		background: none;
		border: none;
		font: inherit;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
		padding: 1rem 0;
		cursor: pointer;
		white-space: nowrap;
	}

	.tabs button.active {
		color: var(--text);
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	.content {
		padding-block: 2.5rem;
	}

	.section-head {
		margin-bottom: 1.5rem;
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

	.bio p {
		color: var(--text-secondary);
		max-width: 40rem;
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
	}

	dd {
		margin: 0;
		font-size: 0.9rem;
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
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

	.press {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		margin-top: 1rem;
	}

	blockquote {
		margin: 0;
		padding: 1.25rem;
		background: var(--bg-soft);
	}

	blockquote p {
		font-size: 1.2rem;
		margin: 0 0 0.75rem;
	}

	blockquote footer {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.next {
		padding-block: 2rem 3rem;
		border-top: 1px solid var(--border);
	}

	.next a {
		display: block;
	}

	.next strong {
		display: block;
		font-size: 1.8rem;
		margin-top: 0.35rem;
	}

	.empty {
		color: var(--text-muted);
	}

	@media (min-width: 900px) {
		.bio {
			grid-template-columns: 1.4fr 0.8fr;
		}
	}
</style>
