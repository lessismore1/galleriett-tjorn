/**
 * Komplettera Maria Dutton (id 20) från mariadutton.com/biography + porträtt.
 *   node scripts/patch-maria-dutton.mjs
 */
import {createClient} from '@sanity/client'
import {readFileSync, existsSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const studioRoot = resolve(__dirname, '..')

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
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

if (!process.env.SANITY_API_TOKEN) {
  console.error('Saknar SANITY_API_TOKEN')
  process.exit(1)
}

/** Porträtt från mariadutton.com/biography (fotograf Katia Rainbow). */
const PORTRAIT_URL =
  'https://s3.amazonaws.com/wbstaticfiles/users/16148/533615_artist-maria-biryukova-dutton-photograph-by-katia-rainbow.jpg'

const patch = {
  name: 'Maria Dutton',
  specialty: 'Akvarell, tusch och grafik',
  profileKind: 'full',
  deceased: false,
  born: '1976, Moskva',
  education: [
    'Graphic design / fine art, Stroganov University of Industrial and Applied Arts, Moskva',
    'Masterexamen (examensarbete: vinetikett och förpackningsdesign)',
  ],
  intro:
    'Brittisk-rysk konstnär bosatt i Trollhättan sedan 2016. Grafisk bakgrund; arbetar med akvarell, tusch och teckning. Verk i samlingar i bland annat Storbritannien, Sverige, Norge och Ryssland.',
  bio: `Maria Biryukova-Dutton är en brittisk-rysk konstnär, född 1976 i Moskva. Efter en karriär inom grafisk design har hon återvänt till det visuella konstnärskapet. Separatutställning på Menier Gallery i London mottogs väl; verk finns i privata och offentliga samlingar i Storbritannien, Sverige, Norge, Ryssland med flera länder. Målningar och teckningar har bland annat visats i Central London (Southwark, Paddington).

Sedan 2016 är hon bosatt i Sverige (Trollhättan), där hon arbetar med konstprojekt och håller masterclasses. Uppväxten i Moskva inkluderade teater, utställningar och museer; tidiga uttryck var måleri, teckning, lera och fotografi. Studier i grafisk design vid Stroganov University of Industrial and Applied Arts i Moskva (även fine art) ledde till en personlig stil i tusch/penna — att fånga karaktär med få linjer. Masterexamen med examensarbete om vinetikett och förpackningsdesign; därefter undervisning och frilans för bland annat Heineken. Har också utvecklat och patenterat ett spel för barn med funktionsnedsättning.

Bland tidiga inspirationer nämner hon statyer i Sommarträdgården i Sankt Petersburg. Hennes farfarsfar Aleksandr Syiropyatov grundade Perm State Art Museum. Hon utforskar ett eget grafiskt uttryck med inspiration från natur, människor och platser — Svarta havet, Italien och Sverige. Verk om Sverige har bland annat visats på Göteborgs konstmuseum (2015).

Medverkade i Mellan skimmer & form på GALLERIett (juli 2025).

Källa: https://www.mariadutton.com/biography`,
  externalCv: [
    {
      _type: 'externalCvEntry',
      _key: 'web',
      year: '',
      title: 'Hemsida · mariadutton.com',
      place: 'https://www.mariadutton.com',
      note: 'Biografi och verk',
    },
    {
      _type: 'externalCvEntry',
      _key: 'bio',
      year: '',
      title: 'Biography',
      place: 'https://www.mariadutton.com/biography',
      note: '',
    },
  ],
}

async function uploadPortrait() {
  const res = await fetch(PORTRAIT_URL, {
    headers: {'User-Agent': 'Mozilla/5.0 (compatible; GALLERIettBot/1.0)'},
  })
  if (!res.ok) throw new Error(`Porträtt HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buf, {
    filename: 'maria-dutton-portrait-katia-rainbow.jpg',
    contentType: res.headers.get('content-type') || 'image/jpeg',
  })
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
    alt: 'Maria Biryukova-Dutton. Foto: Katia Rainbow',
  }
}

async function main() {
  const artist = await client.fetch(
    `*[_type=="artist" && idNumber==20][0]{_id, name, "slug":slug.current, image}`
  )
  if (!artist?._id) {
    console.error('Saknas id 20 Maria Dutton')
    process.exit(1)
  }

  let image = artist.image
  if (!image?.asset?._ref) {
    image = await uploadPortrait()
    console.log('✓ Porträtt uppladdat')
  } else {
    console.log('  Porträtt fanns redan — behåller')
  }

  await client
    .patch(artist._id)
    .set({...patch, image})
    .unset(['died', 'presentedBy'])
    .commit()

  console.log('✓', artist.name, artist._id)
  console.log('  profileKind: full')
  console.log(' ', `https://galleriett-tjorn.pages.dev/konstnarer/${artist.slug}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
