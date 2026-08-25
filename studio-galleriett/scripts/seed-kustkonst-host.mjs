/**
 * Seed Kustkonst höst 2026 (mall: exhibition.114-kustkonst-sommar-hos-galleriett)
 *
 *   node scripts/seed-kustkonst-host.mjs
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

const TEMPLATE_ID = 'exhibition.114-kustkonst-sommar-hos-galleriett'
const ARTIST_ID = 'artist.15-tks-medlemmar'

async function main() {
  const template = await client.getDocument(TEMPLATE_ID)
  if (!template) {
    console.error('Saknar mall', TEMPLATE_ID)
    process.exit(1)
  }
  if (!(await client.getDocument(ARTIST_ID))) {
    console.error('Saknar', ARTIST_ID)
    process.exit(1)
  }

  const idNumber = 118
  const slug = '118-kustkonst-host'
  const exhibitionId = `exhibition.${slug}`

  await client.createOrReplace({
    _id: exhibitionId,
    _type: 'exhibition',
    idNumber,
    title: 'Kustkonst höst',
    slug: {_type: 'slug', current: slug},
    artists: [{_type: 'reference', _ref: ARTIST_ID, _key: 'tks-medlemmar'}],
    artistLabel: 'TKS · Kustkonst höst',
    start: '2026-09-19',
    end: '2026-09-27',
    datesLabel: '19 – 27 SEP 2026',
    intro:
      'Höstutställning på GALLERIett. Vernissage lördag 19 september kl. 12–17. Öppet tis–sön 12–17.',
    location: template.location || {_type: 'reference', _ref: 'location.galleriett'},
    // Ingen sommar-affisch — lägg höstaffisch i Studio när den finns
  })
  console.log('✓ exhibition', slug)

  await client.createOrReplace({
    _id: 'galleryEvent.vernissage-kustkonst-host-2026',
    _type: 'galleryEvent',
    title: 'Vernissage — Kustkonst höst',
    slug: {_type: 'slug', current: 'vernissage-kustkonst-host-2026'},
    kind: 'vernissage',
    date: '2026-09-19T12:00:00',
    datesLabel: 'Lördag 19 september kl. 12–17',
    body: 'Vernissage för utställningen Kustkonst höst. Öppet kl. 12–17.',
    exhibition: {_type: 'reference', _ref: exhibitionId},
    artists: [{_type: 'reference', _ref: ARTIST_ID, _key: 'tks'}],
    location: template.location || {_type: 'reference', _ref: 'location.galleriett'},
  })
  console.log('✓ event vernissage-kustkonst-host-2026')

  console.log('\nKlart:', `https://galleriett-tjorn.pages.dev/utstallningar/${slug}`)
  console.log(
    'Studio:',
    `https://studio.galleriett-tjorn.se/structure/exhibition;${exhibitionId}`
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
