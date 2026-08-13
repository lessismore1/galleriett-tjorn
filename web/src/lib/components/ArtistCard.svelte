<script lang="ts">
	import { browser } from '$app/environment';
	import { getArtistProgram } from '$lib/data/mockData.js';

	type ArtistLike = {
		slug: string;
		name: string;
		specialty: string;
		image: string;
		works?: { title?: string; image: string }[];
	};

	type MediaMode = 'carousel' | 'portrait';
	type Slide = { kind: 'work' | 'portrait' | 'exhibition'; src: string; label: string };

	let {
		artist,
		mediaMode = 'carousel',
		showIcon = true,
		showBadge = true
	}: {
		artist: ArtistLike;
		mediaMode?: MediaMode;
		showIcon?: boolean;
		showBadge?: boolean;
	} = $props();

	const program = $derived(getArtistProgram(artist.slug));
	const href = $derived(`/konstnarer/${artist.slug}`);

	const workSrc = $derived(artist.works?.[0]?.image ?? null);
	const portraitSrc = $derived(artist.image || null);

	const slides = $derived.by(() => {
		if (mediaMode === 'portrait') {
			const src = portraitSrc || workSrc;
			return src
				? ([{ kind: 'portrait' as const, src, label: 'Porträtt' }] satisfies Slide[])
				: [];
		}

		const list: Slide[] = [];
		if (workSrc) {
			list.push({
				kind: 'work',
				src: workSrc,
				label: artist.works?.[0]?.title?.trim() || 'Verk'
			});
		}
		if (portraitSrc) {
			list.push({ kind: 'portrait', src: portraitSrc, label: 'Porträtt' });
		}
		if (program?.exhibition?.image) {
			list.push({
				kind: 'exhibition',
				src: program.exhibition.image,
				label: program.exhibition.title || 'Utställning'
			});
		}
		if (!list.length && portraitSrc) {
			list.push({ kind: 'portrait', src: portraitSrc, label: artist.name });
		}
		return list;
	});

	const badge = $derived(
		!showBadge
			? null
			: program?.status === 'ongoing'
				? { text: 'Pågående', title: program.exhibition.title }
				: program?.status === 'upcoming'
					? { text: 'Kommande', title: program.exhibition.title }
					: null
	);

	let index = $state(0);
	let tipVisible = $state(false);
	let touchStartX = 0;
	let didSwipe = false;

	/** 0 = verk (fyrkant), 1 = porträtt (cirkel) */
	let iconSlide = $state(0);
	let iconPaused = $state(false);

	const current = $derived(slides[Math.min(index, Math.max(slides.length - 1, 0))] ?? null);
	const canCarousel = $derived(mediaMode === 'carousel' && slides.length > 1);
	const canIconAlternate = $derived(showIcon && !!(workSrc && portraitSrc));
	const showIconBlock = $derived(showIcon && !!(canIconAlternate || workSrc || portraitSrc));
	/** Porträttläge: hela kortet är en länk (som ArtworkCard). */
	const wholeCardLink = $derived(mediaMode === 'portrait');

	$effect(() => {
		slides;
		index = 0;
	});

	$effect(() => {
		if (!browser || !canIconAlternate || iconPaused) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			iconSlide = 1;
			return;
		}
		const id = window.setInterval(() => {
			iconSlide = iconSlide === 0 ? 1 : 0;
		}, 6500);
		return () => clearInterval(id);
	});

	function go(delta: number) {
		if (!canCarousel) return;
		index = (index + delta + slides.length) % slides.length;
	}

	function onPointerDown(e: PointerEvent) {
		if (!canCarousel || e.pointerType === 'mouse') return;
		touchStartX = e.clientX;
		didSwipe = false;
	}

	function onPointerUp(e: PointerEvent) {
		if (!canCarousel || e.pointerType === 'mouse') return;
		const dx = e.clientX - touchStartX;
		if (Math.abs(dx) > 40) {
			didSwipe = true;
			go(dx < 0 ? 1 : -1);
			if (browser) sessionStorage.setItem('g1-artist-card-swiped', '1');
		}
	}

	function onMediaClick(e: MouseEvent) {
		if (!canCarousel) return;
		// Desktop: klick på media byter slide (namn-länken navigerar)
		if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
			e.preventDefault();
			e.stopPropagation();
			go(1);
			return;
		}
		// Mobil: tap (utan svep) → tip, inte navigering via media
		if (didSwipe) return;
		e.preventDefault();
		e.stopPropagation();
		if (!browser) return;
		if (sessionStorage.getItem('g1-artist-card-swiped') === '1') return;
		const shown = Number(sessionStorage.getItem('g1-artist-card-tip') || '0');
		if (shown >= 2) return;
		sessionStorage.setItem('g1-artist-card-tip', String(shown + 1));
		tipVisible = true;
		window.setTimeout(() => {
			tipVisible = false;
		}, 2000);
	}
</script>

