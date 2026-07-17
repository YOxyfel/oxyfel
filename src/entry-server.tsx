import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import OxyfelApp from './App.tsx'

// Build-time only: compiled by `vite build --ssr` and invoked by
// scripts/prerender.mjs to inject static HTML into dist/index.html.
export function render(): string {
  return renderToString(
    <StrictMode>
      <OxyfelApp />
    </StrictMode>,
  )
}
