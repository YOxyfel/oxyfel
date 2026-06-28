# Oxyfel — Digital Hub

An editorial, interactive landing experience for **Oxyfel**: a unified digital ecosystem built on the philosophy of layering toward perfection.

Built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS v4**.

## Features

- **Pointer-reveal hero** — on desktop, moving the cursor unveils the brand through a radial mask, with a precision crosshair cursor.
- **Touch-first fallback** — phones and tablets get a clean, fully legible static hero (no pointer required).
- **Interactive portfolio** — projects expand on hover (desktop) or tap (mobile).
- **Editorial scroll reveals** via `IntersectionObserver`, with a reduced-motion fallback.
- **Fully responsive** layout from small phones to large desktops.

## Local development

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Production build

```bash
npm run build      # type-checks, then bundles to dist/
npm run preview    # serve the production build locally
```

## Deployment (GitHub Pages)

The site is published to the `gh-pages` branch and served from
`https://<user>.github.io/oxyfel/`. To build and deploy:

```bash
npm run deploy
```

This runs the production build and pushes `dist/` to the `gh-pages` branch via the
[`gh-pages`](https://www.npmjs.com/package/gh-pages) package. In the repository,
**Settings → Pages → Build and deployment → Source** is set to **Deploy from a branch**
(`gh-pages` / root).

The Vite `base` path is set to `/oxyfel/` for project-site hosting. If you deploy under a
different repository name or a custom domain, override it at build time:

```bash
VITE_BASE=/your-repo/ npm run build
# or for a root/custom domain:
VITE_BASE=/ npm run build
```
