/**
 * Renumrera kvarvarande serie i production:
 *   exhibition 104 → 101 (slug 101-ljus-farg-form)
 *   artist 09-robert → 11-robert-oldergaarden
 *   artist 10-kattis → 12-kattis-palmnas
 *
 *   cd studio-galleriett
 *   node scripts/renumber-keep-series.mjs
 *
 * Skapar nya _id, uppdaterar refs, tar bort gamla. --dry-run stöds.
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

const MAP = {
  artists: [
    {
      fromId: 'artist.09-robert-oldergaarden',
      toId: 'artist.11-robert-oldergaarden',
      idNumber: 11,
      slug: '11-robert-oldergaarden',
    },
    {
      fromId: 'artist.10-kattis-palmnas',
      toId: 'artist.12-kattis-palmnas',
      idNumber: 12,
      slug: '12-kattis-palmnas',
    },
  ],
  exhibition: {
    fromId: 'exhibition.104-ljus-farg-form',
    toId: 'exhibition.101-ljus-farg-form',
    idNumber: 101,
    slug: '101-ljus-farg-form',
  },
}

async function migrateDoc(fromId, toId, patchFields) {
  const doc = await client.getDocument(fromId)
  if (!doc) {
    console.warn('saknas', fromId)
    return null
  }
  if (await client.getDocument(toId)) {
    console.warn('mål finns redan', toId)
    return toId
  }
  const {_rev, ...rest} = doc
  const next = {
    ...rest,
    _id: toId,
    ...patchFields,
  }
  console.log(`  ${fromId} → ${toId}`)
  if (dryRun) return toId
  await client.createOrReplace(next)
  return toId
}

async function replaceRefs(oldId, newId) {
  const referring = await client.fetch(`*[references($oldId)]{_id,_type}`, {oldId})
  console.log(`  refs till ${oldId}: ${referring.length}`)
  if (dryRun) return
  for (const doc of referring) {
    // Patch all reference fields pointing at oldId → newId via mutative replace
    await client
      .patch(doc._id)
      .setIfMissing({}) // no-op anchor
      .commit()
    // Use replace for reference objects in arrays and single refs
    const full = await client.getDocument(doc._id)
    const replaced = JSON.parse(
      JSON.stringify(full).replaceAll(`"${oldId}"`, `"${newId}"`)
    )
    delete replaced._rev
    await client.createOrReplace(replaced)
  }
}

async function main() {
  console.log(`dataset=${dataset} dryRun=${dryRun}`)

  // 1) Artists first (artworks/articles/exhibition point at them)
  for (const a of MAP.artists) {
    console.log('\nArtist', a.slug)
    await migrateDoc(a.fromId, a.toId, {
      idNumber: a.idNumber,
      slug: {_type: 'slug', current: a.slug},
    })
    await replaceRefs(a.fromId, a.toId)
    if (!dryRun) {
      await client.delete(a.fromId)
      console.log('  deleted', a.fromId)
    }
  }

  // 2) Exhibition
  const ex = MAP.exhibition
  console.log('\nExhibition', ex.slug)
  await migrateDoc(ex.fromId, ex.toId, {
    idNumber: ex.idNumber,
    slug: {_type: 'slug', current: ex.slug},
  })
  await replaceRefs(ex.fromId, ex.toId)
  if (!dryRun) {
    await client.delete(ex.fromId)
    console.log('  deleted', ex.fromId)
  }

  console.log(dryRun ? '\n(--dry-run) Klart utan skrivning.' : '\n✓ Renumrering klar')
  console.log('Nya URL:er:')
  console.log('  /utstallningar/101-ljus-farg-form')
  console.log('  /konstnarer/11-robert-oldergaarden')
  console.log('  /konstnarer/12-kattis-palmnas')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
