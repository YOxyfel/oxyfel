import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, ArrowsHorizontal, Asterisk, Check, Plus } from '@phosphor-icons/react'
import { media } from '../content'
import { ContactPanel } from '../components/ContactPanel'
import './studio.css'

type CaseId = 'games' | 'websites' | 'interactive'
const caseIds: CaseId[] = ['games', 'websites', 'interactive']
const base = import.meta.env.BASE_URL
const caseTitles = { games: 'Games', websites: 'Websites', interactive: 'Interactive' }
function caseFromHash(): CaseId | undefined {
  const value = window.location.hash.replace('#case-', '')
  return caseIds.find(id => id === value)
}
function studioHistoryState(id: CaseId) {
  const existing = window.history.state
  return { ...(existing && typeof existing === 'object' ? existing : {}), oxyfelStudioCase: id }
}
function caseFromHistory(): CaseId | undefined {
  return caseIds.find(id => id === window.history.state?.oxyfelStudioCase)
}

type Decision = { title: string; body: string }
function Decisions({ id, items }: { id: string; items: Decision[] }) {
  const [selected, setSelected] = useState(0)
  return <div className="s-decisions">
    <p className="s-kicker">Inspect a decision</p>
    <div className="s-decision-controls" role="group" aria-label={`Design decisions for ${id}`}>
      {items.map((item, i) => <button key={item.title} type="button" aria-pressed={selected === i} aria-controls={`s-decision-${id}`} onClick={() => setSelected(i)}><span>{String(i + 1).padStart(2, '0')}</span>{item.title}<Plus size={16} aria-hidden="true" /></button>)}
    </div>
    <p className="s-decision-note" id={`s-decision-${id}`} aria-live="polite"><span aria-hidden="true">{String(selected + 1).padStart(2, '0')}</span>{items[selected].body}</p>
    <noscript><div className="s-static-decisions">{items.slice(1).map(item => <div key={item.title}><h4>{item.title}</h4><p>{item.body}</p></div>)}</div></noscript>
  </div>
}

function WebsiteEvidence() {
  const [reveal, setReveal] = useState(70)
  const [mobile, setMobile] = useState(false)
  return <div className="s-evidence">
    <div className="s-evidence-toolbar"><span>Oxyfel / a change in structure</span><div role="group" aria-label="Website preview format"><button type="button" aria-pressed={!mobile} onClick={() => setMobile(false)}>Desktop comparison</button><button type="button" aria-pressed={mobile} onClick={() => setMobile(true)}>Mobile result</button></div></div>
    {mobile ? <figure className="s-mobile-proof"><img src={media('studio-hub-mobile.webp')} width="390" height="844" alt="Actual mobile hub capture: all three experience entrances are visible beneath the introduction." loading="lazy" /><figcaption><span>Same destinations.<br /><em>A different rhythm.</em></span><p>Three compact entrances keep every direction visible on arrival. Navigation stays available as you explore.</p><small>Current hub · 6 September 2026</small></figcaption></figure> : <>
      <figure className="s-comparison">
        <div className="s-comparison-images">
          <img className="s-compare-before" src={media('studio-oxyfel-previous.webp')} width="1600" height="1000" alt="Before: Oxyfel's earlier edition opened with a single Wuhen landscape and placed every kind of project in one page." loading="lazy" />
          <div className="s-compare-after" style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}><img src={media('studio-hub-after.webp')} width="1440" height="1000" alt="After: the redesigned Oxyfel hub gives Worlds, Everyday, and Studio their own entrances." loading="lazy" /></div>
          <div className="s-comparison-line" style={{ left: `${reveal}%` }} aria-hidden="true"><span><ArrowsHorizontal size={21} aria-hidden="true" /></span></div>
          {reveal > 10 && <span className="s-compare-label s-label-after">Hub direction</span>}{reveal < 90 && <span className="s-compare-label s-label-before">Previous edition</span>}
        </div>
        <figcaption>Two real website captures. The structure changed before the decoration did.</figcaption>
      </figure>
      <div className="s-comparison-control"><label htmlFor="studio-reveal">Reveal the hub <output htmlFor="studio-reveal">{reveal}%</output></label><input id="studio-reveal" type="range" min="0" max="100" step="1" value={reveal} aria-valuetext={`${reveal}% of the hub direction revealed`} onChange={event => setReveal(Number(event.target.value))} /><div className="s-reveal-presets" role="group" aria-label="Comparison position"><button type="button" onClick={() => setReveal(0)}>Previous edition</button><button type="button" onClick={() => setReveal(50)}>Compare</button><button type="button" onClick={() => setReveal(100)}>Hub direction</button></div></div>
    </>}
    <noscript><p className="s-static-links">Open the <a href={media('studio-oxyfel-previous.webp')}>previous edition</a>, <a href={media('studio-hub-after.webp')}>hub direction</a>, or <a href={media('studio-hub-mobile.webp')}>mobile capture</a> at full size.</p></noscript>
    <Decisions id="websites" items={[
      { title: 'One useful choice', body: 'The opening asks where you want to go: original games, everyday technology help, or creative development. The categories stay clear without putting every project into the same layout.' },
      { title: 'A shared way home', body: 'Every experience keeps the Oxyfel entrance, project directory, and routes to the other parts of the studio. Different atmospheres remain part of one place.' },
      { title: 'Depth by invitation', body: 'The first screen sets the direction. Detailed work, demonstrations, and practical next steps belong inside the relevant experience, where they can be useful.' },
    ]} />
  </div>
}

