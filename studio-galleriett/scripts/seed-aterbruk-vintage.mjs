/**
 * Seed utställning 110 Återbruk / Vintage från Instagram
 * https://www.instagram.com/p/DcdmGmajkN-/
 * Konstnär: 14 Ann-Louise Schwieger · 29 aug – 6 sep 2026
 *
 *   node scripts/seed-aterbruk-vintage.mjs
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

const IG_POST = 'https://www.instagram.com/p/DcdmGmajkN-/'
const ARTIST_ID = 'artist.14-ann-louise-schwieger'

async function ogImageFromInstagram(url) {
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
  if (!res.ok) throw new Error(`Bildhämtning misslyckades: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buf, {filename})
  return {asset: {_type: 'reference', _ref: asset._id}}
}

async function main() {
  const artist = await client.getDocument(ARTIST_ID)
  if (!artist) {
    console.error('Saknar artist', ARTIST_ID)
    process.exit(1)
  }

  console.log('Hämtar Instagram-bild…')
  const og = await ogImageFromInstagram(IG_POST)
  const image = og ? await uploadFromUrl(og, 'aterbruk-vintage-ig.jpg') : undefined
  if (og) console.log('og:image ok')

  const workIds = await client.fetch(
    `*[_type=="artwork" && artist._ref==$aid] | order(idNumber asc){ _id }`,
    {aid: ARTIST_ID}
  )

  const idNumber = 110
  const slug = '110-aterbruk-vintage'
  const exhibitionId = `exhibition.${slug}`

  await client.createOrReplace({
    _id: exhibitionId,
    _type: 'exhibition',
    idNumber,
    title: 'Återbruk / Vintage',
    slug: {_type: 'slug', current: slug},
    artists: [{_type: 'reference', _ref: ARTIST_ID, _key: 'a14'}],
    artistLabel: artist.name || 'Ann-Louise Schwieger',
    start: '2026-08-29',
    end: '2026-09-06',
    datesLabel: '29 AUG – 6 SEP 2026',
    intro:
      'Separatutställning med Ann-Louise Schwieger. Vernissage lördag 29 augusti kl. 12. Öppet alla dagar kl. 12–16.',
    pressRelease: `Återbruk / Vintage — Ann-Louise Schwieger

Vernissage lördag 29 augusti kl. 12.00, välkommen!
Öppet alla dagar kl. 12–16 under perioden 29 augusti – 6 september 2026.

Källa: ${IG_POST}
@galleriett.tjorn`,
    image,
    works: (workIds || []).map((w, i) => ({
      _type: 'reference',
      _ref: w._id,
      _key: `w${i}`,
    })),
    location: {_type: 'reference', _ref: 'location.galleriett'},
    facebookEventUrl: IG_POST,
  })
  console.log('✓ exhibition', slug, '· verk:', workIds.length)

  await client.createOrReplace({
    _id: 'galleryEvent.vernissage-aterbruk-vintage-2026',
    _type: 'galleryEvent',
    title: 'Vernissage — Återbruk / Vintage',
    slug: {_type: 'slug', current: 'vernissage-aterbruk-vintage-2026'},
    kind: 'vernissage',
    date: '2026-08-29T12:00:00',
    datesLabel: 'Lördag 29 augusti kl. 12',
    body: `Vernissage för Ann-Louise Schwiegers utställning Återbruk / Vintage.\n\n${IG_POST}`,
    exhibition: {_type: 'reference', _ref: exhibitionId},
    artists: [{_type: 'reference', _ref: ARTIST_ID, _key: 'a14'}],
    location: {_type: 'reference', _ref: 'location.galleriett'},
    image,
    bookingUrl: IG_POST,
  })
  console.log('✓ event vernissage-aterbruk-vintage-2026')
  console.log('\nKlart:', `https://galleriett-tjorn.pages.dev/utstallningar/${slug}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
