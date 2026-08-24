# Sanity Studio — GALLERIett

Lokal Studio mot Sanity Cloud.

| | |
|---|---|
| **projectId** | `81lb9elz` |
| **dataset** | `development` (seed); `production` tom tills ni byter |
| **Status** | Schema klart; seed via `npm run seed:mock` |

Webben (`web/`) kör fortfarande på `mockData.js` tills ni kopplar en Sanity-klient.

## Starta

```sh
cd studio-galleriett
npm install
cp .env.example .env   # fyll SANITY_API_TOKEN
npm run dev
```

Öppna Studio (vanligen http://localhost:3333), logga in med ditt Sanity-konto. Dataset styrs av `SANITY_STUDIO_DATASET` i `.env` (default `development`).

## Seed mock → development

```sh
npm run seed:mock
```

Laddar upp bilder från `web/static` och skapar konstnärer, verk, utställningar, nyheter, sponsorer, plats + webbplats. Idempotent (`createOrReplace`).

## Schema (G1)

**Dokument:** `artist`, `artwork`, `exhibition`, `galleryEvent`, `article`, `location`, `sponsor`, `video`, `siteSettings`  
**Objekt:** `seo`, `pressQuote`, `externalCvEntry`, `installationView`

`galleryEvent` = Evenemang (vernissage/pub/sip & paint). **Inte** samma sak som KmH `event` (årsedition). Se `docs/datamodell-g1-kmh.md` och `docs/evenemang.md`.

## Medvetet senare

- Seed / migrering från mock
- Separat `development`-dataset
- `sanity deploy` (hostad Studio)
- SvelteKit ↔ Sanity

## Dashboard

Ignorera Sanity manage “Next.js / Building from scratch” — frontend är redan SvelteKit i `web/`.