function GameEvidence() {
  const [view, setView] = useState<'model' | 'runtime'>('model')
  return <div className="s-evidence">
    <div className="s-evidence-toolbar"><span>Mosquittoz / recorded development</span><div role="group" aria-label="Mosquittoz development evidence"><button type="button" aria-pressed={view === 'model'} onClick={() => setView('model')}>In-engine model</button><button type="button" aria-pressed={view === 'runtime'} onClick={() => setView('runtime')}>Teamplay in engine</button></div></div>
    <figure className={`s-engine-proof s-engine-proof-${view}`}>
      <div><img src={media(view === 'model' ? 'studio-mosquitto-model.webp' : 'studio-mosquitto-teamplay.webp')} width={view === 'model' ? 1280 : 1920} height={view === 'model' ? 720 : 1080} loading="lazy" alt={view === 'model' ? 'The integrated Average Mosquitto model in an Unreal Engine prototype render.' : 'Packaged Swarm runtime test: a mosquito marks a human as a rally target while four AI flyers respond in the yard.'} /></div>
      <figcaption>{view === 'model' ? 'Integrated Average model · in-engine render' : 'Swarm teamplay prototype · 6 September 2026'}<span>{view === 'model' ? 'Model evidence, not gameplay' : 'Fixed-position development test'}</span></figcaption>
    </figure>
    <p className="s-static-links s-source-link"><a href={media(view === 'model' ? 'studio-mosquitto-model.webp' : 'studio-mosquitto-teamplay.webp')} target="_blank" rel="noopener noreferrer">Open full-size capture <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></p><noscript><p className="s-static-links">Also inspect the <a href={media('studio-mosquitto-teamplay.webp')}>Swarm teamplay runtime capture</a>.</p></noscript>
    <Decisions id="games" items={[
      { title: 'One shared economy', body: 'Feeding, depositing blood, incubation, and colony growth connect to the same server-owned game state. Humans can interrupt that loop by destroying the nests.' },
      { title: 'Players before AI', body: 'Ready hatchlings revive waiting players before the colony spends its surplus on AI. That ordering gives the shared resource an immediate team purpose.' },
      { title: 'A focused playtest', body: 'The current build concentrates on one Safehouse and player-hosted Windows LAN sessions. It is a systems alpha; internet matchmaking and a public game download are not offered here.' },
    ]} />
  </div>
}

