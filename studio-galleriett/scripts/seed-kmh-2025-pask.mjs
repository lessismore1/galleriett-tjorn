/**
 * Seed Konst med Horisont 2025 (påsk) från @galleriett reel
 * https://www.instagram.com/p/DH85d_aI_Mk/
 *
 *   node scripts/seed-kmh-2025-pask.mjs
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

const IG_POST = 'https://www.instagram.com/p/DH85d_aI_Mk/'
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
  const image = og ? await uploadFromUrl(og, 'kmh-2025-pask-ig.jpg') : undefined

  const idNumber = 93
  const slug = '93-konst-med-horisont-2025'
  const exhibitionId = `exhibition.${slug}`

  await client.createOrReplace({
    _id: exhibitionId,
    _type: 'exhibition',
    idNumber,
    title: 'Konst med Horisont 2025',
    slug: {_type: 'slug', current: slug},
    artists: [{_type: 'reference', _ref: ARTIST_ID, _key: 'tks'}],
    artistLabel: 'TKS · konstrunda på södra Tjörn',
    start: '2025-04-17',
    end: '2025-04-21',
    datesLabel: '17 – 21 APR 2025 (påsk)',
    intro:
      'En gränslös konstrunda på södra Tjörn under påskhelgen. GALLERIett i Rönnäng är samlingsplats — därifrån tar man färjan vidare till Tjörnekalv, Dyrön, Åstol och landsvägen till Klädesholmen för att besöka lokala konstnärer.',
    pressRelease: `Konst med horisont
En gränslös konstrunda på södra Tjörn under påskhelgen 17–21 april 2025.

GALLERI ett i Rönnäng är samlingsplats med ett stort utbud av konst. Därifrån tar man färjan vidare till Tjörnekalv, Dyrön, Åstol och landsvägen till Klädesholmen för att besöka lokala konstnärer.

Mer information: www.tjornkonst.se
Se även 2026: /utstallningar/107-konst-med-horisont-2026

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
