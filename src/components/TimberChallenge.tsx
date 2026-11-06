import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowClockwise, Crown, Play, Trophy } from '@phosphor-icons/react'
import { ROBLOX_URL } from '../content'
import { pageUrl, ShareButton } from './Share'
import './timber.css'

// The 10-second TIMBER! challenge: tap, click or press Space to chop. Five hits fell a
// tree; golden rare trees are worth three. The score can be sent to a friend as a
// challenge link (?challenge=N), which shows them the score to beat.
const DURATION = 10000, HITS = 5, RARE_CHANCE = 0.18
const ranks = [[24, 'Fire God'], [16, 'Timber Titan'], [10, 'Lumberjack'], [5, 'Woodcutter'], [0, 'Sapling']] as const
const rankOf = (points: number) => ranks.find(([at]) => points >= at)![1]
type Chip = { id: number; dx: number; dy: number; spin: number; gold: boolean }

export function TimberChallenge() {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready')
  const [left, setLeft] = useState(DURATION)
  const [hits, setHits] = useState(0)
  const [felled, setFelled] = useState(0)
  const [points, setPoints] = useState(0)
  const [rare, setRare] = useState(false)
  const [fall, setFall] = useState<{ key: number; rare: boolean } | null>(null)
  const [chips, setChips] = useState<Chip[]>([])
  const [swing, setSwing] = useState(0)
  const [best, setBest] = useState<number | null>(null)
  const [friend, setFriend] = useState<number | null>(null)
  const ends = useRef(0)
  const chipId = useRef(0)
  const result = useRef({ points: 0, felled: 0 })
  const hitsRef = useRef(0)
  const rareRef = useRef(false)
  const bestRef = useRef(0)

  useEffect(() => {
    try { const stored = Number(localStorage.getItem('ox-timber-best')); if (stored > 0) { bestRef.current = stored; setBest(stored) } } catch { /* storage unavailable */ }
    const challenge = Number(new URLSearchParams(window.location.search).get('challenge'))
    if (Number.isInteger(challenge) && challenge > 0 && challenge < 200) setFriend(challenge)
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return
    let frame = 0
    const tick = () => {
      const remaining = Math.max(0, ends.current - performance.now())
      setLeft(remaining)
      if (remaining <= 0) {
        setPhase('done')
        const next = Math.max(bestRef.current, result.current.points)
        bestRef.current = next
        setBest(next)
        try { localStorage.setItem('ox-timber-best', String(next)) } catch { /* storage unavailable */ }
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [phase])

  const chop = useCallback(() => {
    if (phase === 'done') return
    if (phase === 'ready') {
      ends.current = performance.now() + DURATION
      result.current = { points: 0, felled: 0 }
      hitsRef.current = 0
      setHits(0); setFelled(0); setPoints(0); setLeft(DURATION); setPhase('playing')
    }
    setSwing(value => value + 1)
    const gold = rareRef.current
    const burst: Chip[] = Array.from({ length: 6 }, () => ({ id: chipId.current++, dx: (Math.random() - 0.3) * 160, dy: -40 - Math.random() * 120, spin: (Math.random() - 0.5) * 720, gold: gold && Math.random() > 0.4 }))
    setChips(current => [...current.slice(-24), ...burst])
    window.setTimeout(() => setChips(current => current.filter(chip => !burst.includes(chip))), 750)
    const next = hitsRef.current + 1
    if (next < HITS) { hitsRef.current = next; setHits(next); return }
    hitsRef.current = 0
    setHits(0)
    result.current = { points: result.current.points + (gold ? 3 : 1), felled: result.current.felled + 1 }
    setPoints(result.current.points); setFelled(result.current.felled)
    setFall({ key: Date.now(), rare: gold })
    rareRef.current = Math.random() < RARE_CHANCE
    setRare(rareRef.current)
  }, [phase])

  function reset() { hitsRef.current = 0; rareRef.current = false; setPhase('ready'); setLeft(DURATION); setHits(0); setFelled(0); setPoints(0); setFall(null); setRare(false) }

  const seconds = (left / 1000).toFixed(1)
  const ring = 2 * Math.PI * 46
  const shareText = `I felled ${felled} ${felled === 1 ? 'tree' : 'trees'} (${points} points, ${rankOf(points)}) in the 10-second TIMBER! challenge. Can you beat me? Then play Chop-a-Chop! free on Roblox.`
  return <div className={`tc tc--${phase}`}>
    <div className="tc-board ox-card" data-spotlight>
      <div className="tc-hud" aria-hidden={phase === 'ready'}>
        <span className="tc-stat"><small>Trees</small><b key={`f${felled}`} className="ox-tick">{felled}</b></span>
        <span className="tc-timer"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" /><circle className="tc-timer-left" cx="50" cy="50" r="46" style={{ strokeDasharray: ring, strokeDashoffset: ring * (1 - left / DURATION) }} /></svg><b>{seconds}</b><small>seconds</small></span>
        <span className="tc-stat"><small>Points</small><b key={`p${points}`} className="ox-tick">{points}</b></span>
      </div>
      <div className="tc-field">
        <div className="tc-ground" aria-hidden="true" />
        {fall && <div key={fall.key} className={`tc-tree tc-tree--falling${fall.rare ? ' tc-tree--rare' : ''}`} aria-hidden="true"><Tree /></div>}
        {fall && <span key={`t${fall.key}`} className="tc-timber" aria-hidden="true">{fall.rare ? 'RARE! +3' : 'TIMBER!'}</span>}
        <button type="button" className={`tc-tree tc-tree--live${rare ? ' tc-tree--rare' : ''}`} onClick={chop} onKeyDown={event => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); if (!event.repeat) chop() } }} disabled={phase === 'done'} aria-label={phase === 'ready' ? 'Start the challenge: chop the tree' : `Chop the tree, hit ${hits + 1} of ${HITS}`}>
          <span key={`g${fall?.key ?? 0}`} className="tc-grow"><span key={`h${swing}`} className={swing ? 'tc-shake' : ''}><Tree /></span></span>
        </button>
        <span key={`a${swing}`} className={`tc-axe${swing ? ' tc-axe--swing' : ''}`} aria-hidden="true"><Axe /></span>
        <div className="tc-chips" aria-hidden="true">{chips.map(chip => <i key={chip.id} className={chip.gold ? 'is-gold' : ''} style={{ ['--dx' as string]: `${chip.dx}px`, ['--dy' as string]: `${chip.dy}px`, ['--spin' as string]: `${chip.spin}deg` }} />)}</div>
        <div className="tc-hits" aria-hidden="true">{Array.from({ length: HITS }, (_, index) => <i key={index} className={index < hits ? 'is-on' : ''} />)}</div>
        {phase === 'ready' && <p className="tc-start" aria-hidden="true"><Play size={18} weight="fill" />Tap the tree to start</p>}
      </div>
      <p className="sr-only" role="status" aria-live="polite">{phase === 'done' ? `Time! You felled ${felled} trees for ${points} points. Rank: ${rankOf(points)}.` : ''}</p>
      {phase === 'done' && <div className="tc-result">
        <p className="tc-result-rank"><Crown size={22} weight="fill" aria-hidden="true" />{rankOf(points)}</p>
        <p className="tc-result-score"><b>{points}</b> points · {felled} {felled === 1 ? 'tree' : 'trees'}</p>
        {friend !== null && <p className="tc-result-friend">{points > friend ? `You beat your friend’s ${friend}!` : points === friend ? `A tie with your friend’s ${friend}.` : `Your friend’s ${friend} still stands.`}</p>}
        <p className="tc-result-real">In Chop-a-Chop!, one chop can drop a whole row.</p>
        <div className="tc-result-actions">
          <ShareButton label="Challenge a friend" title="Beat my TIMBER! score" text={shareText} url={`${pageUrl('games/')}?challenge=${points}#challenge`} />
          <button type="button" className="ox-button ox-button--ghost" onClick={reset}><ArrowClockwise size={18} aria-hidden="true" />Play again</button>
          <a className="ox-button ox-button--light" href={ROBLOX_URL} target="_blank" rel="noopener noreferrer"><Play size={18} weight="fill" aria-hidden="true" />Play the real thing<span className="sr-only"> on Roblox (opens in a new tab)</span></a>
        </div>
      </div>}
      <noscript><p className="tc-noscript">The challenge needs JavaScript. Chop-a-Chop! itself is free on Roblox.</p></noscript>
    </div>
    <div className="tc-side">
      {friend !== null && <p className="tc-friend"><Trophy size={20} weight="fill" aria-hidden="true" />A friend scored <b>{friend}</b>. Beat it.</p>}
      <p className="tc-best">{best ? <>Your best: <b>{best}</b> points</> : 'No score yet. Chop to set one.'}</p>
      <ul className="tc-rules">
        <li><b>5 hits</b> fell a tree</li>
        <li><b>Golden trees</b> are worth 3</li>
        <li><b>10 seconds</b> on the clock</li>
        <li>Tap, click or press <kbd>Space</kbd></li>
      </ul>
    </div>
  </div>
}

