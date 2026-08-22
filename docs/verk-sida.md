# Verkssida — GALLERIett (G1)

Utkast 2026-08-13. Branch: `feat/work-detail-page`.

Bygger på datamodell (`artist` äger `work`, `exhibition` hänger `work`) och SEO-policy.

## Mål

När besökaren är **på ett verk** ska hen kunna:

1. Se **metadata** tydligt (titel, år, teknik, mått, …)
2. **Dela** (Facebook, kopiera länk, mail)
3. **Maila om intresse** (primär CTA)

Referenser:

- [Magnus Karlsson — verkssida](https://www.gallerimagnuskarlsson.com/artists/54-thomas-broome/works/7327-thomas-broome-the-devils-trumpet-2025/) — djup hierarki, stark SEO
- [Linda Ljungblad — galleri](https://lindaljungblad.se/#Section3) — lång one-pager; SÅLD syns men skymmer ofta det som säljs

**Dom:** Magnus-modell för G1 (egen URL per verk), inte Lindas enda långa sida.

---

## Route & slug (låst)

**Canonical per verk — under konstnären:**

```text
/konstnarer/{artistSlug}/verk/{id}-{titel-slug}-{år}
```

Exempel:

```text
/konstnarer/10-kattis-palmnas/verk/1032-portratt-med-jordgubbar-2026
```

| Del | Regel |
|---|---|
| **id** | Löpnummer från **1001** (galleriets verkserie) |
| **titel-slug** | slugify av titel |
| **år** | verkets år |
| **Konstnär i path** | ja (`/konstnarer/{artistSlug}/…`) — upprepas **inte** i verk-sluggen |

Magnus lägger konstnärsnamn i verk-sluggen eftersom deras verk-URL:er kan stå mer för sig; G1 har redan konstnären i pathen → kortare slug utan att tappa SEO.

| Ingång | Beteende |
|---|---|
| Konstnär → Verk-rutnät | Länk till verkssidan |
| Utställning → verk | Samma verkssida (match via bild → artist-work) |
| Delning / Google | Canonical = pathen ovan |

**Ingen** parallell `/utstallningar/…/verk/…`.

Se `docs/seo-policy.md`.

---

## Sidinnehåll (v1)

1. Stor bild  
2. Titel + konstnär  
3. **Story** (valfritt) — kort narrativ om verket, som hos [K. Palmnäs Art](https://kpalmnasart.se/pages/original) / Linda på utställning. Fält: `work.story`.  
4. Meta: år, teknik, mått (om satt), status  
5. Kontext: “Utställning” om verket hänger i en show  
6. CTA: `Maila om intresse`  
7. Dela: Facebook + kopiera länk + mail  
8. Bläddra: sticky verk-subnav (logo · konstnär · Verk · **Visa alla** · count) + cirkelpilar ‹ › på bilden (samma språk som konstnärskorten). På desktop syns hela verket i viewport.  

Story är **inte** obligatorisk — utan text visas bara meta. Bra för SEO/delning när den finns (används i meta description).

### Seo

- Title: `{Titel} — {Konstnär} · GALLERIett`
- Description: `{Konstnär}, {titel}, {år}. {medium}, {mått}. GALLERIett, Tjörn.`
- OG-image: verkets bild

---

## SÅLD / tillgänglighet

Fält: `availability: 'available' | 'sold' | 'not_for_sale' | 'enquire'` (mock default: `enquire`).

| Status | UI |
|---|---|
| enquire / available | Primär mail-CTA |
| sold | Etikett Såld; sekundär “Kontakta galleriet” |
| not_for_sale | Ingen sälj-CTA |

Listfilter Tillgängliga/Alla = senare.

---

## Datamodell

```text
artist ──äger──> work <──hänger── exhibition
```

Helpers i `mockData.js`: `workSlugOf`, `workHref`, `getArtistWork`, `findWorkRefByImage`, `getAllWorkEntries`.

## Publiceringsregel (viktigt)

Bild på verk kommer ofta **före** titel och år i arbetsflödet.

**Krav innan publicering:** titel **och** år måste finnas så att **slug** kan låsas:

```text
{id}-{titel-slug}-{år}
```

Utan titel/år → ingen publik verkssida, ingen delnings-URL. Bild kan ligga som utkast i Studio.

Canonical-slug byts inte i efterhand (id är stabilt; titel/år i URL är snapshot vid publicering).

---

## Branch / filer

- Branch: `feat/work-detail-page`
- Route: `web/src/routes/konstnarer/[slug]/verk/[workSlug]/`
