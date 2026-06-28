import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base` is set for GitHub Pages project-site hosting (https://<user>.github.io/oxyfel/).
// Override at build time with `VITE_BASE` when deploying elsewhere (e.g. a custom domain).
export default defineConfig({
  base: process.env.VITE_BASE ?? '/oxyfel/',
  plugins: [react(), tailwindcss()],
})
