/** Probe IG carousel image URLs. Usage: node scripts/ig-carousel-probe.mjs <url> */
const url = process.argv[2]
if (!url) {
  console.error('Usage: node scripts/ig-carousel-probe.mjs <url>')
  process.exit(1)
}
const res = await fetch(url, {
  headers: {'User-Agent': 'Mozilla/5.0 (compatible; GALLERIettSeed/1.0)'},
})
const html = await res.text()
const imgs = [...html.matchAll(/https:\\\/\\\/scontent[^"'\\\s]+/g)].map((m) =>
  m[0].replace(/\\\//g, '/').replace(/&amp;/g, '&')
)
const uniq = [...new Set(imgs)]
console.log('status', res.status, 'unique', uniq.length)
uniq.slice(0, 20).forEach((u, i) => console.log(i, u.slice(0, 140)))
