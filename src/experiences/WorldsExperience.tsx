import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Play } from '@phosphor-icons/react'
import { CONTACT_HREF, media, portfolioProjects, projects } from '../content'
import { ConstelloreSample, MosquittoInspector, RunBankPlans, ThresholdMechanism, WuhenDesignNotes } from './worlds-depth'
import './worlds.css'
import './worlds-depth.css'

const scenes = [
  {
    id: 'wuhen', label: 'Wuhen & Xuan', short: 'Wuhen & Xuan', genre: 'Dark xianxia · Action RPG',
    line: 'Heaven is not the limit.', subtitle: 'Heaven Defying',
    story: 'Ancient sects. Impossible landscapes. Power that must be earned. Step into a world where the path is yours to carve.',
    image: 'wuhen-world.webp', imageAlt: projects.wuhen.alt,
    credit: 'Concept artwork', action: 'Enter the world', href: projects.wuhen.href,
    detailTitle: 'A world worth defying.',
    detail: 'Wuhen & Xuan is a dark xianxia action RPG about cultivation, survival, and the cost of reaching beyond your limits. Its world is taking shape, with a PC demo in development.',
  },
  {
    id: 'constellore', label: 'Constellore', short: 'Constellore', genre: 'Cosmic discovery · Browser game',
    line: 'It begins with a word.', subtitle: 'Follow your curiosity',
    story: 'Two ideas become something new. A small discovery becomes a universe. Find your own way through the words.',
    image: 'constellore-world.webp', imageAlt: 'Constellore Home scene artwork: a luminous path winds between planets and floating worlds in a blue and violet cosmos.',
    credit: 'Home scene artwork', action: 'Play Constellore', href: projects.constellore.playHref,
    detailTitle: 'Small words. Unexpected worlds.',
    detail: 'A cosmic world built around discovery. Combine ideas on a freeform board, find routes to targets, and follow a wider journey through expeditions and progression. Try one small part here, then enter the browser practice edition.',
  },
  {
    id: 'mosquittoz', label: 'Mosquittoz', short: 'Mosquittoz', genre: 'Two sides · Asymmetric multiplayer',
    line: 'Same room. Different war.', subtitle: 'Choose your side',
    story: 'To a human, it is a living room. To a mosquito, it is a hunting ground. Feed the colony. Find the nests. Survive the other side.',
    image: 'mosquitto-world.webp', imageAlt: 'Mosquittoz concept artwork: mosquitoes emerge from a nest beneath worn wooden skirting in a warmly lit living room.',
    credit: 'Concept artwork', action: 'Explore Mosquittoz', href: 'https://yoxyfel.github.io/mosquittoz/',
    detailTitle: 'Perspective changes everything.',
    detail: 'Mosquittoz turns a familiar room into an asymmetric multiplayer arena. Humans hunt the nests; mosquitoes feed, bank blood, and grow their colony. The current Windows LAN alpha is built around short rounds in the Safehouse.',
  },
  {
    id: 'threshold', label: 'THRESHOLD', short: 'THRESHOLD', genre: 'Momentum · Adaptive parkour',
    line: 'The next step is earned.', subtitle: 'Momentum Horizon',
    story: 'Push. Hold. Recover. Find the rhythm between ambition and control, and carry your Momentum into the final crossing.',
    image: 'threshold-world.webp', imageAlt: 'Stone platforms lead through a dark hall toward a glowing cyan doorway in THRESHOLD promotional concept art.',
    credit: 'Promotional concept art', action: 'Inside the prototype', href: '#proof-threshold',
    detailTitle: 'Find your limit. Then move it.',
    detail: 'THRESHOLD is an adaptive Roblox parkour prototype. A thirteen-section run responds to your performance as you choose when to push and when to recover. Momentum Horizon 0.3.1 is the current local Roblox prototype; the course and its earned-Momentum rules are taking shape through playtesting.',
  },
  {
    id: 'run-bank', label: 'Run & Bank', short: 'Run & Bank', genre: 'Risk & reward · Temple expedition',
    line: 'One more relic. One more risk.', subtitle: 'Bring it home',
    story: 'A temple full of possibility. A bag that gets harder to risk. Decide how far to go, and when to make your way back.',
    image: 'run-bank-vault.webp', imageAlt: 'Run & Bank environment design reference showing a top-down temple vault with relic chambers and branching routes.',
    credit: 'Environment design reference', action: 'Open the field notes', href: '#proof-run-bank',
    detailTitle: 'The expedition is only half the story.',
    detail: 'Run & Bank is an early Roblox prototype combining temple parkour, carried loot, and banking. Valuable finds create a decision: press deeper into the route, or secure what you have before a failed run costs it.',
  },
] as const

