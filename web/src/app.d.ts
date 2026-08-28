// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				SANITY_API_READ_TOKEN?: string;
				RESEND_API_KEY?: string;
				CONTACT_TO_EMAIL?: string;
				CONTACT_FROM_EMAIL?: string;
				PUBLIC_SANITY_PROJECT_ID?: string;
				PUBLIC_SANITY_DATASET?: string;
				PUBLIC_SITE_URL?: string;
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