function InteractiveEvidence() {
  const [detail, setDetail] = useState(0)
  const notes = [
    { title: 'A clear goal', text: 'The target stays at the top. Exploration has a direction without prescribing every move.', area: { left: '29%', top: '1%', width: '26%', height: '7%' } },
    { title: 'Room to experiment', text: 'The board holds the words you are working with. Undo, Tidy, and the recipe trail support trying another route.', area: { left: '12%', top: '49%', width: '51%', height: '10%' } },
    { title: 'Keep a discovery', text: 'New words join the inventory. A successful experiment becomes material for the next one.', area: { left: '79%', top: '10%', width: '20%', height: '63%' } },
  ]
  return <div className="s-evidence">
    <div className="s-evidence-toolbar"><span>Constellore / inside the interface</span><a href="https://yoxyfel.github.io/constellore/play/" target="_blank" rel="noopener noreferrer">Play browser practice <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div>
    <figure className="s-interactive-proof"><div><img src={media('studio-constellore-board.webp')} width="1440" height="900" loading="lazy" alt="Actual Constellore practice board: the target is Horizon, discovered words sit on the board, and the inventory remains on the right." /><span className="s-interface-highlight" style={notes[detail].area} aria-hidden="true" /></div><figcaption>Recorded gameplay · seeded local practice · 5 September 2026</figcaption></figure>
    <div className="s-decisions"><p className="s-kicker">Inspect the interaction</p><div className="s-decision-controls" role="group" aria-label="Constellore interface annotations">{notes.map((note, i) => <button key={note.title} type="button" aria-pressed={detail === i} aria-controls="s-interactive-note" onClick={() => setDetail(i)}><span>{String(i + 1).padStart(2, '0')}</span>{note.title}<Plus size={16} aria-hidden="true" /></button>)}</div><p className="s-decision-note" id="s-interactive-note" aria-live="polite"><span aria-hidden="true">{String(detail + 1).padStart(2, '0')}</span>{notes[detail].text}</p></div>
  </div>
}

const cases = {
  games: { project: 'Mosquittoz', status: 'Windows LAN alpha', title: 'Make the systems work together.', problem: 'Two opposing perspectives need one readable set of rules.', role: 'Gameplay design and UE5 development: feeding, nests, respawns, and the colony economy.', result: 'A local Windows LAN systems alpha, supported by an integrated model and recorded in-engine evidence.', href: `${base}worlds/#mosquittoz`, action: 'Explore the game and its development', Evidence: GameEvidence },
  websites: { project: 'Oxyfel', status: 'Studio project', title: 'Give different ideas their own space.', problem: 'Games, technology help, and creative work were competing inside one long page.', role: 'Content structure, art direction, responsive interface design, and implementation.', result: 'A shared hub with three experiences, a complete directory, and paths into the work.', href: base, action: 'Explore the hub', Evidence: WebsiteEvidence },
  interactive: { project: 'Constellore', status: 'Browser practice available', title: 'Let a small action open a possibility.', problem: 'A word-combination game needs room for discovery and a reason to keep experimenting.', role: 'Game design and browser interaction development: the board, inventory, discovery, and feedback.', result: 'A playable word puzzle with a visible target, persistent discoveries, and room to try another route.', href: 'https://yoxyfel.github.io/constellore/play/', action: 'Open browser practice', Evidence: InteractiveEvidence },
}

