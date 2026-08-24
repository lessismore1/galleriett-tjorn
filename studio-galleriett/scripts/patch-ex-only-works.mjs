/**
 * Patch: skapa exhibition-only verk som missades vid första seed
 * och koppla dem till respektive exhibition.works.
 *
 *   cd studio-galleriett
 *   node scripts/patch-ex-only-works.mjs
 *
 * Kräver SANITY_API_TOKEN i .env (skrivrättighet).
 */

import {createClient} from '@sanity/client'
import {readFileSync, existsSync} from 'node:fs'
import {dirname, resolve, basename, extname} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const studioRoot = resolve(__dirname, '..')
const webStatic = resolve(studioRoot, '../web/static')

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
const dataset = process.env.SANITY_STUDIO_DATASET || 'development'
const token = process.env.SANITY_API_TOKEN

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

function titleSlug(title) {
  return String(title)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function uploadImage(src) {
  const abs = resolve(webStatic, String(src).replace(/^\//, ''))
  if (!existsSync(abs)) {
    throw new Error(`Saknar bildfil: ${src} → ${abs}`)
  }
  const buffer = readFileSync(abs)
  const filename = basename(abs)
  const contentType =
    extname(abs).toLowerCase() === '.webp'
      ? 'image/webp'
      : extname(abs).toLowerCase() === '.png'
        ? 'image/png'
        : 'image/jpeg'
  const asset = await client.assets.upload('image', buffer, {filename, contentType})
  console.log('  ↑', filename)
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
  }
}

function workRef(artId) {
  return {
    _type: 'reference',
    _ref: artId,
    _key: artId.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 64),
  }
}

/** Same stub shape as seed-mock.mjs exhibition-only path */
const PATCHES = [
  {
    exhibitionId: 'exhibition.106-erik-halvorsen-tystnadens-rum',
    exhibitionSlug: '106-erik-halvorsen-tystnadens-rum',
    artistId: 'artist.02-erik-halvorsen',
    year: 2026,
    works: [
      {title: 'Vila', image: '/images/work-104-e.jpg', idNumber: 1035},
      {title: 'Kant', image: '/images/work-104-f.jpg', idNumber: 1036},
    ],
  },
  {
    exhibitionId: 'exhibition.102-per-olofsson-tidvatten',
    exhibitionSlug: '102-per-olofsson-tidvatten',
    artistId: 'artist.06-per-olofsson',
    year: 2026,
    works: [
      {title: 'Skär', image: '/images/work-102-e.jpg', idNumber: 1037},
      {title: 'Ebb', image: '/images/work-102-f.jpg', idNumber: 1038},
    ],
  },
]

async function main() {
  console.log(`Patch ex-only works → ${projectId}/${dataset}`)

  for (const patch of PATCHES) {
    const artist = await client.fetch(`*[_id == $id][0]{_id, name}`, {
      id: patch.artistId,
    })
    if (!artist) {
      throw new Error(`Artist saknas: ${patch.artistId}`)
    }
    console.log(`Artist OK: ${artist._id} (${artist.name})`)

    const existing = await client.fetch(
      `*[_id == $id][0]{_id, title, "workRefs": works[]._ref}`,
      {id: patch.exhibitionId},
    )
    if (!existing) {
      throw new Error(`Exhibition saknas: ${patch.exhibitionId}`)
    }

    const newRefs = []
    for (const w of patch.works) {
      const slugBase = `${patch.exhibitionSlug}-${titleSlug(w.title)}`
      const artId = `artwork.${slugBase}`
      const existingArt = await client.fetch(`*[_id == $id][0]{_id, image}`, {id: artId})
      const image = existingArt?.image || (await uploadImage(w.image))
      await client.createOrReplace({
        _id: artId,
        _type: 'artwork',
        idNumber: w.idNumber,
        title: w.title,
        slug: {_type: 'slug', current: slugBase},
        artist: {_type: 'reference', _ref: patch.artistId},
        year: w.year || patch.year,
        image,
      })
      console.log('✓ artwork (ex-only)', w.idNumber, slugBase)
      newRefs.push(workRef(artId))
    }

    const currentRefs = existing.workRefs || []
    const merged = [...currentRefs]
    for (const r of newRefs) {
      if (!merged.includes(r._ref)) merged.push(r._ref)
    }

    await client
      .patch(patch.exhibitionId)
      .set({
        works: merged.map((ref) => workRef(ref)),
      })
      .commit()
    console.log(
      `✓ exhibition ${patch.exhibitionSlug}: works ${currentRefs.length} → ${merged.length}`,
    )
  }

  console.log('\nKlart')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
