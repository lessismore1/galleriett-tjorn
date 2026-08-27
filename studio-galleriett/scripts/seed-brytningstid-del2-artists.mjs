/**
 * Seed/uppdatera 12 utställare från Brytningstid del 2-affischen
 * https://www.instagram.com/p/DBZNaMVKr4J/
 *
 *   node scripts/seed-brytningstid-del2-artists.mjs
 *
 * Christina Måneskiöld: kör gärna även
 *   node scripts/seed-artist-from-kmh.mjs --kmh=christina-maneskioeld --id=21
 * (scriptet sätter stub+porträtt från affisch; KmH-importen uppgraderar till kmh/full)
 */
import {createClient} from '@sanity/client'
import {readFileSync, existsSync, mkdirSync, copyFileSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const studioRoot = resolve(__dirname, '..')
const POSTER = resolve(studioRoot, '.tmp-kmh/brytningstid-artists-full.png')
const CROP_DIR = resolve(studioRoot, '.tmp-kmh/crops')
const EXHIBITION_ID = 'exhibition.101-brytningstid-del-2'
const IG = 'https://www.instagram.com/p/DBZNaMVKr4J/'

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

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
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

/** Portrait grid on poster (767×866). Photo-only crops. */
const GRID = {
  xs: [58, 296, 534],
  ysTidigare: [178, 338],
  ysNuvarande: [518, 678],
  w: 175,
  h: 148,
}

/**
 * @typedef {{
 *   idNumber: number
 *   name: string
 *   specialty: string
 *   profileKind: 'full'|'stub'|'kmh'|'historical'
 *   deceased?: boolean
 *   presentedBy?: string
 *   kmhSlug?: string
 *   crop: [number, number, 'tid'|'nuv'] // col, row, section
 *   keepExistingImage?: boolean
 * }} ArtistSeed
 */

/** @type {ArtistSeed[]} */
const ARTISTS = [
  // Tidigare
  {
    idNumber: 22,
    name: 'Ulla Hillberg',
    specialty: 'Olja och akvarell',
    profileKind: 'historical',
    deceased: true,
    crop: [0, 0, 'tid'],
  },
  {
    idNumber: 16,
    name: 'Ellinor Bartholdzon',
    specialty: 'Olja',
    profileKind: 'historical',
    deceased: true,
    crop: [1, 0, 'tid'],
  },
  {
    idNumber: 17,
    name: 'Bibbi Gadd',
    specialty: 'Textil',
    profileKind: 'historical',
    deceased: true,
    presentedBy: 'Niklas Gadd',
    crop: [2, 0, 'tid'],
  },
  {
    idNumber: 23,
    name: 'Fritz Kåremar',
    specialty: 'Olja',
    profileKind: 'historical',
    deceased: true,
    crop: [0, 1, 'tid'],
  },
  {
    idNumber: 24,
    name: 'Karl Axel Gadd',
    specialty: 'Olja och akvarell',
    profileKind: 'historical',
    deceased: true,
    presentedBy: 'Niklas Gadd',
    crop: [1, 1, 'tid'],
  },
  {
    idNumber: 25,
    name: 'Anna-Lisa Olausson',
    specialty: 'Olja och akvarell',
    profileKind: 'historical',
    deceased: true,
    crop: [2, 1, 'tid'],
  },
  // Nuvarande
  {
    idNumber: 26,
    name: 'Maria Arrhenius',
    specialty: 'Akvarell',
    profileKind: 'stub',
    crop: [0, 0, 'nuv'],
  },
  {
    idNumber: 27,
    name: 'Annika Lövgren',
    specialty: 'Akryl',
    profileKind: 'stub',
    crop: [1, 0, 'nuv'],
  },
  {
    idNumber: 28,
    name: 'Carl Håkan Källåker',
    specialty: 'Olja, akryl, collage',
    profileKind: 'stub',
    crop: [2, 0, 'nuv'],
  },
  {
    idNumber: 29,
    name: 'Karl Gadd',
    specialty: 'Återbruk',
    profileKind: 'stub',
    crop: [0, 1, 'nuv'],
  },
  {
    idNumber: 21,
    name: 'Christina Måneskiöld',
    specialty: 'Akryl, akvarell',
    profileKind: 'kmh',
    kmhSlug: 'christina-maneskioeld',
    crop: [1, 1, 'nuv'],
  },
  {
    idNumber: 14,
    name: 'Ann-Louise Schwieger',
    specialty: 'Mixed media',
    profileKind: 'kmh',
    kmhSlug: 'ann-louise-schwieger',
    crop: [2, 1, 'nuv'],
    keepExistingImage: true,
  },
]

async function ensurePoster() {
  if (existsSync(POSTER)) return
  const fallback = resolve(
    'C:/Users/ronny/.cursor/projects/c-projects-lessismore1-galleriett/assets/c__Users_ronny_AppData_Roaming_Cursor_User_workspaceStorage_cb47230c79b51f297bfe96f5940b88f9_images_image-e089b0d7-d0c5-4580-b52f-5b0a987223c9.png'
  )
  if (!existsSync(fallback)) {
    console.error('Saknar affisch:', POSTER)
    process.exit(1)
  }
  mkdirSync(dirname(POSTER), {recursive: true})
  copyFileSync(fallback, POSTER)
}

async function cropPortrait(a) {
  const [col, row, section] = a.crop
  const ys = section === 'tid' ? GRID.ysTidigare : GRID.ysNuvarande
  const left = GRID.xs[col]
  const top = ys[row]
  mkdirSync(CROP_DIR, {recursive: true})
  const out = resolve(CROP_DIR, `${slugify(a.name)}.jpg`)
  await sharp(POSTER)
    .extract({left, top, width: GRID.w, height: GRID.h})
    .jpeg({quality: 90})
    .toFile(out)
  return out
}

async function uploadImage(absPath, filename) {
  const buf = readFileSync(absPath)
  const asset = await client.assets.upload('image', buf, {filename, contentType: 'image/jpeg'})
  return {asset: {_type: 'reference', _ref: asset._id}}
}

async function main() {
  await ensurePoster()
  const ex = await client.getDocument(EXHIBITION_ID)
  if (!ex) {
    console.error('Saknar utställning', EXHIBITION_ID)
    process.exit(1)
  }

  const artistRefs = []

  for (const a of ARTISTS) {
    const existing = await client.fetch(
      `*[_type=="artist" && idNumber==$n][0]{_id, slug, image, specialty, intro, bio, externalCv, profileKind, kmhSlug}`,
      {n: a.idNumber}
    )
    const slug = `${String(a.idNumber).padStart(2, '0')}-${slugify(a.name)}`
    const artistId = existing?._id || `artist.${slug}`
    const slugCurrent = existing?.slug?.current || slug

    let image = existing?.image
    if (!(a.keepExistingImage && image?.asset?._ref)) {
      const cropPath = await cropPortrait(a)
      image = await uploadImage(cropPath, `${slug}-portrait.jpg`)
    }

    const intro =
      existing?.intro ||
      (a.profileKind === 'historical'
        ? `${a.name} — tidigare konstnär, utställd under Brytningstid del 2 (2024) på GALLERIett.${
            a.presentedBy ? ` Verk visas via ${a.presentedBy}.` : ''
          }`
        : `Utställare under Brytningstid del 2 (2024) på GALLERIett.`)

    const externalCv = [...(existing?.externalCv || [])]
    if (a.kmhSlug && !externalCv.some((e) => String(e.note || '').includes('konstmedhorisont'))) {
      externalCv.push({
        _type: 'externalCvEntry',
        _key: 'kmh-profile',
        year: '2026',
        title: 'Konst med Horisont',
        place: 'Tjörn',
        note: `https://konstmedhorisont.se/ar/2026/konstnarer/${a.kmhSlug}`,
      })
    }

    const doc = {
      _id: artistId,
      _type: 'artist',
      idNumber: a.idNumber,
      name: a.name,
      slug: {_type: 'slug', current: slugCurrent},
      profileKind: a.profileKind,
      specialty: existing?.specialty || a.specialty,
      deceased: Boolean(a.deceased),
      presentedBy: a.presentedBy || undefined,
      kmhSlug: a.kmhSlug || existing?.kmhSlug || undefined,
      intro,
      bio: existing?.bio,
      image,
      externalCv: externalCv.length ? externalCv : undefined,
    }

    await client.createOrReplace(doc)
    artistRefs.push({
      _type: 'reference',
      _ref: artistId,
      _key: slugify(a.name),
    })
    console.log('✓', a.idNumber, a.name, `(${a.profileKind})`)
  }

  // Uppdatera utställning 101 med alla 12 + behåll ev. övriga (t.ex. TKS) — ersätt med namngivna
  await client
    .patch(EXHIBITION_ID)
    .set({
      artists: artistRefs,
      artistLabel: 'Tidigare och nuvarande konstnärer · Brytningstid del 2',
      cardImage: ex.cardImage || ex.image,
    })
    .commit()
  console.log('✓ kopplade', artistRefs.length, 'konstnärer →', EXHIBITION_ID)

  // Markera befintliga rika profiler + TKS-stub
  for (const n of [11, 12, 13, 18]) {
    const row = await client.fetch(`*[_type=="artist" && idNumber==$n][0]{_id}`, {n})
    if (row?._id) {
      await client.patch(row._id).set({profileKind: 'full'}).commit()
      console.log('✓ profileKind full', n)
    }
  }
  const tks = await client.fetch(`*[_type=="artist" && idNumber==15][0]{_id}`)
  if (tks?._id) {
    await client.patch(tks._id).set({profileKind: 'stub'}).commit()
    console.log('✓ profileKind stub 15 TKS')
  }

  console.log('Källa:', IG)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
