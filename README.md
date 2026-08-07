# Galleri Ett

Webbplats för Galleri Ett (Tjörn) — SvelteKit + static adapter (Cloudflare Pages-klar).

## Kom igång

```sh
npm install
npm run dev
```

## GUI-mockuper

Referensdesign ligger i [`docs/gui-mockups/`](docs/gui-mockups/):

| Mockup | Route |
| --- | --- |
| `01-start.png` | `/` |
| `02-konstnarer.png` | `/konstnarer` |
| `03-konstnar.png` | `/konstnarer/[slug]` |
| `04-utstallningar.png` | `/utstallningar` |
| `05-kontakt.png` | `/kontakt` |

Mockdata: `src/lib/data/mockData.js`

## Bygg

```sh
npm run build
npm run preview
```
