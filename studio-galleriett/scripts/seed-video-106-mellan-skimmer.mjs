/**
 * Video till utställning 106 Mellan skimmer & form.
 *   node scripts/seed-video-106-mellan-skimmer.mjs
 *
 * https://www.instagram.com/p/DMgMDO-sh8w/
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
const IG = 'https://www.instagram.com/p/DMgMDO-sh8w/'
const VIDEO_ID = 'video.106-mellan-skimmer-form'

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
    `*[_id==$id][0]{_id, title, artistLabel, "slug":slug.current, start}`,
    {id: EXHIBITION_ID}
  )
  if (!ex?._id) {
    console.error('Saknar', EXHIBITION_ID)
    process.exit(1)
  }

  console.log('OG', IG)
  const og = await ogFromIg(IG)
  if (!og.image) throw new Error('Ingen og:image')

  const thumbnail = await uploadFromUrl(og.image, `${VIDEO_ID}.jpg`)
  const publishedAt = '2025-07-19'

  await client.createOrReplace({
    _id: VIDEO_ID,
    _type: 'video',
    title: `${ex.title || 'Mellan skimmer & form'} — video`,
    slug: {_type: 'slug', current: '106-mellan-skimmer-form'},
    url: IG,
    thumbnail,
    description:
      og.description?.slice(0, 280) ||
      'Film från utställningen Mellan skimmer & form på GALLERIett (Instagram).',
    exhibition: {_type: 'reference', _ref: EXHIBITION_ID},
    publishedAt,
  })

  console.log('✓', VIDEO_ID)
  console.log('  Webb:', `https://galleriett-tjorn.pages.dev/utstallningar/${ex.slug}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
