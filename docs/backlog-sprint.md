# Backlog — framtida sprintar (G1)

Utkast 2026-08-23.

Filtrerat mot strategi: **lokalt Västsverige först**, Sverige därefter; mer professionell än andra lokala aktörer; **inte** tävla mot globala gallerijättar ännu. EN finns i mock för senare expansion.

## Ram

| Gör | Gör inte (nu) |
|---|---|
| Stärker “kom till Tjörn / Bohuslän” | Viewing rooms, 3D, tung e-handel |
| Tydligare galleri än lokala konkurrenter | Magasin/podcasts à la Hauser & Wirth |
| Underhållbart (statisk sajt + mock/CMS senare) | Global sök, avancerade filterhubbar |
| Innehåll och platsfoto | Features “för att de stora har dem” |

## Plats / kust — varumärkeslåsning

Tre lager som inte ska blandas:

| Lager | Jobb | Referens |
|---|---|---|
| **GALLERIett (kärna)** | Konst, sal, inquire, program | Nuvarande G1 / Magnus-rytm |
| **Plats (underton)** | Tjörn, västkust, “värt resan” | Ton från [KmH](https://konstmedhorisont.se/ar/2026), ljus/färg — inte symboler |
| **Upplevelse (senare)** | Evenemang, boka | Nav-platshållare `/evenemang` finns; full lista när mästeri/datum finns — se `docs/evenemang.md` |

**Tumregel:** Ta bort loggan → får det inte läsa *hotell/ö*. Ta bort platsraden → får det inte kännas som *vilket galleri som helst i Stockholm*.

**Hur plats får synas**

| Gör | Gör inte |
|---|---|
| Riktiga foto: sal, ljus, kustmiljö | Vågor, ankare, “Island of Art”-kampanj överallt |
| En mening om Tjörn/Bohuslän *kopplad till salen* | Kust-hero som konkurrerar med utställningsbild |
| Ev. mer “luft/havsgrått” i muted — samma palette | Ny blå tema-färg; Pater Noster-CTA på konstsidor |
| **KmH** bär horisont/orange; **G1** behåller lime + galleri | Samma uttryck på båda sajterna |

**Sidroller (var platsen får mer yta)**

| Sida | Platsens roll |
|---|---|
| Start / utställning / konstnär / verk | **Konst först.** Plats = diskret (Tjörn under logo, en rad copy, ev. foto i Om-länk) |
| **`/om`** | **Här får platsen mer.** Verk och utställningar är underordnade; berättelsen är *vem vi är + var vi är*. Sal, kustljus, väg, öppettider, samarbeten — utan att bli destinationshotsajt |

Se även `docs/ui-brand.md` → Platsidentitet.

## Sprintförslag (efter nuvarande UI-låsningar)

### A — Plats & destination (hög lokal ROI)

**Om-sidan (`/om`) — primär platsyta**

- [ ] Hero/bild: sal och/eller kustljus (riktigt foto), inte stock-våg
- [ ] Copy: galleriets uppdrag + *varför Tjörn* (ljus, västkust, sal) — mer än adressblock
- [ ] Praktiskt synligt: adress, öppet, karta/väg, kontakt (mobilvänligt)
- [ ] Partners (tjornkonst, KmH, …) som samarbete — inte Visit-banner

**Övriga sidor (underton)**

- [ ] Behåll “Tjörn” under logo; eventuell en mening på start/Om-länk
- [ ] Diskret partnerlänk där det passar — utan destinationskampanjton

### B — Evenemang / mästeri (när erbjudande + tillstånd finns)

- [x] Nav **Evenemang** + platshållare `/evenemang` (som Video)
- [ ] Lista kommande (vernissage, pub, sip & paint) — inte utställningar som aktivitetskort
- [ ] Detaljsida med Boka; diskret länk från utställning vid vernissage
- [ ] Gräns mot [ronnang.se/aktiviteter](https://ronnang.se/aktiviteter/): där community; här galleri/mästeri — se `docs/evenemang.md`

### C — Rörligt innehåll (när material finns)

- [ ] Korta konstnärs- eller utställningsklipp under **Video** / på utställning
- [ ] Samma film kan återanvändas i nyhet “Från GALLERIett”

### D — Konvertering (lätt, galleriton)

- [x] Behåll **mailto**-inquire; skärp copy på verk (“Intresserad… pris/tillgänglighet på förfrågan”) — inte e-handel
- [ ] Ev. kort formulär senare om mailto inte räcker
- [ ] Ingen prislista/e-handel förrän process och lager är klart

### E — Flerspråk (senare)

- [ ] **EN** synlig men inte aktiv tills innehåll finns (nuvarande: disabled / “Coming”)
- [ ] Full översättning när det finns efterfrågan utanför SV (expansion, inte MVP)

### F — Bildpresentation (valfritt, lågt prioritet)

- [x] Verk: finjustera bilddominans / meta-täthet *utan* ny “viewing room”-modell (desktop contain finns redan; meta = kompakt stack)
- [ ] Enkel lightbox/zoom på verk *om* besökare efterfrågar det — inte för att matcha Gagosian
- [ ] Undvik tunga animationer “för liv”

### G — Redaktionellt djup (långsikt)

- [ ] Fler “Från GALLERIett”-artiklar kring aktuella shower
- [ ] “I pressen” med stabila externa länkar (lokal/regional press)
- [ ] `/nyheter`: ev. lätt featured (1 huvud + övriga) när innehållet bär — inte fullt magasin

### H — v2-polish (från extern review 2026-08, filtrerat)

**Fas (låst efter uppföljningsreview):** Sluta lägga till sidtyper/features. Finputsa premium-känsla.

**Gjort:** inquire-copy ✅; nästa konstnär (bild+namn+verk) ✅; verk-meta kompakt ✅.  
**Inte gjort (ChatGPT överdriver):** featured nyhet på `/nyheter` — fortfarande backlog, flat `NewsCard`-grid idag.

**Nästa polish (smått, löpande):**

- [ ] **CTA-hierarki på verk** — inquire-block redan finns; ev. lite mer visuell tyngd (spacing/storlek), inte ny modell
- [ ] **Nästa konstnär** — redan rikare; ev. större bild / mer “magasin-slut” senare (inte krav nu)
- [ ] **Micro-typografi** — mellanrum, labels, metadata, sektionsslut
- [ ] **Hover / övergångar** — konsekvens, sparsamt
- [ ] **Mobil** — små justeringar verk/info-kolumn
- [ ] **Konstnärsfilter** — mjukare UI när roster växer
- [ ] **Tidigare-arkiv** — kompaktare årslist vid många år
- [ ] **`/nyheter` featured** — 1 huvud + övriga när innehållet bär (inte magasin)
- [ ] **Status-skanning** — badges räcker; ingen parallell grafisk kod

### Review-filter (ChatGPT uppföljning 2026-08)

| Håller med | Korrigering |
|---|---|
| Verk nära rätt balans — **inte** mer viewing-room | Featured nyhet: **finns inte ännu** (fortfarande backlog) |
| Sidroller: konstnär / verk / nyheter | CTA-text live: *Intresserad…* + *Maila om verket* (inte bara “Maila om intresse”) |
| Sluta lägga till — finputsa | Nästa konstnär: redan bild+namn; “magasin-slut” = senare polish |
| IA + korskoppling stark | |

## Medvetet bortprioriterat

- Global sajtsök på varje sida  
- Online viewing rooms / virtuell tour  
- Shop / checkout  
- Editorial magasin, podcasts, essäarkiv  
- Jämförelse-feature-paritet med Hauser & Wirth / Gagosian / Zwirner  
- Full-bleed kust-hero på utställnings-/konstnärssidor (Pater Noster-modell på fel yta)
- Instagram-feed, tunga animationer, fler huvudmenyer “för att fylla”
- Separat meny **Verk** (verk hittas via konstnär / utställning)

## Relaterat

- `docs/ui-brand.md` — kort, hover, lime, platsidentitet  
- `docs/evenemang.md` — bokningsbar yta (egen rytm)  
- `docs/seo-policy.md` — canonical / origin  
- `docs/verk-sida.md` — verk-URL + `?show=`  
- Live Om: https://galleriett-tjorn.pages.dev/om  
- Referens ton: https://konstmedhorisont.se/ar/2026 · https://www.paternoster.se/  
