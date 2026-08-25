/**
 * Seed från @galleriett (äldre IG) — första inlägget:
 * https://www.instagram.com/p/DBZNaMVKr4J/ (21 okt 2024)
 *
 * Affisch: Utställningstid del 2 av 3 – När dåtid möter nutid
 * Öppet lör–sön 11–17, 26 okt – 17 nov 2024
 *
 *   node scripts/seed-ig-nar-datid-motet-nutid.mjs
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

const IG_POST = 'https://www.instagram.com/p/DBZNaMVKr4J/'
const ARTIST_ID = 'artist.15-tks-medlemmar'

async function ogFromIg(url) {
  const res = await fetch(url, {
    headers: {'User-Agent': 'Mozilla/5.0 (compatible; GALLERIettSeed/1.0)'},
  })
  const html = await res.text()
  const get = (prop) => {
    const m = html.match(new RegExp(`property="${prop}" content="([^"]*)"`, 'i'))
    return m ? m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"') : null
  }
  return {image: get('og:image'), title: get('og:title'), description: get('og:description')}
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

  const og = await ogFromIg(IG_POST)
  console.log('IG:', og.description?.slice(0, 120))
  const image = og.image
    ? await uploadFromUrl(og.image, 'nar-datid-moter-nutid-2024-ig.jpg')
    : undefined

  const idNumber = 90
  const slug = '90-nar-datid-moter-nutid'
  const exhibitionId = `exhibition.${slug}`

  await client.createOrReplace({
    _id: exhibitionId,
    _type: 'exhibition',
    idNumber,
    title: 'När dåtid möter nutid',
    slug: {_type: 'slug', current: slug},
    artists: [{_type: 'reference', _ref: ARTIST_ID, _key: 'tks'}],
    artistLabel: 'Utställningstid del 2 av 3 · TKS-utställare',
    start: '2024-10-26',
    end: '2024-11-17',
    datesLabel: 'Lör–sön 11–17 · 26 OKT – 17 NOV 2024',
    intro:
      'Grupputställning (del 2 av 3) med utställare från Tjörn. Bland annat Ellinor Bartholdzon (olja) och Bibbi Gadd (textil). Öppet lördagar och söndagar kl. 11–17.',
    pressRelease: `Nedan presenteras de konstnärer som deltar på kommande utställning. Välkomna!

När dåtid möter nutid — Utställningstid del 2 av 3
Öppet lördagar och söndagar kl. 11–17 från 26 oktober till 17 november 2024.

Källa (äldre IG @galleriett): ${IG_POST}`,
    image,
    location: {_type: 'reference', _ref: 'location.galleriett'},
    facebookEventUrl: IG_POST,
  })

  console.log('✓ exhibition', slug)
  console.log('Live:', `https://galleriett-tjorn.pages.dev/utstallningar/${slug}`)
  console.log('\nBekräfta gärna titel/datum — affischen var delvis beskuren.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
