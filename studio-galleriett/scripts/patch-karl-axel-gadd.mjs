/**
 * Komplettera Karl Axel Gadd (id 24) från Wikipedia / Lexikonett amanda.
 *   node scripts/patch-karl-axel-gadd.mjs
 */
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {resolve, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
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
  specialty: 'Målare · landskap, stilleben, porträtt',
  born: '20 oktober 1910, Hunnebostrand – 22 september 1997, Stenungsund',
  deceased: true,
  profileKind: 'historical',
  presentedBy: 'Niklas Gadd',
  education: [
    'Slöjdföreningens skola, Göteborg',
    'Valands målarskola (Sigfrid Ullman 1937–1938, Nils Nilsson 1938–1942)',
    'Studieresor till Italien, Schweiz och Frankrike',
  ],
  intro:
    'Svensk målare från Hunnebostrand, verksam i Stenungsund. Landskap och kustbilder från Bohuslän och Skåne, stilleben och porträtt i olja och akvarell.',
  bio: `Karl Axel Gadd (folkbokförd Karl-Axel Gadd) föddes 20 oktober 1910 i Hunnebostrands församling och dog 22 september 1997 i Stenungsund.

Han var son till skepparen Karl Hilmer Gadd och Alma Josefina Johansson. Studerade för Sigfrid Ullman vid Valands målarskola 1937–1938 och för Nils Nilsson 1938–1942, samt under studieresor till bland annat Italien, Schweiz och Frankrike. Separatutställning på Olsens konsthall i Göteborg 1950; medverkade i flera samlingsutställningar.

Konsten består av stilleben, porträtt och landskap – ofta kustbilder – i olja eller akvarell. Representerad med landskapsmålningar vid skolor bland annat i Stockholm, Göteborg och Önnestad.

Gift 1942 med konstnären Ruth Birgit »Bibbi« Bergqvist; far till Ulf, Pia och Niklas Gadd.

Källor: Svenskt konstnärslexikon del II s. 261; https://sv.wikipedia.org/wiki/Karl_Axel_Gadd ; Lexikonett amanda.`,
}

const artist = await client.fetch(
  `*[_type=="artist" && idNumber==24][0]{_id, name, slug}`
)
if (!artist?._id) {
  console.error('Hittade inte artist idNumber 24')
  process.exit(1)
}

await client.patch(artist._id).set(patch).commit()
console.log('✓', artist.name, artist._id)
console.log('  Profil:', `https://galleriett-tjorn.pages.dev/konstnarer/${artist.slug?.current || artist.slug}`)
