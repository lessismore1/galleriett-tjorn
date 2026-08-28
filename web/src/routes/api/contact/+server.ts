import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KINDS = new Set(['artist', 'work', 'work-similar', 'contact']);

type Body = {
	email?: unknown;
	name?: unknown;
	message?: unknown;
	subject?: unknown;
	contextText?: unknown;
	pageUrl?: unknown;
	kind?: unknown;
	website?: unknown; // honeypot
};

function asString(v: unknown, max: number): string {
	if (typeof v !== 'string') return '';
	return v.trim().slice(0, max);
}

function escapeHtml(s: string): string {
	return s
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function toHtmlParagraphs(text: string): string {
	return text
		.split(/\n{2,}/)
		.map((block) => `<p>${escapeHtml(block).replaceAll('\n', '<br>')}</p>`)
		.join('');
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	let raw: Body;
	try {
		raw = (await request.json()) as Body;
	} catch {
		throw error(400, 'Ogiltig förfrågan');
	}

	// Honeypot — tyst OK så bots inte retry:ar
	if (asString(raw.website, 200)) {
		return json({ ok: true });
	}

	const email = asString(raw.email, 254).toLowerCase();
	const name = asString(raw.name, 120);
	const message = asString(raw.message, 4000);
	const subject = asString(raw.subject, 180);
	const contextText = asString(raw.contextText, 2000);
	const pageUrl = asString(raw.pageUrl, 500);
	const kind = asString(raw.kind, 40);

	if (!email || !EMAIL_RE.test(email)) {
		throw error(400, 'Ange en giltig e-postadress');
	}
	if (!subject) {
		throw error(400, 'Ämne saknas');
	}
	if (!KINDS.has(kind)) {
		throw error(400, 'Ogiltig förfrågan');
	}
	if (kind === 'contact' && !message) {
		throw error(400, 'Meddelande saknas');
	}

	const apiKey = env.RESEND_API_KEY;
	if (!apiKey) {
		console.error('RESEND_API_KEY saknas');
		throw error(503, 'E-post är inte konfigurerad just nu');
	}

	const to = env.CONTACT_TO_EMAIL?.trim() || 'info@galleriett-tjorn.se';
	const from = env.CONTACT_FROM_EMAIL?.trim() || 'GALLERIett <info@galleriett-tjorn.se>';

	const lines: string[] = [];
	if (contextText) lines.push(contextText);
	if (message) {
		if (lines.length) lines.push('');
		lines.push(message);
	}
	lines.push('');
	lines.push('—');
	lines.push(`Från: ${name || '(inget namn)'} <${email}>`);
	if (pageUrl) lines.push(`Sida: ${pageUrl}`);
	lines.push(`Typ: ${kind}`);
	try {
		lines.push(`IP: ${getClientAddress()}`);
	} catch {
		/* ignore */
	}

	const text = lines.join('\n');
	const html = toHtmlParagraphs(text);

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from,
			to: [to],
			cc: [email],
			reply_to: email,
			subject,
			text,
			html
		})
	});

	if (!res.ok) {
		const detail = await res.text().catch(() => '');
		console.error('Resend error', res.status, detail);
		throw error(502, 'Kunde inte skicka meddelandet. Försök igen om en stund.');
	}

	return json({ ok: true });
};
