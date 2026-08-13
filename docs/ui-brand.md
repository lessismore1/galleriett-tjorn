# UI / varumärke — GALLERIett (G1)

Utkast 2026-08-13.

## Primärfärg

| Token | Användning |
|---|---|
| `--brand` (lime) | Logga, **primära knappar**, badge Pågående, filter-underline, diskreta accenter |
| `--brand-dark` | Rubrik-/brödtext, text **på** lime-knapp |
| Vit / soft cream | Sidbakgrund, band |
| `--surface-hover` (`#ecebe3`) | Kort-meta-hover på **vit** sektion (`.band`) |
| `--surface-hover-on-soft` (`#ffffff`) | Kort-meta-hover på **beige** sektion (`.band-soft`) |
| `--card-meta-hover` | Kontexttoken — sätts av `.band` / `.band-soft`; kort använder denna |

## Komponenter (kort)

**Regel:** Om samma UI används (eller ska kunna användas) på mer än en plats → egen komponent.

| Kort | Komponent | Exempel |
|---|---|---|
| Konstnärskort | `ArtistCard` | `/konstnarer` (karusell); utställning / nyhet / “Kanske också intressant” (`mediaMode="portrait"`) |
| Verkskort | `ArtworkCard` | konstnärssida Verk, utställning Verk |

### `ArtistCard`-lägen

| Prop | Default | Utställning / nyhet |
|---|---|---|
| `mediaMode` | `"carousel"` | `"portrait"` (fix porträtt, ingen karusell) |
| `showIcon` | `true` | `false` |
| `showBadge` | `true` | `false` |

**Hover:** helkort (1px `--brand`-ram + `--card-meta-hover` på meta) — samma rytm som `ArtworkCard`.

## Designbegränsning — kort på vit och beige

`ArtistCard` och `ArtworkCard` ska fungera på **både** `.band` (vit) och `.band-soft` (beige).

- Hover på meta får **inte** vara samma färg som sektionsbakgrunden.
- Kort ska använda `var(--card-meta-hover)` (inte hårdkoda en hover-färg).
- Sektionen sätter rätt hover via `--card-meta-hover` i `app.css`.

## Knappar

**Primär CTA** (`.btn` i `app.css`):

- Bakgrund: `--brand` (lime)
- Text: `--brand-dark`
- Skarpa hörn (inga pills)
- Exempel: “Läs mer om utställningen”, “Maila om intresse”

**Sekundär / ghost:** transparent + diskret kant; ingen lime-fyllnad.

**Undvik:** svart ifylld knapp som standardprimär — känns tyngre än galleriets uttryck och bryter mot startsidans CTA.

## Andra accenter

- Hover-ram på konstnärs-/verkskort: 1px `--brand`
- Statusbadge Pågående: lime; Kommande: mörk
- `link-arrow` pil: `--brand`

## Vänsterkant / stripe

Inte standard på webben. Varumärket bärs av **logga + primär CTA + små accenter**. En permanent vänsterstripe sparas till tryck/PDF om den behövs.

## Check

Nya knappar → återanvänd `.btn` i stället för lokala svarta CTA-stilar.  
Nya kort-ytor → `ArtistCard` / `ArtworkCard` + `--card-meta-hover`.
