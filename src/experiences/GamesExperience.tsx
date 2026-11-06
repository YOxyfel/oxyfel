import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, EnvelopeSimple, FilmStrip, Play, X } from '@phosphor-icons/react'
import { chopDrops, CONTACT_HREF, GAME_SITE_URL, ROBLOX_URL } from '../content'
import { OxyfelStar } from '../components/OxyfelStar'
import { DropCountdown } from '../components/Countdown'
import { LoopVideo, Marquee } from '../components/Media'
import { pageUrl, ShareButton } from '../components/Share'
import { TimberChallenge } from '../components/TimberChallenge'
import WorldsExperience from './WorldsExperience'
import './games.css'
import './worlds-system.css'

const gameMedia = (name: string) => `${import.meta.env.BASE_URL}media/chop-a-chop/${name}`
const sized = (name: string) => ({ src: gameMedia(`${name}-1280.webp`), srcSet: `${gameMedia(`${name}-640.webp`)} 640w, ${gameMedia(`${name}-1280.webp`)} 1280w` })

// Clean moments from the trailer and the clips, with the titles set in the site's own type.
type Feature = { id: string; layout: 'hero' | 'tall' | 'wide' | 'square'; title: string; text: string; src?: string; srcSet?: string; sizes?: string; alt?: string; mark?: string }
const features: Feature[] = [
  { id: 'chain', layout: 'hero', title: 'One chop, a whole row', text: 'Swing once and watch a whole line of trees go down together.', ...sized('shot-swing'), sizes: '(max-width: 700px) 100vw, 50vw', alt: 'Chop-a-Chop! gameplay: a player swings an axe into a tree beside a row of birches.', mark: 'TIMBER!' },
  { id: 'fire', layout: 'tall', title: 'The Fire God tree', text: 'One tree in 50,000 is a Fire God. Its wood is worth fifty times a plain one.', src: gameMedia('shot-fire-720.webp'), srcSet: `${gameMedia('shot-fire-360.webp')} 360w, ${gameMedia('shot-fire-720.webp')} 720w`, sizes: '(max-width: 700px) 100vw, 25vw', alt: 'Chop-a-Chop! gameplay: a player with a golden axe beside a glowing stump as sparks fly.', mark: '×50' },
  { id: 'night', layout: 'square', title: 'The forest fights back', text: 'When night falls, the trees come for you. Survive until dawn.', ...sized('shot-giant'), sizes: '(max-width: 700px) 100vw, 25vw', alt: 'Chop-a-Chop! gameplay: a towering thorn monster at night over a player with a golden axe.' },
  { id: 'woods', layout: 'square', title: 'Twelve rare woods', text: 'Rainbow, lava, diamond, toxic and eight more, hiding in the forest.' },
  { id: 'haul', layout: 'wide', title: 'A spaceship for logs', text: 'Haul your logs home in style, by spaceship.', ...sized('shot-hauler'), sizes: '(max-width: 700px) 100vw, 50vw', alt: 'Chop-a-Chop! gameplay: a wooden spaceship hauler over an orange autumn forest.' },
  { id: 'day', layout: 'wide', title: 'Chop by day', text: 'A whole forest to clear, from first light until night falls.', ...sized('shot-morning'), sizes: '(max-width: 700px) 100vw, 50vw', alt: 'Chop-a-Chop! gameplay: a player in a sunlit forest of birch and leafy trees.' },
]
const woods = ['Rainbow', 'Lava', 'Diamond', 'Toxic']
const clips = [
  { n: 1, title: 'One chop, seven trees' }, { n: 2, title: 'TIMBER!' }, { n: 3, title: 'The forest fights back' },
  { n: 4, title: 'The Fire God, x50' }, { n: 5, title: 'The spaceship haul' }, { n: 6, title: '24 hours in the forest' },
]

