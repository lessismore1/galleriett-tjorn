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
| `/utstallningar` | `/utstallningar` | Aktuella (pågående + kommande) |
| `/utstallningar/tidigare` | → senaste år | Redirect till årsvy |
| `/utstallningar/tidigare/2025` | samma path | Tidigare per år (kortgrid) |
| `/utstallningar/pagaende` | → redirect `/utstallningar` | Legacy |
| `/utstallningar/kommande` | → redirect `/utstallningar` | Legacy |
| `/utstallningar/arkiv` | → redirect `/utstallningar/tidigare` | Legacy |
| `/utstallningar/arkiv/2025` | → redirect `/utstallningar/tidigare/2025` | Legacy |
| `/nyheter` | `/nyheter` | Filter i UI, inte i URL |

**Regel:** Har sidan en **egen route** med eget innehåll → canonical = den routen.

**Regel:** Client-side filter (Aktuellt, teknik, sök) **utan** URL-ändring → fortfarande canonical till listans rena path.

**Regel:** Om filter ligger i query (`?filter=aktuellt`) → canonical är **fortfarande** ren pathname (som `Seo` redan gör). Query är för UX (tillbaka-knapp / bokmärke), inte separat indexerad sida.

Exempel G1: `/konstnarer?filter=aktuellt` → canonical `/konstnarer`.

**Undvik:** Query som ersätter riktiga list-URL:er (t.ex. `/utstallningar?år=2025` när `/utstallningar/tidigare` finns).

## Origin / canonical vid prerender

Sätt `kit.prerender.origin` (via `PUBLIC_SITE_URL` eller default `https://galleriett-tjorn.pages.dev` i `vite.config.ts`). Annars blir canonical/OG/mailto `http://sveltekit-prerender/...`.

## Canonical — detaljsidor

| URL | Canonical |
|---|---|
| `/konstnarer/{slug}` | samma path |
| `/konstnarer/{artistSlug}/verk/{workSlug}` | samma path — **en** URL per verk; slug = `{id}-{titel}-{år}` (id från 1001) |
| `/utstallningar/{slug}` | samma path |
| `/nyheter/{slug}` | samma path |

Detalj = egen sida, egen canonical. Inga “canonical upp till listan”.

**Verk:** Canonical ligger alltid under konstnären (path utan query). Utställningssidor länkar till samma verk-URL med valfri `?show={exhibitionSlug}` för bläddringskontext — query ingår **inte** i canonical. Se `docs/verk-sida.md`.
## Title & description

- **Title:** `{Ämne} · GALLERIett` (listor) eller `{Namn/titel} · GALLERIett` (detalj)
- **Description:** 1–2 meningar, konkret (plats, teknik, år där det hjälper)
- **OG-bild:** gärna hero/listbild när den finns

## Jämförelse kort — KmH

KmH använder årsbundna pathar (`/ar/2026/konstnarer/…`) som canonical arkiv.  
G1 använder galleriets egna listor + `/utstallningar/tidigare` — samma idé (stabil path per innehållsmängd), annan produktform.

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
