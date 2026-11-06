import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, EnvelopeSimple, Play } from '@phosphor-icons/react'
import { chopDrops, CONTACT_HREF, divisions, media, ROBLOX_URL } from '../content'
import type { Division } from '../content'
import { Lockup, route, toneOf } from '../components/HubShell'
import { OxyfelStar } from '../components/OxyfelStar'
import { StarScene } from '../components/StarScene'
import { DropCountdown } from '../components/Countdown'
import { LightField } from '../components/LightField'
import type { Tone } from '../components/LightField'
import { LoopVideo, Marquee } from '../components/Media'
import { Showreel } from '../components/Showreel'
import './home.css'

const base = import.meta.env.BASE_URL
const gameMedia = (name: string) => `${base}media/chop-a-chop/${name}`
const lightOf: Record<Division, Tone> = { games: 'gold', studio: 'ice', care: 'jade' }
const order: Division[] = ['games', 'studio', 'care']

const chapters: Record<Division, { title: string; detail: string; inside: string[]; action: string; image: string; imageSet?: string; credit: string }> = {
  games: { title: 'Worlds worth playing.', detail: 'Original games for players, starting with Chop-a-Chop!, out now on Roblox, and five more worlds in the making.', inside: ['Chop-a-Chop! · out now on Roblox', 'Five more worlds in development', 'Press and creators'], action: 'Enter Oxyfel Games', image: gameMedia('night-1280.webp'), imageSet: `${gameMedia('night-640.webp')} 640w, ${gameMedia('night-1280.webp')} 1280w`, credit: 'Chop-a-Chop! · gameplay' },
  studio: { title: 'Built for companies.', detail: 'Websites, game systems and interactive work, from the first idea to the version people actually use.', inside: ['Websites and interfaces', 'Game systems in Unreal and Roblox', 'Interactive experiences'], action: 'Enter Oxyfel Studio', image: media('studio-mosquitto-model.webp'), credit: 'Mosquittoz · in-engine render' },
  care: { title: 'Help that stays.', detail: 'Patient technology help at home in Varna, with personal guides that stay after the visit.', inside: ['Eldervice · Varna pilot', 'Phones, computers, televisions', 'In English and Bulgarian'], action: 'Enter Oxyfel Care', image: media('care-world-1280.webp'), imageSet: `${media('care-world-640.webp')} 640w, ${media('care-world-1280.webp')} 1280w`, credit: 'Eldervice · illustration' },
}
const stats = [
  { value: '1', label: 'game out now', detail: 'Chop-a-Chop! on Roblox' },
  { value: '5', label: 'worlds in development', detail: 'From browser play to a PC demo' },
  { value: '3', label: 'divisions', detail: 'Games, Studio and Care' },
  { value: '2', label: 'languages', detail: 'English and Bulgarian' },
]

// The three lights as one pinned scroll story on wide screens: the light shifts from
// gold to ice to jade as each division takes the stage. Phones, reduced motion and
// no-JavaScript visitors get the same chapters as a simple stack.
function LightStory() {
  const section = useRef<HTMLElement>(null)
  const [active, setActive] = useState<Division>('games')
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    const element = section.current
    if (!element) return
    const wide = window.matchMedia('(min-width: 1000px) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    const measure = () => {
      frame = 0
      const rect = element.getBoundingClientRect()
      const span = Math.max(1, rect.height - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / span))
      element.style.setProperty('--story', progress.toFixed(4))
      setActive(order[Math.min(2, Math.floor(progress * 3))])
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure) }
    const apply = () => { setPinned(wide.matches); measure() }
    apply()
    wide.addEventListener('change', apply)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { cancelAnimationFrame(frame); wide.removeEventListener('change', apply); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])
  const jump = (index: number) => {
    const element = section.current
    if (!element || !pinned) return
    const top = element.getBoundingClientRect().top + window.scrollY
    const span = element.offsetHeight - window.innerHeight
    const goal = top + span * ((index + 0.5) / 3)
    if (Math.abs(window.scrollY - goal) > span / 6) window.scrollTo({ top: goal, behavior: 'smooth' })
  }
  return <section ref={section} className={`o-story ${toneOf[active]}${pinned ? ' is-pinned' : ''}`} aria-labelledby="o-story-title" data-active={active} data-chapter="Divisions">
    <div className="o-story-sticky">
      {pinned && <div className="ox-scene o-story-scene"><LightField tone={lightOf[active]} focus={[0.62, 0.02]} /></div>}
      <div className="o-story-head">
        <p className="ox-kicker"><span className="ox-num">03</span>The divisions</p>
        <h2 id="o-story-title" className="ox-title">Three divisions. <em>One star.</em></h2>
      </div>
      <ol className="o-story-progress" aria-label="Divisions">
        {order.map((id, index) => <li key={id} className={`${toneOf[id]}${active === id ? ' is-active' : ''}`}><button type="button" onClick={() => jump(index)} aria-current={active === id ? 'true' : undefined} tabIndex={pinned ? 0 : -1}><i aria-hidden="true" />{divisions[id].word}</button></li>)}
      </ol>
      <div className="o-story-stage">
        {order.map((id, index) => {
          const chapter = chapters[id]
          return <article key={id} className={`o-chapter ${toneOf[id]}${active === id ? ' is-active' : ''}`} aria-labelledby={`o-chapter-${id}`} onFocus={() => jump(index)}>
            <div className="o-chapter-copy">
              <div className="o-chapter-top"><Lockup division={id} /></div>
              <h3 id={`o-chapter-${id}`}>{chapter.title}</h3>
              <p className="o-chapter-detail">{chapter.detail}</p>
              <ul className="o-chapter-inside">{chapter.inside.map(item => <li key={item}>{item}</li>)}</ul>
              <a className="ox-button ox-button--light" href={route(id)} data-magnetic>{chapter.action}<ArrowRight size={18} aria-hidden="true" /></a>
            </div>
            <a className="o-chapter-media ox-card" href={route(id)} tabIndex={-1} aria-hidden="true" data-spotlight data-tilt>
              <span className="ox-graded"><img src={chapter.image} srcSet={chapter.imageSet} sizes="(max-width: 1000px) 100vw, 50vw" alt="" loading="lazy" decoding="async" /></span>
              <small>{chapter.credit}</small>
            </a>
          </article>
        })}
      </div>
    </div>
  </section>
}

