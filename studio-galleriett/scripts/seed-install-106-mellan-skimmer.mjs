/**
 * Installation från IG-karusell (Cecilia Månfagre taggar GALLERIett).
 * OG ger bara första bilden; övriga karusellbilder kräver manuell export.
 *
 *   node scripts/seed-install-106-mellan-skimmer.mjs
 *
 * https://www.instagram.com/p/DMdz39PsTAO/
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

const EXHIBITION_ID = 'exhibition.106-mellan-skimmer-form'
const IG = 'https://www.instagram.com/p/DMdz39PsTAO/'

function decodeEntities(s) {
  if (!s) return s
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x201d;/gi, '”')
    .replace(/&#x201c;/gi, '“')
    .replace(/&#064;/g, '@')
}

async function ogFromIg(url) {
  const res = await fetch(url, {
    headers: {'User-Agent': 'Mozilla/5.0 (compatible; GALLERIettSeed/1.0)'},
  })
  const html = await res.text()
  const get = (prop) => {
    const m = html.match(new RegExp(`property="${prop}" content="([^"]*)"`, 'i'))
    return m ? decodeEntities(m[1]) : null
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
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
  }
}

async function main() {
  const ex = await client.fetch(
    `*[_id==$id][0]{_id, "slug":slug.current, installationViews, sources}`,
    {id: EXHIBITION_ID}
  )
  if (!ex?._id) {
    console.error('Saknar', EXHIBITION_ID)
    process.exit(1)
  }

  console.log('OG', IG)
  const og = await ogFromIg(IG)
  if (!og.image) throw new Error('Ingen og:image')

  const image = await uploadFromUrl(og.image, '106-install-dmdz39.jpg')
  const view = {
    _type: 'installationView',
    _key: 'inst-dmdz39-1',
    image,
    caption: 'Mellan skimmer & form · installation (källa @ceciliamanfagre)',
    alt: 'Installationsvy, Mellan skimmer & form på GALLERIett',
  }

  const existing = Array.isArray(ex.installationViews) ? ex.installationViews : []
  const withoutDup = existing.filter((v) => v?._key !== view._key)
  const installationViews = [...withoutDup, view]

  const sources = [...(ex.sources || [])]
  if (!sources.some((s) => s.url === IG)) {
    sources.push({
      _type: 'sourceLink',
      _key: `src-ig-dmdz39`,
      label: 'Instagram · installation (@ceciliamanfagre)',
      url: IG,
    })
  }

  await client.patch(EXHIBITION_ID).set({installationViews, sources}).commit()
  console.log('✓ installationViews', installationViews.length)
  console.log('  (OG ger bara 1 bild från karusell — övriga kan laddas manuellt i Studio)')
  console.log('  Webb:', `https://galleriett-tjorn.pages.dev/utstallningar/${ex.slug}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
