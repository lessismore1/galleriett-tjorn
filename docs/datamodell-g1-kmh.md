# Datamodell & URL — GALLERIett (G1) ↔ Konst med Horisont (KmH)

Utkast 2026-08-10. Sanity: **engelska `name`**, svenska `title` i Studio-GUI.

---

## 1. G1 — föreslagen Sanity-struktur

### Document types

| type (EN) | Studio-titel (SV) | Roll |
|---|---|---|
| `artist` | Konstnär | Biografi, porträtt, CV utanför galleriet |
| `artwork` | Konstverk | Ett verk, ägs av en konstnär (återanvänds) |
| `exhibition` | Utställning | G1:s program (datum, pressmeddelande, hängning) |
| `article` | Artikel | Nyheter + media (`kind`) |
| `location` | Plats | Fysisk plats (GALLERIett = en plats) |
| `sponsor` | Sponsor | Logotyp + länk |
| `video` | Video | Valfritt |
| `siteSettings` | Webbplats | Singleton: adress, öppettider, om-text |

### Objects

| type (EN) | Studio-titel (SV) |
|---|---|
| `pressQuote` | Presscitat |
| `externalCvEntry` | CV-post (utanför G1) |
| `installationView` | Installationsbild |
| `seo` | SEO |

### Kärnrelationer (G1)

```
artist ──< artwork >── exhibition.works[]
   │                         │
   │                         ├── artists[] → artist
   │                         ├── location → location   (oftast GALLERIett)
   │                         └── installationViews[]
   │
   ├── article.artists[] / article.exhibition
   ├── pressQuotes[]          (object — citat, inte artiklar)
   └── externalCv[]           (object — ej galleriets egna shows)
```

**En källa till sanning**

| Relation | Lagras på | Hämtas |
|---|---|---|
| Utställning → konstnärer | `exhibition.artists[]` | direkt |
| Konstnär → G1-utställningar | — | reverse: `exhibition` som refererar artist |
| Verk → konstnär | `artwork.artist` | direkt |
| Utställning → verk | `exhibition.works[]` | ordning/hängning |
| Konstnär → portfolio | — | `artwork` där `artist` matchar |
| Artikel → konstnär/utställning | refs på `article` | direkt |

`exhibition.status` beräknas från `start`/`end` (lagra inte manuellt).

### `article.kind`

| value (EN) | GUI |
|---|---|
| `gallery` | Från galleriet |
| `press` | Media |

---

## 2. KmH — befintlig struktur (referens)

Studio idag (`studio-konstmedhorisont`):

| type (EN) | Studio-titel | Roll |
|---|---|---|
| `area` | Område | Geografiskt filter (samhälle) |
| `location` | Plats | Bibliotek, restaurang, … (+ 2027 ateljé) |
| `event` | Evenemang / År | Årsedition (`year`, `isCurrent`) |
| `artist` | Konstnär | Profil + `participations[]` |
| `artwork` | Konstverk | Titel, bild, teknik, format, pris |
| `technique` | Teknik | Taxonomy |
| `artistParticipation` | Deltagande | **object** på artist: event + location + verk |

Nyckelobjekt: `artistParticipation` kopplar **artist ↔ event(år) ↔ location ↔ exhibitedWorks**.

Canonical arkiv-URL (redan preppad):

`/ar/2026/konstnarer/{artistSlug}`

Bare `/konstnarer/...` = aktuellt år (`event.isCurrent`).

---

## 3. Jämförelse — överlapp och skillnad

