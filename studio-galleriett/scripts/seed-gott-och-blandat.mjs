/**
 * Seed utställning 109 Gott och Blandat från Instagram-inlägg
 * https://www.instagram.com/p/Db3W26KlgMd/
 *
 *   node scripts/seed-gott-och-blandat.mjs
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

const IG_POST = 'https://www.instagram.com/p/Db3W26KlgMd/'
const IG_PROFILE = 'https://www.instagram.com/galleriett.tjorn/'

async function ogImageFromInstagram(url) {
  const res = await fetch(url, {
    headers: {'User-Agent': 'Mozilla/5.0 (compatible; GALLERIettSeed/1.0)'},
  })
  const html = await res.text()
  const m = html.match(/property="og:image" content="([^"]+)"/)
  if (!m) return null
  return m[1]
    .replace(/&amp;/g, '&')
    .replace(/&#xf6;/g, 'ö')
    .replace(/&#xe4;/g, 'ä')
    .replace(/&#xe5;/g, 'å')
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
  const artistId = 'artist.15-tks-medlemmar'
  const artist = await client.getDocument(artistId)
  if (!artist) {
    console.error('Saknar TKS-medlemmar-stub', artistId)
    process.exit(1)
  }

  console.log('Hämtar Instagram-bild…')
  const og = await ogImageFromInstagram(IG_POST)
  if (!og) {
    console.warn('Ingen og:image — seedar utan affisch')
  } else {
    console.log('og:image ok')
  }
  const image = og ? await uploadFromUrl(og, 'gott-och-blandat-ig.jpg') : undefined

  const idNumber = 109
  const slug = '109-gott-och-blandat'
  const exhibitionId = `exhibition.${slug}`

  const intro =
    'Grupputställning med konstnärer verksamma på Tjörn. Måleri i akvarell och akryl, skulptur i trä samt verk av återbrukade material. Vernissage lördag 15 augusti kl. 12–16.'

  const pressRelease = `Ny utställning — Gott och Blandat

Vernissage lördag 15 augusti kl. 12–16. Välkommen!

Våra konstnärer är alla verksamma på Tjörn. De målar i olika medier bl.a. med akvarell och akryl. De skulpterar i trä. De återanvänder många spännande och fascinerande material och skapar nya verk. Kom och se!

Öppettider: 15–16 augusti och 20–23 augusti kl. 12–16.

Källa: ${IG_POST}
@galleriett.tjorn`

  await client.createOrReplace({
    _id: exhibitionId,
    _type: 'exhibition',
    idNumber,
    title: 'Gott och Blandat',
    slug: {_type: 'slug', current: slug},
    artists: [{_type: 'reference', _ref: artistId, _key: 'tks'}],
    artistLabel: 'Konstnärer från Tjörn',
    start: '2026-08-15',
    end: '2026-08-23',
    datesLabel: '15–16 & 20–23 AUG 2026',
    intro,
    pressRelease,
    image,
    location: {_type: 'reference', _ref: 'location.galleriett'},
    facebookEventUrl: IG_POST,
  })
  console.log('✓ exhibition', slug)

  await client.createOrReplace({
    _id: 'galleryEvent.vernissage-gott-och-blandat-2026',
    _type: 'galleryEvent',
    title: 'Vernissage — Gott och Blandat',
    slug: {_type: 'slug', current: 'vernissage-gott-och-blandat-2026'},
    kind: 'vernissage',
    date: '2026-08-15T12:00:00',
    datesLabel: 'Lördag 15 augusti kl. 12–16',
    body: `Vernissage för utställningen Gott och Blandat. Öppet kl. 12–16.

Mer info: ${IG_PROFILE}`,
    exhibition: {_type: 'reference', _ref: exhibitionId},
    artists: [{_type: 'reference', _ref: artistId, _key: 'tks'}],
    location: {_type: 'reference', _ref: 'location.galleriett'},
    image,
    bookingUrl: IG_POST,
  })
  console.log('✓ event vernissage-gott-och-blandat-2026')

  console.log('\nKlart:', `https://galleriett-tjorn.pages.dev/utstallningar/${slug}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
