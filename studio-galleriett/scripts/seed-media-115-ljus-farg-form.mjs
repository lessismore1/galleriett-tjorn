/**
 * Ljus Färg Form (115) — video + installationsbild från Instagram.
 *   node scripts/seed-media-115-ljus-farg-form.mjs
 *
 * https://www.instagram.com/p/DbwFQPAjCeN/
 */
import {createClient} from '@sanity/client'
import {readFileSync, existsSync, writeFileSync, mkdirSync} from 'node:fs'
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

const EXHIBITION_ID = 'exhibition.115-ljus-farg-form'
const VIDEO_ID = 'video.115-ljus-farg-form'
const IG = 'https://www.instagram.com/p/DbwFQPAjCeN/'
const VIEW_KEY = 'inst-dbwfqpajcen'

async function fetchIgStill() {
  const res = await fetch(`${IG}media/?size=l`, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  })
  if (!res.ok) throw new Error(`IG media ${res.status}`)
  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('image')) throw new Error(`Förväntade bild, fick ${ct}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const tmp = resolve(__dirname, '.tmp')
  mkdirSync(tmp, {recursive: true})
  writeFileSync(resolve(tmp, '115-ljus-ig-still.jpg'), buf)
  return buf
}

async function main() {
  const ex = await client.fetch(
    `*[_id==$id][0]{_id, title, artistLabel, "slug":slug.current, start, installationViews, sources}`,
    {id: EXHIBITION_ID}
  )
  if (!ex?._id) {
    console.error('Saknar', EXHIBITION_ID)
    process.exit(1)
  }

  console.log('Hämtar still från', IG)
  const buf = await fetchIgStill()
  const asset = await client.assets.upload('image', buf, {
    filename: '115-ljus-farg-form-ig-dbwfqpajcen.jpg',
    contentType: 'image/jpeg',
  })
  const image = {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
  }
  console.log('✓ uppladdad', asset._id)

  const publishedAt = ex.start ? String(ex.start).slice(0, 10) : '2026-08-01'
  await client.createOrReplace({
    _id: VIDEO_ID,
    _type: 'video',
    title: `${ex.title || 'Ljus Färg Form'} — video`,
    slug: {_type: 'slug', current: '115-ljus-farg-form'},
    url: IG,
    thumbnail: image,
    description:
      'Film från utställningen Ljus Färg Form med Kattis Palmnäs och Robert Oldergaarden (Instagram).',
    exhibition: {_type: 'reference', _ref: EXHIBITION_ID},
    artists: [
      {_type: 'reference', _ref: 'artist.12-kattis-palmnas', _key: 'kattis'},
      {_type: 'reference', _ref: 'artist.11-robert-oldergaarden', _key: 'robert'},
    ],
    publishedAt,
  })
  console.log('✓', VIDEO_ID)

  const view = {
    _type: 'installationView',
    _key: VIEW_KEY,
    image,
    caption: 'Ljus Färg Form · installation (Instagram)',
    alt: 'Installationsvy med måleri och glas, Ljus Färg Form på GALLERIett',
  }
  const existing = Array.isArray(ex.installationViews) ? ex.installationViews : []
  const installationViews = [...existing.filter((v) => v?._key !== VIEW_KEY), view]

  const sources = [...(ex.sources || [])]
  if (!sources.some((s) => s.url === IG)) {
    sources.push({
      _type: 'sourceLink',
      _key: 'src-ig-dbwfqpajcen',
      label: 'Instagram · video & installation',
      url: IG,
    })
  }

  await client.patch(EXHIBITION_ID).set({installationViews, sources}).commit()
  console.log('✓ installationViews', installationViews.length, '(behåller tidigare + ny)')
  console.log('  Webb:', `https://galleriett-tjorn.pages.dev/utstallningar/${ex.slug}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