type WorldId = typeof scenes[number]['id']

function worldFromHash(): WorldId | undefined {
  const id = window.location.hash.replace(/^#(?:proof-)?/, '')
  return scenes.find(scene => scene.id === id)?.id
}

export default function WorldsExperience() {
  // Keep the first client render identical to server HTML. Without JavaScript,
  // all five scenes and proof chapters remain visible and native links still work.
  const [enhanced, setEnhanced] = useState(false)
  const [active, setActive] = useState<WorldId>('wuhen')
  const stage = useRef<HTMLDivElement>(null)
  const selector = useRef<HTMLOListElement>(null)
  const initialHashPositioned = useRef(false)
  const pendingSceneFocus = useRef<WorldId | null>(null)
  const activeIndex = scenes.findIndex(scene => scene.id === active)

  useEffect(() => {
    setEnhanced(true)
    const syncHash = () => {
      const world = worldFromHash()
      if (world) setActive(world)
      else if (!window.location.hash) setActive('wuhen')
    }
    syncHash()
    window.addEventListener('hashchange', syncHash)
    window.addEventListener('popstate', syncHash)
    return () => {
      window.removeEventListener('hashchange', syncHash)
      window.removeEventListener('popstate', syncHash)
    }
  }, [])

  useEffect(() => {
    if (!enhanced) return
    const list = selector.current
    const selected = list?.querySelector<HTMLAnchorElement>('[aria-current="true"]')
    if (list && selected && list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: selected.offsetLeft - list.offsetLeft - (list.clientWidth - selected.clientWidth) / 2, behavior: 'auto' })
    }
    if (!initialHashPositioned.current) {
      initialHashPositioned.current = true
      const id = window.location.hash.slice(1)
      if (id && worldFromHash()) document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' })
    }
    if (pendingSceneFocus.current === active) {
      document.getElementById(`w-title-${active}`)?.focus({ preventScroll: true })
      pendingSceneFocus.current = null
    }
  }, [active, enhanced])

  function selectWorld(event: MouseEvent<HTMLAnchorElement>, id: WorldId) {
    if (!enhanced || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`)
    if (event.currentTarget.closest('.w-proof')) pendingSceneFocus.current = id
    setActive(id)
    stage.current?.scrollIntoView({ behavior: 'auto', block: 'start' })
  }

  return (
    <div className={`worlds-experience${enhanced ? ' w-enhanced' : ''}`} data-world={active}>
      <h1 className="w-sr-only">Worlds by Oxyfel — five games to explore</h1>
      <nav className="w-selector" aria-label="Choose a game world">
        <div className="w-selector-intro"><span>Choose a world</span><span className="w-current-track" aria-live="polite">0{activeIndex + 1} <i>/</i> 05</span></div>
        <ol ref={selector}>
          {scenes.map((scene, index) => <li key={scene.id}><a href={`#${scene.id}`} aria-current={active === scene.id ? 'true' : undefined} onClick={event => selectWorld(event, scene.id)}><span className="w-selector-number">0{index + 1}</span><span>{scene.short}</span><span className="w-selector-dot" aria-hidden="true" /></a></li>)}
        </ol>
      </nav>
      <div className="w-stage" ref={stage}>
        {scenes.map((scene, index) => {
          const project = portfolioProjects.find(item => item.id === scene.id)!
          const isPublic = scene.href.startsWith('https:')
          return (
            <section className={`w-scene w-scene--${scene.id}`} id={scene.id} key={scene.id} hidden={enhanced && active !== scene.id} aria-labelledby={`w-title-${scene.id}`}>
              <div className="w-scene-art"><img src={media(scene.image)} alt={scene.imageAlt} width={scene.id === 'run-bank' ? 1024 : 1792} height={scene.id === 'run-bank' ? 1536 : 1024} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" fetchPriority={index === 0 ? 'high' : 'auto'} /></div>
              <div className="w-scene-top"><p>Oxyfel <span>/</span> Worlds <span>/</span> 0{index + 1}</p><p className="w-genre">{scene.genre}</p></div>
              <div className="w-scene-copy">
                <p className="w-premise">{scene.line}</p>
                <h2 id={`w-title-${scene.id}`} tabIndex={-1}>{scene.label}</h2>
                <p className="w-subtitle">{scene.subtitle}</p>
                <p className="w-story">{scene.story}</p>
                <div className="w-actions">
                  <a className="w-primary" href={scene.href} target={isPublic ? '_blank' : undefined} rel={isPublic ? 'noopener noreferrer' : undefined}>
                    {scene.id === 'constellore' && <Play size={17} weight="fill" aria-hidden="true" />}{scene.action}
                    {isPublic ? <ArrowUpRight size={20} aria-hidden="true" /> : <ArrowDown size={20} aria-hidden="true" />}
                    {isPublic && <span className="w-sr-only"> (opens in a new tab)</span>}
                  </a>
                  <span className="w-status"><i aria-hidden="true" />{project.status}</span>
                </div>
              </div>
              <p className="w-art-credit">{scene.credit}</p>
              <a className="w-discover" href={`#proof-${scene.id}`} aria-label={`Discover more about ${scene.label}`}><span>Look closer</span><ArrowDown size={18} aria-hidden="true" /></a>
            </section>
          )
        })}
      </div>



      <div className="w-proof-chapters">
        {scenes.map((scene, index) => {
          const project = portfolioProjects.find(item => item.id === scene.id)!
          const next = scenes[(index + 1) % scenes.length]
          return (
            <section className={`w-proof w-proof--${scene.id}`} id={`proof-${scene.id}`} key={scene.id} hidden={enhanced && active !== scene.id} aria-labelledby={`w-proof-title-${scene.id}`}>
              <div className="w-proof-intro"><p className="w-overline">Inside {scene.label}</p><h2 id={`w-proof-title-${scene.id}`}>{scene.detailTitle}</h2><p>{scene.detail}</p></div>

              {scene.id === 'wuhen' && <WuhenDesignNotes />}
              {scene.id === 'constellore' && <ConstelloreSample />}
              {scene.id === 'mosquittoz' && <MosquittoInspector />}
              {scene.id === 'threshold' && <ThresholdMechanism />}
              {scene.id === 'run-bank' && <RunBankPlans />}

              <div className="wd-studio-connection"><p>{scene.id === 'constellore' ? 'See how a small interaction becomes an interface people can understand and use.' : 'From a rule or an environment plan to a working system: follow the making of the work.'}</p><a href={`${import.meta.env.BASE_URL}studio/#${scene.id === 'constellore' ? 'case-interactive' : 'case-games'}`}>See how the work is made <ArrowUpRight size={18} aria-hidden="true" /></a></div>

              {project.notes && <details className="w-development-notes"><summary>Development notes <span>{project.status}</span></summary><ul>{project.notes.map(note => <li key={note}>{note}</li>)}</ul><a href={`${CONTACT_HREF}?subject=${encodeURIComponent(`Ask about ${scene.label}`)}`}>Ask about the project <ArrowUpRight size={18} aria-hidden="true" /></a></details>}

              <div className="w-next-world"><span>There is another world waiting.</span><a href={`#${next.id}`} onClick={event => selectWorld(event, next.id)}><span>{next.label}</span><ArrowRight size={26} aria-hidden="true" /></a></div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
