/**
 * Uppdatera Fritz Kåremar med dödsdatum (källa: användare / publik uppgift).
 *   node scripts/patch-fritz-karemar.mjs
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

const patch = {
  specialty: 'Olja',
  deceased: true,
  profileKind: 'historical',
  born: 'död 8 februari 2016',
  intro:
    'Historisk konstnär (död 8 februari 2016). Oljemålningar visades under Brytningstid del 2 (2024) på GALLERIett.',
  bio: `Fritz Kåremar, död 8 februari 2016. Verk i olja visades postumt under Brytningstid del 2 på GALLERIett (oktober–november 2024).

Öppen konstbiografi (utbildning, födelseort, lexikonposter) är fortfarande knapphändig online. Förväxla inte med den skånske målaren Fritz Kärfve (1880–1967).

Källa dödsdatum: uppgift från galleriet / publik sökning (februari 2016).`,
}

const artist = await client.fetch(`*[_type=="artist" && idNumber==23][0]{_id, name, "slug":slug.current}`)
if (!artist?._id) {
  console.error('Saknas id 23')
  process.exit(1)
}

await client.patch(artist._id).set(patch).commit()
console.log('✓', artist.name, artist._id)
console.log(' ', `https://galleriett-tjorn.pages.dev/konstnarer/${artist.slug}`)
