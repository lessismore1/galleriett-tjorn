/**
 * Komplettera Ellinor Bartholdzon (id 16) från publik info.
 *   node scripts/patch-ellinor-bartholdzon.mjs
 *
 * Källor: gravar.se (Rönnäng), Tjörns hembygdsförening, Google AI-översikt.
 * Folkbokfört tilltalsnamn ofta Elinor; utställningsnamn Ellinor behålls.
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
  specialty: 'Textil · klädskapande',
  deceased: true,
  profileKind: 'historical',
  born: '19 december 1922',
  died: '8 november 2015, Rönnäng',
  intro:
    'Klädskapare och textilkonstnär från Rönnäng (1922–2015). Unika plagg och textilt arbete; starkt knuten till Tjörns konst- och hembygdsliv.',
  bio: `Ellinor Bartholdzon (folkbokförd Birgit Elinor Vilhelmina Bartholdzon), född 19 december 1922, död 8 november 2015 i Rönnäng på Tjörn.

Svensk textilkonstnär och klädskapare, verksam i Rönnäng. Hon formgav unika klädesplagg och arbetade med textil; hade också intresse för måleri och besökte ofta Nordiska Akvarellmuseet i Skärhamn. 2013 utkom hennes bok »Min väg«, där hon berättar om sitt liv. Tjörns hembygdsförening har lyft hennes skapande (bland annat berättarkväll och utställning av egenformgivna kläder).

Verk / närvaro under Brytningstid del 2 (2024) på GALLERIett.

Källor: gravar.se (Rönnäng); Tjörns hembygdsförening; publik biografi.`,
}

const artist = await client.fetch(
  `*[_type=="artist" && idNumber==16][0]{_id, name, "slug":slug.current}`
)
if (!artist?._id) {
  console.error('Saknas id 16 Ellinor Bartholdzon')
  process.exit(1)
}

await client.patch(artist._id).set(patch).commit()
console.log('✓', artist.name)
console.log('  Född', patch.born, '· Dog', patch.died)
console.log(' ', `https://galleriett-tjorn.pages.dev/konstnarer/${artist.slug}`)
