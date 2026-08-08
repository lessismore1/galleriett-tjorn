<script lang="ts">
	import { page } from '$app/state';
	import { nav, site } from '$lib/data/mockData.js';

	function isActive(href: string) {
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}
</script>

<header class="header">
	<div class="container bar">
		<a href="/" class="logo" aria-label={site.name}>
			<img src="/images/logo.webp" alt={site.name} width="48" height="48" />
		</a>

		<nav class="nav" aria-label="Huvudmeny">
			{#each nav as item}
				<a href={item.href} class:active={isActive(item.href)}>{item.label}</a>
			{/each}
			<a href="?lang=en" class="lang" aria-label="English">EN</a>
		</nav>
	</div>
</header>

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
		align-items: center;
		flex-shrink: 0;
	}

	.logo img {
		width: 3rem;
		height: 3rem;
		display: block;
		object-fit: contain;
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
	}

	@media (min-width: 900px) {
		.nav {
			display: flex;
		}
	}
</style>
