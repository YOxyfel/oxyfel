import { useEffect, useState } from 'react'
import type { GameDrop } from '../content'
import { RemindMe } from './Share'

// A drop countdown. The prerendered HTML shows the date in UTC; once the page runs,
// it shows the visitor's own local time and ticks down. Screen readers get one stable
// label instead of a number that changes every second.
function parts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  return { d: Math.floor(total / 86400), h: Math.floor(total / 3600) % 24, m: Math.floor(total / 60) % 60, s: total % 60 }
}
const two = (n: number) => String(n).padStart(2, '0')

export function DropCountdown({ drop, compact = false, remind = false }: { drop: GameDrop; compact?: boolean; remind?: boolean }) {
  const at = drop.at ? Date.parse(drop.at) : NaN
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    if (Number.isNaN(at)) return
    let timer = 0
    const tick = () => { setNow(Date.now()); timer = window.setTimeout(tick, 1000 - (Date.now() % 1000)) }
    const visibility = () => { window.clearTimeout(timer); if (document.visibilityState === 'visible') tick() }
    tick()
    document.addEventListener('visibilitychange', visibility)
    return () => { window.clearTimeout(timer); document.removeEventListener('visibilitychange', visibility) }
  }, [at])
  const utc = Number.isNaN(at) ? drop.date : `${drop.date}, ${new Date(at).toISOString().slice(11, 16)} UTC`
  const local = now !== null && !Number.isNaN(at)
    ? new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(at)
    : utc
  const live = now !== null && !Number.isNaN(at) && now >= at
  const left = now !== null && !Number.isNaN(at) ? parts(at - now) : null
  return <li className={`ox-drop${live ? ' ox-drop--live' : ''}${compact ? ' ox-drop--compact' : ''}`}>
    <span className="ox-drop-name">{drop.name}</span>
    {live
      ? <span className="ox-drop-live"><i aria-hidden="true" />Live now</span>
      : left
        ? <span className="ox-drop-clock" aria-label={`Opens ${local}`}>
            <span aria-hidden="true"><b>{left.d}</b>d <b>{two(left.h)}</b>h <b key={`m${left.m}`} className="ox-tick">{two(left.m)}</b>m{!compact && <span className="ox-drop-sec"> <b key={`s${left.s}`} className="ox-tick">{two(left.s)}</b>s</span>}</span>
          </span>
        : <span className="ox-drop-clock">{drop.at ? 'Opens soon' : 'Coming'}</span>}
    <time className="ox-drop-date" dateTime={drop.at ?? undefined}>{live ? `Since ${local}` : local}</time>
    {remind && !live && drop.at && <RemindMe drop={drop} />}
  </li>
}
