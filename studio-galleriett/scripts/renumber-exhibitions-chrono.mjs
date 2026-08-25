/**
 * Renumrera alla utställningar kronologiskt (start-datum) från 101 →.
 *
 *   cd studio-galleriett
 *   node scripts/renumber-exhibitions-chrono.mjs --dry-run
 *   node scripts/renumber-exhibitions-chrono.mjs
 *
 * Tvåfas (tmp → final) för att undvika _id/slug-kollisioner.
 * Uppdaterar refs (t.ex. galleryEvent.exhibition). Skriver redirect-karta till stdout.
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
const START_ID = 101

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

function slugTail(slug) {
  return String(slug).replace(/^\d+-/, '')
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
  // _id måste sättas sist — annars skriver rest._id över målet
  const next = {...rest, ...patchFields, _id: toId}
  console.log(`    ${fromId} → ${toId}`)
  if (!dryRun) {
    await client.createOrReplace(next)
    await replaceRefs(fromId, toId)
    await client.delete(fromId)
  }
  return true
}

async function main() {
  console.log(`dataset=${dataset} dryRun=${dryRun} startId=${START_ID}`)

  const exhibitions = await client.fetch(
    `*[_type=="exhibition"]|order(start asc, idNumber asc){
      _id, idNumber, title, "slug": slug.current, start, end
    }`
  )

  if (!exhibitions.length) {
    console.error('Inga utställningar')
    process.exit(1)
  }

  const plan = exhibitions.map((ex, i) => {
    const newIdNumber = START_ID + i
    const tail = slugTail(ex.slug)
    const newSlug = `${newIdNumber}-${tail}`
    return {
      fromId: ex._id,
      oldSlug: ex.slug,
      oldIdNumber: ex.idNumber,
      title: ex.title,
      start: ex.start,
      newIdNumber,
      newSlug,
      tmpId: `exhibition.tmp-renum-${String(newIdNumber).padStart(3, '0')}-${tail}`,
      finalId: `exhibition.${newSlug}`,
    }
  })

  console.log('\nPlan (kronologisk → 101+):')
  for (const p of plan) {
    const same = p.oldSlug === p.newSlug ? ' (oförändrad)' : ''
    console.log(
      `  ${String(p.oldIdNumber).padStart(3)} ${p.oldSlug}  →  ${p.newIdNumber} ${p.newSlug}  [${p.start}]${same}`
    )
  }

  const unchanged = plan.filter((p) => p.fromId === p.finalId && p.oldIdNumber === p.newIdNumber)
  const changing = plan.filter((p) => !(p.fromId === p.finalId && p.oldIdNumber === p.newIdNumber))

  if (!changing.length) {
    console.log('\nInget att renumrera.')
    return
  }

  if (dryRun) {
    console.log(`\n(--dry-run) Skulle flytta ${changing.length} utställningar i två fas.`)
  } else {
    // Fas 1: allt som ändras → tmp (undvik kollision med befintliga 101–110)
    console.log('\nFas 1 → tmp')
    for (const p of changing) {
      await moveDoc(p.fromId, p.tmpId, {
        idNumber: p.newIdNumber,
        slug: {_type: 'slug', current: `tmp-${p.newSlug}`},
      })
    }

    // Fas 2: tmp → final
    console.log('\nFas 2 → final')
    for (const p of changing) {
      await moveDoc(p.tmpId, p.finalId, {
        idNumber: p.newIdNumber,
        slug: {_type: 'slug', current: p.newSlug},
      })
    }
  }

  // Redirect-karta (gamla slug → nya)
  const redirects = {}
  for (const p of plan) {
    if (p.oldSlug !== p.newSlug) redirects[p.oldSlug] = p.newSlug
  }
  // Behåll tidigare redirect-mål om de nu flyttats vidare
  const prior = {
    '104-ljus-farg-form': '101-ljus-farg-form',
    '90-nar-datid-moter-nutid': '90-brytningstid-del-2',
  }
  for (const [from, mid] of Object.entries(prior)) {
    const final = redirects[mid] || (plan.find((p) => p.oldSlug === mid)?.newSlug)
    if (final && from !== final) redirects[from] = final
  }

  const outPath = resolve(studioRoot, 'scripts/exhibition-slug-redirects.json')
  if (!dryRun) {
    writeFileSync(outPath, JSON.stringify(redirects, null, 2) + '\n')
  }
  console.log('\nRedirects:')
  console.log(JSON.stringify(redirects, null, 2))
  if (!dryRun) console.log('skrev', outPath)

  if (unchanged.length) {
    console.log(`\nOförändrade: ${unchanged.length}`)
  }

  console.log(dryRun ? '\n(--dry-run) Ingen skrivning.' : '\n✓ Renumrering klar')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
