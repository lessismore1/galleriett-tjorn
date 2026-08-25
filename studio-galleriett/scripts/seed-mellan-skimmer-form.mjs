/**
 * Seed Mellan skimmer & form 2025 från @galleriett
 * https://www.instagram.com/p/DMLaiXpqfQ2/
 *
 * Konstnärer: Cecilia Månfagre (18, från KmH), Merja Karlsson (19), Maria Dutton (20).
 * Kör först: node scripts/seed-artist-from-kmh.mjs --kmh=cecilia-manfagre --id=18
 *
 *   node scripts/seed-mellan-skimmer-form.mjs
 */
import {createClient} from '@sanity/client'
import {readFileSync, existsSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const studioRoot = resolve(__dirname, '..')

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

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

loadEnv()

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '81lb9elz',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

if (!process.env.SANITY_API_TOKEN) {
  console.error('Saknar SANITY_API_TOKEN')
  process.exit(1)
}

const IG_POST = 'https://www.instagram.com/p/DMLaiXpqfQ2/'

const ARTISTS = [
  {idNumber: 18, name: 'Cecilia Månfagre'},
  {idNumber: 19, name: 'Merja Karlsson'},
  {idNumber: 20, name: 'Maria Dutton'},
]

async function ogImage(url) {
  const res = await fetch(url, {
    headers: {'User-Agent': 'Mozilla/5.0 (compatible; GALLERIettSeed/1.0)'},
  })
  const html = await res.text()
  const m = html.match(/property="og:image" content="([^"]+)"/)
  return m ? m[1].replace(/&amp;/g, '&') : null
}

async function uploadFromUrl(url, filename) {
  const res = await fetch(url, {
    headers: {'User-Agent': 'Mozilla/5.0 (compatible; GALLERIettSeed/1.0)'},
  })
  if (!res.ok) throw new Error(`Bild ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buf, {filename})
  return {asset: {_type: 'reference', _ref: asset._id}}
}

async function ensureArtist({idNumber, name}) {
  const existing = await client.fetch(
    `*[_type=="artist" && idNumber==$n][0]{ _id, name, "slug": slug.current }`,
    {n: idNumber}
  )
  if (existing?._id) {
    console.log('· artist finns', existing.slug, '—', existing.name)
    return existing._id
  }

  const slug = `${String(idNumber).padStart(2, '0')}-${slugify(name)}`
  const id = `artist.${slug}`
  await client.createOrReplace({
    _id: id,
    _type: 'artist',
    idNumber,
    name,
    slug: {_type: 'slug', current: slug},
    intro: `Utställare under Mellan skimmer & form (2025) på GALLERIett.`,
  })
  console.log('✓ artist stub', slug)
  return id
}

async function main() {
  const artistRefs = []
  for (const a of ARTISTS) {
    const ref = await ensureArtist(a)
    artistRefs.push({
      _type: 'reference',
      _ref: ref,
      _key: slugify(a.name),
    })
  }

  const og = await ogImage(IG_POST)
  const image = og ? await uploadFromUrl(og, 'mellan-skimmer-form-2025-ig.jpg') : undefined

  const idNumber = 95
  const slug = '95-mellan-skimmer-form'
  const exhibitionId = `exhibition.${slug}`

  await client.createOrReplace({
    _id: exhibitionId,
    _type: 'exhibition',
    idNumber,
    title: 'Mellan skimmer & form',
    slug: {_type: 'slug', current: slug},
    artists: artistRefs,
    artistLabel: 'Cecilia Månfagre · Merja Karlsson · Maria Dutton',
    start: '2025-07-19',
    end: '2025-07-25',
    datesLabel: '19 – 25 JUL 2025',
    intro:
      'Grupputställning med Cecilia Månfagre, Merja Karlsson och Maria Dutton. Vernissage lördag 19 juli. Öppet 19–25 juli.',
    pressRelease: `Mellan skimmer & form
19–25 juli 2025 på GALLERIett.

Av: Cecilia Månfagre, Merja Karlsson och Maria Dutton.

Vernissage lördag 19 juli. Välkommen!

Källa (@galleriett): ${IG_POST}`,
    image,
    location: {_type: 'reference', _ref: 'location.galleriett'},
    facebookEventUrl: IG_POST,
  })
  console.log('✓ exhibition', slug)

  await client.createOrReplace({
    _id: 'galleryEvent.vernissage-mellan-skimmer-form-2025',
    _type: 'galleryEvent',
    title: 'Vernissage — Mellan skimmer & form',
    slug: {_type: 'slug', current: 'vernissage-mellan-skimmer-form-2025'},
    kind: 'vernissage',
    date: '2025-07-19T12:00:00',
    datesLabel: 'Lördag 19 juli 2025',
    body: `Vernissage för utställningen Mellan skimmer & form med Cecilia Månfagre, Merja Karlsson och Maria Dutton.

Källa (@galleriett): ${IG_POST}`,
    exhibition: {_type: 'reference', _ref: exhibitionId},
    artists: artistRefs,
    location: {_type: 'reference', _ref: 'location.galleriett'},
    image,
    bookingUrl: IG_POST,
  })
  console.log('✓ event vernissage-mellan-skimmer-form-2025')

  console.log('\nKlart:', `https://galleriett-tjorn.pages.dev/utstallningar/${slug}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
