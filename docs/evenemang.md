# Evenemang — GALLERIett (G1)

Utkast 2026-08-13.

Strategisk och UX-skiss. **Inte implementerad ännu.** Förutsätter bl.a. alkoholtillstånd och ett konkret erbjudande (mat/dryck + konst).

## Två profiler i samma hus

GALLERIett har **två jobb**. De ska synas som två rytmer — inte blandas till en grå mitt.

| | **Galleri (kärna)** | **Evenemang (tillägg)** |
|---|---|---|
| Drar | Konst, konstnär, sal | Kväll, sällskap, mat/dryck, upplevelse |
| Hero | Verk / utställning / sal | Stämning, datum, “kom” |
| Primär CTA | Se verk, öppettider, maila intresse | **Boka** |
| Referens | Magnus-modell, er nuvarande utställnings-/konstnärsstruktur | Mer upplevelse-/paket-ton (t.ex. Pater Noster evenemang) — *medvetet*, på egen yta |

**Regel:** Utställnings- och konstnärssidor förblir **konst först**. Evenemangssidor får vara **event först**, med konst som inslag.

## IA

Föredragen yta:

```text
/evenemang              → lista (aktuella / kommande)
/evenemang/{slug}       → detalj (boka + läs mer)
```

Alternativ i v1: tydlig **sektion** på startsidan eller under Kontakt/Om — men egen route är renare för SEO, delning och “Boka”.

**Länka från, blanda inte in i:**

| Yta | Roll |
|---|---|
| `/utstallningar/...` | Kvar som konstkatalog; ev. diskret “Relaterat evenemang” om pub-kväll hör till pågående utställning |
| `/konstnarer/...` | Oförändrad rytm; ingen Boka-biljett som primär CTA |
| Start / Aktuellt | Kan visa evenemangskort *bredvid* utställning — annan badge/CTA så skillnaden syns |
| Nav | Egen punkt **Evenemang** när erbjudandet är skarpt (annars riskerar tom sida) |

## Rytm på `/evenemang` (annan än utställning)

Utställning idag (behåll): Press → Verk → Installation → Utställande konstnärer → pager.

Evenemang (förslag — upplevelse-rytm):

1. **Hero** — stämning / kväll / bord (inte nödvändigtvis verkgrid). Datum + kort pitch. CTA **Boka**.
2. **Erbjudandet** — vad ingår (t.ex. välkomstdryck, tilltugg, visning, konstnärssamtal). Praktiskt: tid, pris, antal platser, ålder.
3. **Konst som inslag** — “Under pågående utställning *Ljus Färg Form*” + länk till utställningssidan / utvalda verk (inte full katalog här).
4. **Program / detaljer** — schema för kvällen.
5. **Boka** (igen) — formulär, mailto eller biljettlänk.
6. **Fler evenemang** — rad/kort med ‹ › om många, annars enkel lista.

**Låna gärna:** Boka + Läs mer, bläddringspilar vid flera kort ([Pater Noster evenemang](https://www.paternoster.se/evenemang) som mönsterreferens).  
**Kopiera inte:** full-bleed plats-hero utan meta *på utställningssidor*; konstnärsbiografi utan verkarkiv som ersättning för galleristrukturen.

## Datamodell (skiss)

Håll `event` **skilt** från `exhibition` (eller exhibition + flagga — hellre egen typ):

| Fält | Exempel |
|---|---|
| `slug`, `title`, `date` / `datesLabel` | `vernissage-pub-aug`, “Vernissage + pub” |
| `kind` | `vernissage`, `samtal`, `pub`, … |
| `price`, `capacity`, `bookingUrl` / `bookingMailto` | |
| `exhibitionSlug` (valfritt) | koppling till pågående utställning |
| `artistSlugs` (valfritt) | om samtal med namngivna konstnärer |
| `image`, `body` | |

Se även `docs/datamodell-g1-kmh.md` när detta spikas i data.

## CTA och varumärke

- **Boka** på evenemang = primär (kan vara mörk/ghost eller lime `.btn` — avgör så den inte konkurrerar med “Maila om intresse” på verk).
- **Inte** “Boka” på varje `ExhibitionCard` i Aktuellt innan ni faktiskt tar betalt för besök.
- Lime förblir **exklusiv accent** (se `docs/ui-brand.md`) — evenemang ska inte bli en lime-kampanjsite.

## Tjörn / destination

Bokningsbara evenemang med datum + CTA är lättare att tipsa till Visit Tjörn / Västsverige (“Island of Art”) än enbart “öppet galleri”. Det är ett *externt* spår; på sajten hålls evenemang och galleri isär som ovan.

## Check innan bygge

- [ ] Erbjudande + pris + kapacitet klart  
- [ ] Alkoholtillstånd / regler speglas i copy  
- [ ] Egen route eller tydlig sektion (inte ihopblandad utställningsmall)  
- [ ] Länk till eventuell pågående utställning (“konst som inslag”)  
- [ ] Primär CTA = Boka; utställnings-/verkssidor orörda i rytm  

## Relaterat

- `docs/ui-brand.md` — kort, hover, lime  
- `docs/verk-sida.md` — konst först på verk  
- `docs/seo-policy.md` — egen URL per evenemang när det indexeras  
