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

## Logga + plats

Under logotypen i header: subtil rad **`Tjörn`** (sans, uppercase, muted, tät letter-spacing) — plats som varumärkesdel, inte slogan.

- Använd **befintliga fonter** (`--font-sans`), inte snirklig display/script.
- Scriptfont under loggan konkurrerar med wordmarken och känns “dekor” snarare än institution.
- Inte kommunvapen eller Visit Tjörn-logo i lockupen (se diskussion kring platsidentitet).

## Detalj-hero (konstnär / utställning)

Samma arkitektur på detaljsidor — **TEXT | BILD**, full-bleed soft-band (`.band-soft`), inte overlay.

| | Utställning | Konstnär |
|---|---|---|
| Layout | TEXT \| affisch | TEXT \| promo-verk + porträtt (samma 16:11-yta) |
| Label | Utställning {id} | Konstnär |
| Primär rubrik | Konstnärsnamn | Namn |
| Sekundär | Titel (italic) + datum | Född … |
| CTA | Ev. Facebook / läs mer | Kontakta konstnären |

**Start** behåller overlay (landning). **Listor** behåller title-band. Skillnad mellan konstnär och utställning = innehåll/typografi, inte annan hero-modell.

## Sticky subnav (detalj)

Konstnär och utställning: sentinel under breadcrumbs → `body.subnav-stuck` döljer site-header → fixed bar med logga.

**Verk** har egen chrome: ingen site-header, ingen breadcrumbs. Sticky subnav styr allt från start (logo · konstnär · Verk · ‹ prev / n / next ›). Header döljs via path-check i `Header.svelte`. På desktop: hela verket syns i viewport (`object-fit: contain`); meta/CTA scrollar i högerkolumnen.

| Sida | Innehåll när stuck / på verk |
|---|---|
| Konstnär | Logga + namn + sektionslänkar |
| Utställning | Logga + titel + sektionslänkar |
| Verk | Logga + konstnär · Verk · Visa alla · count; cirkelpilar på bilden |

## Komponenter (kort)

**Regel:** Om samma UI används (eller ska kunna användas) på mer än en plats → egen komponent.

| Kort | Komponent | Exempel |
|---|---|---|
| Konstnärskort | `ArtistCard` | `/konstnarer` (karusell); utställning / nyhet / “Kanske också intressant” (`mediaMode="portrait"`) |
| Verkskort | `ArtworkCard` | konstnärssida Verk, utställning Verk |
| Utställningsrad | `ExhibitionRow` | `/utstallningar` (Aktuella); konstnär → Aktuella |
| Utställningskort | `ExhibitionCard` | startsida Aktuellt; **Tidigare** (`/utstallningar/tidigare`); konstnär → Tidigare |

### `ArtistCard`-lägen

| Prop | Default | Utställning / nyhet |
|---|---|---|
| `mediaMode` | `"carousel"` | `"portrait"` (fix porträtt, ingen karusell) |
| `showIcon` | `true` | `false` |
| `showBadge` | `true` | `false` |

**Hover:** helkort (1px `--brand`-ram + `--card-meta-hover` på meta) — samma rytm som `ArtworkCard`.  
**Karusell (listan):** hela kortet → konstnär; desktop: cirkelpilar vid hover; mobil: svep + prickar (inga ständigt synliga pilar). Efter manuell bläddring återgår karusellen till första bilden efter 5s.

### `ExhibitionRow`

Split-rad för **Aktuella** (pågående + kommande; inte Tidigare): **bild | text** — samma tvåkolumnskänsla som t.ex. Magnus Karlsson / Akvarellmuseet.

| Prop | Roll |
|---|---|
| `leading` | t.ex. `Utställning 104` |
| `title` / `line2` | primär rubrik (konstnär) + italic sekundär (utställningstitel) |
| `subtitle` | datum |
| `intro` | pitch (`exhibition.intro`) |
| `image` / `status` | affisch 16:11 + badge |
| `href` / `showPlus` | länk; “Läs mer →” |

**Desktop:** TEXT | BILD (samma kolumnrytm som detalj-hero, text vertikalt centrerad mot bilden). **Mobil:** bild ovanför text.

### `ExhibitionCard`

Vertikalt grid-kort: bild → titel → undertext.

| Prop | Roll |
|---|---|
| `image` / `href` | media + länk |
| `status` **eller** `badge` | Pågående/Kommande, eller fri etikett (t.ex. Media) — **inte** på Tidigare-grid |
| `title` / `subtitle` | primär + sekundär |

**Användning:** startsida Aktuellt; `/utstallningar/tidigare/{year}` som **volym-grid** (lättare än `ExhibitionRow`).  
**Hover:** helkort (ram + `--card-meta-hover` + lätt bildzoom) — samma rytm som `ArtworkCard`.

**Utställningslistor:** Aktuella = `ExhibitionRow` (split + pitch). Tidigare = `ExhibitionCard`-grid + **årssubnav**. Konstnärssida samma uppdelning under Utställningar.

## Designbegränsning — kort på vit och beige

`ArtistCard`, `ArtworkCard`, `ExhibitionCard` och `ExhibitionRow` ska fungera på **både** `.band` (vit) och `.band-soft` (beige).

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
Nya kort-ytor → `ArtistCard` / `ArtworkCard` / `ExhibitionRow` / `ExhibitionCard` + `--card-meta-hover`.

**Evenemang** (mat/dryck/biljett) har **egen rytm** och egen yta — se `docs/evenemang.md`. Blanda inte in “Boka” som default på utställnings-/verkssidor.
