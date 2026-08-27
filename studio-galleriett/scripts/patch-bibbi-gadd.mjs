/**
 * Komplettera Bibbi Gadd (id 17) från publik info.
 *   node scripts/patch-bibbi-gadd.mjs
 *
 * Ruth Birgit »Bibbi« Gadd (f. Bergqvist), 9 dec 1922 Uddevalla – 19 juli 2016.
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
  specialty: 'Textil',
  deceased: true,
  profileKind: 'historical',
  presentedBy: 'Niklas Gadd',
  born: '9 december 1922, Uddevalla',
  died: '19 juli 2016, Stenungsund',
  intro:
    'Textilkonstnär (1922–2016), verksam i Stenungsund. Gift med Karl Axel Gadd; verk visas via Niklas Gadd.',
  bio: `Ruth Birgit »Bibbi« Gadd (född Bergqvist), född 9 december 1922 i Uddevalla, död 19 juli 2016 (93 år). Konstnär verksam i Stenungsund.

Gift 1942 med målaren Karl Axel Gadd (1910–1997); mor till Ulf Gadd, Pia Gadd och Niklas Gadd. Begravd tillsammans med maken på Norums kyrkogård i Stenungsunds pastorat.

Verk i textil visades under Brytningstid del 2 (2024) på GALLERIett; utställda via Niklas Gadd.

Källor: publik biografi / dödsannonsuppgifter; Wikipedia (Karl Axel Gadd); GALLERIett Brytningstid.`,
}

const artist = await client.fetch(
  `*[_type=="artist" && idNumber==17][0]{_id, name, "slug":slug.current}`
)
if (!artist?._id) {
  console.error('Saknas id 17 Bibbi Gadd')
  process.exit(1)
}

await client.patch(artist._id).set(patch).commit()
console.log('✓', artist.name)
console.log('  Född', patch.born, '· Dog', patch.died)
console.log('  Visas via', patch.presentedBy)
console.log(' ', `https://galleriett-tjorn.pages.dev/konstnarer/${artist.slug}`)
