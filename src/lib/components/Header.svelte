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
			<span class="badge">ett</span>
			<span class="wordmark">GALLERI<br /><em>ett</em></span>
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
		gap: 0.65rem;
	}

	.badge {
		width: 2.15rem;
		height: 2.15rem;
		border-radius: 50%;
		background: var(--brand);
		display: grid;
		place-items: center;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--brand-dark);
	}

	.wordmark {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		line-height: 1.15;
		text-transform: uppercase;
	}

	.wordmark em {
		font-style: normal;
		font-weight: 500;
		color: var(--text-secondary);
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
