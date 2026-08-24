/**
 * Rätta felaktiga utställningsbilder i development.
 *   node scripts/fix-exhibition-images.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const studioRoot = resolve(__dirname, '..')
const webStatic = resolve(studioRoot, '../web/static')

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
  dataset: process.env.SANITY_STUDIO_DATASET || 'development',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

if (!process.env.SANITY_API_TOKEN) {
  console.error('Saknar SANITY_API_TOKEN')
  process.exit(1)
}

async function uploadImage(src) {
  const abs = resolve(webStatic, String(src).replace(/^\//, ''))
  if (!existsSync(abs)) throw new Error(`Saknar fil: ${src}`)
  const buffer = readFileSync(abs)
  const contentType =
    extname(abs).toLowerCase() === '.webp'
      ? 'image/webp'
      : extname(abs).toLowerCase() === '.png'
        ? 'image/png'
        : 'image/jpeg'
  const asset = await client.assets.upload('image', buffer, {
    filename: basename(abs),
    contentType,
  })
  console.log('  ↑', basename(abs))
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

const hero101 = await uploadImage('/images/ex-101-hero.jpg')
const hero106 = await uploadImage('/images/ex-104-hero.jpg')

await client
  .patch('exhibition.101-ljus-och-horisont')
  .set({image: hero101, cardImage: hero101})
  .commit()
console.log('✓ 101 Ljus & Horisont — kortbild = affisch')

await client
  .patch('exhibition.106-erik-halvorsen-tystnadens-rum')
  .set({image: hero106, cardImage: hero106})
  .commit()
console.log('✓ 106 Tystnadens rum — ex-104-hero (riktig foto, inte UI-thumb)')

await client
  .patch('artist.02-erik-halvorsen')
  .set({heroImage: hero106})
  .commit()
console.log('✓ Erik Halvorsen heroImage')

console.log('\nKlart — ladda om Studio/web.')
