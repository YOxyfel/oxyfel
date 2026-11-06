export const elderviceWebsite = { href: 'https://eldervice-varna.groovy-scout-5634.chatgpt.site/', requiresSignIn: true }
export const CONTACT_EMAIL = 'zhekov.yane123@gmail.com'
export const ROBLOX_URL = 'https://www.roblox.com/games/135424778069566'
export const GAME_SITE_URL = 'https://playchopachop.com/'

export type Division = 'games' | 'studio' | 'care'
export const divisions: Record<Division, { name: string; word: string; audience: string }> = {
  games: { name: 'Oxyfel Games', word: 'Games', audience: 'For players' },
  studio: { name: 'Oxyfel Studio', word: 'Studio', audience: 'For companies' },
  care: { name: 'Oxyfel Care', word: 'Care', audience: 'For people at home' },
}

// Chop-a-Chop! drops, shared with playchopachop.com. A drop with a time gets a live
// countdown that turns into "Live now" by itself; one with only a date is listed.
export interface GameDrop { id: string; name: string; detail: string; at?: string; date: string }
export const chopDrops: GameDrop[] = [
  { id: 'halloween', name: 'Halloween: The Hollow', detail: 'The Halloween drop', at: '2026-11-13T00:00:00Z', date: 'Fri 13 Nov' },
  { id: 'crew', name: 'The Crew', detail: 'Play together as a crew', at: '2026-11-14T17:00:00Z', date: 'Sat 14 Nov' },
  { id: 'homes', name: 'Homes', detail: 'A place of your own', date: 'Sat 21 Nov' },
  { id: 'market', name: 'Market and trading', detail: 'Trade with other players', date: 'Sat 28 Nov' },
]
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
  division: Division
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
    id: 'chop-a-chop', division: 'games', workspace: 'Chop-a-Chop', name: 'Chop-a-Chop!',
    category: 'Roblox adventure', status: 'Out now · Free on Roblox',
    description: 'Chop by day. Survive the night. One chop can drop a whole row of trees; find rare woods, haul your logs by spaceship, and survive when the forest fights back.',
    href: ROBLOX_URL, actionLabel: 'Play free on Roblox', external: true,
  },
  {
    id: 'wuhen', division: 'games', workspace: 'Cultivation', name: projects.wuhen.name,
    category: 'Action RPG', status: 'PC demo in development',
    description: projects.wuhen.description, href: projects.wuhen.href,
    image: projects.wuhen.image, alt: projects.wuhen.alt,
    caption: 'Concept artwork', actionLabel: 'Explore the world', external: true,
  },
  {
    id: 'constellore', division: 'games', workspace: 'InfiniteWord', name: projects.constellore.name,
    category: 'Browser game', status: 'Browser practice available',
    description: projects.constellore.description, href: projects.constellore.playHref,
    image: projects.constellore.image, alt: projects.constellore.alt,
    caption: 'Gameplay capture', actionLabel: 'Open browser practice', external: true,
  },
  {
    id: 'mosquittoz', division: 'games', workspace: 'Mosquitto', name: 'Mosquittoz',
    category: 'Asymmetric multiplayer', status: 'Windows LAN alpha',
    description: 'Humans hunt the nests. Mosquitoes feed, bank blood, and grow their colony. An asymmetric multiplayer game set in a room that feels very different from each side.',
    image: 'mosquitto-world.webp',
    alt: 'Mosquittoz concept artwork: mosquitoes emerge from a nest beneath worn wooden skirting in a warmly lit living room.',
    caption: 'Concept artwork', href: 'https://yoxyfel.github.io/mosquittoz/',
    actionLabel: 'Explore Mosquittoz', external: true,
  },
  {
    id: 'threshold', division: 'games', workspace: 'Threshold', name: 'THRESHOLD',
    category: 'Roblox parkour', status: 'Local prototype',
    description: 'Find your limit, then decide when to push or recover. An adaptive parkour prototype that responds to your performance as you build Momentum toward the final crossing.',
    image: 'threshold-world.webp',
    alt: 'Stone platforms lead through a dark hall toward a glowing cyan doorway in THRESHOLD promotional concept art.',
    caption: 'Promotional concept art',
    notes: ['Momentum Horizon 0.3.1 is a local Roblox Studio prototype.', 'A thirteen-section run moves through Push, Hold, and Recover, with earned Momentum.', 'Further playtesting comes before public release. There is no public Play link yet.'],
  },
  {
    id: 'eldervice', division: 'care', workspace: 'Eldervice', name: 'Eldervice',
    category: 'Service & guide tools', status: 'Pilot project · Varna',
    description: 'Patient technology help for older people, in their own homes. Personal, large-print guides make everyday phones, computers, and televisions easier to use after the visit.',
    image: 'eldervice-service-illustration.webp',
    alt: 'Illustrated Eldervice service example: a patient helper supports an older adult using a phone at home.',
    caption: 'Service illustration', href: elderviceWebsite.href, actionLabel: 'Visit Eldervice', external: true,
    notes: ['A Bulgarian-first service concept for in-home technology help in Varna.', 'Personal large-print, laminated guides support the person after the visit.', 'The project also includes visual-guide creation tools. Its website preview is private.'],
  },
  {
    id: 'run-bank', division: 'games', workspace: 'RunAndBank', name: 'Run & Bank',
    category: 'Roblox expedition', status: 'Early prototype',
    description: 'Explore temple routes, collect valuable relics, and decide when to bank your haul before a failed run costs it. A parkour and loot expedition in its early stages.',
    notes: ['A local Roblox prototype with parkour, carried loot, and banking systems.', 'Saved place files and environment design references exist; the website has not been built yet.', 'No public playable release is available from this studio site.'],
  },
  {
    id: 'personal', division: 'studio', workspace: 'Personal Website', name: 'Yane Zhekov',
    category: 'Personal portfolio', status: 'Public portfolio',
    description: 'The developer behind the studio. A technical game-development portfolio spanning UE5 gameplay systems, interactive 3D experiments, art, and sound.',
    image: 'personal-portfolio-artwork.webp',
    alt: 'Decorative artwork from Yane Zhekov’s portfolio, showing a figure overlooking a mountainous world beneath a vast planet.',
    caption: 'Portfolio artwork', href: 'https://v0-yanez.vercel.app/en',
    actionLabel: 'Visit the portfolio', external: true,
  },
  {
    id: 'oxyfel', division: 'studio', workspace: 'Business Website', name: 'This website',
    category: 'Studio website', status: 'Case study',
    description: 'The home for every Oxyfel division: games for players, work for companies and help for people, brought together under one star.',
    current: true, href: '#top', actionLabel: 'Back to the opening',
  },
]