| Begrepp | G1 | KmH | Gemensamt? |
|---|---|---|---|
| Konstnär | `artist` | `artist` | **Ja** — samma doc-form |
| Verk | `artwork` | `artwork` | **Ja** |
| Plats | `location` (1 galleri + ev. fler) | `location` (+ `area`) | **Ja** — utöka `kind` |
| Program | `exhibition` (löpande kalender) | `event` (årsedition) | **Nära men olika** |
| Koppling show↔plats↔verk | på `exhibition` | `artistParticipation` | Olika mönster, samma idé |
| Nyheter/media | `article` | (saknas / ej samma) | G1-specifikt |
| Installationsbilder | på `exhibition` | ej central | G1-specifikt |
| Teknik-taxonomi | fritext/`specialty` | `technique` refs | Valfritt gemensamt |

### “G1 är subset av KmH”

**Delvis sant på entitetsnivå, inte på produktytan.**

- Delad kärna: `artist`, `artwork`, `location` (+ ev. `technique`).
- KmH lägger på: `event`, `area`, `artistParticipation`, anmälan, reels, kartnummer.
- G1 lägger på: `exhibition` (galleriets egen kalender), `article`, installation views, site/sponsorer.

GALLERIett som **plats** i KmH (`location` “GALLERI ett”) är redan verklighet i GUI — samma entity kan återanvändas.

**G1-utställning ≠ KmH-event.**  
Ett G1-show har start/slut och pressmeddelande. Ett KmH-event är en årsedition med många platser. Undvik att slå ihop dem till en typ; låt dem referera samma `artist` / `artwork` / `location`.

---

## 4. `location` — hur plats kommer in (2026 → 2027)

### Fältförslag (EN names / SV titles)

```
location
  name              Platsens namn
  slug
  kind              Typ          // publicVenue | artistStudio | gallery
  area              Område       // ref area (KmH; valfritt för G1)
  hostedByArtist    Ateljé-ägare // ref artist — när kind == artistStudio
  address, gps, googleMapsUrl, mapScreenshot
  openingHours, transport
  image, description
  contact / social (phone, email, website, socialLinks)
```

| `kind` | Exempel | 2026 | 2027 |
|---|---|---|---|
| `gallery` | GALLERIett | ja (KmH + G1 hem) | ja |
| `publicVenue` | bibliotek, restaurang | 3 st KmH | eventuellt |
| `artistStudio` | konstnärens ateljé | — | ja |

**G1:** de flesta `exhibition.location` → samma `gallery`-plats (GALLERIett).  
**KmH:** `artistParticipation.location` pekar på venue eller ateljé per år.

Ateljé 2027: skapa `location` med `kind: artistStudio` + `hostedByArtist`, *eller* tillåt tillfälligt “inline studio”-adress på participation om platsen bara lever ett år — föredra dock riktiga `location`-docs om de ska ha karta/öppettider.

---

## 5. Förslag — gemensam URL-struktur

**Princip:** samma path-*ord* (`konstnarer`, `platser`), men **år-prefix bara där edition spelar roll** (KmH). G1 är löpande galleri → ingen `/ar/{year}`.

### Gemensam vokabulär

| Path | G1 | KmH |
|---|---|---|
| `/konstnarer` | alla G1-konstnärer | aktuellt år (redirect/alias) |
| `/konstnarer/{slug}` | konstnär | konstnär i aktuellt år |
| `/platser` | valfritt / en plats | aktuellt år |
| `/platser/{slug}` | t.ex. galleriet | plats i aktuellt år |

### KmH — edition / arkiv

```
/                         → aktuellt event (isCurrent)
/ar/{year}/               → startsida för året (arkiv)
/ar/{year}/konstnarer
/ar/{year}/konstnarer/{slug}
/ar/{year}/platser
/ar/{year}/platser/{slug}
/ar/{year}/oversikt
```

Canonical arkiv behålls:  
`https://konstmedhorisont.se/ar/2026/konstnarer/barbro-liselotte-holmgren-gadd`

När 2027 är `isCurrent`: bare `/konstnarer/...` → 2027; 2026 lever kvar under `/ar/2026/...`.

### G1 — program (utan år)

