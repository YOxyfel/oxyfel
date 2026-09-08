import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ssr = resolve(root, 'dist-ssr')
const { render } = await import(pathToFileURL(resolve(ssr, 'entry-server.js')).href)
const template = readFileSync(resolve(root, 'dist/index.html'), 'utf8')
const marker = '<div id="root"></div>'
if (!template.includes(marker)) throw new Error('prerender: root marker missing')
const pages = [
  {id:'hub', path:'', title:'Oxyfel — Worlds, Everyday & Studio', description:'Choose your experience. Original games, patient technology help, and creative development, connected through one independent studio.'},
  {id:'worlds',path:'worlds/',title:'Worlds — Original Games by Oxyfel',description:'Enter five original game worlds: Wuhen & Xuan, Constellore, Mosquittoz, THRESHOLD, and Run & Bank. Explore their stories and development.'},
  {id:'care',path:'care/',title:'Everyday — Eldervice by Oxyfel',description:'A little help. A lot more confidence. Explore Eldervice: patient technology help at home in Varna, with personal visual guides.'},
  {id:'studio',path:'studio/',title:'Studio — Creative Development by Oxyfel',description:'Step into the studio of Yane Zhekov. Explore game systems, websites, and interactive experiences through the work that brings them to life.'},
]
const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;')
for (const page of pages) {
  const url = 'https://yoxyfel.github.io/oxyfel/' + page.path
  let html = template.replace(marker, '<div id="root">' + render(page.id) + '</div>')
  html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>' + escape(page.title) + '</title>')
  for (const attribute of ['name="description"','property="og:description"','name="twitter:description"']) {
    html = html.replace(new RegExp('(<meta\\s+' + attribute + '\\s+content=")[^"]*"'), '$1' + escape(page.description) + '"')
  }
  for (const attribute of ['property="og:title"','name="twitter:title"']) {
    html = html.replace(new RegExp('(<meta\\s+' + attribute + '\\s+content=")[^"]*"'), '$1' + escape(page.title) + '"')
  }
  html = html.replace(/(<link rel="canonical" href=")[^"]*"/, '$1' + url + '"')
  html = html.replace(/(<meta property="og:url" content=")[^"]*"/, '$1' + url + '"')
  const out = resolve(root, 'dist', page.path)
  mkdirSync(out, { recursive:true })
  writeFileSync(resolve(out,'index.html'), html)
  console.log('prerender: ' + (page.path || '/') + ' ready')
}
if (!ssr.startsWith(root + sep)) throw new Error('SSR cleanup escaped workspace')
rmSync(ssr, { recursive:true, force:true })
