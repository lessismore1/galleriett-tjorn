<script lang="ts">
	import { site } from '$lib/data/mockData.js';

	let { data } = $props();
	const ex = $derived(data.exhibition);

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
</script>

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

<nav class="band subnav" aria-label="Sektioner">
	<div class="container subnav-inner">
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
			<h2 class="serif">Pressmeddelande</h2>
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
			<h2 class="serif">Verk</h2>
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
			<h2 class="serif">Installation</h2>
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
				<h2 class="label">{data.related.length === 1 ? 'Konstnär' : 'Utställande konstnärer'}</h2>
				<a class="link-arrow" href="/konstnarer">Visa alla konstnärer</a>
			</div>
			<div class="artists" class:single={data.related.length === 1}>
				{#each data.related as a}
					<a href={`/konstnarer/${a.slug}`}>
						<img src={a.image} alt={a.name} />
						<strong class="serif">{a.name}</strong>
						<span>{a.specialty} →</span>
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
		font-size: 0.7rem;
		letter-spacing: 0.06em;
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
		color: var(--text-muted);
		font-size: 0.8rem;
		letter-spacing: 0.04em;
		margin: 0 0 0.75rem;
	}

	.intro {
		color: var(--text-secondary);
		max-width: 34rem;
		line-height: 1.55;
		margin: 0;
		font-size: 0.95rem;
	}

	.hero-img {
		width: 100%;
		aspect-ratio: 16 / 11;
		object-fit: cover;
		object-position: center;
		background: #e8e8e2;
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
		gap: 1.35rem;
		overflow-x: auto;
	}

	.subnav a {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
		padding: 0.75rem 0;
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

	.press {
		display: grid;
		gap: 2rem;
		align-items: start;
	}

	.text h2 {
		font-size: clamp(1.4rem, 2.5vw, 1.85rem);
		margin: 0 0 0.85rem;
		font-weight: 500;
	}

	.text p {
		color: var(--text-secondary);
		max-width: 40rem;
		line-height: 1.6;
		margin: 0 0 0.75rem;
		font-size: 0.95rem;
	}

	.facts {
		border-top: 1px solid var(--border);
	}

	.fact {
		padding: 0.45rem 0;
		border-bottom: 1px solid var(--border);
		display: grid;
		gap: 0.1rem;
	}

	.fact-label {
		font-size: 0.6rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
		font-weight: 700;
	}

	.fact-value {
		font-size: 0.9rem;
		color: var(--text);
		word-break: break-word;
		line-height: 1.35;
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
		font-size: 0.65rem;
		margin-top: 0.3rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		font-weight: 600;
		color: var(--text);
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

	.artists.single {
		grid-template-columns: minmax(0, 180px);
	}

	.artists img {
		aspect-ratio: 1;
		object-fit: cover;
		margin-bottom: 0.45rem;
		background: #e8e8e2;
	}

	.artists strong {
		display: block;
		font-weight: 500;
	}

	.artists span {
		font-size: 0.65rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
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
	}

	.empty {
		color: var(--text-muted);
		margin: 0;
	}

	@media (max-width: 900px) {
		.works {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.install {
			grid-template-columns: 1fr;
		}

		.artists:not(.single) {
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
