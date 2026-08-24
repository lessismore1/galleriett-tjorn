# Sanity Studio — GALLERIett

Lokal Studio mot Sanity Cloud.

| | |
|---|---|
| **projectId** | `81lb9elz` |
| **dataset** | `production` |
| **Status** | Schema klart; **datasetet lämnas tomt** (ingen mock-seed) |

Webben (`web/`) kör fortfarande på `mockData.js` tills ni kopplar en Sanity-klient.

## Starta

```sh
cd studio-galleriett
npm install
npm run dev
```

Öppna Studio (vanligen http://localhost:3333), logga in med ditt Sanity-konto.

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
