/**
 * Seed mockdata → Sanity dataset `development`.
 *
 *   cd studio-galleriett
 *   npm run seed:mock
 *
 * Kräver SANITY_API_TOKEN i .env (skrivrättighet).
 * Idempotent via stabila _id (createOrReplace).
 */

import {createClient} from '@sanity/client'
import {readFileSync, existsSync} from 'node:fs'
import {dirname, resolve, basename, extname} from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const studioRoot = resolve(__dirname, '..')
const webStatic = resolve(studioRoot, '../web/static')
const mockPath = resolve(studioRoot, '../web/src/lib/data/mockData.js')

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

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '81lb9elz'
const dataset = process.env.SANITY_STUDIO_DATASET || 'development'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('Saknar SANITY_API_TOKEN i .env')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
})

const assetCache = new Map()

function localPathFromMock(src) {
  if (!src) return null
  const clean = String(src).split('?')[0]
  if (!clean.startsWith('/')) return null
  return resolve(webStatic, clean.replace(/^\//, ''))
}

async function uploadImage(src) {
  if (!src) return undefined
  const abs = localPathFromMock(src)
  if (!abs) return undefined
  if (assetCache.has(abs)) return assetCache.get(abs)
  if (!existsSync(abs)) {
    console.warn('  saknar bildfil:', src)
    return undefined
  }
  const buffer = readFileSync(abs)
  const filename = basename(abs)
  const contentType =
    extname(abs).toLowerCase() === '.webp'
      ? 'image/webp'
      : extname(abs).toLowerCase() === '.png'
        ? 'image/png'
        : 'image/jpeg'
  const asset = await client.assets.upload('image', buffer, {filename, contentType})
  const image = {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
  }
  assetCache.set(abs, image)
  console.log('  ↑', filename)
  return image
}

function ref(type, id) {
  return {_type: 'reference', _ref: id, _key: id.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 64)}
}

function mapAvailability(a) {
  if (a === 'enquire' || a === 'inquiry') return 'inquiry'
  if (a === 'available' || a === 'sold' || a === 'not_for_sale') return a
  return 'inquiry'
}

function mapArticleKind(kind) {
  if (kind === 'press') return 'press'
  return 'gallery'
}

async function main() {
  console.log(`Seed → ${projectId}/${dataset}`)
  const mock = await import(pathToFileURL(mockPath).href)
  const {site, sponsors, artists, exhibitions, news, about} = mock

  const locationId = 'location.galleriett'
  await client.createOrReplace({
    _id: locationId,
    _type: 'location',
    name: 'GALLERIett',
    slug: {_type: 'slug', current: 'galleriett'},
    kind: 'gallery',
    address: `${site.address.street}\n${site.address.postal}`,
    openingHours: site.hours,
    googleMapsUrl: site.mapsUrl,
    email: site.email,
    phone: site.phone,
    website: site.url,
    image: await uploadImage(about?.image),
    description: about?.body,
  })
  console.log('✓ location')

  const artistIdBySlug = new Map()
  for (const a of artists) {
    const id = `artist.${a.slug}`
    artistIdBySlug.set(a.slug, id)
    await client.createOrReplace({
      _id: id,
      _type: 'artist',
      name: a.name,
      slug: {_type: 'slug', current: a.slug},
      specialty: a.specialty || undefined,
      born: a.born || undefined,
      education: a.education?.length ? a.education : undefined,
      intro: a.intro || undefined,
      bio: a.bio || undefined,
      image: await uploadImage(a.image),
      heroImage: await uploadImage(a.heroImage),
      pressQuotes: (a.press || [])
        .filter((p) => p.quote)
        .map((p, i) => ({
          _type: 'pressQuote',
          _key: `pq${i}`,
          quote: p.quote,
          source: p.source,
          url: p.url || undefined,
        })),
    })
    console.log('✓ artist', a.slug)
  }

  /** image path (normalized) → artwork _id */
  const artworkIdByImage = new Map()
  const artworkIdByArtistTitle = new Map()
  let nextIdNumber = 1001
  for (const a of artists) {
    for (const w of a.works || []) {
      if (typeof w.id === 'number' && w.id >= nextIdNumber) nextIdNumber = w.id + 1
    }
  }

  for (const a of artists) {
    for (const w of a.works || []) {
      const id = `artwork.${w.slug}`
      const imgKey = String(w.image || '').split('?')[0]
      await client.createOrReplace({
        _id: id,
        _type: 'artwork',
        idNumber: w.id,
        title: w.title,
        slug: {_type: 'slug', current: w.slug},
        artist: {_type: 'reference', _ref: artistIdBySlug.get(a.slug)},
        year: w.year,
        medium: w.medium || undefined,
        dimensions: w.dimensions || undefined,
        availability: mapAvailability(w.availability),
        story: w.story || undefined,
        image: await uploadImage(w.image),
      })
      if (imgKey) artworkIdByImage.set(imgKey, id)
      artworkIdByArtistTitle.set(`${a.slug}::${w.title}`, id)
      console.log('✓ artwork', w.slug)
    }
  }

  for (const ex of exhibitions) {
    const id = `exhibition.${ex.slug}`
    const artistSlugs = ex.artistSlugs?.length
      ? ex.artistSlugs
      : ex.artistSlug
        ? [ex.artistSlug]
        : []
    const workRefs = []
    for (const w of ex.works || []) {
      const imgKey = String(w.image || '').split('?')[0]
      let artId = artworkIdByImage.get(imgKey)
      if (!artId && artistSlugs.length === 1) {
        artId = artworkIdByArtistTitle.get(`${artistSlugs[0]}::${w.title}`)
      }
      // Exhibition-only works (not on artist.works) — create stub documents
      if (!artId && w.title && artistSlugs[0] && artistIdBySlug.has(artistSlugs[0])) {
        const slugBase = `${ex.slug}-${String(w.title)
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')}`
        artId = `artwork.${slugBase}`
        const year =
          w.year ||
          (ex.start ? Number(String(ex.start).slice(0, 4)) : undefined) ||
          new Date().getFullYear()
        const idNumber = nextIdNumber++
        await client.createOrReplace({
          _id: artId,
          _type: 'artwork',
          idNumber,
          title: w.title,
          slug: {_type: 'slug', current: slugBase},
          artist: {_type: 'reference', _ref: artistIdBySlug.get(artistSlugs[0])},
          year,
          medium: w.medium || undefined,
          dimensions: w.dimensions || undefined,
          availability: mapAvailability(w.availability),
          image: await uploadImage(w.image),
        })
        if (imgKey) artworkIdByImage.set(imgKey, artId)
        artworkIdByArtistTitle.set(`${artistSlugs[0]}::${w.title}`, artId)
        console.log('✓ artwork (ex-only)', idNumber, slugBase)
      }
      if (artId) {
        workRefs.push({
          _type: 'reference',
          _ref: artId,
          _key: artId.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 64),
        })
      } else {
        console.warn('  kunde inte koppla verk:', ex.slug, w.title || w.image)
      }
    }

    const installationViews = []
    for (let i = 0; i < (ex.installationViews || []).length; i++) {
      const img = await uploadImage(ex.installationViews[i])
      if (img) {
        installationViews.push({
          _type: 'installationView',
          _key: `iv${i}`,
          image: img,
        })
      }
    }

    await client.createOrReplace({
      _id: id,
      _type: 'exhibition',
      idNumber: ex.id,
      title: ex.title,
      slug: {_type: 'slug', current: ex.slug},
      artists: artistSlugs
        .filter((s) => artistIdBySlug.has(s))
        .map((s) => ({
          _type: 'reference',
          _ref: artistIdBySlug.get(s),
          _key: s.replace(/[^a-zA-Z0-9]/g, '-'),
        })),
      artistLabel: ex.artist || undefined,
      start: ex.start,
      end: ex.end,
      datesLabel: ex.datesLabel || undefined,
      status: ex.status || undefined,
      intro: ex.intro || undefined,
      pressRelease: ex.pressRelease || undefined,
      image: await uploadImage(ex.image),
      cardImage: await uploadImage(ex.cardImage),
      works: workRefs.length ? workRefs : undefined,
      installationViews: installationViews.length ? installationViews : undefined,
      location: {_type: 'reference', _ref: locationId},
      facebookEventUrl: ex.facebookEventUrl || undefined,
    })
    console.log('✓ exhibition', ex.slug)
  }

  for (const n of news) {
    const slug = n.slug
    const id = `article.${slug}`
    const artistSlugs = n.artistSlugs?.length
      ? n.artistSlugs
      : n.artistSlug
        ? [n.artistSlug]
        : []
    await client.createOrReplace({
      _id: id,
      _type: 'article',
      title: n.title,
      slug: {_type: 'slug', current: slug},
      kind: mapArticleKind(n.kind),
      publishedAt: n.date,
      dateLabel: n.dateLabel || undefined,
      excerpt: n.excerpt || undefined,
      body: n.body || undefined,
      image: await uploadImage(n.image),
      thumb: await uploadImage(n.thumb),
      source: n.source?.url
        ? {name: n.source.name, url: n.source.url}
        : undefined,
      artists: artistSlugs
        .filter((s) => artistIdBySlug.has(s))
        .map((s) => ({
          _type: 'reference',
          _ref: artistIdBySlug.get(s),
          _key: s.replace(/[^a-zA-Z0-9]/g, '-'),
        })),
      exhibition: n.exhibitionSlug
        ? {_type: 'reference', _ref: `exhibition.${n.exhibitionSlug}`}
        : undefined,
      clickable: Boolean(n.clickable),
    })
    console.log('✓ article', slug)
  }

  let order = 0
  for (const s of sponsors) {
    const id = `sponsor.${s.id}`
    await client.createOrReplace({
      _id: id,
      _type: 'sponsor',
      name: s.name,
      slug: {_type: 'slug', current: s.id},
      logo: await uploadImage(s.logo),
      url: s.url && s.url !== '/' ? s.url : undefined,
      order: order++,
    })
    console.log('✓ sponsor', s.id)
  }

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: site.name,
    tagline: site.tagline,
    email: site.email,
    phone: site.phone,
    address: `${site.address.street}\n${site.address.postal}`,
    openingHours: site.hours,
    about: about?.body,
    aboutImage: await uploadImage(about?.image),
    instagramUrl: site.social?.instagram,
    facebookUrl: site.social?.facebook,
    location: {_type: 'reference', _ref: locationId},
  })
  console.log('✓ siteSettings')

  console.log('\nKlart. Byt Studio till dataset "development" och ladda om.')
  console.log(`Assets uppladdade (unika): ${assetCache.size}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
