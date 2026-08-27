/**
 * Dela upp född/död för historiska konstnärer (nytt fält `died`).
 *   node scripts/migrate-artist-born-died.mjs
 */
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {resolve, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(resolve(__dirname, '../.env'), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')]
    })
)

const client = createClient({
  projectId: '81lb9elz',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: env.SANITY_API_TOKEN,
  useCdn: false,
})

const FIXES = [
  {
    idNumber: 24,
    born: '20 oktober 1910, Hunnebostrand',
    died: '22 september 1997, Stenungsund',
  },
  {
    idNumber: 23,
    born: null,
    died: '8 februari 2016',
  },
]

for (const fix of FIXES) {
  const artist = await client.fetch(`*[_type=="artist" && idNumber==$n][0]{_id, name}`, {
    n: fix.idNumber,
  })
  if (!artist?._id) {
    console.error('Saknas', fix.idNumber)
    continue
  }
  const p = client.patch(artist._id).set({
    deceased: true,
    profileKind: 'historical',
    died: fix.died,
  })
  if (fix.born) p.set({born: fix.born})
  else p.unset(['born'])
  await p.commit()
  console.log('✓', fix.idNumber, artist.name, '| född:', fix.born || '—', '| död:', fix.died)
}
