const url = process.argv[2] || 'https://www.instagram.com/p/DBZNaMVKr4J/'
const res = await fetch(url, {headers: {'User-Agent': 'Mozilla/5.0'}})
const html = await res.text()
const caps = [...html.matchAll(/"text":"((?:\\.|[^"\\])*)"/g)]
  .map((m) => m[1].replace(/\\n/g, '\n').replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))))
  .filter((t) => t.length > 30)
console.log('--- captions ---')
for (const c of [...new Set(caps)].slice(0, 10)) console.log(c.slice(0, 500), '\n---')
const imgs = [...html.matchAll(/https:\\\/\\\/scontent[^"\\]+/g)].map((m) =>
  m[0].replace(/\\\//g, '/').replace(/\\u0026/g, '&')
)
console.log('--- imgs ---')
for (const u of [...new Set(imgs)].slice(0, 6)) console.log(u.slice(0, 180))
