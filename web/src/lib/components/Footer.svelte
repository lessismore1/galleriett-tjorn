<script lang="ts">
	import { site } from '$lib/data/mockData.js';

	const addr = `${site.address.street}, ${site.address.postal}, ${site.address.region}, ${site.address.country}`;
</script>

<footer class="footer">
	<div class="container partners">
		<span class="label">I samarbete med</span>
		<div class="partner-list">
			{#each site.partners as p}
				<span>{p.short ?? p.name}</span>
			{/each}
		</div>
	</div>

	<div class="container grid">
		<a href="/" class="logo" aria-label={site.name}>
			<img src="/images/logo.webp" alt={site.name} width="48" height="48" />
		</a>

		<div>
			<p class="label">Galleri Ett</p>
			<p>{addr}</p>
		</div>
		<div>
			<p class="label">Besök oss</p>
			<p>{site.hours}</p>
		</div>
		<div>
			<p class="label">Följ oss</p>
			<p>
				<a href={site.social.instagram}>Instagram</a><br />
				<a href={site.social.facebook}>Facebook</a>
			</p>
		</div>
		<div>
			<p class="label">I samarbete med</p>
			{#each site.partners as p}
				<p>{p.name}</p>
			{/each}
		</div>
	</div>

	<div class="container bottom">
		<span>© Galleri Ett {new Date().getFullYear()}</span>
		<span>{site.credit}</span>
	</div>
</footer>

<style>
	.footer {
		background: var(--bg-soft);
		margin-top: 4rem;
		border-top: 1px solid var(--border);
	}

	.partners {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding-block: 1rem;
		border-bottom: 1px solid var(--border);
		flex-wrap: wrap;
	}

	.partner-list {
		display: flex;
		gap: 1.5rem;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.grid {
		display: grid;
		gap: 1.5rem;
		padding-block: 2.5rem;
		grid-template-columns: 1fr;
	}

	.logo img {
		width: 3rem;
		height: 3rem;
		display: block;
		object-fit: contain;
	}

	.label {
		margin: 0 0 0.5rem;
	}

	p {
		margin: 0;
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.55;
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-block: 1rem 1.5rem;
		border-top: 1px solid var(--border);
		font-size: 0.7rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-muted);
		flex-wrap: wrap;
	}

	@media (min-width: 800px) {
		.grid {
			grid-template-columns: auto 1.2fr 1fr 1fr 1fr;
			align-items: start;
		}
	}
</style>
