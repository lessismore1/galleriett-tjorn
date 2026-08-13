# UI / varumärke — GALLERIett (G1)

Utkast 2026-08-13.

## Primärfärg

| Token | Användning |
|---|---|
| `--brand` (lime) | Logga, **primära knappar**, badge Pågående, filter-underline, diskreta accenter |
| `--brand-dark` | Rubrik-/brödtext, text **på** lime-knapp |
| Vit / soft cream | Sidbakgrund, band |
| `--surface-hover` (`#ecebe3`) | Hover-bakgrund på kort-meta (konstnär + verk) |

## Knappar

**Primär CTA** (`.btn` i `app.css`):

- Bakgrund: `--brand` (lime)
- Text: `--brand-dark`
- Skarpa hörn (inga pills)
- Exempel: “Läs mer om utställningen”, “Maila om intresse”

**Sekundär / ghost:** transparent + diskret kant; ingen lime-fyllnad.

**Undvik:** svart ifylld knapp som standardprimär — känns tyngre än galleriets uttryck och bryter mot startsidans CTA.

## Andra accenter

- Hover-ram på konstnärskort: 1px `--brand`
- Statusbadge Pågående: lime; Kommande: mörk
- `link-arrow` pil: `--brand`

## Vänsterkant / stripe

Inte standard på webben. Varumärket bärs av **logga + primär CTA + små accenter**. En permanent vänsterstripe sparas till tryck/PDF om den behövs.

## Check

Nya knappar → återanvänd `.btn` i stället för lokala svarta CTA-stilar.
