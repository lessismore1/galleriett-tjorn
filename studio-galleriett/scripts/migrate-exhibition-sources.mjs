/**
 * Flytta Instagram/övriga URL:er från facebookEventUrl → sources[].
 * Behåller bara riktiga facebook.com/events/ i facebookEventUrl.
 *
 *   node scripts/migrate-exhibition-sources.mjs
 *   node scripts/migrate-exhibition-sources.mjs --dry-run
 */
import {createClient} from '@sanity/client'
import {readFileSync, existsSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const studioRoot = resolve(__dirname, '..')
const dryRun = process.argv.includes('--dry-run')

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

function labelForUrl(url) {
  if (/instagram\.com/i.test(url)) return 'Instagram'
  if (/facebook\.com/i.test(url)) return 'Facebook'
  if (/konstmedhorisont\.se/i.test(url)) return 'Konst med Horisont'
  if (/tjornkonst\.se/i.test(url)) return 'TKS'
  return 'Källa'
}

function isFacebookEvent(url) {
  return /facebook\.com\/events\//i.test(url || '')
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

// Extra IG-källor som aldrig låg i facebookEventUrl
const EXTRA = {
  'exhibition.101-brytningstid-del-2': [
    {
      label: 'Instagram · utställare',
      url: 'https://www.instagram.com/p/DBZNaMVKr4J/',
    },
  ],
}

async function main() {
  const rows = await client.fetch(
    `*[_type=="exhibition"]{_id, title, facebookEventUrl, sources}`
  )

  for (const ex of rows) {
    const sources = [...(ex.sources || [])]
    const existingUrls = new Set(sources.map((s) => s.url).filter(Boolean))
    let fb = ex.facebookEventUrl || null
    let changed = false

    if (fb && !isFacebookEvent(fb)) {
      if (!existingUrls.has(fb)) {
        sources.push({
          _type: 'sourceLink',
          _key: `src-${sources.length}`,
          label: labelForUrl(fb),
          url: fb,
        })
        existingUrls.add(fb)
      }
      fb = null
      changed = true
    }

    for (const extra of EXTRA[ex._id] || []) {
      if (!existingUrls.has(extra.url)) {
        sources.push({
          _type: 'sourceLink',
          _key: `src-${sources.length}`,
          label: extra.label,
          url: extra.url,
        })
        existingUrls.add(extra.url)
        changed = true
      }
    }

    if (!changed && JSON.stringify(sources) === JSON.stringify(ex.sources || [])) continue

    console.log(
      dryRun ? '○' : '✓',
      ex._id,
      '| fb:',
      fb || '—',
      '| sources:',
      sources.length
    )
    if (dryRun) continue

    const patch = client.patch(ex._id).set({sources})
    if (fb) patch.set({facebookEventUrl: fb})
    else patch.unset(['facebookEventUrl'])
    await patch.commit()
  }

  console.log(dryRun ? '\n(--dry-run)' : '\n✓ Klart')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
