<script lang="ts">
	type Kind = 'artist' | 'work' | 'work-similar' | 'contact';

	let {
		open = $bindable(false),
		title,
		subject,
		contextText,
		pageUrl,
		kind,
		submitLabel = 'Skicka →'
	}: {
		open?: boolean;
		title: string;
		subject: string;
		contextText: string;
		pageUrl: string;
		kind: Kind;
		submitLabel?: string;
	} = $props();

	let dialogEl = $state<HTMLDialogElement | null>(null);
	let name = $state('');
	let email = $state('');
	let message = $state('');
	let website = $state(''); // honeypot
	let sending = $state(false);
	let sent = $state(false);
	let errorMsg = $state('');

	$effect(() => {
		const el = dialogEl;
		if (!el) return;
		if (open) {
			if (!el.open) el.showModal();
		} else if (el.open) {
			el.close();
		}
	});

	function resetForm() {
		name = '';
		email = '';
		message = '';
		website = '';
		sending = false;
		sent = false;
		errorMsg = '';
	}

	function close() {
		open = false;
	}

	function onDialogClose() {
		open = false;
		resetForm();
	}

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
					subject,
					contextText,
					pageUrl,
					kind,
					website
				})
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				errorMsg =
					typeof data?.message === 'string'
						? data.message
						: 'Kunde inte skicka. Kontrollera e-postadressen och försök igen.';
				return;
			}
			sent = true;
		} catch {
			errorMsg = 'Nätverksfel. Försök igen.';
		} finally {
			sending = false;
		}
	}
</script>

<dialog
	bind:this={dialogEl}
	class="contact-dialog"
	aria-labelledby="contact-dialog-title"
	onclose={onDialogClose}
	onclick={(e) => {
		if (e.target === dialogEl) close();
	}}
>
	{#if sent}
		<div class="panel">
			<h2 id="contact-dialog-title" class="serif">Tack!</h2>
			<p class="lead">Meddelandet är skickat. Du får en kopia till {email}.</p>
			<button type="button" class="btn" onclick={close}>Stäng</button>
		</div>
	{:else}
		<form class="panel" onsubmit={onSubmit}>
			<div class="head">
				<h2 id="contact-dialog-title" class="serif">{title}</h2>
				<button type="button" class="icon-close" onclick={close} aria-label="Stäng">×</button>
			</div>

			<p class="notice">
				Vi skickar till GALLERIett. Du får en kopia (cc) till din e-post, och svar går till dig.
			</p>

			<p class="context" aria-label="Förifyllt meddelande">
				<span class="label">Ämne</span>
				{subject}
				<span class="label spaced">Meddelande</span>
				{contextText}
			</p>

			<label>
				Din e-post *
				<input
					type="email"
					name="email"
					autocomplete="email"
					placeholder="din@email.se"
					required
					bind:value={email}
					disabled={sending}
				/>
			</label>

			<label>
				Namn
				<input
					type="text"
					name="name"
					autocomplete="name"
					placeholder="Valfritt"
					bind:value={name}
					disabled={sending}
				/>
			</label>

			<label>
				Tillägg till meddelandet
				<textarea
					name="message"
					rows="3"
					placeholder="Valfritt — t.ex. frågor om pris eller besök"
					bind:value={message}
					disabled={sending}
				></textarea>
			</label>

			<!-- honeypot -->
			<label class="hp" aria-hidden="true">
				Webbplats
				<input type="text" name="website" tabindex="-1" autocomplete="off" bind:value={website} />
			</label>

			{#if errorMsg}
				<p class="err" role="alert">{errorMsg}</p>
			{/if}

			<div class="actions">
				<button type="button" class="btn ghost" onclick={close} disabled={sending}>Avbryt</button>
				<button type="submit" class="btn" disabled={sending}>
					{sending ? 'Skickar…' : submitLabel}
				</button>
			</div>
		</form>
	{/if}
</dialog>

<style>
	.contact-dialog {
		border: none;
		padding: 0;
		max-width: min(32rem, calc(100vw - 2rem));
		width: 100%;
		background: transparent;
	}

	.contact-dialog::backdrop {
		background: rgba(26, 26, 18, 0.45);
	}

	.panel {
		background: var(--bg);
		padding: 1.5rem;
		display: grid;
		gap: 0.85rem;
	}

	.head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
	}

	h2 {
		margin: 0;
		font-size: 1.5rem;
	}

	.icon-close {
		border: none;
		background: transparent;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		color: var(--text-muted);
		padding: 0.1rem 0.35rem;
	}

	.lead,
	.notice {
		margin: 0;
		font-size: var(--text-body);
		color: var(--text-secondary);
	}

	.context {
		margin: 0;
		padding: 0.85rem 1rem;
		background: var(--bg-soft);
		font-size: var(--text-meta);
		color: var(--text-secondary);
		white-space: pre-wrap;
		line-height: 1.45;
	}

	.context .label {
		display: block;
		margin-bottom: 0.25rem;
	}

	.context .label.spaced {
		margin-top: 0.75rem;
	}

	label {
		display: grid;
		gap: 0.35rem;
		font-size: var(--text-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		font-weight: 600;
		color: var(--text-muted);
	}

	input,
	textarea {
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

	input:focus,
	textarea:focus {
		outline: 2px solid var(--brand);
		outline-offset: 1px;
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

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.65rem;
		flex-wrap: wrap;
		margin-top: 0.25rem;
	}

	.btn.ghost {
		background: transparent;
		border: 1px solid var(--border);
		color: var(--text);
	}

	.btn:disabled {
		opacity: 0.65;
		cursor: wait;
	}
</style>
