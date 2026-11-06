// Writes real HTML for every page after `vite build` and `vite build --ssr`.
// Also writes the files whose contents depend on the site address: robots.txt,
// sitemap.xml, site.webmanifest, the 404 page, forwarding pages for moved
// addresses and, for the oxyfel.com build, the CNAME file.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { siteTarget } from '../site.config.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const modeFlag = process.argv.indexOf('--mode')
const site = siteTarget(modeFlag > -1 ? process.argv[modeFlag + 1] : undefined)
const ssr = resolve(root, 'dist-ssr')
const { render } = await import(pathToFileURL(resolve(ssr, 'entry-server.js')).href)
const template = readFileSync(resolve(root, 'dist/index.html'), 'utf8')
const marker = '<div id="root"></div>'
if (!template.includes(marker)) throw new Error('prerender: root marker missing')

const shareAlt = {
  oxyfel: 'The gold Oxyfel star above the names of its three divisions: Oxyfel Games, Oxyfel Studio and Oxyfel Care.',
  games: 'Chop-a-Chop! title over a forest by day and a thorn monster by night, a production by Oxyfel Games.',
  studio: 'Oxyfel Studio: real work on the table, an in-engine model, an interactive game board and a website design.',
  care: 'Oxyfel Care: an illustration of a patient helper and an older woman with her phone at home, for the Eldervice pilot in Varna.',
}

const pages = [
  { id: 'hub', path: '', share: 'oxyfel', title: 'Oxyfel | Games, studio work and everyday care', description: 'Oxyfel makes games for players, builds for companies and helps people with everyday technology. Chop-a-Chop! by Oxyfel Games is out now on Roblox.' },
  { id: 'games', path: 'games/', share: 'games', title: 'Oxyfel Games | Chop-a-Chop! is out now on Roblox', description: 'Oxyfel Games makes original games. Chop-a-Chop! is out now, free on Roblox: fell whole rows with one chop, find rare woods and survive the night. Five more worlds are in development.' },
  { id: 'studio', path: 'studio/', share: 'studio', title: 'Oxyfel Studio | Websites, game systems and interactive work', description: 'Oxyfel Studio designs and builds websites, game systems and interactive work for companies. See real projects, the decisions behind them and how to start one.' },
  { id: 'care', path: 'care/', share: 'care', title: 'Oxyfel Care | Eldervice technology help in Varna', description: 'A little help. A lot more confidence. Eldervice by Oxyfel Care offers patient technology help at home in Varna, with personal visual guides.' },
  { id: 'privacy', path: 'privacy/', share: 'oxyfel', title: 'Privacy | Oxyfel', description: 'How the Oxyfel website handles information: no accounts, no analytics, no tracking and no cookies.' },
]

const escapeAttribute = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
const escapeText = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
function setMeta(html, attribute, value) {
  const pattern = new RegExp('(<meta\\s+' + attribute + '\\s+content=")[^"]*"')
  if (!pattern.test(html)) throw new Error('prerender: missing meta ' + attribute)
  return html.replace(pattern, '$1' + escapeAttribute(value) + '"')
}
function pageHtml({ id, title, description, url, share, robots }) {
  let html = template.replace(marker, `<div id="root" data-page="${id}">` + render(id) + '</div>')
  html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>' + escapeText(title) + '</title>')
  for (const attribute of ['name="description"', 'property="og:description"', 'name="twitter:description"']) html = setMeta(html, attribute, description)
  for (const attribute of ['property="og:title"', 'name="twitter:title"']) html = setMeta(html, attribute, title)
  for (const attribute of ['property="og:image"', 'name="twitter:image"']) html = setMeta(html, attribute, `${site.url}og/${share}.jpg`)
  for (const attribute of ['property="og:image:alt"', 'name="twitter:image:alt"']) html = setMeta(html, attribute, shareAlt[share])
  if (robots) html = setMeta(html, 'name="robots"', robots)
  html = html.replace(/(<link rel="canonical" href=")[^"]*"/, '$1' + url + '"')
  html = html.replace(/(<meta property="og:url" content=")[^"]*"/, '$1' + url + '"')
  return html
}
function write(relative, contents) {
  const file = resolve(root, 'dist', relative)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, contents)
}
function forwardPage(to, label) {
  const target = site.base + to
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${label} | Oxyfel</title>
<link rel="canonical" href="${site.url + to}">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash)</script>
<meta http-equiv="refresh" content="0; url=${target}">
</head>
<body style="background:#0a0908;color:#f4ecd8;font-family:system-ui,sans-serif;padding:40px">
<p>This page has moved to <a style="color:#f0c869" href="${target}">${label}</a>.</p>
</body>
</html>
`
}

for (const page of pages) {
  write(page.path + 'index.html', pageHtml({ ...page, url: site.url + page.path }))
  console.log('prerender: ' + (page.path || '/') + ' ready')
}

// GitHub Pages serves 404.html for any missing address, at any depth, so every
// link and asset on it is absolute (Vite already writes base-prefixed asset URLs).
write('404.html', pageHtml({ id: 'notfound', share: 'oxyfel', robots: 'noindex', url: site.url, title: 'Page not found | Oxyfel', description: 'This page does not exist. Find your way back to Oxyfel, Oxyfel Games, Oxyfel Studio or Oxyfel Care.' }))
console.log('prerender: 404.html ready')

// Addresses that moved: /worlds/ became /games/ (hash kept), privacy.html became /privacy/.
write('worlds/index.html', forwardPage('games/', 'Oxyfel Games'))
write('privacy.html', forwardPage('privacy/', 'Privacy'))

const today = new Date().toISOString().slice(0, 10)
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url><loc>${site.url + page.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`)
write('robots.txt', `User-agent: *
Allow: /

Sitemap: ${site.url}sitemap.xml
`)
write('site.webmanifest', JSON.stringify({
  name: 'Oxyfel',
  short_name: 'Oxyfel',
  description: 'Oxyfel makes games for players, builds for companies and helps people with everyday technology.',
  start_url: site.base,
  scope: site.base,
  display: 'standalone',
  background_color: '#0a0908',
  theme_color: '#0a0908',
  icons: [
    { src: site.base + 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    { src: site.base + 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: site.base + 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: site.base + 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2) + '\n')
if (site.cname) write('CNAME', site.cname + '\n')
console.log(`prerender: sitemap, robots, manifest${site.cname ? ', CNAME' : ''} ready for ${site.url}`)

if (!ssr.startsWith(root + sep)) throw new Error('SSR cleanup escaped workspace')
rmSync(ssr, { recursive: true, force: true })
