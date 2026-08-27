/**
 * Renumrera verk: utställning kronologiskt → konstnär A–Ö → verk (_updatedAt).
 * idNumber 1001… + slug `{id}-{title}-{year}` + `_id` `artwork.{slug}`.
 *
 *   cd studio-galleriett
 *   node scripts/renumber-artworks-by-exhibition.mjs --dry-run
 *   node scripts/renumber-artworks-by-exhibition.mjs
 *
 * Kräver backup. Inga 301:or.
 */
import {createClient} from '@sanity/client'
import {readFileSync, existsSync, writeFileSync} from 'node:fs'
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
const START_ID = 1001

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

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function workSlug(idNumber, title, year) {
  const parts = [String(idNumber), slugify(title || 'verk')]
  if (year) parts.push(String(year))
  return parts.join('-')
}

function sortWorks(works) {
  return [...works].sort((a, b) => {
    const byArtist = (a.artistName || '').localeCompare(b.artistName || '', 'sv')
    if (byArtist) return byArtist
    const ae = a._updatedAt || a._createdAt || ''
    const be = b._updatedAt || b._createdAt || ''
    return ae.localeCompare(be)
  })
}

async function replaceRefs(oldId, newId) {
  const referring = await client.fetch(`*[references($oldId)]{_id}`, {oldId})
  console.log(`    refs ${oldId} → ${newId}: ${referring.length}`)
  if (dryRun) return
  for (const doc of referring) {
    const full = await client.getDocument(doc._id)
    if (!full) continue
    const replaced = JSON.parse(
      JSON.stringify(full).replaceAll(`"${oldId}"`, `"${newId}"`)
    )
    delete replaced._rev
    await client.createOrReplace(replaced)
  }
}

async function moveDoc(fromId, toId, patchFields) {
  const doc = await client.getDocument(fromId)
  if (!doc) {
    console.warn('    saknas', fromId)
    return false
  }
  if (fromId === toId) {
    if (!dryRun) {
      await client.patch(fromId).set(patchFields).commit()
    }
    console.log(`    patch in-place ${fromId}`)
    return true
  }
  const existing = await client.getDocument(toId)
  if (existing) {
    throw new Error(`Mål finns redan: ${toId} (från ${fromId})`)
  }
  const {_rev, ...rest} = doc
  const next = {...rest, ...patchFields, _id: toId}
  console.log(`    ${fromId} → ${toId}`)
  if (!dryRun) {
    await client.createOrReplace(next)
    await replaceRefs(fromId, toId)
    await client.delete(fromId)
  }
  return true
}

async function buildPlan() {
  const exhibitions = await client.fetch(
    `*[_type=="exhibition"]|order(start asc, idNumber asc){
      idNumber, title,
      "works": works[]->{
        _id, idNumber, title, year, _updatedAt, _createdAt, "slug": slug.current,
        "artistName": artist->name
      }
    }`
  )
  const all = await client.fetch(
    `*[_type=="artwork"]{
      _id, idNumber, title, year, _updatedAt, _createdAt, "slug": slug.current,
      "artistName": artist->name
    }`
  )

  const seen = new Set()
  const seq = []

  for (const ex of exhibitions) {
    for (const w of sortWorks(ex.works || [])) {
      if (!w?._id || seen.has(w._id)) continue
      seen.add(w._id)
      seq.push({...w, firstEx: `${ex.idNumber} ${ex.title}`})
    }
  }

  for (const w of sortWorks(all.filter((x) => !seen.has(x._id)))) {
    seq.push({...w, firstEx: '(ingen utställning)'})
  }

  return seq.map((w, i) => {
    const newIdNumber = START_ID + i
    const newSlug = workSlug(newIdNumber, w.title, w.year)
    return {
      fromId: w._id,
      oldSlug: w.slug,
      oldIdNumber: w.idNumber,
      title: w.title,
      artistName: w.artistName,
      firstEx: w.firstEx,
      newIdNumber,
      newSlug,
      tmpId: `artwork.tmp-renum-${newIdNumber}-${slugify(w.title || 'verk')}`,
      finalId: `artwork.${newSlug}`,
    }
  })
}

async function main() {
  console.log(`dataset=${dataset} dryRun=${dryRun} startId=${START_ID}`)

  const plan = await buildPlan()

  console.log('\nPlan (utställning → konstnär A–Ö → verk edited):')
  for (const p of plan) {
    const same =
      p.fromId === p.finalId && p.oldIdNumber === p.newIdNumber ? ' (oförändrad)' : ''
    console.log(
      `  ${String(p.oldIdNumber).padStart(4)} ${p.oldSlug}  →  ${p.newIdNumber} ${p.newSlug}  [${p.artistName} · ${p.firstEx}]${same}`
    )
  }

  const changing = plan.filter(
    (p) =>
      !(
        p.fromId === p.finalId &&
        p.oldIdNumber === p.newIdNumber &&
        p.oldSlug === p.newSlug
      )
  )

  if (!changing.length) {
    console.log('\nInget att renumrera.')
    return
  }

  if (dryRun) {
    console.log(`\n(--dry-run) Skulle flytta ${changing.length} verk i två fas.`)
  } else {
    console.log('\nFas 1 → tmp')
    for (const p of changing) {
      await moveDoc(p.fromId, p.tmpId, {
        idNumber: p.newIdNumber,
        slug: {_type: 'slug', current: `tmp-${p.newSlug}`},
      })
    }

    console.log('\nFas 2 → final')
    for (const p of changing) {
      await moveDoc(p.tmpId, p.finalId, {
        idNumber: p.newIdNumber,
        slug: {_type: 'slug', current: p.newSlug},
      })
    }
  }

  const redirects = {}
  for (const p of plan) {
    if (p.oldSlug !== p.newSlug) redirects[p.oldSlug] = p.newSlug
  }

  const outPath = resolve(studioRoot, 'scripts/artwork-slug-map.json')
  if (!dryRun) {
    writeFileSync(outPath, JSON.stringify({plan, redirects}, null, 2) + '\n')
  }
  console.log('\nSlug-karta (gammal → ny):')
  console.log(JSON.stringify(redirects, null, 2))
  if (!dryRun) console.log('skrev', outPath)

  console.log(dryRun ? '\n(--dry-run) Ingen skrivning.' : '\n✓ Verkrenummering klar')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
