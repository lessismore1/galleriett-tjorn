<script lang="ts">
	type Crumb = { name: string; href?: string };

	let { crumbs = [] as Crumb[] } = $props();
</script>

<nav class="crumbs" aria-label="Brödsmula">
	<div class="container">
		<ol class="row">
			<li class="item">
				<a href="/" class="home" aria-label="Startsida">
					<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"
						><path
							fill="currentColor"
							d="M12 3.2 3.5 10.5V21h6.2v-6.1h4.6V21h6.2V10.5L12 3.2z"
						/></svg
					>
				</a>
				<span class="sep" aria-hidden="true">›</span>
			</li>

			{#each crumbs as crumb, i}
				<li class="item">
					{#if i === crumbs.length - 1 || !crumb.href}
						<span class="current">{crumb.name}</span>
					{:else}
						<a href={crumb.href}>{crumb.name}</a>
						<span class="sep" aria-hidden="true">›</span>
					{/if}
				</li>
			{/each}
		</ol>
	</div>
</nav>

<style>
	.crumbs {
		background: #fff;
		border-bottom: 1px solid var(--border);
		padding-block: 0.35rem;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		margin: 0;
		padding: 0;
		list-style: none;
		overflow-x: auto;
		white-space: nowrap;
		scrollbar-width: none;
		font-size: var(--text-label);
		font-weight: 600;
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		line-height: 1.2;
		color: var(--text-secondary);
	}

	.row::-webkit-scrollbar {
		display: none;
	}

	.item {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
	}

	.home {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: inherit;
		line-height: 0;
	}

	.home:hover,
	a:hover {
		color: var(--text);
	}

	.sep {
		opacity: 0.55;
		font-weight: 500;
	}

	.current {
		color: var(--text);
		max-width: 12rem;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