```
/
/konstnarer
/konstnarer/{slug}
/utstallningar
/utstallningar/{slug}
/nyheter
/nyheter/{slug}
/om
/kontakt
/video
/sponsorer
```

Implicit plats: GALLERIett via `siteSettings` + ev. `/platser/galleriett` om ni vill spegla KmH-mönstret.

### Slug-policy (båda)

- Sanity/slug: **utan** nummerprefix → `kattis-palmnas`  
- G1 mock `10-kattis-palmnas` fasas ut med 301 vid migrering  
- Samma artist på båda sajter → **samma slug** om delad dataset

### Exempel sida vid sida

| | URL |
|---|---|
| G1 | `https://galleriett-tjorn.se/konstnarer/kattis-palmnas` |
| KmH nu | `https://konstmedhorisont.se/konstnarer/kattis-palmnas` |
| KmH arkiv | `https://konstmedhorisont.se/ar/2026/konstnarer/kattis-palmnas` |

---

## 6. Gemensamt GUI (design tokens / skal)

Mål: samma *skelett*, olika varumärkesfärg.

| Del | Gemensamt beteende | Token per sajt |
|---|---|---|
| Vänsterkant | Fast brand-edge | G1 `#c9cf1e` (lime), KmH solnedgångsorange, Kustkonst havsblått |
| Header | Logo vänster, nav höger, aktiv länk med understreck i brand | wordmark skiljer |
| Footer | Adress / kontakt / partners / credit | copy per sajt |
| Typografi / spacing | Delad skala om möjligt | — |
| Kort / layout | KmH mer “card”; G1 mer editorial — **dela tokens, inte tvinga samma kortstil överallt** | |

CSS-idé:

```css
:root {
  --brand: …;           /* per sajt */
  --brand-edge: 8px;
  --header-height: …;
}
```

Samma komponent-API (`Header`, `Footer`, `BrandEdge`) i en delad UI-kit eller copy-paste med tokens.

---

## 7. Sanity naming

| Kod (`name`) | Studio (`title`) |
|---|---|
| `artist` | Konstnär |
| `artwork` | Konstverk |
| `exhibition` | Utställning |
| `event` | Evenemang / År |
| `location` | Plats |
| `area` | Område |
| `article` | Artikel |
| `kind: gallery \| press` | (visas som Från galleriet / Media i webben) |
| `kind: gallery \| publicVenue \| artistStudio` | Galleri / Publik lokal / Ateljé |

Fält: `name`, `slug`, `profileImage`, `openingHours`, `exhibitedWorks`, … — **engelska**.  
Beskrivningar och `title` — **svenska**.

---

## 8. Rekommenderad målbild (lager)

```
┌─────────────────────────────────────────┐
│ Shared core                             │
│  artist · artwork · location · technique│
└────────────┬───────────────┬────────────┘
             │               │
     ┌───────▼──────┐ ┌──────▼──────────────┐
     │ G1 surface   │ │ KmH surface         │
     │ exhibition   │ │ event               │
     │ article      │ │ artistParticipation │
     │ siteSettings │ │ area                │
     │ sponsor      │ │ registration, reels │
     └──────────────┘ └─────────────────────┘
```

**Dataset-strategi (senare beslut):**

1. **Två dataset**, delad schema-paket (enklast driftsmässigt), eller  
2. **Ett dataset** + `sites[]` / brand-fält på dokument (kräver strikt filtrering i Studio och web).

Börja med (1); sikta på samma type-namn så (2) blir möjligt.

---

## 9. Nästa steg

1. Låsa URL-regler ovan (särskilt: inget `/ar` på G1).  
2. Utöka KmH `location` med `kind` + `hostedByArtist` inför 2027.  
3. Bygga ut G1 Studio: `artwork`, `article`, `location`, multi-artist på `exhibition`.  
4. Extrahera gemensamma GUI-tokens (brand-edge, header, footer).  
5. Migreringsplan för G1-slugbar utan sifferprefix.
