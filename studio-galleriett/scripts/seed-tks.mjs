/**
 * Seed utställningar + evenemang från TKS HTTrack-dump (tjornskonst.se).
 *
 *   cd studio-galleriett
 *   node scripts/seed-tks.mjs
 *   node scripts/seed-tks.mjs --dry-run
 *
 * Kräver SANITY_API_TOKEN. Default dataset: production.
 * Hoppar över 101 Ljus Färg Form (finns redan). Skapar stub-konstnärer från 13→.
 */
import {createClient} from '@sanity/client'
import {readFileSync, existsSync, readdirSync, statSync} from 'node:fs'
import {dirname, resolve, basename, extname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const studioRoot = resolve(__dirname, '..')
const MEDIA_DIR = resolve(
  'C:/projects/tks/TKS_website/impro.usercontent.one/appid/oneComWsb/domain/tjornkonst.se/media/tjornkonst.se/onewebmedia'
)

function loadEnv() {
  const envPath = resolve(studioRoot, '.env')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const i = trimmed.indexOf('=')
    if (i === -1) continue
    const key = trimmed.slice(0, i).trim()
    let val = trimmed.slice(i + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnv()

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '81lb9elz'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
const dryRun = process.argv.includes('--dry-run')

if (!token) {
  console.error('Saknar SANITY_API_TOKEN i .env')
  process.exit(1)
}
if (!existsSync(MEDIA_DIR)) {
  console.error('Hittar inte TKS media:', MEDIA_DIR)
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
})

const LOCATION_ID = 'location.galleriett'
const assetCache = new Map()

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function bestMedia(predicate) {
  const files = readdirSync(MEDIA_DIR)
    .filter((f) => predicate(f))
    .map((f) => ({f, size: statSync(join(MEDIA_DIR, f)).size}))
    .sort((a, b) => b.size - a.size)
  if (!files.length) return null
  return join(MEDIA_DIR, files[0].f)
}

async function uploadFile(absPath) {
  if (!absPath) return undefined
  if (assetCache.has(absPath)) return assetCache.get(absPath)
  if (!existsSync(absPath)) {
    console.warn('  saknar fil:', absPath)
    return undefined
  }
  if (dryRun) {
    const stub = {asset: {_type: 'reference', _ref: `dryrun.${basename(absPath)}`}}
    assetCache.set(absPath, stub)
    return stub
  }
  const buffer = readFileSync(absPath)
  const filename = basename(absPath)
  const ext = extname(filename).toLowerCase()
  const contentType =
    ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  const asset = await client.assets.upload('image', buffer, {filename, contentType})
  const ref = {asset: {_type: 'reference', _ref: asset._id}}
  assetCache.set(absPath, ref)
  return ref
}

/** Stub-konstnärer (id 13→). Grupp-stub för medlemsutställningar. */
const ARTISTS = [
  {
    idNumber: 13,
    name: 'Liselotte Holmgren-Gadd',
    specialty: 'Måleri',
    intro: 'TKS-medlem. Separatutställning Cheeky Points på GALLERIett.',
  },
  {
    idNumber: 14,
    name: 'Ann-Louise Schwieger',
    specialty: 'Måleri · Grafik',
    intro: 'TKS-medlem. Separatutställning Sprakande färger på GALLERIett.',
    photoPred: (f) => /schwieger.?foto/i.test(f),
  },
  {
    idNumber: 15,
    name: 'TKS-medlemmar',
    specialty: 'Medlemsutställning',
    intro:
      'Grupputställning med medlemmar i Tjörns Konstnärsförening (TKS) på GALLERIett.',
  },
]

/**
 * Utställningar från TKS-affischer.
 * 101 = Ljus Färg Form (redan i production) — hoppas över.
 */
const EXHIBITIONS = [
  {
    idNumber: 102,
    title: 'Höstrusk',
    artistNames: ['TKS-medlemmar'],
    artistLabel: 'TKS medlemsutställning',
    start: '2025-10-23',
    end: '2025-11-02',
    datesLabel: '23 OKT – 2 NOV 2025',
    intro:
      'TKS medlemsutställning på GALLERIett. Vernissage 25 oktober kl. 12–17.',
    posterPred: (f) => /h.?strusk/i.test(f),
  },
  {
    idNumber: 103,
    title: 'Advent',
    artistNames: ['TKS-medlemmar'],
    artistLabel: 'Utställning och marknadstorg',
    start: '2025-11-29',
    end: '2025-12-21',
    datesLabel: 'Adventshelgerna 2025',
    intro:
      'Utställning och marknadstorg på GALLERIett under adventshelgerna (lör–sön 12–17).',
    posterPred: (f) => /^Affisch 6/i.test(f),
  },
  {
    idNumber: 104,
    title: 'Det ljusnar',
    artistNames: ['TKS-medlemmar'],
    artistLabel: 'TKS medlemsutställning',
    start: '2026-02-21',
    end: '2026-03-08',
    datesLabel: '21 FEB – 8 MAR 2026',
    intro:
      'TKS medlemsutställning. Vernissage lördag 21 februari kl. 12–17 (årsmöte kl. 17).',
    posterPred: (f) => /det.?ljusnar/i.test(f),
  },
  {
    idNumber: 105,
    title: 'Cheeky Points',
    artistNames: ['Liselotte Holmgren-Gadd'],
    artistLabel: 'Liselotte Holmgren-Gadd',
    start: '2026-03-15',
    end: '2026-03-29',
    datesLabel: '15 – 29 MAR 2026',
    intro: 'Separatutställning. Vernissage 14 mars kl. 11.',
    posterPred: (f) => /liselotte/i.test(f),
  },
  {
    idNumber: 106,
    title: 'Sprakande färger',
    artistNames: ['Ann-Louise Schwieger'],
    artistLabel: 'Ann-Louise Schwieger',
    start: '2026-04-02',
    end: '2026-04-05',
    datesLabel: '2 – 5 APR 2026 (påsk)',
    intro: 'Separatutställning under påsken. Öppet kl. 11–16.',
    posterPred: (f) => /schwieger.*sprak|sprakende/i.test(f),
  },
  {
    idNumber: 107,
    title: 'Konst med Horisont 2026',
    artistNames: ['TKS-medlemmar'],
    artistLabel: 'TKS · Konst med Horisont',
    start: '2026-05-14',
    end: '2026-05-17',
    datesLabel: '14 – 17 MAJ 2026',
    intro:
      'GALLERIett är en av platserna under Konst med Horisont 2026. Se konstnärer och mer information på konstmedhorisont.se.',
    pressRelease:
      'Konst med Horisont är TKS årliga konstvandring. GALLERIett visar ett urval TKS-medlemmar — fullständig plats- och konstnärslista finns på https://konstmedhorisont.se/ar/2026/platser/galleriett',
    posterPred: (f) => /konst med horisont 2026 - affisch/i.test(f) && !/A4/i.test(f),
  },
  {
    idNumber: 108,
    title: 'Kustkonst — Sommar hos GALLERIett',
    artistNames: ['TKS-medlemmar'],
    artistLabel: 'TKS / Kustkonst',
    start: '2026-06-27',
    end: '2026-07-12',
    datesLabel: '27 JUN – 12 JUL 2026',
    intro:
      'Sommarutställning på GALLERIett. Vernissage lördag 27 juni kl. 12–17. Öppet tis–sön 12–17.',
    posterPred: (f) => /Sommarutst/i.test(f),
  },
]

const EVENTS = [
  {
    title: 'Zipp & Paint',
    slug: 'zipp-paint-2026',
    kind: 'sip-paint',
    date: '2026-03-10T18:00:00',
    datesLabel: 'Mars–juni 2026 · kl. 18–21',
    price: '500 kr/person (material ingår)',
    bookingMailto: 'tjorn@tjornkonst.se',
    body: `GALLERIett arrangerar korta workshops Zipp & Paint:

• 10 mars — Teckning (Niklas Gadd)
• 24 mars — Akryl (Liselotte Holmgren-Gadd)
• 14 april — Teckning (Niklas Gadd)
• 15 april — Akryl (Liselotte Holmgren-Gadd)
• 27 maj — Akvarell (Christina Måneskiöld)
• 9 juni — Enkel grafik (Christina Måneskiöld)
• 30 juni — Akvarell (Christina Måneskiöld)

Tid: 18:00–21:00. Pris: 500 kr/person inkl. material.
Anmälan: tjorn@tjornkonst.se eller 070-608 59 34.
Swish: 123 317 81 34.`,
    posterPred: (f) => /Zipp/i.test(f),
  },
  {
    title: 'Kurser juni 2026',
    slug: 'kurser-juni-2026',
    kind: 'other',
    date: '2026-06-05T10:00:00',
    datesLabel: 'Juni 2026',
    bookingMailto: 'tjorn@tjornkonst.se',
    body: `GALLERIett arrangerar:

• 5–7 juni — Akvarellkurs med Maria Arrhenius och Christina Måneskiöld
• Juni — Passepartouts och ramar (informationsdag)
• Juli — Upphovsrätt och fotografering (informationsdag)

Tider och kostnader publiceras under våren. Anmälan: tjorn@tjornkonst.se`,
    posterPred: (f) => /Kurser juni/i.test(f),
  },
]

async function main() {
  console.log(`dataset=${dataset} dryRun=${dryRun}`)
  console.log('media:', MEDIA_DIR)

  const artistIdByName = new Map()

  for (const a of ARTISTS) {
    const slug = `${String(a.idNumber).padStart(2, '0')}-${slugify(a.name)}`
    const id = `artist.${slug}`
    artistIdByName.set(a.name, id)
    const image = a.photoPred ? await uploadFile(bestMedia(a.photoPred)) : undefined
    const doc = {
      _id: id,
      _type: 'artist',
      idNumber: a.idNumber,
      name: a.name,
      slug: {_type: 'slug', current: slug},
      specialty: a.specialty,
      intro: a.intro,
      image,
    }
    console.log(dryRun ? `○ artist ${slug}` : `✓ artist ${slug}`)
    if (!dryRun) await client.createOrReplace(doc)
  }

  for (const ex of EXHIBITIONS) {
    const slug = `${ex.idNumber}-${slugify(ex.title)}`
    const id = `exhibition.${slug}`
    const poster = await uploadFile(bestMedia(ex.posterPred))
    const artistRefs = ex.artistNames.map((name) => {
      const ref = artistIdByName.get(name)
      if (!ref) throw new Error(`Saknar artist stub: ${name}`)
      return {_type: 'reference', _ref: ref, _key: slugify(name)}
    })
    const doc = {
      _id: id,
      _type: 'exhibition',
      idNumber: ex.idNumber,
      title: ex.title,
      slug: {_type: 'slug', current: slug},
      artists: artistRefs,
      artistLabel: ex.artistLabel,
      start: ex.start,
      end: ex.end,
      datesLabel: ex.datesLabel,
      intro: ex.intro,
      pressRelease: ex.pressRelease || undefined,
      image: poster,
      location: {_type: 'reference', _ref: LOCATION_ID},
    }
    console.log(dryRun ? `○ exhibition ${slug}` : `✓ exhibition ${slug}`)
    if (!dryRun) await client.createOrReplace(doc)
  }

  for (const ev of EVENTS) {
    const id = `galleryEvent.${ev.slug}`
    const image = await uploadFile(bestMedia(ev.posterPred))
    const doc = {
      _id: id,
      _type: 'galleryEvent',
      title: ev.title,
      slug: {_type: 'slug', current: ev.slug},
      kind: ev.kind,
      date: ev.date,
      datesLabel: ev.datesLabel,
      price: ev.price || undefined,
      bookingMailto: ev.bookingMailto || undefined,
      body: ev.body,
      image,
      location: {_type: 'reference', _ref: LOCATION_ID},
    }
    console.log(dryRun ? `○ event ${ev.slug}` : `✓ event ${ev.slug}`)
    if (!dryRun) await client.createOrReplace(doc)
  }

  console.log(dryRun ? '\n(--dry-run) Inget skrivet.' : '\n✓ TKS-seed klar')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