export default function HubExperience() {
  const [light, setLight] = useState<Division>('games')
  const star = useRef<HTMLDivElement>(null)
  const tone = toneOf[light]
  return <div className="home-experience">
    <section className={`o-hero ${tone}`} aria-labelledby="o-title">
      <div className="ox-scene"><LightField tone={lightOf[light]} focus={[0, 0.25]} anchor={star} /></div>
      <aside className="ox-rail o-rail o-rail--left tone-gold" aria-label="Out now">
        <p className="ox-kicker">Out now</p>
        <LoopVideo className="o-rail-video" label="the Chop-a-Chop! clip" sources={{ small: gameMedia('clip-1.mp4') }} poster={gameMedia('clip-1.webp')} />
        <img className="o-rail-logo" src={gameMedia('logo.webp')} width="1200" height="227" alt="Chop-a-Chop!" loading="lazy" />
        <a className="ox-button ox-button--light" href={ROBLOX_URL} target="_blank" rel="noopener noreferrer"><Play size={16} weight="fill" aria-hidden="true" />Play free<span className="sr-only"> on Roblox (opens in a new tab)</span></a>
      </aside>
      <div className="o-hero-inner">
        <div className="o-star-wrap" ref={star}>
          <OxyfelStar className="o-star" spin />
          <StarScene tone={lightOf[light]} />
        </div>
        <h1 id="o-title" className="ox-display o-title"><span className="ox-line"><span>One star.</span></span>{' '}<span className="ox-line"><span className="ox-glow">Three lights.</span></span></h1>
        <p className="ox-lede o-hero-lede">Oxyfel makes games for players, builds for companies and helps people with technology at home.</p>
        <nav className="o-lights" aria-label="Choose a division">
          {order.map(id => <a key={id} className={`o-light ${toneOf[id]}${light === id ? ' is-on' : ''}`} href={route(id)} onPointerEnter={() => setLight(id)} onFocus={() => setLight(id)} data-magnetic>
            <i aria-hidden="true" /><span className="o-light-name">{divisions[id].word}</span><span className="o-light-audience">{divisions[id].audience}</span><ArrowRight size={18} aria-hidden="true" />
          </a>)}
        </nav>
      </div>
      <aside className="ox-rail o-rail o-rail--right tone-gold" aria-label="Coming next">
        <p className="ox-kicker">Next on Chop-a-Chop!</p>
        <ul className="o-rail-drops">{chopDrops.filter(drop => drop.at).map(drop => <DropCountdown key={drop.id} drop={drop} />)}</ul>
        <p className="o-rail-note">Three divisions, one star. Point at a light to see its colour.</p>
      </aside>
      <a className="o-scroll" href="#now"><span>Now on Oxyfel</span><ArrowDown size={16} aria-hidden="true" /></a>
    </section>

    <div className="tone-gold"><Marquee label="Oxyfel news" items={['Chop-a-Chop! is out now', 'Free on Roblox', 'Halloween drop 13 Nov', 'The Crew 14 Nov', 'Five more worlds in the making']} /></div>

    <section className="ox-section o-now tone-gold" id="now" aria-labelledby="o-now-title" data-chapter="Out now" data-hide-playbar>
      <div className="o-now-card ox-card" data-spotlight data-reveal>
        <LoopVideo className="o-now-video" label="gameplay" sources={{ small: gameMedia('hero-small.mp4'), large: gameMedia('hero.mp4') }} poster={gameMedia('hero-poster-1280.webp')} posterSet={`${gameMedia('hero-poster-640.webp')} 640w, ${gameMedia('hero-poster-1280.webp')} 1280w`} />
        <div className="o-now-copy">
          <p className="o-badge"><i className="ox-live-dot" aria-hidden="true" /><span className="ox-num">01</span>Out now · Free on Roblox</p>
          <h2 id="o-now-title"><img className="o-now-logo" src={gameMedia('logo.webp')} width="1200" height="227" alt="Chop-a-Chop!" loading="lazy" decoding="async" /></h2>
          <p className="o-now-tagline">Chop by day. Survive the night.</p>
          <p className="o-now-text">The first game from Oxyfel Games. One chop can drop a whole row of trees; find rare woods, haul your logs by spaceship and survive when the forest fights back.</p>
          <div className="o-now-actions">
            <a className="ox-button ox-button--light ox-button--big" href={ROBLOX_URL} target="_blank" rel="noopener noreferrer" data-magnetic><Play size={18} weight="fill" aria-hidden="true" />Play free on Roblox<span className="sr-only"> (opens in a new tab)</span></a>
            <a className="ox-button ox-button--ghost" href={`${route('games')}#challenge`} data-magnetic>Take the 10-second challenge <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
          <ul className="o-now-drops" aria-label="Coming to Chop-a-Chop!">{chopDrops.filter(drop => drop.at).map(drop => <DropCountdown key={drop.id} drop={drop} compact remind />)}</ul>
        </div>
      </div>
    </section>

    <Showreel />

    <section className="o-stats" aria-label="Oxyfel in numbers">
      {stats.map(stat => <div key={stat.label} className="o-stat" data-reveal><strong className="ox-glow">{stat.value}</strong><span>{stat.label}</span><small>{stat.detail}</small></div>)}
    </section>

    <LightStory />

    <section className="ox-section o-about" aria-labelledby="o-about-title" data-chapter="Behind the star">
      <div className="o-about-art" aria-hidden="true"><OxyfelStar className="o-about-star" spin /></div>
      <div className="o-about-copy" data-reveal>
        <p className="ox-kicker"><span className="ox-num">04</span>Behind the star</p>
        <h2 id="o-about-title" className="ox-title">One maker. <em>Three ways to help.</em></h2>
        <p className="ox-lede">Oxyfel is the independent studio of Yane Zhekov. Games are made under Oxyfel Games, client work under Oxyfel Studio, and everyday help under Oxyfel Care.</p>
        <div className="o-about-links">
          <a className="ox-link" href={`${route('studio')}#personal`}>Meet Yane <ArrowRight size={17} aria-hidden="true" /></a>
          <a className="ox-link" href="https://v0-yanez.vercel.app/en" target="_blank" rel="noopener noreferrer">Portfolio <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      </div>
    </section>

    <section className="ox-section o-routes" aria-labelledby="o-routes-title" data-chapter="Get in touch">
      <div className="ox-section-head ox-section-head--center" data-reveal>
        <p className="ox-kicker"><span className="ox-num">05</span>Get in touch</p>
        <h2 id="o-routes-title" className="ox-title">Talk to the <em>right light.</em></h2>
      </div>
      <div className="o-route-row">
        <a className="o-route ox-card tone-gold" href={`${CONTACT_HREF}?subject=${encodeURIComponent('Oxyfel Games')}`} data-spotlight data-tilt data-reveal>
          <Lockup division="games" /><strong>Players, creators and press</strong><span>Questions about Chop-a-Chop!, coverage or collaborations.</span><span className="o-route-action"><EnvelopeSimple size={18} aria-hidden="true" />Email Oxyfel Games</span>
        </a>
        <a className="o-route ox-card tone-ice" href={`${route('studio')}#start-a-project`} data-spotlight data-tilt data-reveal>
          <Lockup division="studio" /><strong>Companies with a project</strong><span>A website, a game system or an interactive idea.</span><span className="o-route-action">Start a project<ArrowRight size={18} aria-hidden="true" /></span>
        </a>
        <a className="o-route ox-card tone-jade" href={`${route('care')}#care-contact`} data-spotlight data-tilt data-reveal>
          <Lockup division="care" /><strong>Help with technology at home</strong><span>Phones, computers and televisions, at a human pace, in Varna.</span><span className="o-route-action">Ask Oxyfel Care<ArrowRight size={18} aria-hidden="true" /></span>
        </a>
      </div>
    </section>
  </div>
}
