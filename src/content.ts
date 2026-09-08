export const elderviceWebsite = { href: 'https://eldervice-varna.groovy-scout-5634.chatgpt.site/', requiresSignIn: true }
export const CONTACT_EMAIL = 'zhekov.yane123@gmail.com'
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}`
export const UE5_CONTACT_HREF = `${CONTACT_HREF}?subject=UE5%20gameplay%20project`
export const media = (name: string) => `${import.meta.env.BASE_URL}images/${name}`

export const projects = {
  wuhen: {
    name: 'Wuhen & Xuan', subtitle: 'Heaven Defying',
    href: 'https://yoxyfel.github.io/wan-lin-immortal/',
    description: 'A dark xianxia action RPG about cultivation, survival, and defying the heavens. A world taking shape, with a PC demo in development.',
    image: 'wuhen-world.webp', smallImage: 'wuhen-world-small.webp',
    alt: 'Two figures overlook a mountain world beneath a red sun in Wuhen & Xuan concept artwork.',
  },
  constellore: {
    name: 'Constellore', href: 'https://yoxyfel.github.io/constellore/',
    playHref: 'https://yoxyfel.github.io/constellore/play/',
    description: 'Combine words, follow discoveries and explore a wider cosmic expedition. Browser practice is available; progression and competitive systems form part of the broader project.',
    image: 'constellore-gameplay.webp',
    alt: 'Constellore gameplay showing word tiles on a cosmic board with the target Make Ash.',
  },
}

export interface PortfolioProject {
  id: string
  workspace: string
  name: string
  category: string
  status: string
  description: string
  image?: string
  alt?: string
  caption?: string
  href?: string
  actionLabel?: string
  external?: boolean
  current?: boolean
  notes?: string[]
}

// One complete catalogue drives the index and every additional project entry.
// Workspace names record coverage; visitors see the public project identities.
export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'wuhen', workspace: 'Cultivation', name: projects.wuhen.name,
    category: 'Action RPG', status: 'PC demo in development',
    description: projects.wuhen.description, href: projects.wuhen.href,
    image: projects.wuhen.image, alt: projects.wuhen.alt,
    caption: 'Concept artwork', actionLabel: 'Explore the world', external: true,
  },
  {
    id: 'constellore', workspace: 'InfiniteWord', name: projects.constellore.name,
    category: 'Browser game', status: 'Browser practice available',
    description: projects.constellore.description, href: projects.constellore.playHref,
    image: projects.constellore.image, alt: projects.constellore.alt,
    caption: 'Gameplay capture', actionLabel: 'Open browser practice', external: true,
  },
  {
    id: 'mosquittoz', workspace: 'Mosquitto', name: 'Mosquittoz',
    category: 'Asymmetric multiplayer', status: 'Windows LAN alpha',
    description: 'Humans hunt the nests. Mosquitoes feed, bank blood, and grow their colony. An asymmetric multiplayer game set in a room that feels very different from each side.',
    image: 'mosquitto-world.webp',
    alt: 'Mosquittoz concept artwork: mosquitoes emerge from a nest beneath worn wooden skirting in a warmly lit living room.',
    caption: 'Concept artwork', href: 'https://yoxyfel.github.io/mosquittoz/',
    actionLabel: 'Explore Mosquittoz', external: true,
  },
  {
    id: 'threshold', workspace: 'Threshold', name: 'THRESHOLD',
    category: 'Roblox parkour', status: 'Local prototype',
    description: 'Find your limit, then decide when to push or recover. An adaptive parkour prototype that responds to your performance as you build Momentum toward the final crossing.',
    image: 'threshold-world.webp',
    alt: 'Stone platforms lead through a dark hall toward a glowing cyan doorway in THRESHOLD promotional concept art.',
    caption: 'Promotional concept art',
    notes: ['Momentum Horizon 0.3.1 is a local Roblox Studio prototype.', 'A thirteen-section run moves through Push, Hold, and Recover, with earned Momentum.', 'Further playtesting comes before public release. There is no public Play link yet.'],
  },
  {
    id: 'eldervice', workspace: 'Eldervice', name: 'Eldervice',
    category: 'Service & guide tools', status: 'Pilot project · Varna',
    description: 'Patient technology help for older people, in their own homes. Personal, large-print guides make everyday phones, computers, and televisions easier to use after the visit.',
    image: 'eldervice-service-illustration.webp',
    alt: 'Illustrated Eldervice service example: a patient helper supports an older adult using a phone at home.',
    caption: 'Service illustration', href: elderviceWebsite.href, actionLabel: 'Visit Eldervice', external: true,
    notes: ['A Bulgarian-first service concept for in-home technology help in Varna.', 'Personal large-print, laminated guides support the person after the visit.', 'The project also includes visual-guide creation tools. Its website preview is private.'],
  },
  {
    id: 'run-bank', workspace: 'RunAndBank', name: 'Run & Bank',
    category: 'Roblox expedition', status: 'Early prototype',
    description: 'Explore temple routes, collect valuable relics, and decide when to bank your haul before a failed run costs it. A parkour and loot expedition in its early stages.',
    notes: ['A local Roblox prototype with parkour, carried loot, and banking systems.', 'Saved place files and environment design references exist; the website has not been built yet.', 'No public playable release is available from this studio site.'],
  },
  {
    id: 'personal', workspace: 'Personal Website', name: 'Yane Zhekov',
    category: 'Personal portfolio', status: 'Public portfolio',
    description: 'The developer behind the studio. A technical game-development portfolio spanning UE5 gameplay systems, interactive 3D experiments, art, and sound.',
    image: 'personal-portfolio-artwork.webp',
    alt: 'Decorative artwork from Yane Zhekov’s portfolio, showing a figure overlooking a mountainous world beneath a vast planet.',
    caption: 'Portfolio artwork', href: 'https://v0-yanez.vercel.app/en',
    actionLabel: 'Visit the portfolio', external: true,
  },
  {
    id: 'oxyfel', workspace: 'Business Website', name: 'Oxyfel',
    category: 'Studio website', status: 'You are here',
    description: 'The home for the whole collection: original games, practical products, and digital experiences, brought together in one cinematic studio website.',
    current: true, href: '#top', actionLabel: 'Back to the opening',
  },
]
