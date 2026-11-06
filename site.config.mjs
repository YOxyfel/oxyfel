// Where the site is served. Every absolute address (canonical links, share cards,
// search data, sitemap, robots, manifest, CNAME) comes from here.
//
// `npm run build` and `npm run deploy` use LIVE_TARGET. On the day oxyfel.com's DNS
// points at GitHub Pages, change LIVE_TARGET to 'domain' and deploy: the build then
// serves from the domain root and writes the CNAME file that keeps the custom domain.
// Deploying the 'domain' build before the DNS is live would send visitors to a
// domain that does not answer yet, so the switch waits for that day.
//
// `npm run build:domain` builds the domain variant locally without changing this.
export const targets = {
  pages: { origin: 'https://yoxyfel.github.io', base: '/oxyfel/', cname: null },
  domain: { origin: 'https://oxyfel.com', base: '/', cname: 'oxyfel.com' },
}

export const LIVE_TARGET = 'pages'

export function siteTarget(mode) {
  const name = mode === 'pages' || mode === 'domain' ? mode : LIVE_TARGET
  const target = targets[name]
  return { name, ...target, url: target.origin + target.base }
}
