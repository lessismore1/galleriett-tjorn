import {createClient} from '@sanity/client'
import {readFileSync, existsSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const studioRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = resolve(studioRoot, '.env')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    const k = t.slice(0, i).trim()
    let v = t.slice(i + 1).trim()
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    )
      v = v.slice(1, -1)
    if (!process.env[k]) process.env[k] = v
  }
}

const c = createClient({
  projectId: '81lb9elz',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const rows = await c.fetch(`{
  "artists": *[_type=="artist"]|order(idNumber){idNumber, "slug":slug.current, name},
  "exhibitions": *[_type=="exhibition"]|order(idNumber){idNumber, "slug":slug.current, title},
  "artworks": count(*[_type=="artwork"]),
  "articles": *[_type=="article"]{"slug":slug.current}
}`)
console.log(JSON.stringify(rows, null, 2))
