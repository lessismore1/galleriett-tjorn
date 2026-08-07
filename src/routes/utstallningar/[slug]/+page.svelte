<script lang="ts">
	let { data } = $props();
	const ex = $derived(data.exhibition);
	let tab = $state('press');
</script>

<section class="container top">
	<a class="back" href="/utstallningar">← Till utställningar</a>
	<div class="hero">
		<div>
			<p class="label">Utställning {ex.id}</p>
			<h1 class="serif">{ex.artist}</h1>
			<p class="title">{ex.title}</p>
			<p class="dates">{ex.datesLabel}</p>
			<p class="intro">{ex.intro}</p>
		</div>
		<img src={ex.image} alt="{ex.artist} — {ex.title}" />
	</div>
</section>

<nav class="tabs container">
	<button class:active={tab === 'press'} onclick={() => (tab = 'press')}>Press release</button>
	<button class:active={tab === 'works'} onclick={() => (tab = 'works')}>Works</button>
	<button class:active={tab === 'install'} onclick={() => (tab = 'install')}
		>Installation view</button
	>
</nav>

<section class="container body">
	{#if tab === 'press'}
		<div class="press">
			<div class="text">
				{#each ex.pressRelease.split('\n').filter(Boolean) as para}
					<p>{para}</p>
				{/each}
			</div>
			<dl>
				<div><dt>Konstnär</dt><dd>{ex.artist}</dd></div>
				<div><dt>Titel</dt><dd>{ex.title}</dd></div>
				<div><dt>Period</dt><dd>{ex.datesLabel}</dd></div>
				<div><dt>Plats</dt><dd>{ex.location}</dd></div>
			</dl>
		</div>
	{:else if tab === 'works'}
		<div class="grid">
			{#each ex.works as work}
				<figure>
					<img src={work.image} alt={work.title} />
					<figcaption>{work.title}</figcaption>
				</figure>
			{:else}
				<p class="empty">Inga verk publicerade.</p>
			{/each}
		</div>
	{:else}
		<div class="install">
			{#each ex.installationViews as src}
				<img {src} alt="Installation view" />
			{:else}
				<p class="empty">Inga installationsbilder ännu.</p>
			{/each}
		</div>
	{/if}
</section>

{#if data.related.length}
	<section class="container related">
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
	</section>
{/if}

<nav class="pager container">
	{#if data.prev}
		<a href={`/utstallningar/${data.prev.slug}`}>
			<span class="label">Föregående utställning</span>
			<strong>{data.prev.id} · {data.prev.title}</strong>
		</a>
	{:else}
		<span></span>
	{/if}
	{#if data.next}
		<a class="right" href={`/utstallningar/${data.next.slug}`}>
			<span class="label">Nästa utställning</span>
			<strong>{data.next.id} · {data.next.title}</strong>
		</a>
	{/if}
</nav>

<style>
	.top {
		padding-top: 2rem;
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
		padding-block: 1.5rem 2rem;
		align-items: center;
	}

	h1 {
		font-size: clamp(2.2rem, 5vw, 3.4rem);
		margin: 0.5rem 0;
	}

	.title {
		font-size: 1.1rem;
		margin: 0;
	}

	.dates {
		color: var(--text-muted);
		font-size: 0.85rem;
	}

	.intro {
		color: var(--text-secondary);
		max-width: 34rem;
	}

	.hero img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	.tabs {
		display: flex;
		gap: 1.25rem;
		border-bottom: 1px solid var(--border);
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
	}

	.tabs button.active {
		color: var(--text);
		box-shadow: inset 0 -2px 0 var(--brand);
	}

	.body {
		padding-block: 2rem;
	}

	.press {
		display: grid;
		gap: 2rem;
	}

	.text p {
		color: var(--text-secondary);
		max-width: 40rem;
	}

	dl {
		margin: 0;
	}

	dl > div {
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--border);
	}

	dt {
		font-size: 0.65rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	dd {
		margin: 0.2rem 0 0;
	}

	.grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	}

	.grid img,
	.install img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	.install {
		display: grid;
		gap: 1rem;
	}

	figcaption {
		font-size: 0.75rem;
		margin-top: 0.35rem;
	}

	.related {
		padding-block: 2rem;
	}

	.section-head {
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.artists {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
	}

	.artists img {
		aspect-ratio: 1;
		object-fit: cover;
		margin-bottom: 0.5rem;
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

	.pager {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-block: 2rem 3rem;
		border-top: 1px solid var(--border);
	}

	.pager .right {
		text-align: right;
	}

	.pager strong {
		display: block;
		margin-top: 0.25rem;
	}

	.empty {
		color: var(--text-muted);
	}

	@media (min-width: 900px) {
		.hero,
		.press {
			grid-template-columns: 1fr 1.1fr;
		}
	}
</style>
