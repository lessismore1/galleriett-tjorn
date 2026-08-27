/**
 * Seed/komplettera Anna-Lisa Olausson (id 25) från Wikipedia.
 *   node scripts/patch-anna-lisa-olausson.mjs
 *
 * Källa: https://sv.wikipedia.org/wiki/Anna-Lisa_Olausson
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
  specialty: 'Målare och tecknare · landskap, stilleben, porträtt',
  deceased: true,
  profileKind: 'historical',
  born: '8 april 1922, Stenkyrka socken',
  died: '2010',
  education: [
    'Teckning för Nils Wedel, Slöjdföreningens skola, Göteborg (1947)',
    'Måleri, Hovedskous målarskola (1948)',
  ],
  intro:
    'Tjörnmålare och tecknare (1922–2010). Landskap, stilleben, figurer och porträtt; en av initiativtagarna till Tjörns konstförening.',
  bio: `Anna-Lisa Olausson, född 8 april 1922 i Stenkyrka socken (Göteborgs och Bohus län), avliden 2010, var en svensk målare och tecknare. Dotter till lantbrukaren Janne Leonard Pettersson och Bernhardina.

Studerade teckning för Nils Wedel vid Slöjdföreningens skola i Göteborg 1947 och måleri vid Hovedskous målarskola 1948. Hon målade och tecknade landskap, stilleben, figurer och porträtt i olja, svartkrita och blyerts.

Ställde ut i Skärhamn tillsammans med Gustav Ström och Sven Engblom. Tillsammans med Benita Nilsson gav hon 1994 ut boken »Bilder från en barndom Tjörn i början av 1930-talet«. Olausson och andra Tjörnmålare, bland dem Tore Kurlberg, hade årliga samlingsutställningar i Skärhamn 1970–1996. Hon var en av initiativtagarna till Tjörns konstförening och aktiv som centerpartistisk politiker i Tjörns kommun.

Verk visades under Brytningstid del 2 (2024) på GALLERIett.

Källa: https://sv.wikipedia.org/wiki/Anna-Lisa_Olausson (delvis Svenskt konstnärslexikon del IV s. 302).`,
}

const artist = await client.fetch(
  `*[_type=="artist" && idNumber==25][0]{_id, name, "slug":slug.current, image}`
)
if (!artist?._id) {
  console.error('Saknas id 25 Anna-Lisa Olausson')
  process.exit(1)
}

await client.patch(artist._id).set(patch).commit()
console.log('✓', artist.name, artist._id)
console.log('  Född', patch.born, '· Dog', patch.died)
console.log(' ', `https://galleriett-tjorn.pages.dev/konstnarer/${artist.slug}`)
if (!artist.image) console.log('  (saknar porträtt — behåller ev. crop från seed)')
