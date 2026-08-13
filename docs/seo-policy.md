# SEO-policy — GALLERIett (G1)

Utkast 2026-08-13. Gäller mockup/produktion när `Seo.svelte` används.

## Mål

- En **tydlig URL per meningsfull sida**
- Undvik dubblettinnehåll från filter, sök och query-parametrar
- Title + description på alla indexerbara sidor

## Teknik

Komponenten `web/src/lib/components/Seo.svelte` sätter:

- `<title>`
- `<meta name="description">`
- `<link rel="canonical">` = `origin + pathname` (**utan** query/hash)
- Open Graph / Twitter (title, description, url, ev. image)

Alla list- och detaljsidor som ska indexeras ska använda `Seo`.

## Canonical — listsidor

| URL | Canonical | Kommentar |
|---|---|---|
| `/konstnarer` | `/konstnarer` | En lista; filter/sök är UI-state |
| `/utstallningar` | `/utstallningar` | Årets program |
| `/utstallningar/pagaende` | samma path | Egen listsida |
| `/utstallningar/kommande` | samma path | Egen listsida |
| `/utstallningar/arkiv` | samma path | Arkivöversikt |
| `/utstallningar/arkiv/2025` | `/utstallningar/arkiv/2025` | Årsarkiv är indexvärt |
| `/nyheter` | `/nyheter` | Filter i UI, inte i URL |

**Regel:** Har sidan en **egen route** med eget innehåll → canonical = den routen.

**Regel:** Client-side filter (Aktuellt, teknik, sök) **utan** URL-ändring → fortfarande canonical till listans rena path.

**Regel:** Om filter senare läggs i query (`?filter=aktuellt`, `?q=…`) → canonical ska **fortfarande** vara ren pathname (som `Seo` redan gör). Indexera inte varje filtervariant.

**Undvik:** Query som ersätter riktiga arkiv-URL:er (t.ex. `/utstallningar?år=2025` när `/utstallningar/arkiv/2025` finns).

## Canonical — detaljsidor

| URL | Canonical |
|---|---|
| `/konstnarer/{slug}` | samma path |
| `/konstnarer/{artistSlug}/verk/{workSlug}` | samma path — **en** URL per verk; slug = `{id}-{titel}-{år}` (id från 1001) |
| `/utstallningar/{slug}` | samma path |
| `/nyheter/{slug}` | samma path |

Detalj = egen sida, egen canonical. Inga “canonical upp till listan”.

**Verk:** Canonical ligger alltid under konstnären. Utställningssidor länkar till samma verk-URL (inte en parallell path under `/utstallningar/…`). Se `docs/verk-sida.md`.
## Title & description

- **Title:** `{Ämne} · GALLERIett` (listor) eller `{Namn/titel} · GALLERIett` (detalj)
- **Description:** 1–2 meningar, konkret (plats, teknik, år där det hjälper)
- **OG-bild:** gärna hero/listbild när den finns

## Jämförelse kort — KmH

KmH använder årsbundna pathar (`/ar/2026/konstnarer/…`) som canonical arkiv.  
G1 använder galleriets egna listor + `/utstallningar/arkiv/{year}` — samma idé (stabil path per innehållsmängd), annan produktform.

## Checklista vid ny listsida

1. Egen route om innehållet ska kunna bokmärkas/indexeras
2. `Seo` med title + description (+ image om rimligt)
3. Lita på pathname-canonical; lägg inte filter i indexerbara URL:er
4. Länka internt till den canonical pathen (inte till query-varianter)

## Status / luckor (2026-08-13)

- [x] `/konstnarer` — `Seo` tillagd
- [x] Utställningslistor via `ExhibitionIndex` + `seo` i load
- [x] `/nyheter`, `/sponsorer`, utställnings-/nyhetsdetalj (delvis)
- [x] `/konstnarer/[slug]` — `Seo` tillagd (feat/work-detail-page)
- [x] `/konstnarer/[slug]/verk/[workSlug]` — se `docs/verk-sida.md`
- [ ] Startsida `/` — bara layout-titel; överväg egen `Seo`
