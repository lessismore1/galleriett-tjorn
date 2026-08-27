<script lang="ts">
	let {
		href,
		image = null,
		artists = null,
		title,
		dateLabel = null,
		external = true,
		alt = ''
	}: {
		href: string;
		image?: string | null;
		artists?: string | null;
		title: string;
		dateLabel?: string | null;
		external?: boolean;
		alt?: string;
	} = $props();
</script>

<a
	class="card"
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noreferrer' : undefined}
>
	<div class="media">
		{#if image}
			<img src={image} {alt} />
		{:else}
			<div class="placeholder" aria-hidden="true"></div>
		{/if}
	</div>
	<div class="meta">
		{#if artists}
			<p class="artists serif">{artists}</p>
		{/if}
		<h3 class="serif">{title}</h3>
		{#if dateLabel}
			<p class="date">{dateLabel}</p>
		{/if}
	</div>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		min-width: 0;
		height: 100%;
		color: inherit;
		text-decoration: none;
	}

	.media {
		overflow: hidden;
		background: #e8e8e2;
	}

	.media img,
	.placeholder {
		aspect-ratio: 4 / 3;
		width: 100%;
		display: block;
		object-fit: cover;
		transition: transform 0.5s ease;
	}

	.placeholder {
		background: linear-gradient(135deg, #e4e2da, #d5d2c8);
	}

	.card:hover .media img {
		transform: scale(1.03);
	}

	.meta {
		display: grid;
		gap: 0.35rem;
		padding-top: 0.85rem;
		min-width: 0;
	}

	.artists {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		line-height: 1.35;
	}

	h3 {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		line-height: 1.35;
	}

	.date {
		margin: 0;
		font-size: 0.7rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-muted, #6b6b66);
		line-height: 1.35;
	}
</style>
