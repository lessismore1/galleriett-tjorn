/**
 * Ladda upp hero-affisch till exhibition.118-kustkonst-host
 *
 *   node scripts/upload-kustkonst-host-image.mjs
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

const EX_ID = 'exhibition.118-kustkonst-host'
const IMAGE_PATH = resolve(studioRoot, 'assets/kustkonst-host-2026-hero.png')

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('Saknar SANITY_API_TOKEN')
    process.exit(1)
  }
  if (!existsSync(IMAGE_PATH)) {
    console.error('Saknar bild', IMAGE_PATH)
    process.exit(1)
  }
  const doc = await client.getDocument(EX_ID)
  if (!doc) {
    console.error('Saknar', EX_ID)
    process.exit(1)
  }

  const buf = readFileSync(IMAGE_PATH)
  const asset = await client.assets.upload('image', buf, {
    filename: 'kustkonst-host-2026-hero.png',
    contentType: 'image/png',
  })
  const image = {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
  }

  await client
    .patch(EX_ID)
    .set({
      image,
      // synka titel/label med affischton
      title: 'Kustkonst — Höst hos GALLERIett',
      artistLabel: 'TKS · Kustkonst höst',
    })
    .unset(['status']) // behåll tom = beräknas från datum
    .commit()

  // Publicera även draft om den finns (Studio-utkast)
  const draftId = `drafts.${EX_ID}`
  if (await client.getDocument(draftId)) {
    await client
      .patch(draftId)
      .set({image, title: 'Kustkonst — Höst hos GALLERIett', artistLabel: 'TKS · Kustkonst höst'})
      .commit()
    console.log('✓ uppdaterade även draft')
  }

  console.log('✓ image', asset._id)
  console.log('Studio:', `https://studio.galleriett-tjorn.se/structure/exhibition;${EX_ID}`)
  console.log('Live:', 'https://galleriett-tjorn.pages.dev/utstallningar/118-kustkonst-host')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
