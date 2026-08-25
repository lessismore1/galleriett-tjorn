/**
 * Seed Himmel & Hav 2025 från @galleriett
 * https://www.instagram.com/p/DMrr3CkKysA/
 *
 *   node scripts/seed-himmel-hav.mjs
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

const IG_POST = 'https://www.instagram.com/p/DMrr3CkKysA/'
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
  const image = og ? await uploadFromUrl(og, 'himmel-hav-2025-ig.jpg') : undefined

  const idNumber = 96
  const slug = '96-himmel-hav'
  const exhibitionId = `exhibition.${slug}`

  await client.createOrReplace({
    _id: exhibitionId,
    _type: 'exhibition',
    idNumber,
    title: 'Himmel & Hav',
    slug: {_type: 'slug', current: slug},
    artists: [{_type: 'reference', _ref: ARTIST_ID, _key: 'tks'}],
    artistLabel: 'Fotoutställning · nordiska kuster',
    start: '2025-07-31',
    end: '2025-08-02',
    datesLabel: '31 JUL – 2 AUG 2025 · kl. 12–17',
    intro:
      'Fotoutställning från våra nordiska kuster — ett urval av motiv i natthimlens ljus och under ytan. Öppet torsdag 31 juli till lördag 2 augusti kl. 12–17.',
    pressRelease: `Himmel & Hav
Fotoutställning från våra nordiska kuster.

Ett urval av motiv i natthimlens ljus och under ytan.

Torsdag 31/7 – lördag 2/8 kl. 12–17
GALLERIett, Rönnäng · Marinvägen 9 · Hall 1 Lokal Åstol

Välkomna!

Källa (@galleriett): ${IG_POST}`,
    image,
    location: {_type: 'reference', _ref: 'location.galleriett'},
    facebookEventUrl: IG_POST,
  })

  console.log('✓ exhibition', slug)
  console.log('Live:', `https://galleriett-tjorn.pages.dev/utstallningar/${slug}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
