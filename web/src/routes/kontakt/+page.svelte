<script lang="ts">
	import { site } from '$lib/data/mockData.js';

	const addr = `${site.address.street}, ${site.address.postal}`;
</script>

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
		<form
			class="form"
			onsubmit={(e) => {
				e.preventDefault();
				alert('Tack! Formuläret är ännu en mockup — kopplas till backend senare.');
			}}
		>
			<h2 class="label">Skicka ett meddelande</h2>
			<label>
				Namn
				<input name="name" type="text" placeholder="Ditt namn" required />
			</label>
			<label>
				E-post
				<input name="email" type="email" placeholder="din@email.se" required />
			</label>
			<label>
				Ämne
				<input name="subject" type="text" placeholder="Ämne" />
			</label>
			<label>
				Meddelande
				<textarea name="message" rows="5" placeholder="Skriv ditt meddelande här..." required
				></textarea>
			</label>
			<button class="btn" type="submit">Skicka meddelande →</button>
		</form>

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
		gap: 2rem;
		padding-block: 3rem;
		align-items: center;
	}

	.accent {
		border-bottom: 2px solid var(--brand);
		display: inline-block;
		padding-bottom: 0.3rem;
		color: var(--text);
	}

	h1 {
		font-size: clamp(2.2rem, 5vw, 3.4rem);
		margin: 1rem 0;
	}

	.lead {
		color: var(--text-secondary);
		max-width: 28rem;
		margin-bottom: 1.25rem;
	}

	.hero img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	.grid {
		display: grid;
		gap: 2.5rem;
	}

	.form {
		display: grid;
		gap: 1rem;
	}

	label {
		display: grid;
		gap: 0.35rem;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	input,
	textarea {
		font: inherit;
		font-size: 0.95rem;
		text-transform: none;
		letter-spacing: normal;
		font-weight: 400;
		color: var(--text);
		border: none;
		border-bottom: 1px solid var(--border);
		padding: 0.65rem 0;
		background: transparent;
	}

	.info {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
	}

	.info li {
		padding: 0.85rem 0;
		border-bottom: 1px solid var(--border);
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.info span {
		display: block;
		font-size: 0.65rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 0.25rem;
	}

	.map {
		aspect-ratio: 4 / 3;
		background: #e8e8e2;
		display: grid;
		place-items: center;
		color: var(--text-muted);
		margin: 1rem 0;
		font-size: 0.8rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.visit-grid {
		display: grid;
		gap: 1.5rem;
		align-items: center;
	}

	.visit-grid h2 {
		font-size: clamp(1.8rem, 4vw, 2.4rem);
		margin: 0 0 0.75rem;
		font-weight: 500;
	}

	.visit-grid p {
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.visit-grid img {
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		background: #e8e8e2;
	}

	@media (min-width: 900px) {
		.hero {
			grid-template-columns: 1fr 1.1fr;
		}

		.grid {
			grid-template-columns: 1.2fr 1fr 1fr;
		}

		.visit-grid {
			grid-template-columns: 0.9fr 1.1fr;
		}
	}
</style>
