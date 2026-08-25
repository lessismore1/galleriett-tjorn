/**
 * Komplettera exhibition.90-nar-datid-moter-nutid med andra IG-inlägget
 * https://www.instagram.com/p/DBZNOzdqD_X/
 * + konstnärsaffisch https://www.instagram.com/p/DBZNaMVKr4J/
 *
 *   node scripts/patch-brytningstid-del2.mjs
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

const IG_TEXT = 'https://www.instagram.com/p/DBZNOzdqD_X/'
const IG_ARTISTS = 'https://www.instagram.com/p/DBZNaMVKr4J/'
const OLD_ID = 'exhibition.90-nar-datid-moter-nutid'
const NEW_ID = 'exhibition.90-brytningstid-del-2'
const NEW_SLUG = '90-brytningstid-del-2'

async function ogImage(url) {
  const res = await fetch(url, {
    headers: {'User-Agent': 'Mozilla/5.0 (compatible; GALLERIettSeed/1.0)'},
  })
  const html = await res.text()
  const m = html.match(/property="og:image" content="([^"]+)"/)
  return m ? m[1].replace(/&amp;/g, '&') : null
}

async function uploadFromUrl(url, filename) {
  if (!url) return undefined
  const res = await fetch(url, {
    headers: {'User-Agent': 'Mozilla/5.0 (compatible; GALLERIettSeed/1.0)'},
  })
  if (!res.ok) throw new Error(`Bild ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buf, {filename})
  return {asset: {_type: 'reference', _ref: asset._id}}
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const NAMED_ARTISTS = [
  {idNumber: 16, name: 'Ellinor Bartholdzon', specialty: 'Olja'},
  {idNumber: 17, name: 'Bibbi Gadd', specialty: 'Textil'},
]

async function main() {
  const heroUrl = await ogImage(IG_TEXT)
  const artistsUrl = await ogImage(IG_ARTISTS)
  const hero = await uploadFromUrl(heroUrl, 'brytningstid-del2-hero-ig.jpg')
  const artistsPoster = await uploadFromUrl(artistsUrl, 'brytningstid-del2-utstallare-ig.jpg')

  const artistRefs = []
  for (const a of NAMED_ARTISTS) {
    const slug = `${String(a.idNumber).padStart(2, '0')}-${slugify(a.name)}`
    const id = `artist.${slug}`
    await client.createOrReplace({
      _id: id,
      _type: 'artist',
      idNumber: a.idNumber,
      name: a.name,
      slug: {_type: 'slug', current: slug},
      specialty: a.specialty,
      intro: `Utställare under Brytningstid del 2 (2024) på GALLERIett.`,
    })
    artistRefs.push({_type: 'reference', _ref: id, _key: slugify(a.name)})
    console.log('✓ artist', slug)
  }
  // Behåll även TKS-grupp för övriga (delvis beskurna namn på affischen)
  artistRefs.push({
    _type: 'reference',
    _ref: 'artist.15-tks-medlemmar',
    _key: 'tks',
  })

  const doc = {
    _id: NEW_ID,
    _type: 'exhibition',
    idNumber: 90,
    title: 'Brytningstid',
    slug: {_type: 'slug', current: NEW_SLUG},
    artists: artistRefs,
    artistLabel: 'Del 2 av 3 · När dåtid möter nutid',
    start: '2024-10-26',
    end: '2024-11-17',
    datesLabel: 'Lör–sön 11–17 · 26 OKT – 17 NOV 2024',
    intro:
      'Period två av Brytningstid – när dåtid möter nutid, med delvis nya konstnärer. Öppet lördagar och söndagar kl. 11–17. Café under öppettiderna. Del 3: 23 november – 8 december.',
    pressRelease: `Nu säger vi tack och adjö till första perioden av utställningen ”Brytningstid - när dåtid möter nutid” och hälsar samtidigt välkomna till kommande helg då vi kör igång period två med delvis nya konstnärer.

Brytningstid del 2 — När dåtid möter nutid
Öppet lördagar och söndagar kl. 11–17 från 26 oktober till 17 november 2024.
Café under öppettiderna.
Del 3: 23 november – 8 december.

Utställare (del 2, urval): Ellinor Bartholdzon (olja), Bibbi Gadd (textil) m.fl.

Källor (@galleriett):
${IG_TEXT}
${IG_ARTISTS}`,
    image: hero,
    cardImage: artistsPoster,
    installationViews: artistsPoster
      ? [
          {
            _type: 'installationView',
            _key: 'utstallare',
            image: artistsPoster,
            caption: 'Utställare del 2',
          },
        ]
      : undefined,
    location: {_type: 'reference', _ref: 'location.galleriett'},
    facebookEventUrl: IG_TEXT,
  }

  await client.createOrReplace(doc)
  console.log('✓ exhibition', NEW_SLUG)

  if (await client.getDocument(OLD_ID)) {
    await client.delete(OLD_ID)
    console.log('✓ removed old', OLD_ID)
  }

  console.log('\nLive:', `https://galleriett-tjorn.pages.dev/utstallningar/${NEW_SLUG}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
