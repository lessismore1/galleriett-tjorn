<script lang="ts">
	import { page } from '$app/state';
	import { nav, site } from '$lib/data/mockData.js';

	let open = $state(false);

	function isActive(href: string) {
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}

	/** Verkssidor har egen sticky subnav — ingen site-header. */
	const workChrome = $derived(/\/konstnarer\/[^/]+\/verk\//.test(page.url.pathname));

	function close() {
		open = false;
	}

	function toggle() {
		open = !open;
	}

	$effect(() => {
		// Stäng menyn vid navigation
		page.url.pathname;
		open = false;
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		document.body.classList.toggle('menu-open', open);
		return () => document.body.classList.remove('menu-open');
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') close();
	}}
/>

{#if !workChrome}
<header class="header">
	<div class="container bar">
		<a href="/" class="logo" aria-label="{site.name}, Tjörn" onclick={close}>
			<img src="/images/logo.webp" alt="" width="48" height="48" />
			<span class="place">Tjörn</span>
		</a>

		<button
			class="toggle"
			type="button"
			aria-label={open ? 'Stäng meny' : 'Öppna meny'}
			aria-expanded={open}
			aria-controls="main-nav"
			onclick={toggle}
		>
			<span class="bars" class:open aria-hidden="true"></span>
		</button>

		<nav id="main-nav" class="nav" class:open aria-label="Huvudmeny">
			{#each nav as item}
				<a href={item.href} class:active={isActive(item.href)} onclick={close}>{item.label}</a>
			{/each}
			<span class="lang" title="English — coming later" aria-disabled="true">EN</span>
		</nav>
	</div>
</header>

{#if open}
	<button class="backdrop" type="button" aria-label="Stäng meny" onclick={close}></button>
{/if}
{/if}

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--border);
		transition: transform 0.28s ease, opacity 0.28s ease;
	}

	:global(body.subnav-stuck) .header {
		transform: translateY(-100%);
		opacity: 0;
		pointer-events: none;
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-block: 1rem;
		gap: 1.5rem;
	}

	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		flex-shrink: 0;
		text-decoration: none;
		color: inherit;
	}

	.logo img {
		width: 3rem;
		height: 3rem;
		display: block;
		object-fit: contain;
	}

	.place {
		font-family: var(--font-sans);
		font-size: 0.58rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-muted);
		line-height: 1;
	}

	.toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		margin: -0.35rem -0.35rem -0.35rem 0;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
		color: var(--text);
		z-index: 52;
	}

	.bars {
		position: relative;
		display: block;
		width: 1.35rem;
		height: 2px;
		background: currentColor;
		transition: background 0.2s ease;
	}

	.bars::before,
	.bars::after {
		content: '';
		position: absolute;
		left: 0;
		width: 100%;
		height: 2px;
		background: currentColor;
		transition: transform 0.2s ease;
	}

	.bars::before {
		top: -6px;
	}

	.bars::after {
		top: 6px;
	}

	.bars.open {
		background: transparent;
	}

	.bars.open::before {
		transform: translateY(6px) rotate(45deg);
	}

	.bars.open::after {
		transform: translateY(-6px) rotate(-45deg);
	}

	.nav {
		display: none;
		gap: 1.35rem;
		align-items: center;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.nav a:hover,
	.nav a.active {
		color: var(--text);
	}

	.nav a.active {
		box-shadow: inset 0 -2px 0 var(--brand);
		padding-bottom: 0.15rem;
	}

	.lang {
		margin-left: 0.5rem;
		color: var(--text-muted);
		opacity: 0.55;
		cursor: default;
		user-select: none;
	}

	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 40;
		border: 0;
		padding: 0;
		background: rgba(26, 26, 18, 0.35);
		cursor: pointer;
	}

	@media (max-width: 899px) {
		.nav.open {
			display: flex;
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			flex-direction: column;
			align-items: stretch;
			gap: 0;
			padding: 0.35rem 0 0.5rem;
			background: rgba(255, 255, 255, 0.98);
			border-bottom: 1px solid var(--border);
			box-shadow: 0 12px 24px rgba(26, 26, 18, 0.08);
			z-index: 51;
		}

		.nav.open a {
			padding: 0.85rem var(--pad);
			border-bottom: 1px solid var(--border);
		}

		.nav.open a:last-child {
			border-bottom: 0;
		}

		.nav.open .lang {
			margin-left: 0;
		}

		.nav.open a.active {
			color: var(--text);
			font-weight: 700;
			background: var(--bg-soft);
			box-shadow: none;
			padding-bottom: 0.85rem;
		}
	}

	@media (min-width: 900px) {
		.toggle {
			display: none;
		}

		.nav {
			display: flex;
		}

		.backdrop {
			display: none;
		}
	}
</style>
