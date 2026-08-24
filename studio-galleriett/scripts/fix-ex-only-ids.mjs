import {createClient} from '@sanity/client'
import {readFileSync, existsSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const studioRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

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
  dataset: process.env.SANITY_STUDIO_DATASET || 'development',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const fixes = [
  {id: 'artwork.106-erik-halvorsen-tystnadens-rum-vila', idNumber: 1035, year: 2026},
  {id: 'artwork.106-erik-halvorsen-tystnadens-rum-kant', idNumber: 1036, year: 2026},
  {id: 'artwork.102-per-olofsson-tidvatten-skar', idNumber: 1037, year: 2026},
  {id: 'artwork.102-per-olofsson-tidvatten-ebb', idNumber: 1038, year: 2026},
]

const allIds = fixes.flatMap((f) => [f.id, `drafts.${f.id}`])
const before = await client.fetch(`*[_id in $ids]{_id, title, idNumber, year}`, {ids: allIds})
console.log('Före:', JSON.stringify(before, null, 2))

for (const f of fixes) {
  for (const id of [f.id, `drafts.${f.id}`]) {
    const exists = before.some((d) => d._id === id)
    if (!exists && id.startsWith('drafts.')) continue
    if (!exists && !id.startsWith('drafts.')) {
      console.warn('Saknas:', id)
      continue
    }
    await client.patch(id).set({idNumber: f.idNumber, year: f.year}).commit()
    console.log('✓ patched', id, f.idNumber, f.year)
  }
}

const after = await client.fetch(`*[_id in $ids]{_id, title, idNumber, year}`, {ids: allIds})
console.log('Efter:', JSON.stringify(after, null, 2))
