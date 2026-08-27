/**
 * Advent (109) — konstnärer från IG-affisch
 * https://www.instagram.com/p/DSaDonOCiRQ/
 *
 *   node scripts/seed-advent-artists.mjs
 *
 * Befintliga: 13 Liselotte, 14 Ann-Louise, 21 Christina, 27 Annika
 * Från KmH:   30 Eva Bergelin
 * Stubbar:    31–34 Marie, Ann-Charlotte Dahlstedt, Susan, Susanne
 */
import {createClient} from '@sanity/client'
import {readFileSync, existsSync, writeFileSync, mkdirSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {spawnSync} from 'node:child_process'

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

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
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

const IG_POST = 'https://www.instagram.com/p/DSaDonOCiRQ/'
const EXHIBITION_ID = 'exhibition.109-advent'

/** Posterordning från IG-affischen. */
const LINEUP = [
  {idNumber: 30, name: 'Eva Bergelin', kind: 'kmh', kmhSlug: 'eva-bergelin'},
  {idNumber: 31, name: 'Marie Bronedahl', kind: 'stub'},
  {idNumber: 32, name: 'Ann-Charlotte Dahlstedt', kind: 'stub'},
  {
    idNumber: 13,
    name: 'Barbro Liselotte Holmgren-Gadd',
    kind: 'existing',
    matchId: 13,
  },
  {idNumber: 21, name: 'Christina Måneskiöld', kind: 'existing', matchId: 21},
  {idNumber: 14, name: 'Ann-Louise Schwieger', kind: 'existing', matchId: 14},
  {
    idNumber: 27,
    name: 'Annika Lövgren Rutgersson',
    kind: 'rename',
    matchId: 27,
  },
  {idNumber: 33, name: 'Susan Romanov', kind: 'stub'},
  {idNumber: 34, name: 'Susanne Swedenborg', kind: 'stub'},
]

async function ensureStub({idNumber, name}) {
  const existing = await client.fetch(
    `*[_type=="artist" && idNumber==$n][0]{_id, name, "slug": slug.current}`,
    {n: idNumber}
  )
  if (existing?._id) {
    console.log('· stub finns', existing.slug)
    return existing._id
  }
  const slug = `${String(idNumber).padStart(2, '0')}-${slugify(name)}`
  const id = `artist.${slug}`
  await client.createOrReplace({
    _id: id,
    _type: 'artist',
    idNumber,
    name,
    slug: {_type: 'slug', current: slug},
    profileKind: 'stub',
    deceased: false,
    intro: `Utställare under Advent (2025) på GALLERIett.`,
  })
  console.log('✓ stub', slug)
  return id
}

async function resolveExisting(idNumber, displayName) {
  const a = await client.fetch(
    `*[_type=="artist" && idNumber==$n][0]{_id, name, "slug": slug.current}`,
    {n: idNumber}
  )
  if (!a?._id) throw new Error(`Saknar befintlig artist id ${idNumber}`)
  console.log('· befintlig', a.slug, '—', a.name)
  return a._id
}

async function renameAnnika() {
  const a = await client.fetch(
    `*[_type=="artist" && idNumber==27][0]{_id, name, intro}`
  )
  if (!a?._id) throw new Error('Saknar Annika id 27')
  if (a.name === 'Annika Lövgren Rutgersson') {
    console.log('· Annika redan Rutgersson')
    return a._id
  }
  const patch = {name: 'Annika Lövgren Rutgersson'}
  if (!a.intro || /Brytningstid/i.test(a.intro)) {
    patch.intro =
      'Utställare under Brytningstid del 2 (2024) och Advent (2025) på GALLERIett.'
  }
  await client.patch(a._id).set(patch).commit()
  console.log('✓ bytte namn', a.name, '→ Annika Lövgren Rutgersson')
  return a._id
}

async function importEvaFromKmh() {
  const existing = await client.fetch(
    `*[_type=="artist" && idNumber==30][0]{_id, profileKind, kmhSlug}`
  )
  if (existing?.kmhSlug === 'eva-bergelin' || existing?.profileKind === 'kmh') {
    console.log('· Eva Bergelin finns redan', existing._id)
    return existing._id
  }
  console.log('→ importerar Eva Bergelin från KmH…')
  const r = spawnSync(
    process.execPath,
    [
      resolve(__dirname, 'seed-artist-from-kmh.mjs'),
      '--kmh=eva-bergelin',
      '--id=30',
    ],
    {cwd: studioRoot, encoding: 'utf8', env: process.env}
  )
  if (r.stdout) process.stdout.write(r.stdout)
  if (r.stderr) process.stderr.write(r.stderr)
  if (r.status !== 0) throw new Error('KmH-import Eva misslyckades')
  const after = await client.fetch(
    `*[_type=="artist" && idNumber==30][0]._id`
  )
  if (!after) throw new Error('Eva saknas efter import')
  return after
}

async function uploadIgPoster() {
  const tmpDir = resolve(__dirname, '.tmp')
  mkdirSync(tmpDir, {recursive: true})
  const dest = resolve(tmpDir, 'advent-poster-ig.jpg')
  const res = await fetch(`${IG_POST}media/?size=l`, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  })
  if (!res.ok) throw new Error(`IG media ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(dest, buf)
  const asset = await client.assets.upload('image', buf, {
    filename: '109-advent-ig-poster.jpg',
    contentType: 'image/jpeg',
  })
  console.log('✓ affisch från IG uppladdad')
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

async function main() {
  const artistIds = []

  for (const row of LINEUP) {
    let id
    if (row.kind === 'kmh') {
      id = await importEvaFromKmh()
    } else if (row.kind === 'stub') {
      id = await ensureStub(row)
    } else if (row.kind === 'rename') {
      id = await renameAnnika()
    } else {
      id = await resolveExisting(row.matchId, row.name)
    }
    artistIds.push({
      _type: 'reference',
      _ref: id,
      _key: slugify(row.name),
    })
  }

  const image = await uploadIgPoster()

  const artistLabel = [
    'Eva Bergelin',
    'Marie Bronedahl',
    'Ann-Charlotte Dahlstedt',
    'Liselotte Holmgren-Gadd',
    'Christina Måneskiöld',
    'Ann-Louise Schwieger',
    'Annika Lövgren Rutgersson',
    'Susan Romanov',
    'Susanne Swedenborg',
  ].join(' · ')

  const existingSources =
    (await client.fetch(`*[_id==$id][0].sources`, {id: EXHIBITION_ID})) || []
  const sources = [...existingSources]
  if (!sources.some((s) => s.url === IG_POST)) {
    sources.push({
      _type: 'sourceLink',
      _key: 'ig-advent-poster',
      label: 'Instagram · affisch',
      url: IG_POST,
    })
  }

  await client
    .patch(EXHIBITION_ID)
    .set({
      artists: artistIds,
      artistLabel,
      image,
      datesLabel: 'Adventshelgerna 29–30 nov, 6–7, 13–14 och 20–21 dec 2025',
      intro:
        'Utställning och marknadstorg på GALLERIett under adventshelgerna (lör–sön 12–17).',
      sources,
    })
    .commit()

  console.log('\n✓ Advent 109 uppdaterad med', artistIds.length, 'konstnärer')
  console.log('  http://localhost:5173/utstallningar/109-advent')
  console.log('  https://galleriett-tjorn.pages.dev/utstallningar/109-advent')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
