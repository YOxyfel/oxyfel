import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from '@phosphor-icons/react'

// Kinetic text band. The second copy only exists to make the loop seamless.
export function Marquee({ items, label, speed = 46 }: { items: string[]; label: string; speed?: number }) {
  const group = (hidden: boolean) => <div className="ox-marquee-group" aria-hidden={hidden || undefined}>{items.map(item => <span key={item} className="ox-marquee-item">{item}</span>)}</div>
  return <div className="ox-marquee" role="group" aria-label={label} style={{ ['--speed' as string]: `${speed}s` }}>
    <div className="ox-marquee-track">{group(false)}{group(true)}</div>
  </div>
}

// A muted gameplay loop that loads only when it scrolls into view, plays only while
// visible, never for reduced motion or data saver, and always has a pause button.
export function LoopVideo({ sources, poster, posterSet, className = '', label }: { sources: { small: string; large?: string }; poster: string; posterSet?: string; className?: string; label: string }) {
  const video = useRef<HTMLVideoElement>(null)
  const userPaused = useRef(false)
  const [mode, setMode] = useState<'poster' | 'playing' | 'paused'>('poster')
  useEffect(() => {
    const element = video.current
    if (!element) return
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || connection?.saveData) return
    let loaded = false
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !userPaused.current) {
        if (!loaded) { loaded = true; element.src = sources.large && window.innerWidth >= 900 ? sources.large : sources.small }
        element.play().catch(() => setMode('poster'))
      } else if (loaded) element.pause()
    }, { threshold: .2 })
    const playing = () => setMode('playing')
    const paused = () => setMode(current => current === 'poster' ? 'poster' : 'paused')
    element.addEventListener('playing', playing)
    element.addEventListener('pause', paused)
    observer.observe(element)
    return () => { observer.disconnect(); element.removeEventListener('playing', playing); element.removeEventListener('pause', paused) }
  }, [sources.large, sources.small])
  function toggle() {
    const element = video.current
    if (!element) return
    if (element.paused) { userPaused.current = false; element.play().catch(() => {}) }
    else { userPaused.current = true; element.pause() }
  }
  return <div className={`ox-video ${mode === 'playing' ? 'is-playing' : ''} ${className}`}>
    <img className="ox-video-poster" src={poster} srcSet={posterSet} sizes="(max-width: 900px) 100vw, 60vw" alt="" loading="lazy" decoding="async" />
    <video ref={video} className="ox-video-media" muted loop playsInline preload="none" tabIndex={-1} aria-hidden="true" />
    {mode !== 'poster' && <button type="button" className="ox-video-toggle" onClick={toggle} aria-pressed={mode === 'paused'}>
      {mode === 'playing' ? <Pause size={15} weight="fill" aria-hidden="true" /> : <Play size={15} weight="fill" aria-hidden="true" />}
      <span>{mode === 'playing' ? `Pause ${label}` : `Play ${label}`}</span>
    </button>}
  </div>
}
