/**
 * Uppdatera Fritz Kåremar: biografi + verk visas via Agneta Wilhelmson Kåremar.
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
  specialty: 'Målare · lokal kultur / Stenungsund–Tjörn',
  deceased: true,
  profileKind: 'historical',
  presentedBy: 'Agneta Wilhelmson Kåremar',
  born: '1920',
  died: '8 februari 2016, Stenungsund',
  intro:
    'Konstnär och skoldirektör (1920–2016), verksam i Stenungsund/Bohuslän. En av initiativtagarna till Stenungsunds konstförening. Verk visas via Agneta Wilhelmson Kåremar.',
  bio: `Fritz Kåremar (1920–2016) var svensk konstnär och skoldirektör, bosatt i Stenungsund. Han var starkt engagerad i det lokala kulturlivet i Bohuslän – särskilt Stenungsund och Tjörn – och en av initiativtagarna till konstföreningen i Stenungsund. Han stödde andra konstnärer och det lokala konstlivet.

Oljemålningar visades under Brytningstid del 2 (2024) på GALLERIett i Rönnäng; verk utställda via Agneta Wilhelmson Kåremar.

Dog 8 februari 2016. Förväxla inte med den skånske målaren Fritz Kärfve (1880–1967).

Källor: DN Till minne / publik biografi (maj 2016); Sveriges statskalender; GALLERIett Brytningstid.`,
}

const artist = await client.fetch(
  `*[_type=="artist" && idNumber==23][0]{_id, name, "slug":slug.current}`
)
if (!artist?._id) {
  console.error('Saknas id 23')
  process.exit(1)
}

await client.patch(artist._id).set(patch).commit()
console.log('✓', artist.name)
console.log('  Född', patch.born, '· Dog', patch.died)
console.log('  Visas via', patch.presentedBy)
console.log(' ', `https://galleriett-tjorn.pages.dev/konstnarer/${artist.slug}`)
