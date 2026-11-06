import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { siteTarget } from './site.config.mjs'

// The base path and absolute site address come from site.config.mjs:
// GitHub Pages (https://yoxyfel.github.io/oxyfel/) today, oxyfel.com once its DNS is live.
// `--mode domain` builds the oxyfel.com variant without changing the live target.
export default defineConfig(({ mode }) => {
  const site = siteTarget(mode)
  return {
    base: site.base,
    define: { __SITE_URL__: JSON.stringify(site.url) },
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'oxyfel-site-address',
        transformIndexHtml: (html: string) => html.replaceAll('__SITE_URL__', site.url).replaceAll('__BASE__', site.base),
      },
    ],
  }
})
