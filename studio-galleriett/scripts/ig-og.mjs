/** Fetch Instagram og-tags for one post URL. Usage: node scripts/ig-og.mjs <url> */
const url = process.argv[2]
if (!url) {
  console.error('Usage: node scripts/ig-og.mjs <instagram-url>')
  process.exit(1)
}
const res = await fetch(url, {
  headers: {'User-Agent': 'Mozilla/5.0 (compatible; GALLERIettSeed/1.0)'},
})
const html = await res.text()
const get = (prop) => {
  const m = html.match(new RegExp(`property="${prop}" content="([^"]*)"`, 'i'))
  return m
    ? m[1]
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#xf6;/g, 'ö')
        .replace(/&#xe4;/g, 'ä')
        .replace(/&#xe5;/g, 'å')
        .replace(/&#xc5;/g, 'Å')
        .replace(/&#xd6;/g, 'Ö')
        .replace(/&#xc4;/g, 'Ä')
        .replace(/&#xe9;/g, 'é')
    : null
}
const out = {
  status: res.status,
  title: get('og:title'),
  description: get('og:description'),
  image: get('og:image'),
  url: get('og:url'),
}
console.log(JSON.stringify(out, null, 2))
