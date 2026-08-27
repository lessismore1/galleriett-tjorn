/**
 * Gott och Blandat (116) — konstnärer från IG-affisch
 * https://www.instagram.com/p/Db3W26KlgMd/
 *
 *   node scripts/seed-gott-och-blandat-artists.mjs
 *
 * På affischen men EXKLUDERADE (vill inte stå som utställare):
 *   Helen Martinsson, Mats Andersson, Ronny Carlansson
 *
 * Befintliga: 14 Ann-Louise, 21 Christina, 26 Maria Arrhenius
 * Stubbar:    35 Agneta Kåremar, 36 Hans Wilhelmson, 37 Niklas Gadd
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

const IG_POST = 'https://www.instagram.com/p/Db3W26KlgMd/'
const EXHIBITION_ID = 'exhibition.116-gott-och-blandat'

/** Posterordning minus Helen / Mats / Ronny. */
const LINEUP = [
  {idNumber: 35, name: 'Agneta Kåremar', kind: 'stub'},
  {idNumber: 14, name: 'Ann-Louise Schwieger', kind: 'existing'},
  {idNumber: 21, name: 'Christina Måneskiöld', kind: 'existing'},
  {idNumber: 36, name: 'Hans Wilhelmson', kind: 'stub'},
  {idNumber: 26, name: 'Maria Arrhenius', kind: 'existing'},
  {idNumber: 37, name: 'Niklas Gadd', kind: 'stub'},
]

const EXCLUDED = ['Helen Martinsson', 'Mats Andersson', 'Ronny Carlansson']

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
    intro: `Utställare under Gott och Blandat (2026) på GALLERIett.`,
  })
  console.log('✓ stub', slug)
  return id
}

async function resolveExisting(idNumber) {
  const a = await client.fetch(
    `*[_type=="artist" && idNumber==$n][0]{_id, name, "slug": slug.current}`,
    {n: idNumber}
  )
  if (!a?._id) throw new Error(`Saknar befintlig artist id ${idNumber}`)
  console.log('· befintlig', a.slug, '—', a.name)
  return a._id
}

async function main() {
  console.log('Exkluderade (skapas ej / länkas ej):', EXCLUDED.join(', '))

  const artistIds = []
  for (const row of LINEUP) {
    const id =
      row.kind === 'stub' ? await ensureStub(row) : await resolveExisting(row.idNumber)
    artistIds.push({
      _type: 'reference',
      _ref: id,
      _key: slugify(row.name),
    })
  }

  const labelNames = LINEUP.map((r) => r.name)
  const artistLabel = labelNames.join(' · ')

  const existingSources =
    (await client.fetch(`*[_id==$id][0].sources`, {id: EXHIBITION_ID})) || []
  const sources = [...existingSources]
  if (!sources.some((s) => s.url === IG_POST)) {
    sources.push({
      _type: 'sourceLink',
      _key: 'ig-gott-och-blandat',
      label: 'Instagram · affisch',
      url: IG_POST,
    })
  }

  await client
    .patch(EXHIBITION_ID)
    .set({
      artists: artistIds,
      artistLabel,
      sources,
      intro:
        'Grupputställning med konstnärer verksamma på Tjörn. Måleri i akvarell och akryl, skulptur i trä samt verk av återbrukade material. Vernissage lördag 15 augusti kl. 12–16.',
    })
    .commit()

  console.log('\n✓ Gott och Blandat 116 —', artistIds.length, 'konstnärer')
  console.log(' ', labelNames.join(', '))
  console.log('  http://localhost:5173/utstallningar/116-gott-och-blandat')
  console.log('  https://galleriett-tjorn.pages.dev/utstallningar/116-gott-och-blandat')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
