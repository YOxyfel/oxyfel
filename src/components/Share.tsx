import { useEffect, useRef, useState } from 'react'
import { Bell, Check, Copy, ShareNetwork } from '@phosphor-icons/react'
import { ROBLOX_URL } from '../content'
import type { GameDrop } from '../content'

// Sharing without trackers: the device's own share sheet where there is one,
// otherwise plain links to each network (nothing loads from them until a visitor clicks).
export const pageUrl = (path = '') => `${__SITE_URL__}${path}`

export function ShareButton({ title, text, url, label = 'Share', className = '' }: { title: string; text: string; url: string; label?: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => { if (!box.current?.contains(event.target as Node)) setOpen(false) }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [open])
  async function share() {
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title, text, url }); return } catch (error) { if ((error as DOMException)?.name === 'AbortError') return }
    }
    setOpen(value => !value)
  }
  async function copy() {
    try { await navigator.clipboard.writeText(`${text} ${url}`); setCopied(true); window.setTimeout(() => setCopied(false), 1800) } catch { setCopied(false) }
  }
  const message = encodeURIComponent(text), link = encodeURIComponent(url)
  const networks = [
    ['X', `https://twitter.com/intent/tweet?text=${message}&url=${link}`],
    ['WhatsApp', `https://wa.me/?text=${message}%20${link}`],
    ['Telegram', `https://t.me/share/url?url=${link}&text=${message}`],
    ['Reddit', `https://www.reddit.com/submit?url=${link}&title=${encodeURIComponent(title)}`],
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${link}`],
    ['Email', `mailto:?subject=${encodeURIComponent(title)}&body=${message}%0A%0A${link}`],
  ] as const
  return <div className={`ox-share ${className}`} ref={box}>
    <button type="button" className="ox-share-button" onClick={share} aria-expanded={open} aria-haspopup="true"><ShareNetwork size={18} weight="bold" aria-hidden="true" />{label}</button>
    {open && <div className="ox-share-panel" role="group" aria-label={label}>
      <button type="button" onClick={copy}>{copied ? <Check size={16} weight="bold" aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{copied ? 'Link copied' : 'Copy link'}</button>
      {networks.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer">{name}<span className="sr-only"> (opens in a new tab)</span></a>)}
    </div>}
  </div>
}

// Calendar reminders for timed drops. Both links work without JavaScript: a Google
// Calendar template and a downloadable .ics file (Apple Calendar, Outlook and others).
const stamp = (value: number) => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
export function reminderLinks(drop: GameDrop) {
  if (!drop.at) return null
  const start = Date.parse(drop.at), end = start + 60 * 60 * 1000
  const title = `Chop-a-Chop! ${drop.name}`
  const details = `${drop.detail}. Play free on Roblox: ${ROBLOX_URL}`
  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${stamp(start)}/${stamp(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent('Roblox')}`
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Oxyfel Games//Chop-a-Chop! drops//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    `UID:${drop.id}-2026@oxyfel`, 'DTSTAMP:20261106T000000Z', `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${title}`, `DESCRIPTION:${details}`, `URL:${ROBLOX_URL}`, 'LOCATION:Roblox',
    'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY', `DESCRIPTION:${title} starts in 15 minutes`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  return { google, ics: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`, file: `chop-a-chop-${drop.id}.ics` }
}

export function RemindMe({ drop }: { drop: GameDrop }) {
  const links = reminderLinks(drop)
  if (!links) return null
  return <details className="ox-remind">
    <summary><Bell size={15} weight="bold" aria-hidden="true" />Remind me</summary>
    <div className="ox-remind-panel">
      <a href={links.google} target="_blank" rel="noopener noreferrer">Google Calendar<span className="sr-only"> (opens in a new tab)</span></a>
      <a href={links.ics} download={links.file}>Apple, Outlook and others (.ics)</a>
    </div>
  </details>
}