function Trailer() {
  const dialog = useRef<HTMLDialogElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const open = () => { dialog.current?.showModal(); video.current?.play().catch(() => {}) }
  const close = () => { video.current?.pause(); dialog.current?.close() }
  return <>
    <button type="button" className="ox-button ox-button--ghost ox-button--big" onClick={open} data-magnetic><FilmStrip size={20} aria-hidden="true" />Watch the trailer</button>
    <dialog ref={dialog} className="g-trailer" aria-label="Chop-a-Chop! trailer" onClose={() => video.current?.pause()} onClick={event => { if (event.target === dialog.current) close() }}>
      <div className="g-trailer-frame">
        <video ref={video} src={gameMedia('trailer.mp4')} poster={gameMedia('trailer-poster.webp')} controls playsInline preload="none" />
        <button type="button" className="g-trailer-close" onClick={close} aria-label="Close the trailer"><X size={22} aria-hidden="true" /></button>
      </div>
    </dialog>
  </>
}

function ClipCard({ clip, active, onPlay }: { clip: typeof clips[number]; active: boolean; onPlay: (n: number | null) => void }) {
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const element = video.current
    if (!element) return
    if (active) { if (!element.src) element.src = gameMedia(`clip-${clip.n}.mp4`); element.play().catch(() => onPlay(null)) }
    else element.pause()
  }, [active, clip.n, onPlay])
  return <li className={`g-clip ox-card${active ? ' is-playing' : ''}`} data-spotlight data-tilt>
    <button type="button" className="g-clip-button" aria-pressed={active} onClick={() => onPlay(active ? null : clip.n)} onPointerEnter={event => { if (event.pointerType === 'mouse') onPlay(clip.n) }}>
      <img src={gameMedia(`clip-${clip.n}.webp`)} width="540" height="960" alt="" loading="lazy" decoding="async" />
      <video ref={video} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
      <span className="g-clip-play" aria-hidden="true">{active ? <span className="g-clip-bars"><i /><i /><i /></span> : <Play size={22} weight="fill" />}</span>
      <span className="g-clip-title">{clip.title}<span className="sr-only">{active ? ', playing. Press to pause.' : ', play the clip'}</span></span>
    </button>
  </li>
}

// The six clips as a reel: the clip in the middle plays by itself while the reel is on
// screen (never with reduced motion), pointing at or tapping a clip plays that one.
function ClipReel() {
  const track = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState<number | null>(null)
  useEffect(() => {
    const list = track.current
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let visible = false, frame = 0
    const pick = () => {
      frame = 0
      if (!visible) { setActive(null); return }
      const box = list.getBoundingClientRect(), middle = box.left + box.width / 2
      let best = 0, distance = Infinity
      list.querySelectorAll<HTMLElement>('.g-clip').forEach((card, index) => { const rect = card.getBoundingClientRect(); const d = Math.abs(rect.left + rect.width / 2 - middle); if (d < distance) { distance = d; best = index } })
      setActive(clips[best].n)
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; pick() }, { threshold: .4 })
    observer.observe(list)
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(pick) }
    list.addEventListener('scroll', onScroll, { passive: true })
    return () => { observer.disconnect(); list.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [])
  const step = (direction: number) => {
    const list = track.current
    const card = list?.querySelector<HTMLElement>('.g-clip')
    if (list && card) list.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: 'smooth' })
  }
  return <div className="g-reel">
    <div className="g-reel-controls"><button type="button" onClick={() => step(-1)} aria-label="Previous clip"><ArrowLeft size={20} aria-hidden="true" /></button><button type="button" onClick={() => step(1)} aria-label="Next clip"><ArrowRight size={20} aria-hidden="true" /></button></div>
    <ul ref={track} className="g-reel-track">{clips.map(item => <ClipCard key={item.n} clip={item} active={active === item.n} onPlay={setActive} />)}</ul>
  </div>
}

const embers = Array.from({ length: 26 }, (_, i) => ({ left: (i * 41 + 7) % 100, size: 2 + ((i * 5) % 4), duration: 8 + ((i * 11) % 9), delay: -((i * 1.3) % 11), drift: ((i * 23) % 50) - 25 }))

