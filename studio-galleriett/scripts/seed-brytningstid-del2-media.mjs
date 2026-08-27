/**
 * Brytningstid del 2 — installationsbilder + video från Instagram.
 *
 * Bilder:
 *   https://www.instagram.com/p/DBmgogDq2Tb/
 *   https://www.instagram.com/p/DBmhnvZqBzE/
 *   https://www.instagram.com/p/DBy1BDGKvhv/
 * Video (reels):
 *   https://www.instagram.com/p/DBrelZ8q5Nn/
 *   https://www.instagram.com/p/DBvojkdq-8y/
 *
 *   node scripts/seed-brytningstid-del2-media.mjs
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

const EXHIBITION_ID = 'exhibition.101-brytningstid-del-2'

const INSTALL = [
  {
    url: 'https://www.instagram.com/p/DBmgogDq2Tb/',
    caption: 'Vernissage Brytningstid del 2',
    alt: 'Installationsvy vernissage Brytningstid del 2, GALLERIett',
    key: 'inst-dbmgog',
  },
  {
    url: 'https://www.instagram.com/p/DBmhnvZqBzE/',
    caption: 'Gobeläng (Magic in the Moonlight)',
    alt: 'Gobeläng i utställningen Brytningstid del 2',
    key: 'inst-dbmhnv',
  },
  {
    url: 'https://www.instagram.com/p/DBy1BDGKvhv/',
    caption: 'Betong flaskor · Karl Gadd',
    alt: 'Betong flaskor av Karl Gadd, Brytningstid del 2',
    key: 'inst-dby1bd',
  },
]

const VIDEOS = [
  {
    id: 'video.101-brytningstid-del2-a',
    title: 'Brytningstid del 2 — video 1',
    url: 'https://www.instagram.com/p/DBrelZ8q5Nn/',
    publishedAt: '2024-10-28',
    description: 'Film från utställningen Brytningstid del 2 på GALLERIett (Instagram).',
  },
  {
    id: 'video.101-brytningstid-del2-b',
    title: 'Brytningstid del 2 — video 2',
    url: 'https://www.instagram.com/p/DBvojkdq-8y/',
    publishedAt: '2024-10-30',
    description: 'Film från utställningen Brytningstid del 2 på GALLERIett (Instagram).',
  },
]

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
  if (!res.ok) throw new Error(`Bild ${res.status} ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buf, {filename})
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
  }
}

async function main() {
  if (!(await client.getDocument(EXHIBITION_ID))) {
    console.error('Saknar', EXHIBITION_ID)
    process.exit(1)
  }

  const installationViews = []
  for (const item of INSTALL) {
    console.log('OG install', item.url)
    const og = await ogFromIg(item.url)
    if (!og.image) throw new Error(`Ingen og:image ${item.url}`)
    const image = await uploadFromUrl(og.image, `${item.key}.jpg`)
    installationViews.push({
      _type: 'installationView',
      _key: item.key,
      image,
      caption: item.caption,
      alt: item.alt,
    })
    console.log('✓', item.caption)
  }

  await client.patch(EXHIBITION_ID).set({installationViews}).commit()
  console.log('✓ installationViews →', EXHIBITION_ID, installationViews.length)

  for (const v of VIDEOS) {
    console.log('OG video', v.url)
    const og = await ogFromIg(v.url)
    if (!og.image) throw new Error(`Ingen og:image ${v.url}`)
    const thumbnail = await uploadFromUrl(og.image, `${v.id}.jpg`)
    await client.createOrReplace({
      _id: v.id,
      _type: 'video',
      title: v.title,
      slug: {_type: 'slug', current: v.id.replace(/^video\./, '')},
      url: v.url,
      thumbnail,
      description: v.description,
      exhibition: {_type: 'reference', _ref: EXHIBITION_ID},
      publishedAt: v.publishedAt,
    })
    console.log('✓', v.id)
  }

  console.log('Klart. Studio video:', 'https://galleriett-tjorn.sanity.studio/structure/video')
  console.log('Utställning:', `https://galleriett-tjorn.pages.dev/utstallningar/101-brytningstid-del-2`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
