/**
 * Seed/uppdatera G1-konstnär från KmH Sanity-profil.
 *
 *   node scripts/seed-artist-from-kmh.mjs --kmh=<slug> --id=<nn> [--exhibition=<ex-slug>]
 *
 * Exempel:
 *   node scripts/seed-artist-from-kmh.mjs --kmh=barbro-liselotte-holmgren-gadd --id=13 --exhibition=105-cheeky-points
 *   node scripts/seed-artist-from-kmh.mjs --kmh=ann-louise-schwieger --id=14 --exhibition=106-sprakande-farger
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

function arg(name) {
  const prefix = `--${name}=`
  const hit = process.argv.find((a) => a.startsWith(prefix))
  return hit ? hit.slice(prefix.length) : undefined
}

loadEnv()

const kmhSlug = arg('kmh')
const idNumber = Number(arg('id'))
const exhibitionSlug = arg('exhibition')

if (!kmhSlug || !Number.isFinite(idNumber) || idNumber < 1) {
  console.error(
    'Användning: node scripts/seed-artist-from-kmh.mjs --kmh=<slug> --id=<nn> [--exhibition=<ex-slug>]'
  )
  process.exit(1)
}

const kmh = createClient({
  projectId: '6dam8g9m',
  dataset: 'production',
  apiVersion: '2024-03-25',
  useCdn: false,
})

const g1 = createClient({
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

function introFromDescription(desc) {
  if (!desc) return undefined
  const first = desc.split(/\n\n+/)[0]?.trim()
  if (!first) return undefined
  return first.length > 280 ? `${first.slice(0, 277)}…` : first
}

async function uploadFromUrl(url, filename) {
  if (!url) return undefined
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Kunde inte hämta bild ${url}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await g1.assets.upload('image', buf, {filename})
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

async function main() {
  const src = await kmh.fetch(
    `*[_type == "artist" && slug.current == $slug][0]{
      name,
      techniques,
      description,
      website,
      "profileUrl": profileImage.asset->url,
      "artworks": *[_type == "artwork" && artist._ref == ^._id] | order(_createdAt asc){
        title,
        technique,
        dimensions,
        forSale,
        "imageUrl": image.asset->url
      }
    }`,
    {slug: kmhSlug}
  )

  if (!src) {
    console.error('Hittar inte KmH-artist', kmhSlug)
    process.exit(1)
  }

  const g1Slug = `${String(idNumber).padStart(2, '0')}-${slugify(src.name)}`
  const g1ArtistId = `artist.${g1Slug}`
  // Behåll befintligt G1-_id om stub redan finns under kortare slug (t.ex. 14-ann-louise-schwieger)
  const preferredStubId = `artist.${String(idNumber).padStart(2, '0')}-${slugify(
    src.name.replace(/^Barbro\s+/i, '')
  )}`
  const existingByIdNumber = await g1.fetch(
    `*[_type=="artist" && idNumber==$n][0]{ _id, "slug": slug.current }`,
    {n: idNumber}
  )
  const artistId = existingByIdNumber?._id || preferredStubId || g1ArtistId
  const artistSlug = existingByIdNumber?.slug || preferredStubId.replace(/^artist\./, '') || g1Slug

  console.log('KmH:', src.name, '· verk:', src.artworks?.length || 0)
  console.log('G1:', artistId, artistSlug)

  const specialty = Array.isArray(src.techniques)
    ? src.techniques.filter(Boolean).join(' · ')
    : src.techniques || 'Måleri'

  const profileImage = await uploadFromUrl(
    src.profileUrl,
    `${artistSlug}-portrait.jpg`
  )

  await g1.createOrReplace({
    _id: artistId,
    _type: 'artist',
    idNumber,
    name: src.name,
    slug: {_type: 'slug', current: artistSlug},
    specialty,
    intro: introFromDescription(src.description),
    bio: src.description || undefined,
    image: profileImage,
    heroImage: profileImage,
    externalCv: [
      {
        _type: 'externalCvEntry',
        _key: 'kmh-2026',
        year: '2026',
        title: 'Konst med Horisont',
        place: 'GALLERIett / Tjörn',
        note: `https://konstmedhorisont.se/ar/2026/konstnarer/${kmhSlug}`,
      },
      ...(src.website
        ? [
            {
              _type: 'externalCvEntry',
              _key: 'website',
              title: 'Webbplats',
              note: src.website,
            },
          ]
        : []),
    ],
  })
  console.log('✓ artist', artistSlug, '—', src.name)

  let workNum = idNumber * 100 + 1 // 14 → 1401
  if (workNum < 1001) workNum = 1000 + idNumber * 10 + 1

  for (const w of src.artworks || []) {
    if (!w?.title || !w?.imageUrl) {
      console.warn('  hoppar verk utan titel/bild:', w?.title)
      continue
    }
    const workSlug = `${workNum}-${slugify(w.title)}`
    const workId = `artwork.${workSlug}`
    const image = await uploadFromUrl(w.imageUrl, `${workSlug}.jpg`)
    await g1.createOrReplace({
      _id: workId,
      _type: 'artwork',
      idNumber: workNum,
      title: w.title,
      slug: {_type: 'slug', current: workSlug},
      artist: {_type: 'reference', _ref: artistId},
      year: 2026,
      medium: w.technique || undefined,
      dimensions: w.dimensions || undefined,
      image,
      availability: w.forSale === true ? 'available' : 'inquiry',
    })
    console.log('✓ artwork', workSlug)
    workNum += 1
  }

  if (exhibitionSlug) {
    const ex = await g1.fetch(
      `*[_type=="exhibition" && slug.current==$slug][0]{ _id }`,
      {slug: exhibitionSlug}
    )
    if (ex?._id) {
      const workIds = await g1.fetch(
        `*[_type=="artwork" && artist._ref==$aid] | order(idNumber asc){ _id }`,
        {aid: artistId}
      )
      await g1
        .patch(ex._id)
        .set({
          artistLabel: src.name,
          artists: [{_type: 'reference', _ref: artistId, _key: 'a0'}],
          works: (workIds || []).map((w, i) => ({
            _type: 'reference',
            _ref: w._id,
            _key: `w${i}`,
          })),
        })
        .commit()
      console.log('✓ kopplade', workIds.length, 'verk till', exhibitionSlug)
    } else {
      console.warn('Hittar inte exhibition', exhibitionSlug)
    }
  }

  console.log('\nKlart:', `https://galleriett-tjorn.pages.dev/konstnarer/${artistSlug}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
