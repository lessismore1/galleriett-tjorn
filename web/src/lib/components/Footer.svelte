<script lang="ts">
	import { site } from '$lib/data/mockData.js';

	const addr = `${site.address.street}, ${site.address.postal}`;
</script>

<footer class="footer">
	<div class="container partners">
		<span class="label">I samarbete med</span>
		<div class="partner-list">
			{#each site.partners as p}
				{#if p.url}
					<a href={p.url} target="_blank" rel="noreferrer">{p.name}</a>
				{:else}
					<span>{p.name}</span>
				{/if}
			{/each}
		</div>
	</div>

	<div class="container grid">
		<div class="col identity">
			<div class="block">
				<p class="label">Adress</p>
				<p class="body">{addr}</p>
			</div>

			<div class="block">
				<p class="label">Kontakt</p>
				<p class="body">
					<a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a><br />
					<a href={`mailto:${site.email}`}>{site.email}</a>
				</p>
			</div>
		</div>

		<div class="col middle">
			<div class="block">
				<p class="label">Öppet</p>
				<p class="body">{site.hours}</p>
			</div>
		</div>

		<div class="col right">
			<div class="block">
				<p class="label">Design & utveckling</p>
				<p class="body credit">
					<a href={site.credit.url} target="_blank" rel="noreferrer">
						{site.credit.name}
						<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"
							><path
								fill="currentColor"
								d="M6.5 8.5A1.75 1.75 0 1 1 6.5 5a1.75 1.75 0 0 1 0 3.5zM4.75 10h3.5v9.25h-3.5V10zM10.5 10h3.35v1.26h.05c.47-.88 1.6-1.8 3.3-1.8 3.53 0 4.18 2.32 4.18 5.34v4.45h-3.5v-3.95c0-.94-.02-2.15-1.31-2.15-1.31 0-1.51 1.02-1.51 2.08v4.02h-3.5V10z"
							/></svg
						>
					</a>
				</p>
			</div>

			<div class="block">
				<p class="label">Följ oss</p>
				<div class="social">
					<a href={site.social.facebook} aria-label="Facebook" target="_blank" rel="noreferrer">
						<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
							><path
								fill="currentColor"
								d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z"
							/></svg
						>
					</a>
					<a href={site.social.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
						<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
							><path
								fill="currentColor"
								d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.7a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8zM17.5 6.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm6.4 12.3a3.7 3.7 0 0 1-2.1 2.1c-.9.3-3 .5-4.3.5s-3.4-.2-4.3-.5a3.7 3.7 0 0 1-2.1-2.1c-.3-.9-.5-3-.5-4.3s.2-3.4.5-4.3a3.7 3.7 0 0 1 2.1-2.1c.9-.3 3-.5 4.3-.5s3.4.2 4.3.5a3.7 3.7 0 0 1 2.1 2.1c.3.9.5 3 .5 4.3s-.2 3.4-.5 4.3z"
							/></svg
						>
					</a>
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: var(--bg-soft);
		margin-top: 4rem;
		border-top: 1px solid var(--border);
		padding-bottom: 2.5rem;
	}

	.partners {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding-block: 0.85rem;
		border-bottom: 1px solid var(--border);
		flex-wrap: wrap;
	}

	.partner-list {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.partner-list a:hover {
		color: var(--text);
	}

	.grid {
		display: grid;
		gap: 2.5rem;
		padding-block: 2.75rem 1rem;
		grid-template-columns: 1fr;
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.block {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.label {
		margin: 0;
	}

	.body {
		margin: 0;
		font-size: 0.95rem;
		color: var(--text);
		line-height: 1.55;
	}

	.body a:hover {
		color: var(--text-secondary);
	}

	.credit a {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.social {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		color: var(--text);
	}

	.social a {
		display: grid;
		place-items: center;
		opacity: 0.85;
	}

	.social a:hover {
		opacity: 1;
	}

	@media (min-width: 800px) {
		.grid {
			grid-template-columns: 1.4fr 1fr 1fr;
			align-items: start;
			gap: 2rem;
		}

		.middle {
			padding-top: 0;
		}

		.right {
			align-items: flex-end;
			text-align: right;
		}

		.right .social {
			justify-content: flex-end;
		}
	}
</style>
