import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import OxyfelApp from './App.tsx'
import type { Experience } from './components/HubShell'
const segment = window.location.pathname.slice(import.meta.env.BASE_URL.length).split('/')[0]
const page: Experience = segment === 'worlds' || segment === 'care' || segment === 'studio' ? segment : 'hub'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <OxyfelApp page={page} />
  </StrictMode>
)

// dist/index.html ships prerendered markup (see scripts/prerender.mjs):
// hydrate when it is present, fall back to a fresh client render otherwise
// (e.g. `npm run dev`, where index.html still has an empty #root).
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