function Tree() {
  return <svg viewBox="0 0 160 220" className="tc-tree-art">
    <defs>
      <radialGradient id="tc-canopy" cx=".38" cy=".32" r=".8"><stop offset="0" stopColor="#f6ecc5" /><stop offset=".6" stopColor="#dcc78f" /><stop offset="1" stopColor="#a98f55" /></radialGradient>
      <linearGradient id="tc-trunk" x1="0" x2="1"><stop offset="0" stopColor="#6e2b22" /><stop offset=".5" stopColor="#9a4434" /><stop offset="1" stopColor="#5c231c" /></linearGradient>
    </defs>
    <rect className="tc-trunk" x="62" y="110" width="36" height="104" rx="4" fill="url(#tc-trunk)" />
    <path d="M70 130 v70 M84 120 v86" stroke="#00000033" strokeWidth="3" />
    <circle className="tc-canopy" cx="80" cy="78" r="66" fill="url(#tc-canopy)" />
    <circle cx="58" cy="60" r="18" fill="#ffffff22" />
  </svg>
}

function Axe() {
  return <svg viewBox="0 0 120 120">
    <rect x="54" y="18" width="10" height="96" rx="5" transform="rotate(35 59 66)" fill="#8b5a2b" />
    <path d="M22 30 Q40 6 70 18 L60 46 Q38 40 22 30 Z" fill="#cfd6dd" stroke="#7d8790" strokeWidth="3" transform="rotate(35 59 66) translate(4 -6)" />
  </svg>
}
