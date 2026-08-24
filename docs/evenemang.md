# Evenemang — GALLERIett (G1)

Utkast 2026-08-23 (uppdaterad).

Strategisk och UX-skiss. **Platshållare i nav** (`/evenemang`, samma mönster som `/video`). Full lista/detalj byggs när mästeri + alkoholtillstånd och konkreta datum finns.

## Status nu

| | |
|---|---|
| Nav | **Evenemang** synlig → `/evenemang` |
| Sida | Platshållare (“innehåll kommer snart”) |
| Data / kort / Boka | Inte byggt ännu |

## Erbjudande (målbild)

Mästeri med alkoholtillstånd. Typiska evenemang:

| Typ | Exempel |
|---|---|
| Vernissage | Öppning / konstnärssamtal (datum + kom) |
| Pub | Pubkväll i salen / mästeri |
| Sip & paint | Bokningsbar workshop |

**Inte** en tredje nyhetskategori. Fortfarande: Nyheter = Från GALLERIett / I pressen.

## Två profiler i samma hus

GALLERIett har **två jobb**. De ska synas som två rytmer — inte blandas till en grå mitt.

| | **Galleri (kärna)** | **Evenemang (tillägg)** |
|---|---|---|
| Drar | Konst, konstnär, sal | Kväll, sällskap, mat/dryck, upplevelse |
| Hero | Verk / utställning / sal | Stämning, datum, “kom” |
| Primär CTA | Se verk, öppettider, maila intresse | **Boka** (när biljett/plats) |
| Referens | Nuvarande utställnings-/konstnärsstruktur | Upplevelse-rytm på *egen* yta |

**Regel:** Utställnings- och konstnärssidor förblir **konst först**. Evenemangssidor får vara **event först**, med konst som inslag.

## G1 vs rönnang.se

[ronnang.se/aktiviteter](https://ronnang.se/aktiviteter/) = *allt som händer i bygden* (utställningar, familjefest, föreningar). Där är det rätt att GALLERIett-shower syns som aktiviteter.

| | **rönnang.se** | **galleriett (G1)** |
|---|---|---|
| Jobb | Destination / community | Galleri + mästeri |
| Utställning | Kan ligga som aktivitetskort | Stannar under **Utställningar** |
| Evenemang | Lokal kalender | Vernissage-kväll, pub, sip & paint |
| CTA | Läs mer | Boka (+ ev. Läs mer) |

**Låna:** datumbadge, kort (bild · titel · tid · excerpt), filter efter typ.  
**Kopiera inte:** utställning = aktivitetskort; platsportal-ton; föreningsfilter.

Vernissage: kort under **Evenemang** *och* diskret länk från utställningssidan — inte dubbel katalog.

**Namn:** Meny = **Evenemang** (skarpare “kom den kvällen / boka”). “Aktiviteter” funkar lokalt på Rönnäng; på G1 undvik samma etikett för hela utställningsprogrammet.

## IA

```text
/evenemang              → platshållare nu; senare lista (kommande)
/evenemang/{slug}       → detalj (boka + läs mer)
```

**Länka från, blanda inte in i:**

| Yta | Roll |
|---|---|
| `/utstallningar/...` | Konstkatalog; ev. diskret “Vernissage 12 sep →” |
| `/konstnarer/...` | Oförändrad rytm; ingen Boka som primär CTA |
| Start / Aktuellt | Ev. evenemangskort *bredvid* utställning — annan badge/CTA |
| Nav | **Evenemang** (platshållare tills innehåll finns) |
| `/nyheter` | Inte EVENT-kategori |

## Rytm på `/evenemang` (när innehåll finns)

1. **Hero** — stämning / kväll. Datum + kort pitch. CTA **Boka**.
2. **Erbjudandet** — vad ingår, tid, pris, platser.
3. **Konst som inslag** — länk till pågående utställning (inte full verkatalog här).
4. **Program / detaljer**
5. **Boka** (igen)
6. **Fler evenemang** — lista/kort

**Låna gärna:** Boka + Läs mer; datum först ([ronnang.se](https://ronnang.se/aktiviteter/), [Pater Noster evenemang](https://www.paternoster.se/evenemang)).  
**Kopiera inte:** full-bleed plats-hero *på utställningssidor*; Rönnängs modell där show = aktivitet.

Lista i v1 räcker; full månadskalender först vid tät frekvens.

## Datamodell (skiss)

Håll G1-evenemang **skilt** från `exhibition` och från KmH `event` (årsedition).

| | |
|---|---|
| Sanity `name` | **`galleryEvent`** (kolliderar inte med KmH `event`) |
| Studio-titel | Evenemang |
| Webb | `/evenemang`, `/evenemang/{slug}` |

| Fält | Exempel |
|---|---|
| `slug`, `title`, `date` / `datesLabel` | `vernissage-pub-aug`, “Vernissage + pub” |
| `kind` | `vernissage`, `pub`, `sip-paint`, `samtal`, … |
| `price`, `capacity`, `bookingUrl` / `bookingMailto` | |
| `exhibition` (valfritt) | ref till utställning |
| `artists[]` (valfritt) | |
| `image`, `body` | |

Se `docs/datamodell-g1-kmh.md` + diagram `docs/datamodell.png`.

## CTA och varumärke

- **Boka** på evenemang = primär när ni tar betalt / begränsar platser.
- **Inte** “Boka” på varje `ExhibitionCard` i Aktuellt innan dess.
- Lime förblir **exklusiv accent** (`docs/ui-brand.md`) — evenemang ska inte bli lime-kampanjsite.

## Check innan fullt bygge

- [x] Nav + platshållarsida (`/evenemang`)
- [ ] Erbjudande + pris + kapacitet klart  
- [ ] Alkoholtillstånd / regler speglas i copy  
- [ ] Lista + detalj (inte utställningsmall)  
- [ ] Länk till eventuell pågående utställning  
- [ ] Primär CTA = Boka; utställnings-/verkssidor orörda i rytm  

## Relaterat

- `docs/ui-brand.md` — kort, hover, lime  
- `docs/backlog-sprint.md` — plats / sprint  
- `docs/verk-sida.md` — konst först på verk  
- `docs/seo-policy.md` — egen URL per evenemang när det indexeras  
- Extern lokal kalender: https://ronnang.se/aktiviteter/  
