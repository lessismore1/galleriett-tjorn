/**
 * Video till utställning 113 Konst med Horisont 2026.
 * Promofilm från KmH-startsidan → länkas som IG-reels (extern kortlänk).
 *
 *   node scripts/seed-video-113-kmh-2026.mjs
 *
 * Källa: https://konstmedhorisont.se/ar/2026
 * MP4:   cdn.sanity.io/.../47e491c54c9ff27f8ef48702e073fcc23709eda2.mp4
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

const EXHIBITION_ID = 'exhibition.113-konst-med-horisont-2026'
const VIDEO_ID = 'video.113-konst-med-horisont-2026'
const PAGE_URL = 'https://konstmedhorisont.se/ar/2026'
const MP4_URL =
  'https://cdn.sanity.io/files/6dam8g9m/production/47e491c54c9ff27f8ef48702e073fcc23709eda2.mp4'

async function main() {
  const ex = await client.fetch(
    `*[_id==$id][0]{_id, title, artistLabel, "slug":slug.current, start, image}`,
    {id: EXHIBITION_ID}
  )
  if (!ex?._id) {
    console.error('Saknar', EXHIBITION_ID)
    process.exit(1)
  }

  // Miniatyr: återanvänd affisch tills KmH har promoVideoPoster
  const thumbnail = ex.image?.asset?._ref
    ? {_type: 'image', asset: {_type: 'reference', _ref: ex.image.asset._ref}}
    : undefined

  const publishedAt = ex.start ? String(ex.start).slice(0, 10) : '2026-05-14'

  await client.createOrReplace({
    _id: VIDEO_ID,
    _type: 'video',
    title: 'Konst med Horisont 2026 — promovideo',
    slug: {_type: 'slug', current: '113-konst-med-horisont-2026'},
    url: PAGE_URL,
    thumbnail,
    description:
      'Upplevelsefilm för Konst med Horisont 2026. Se filmen på konstmedhorisont.se.',
    exhibition: {_type: 'reference', _ref: EXHIBITION_ID},
    publishedAt,
  })

  console.log('✓', VIDEO_ID)
  console.log('  url:', PAGE_URL)
  console.log('  mp4:', MP4_URL)
  console.log('  Webb:', `https://galleriett-tjorn.pages.dev/utstallningar/${ex.slug}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