{#snippet mediaBlock()}
	<div
		class="media"
		role={canCarousel ? 'group' : undefined}
		aria-roledescription={canCarousel ? 'karusell' : undefined}
		aria-label={canCarousel ? `Bilder för ${artist.name}` : undefined}
		onpointerdown={onPointerDown}
		onpointerup={onPointerUp}
		onclick={onMediaClick}
	>
		{#if badge}
			<span class="badge" class:upcoming={badge.text === 'Kommande'} title={badge.title}
				>{badge.text}</span
			>
		{/if}

		{#if current}
			<img src={current.src} alt={`${artist.name} — ${current.label}`} />
		{/if}

		{#if canCarousel}
			<div class="chrome desktop-hover">
				<div class="nav">
					<button
						type="button"
						class="nav-btn"
						aria-label="Föregående bild"
						onclick={(e) => {
							e.stopPropagation();
							go(-1);
						}}>‹</button
					>
					<button
						type="button"
						class="nav-btn"
						aria-label="Nästa bild"
						onclick={(e) => {
							e.stopPropagation();
							go(1);
						}}>›</button
					>
				</div>
				<div class="dots" aria-hidden="true">
					{#each slides as _, i}
						<span class:active={i === index}></span>
					{/each}
				</div>
			</div>
		{/if}

		{#if tipVisible}
			<p class="tip" role="status">Svep för att se fler</p>
		{/if}
	</div>
{/snippet}

{#snippet metaInner()}
	{#if showIconBlock}
		<div class="icon" aria-hidden="true">
			{#if canIconAlternate}
				<img src={workSrc!} alt="" class="icon-img square" class:show={iconSlide === 0} />
				<img src={portraitSrc!} alt="" class="icon-img circle" class:show={iconSlide === 1} />
			{:else if portraitSrc}
				<img src={portraitSrc} alt="" class="icon-img circle show" />
			{:else if workSrc}
				<img src={workSrc} alt="" class="icon-img square show" />
			{/if}
		</div>
	{/if}
	<div class="meta-text">
		<h2 class="serif">{artist.name}</h2>
		<p>{artist.specialty}</p>
	</div>
	<span class="arrow" aria-hidden="true">→</span>
{/snippet}

{#if wholeCardLink}
	<a class="card" {href}>
		{@render mediaBlock()}
		<div class="meta">
			{@render metaInner()}
		</div>
	</a>
{:else}
	<article class="card">
		{@render mediaBlock()}
		<a
			class="meta"
			{href}
			onmouseenter={() => (iconPaused = true)}
			onmouseleave={() => (iconPaused = false)}
			onfocus={() => (iconPaused = true)}
			onblur={() => (iconPaused = false)}
		>
			{@render metaInner()}
		</a>
	</article>
{/if}

<style>
	.card {
		display: flex;
		flex-direction: column;
		min-width: 0;
		color: inherit;
		text-decoration: none;
		transition: box-shadow 0.18s ease;
	}

	.media {
		position: relative;
		aspect-ratio: 4 / 3;
		background: #e8e8e2;
		overflow: hidden;
		touch-action: pan-y;
		cursor: default;
	}

	.media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.badge {
		position: absolute;
		top: 0.65rem;
		left: 0.65rem;
		z-index: 2;
		padding: 0.3rem 0.5rem;
		background: var(--brand);
		color: var(--brand-dark);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.badge.upcoming {
		background: var(--brand-dark);
		color: #fff;
	}

	.chrome {
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.nav {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 0.45rem;
		pointer-events: none;
	}

	.nav-btn {
		pointer-events: auto;
		width: 1.85rem;
		height: 1.85rem;
		border: none;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.92);
		color: var(--text);
		font-size: 1rem;
		line-height: 1;
		cursor: pointer;
	}

	.dots {
		position: absolute;
		left: 50%;
		bottom: 0.7rem;
		transform: translateX(-50%);
		display: flex;
		gap: 0.35rem;
	}

	.dots span {
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.55);
		box-shadow: 0 0 0 1px rgba(26, 26, 18, 0.2);
	}

	.dots span.active {
		background: var(--brand);
		box-shadow: none;
	}

	.tip {
		position: absolute;
		left: 50%;
		top: 50%;
		z-index: 3;
		transform: translate(-50%, -50%);
		margin: 0;
		padding: 0.55rem 0.75rem;
		background: rgba(26, 26, 18, 0.88);
		color: #fff;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.meta {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 0.15rem;
		padding: 0.7rem 0.55rem 0.75rem;
		color: inherit;
		text-decoration: none;
		transition: background-color 0.18s ease;
	}

	.icon {
		position: relative;
		width: 2.75rem;
		height: 2.75rem;
		flex-shrink: 0;
		background: #e8e8e2;
	}

	.icon-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 0.9s ease;
	}

	.icon-img.show {
		opacity: 1;
	}

	.icon-img.square {
		border-radius: 0;
	}

	.icon-img.circle {
		border-radius: 999px;
	}

	.meta-text {
		min-width: 0;
		flex: 1;
	}

	.arrow {
		color: var(--text-secondary);
		font-size: 1.15rem;
		font-weight: 600;
		line-height: 1.2;
		flex-shrink: 0;
		transition:
			color 0.18s ease,
			transform 0.18s ease;
	}

	h2 {
		font-size: 1.25rem;
		margin: 0;
		font-weight: 500;
	}

	.meta p {
		margin: 0.25rem 0 0;
		font-size: 0.65rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.desktop-hover {
		display: none;
	}

	@media (hover: hover) and (pointer: fine) {
		.desktop-hover {
			display: block;
		}

		.media {
			cursor: pointer;
		}

		.media:hover .chrome,
		.media:focus-within .chrome {
			opacity: 1;
		}

		/* Helkort-hover — samma rytm som ArtworkCard */
		.card:hover,
		.card:focus-visible,
		.card:focus-within {
			box-shadow: 0 0 0 1px var(--brand);
		}

		.card:hover .meta,
		.card:focus-visible .meta,
		.card:focus-within .meta {
			background: var(--card-meta-hover);
		}

		.card:hover .meta h2,
		.card:focus-visible .meta h2,
		.card:focus-within .meta h2 {
			text-decoration: underline;
			text-underline-offset: 0.18em;
			text-decoration-thickness: 1px;
		}

		.card:hover .arrow,
		.card:focus-visible .arrow,
		.card:focus-within .arrow {
			color: var(--text);
			transform: translateX(3px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.icon-img {
			transition: none;
		}
	}
</style>
