import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import OxyfelApp from './App.tsx'
import type { Experience } from './components/HubShell'

// Build-time only: compiled by `vite build --ssr` and invoked by
// scripts/prerender.mjs to inject static HTML into dist/index.html.
export function render(page: Experience = 'hub'): string {
  return renderToString(
    <StrictMode>
      <OxyfelApp page={page} />
    </StrictMode>,
  )
}
