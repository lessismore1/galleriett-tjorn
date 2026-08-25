/**
 * Seed Konst i Midsommartid 2025 från @galleriett
 * https://www.instagram.com/p/DKMQEPTqSSW/
 *
 *   node scripts/seed-konst-i-midsommartid.mjs
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

const IG_POST = 'https://www.instagram.com/p/DKMQEPTqSSW/'
const ARTIST_ID = 'artist.15-tks-medlemmar'

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

async function main() {
  if (!(await client.getDocument(ARTIST_ID))) {
    console.error('Saknar', ARTIST_ID)
    process.exit(1)
  }

  const og = await ogImage(IG_POST)
  const image = og ? await uploadFromUrl(og, 'konst-i-midsommartid-2025-ig.jpg') : undefined

  const idNumber = 94
  const slug = '94-konst-i-midsommartid'
  const exhibitionId = `exhibition.${slug}`

  await client.createOrReplace({
    _id: exhibitionId,
    _type: 'exhibition',
    idNumber,
    title: 'Konst i Midsommartid',
    slug: {_type: 'slug', current: slug},
    artists: [{_type: 'reference', _ref: ARTIST_ID, _key: 'tks'}],
    artistLabel: 'TKS-medlemmar',
    start: '2025-06-21',
    end: '2025-06-21',
    datesLabel: '21 JUN 2025 (midsommardagen)',
    intro:
      'Konstutställning av och med TKS-medlemmar på GALLERIett i midsommar. Vernissage midsommardagen 21 juni kl. 12–18.',
    pressRelease: `Konst i Midsommartid
Konstutställning av och med TKS-medlemmar.

Vernissage midsommardagen 21 juni 2025 kl. 12–18. Välkommen till GALLERIett!

Källa (@galleriett): ${IG_POST}`,
    image,
    location: {_type: 'reference', _ref: 'location.galleriett'},
    facebookEventUrl: IG_POST,
  })
  console.log('✓ exhibition', slug)

  await client.createOrReplace({
    _id: 'galleryEvent.vernissage-konst-i-midsommartid-2025',
    _type: 'galleryEvent',
    title: 'Vernissage — Konst i Midsommartid',
    slug: {_type: 'slug', current: 'vernissage-konst-i-midsommartid-2025'},
    kind: 'vernissage',
    date: '2025-06-21T12:00:00',
    datesLabel: 'Midsommardagen 21 juni kl. 12–18',
    body: `Vernissage för utställningen Konst i Midsommartid. Öppet kl. 12–18.

Källa (@galleriett): ${IG_POST}`,
    exhibition: {_type: 'reference', _ref: exhibitionId},
    artists: [{_type: 'reference', _ref: ARTIST_ID, _key: 'tks'}],
    location: {_type: 'reference', _ref: 'location.galleriett'},
    image,
    bookingUrl: IG_POST,
  })
  console.log('✓ event vernissage-konst-i-midsommartid-2025')

  console.log('\nKlart:', `https://galleriett-tjorn.pages.dev/utstallningar/${slug}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
