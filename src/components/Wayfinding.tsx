import { useEffect, useState } from 'react'
import { Play, X } from '@phosphor-icons/react'
import { ROBLOX_URL } from '../content'

// Chapter rail: a quiet index of the page's sections on the right edge of wide screens.
// It reads sections marked with data-chapter, highlights the one in view and jumps on click.
export function ChapterRail() {
  const [chapters, setChapters] = useState<{ id: string; label: string }[]>([])
  const [active, setActive] = useState('')
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('main [data-chapter]')]
    sections.forEach((section, index) => { if (!section.id) section.id = `chapter-${index + 1}` })
    setChapters(sections.map(section => ({ id: section.id, label: section.dataset.chapter || '' })))
    const visible = new Map<string, number>()
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) visible.set(entry.target.id, entry.intersectionRatio)
      let best = '', ratio = 0
      for (const [id, value] of visible) if (value > ratio) { ratio = value; best = id }
      if (best) setActive(best)
    }, { threshold: [0, .15, .35, .6] })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  if (chapters.length < 3) return null
  return <nav className="ox-rail-nav" aria-label="On this page">
    <ol>{chapters.map((chapter, index) => <li key={chapter.id} className={active === chapter.id ? 'is-active' : ''}>
      <a href={`#${chapter.id}`} aria-current={active === chapter.id ? 'location' : undefined}><span className="ox-rail-label">{chapter.label}</span><span className="ox-rail-num">{String(index + 1).padStart(2, '0')}</span></a>
    </li>)}</ol>
  </nav>
}

// Floating Play bar: once the opening scrolls away, Chop-a-Chop! stays one tap away.
// It steps aside near the footer and can be dismissed for the visit.
export function PlayBar() {
  const [shown, setShown] = useState(false)
  const [closed, setClosed] = useState(false)
  useEffect(() => {
    try { if (sessionStorage.getItem('ox-playbar') === 'closed') { setClosed(true); return } } catch { /* storage unavailable */ }
    const blockers = [document.querySelector('main section'), document.querySelector('.h-footer'), ...document.querySelectorAll('[data-hide-playbar]')].filter((element): element is Element => !!element)
    const inView = new Set<Element>(blockers.slice(0, 1))
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) { if (entry.isIntersecting) inView.add(entry.target); else inView.delete(entry.target) }
      setShown(inView.size === 0)
    }, { threshold: 0.05 })
    blockers.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])
  if (closed) return null
  const close = () => { setClosed(true); try { sessionStorage.setItem('ox-playbar', 'closed') } catch { /* storage unavailable */ } }
  return <div className={`ox-playbar tone-gold${shown ? ' is-shown' : ''}`} aria-hidden={!shown}>
    <span className="ox-playbar-live"><i className="ox-live-dot" aria-hidden="true" />Out now</span>
    <img src={`${import.meta.env.BASE_URL}media/chop-a-chop/logo.webp`} width="1200" height="227" alt="Chop-a-Chop!" />
    <a className="ox-button ox-button--light" href={ROBLOX_URL} target="_blank" rel="noopener noreferrer" tabIndex={shown ? 0 : -1}><Play size={16} weight="fill" aria-hidden="true" />Play free<span className="sr-only"> on Roblox (opens in a new tab)</span></a>
    <button type="button" className="ox-playbar-close" onClick={close} aria-label="Hide the Play bar" tabIndex={shown ? 0 : -1}><X size={16} aria-hidden="true" /></button>
  </div>
}
