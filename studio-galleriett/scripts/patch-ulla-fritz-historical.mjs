/**
 * Tunna, källsäkra uppdateringar för Ulla Hillberg + Fritz Kåremar.
 *   node scripts/patch-ulla-fritz-historical.mjs
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

/** @type {Record<number, object>} */
const PATCHES = {
  22: {
    name: 'Ulla Hillberg',
    specialty: 'Olja och akvarell',
    deceased: true,
    profileKind: 'historical',
    born: null,
    intro:
      'Historisk konstnär. Verk i olja och akvarell visades under Brytningstid del 2 (2024) på GALLERIett.',
    bio: `Ulla Hillberg ingår bland de historiska konstnärer vars verk visades i Brytningstid del 2 på GALLERIett (oktober–november 2024).

Publik konstbiografi är mycket knapphändig: ingen träff i Lexikonett amanda, Wikipedia eller auktionskataloger under detta namn.

Släktforskningspost: Ulla Birgitta Hillberg, född 21 september 1921 i Göteborgs Annedal, död 3 oktober 2012 i Skärhamn (Stenkyrka, Tjörn). Om det är samma person behöver bekräftas av familj/galleriet innan årtalen låses.

Obs: DN:s »Till minne« om Ulla Hillberg, Donsö (mattelärare/entreprenör, ca 1940–2025) och glaskonstnären Ulla Hultberg är andra personer.`,
  },
  23: {
    name: 'Fritz Kåremar',
    specialty: 'Olja',
    deceased: true,
    profileKind: 'historical',
    born: null,
    intro:
      'Historisk konstnär. Oljemålningar visades under Brytningstid del 2 (2024) på GALLERIett.',
    bio: `Fritz Kåremar ingår bland de historiska konstnärer vars verk visades i Brytningstid del 2 på GALLERIett (oktober–november 2024).

Ingen offentlig konstnärsbiografi, Wikipedia-sida eller auktionskatalog har hittats under namnet Fritz Kåremar. Lexikonett amanda ger ingen träff.

Viktigt: förväxla inte med den skånske målaren Fritz Kärfve (1880–1967), som har omfattande dokumentation.

Levnadsuppgifter och utbildning saknas i öppna källor — komplettera gärna via släkt/bo när ni har säkra fakta.`,
  },
}

for (const [idNumber, patch] of Object.entries(PATCHES)) {
  const n = Number(idNumber)
  const artist = await client.fetch(`*[_type=="artist" && idNumber==$n][0]{_id, name}`, {n})
  if (!artist?._id) {
    console.error('Saknas id', n)
    continue
  }
  const p = client.patch(artist._id).set({
    specialty: patch.specialty,
    deceased: patch.deceased,
    profileKind: patch.profileKind,
    intro: patch.intro,
    bio: patch.bio,
  })
  if (patch.born) p.set({born: patch.born})
  else p.unset(['born'])
  await p.commit()
  console.log('✓', n, artist.name)
}
