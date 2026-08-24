# Galleri Ett

Webbplats för Galleri Ett (Tjörn) — SvelteKit + static adapter (Cloudflare Pages-klar).

## Kom igång

```sh
npm install
npm run dev
```

## GUI-mockuper

Referensdesign ligger i [`../docs/gui-mockups/`](../docs/gui-mockups/):

| Mockup | Route |
| --- | --- |
| `01-start.png` | `/` |
| `02-konstnarer.png` | `/konstnarer` |
| `03-konstnar.png` | `/konstnarer/[slug]` |
| `04-utstallningar.png` | `/utstallningar` |
| `05-kontakt.png` | `/kontakt` |

CMS: Sanity (`development`, private) via `PUBLIC_SANITY_*` + `SANITY_API_READ_TOKEN` (Viewer). Se `.env.example`.

`src/lib/data/mockData.js` används bara som källa till Studio-seed (`npm run seed:mock` i `studio-galleriett`), inte av webben längre.

## Bygg

```sh
cp .env.example .env   # fyll Viewer-token
npm run build
npm run preview
```
