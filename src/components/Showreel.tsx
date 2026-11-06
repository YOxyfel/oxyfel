import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import { divisions, media } from '../content'
import type { Division } from '../content'
import { route, toneOf } from './HubShell'

// The showreel: real frames from every division on one strip of film. On wide screens
// the section is pinned and the strip rolls sideways as you scroll; the frame passing
// the gate turns to full colour. Phones, reduced motion and no-JavaScript visitors get
// an ordinary swipeable row.
const game = (name: string) => `${import.meta.env.BASE_URL}media/chop-a-chop/${name}`
const pair = (path: (name: string) => string, name: string) => ({ src: path(`${name}-1280.webp`), set: `${path(`${name}-640.webp`)} 640w, ${path(`${name}-1280.webp`)} 1280w` })
type Frame = { division: Division; title: string; status: string; src: string; set: string; href: string }
const frames: Frame[] = [
  { division: 'games', title: 'Dawn over the forest', status: 'Chop-a-Chop! · Out now', ...pair(game, 'shot-dawn'), href: `${route('games')}#chop-a-chop` },
  { division: 'games', title: 'The forest fights back', status: 'Chop-a-Chop! · Out now', ...pair(game, 'shot-giant'), href: `${route('games')}#features` },
  { division: 'games', title: 'Haul it home by spaceship', status: 'Chop-a-Chop! · Out now', ...pair(game, 'shot-hauler'), href: `${route('games')}#features` },
  { division: 'games', title: 'Wuhen & Xuan', status: 'PC demo in development', ...pair(media, 'wuhen-world'), href: `${route('games')}#wuhen` },
  { division: 'games', title: 'Mosquittoz', status: 'Windows LAN alpha', ...pair(media, 'mosquitto-world'), href: `${route('games')}#mosquittoz` },
  { division: 'games', title: 'Constellore', status: 'Play in the browser', ...pair(media, 'constellore-world'), href: `${route('games')}#constellore` },
  { division: 'studio', title: 'This website', status: 'Case study', ...pair(media, 'studio-site-now'), href: `${route('studio')}#case-websites` },
  { division: 'care', title: 'Help that stays', status: 'Eldervice · Varna pilot', ...pair(media, 'care-together'), href: route('care') },
]
const total = String(frames.length).padStart(2, '0')
const toneWord: Record<Division, string> = { games: 'gold', studio: 'ice', care: 'jade' }

