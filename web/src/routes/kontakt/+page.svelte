<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const site = $derived(data.site);
	const addr = $derived(`${site.address.street}, ${site.address.postal}`);
	const siteUrl = $derived(site.url || 'https://galleriett-tjorn.pages.dev');

	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let website = $state('');
	let sending = $state(false);
	let sent = $state(false);
	let errorMsg = $state('');

	async function onSubmit(e: Event) {
		e.preventDefault();
		if (sending) return;
		errorMsg = '';
		sending = true;
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					name,
					email,
					message,
					subject: subject.trim() || 'Meddelande från kontaktformuläret',
					contextText: 'Hej GALLERIett,\n\nMeddelande via kontaktformuläret.\n\nVänliga hälsningar',
					pageUrl: `${siteUrl}/kontakt`,
					kind: 'contact',
					website
				})
			});
			const payload = await res.json().catch(() => ({}));
			if (!res.ok) {
				errorMsg =
					typeof payload?.message === 'string'
						? payload.message
						: 'Kunde inte skicka. Kontrollera uppgifterna och försök igen.';
				return;
			}
			sent = true;
			name = '';
			email = '';
			subject = '';
			message = '';
		} catch {
			errorMsg = 'Nätverksfel. Försök igen.';
		} finally {
			sending = false;
		}
	}
</script>

<Breadcrumbs crumbs={[{ name: 'Kontakt' }]} />

<section class="band">
	<div class="container hero">
		<div>
			<p class="label accent">Kontakt</p>
			<h1 class="serif">Vi ser fram emot ditt besök</h1>
			<p class="lead">
				Har du frågor om utställningar, konstverk eller samarbeten? Hör gärna av dig – vi svarar
				så snart vi kan.
			</p>
			<a class="link-arrow" href="#formular">Skicka ett meddelande</a>
		</div>
		<img src="/images/gallery-interior-clean.jpg" alt="Galleriinteriör" />
	</div>
</section>

<section class="band-soft band-pad" id="formular">
	<div class="container grid">
		{#if sent}
			<div class="form thanks">
				<h2 class="label">Skicka ett meddelande</h2>
				<p class="serif thanks-title">Tack!</p>
				<p>Meddelandet är skickat. Du får en kopia (cc) till din e-post.</p>
				<button class="btn" type="button" onclick={() => (sent = false)}>Skicka ett till</button>
			</div>
		{:else}
			<form class="form" onsubmit={onSubmit}>
				<h2 class="label">Skicka ett meddelande</h2>
				<p class="notice">
					Vi skickar till GALLERIett. Du får en kopia (cc) till din e-post, och svar går till dig.
				</p>
				<label>
					Namn
					<input
						name="name"
						type="text"
						placeholder="Ditt namn"
						required
						bind:value={name}
						disabled={sending}
					/>
				</label>
				<label>
					E-post
					<input
						name="email"
						type="email"
						placeholder="din@email.se"
						required
						bind:value={email}
						disabled={sending}
					/>
				</label>
				<label>
					Ämne
					<input
						name="subject"
						type="text"
						placeholder="Ämne"
						bind:value={subject}
						disabled={sending}
					/>
				</label>
				<label>
					Meddelande
					<textarea
						name="message"
						rows="5"
						placeholder="Skriv ditt meddelande här..."
						required
						bind:value={message}
						disabled={sending}
					></textarea>
				</label>
				<label class="hp" aria-hidden="true">
					Webbplats
					<input type="text" name="website" tabindex="-1" autocomplete="off" bind:value={website} />
				</label>
				{#if errorMsg}
					<p class="err" role="alert">{errorMsg}</p>
				{/if}
				<button class="btn" type="submit" disabled={sending}>
					{sending ? 'Skickar…' : 'Skicka meddelande →'}
				</button>
			</form>
		{/if}

		<div>
			<h2 class="label">Kontaktinformation</h2>
			<ul class="info">
				<li>
					<span>Besöksadress</span>
					{addr}
				</li>
				<li>
					<span>Öppettider</span>
					{site.hours}
				</li>
				<li>
					<span>Telefon</span>
					<a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
				</li>
				<li>
					<span>E-post</span>
					<a href={`mailto:${site.email}`}>{site.email}</a>
				</li>
			</ul>
		</div>

		<div>
			<h2 class="label">Hitta hit</h2>
			<div class="map" aria-hidden="true">Karta</div>
			<a class="link-arrow" href={site.mapsUrl} target="_blank" rel="noreferrer"
				>Visa på Google Maps</a
			>
		</div>
	</div>
</section>

<section class="band band-pad">
	<div class="container visit-grid">
		<div>
			<h2 class="serif">Besök GALLERIett</h2>
			<p>
				Vi ligger i Rönnäng på Tjörn — välkommen in för utställningar, samtal och en kopp
				kaffe.
			</p>
			<a class="link-arrow" href="/om">Planera ditt besök</a>
		</div>
		<img src="/images/about-building.jpg" alt="Galleriets byggnad" />
	</div>
</section>

<style>
	.hero {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: 2rem;
		align-items: end;
		padding-block: 3rem 2rem;
	}

	.hero img {
		aspect-ratio: 4 / 3;
		object-fit: cover;
		width: 100%;
	}

	.lead {
		max-width: 36ch;
		color: var(--text-secondary);
	}

	.accent {
		color: var(--brand-dark);
	}

	.grid {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: 2rem 3rem;
	}

	.form {
		display: grid;
		gap: 0.85rem;
		grid-column: 1 / -1;
	}

	@media (min-width: 900px) {
		.form {
			grid-column: 1;
			grid-row: 1 / span 2;
		}
	}

	.form label {
		display: grid;
		gap: 0.35rem;
		font-size: var(--text-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		font-weight: 600;
		color: var(--text-muted);
	}

	.form input,
	.form textarea {
		font: inherit;
		font-size: var(--text-body);
		letter-spacing: normal;
		text-transform: none;
		font-weight: 400;
		color: var(--text);
		border: 1px solid var(--border);
		padding: 0.7rem 0.85rem;
		background: var(--bg);
		width: 100%;
	}

	.form input:focus,
	.form textarea:focus {
		outline: 2px solid var(--brand);
		outline-offset: 1px;
	}

	.notice {
		margin: 0;
		font-size: var(--text-meta);
		color: var(--text-secondary);
		text-transform: none;
		letter-spacing: normal;
		font-weight: 400;
	}

	.hp {
		position: absolute;
		left: -9999px;
		height: 0;
		overflow: hidden;
	}

	.err {
		margin: 0;
		color: #8b1e1e;
		font-size: var(--text-meta);
	}

	.thanks-title {
		margin: 0.25rem 0;
		font-size: 1.75rem;
	}

	.form .btn:disabled {
		opacity: 0.65;
		cursor: wait;
	}

	.info {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1rem;
	}

	.info li {
		display: grid;
		gap: 0.2rem;
	}

	.info span {
		font-size: var(--text-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		font-weight: 600;
		color: var(--text-muted);
	}

	.map {
		aspect-ratio: 16 / 10;
		background: var(--border);
		display: grid;
		place-items: center;
		color: var(--text-muted);
		font-size: var(--text-meta);
		margin-bottom: 0.75rem;
	}

	.visit-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		align-items: center;
	}

	.visit-grid img {
		aspect-ratio: 4 / 3;
		object-fit: cover;
		width: 100%;
	}

	@media (max-width: 800px) {
		.hero,
		.grid,
		.visit-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