export default function GamesExperience() {
  const timed = chopDrops.filter(drop => drop.at)
  const [reduced, setReduced] = useState(false)
  useEffect(() => { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches) }, [])
  return <div className="games-experience">
    <section className="g-hero" id="chop-a-chop" aria-labelledby="g-title">
      <LoopVideo className="g-hero-video" label="the gameplay video" sources={{ small: gameMedia('hero-small.mp4'), large: gameMedia('hero.mp4') }} poster={gameMedia('hero-poster-1280.webp')} posterSet={`${gameMedia('hero-poster-640.webp')} 640w, ${gameMedia('hero-poster-1280.webp')} 1280w`} />
      <div className="g-hero-shade" aria-hidden="true" />
      <div className="g-embers" aria-hidden="true">{embers.map((ember, index) => <i key={index} style={{ left: `${ember.left}%`, width: ember.size, height: ember.size, animationDuration: `${ember.duration}s`, animationDelay: `${ember.delay}s`, ['--drift' as string]: `${ember.drift}px` }} />)}</div>
      <div className="g-hero-copy">
        <p className="g-presents"><OxyfelStar className="g-presents-star" /><span>Oxyfel Games presents</span></p>
        <h1 id="g-title"><img className="g-logo" src={gameMedia('logo.webp')} width="1200" height="227" alt="Chop-a-Chop!" fetchPriority="high" /></h1>
        <p className="g-tagline"><span className="ox-line"><span>Chop by day.</span></span>{' '}<span className="ox-line"><span>Survive the night.</span></span></p>
        <p className="g-pitch">One chop, a whole row of trees. Rare woods, spaceship hauls and a forest that fights back at night. Free to play on Roblox.</p>
        <div className="g-actions">
          <a className="ox-button ox-button--light ox-button--big g-play" href={ROBLOX_URL} target="_blank" rel="noopener noreferrer" data-magnetic><Play size={20} weight="fill" aria-hidden="true" />Play free on Roblox<span className="sr-only"> (opens in a new tab)</span></a>
          <Trailer />
          <ShareButton label="Share" title="Chop-a-Chop! by Oxyfel Games" text="Chop-a-Chop! is out now, free on Roblox. One chop can drop a whole row of trees." url={pageUrl('games/')} />
        </div>
        <p className="g-live"><i className="ox-live-dot" aria-hidden="true" />Out now on Roblox · <a href={GAME_SITE_URL} target="_blank" rel="noopener noreferrer">playchopachop.com<ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></p>
      </div>
      <ul className="g-hero-drops" aria-label="Coming soon to Chop-a-Chop!">{timed.map(drop => <DropCountdown key={drop.id} drop={drop} remind />)}</ul>
      <a className="g-scroll" href="#features"><span>Inside the game</span><ArrowDown size={16} aria-hidden="true" /></a>
    </section>

    <Marquee label="What is in Chop-a-Chop!" items={['One chop, a whole row', 'Twelve rare woods', 'The Fire God x50', 'Spaceship hauls', 'The forest fights back', 'Free on Roblox']} speed={40} />

    <section className="ox-section g-features" id="features" aria-labelledby="g-features-title" data-chapter="Inside the game">
      <div className="ox-section-head" data-reveal>
        <p className="ox-kicker"><span className="ox-num">01</span>Inside the game</p>
        <h2 id="g-features-title" className="ox-title">What’s in <em>the forest.</em></h2>
        <p className="ox-lede">Real moments from the game, captured in play. No mock-ups.</p>
      </div>
      <ul className="g-bento">
        {features.map(feature => <li key={feature.id} className={`g-feature g-feature--${feature.layout} g-feature--${feature.id} ox-card`} data-spotlight data-tilt data-reveal>
          {feature.src
            ? <div className="g-feature-media"><img src={feature.src} srcSet={feature.srcSet} sizes={feature.sizes} alt={feature.alt} loading="lazy" decoding="async" /></div>
            : <div className="g-woods" aria-hidden="true"><strong>12</strong><ul>{woods.map(wood => <li key={wood} className={`g-wood g-wood--${wood.toLowerCase()}`}>{wood}</li>)}<li className="g-wood g-wood--more">+8 more</li></ul></div>}
          {feature.mark && <span className="g-feature-mark" aria-hidden="true">{feature.mark}</span>}
          <div className="g-feature-copy"><h3>{feature.title}</h3><p>{feature.text}</p></div>
        </li>)}
      </ul>
    </section>

    <section className="ox-section g-challenge" id="challenge" aria-labelledby="g-challenge-title" data-chapter="Challenge" data-hide-playbar>
      <div className="ox-section-head" data-reveal>
        <p className="ox-kicker"><span className="ox-num">02</span>Mini challenge</p>
        <h2 id="g-challenge-title" className="ox-title">Ten seconds. <em>How many trees?</em></h2>
        <p className="ox-lede">A taste of the chop, right here. Set a score, then dare a friend to beat it.</p>
      </div>
      <TimberChallenge />
    </section>

    <section className="ox-section g-clips" id="clips" aria-labelledby="g-clips-title" data-chapter="Clips">
      <div className="ox-section-head" data-reveal>
        <p className="ox-kicker"><span className="ox-num">03</span>Watch it move</p>
        <h2 id="g-clips-title" className="ox-title">Six clips. <em>Zero chill.</em></h2>
        <p className="ox-lede">{reduced ? 'Press a clip to play it. Each one plays without sound.' : 'Point at a clip, or tap it, to play. Each one plays without sound.'}</p>
      </div>
      <ClipReel />
    </section>

    <section className="ox-section g-roadmap" id="drops" aria-labelledby="g-roadmap-title" data-chapter="Drops">
      <div className="ox-section-head ox-section-head--center" data-reveal>
        <p className="ox-kicker"><span className="ox-num">04</span>The drops</p>
        <h2 id="g-roadmap-title" className="ox-title">Coming to <em>Chop-a-Chop!</em></h2>
      </div>
      <ol className="g-timeline" data-reveal>
        <li className="g-launch"><span className="ox-drop-name">Launch</span><span className="g-launch-state"><Check size={18} weight="bold" aria-hidden="true" />Out now</span><time dateTime="2026-11-06">Fri 6 Nov</time></li>
        {chopDrops.map(drop => <DropCountdown key={drop.id} drop={drop} remind />)}
      </ol>
      <p className="g-roadmap-note">Times show in your own time zone. Dates can move; the game’s site and Roblox page have the latest.</p>
    </section>

    <section className="g-lineup" id="in-development" aria-labelledby="g-lineup-title" data-chapter="In development">
      <div className="ox-section g-lineup-head">
        <div className="ox-section-head ox-section-head--center" data-reveal>
          <p className="ox-kicker"><span className="ox-num">05</span>In development</p>
          <h2 id="g-lineup-title" className="ox-title">Five more worlds <em>in the making.</em></h2>
          <p className="ox-lede">Each one is at its own stage, from a browser game you can play today to a PC demo taking shape. Every status here is the honest one.</p>
        </div>
      </div>
      <WorldsExperience embedded />
    </section>

    <section className="ox-section g-press" id="press" aria-labelledby="g-press-title" data-chapter="Press">
      <div className="g-press-card ox-card" data-spotlight data-reveal>
        <OxyfelStar className="g-press-star" spin />
        <div>
          <p className="ox-kicker"><span className="ox-num">06</span>Press and creators</p>
          <h2 id="g-press-title" className="ox-title">Covering <em>Chop-a-Chop!?</em></h2>
          <p className="ox-lede">The press kit has the logo, key art, screenshots and the facts. For anything else, write to Oxyfel Games.</p>
          <div className="g-press-actions">
            <a className="ox-button ox-button--light" href={`${GAME_SITE_URL}#press`} target="_blank" rel="noopener noreferrer" data-magnetic>Press kit <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            <a className="ox-button ox-button--ghost" href={`${CONTACT_HREF}?subject=${encodeURIComponent('Chop-a-Chop! press')}`} data-magnetic><EnvelopeSimple size={18} aria-hidden="true" />Email Oxyfel Games</a>
          </div>
        </div>
      </div>
    </section>
  </div>
}
