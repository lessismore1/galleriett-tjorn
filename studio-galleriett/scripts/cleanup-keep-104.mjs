/**
 * Rensa production: behåll endast Ljus Färg Form (104) + Kattis + Robert + site/footer.
 *
 *   cd studio-galleriett
 *   node scripts/cleanup-keep-104.mjs
 *
 * Kräver SANITY_API_TOKEN. Kör dataset export innan.
 * Default dataset: production (override med SANITY_STUDIO_DATASET).
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

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '81lb9elz'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
const dryRun = process.argv.includes('--dry-run')

if (!token) {
  console.error('Saknar SANITY_API_TOKEN i .env')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
})

const KEEP_ARTIST_SLUGS = new Set(['10-kattis-palmnas', '09-robert-oldergaarden'])
const KEEP_EXHIBITION_SLUG = '104-ljus-farg-form'

/** Document types we never delete (site chrome). */
const KEEP_TYPES = new Set(['siteSettings', 'sponsor', 'location'])

async function main() {
  console.log(`dataset=${dataset} dryRun=${dryRun}`)

  const artists = await client.fetch(
    `*[_type == "artist"]{ _id, "slug": slug.current, name }`
  )
  const exhibitions = await client.fetch(
    `*[_type == "exhibition"]{ _id, "slug": slug.current, title, idNumber, works[]->{_id}, artists[]->{_id, "slug": slug.current} }`
  )
  const artworks = await client.fetch(
    `*[_type == "artwork"]{ _id, "slug": slug.current, title, "artistSlug": artist->slug.current }`
  )
  const articles = await client.fetch(
    `*[_type == "article"]{ _id, "slug": slug.current, title, "artistSlugs": artists[]->slug.current, "exSlug": exhibition->slug.current }`
  )
  const events = await client.fetch(
    `*[_type == "galleryEvent"]{ _id, title, "exSlug": exhibition->slug.current, "artistSlugs": artists[]->slug.current }`
  )
  const videos = await client.fetch(`*[_type == "video"]{ _id, title }`)
  const other = await client.fetch(
    `*[_type in ["siteSettings","sponsor","location"]]{ _id, _type }`
  )

  const keepArtistIds = new Set(
    artists.filter((a) => KEEP_ARTIST_SLUGS.has(a.slug)).map((a) => a._id)
  )
  const keepExhibition = exhibitions.find((e) => e.slug === KEEP_EXHIBITION_SLUG)
  if (!keepExhibition) {
    console.error(`Hittar inte exhibition ${KEEP_EXHIBITION_SLUG}`)
    process.exit(1)
  }
  if (keepArtistIds.size !== 2) {
    console.error('Förväntade 2 keep-artists, fick', [...keepArtistIds], artists)
    process.exit(1)
  }

  const keepArtworkIds = new Set()
  for (const w of keepExhibition.works || []) {
    if (w?._id) keepArtworkIds.add(w._id)
  }
  for (const w of artworks) {
    if (KEEP_ARTIST_SLUGS.has(w.artistSlug)) keepArtworkIds.add(w._id)
  }

  const keepArticleIds = new Set()
  for (const a of articles) {
    const linkedArtist = (a.artistSlugs || []).some((s) => KEEP_ARTIST_SLUGS.has(s))
    const linkedEx = a.exSlug === KEEP_EXHIBITION_SLUG
    if (linkedArtist || linkedEx) keepArticleIds.add(a._id)
  }

  const keepEventIds = new Set()
  for (const e of events) {
    const linkedArtist = (e.artistSlugs || []).some((s) => KEEP_ARTIST_SLUGS.has(s))
    const linkedEx = e.exSlug === KEEP_EXHIBITION_SLUG
    if (linkedArtist || linkedEx) keepEventIds.add(e._id)
  }

  const keepIds = new Set([
    keepExhibition._id,
    ...keepArtistIds,
    ...keepArtworkIds,
    ...keepArticleIds,
    ...keepEventIds,
    ...other.map((d) => d._id),
  ])

  const allDocs = await client.fetch(`*[!(_id in path("drafts.**"))]{ _id, _type }`)
  const toDelete = allDocs.filter((d) => {
    if (KEEP_TYPES.has(d._type)) return false
    if (keepIds.has(d._id)) return false
    // Behåll assets — orphan assets kan städas senare; undvik att radera bilder som 104 använder
    if (d._type === 'sanity.imageAsset' || d._type === 'sanity.fileAsset') return false
    // Never delete Sanity system docs
    if (d._id.startsWith('_.') || d._type.startsWith('system.')) return false
    return true
  })

  console.log('\nBehåller:')
  console.log('  exhibition', keepExhibition._id)
  console.log('  artists', [...keepArtistIds])
  console.log('  artworks', keepArtworkIds.size)
  console.log('  articles', [...keepArticleIds])
  console.log('  events', [...keepEventIds])
  console.log('  site/sponsor/location', other.length)
  console.log(`\nRaderar ${toDelete.length} dokument:`)
  for (const d of toDelete) console.log(`  - ${d._type} ${d._id}`)

  if (dryRun) {
    console.log('\n(--dry-run) Ingen radering utförd.')
    return
  }

  const tx = client.transaction()
  for (const d of toDelete) tx.delete(d._id)
  await tx.commit({visibility: 'async'})
  console.log(`\n✓ Raderade ${toDelete.length} dokument i ${dataset}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
