/**
 * Renumrera konstnärer: utställning kronologiskt → A–Ö (sv), första förekomst.
 * idNumber 01… + slug `{nn}-{slugify(name)}` + `_id` `artist.{slug}`.
 *
 *   cd studio-galleriett
 *   node scripts/renumber-artists-by-exhibition.mjs --dry-run
 *   node scripts/renumber-artists-by-exhibition.mjs
 *
 * Kräver backup. Inga 301:or (sajten ej publik). Tvåfas tmp → final.
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
const START_ID = 1

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
      idNumber, title, start,
      "artists": artists[]->{_id, idNumber, name, "slug": slug.current}
    }`
  )
  const allArtists = await client.fetch(
    `*[_type=="artist"]{_id, idNumber, name, "slug": slug.current, profileKind}`
  )

  const seen = new Set()
  const seq = []

  for (const ex of exhibitions) {
    const artists = [...(ex.artists || [])].sort((a, b) =>
      (a.name || '').localeCompare(b.name || '', 'sv')
    )
    for (const a of artists) {
      if (!a?._id || seen.has(a._id)) continue
      seen.add(a._id)
      seq.push({
        ...a,
        firstEx: `${ex.idNumber} ${ex.title}`,
      })
    }
  }

  const orphans = allArtists
    .filter((a) => !seen.has(a._id))
    .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'sv'))
  for (const a of orphans) {
    seq.push({...a, firstEx: '(ingen utställning)'})
  }

  return seq.map((a, i) => {
    const newIdNumber = START_ID + i
    const pad = String(newIdNumber).padStart(2, '0')
    const tail = slugify(a.name)
    const newSlug = `${pad}-${tail}`
    return {
      fromId: a._id,
      oldSlug: a.slug,
      oldIdNumber: a.idNumber,
      name: a.name,
      profileKind: a.profileKind,
      firstEx: a.firstEx,
      newIdNumber,
      newSlug,
      tmpId: `artist.tmp-renum-${pad}-${tail}`,
      finalId: `artist.${newSlug}`,
    }
  })
}

async function main() {
  console.log(`dataset=${dataset} dryRun=${dryRun} startId=${START_ID}`)

  const drafts = await client.fetch(`count(*[_type=="artist" && _id in path("drafts.**")])`)
  if (drafts > 0) {
    console.warn(`Varning: ${drafts} draft-artister — publicera/rensa före renummering`)
  }

  const plan = await buildPlan()

  console.log('\nPlan (utställning → A–Ö, första förekomst):')
  for (const p of plan) {
    const same = p.fromId === p.finalId && p.oldIdNumber === p.newIdNumber ? ' (oförändrad)' : ''
    console.log(
      `  ${String(p.oldIdNumber).padStart(2)} ${p.oldSlug}  →  ${String(p.newIdNumber).padStart(2)} ${p.newSlug}  [${p.firstEx}]${same}`
    )
  }

  const changing = plan.filter(
    (p) => !(p.fromId === p.finalId && p.oldIdNumber === p.newIdNumber)
  )

  if (!changing.length) {
    console.log('\nInget att renumrera.')
    return
  }

  if (dryRun) {
    console.log(`\n(--dry-run) Skulle flytta ${changing.length} konstnärer i två fas.`)
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

  const outPath = resolve(studioRoot, 'scripts/artist-slug-map.json')
  if (!dryRun) {
    writeFileSync(outPath, JSON.stringify({plan, redirects}, null, 2) + '\n')
  }
  console.log('\nSlug-karta (gammal → ny):')
  console.log(JSON.stringify(redirects, null, 2))
  if (!dryRun) console.log('skrev', outPath)

  console.log(dryRun ? '\n(--dry-run) Ingen skrivning.' : '\n✓ Konstnärsrenummering klar')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