export default function StudioExperience() {
  const [active, setActive] = useState<CaseId>('games')
  const [enhanced, setEnhanced] = useState(false)
  const activeCase = useRef<CaseId>('games')
  const pendingTarget = useRef<string | null>(null)
  useEffect(() => {
    setEnhanced(true)
    const sync = () => {
      // Inquiry and founder anchors do not encode a case. Remember the case on
      // each history entry so Back restores the work that led to that anchor.
      const id = caseFromHash() ?? caseFromHistory() ?? activeCase.current
      if (caseFromHistory() !== id) window.history.replaceState(studioHistoryState(id), '')
      pendingTarget.current = window.location.hash.slice(1) || null
      activeCase.current = id
      setActive(id)
    }
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync) }
  }, [])
  useEffect(() => {
    if (!enhanced || !pendingTarget.current) return
    const target = pendingTarget.current
    pendingTarget.current = null
    requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ block: 'start', behavior: 'auto' }))
  }, [active, enhanced])
  function selectCase(event: MouseEvent<HTMLAnchorElement>, id: CaseId) {
    if (!enhanced || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    // Store the departing entry before pushing the next case, including an
    // inquiry entry created through ordinary fragment navigation.
    window.history.replaceState(studioHistoryState(activeCase.current), '')
    if (window.location.hash !== `#case-${id}`) window.history.pushState(studioHistoryState(id), '', `#case-${id}`)
    activeCase.current = id
    if (active === id) {
      pendingTarget.current = null
      document.getElementById(`case-${id}`)?.scrollIntoView({ block: 'start', behavior: 'auto' })
    } else {
      pendingTarget.current = `case-${id}`
      setActive(id)
    }
  }
  return <div className={`studio-experience${enhanced ? ' s-enhanced' : ''}`}>
    <noscript><style>{'.studio-experience .s-decision-controls,.studio-experience .s-comparison-control,.studio-experience .s-evidence-toolbar>div{display:none}'}</style></noscript>
    <section className="s-opening" aria-labelledby="s-title">
      <div className="s-opening-top"><p className="s-kicker">The creative studio</p><span>Games / Websites / Interaction</span></div>
      <div className="s-opening-grid">
        <div className="s-opening-copy"><h1 id="s-title">From idea<br />to <em>in use.</em></h1><p className="s-opening-description">Design it. Build it.<br />Make it work for someone.</p><p className="s-opening-note">I’m Yane. I develop games, websites, and interactive tools. Open a piece of work to see the thinking and the working result.</p><a className="s-link s-opening-link" href="#studio-workbench">Inside the work <ArrowDown size={20} aria-hidden="true" /></a><a className="s-opening-inquiry" href="#start-a-project">Have a project in mind? <ArrowUpRight size={17} aria-hidden="true" /></a></div>
        <div className="s-artifact-board" aria-label="Actual work from the studio">
          <div className="s-board-heading"><span>On the table</span><span>01 / 02 / 03</span></div>
          <a className="s-artifact s-artifact-model" href="#case-games" onClick={event => selectCase(event, 'games')}><img src={media('studio-mosquitto-model.webp')} width="1280" height="720" alt="Average Mosquitto model, rendered in Unreal Engine." fetchPriority="high" /><span><b>01 / Games</b><small>Model → engine</small><ArrowUpRight size={18} aria-hidden="true" /></span></a>
          <a className="s-artifact s-artifact-website" href="#case-websites" onClick={event => selectCase(event, 'websites')}><img src={media('studio-hub-after.webp')} width="1440" height="1000" alt="The Oxyfel hub interface with its three entrances." /><span><b>02 / Websites</b><small>Structure → experience</small><ArrowUpRight size={18} aria-hidden="true" /></span></a>
          <a className="s-artifact s-artifact-board-game" href="#case-interactive" onClick={event => selectCase(event, 'interactive')}><img src={media('studio-constellore-board.webp')} width="1440" height="900" alt="The Constellore word-combination interface." /><span><b>03 / Interactive</b><small>Action → discovery</small><ArrowUpRight size={18} aria-hidden="true" /></span></a>
          <p className="s-board-caption">Actual interfaces and an in-engine model render.</p>
        </div>
      </div>
      <div className="s-opening-footer"><span>An independent practice by Yane Zhekov.</span><Asterisk size={24} weight="light" aria-hidden="true" /><span>Thinking and making, together.</span></div>
    </section>
    <section className="s-workbench" id="studio-workbench" aria-labelledby="s-workbench-title">
      <header className="s-workbench-heading"><p className="s-kicker">Selected work / opened up</p><h2 id="s-workbench-title">The idea.<br /><em>The decisions.</em></h2><p>Real projects, with the process left visible.<br />Choose a case and look inside.</p></header>
      <nav className="s-lenses" aria-label="Choose a studio case study">{caseIds.map((id, i) => <a key={id} href={`#case-${id}`} aria-current={active === id ? 'true' : undefined} onClick={event => selectCase(event, id)}><span className="s-lens-number">0{i + 1}</span><span>{caseTitles[id]}</span><ArrowDown size={20} aria-hidden="true" /></a>)}</nav>
      {caseIds.map((id, i) => {
        const item = cases[id]
        const Evidence = item.Evidence
        const external = item.href.startsWith('https:')
        return <article className={`s-case s-case-${id}`} id={`case-${id}`} key={id} hidden={enhanced && active !== id} aria-labelledby={`s-case-title-${id}`}>
          <header className="s-case-heading"><div><p className="s-kicker">Case 0{i + 1} / {item.project}</p><h3 id={`s-case-title-${id}`}>{item.title}</h3></div><span className="s-case-status"><Check size={15} aria-hidden="true" />{item.status}</span></header>
          <dl className="s-case-brief"><div><dt>The problem</dt><dd>{item.problem}</dd></div><div><dt>The work</dt><dd>{item.role}</dd></div><div><dt>What exists</dt><dd>{item.result}</dd></div></dl>
          <Evidence />
          <div className="s-case-next"><a className="s-link" href={item.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{item.action}<ArrowUpRight size={20} aria-hidden="true" />{external && <span className="sr-only"> (opens in a new tab)</span>}</a><a href="#start-a-project" onClick={() => window.dispatchEvent(new CustomEvent('oxyfel-inquiry', { detail: id }))}>Discuss a {id === 'games' ? 'game' : id === 'websites' ? 'website' : 'similar'} project <ArrowRight size={19} aria-hidden="true" /></a></div>
        </article>
      })}
    </section>
    <section className="s-profile" aria-labelledby="s-profile-title">
      <div className="s-profile-heading"><p className="s-kicker">Behind the work</p><Asterisk size={54} weight="light" aria-hidden="true" /></div>
      <h2 id="s-profile-title">One maker.<br /><span>A wider practice.</span></h2>
      <div className="s-profile-body"><p className="s-profile-intro">I’m Yane Zhekov.<br />I work across<br /><em>design and development.</em></p><div className="s-profile-copy"><p>My work spans Unreal Engine gameplay, browser experiences, art, and sound. Oxyfel brings those projects together; my personal portfolio goes further into the individual disciplines and experiments.</p><p>For a new collaboration, the useful starting point is the person you are building for, the problem to solve, and what you already have.</p></div></div>
      <div className="s-project-doors"><a className="s-project-door" id="personal" href="https://v0-yanez.vercel.app/en" target="_blank" rel="noopener noreferrer"><div><span className="s-kicker">The personal portfolio</span><h3>Yane Zhekov</h3><p>UE5 development, interactive experiments, art & sound.</p></div><span className="s-door-arrow"><ArrowUpRight size={32} aria-hidden="true" /><span>Visit portfolio</span></span><span className="sr-only"> (opens in a new tab)</span></a><a className="s-project-door" id="oxyfel" href={base}><div><span className="s-kicker">The shared entrance</span><h3>Oxyfel</h3><p>Original games, everyday help, and the studio.</p></div><span className="s-door-arrow"><ArrowUpRight size={32} aria-hidden="true" /><span>Back to the hub</span></span></a></div>
    </section>
    <section className="s-contact-section" id="start-a-project" aria-label="Discuss a project"><ContactPanel context="studio" /></section>
  </div>
}
