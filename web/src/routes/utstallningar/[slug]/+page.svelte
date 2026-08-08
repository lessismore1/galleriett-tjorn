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
							dateStyle: 'long',
							timeStyle: 'short'
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
			<div>
				<p class="label">Utställning {ex.id}</p>
				<h1 class="serif">{ex.artist}</h1>
				<p class="title serif">{ex.title}</p>
				<p class="dates">{ex.datesLabel}</p>
				<p class="intro">{ex.intro}</p>
			</div>
			<img src={ex.image} alt="{ex.artist} — {ex.title}" />
		</div>
	</div>
</section>

<nav class="band subnav" aria-label="Sektioner">
	<div class="container subnav-inner">
		<div class="subnav-links">
			<a href="#press-release">Press release</a>
			<a href="#works">Works</a>
			<a href="#installation">Installation view</a>
		</div>
		<span class="dela">Dela</span>
	</div>
</nav>

<section id="press-release" class="band band-pad">
	<div class="container press">
		<div class="text">
			<h2 class="serif">Press release</h2>
			{#each ex.pressRelease.split('\n').filter(Boolean) as para}
				<p>{para}</p>
			{/each}
		</div>
		<dl>
			{#each facts as fact}
				<div>
					<dt>{fact.label}</dt>
					<dd>{fact.value}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<section id="works" class="band-soft band-pad">
	<div class="container">
		<div class="section-head">
			<h2 class="serif">Works</h2>
			{#if ex.works.length}
				<a class="link-arrow" href="#works">Visa alla verk</a>
			{/if}
		</div>
		{#if ex.works.length}
			<div class="grid">
				{#each ex.works as work}
					<figure>
						<img src={work.image} alt={work.title} />
						<figcaption>{work.title}</figcaption>
					</figure>
				{/each}
			</div>
		{:else}
			<p class="empty">Inga verk publicerade.</p>
		{/if}
	</div>
</section>

<section id="installation" class="band band-pad">
	<div class="container">
		<div class="section-head">
			<h2 class="serif">Installation view</h2>
		</div>
		{#if ex.installationViews.length}
			<div class="install">
				{#each ex.installationViews as src}
					<img {src} alt="Installation view" />
				{/each}
			</div>
		{:else}
			<p class="empty">Inga installationsbilder ännu.</p>
		{/if}
	</div>
</section>

{#if data.related.length}
	<section class="band-soft band-pad">
		<div class="container">
			<div class="section-head">
				<h2 class="label">Related artists</h2>
				<a class="link-arrow" href="/konstnarer">Visa alla konstnärer</a>
			</div>
			<div class="artists">
				{#each data.related as a}
					<a href={`/konstnarer/${a.slug}`}>
						<img src={a.image} alt={a.name} />
						<strong class="serif">{a.name}</strong>
						<span>{a.specialty}</span>
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
		padding-block: 2rem 2.5rem;
	}

	.back {
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.hero {
		display: grid;
		gap: 2rem;
		padding-top: 1.25rem;
		align-items: center;
	}

	h1 {
		font-size: clamp(2.2rem, 5vw, 3.4rem);
		margin: 0.5rem 0 0.25rem;
		font-weight: 500;
	}

	.title {
		font-size: clamp(1.4rem, 3vw, 2rem);
		margin: 0 0 0.75rem;
		font-style: italic;
	}

	.dates {
		color: var(--text-muted);
		font-size: 0.85rem;
		letter-spacing: 0.04em;
	}

	.intro {
		color: var(--text-secondary);
		max-width: 34rem;
		line-height: 1.65;
	}

	.hero img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
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

	.press {
		display: grid;
		gap: 2.5rem;
	}

	.text h2 {
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		margin: 0 0 1.25rem;
		font-weight: 500;
	}

	.text p {
		color: var(--text-secondary);
		max-width: 40rem;
		line-height: 1.7;
		margin: 0 0 1rem;
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
		font-weight: 700;
	}

	dd {
		margin: 0.25rem 0 0;
	}

	.grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
	}

	.grid img,
	.install img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		background: #e8e8e2;
	}

	.install {
		display: grid;
		gap: 1rem;
	}

	figcaption {
		font-size: 0.75rem;
		margin-top: 0.35rem;
		color: var(--text-muted);
	}

	.artists {
		display: grid;
		gap: 1.25rem;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	}

	.artists img {
		aspect-ratio: 1;
		object-fit: cover;
		margin-bottom: 0.55rem;
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
		padding-block: 2rem 3rem;
	}

	.pager .right {
		text-align: right;
	}

	.pager strong {
		display: block;
		margin-top: 0.3rem;
		font-weight: 500;
	}

	.empty {
		color: var(--text-muted);
		margin: 0;
	}

	@media (min-width: 900px) {
		.hero,
		.press {
			grid-template-columns: 1fr 1.1fr;
		}
	}
</style>
