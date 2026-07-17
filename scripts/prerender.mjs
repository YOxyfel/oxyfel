// Post-build prerender: renders <OxyfelApp/> to static HTML and injects it
// into dist/index.html so crawlers (and users, before JS loads) see real
// content. Runs automatically via the npm `postbuild` hook — see package.json.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const { render } = await import(
  pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href
)

const indexPath = resolve(root, 'dist/index.html')
const template = readFileSync(indexPath, 'utf8')

const marker = '<div id="root"></div>'
if (!template.includes(marker)) {
  throw new Error(`prerender: marker ${marker} not found in dist/index.html`)
}

writeFileSync(indexPath, template.replace(marker, `<div id="root">${render()}</div>`))

// The SSR bundle is only needed at build time — keep dist/ clean for deploy.
rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true })

console.log('prerender: injected static HTML into dist/index.html')
