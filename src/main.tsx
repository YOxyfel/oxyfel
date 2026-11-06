import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import OxyfelApp from './App.tsx'
import type { Experience } from './components/HubShell'

const container = document.getElementById('root')!
const pages: Experience[] = ['hub', 'games', 'care', 'studio', 'privacy', 'notfound']

// Prerendered pages name themselves (scripts/prerender.mjs sets data-page), which also
// covers 404.html, served by GitHub Pages at any missing address. In `npm run dev`
// the page comes from the address instead; the old /worlds/ address shows Games.
function pageFromPath(): Experience {
  const segment = window.location.pathname.slice(import.meta.env.BASE_URL.length).split('/')[0]
  if (segment === '' || segment === 'index.html') return 'hub'
  if (segment === 'worlds') return 'games'
  return pages.includes(segment as Experience) && segment !== 'hub' && segment !== 'notfound' ? segment as Experience : 'notfound'
}
const named = container.dataset.page as Experience | undefined
const page: Experience = named && pages.includes(named) ? named : pageFromPath()

const app = (
  <StrictMode>
    <OxyfelApp page={page} />
  </StrictMode>
)

// dist/ ships prerendered markup: hydrate when it is present, fall back to a fresh
// client render otherwise (e.g. `npm run dev`, where index.html has an empty #root).
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
