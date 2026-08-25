/**
 * Seed Brytningstid del 3 från @galleriett
 * https://www.instagram.com/p/DCloSAvqbpl/
 *
 *   node scripts/seed-brytningstid-del3.mjs
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

const IG_POST = 'https://www.instagram.com/p/DCloSAvqbpl/'
const ARTIST_ID = 'artist.15-tks-medlemmar'
const DEL2_ID = 'exhibition.90-brytningstid-del-2'

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
  const image = og ? await uploadFromUrl(og, 'brytningstid-del3-ig.jpg') : undefined

  const idNumber = 91
  const slug = '91-brytningstid-del-3'
  const exhibitionId = `exhibition.${slug}`

  await client.createOrReplace({
    _id: exhibitionId,
    _type: 'exhibition',
    idNumber,
    title: 'Brytningstid',
    slug: {_type: 'slug', current: slug},
    artists: [{_type: 'reference', _ref: ARTIST_ID, _key: 'tks'}],
    artistLabel: 'Del 3 av 3 · När dåtid möter nutid',
    start: '2024-11-23',
    end: '2024-12-08',
    datesLabel: 'Lör–sön 11–17 · 23 NOV – 8 DEC 2024',
    intro:
      'Tredje och sista delen av Brytningstid – när dåtid möter nutid, med en ny omgång konstnärer. Vernissage lördag 23 november. Öppet lördagar och söndagar kl. 11–17. Café under öppettiderna.',
    pressRelease: `På lördag är det vernissage för den tredje och sista delen av utställningen ”Brytningstid - när dåtid möter nutid” där en ny omgång av kreativa konstnärer ställer ut sin konst.
VÄLKOMNA!

Brytningstid del 3 — När dåtid möter nutid
Öppet lördagar och söndagar kl. 11–17 från 23 november till 8 december 2024.
Café under öppettiderna.

Se även del 2: /utstallningar/90-brytningstid-del-2

Källa (@galleriett): ${IG_POST}`,
    image,
    location: {_type: 'reference', _ref: 'location.galleriett'},
    facebookEventUrl: IG_POST,
  })
  console.log('✓ exhibition', slug)

  await client.createOrReplace({
    _id: 'galleryEvent.vernissage-brytningstid-del3-2024',
    _type: 'galleryEvent',
    title: 'Vernissage — Brytningstid del 3',
    slug: {_type: 'slug', current: 'vernissage-brytningstid-del3-2024'},
    kind: 'vernissage',
    date: '2024-11-23T11:00:00',
    datesLabel: 'Lördag 23 november',
    body: `Vernissage för den tredje och sista delen av Brytningstid – när dåtid möter nutid.\n\n${IG_POST}`,
    exhibition: {_type: 'reference', _ref: exhibitionId},
    artists: [{_type: 'reference', _ref: ARTIST_ID, _key: 'tks'}],
    location: {_type: 'reference', _ref: 'location.galleriett'},
    image,
    bookingUrl: IG_POST,
  })
  console.log('✓ vernissage event')

  // Länknotis på del 2 om del 3 (append om saknas)
  const del2 = await client.getDocument(DEL2_ID)
  if (del2 && !(del2.intro || '').includes('91-brytningstid-del-3')) {
    const intro = `${del2.intro || ''}\n\nDel 3: 23 november – 8 december → /utstallningar/91-brytningstid-del-3`.trim()
    await client.patch(DEL2_ID).set({intro}).commit()
    console.log('✓ uppdaterade intro på del 2')
  }

  console.log('\nLive:', `https://galleriett-tjorn.pages.dev/utstallningar/${slug}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
