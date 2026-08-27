/**
 * Komplettera Ulla Hillberg från familjesidan + publik info.
 *   node scripts/patch-ulla-hillberg.mjs
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
  specialty: 'Olja, akvarell och textil',
  deceased: true,
  profileKind: 'historical',
  presentedBy: 'Kerstin Hillberg',
  born: '7 april 1940',
  died: '20 augusti 2025, Donsö',
  intro:
    'Tjörnkonstnär (1940–2025). Måleri och textilt arbete; verk visades under Brytningstid del 2 (2024) på GALLERIett.',
  bio: `Ulla Hillberg, född 7 april 1940, död 20 augusti 2025 på Donsö. Begravning i Donsö kyrka 12 september 2025.

Känd som Tjörnkonstnär med verk i måleri (olja/akvarell) och textil — bland annat lapptäcken och fyrbonader knutna till engagemanget i Svenska Fyrsällskapet. Verk visades under Brytningstid del 2 på GALLERIett i Rönnäng (oktober–november 2024); dottern Kerstin Hillberg presenterade moderns konstnärskap.

DN beskriver henne även som mattelärare, SWEA-medlem och entreprenör. Förväxla inte med glaskonstnären Ulla Hultberg eller målaren Ann Hillberg.

Källor: familjesidan.se (minnesrum); DN Till minne; presentation via Kerstin Hillberg / Brytningstid.`,
}

const artist = await client.fetch(
  `*[_type=="artist" && idNumber==22][0]{_id, name, "slug":slug.current}`
)
if (!artist?._id) {
  console.error('Saknas id 22')
  process.exit(1)
}

await client.patch(artist._id).set(patch).commit()
console.log('✓', artist.name)
console.log(' ', `https://galleriett-tjorn.pages.dev/konstnarer/${artist.slug}`)
console.log('  Född', patch.born, '· Död', patch.died)
console.log('  Visas via', patch.presentedBy)