export function Showreel() {
  const section = useRef<HTMLElement>(null)
  const gate = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const row = useRef<HTMLOListElement>(null)
  const count = useRef<HTMLElement>(null)
  const sync = useRef(() => {})
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    const element = section.current, viewport = gate.current, strip = track.current, list = row.current
    if (!element || !viewport || !strip || !list) return
    const wide = window.matchMedia('(min-width: 1000px) and (prefers-reduced-motion: no-preference)')
    const items = Array.from(list.children) as HTMLElement[]
    let slots: { left: number; width: number }[] = [], width = 0, distance = 0, frame = 0, current = -1
    const measure = () => {
      width = viewport.clientWidth
      slots = items.map(item => ({ left: list.offsetLeft + item.offsetLeft, width: item.offsetWidth }))
      distance = wide.matches ? Math.max(0, strip.scrollWidth - width) : 0
      if (wide.matches) element.style.setProperty('--reel-run', `${Math.round(distance)}px`)
      else element.style.removeProperty('--reel-run')
    }
    // Light the frame nearest the gate; the others fall back into their division tone.
    const light = (offset: number, centre: number) => {
      let best = 0, bestFocus = -1
      slots.forEach((slot, index) => {
        const away = slot.left - offset + slot.width / 2 - centre
        const focus = Math.max(0, 1 - Math.abs(away) / (slot.width * 1.4))
        items[index].style.setProperty('--focus', focus.toFixed(3))
        items[index].style.setProperty('--shift', Math.max(-1, Math.min(1, away / width)).toFixed(3))
        if (focus > bestFocus) { bestFocus = focus; best = index }
      })
      if (best !== current) {
        current = best
        if (count.current) count.current.textContent = String(best + 1).padStart(2, '0')
        element.dataset.tone = toneWord[frames[best].division]
      }
    }
    const move = () => {
      frame = 0
      if (!wide.matches) {
        strip.style.transform = ''
        // In the swipeable row the gate is where a frame snaps: the first frame's place at
        // the start, sliding to the last frame's place as the row reaches its end.
        const scrolled = list.scrollLeft, span = Math.max(1, list.scrollWidth - list.clientWidth), progress = Math.min(1, scrolled / span)
        const first = slots[0], last = slots[slots.length - 1]
        const start = first.left + first.width / 2, end = width - first.left - last.width / 2
        element.style.setProperty('--reel', progress.toFixed(4))
        light(scrolled, start + (end - start) * progress)
        return
      }
      const rect = element.getBoundingClientRect()
      const span = Math.max(1, rect.height - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / span))
      strip.style.transform = `translate3d(${(-progress * distance).toFixed(1)}px, 0, 0)`
      element.style.setProperty('--reel', progress.toFixed(4))
      light(progress * distance, width * .58)
    }
    sync.current = () => { measure(); move() }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(move) }
    const apply = () => { setPinned(wide.matches); sync.current() }
    // Keyboard users move through the frames with Tab: scroll the page so the focused
    // frame rolls into the gate.
    const onFocus = (event: FocusEvent) => {
      if (!wide.matches || !distance) return
      const index = items.findIndex(item => item.contains(event.target as Node))
      if (index < 0) return
      const goal = Math.min(1, Math.max(0, (slots[index].left + slots[index].width / 2 - width * .58) / distance))
      const top = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top + goal * (element.offsetHeight - window.innerHeight), behavior: 'auto' })
    }
    apply()
    wide.addEventListener('change', apply)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', sync.current)
    list.addEventListener('scroll', onScroll, { passive: true })
    element.addEventListener('focusin', onFocus)
    return () => {
      cancelAnimationFrame(frame)
      wide.removeEventListener('change', apply)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', sync.current)
      list.removeEventListener('scroll', onScroll)
      element.removeEventListener('focusin', onFocus)
    }
  }, [])
  useEffect(() => { sync.current() }, [pinned])
  return <section ref={section} className={`o-reel tone-gold${pinned ? ' is-pinned' : ''}`} aria-labelledby="o-reel-title" data-chapter="The work">
    <div ref={gate} className="o-reel-gate">
      <div ref={track} className="o-reel-track">
        <header className="o-reel-head">
          <p className="ox-kicker"><span className="ox-num">02</span>The work</p>
          <h2 id="o-reel-title" className="ox-title">Everything we make, <em>frame by frame.</em></h2>
          <p className="o-reel-lede">Real frames, no mock-ups: the game that is out now, worlds in the making, work for companies and help at home.</p>
          <p className="o-reel-hint" aria-hidden="true"><span className="o-reel-hint-scroll">Scroll to roll the film</span><span className="o-reel-hint-swipe">Swipe through the frames</span><ArrowRight size={16} /></p>
        </header>
        <ol ref={row} className="o-reel-row" aria-label="Frames from Oxyfel work">
          {frames.map((item, index) => <li key={item.title} className={`o-reel-frame ${toneOf[item.division]}`}>
            <a className="o-reel-card" href={item.href} data-spotlight>
              <span className="o-reel-top">
                <span className="o-reel-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="o-reel-division"><i aria-hidden="true" />{divisions[item.division].name}</span>
              </span>
              <span className="o-reel-media" aria-hidden="true">
                <img className="o-reel-tone" src={item.src} srcSet={item.set} sizes="(max-width: 1000px) 82vw, 46vw" alt="" loading="lazy" decoding="async" />
                <img className="o-reel-colour" src={item.src} srcSet={item.set} sizes="(max-width: 1000px) 82vw, 46vw" alt="" loading="lazy" decoding="async" />
                <span className="o-reel-go"><ArrowUpRight size={20} /></span>
              </span>
              <span className="o-reel-caption"><strong>{item.title}</strong><small>{item.status}</small></span>
            </a>
          </li>)}
        </ol>
      </div>
      <div className="o-reel-bar" aria-hidden="true">
        <span className="o-reel-label">Oxyfel · The work</span>
        <span className="o-reel-meter"><i /></span>
        <span className="o-reel-count"><b ref={count}>01</b> / {total}</span>
      </div>
    </div>
  </section>
}
