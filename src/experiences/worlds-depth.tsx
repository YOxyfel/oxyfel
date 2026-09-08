import { useEffect, useRef, useState } from 'react'
import { ArrowClockwise, ArrowRight, ArrowUpRight, Check, Plus } from '@phosphor-icons/react'
import { media, projects } from '../content'
import { combineSample, gates, sampleRecipes, thresholdExample } from './worlds-model'
import type { GateChoice } from './worlds-model'

function useInteractiveReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  return ready
}

function FullImage({ image, alt, caption, width = 1440, height = 900 }: { image: string; alt: string; caption: string; width?: number; height?: number }) {
  return <figure className="wd-evidence"><a href={media(image)} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size image: ${caption} (new tab)`}><img src={media(image)} width={width} height={height} loading="lazy" decoding="async" alt={alt} /><span className="wd-enlarge">Inspect full size <ArrowUpRight size={16} aria-hidden="true" /></span></a><figcaption>{caption}</figcaption></figure>
}

export function ConstelloreSample() {
  const ready = useInteractiveReady()
  const [words, setWords] = useState(['Earth', 'Water', 'Fire', 'Air'])
  const [pair, setPair] = useState<string[]>([])
  const [discoveries, setDiscoveries] = useState<{ a: string; b: string; result: string }[]>([])
  const [message, setMessage] = useState('Choose two words. Your first goal is Brick.')
  const [hint, setHint] = useState(false)
  const complete = words.includes('Brick')

  function combine() {
    if (pair.length !== 2) return
    const recipe = combineSample(pair[0], pair[1])
    if (!recipe) { setMessage('That pair is outside this small sample. Your words are safe; try a different pairing.'); return }
    const isNew = !words.includes(recipe.result)
    if (isNew) {
      setWords(current => [...current, recipe.result])
      setDiscoveries(current => [...current, { a: pair[0], b: pair[1], result: recipe.result }])
    }
    setMessage(`${pair[0]} + ${pair[1]} = ${recipe.result}. ${recipe.note}${isNew ? ' Added to your words.' : ' Already discovered — try using it in another pairing.'}`)
    setPair([])
  }

  function reset() { setWords(['Earth', 'Water', 'Fire', 'Air']); setPair([]); setDiscoveries([]); setMessage('A fresh start. Can you make Brick in two discoveries?'); setHint(false) }

  return <div className="wd-constellore">
    <div className="wd-chapter-heading"><p className="w-overline">A small playable sample</p><h3>Make something new.</h3><p>Tap two words, then combine them. Discovered words stay available, so each idea can become the beginning of another.</p></div>
    <div className="wd-word-lab" aria-label="Constellore word-combination sample">
      <div className="wd-lab-head"><span>Constellore / First discovery</span><strong>{complete ? <><Check size={17} aria-hidden="true" /> Brick discovered</> : 'Make: Brick'}</strong></div>
      <div className="wd-pair"><span>{pair[0] ?? 'First word'}</span><Plus size={23} aria-hidden="true" /><span>{pair[1] ?? 'Second word'}</span></div>
      <div className="wd-word-inventory" aria-label="Available words">{words.map(word => <button type="button" disabled={!ready} key={word} data-word={word.toLowerCase()} onClick={() => setPair(current => current.length < 2 ? [...current, word] : [word])}><i aria-hidden="true" />{word}</button>)}</div>
      <div className="wd-lab-actions"><button className="wd-solid" type="button" disabled={!ready || pair.length !== 2} onClick={combine}>Combine words <ArrowRight size={18} aria-hidden="true" /></button><button type="button" disabled={!ready} onClick={() => setPair([])}>Clear selection</button><button type="button" disabled={!ready} onClick={() => setHint(value => !value)} aria-expanded={hint}>A little help</button></div>
      <p className="wd-feedback" role="status">{message}</p>
      {hint && <p className="wd-hint">{complete ? 'Try Fire + Water, then combine the discovery with Air.' : words.includes('Mud') ? 'Heat changes your Mud. Try pairing it with Fire.' : 'Start close to the ground. What happens when Earth meets Water?'}</p>}
      {discoveries.length > 0 && <ol className="wd-discovery-trail" aria-label="Your discoveries">{discoveries.map(discovery => <li key={discovery.result}><span>{discovery.a} + {discovery.b}</span><ArrowRight size={14} aria-hidden="true" /><strong>{discovery.result}</strong></li>)}</ol>}
      {complete && <div className="wd-result"><h4>You found a route.</h4><p>{discoveries.length === 2 ? 'Two discoveries, from Earth and Water to a finished Brick.' : 'A few detours became discoveries of their own. Your Brick is here.'} Keep exploring this sample, or take your curiosity into Constellore.</p><a href={projects.constellore.playHref} target="_blank" rel="noopener noreferrer">Open the browser game <ArrowUpRight size={18} aria-hidden="true" /><span className="w-sr-only"> (new tab)</span></a></div>}
      <div className="wd-lab-footer"><span>18 real recipes · A local sample · No score or account</span><button type="button" disabled={!ready} onClick={reset}><ArrowClockwise size={16} aria-hidden="true" /> Start again</button></div>
    </div>
    <p className="wd-nojs">The playable sample uses JavaScript. The complete two-step route and its recipe list are available below.</p>
    <details className="wd-source-notes"><summary>Read the route and included recipes</summary><p>Earth + Water → Mud. Then Mud + Fire → Brick. Ingredients stay available after a discovery.</p><ul>{sampleRecipes.map(recipe => <li key={`${recipe.a}-${recipe.b}`}>{recipe.a} + {recipe.b} → <strong>{recipe.result}</strong></li>)}</ul></details>
    <div className="wd-beyond-sample"><h4>One small window into a larger universe.</h4><p>The wider project includes a freeform discovery board, an expedition map, progression, and competitive modes. This embedded sample only introduces combination. The public Pages edition opens local, unranked practice; server-backed competition is a separate part of the project.</p></div>
    <FullImage image="worlds-constellore-current.webp" alt="Actual Constellore practice board with the target Horizon, discovered words, and a three-step route indicator." caption="Actual Constellore practice-board capture · Horizon target · September 2026" />
  </div>
}

const humanTests = [
  { label: 'Ready', image: 'worlds-human-rest.webp', title: 'A target you can read.', text: 'The Human hunts nests and responds to nearby Mosquittos. This imported character is shown inside the Unreal development test scene.' },
  { label: 'Quick punch', image: 'worlds-human-quick.webp', title: 'Commit quickly.', text: 'The quick punch uses a short, camera-aimed hit. In the current playtest rules it removes one durability point and can damage a nest under the aim ray.' },
  { label: 'Charged clap', image: 'worlds-human-clap.webp', title: 'Wait for an opening.', text: 'Hold for 1.1 seconds, then release. The charged clap removes five durability points; its overlap hits visible Mosquittos and an aimed release can heavily damage a nest.' },
] as const

export function MosquittoInspector() {
  const ready = useInteractiveReady()
  const [role, setRole] = useState<'human' | 'mosquito'>('human')
  const [test, setTest] = useState(0)
  const [carry, setCarry] = useState(0)
  const [banked, setBanked] = useState(0)
  const [note, setNote] = useState('Start with an empty cargo. A successful feed adds one unit.')
  const current = humanTests[test]
  return <div className="wd-mosquitto">
    <div className="wd-chapter-heading"><p className="w-overline">Inside the development build</p><h3>Two roles. Two sets of decisions.</h3><p>Inspect real character tests, then try the logic behind the swarm. These July 2026 captures show the development test scene, not a finished Safehouse match.</p></div>
    <div className="wd-role-choice" role="group" aria-label="Inspect a Mosquittoz role"><button type="button" disabled={!ready} aria-pressed={role === 'human'} onClick={() => setRole('human')}>01 / Human <span>Read the attack</span></button><button type="button" disabled={!ready} aria-pressed={role === 'mosquito'} onClick={() => setRole('mosquito')}>02 / Mosquitto <span>Carry or bank?</span></button></div>
    {role === 'human' ? <div className="wd-role-panel">
      <FullImage image={current.image} alt={`Actual Unreal Engine development capture of the Human character: ${current.label.toLowerCase()}.`} caption={`Human ${current.label.toLowerCase()} · In-engine character/action test · July 2026`} width={1280} height={720} />
      <div className="wd-test-controls" role="group" aria-label="Inspect Human action tests">{humanTests.map((item, index) => <button type="button" disabled={!ready} aria-pressed={test === index} onClick={() => setTest(index)} key={item.label}>{item.label}</button>)}</div>
      <div className="wd-artifact-explanation"><h4>{current.title}</h4><p>{current.text}</p></div>
    </div> : <div className="wd-role-panel">
      <FullImage image="worlds-mosquitto-model.webp" alt="Actual Unreal Engine test capture of the imported Average and Fat Mosquitto character on a development floor." caption="Average & Fat Mosquitto · In-engine character test · July 2026" width={1280} height={720} />
      <div className="wd-cargo-lab"><div><p className="w-overline">A simplified cargo decision</p><h4>What is worth taking home?</h4><p>Average & Fat can safely carry four units. In the game, carrying more makes you heavier and louder; death loses what you have not deposited.</p></div><div className="wd-cargo-totals"><span>Carrying <strong>{carry}<small>/4 safe units</small></strong></span><span>Delivered <strong>{banked}<small>units</small></strong></span></div>
        <div className="wd-test-controls"><button type="button" disabled={!ready || carry >= 4} onClick={() => { setCarry(value => value + 1); setNote('A completed feed added one unit. Carry it onward or bank it at a living nest.')}}>Complete a feed +1</button><button type="button" disabled={!ready || carry === 0} onClick={() => {setBanked(value => value + carry);setCarry(0);setNote('Deposited. In Swarm, delivered units incubate at that nest before they can support respawns and colony growth.')}}>Bank at the nest</button><button type="button" disabled={!ready || carry === 0} onClick={() => {setCarry(0);setNote('Caught. Carried units were lost; the units already delivered remain banked.')}}>Get caught</button><button type="button" disabled={!ready || (!carry && !banked)} onClick={() => {setCarry(0);setBanked(0);setNote('A fresh cargo example.')}}>Reset example</button></div>
        <p className="wd-feedback" role="status">{note}</p><p className="wd-qualifier">Rule illustration only. Feeding time, nest destruction, incubation, overfill risk, and opponents are not simulated here. Current alpha balance may change.</p>
      </div>
    </div>}
    <details className="wd-source-notes"><summary>See all character tests and the real Swarm loop</summary><p>A successful feed adds one carried unit. Enter a living nest’s deposit volume to bank it. Deposits incubate for six seconds; mature hatchlings support player respawns before surplus AI. Destroying a nest also destroys its incubating and ready brood.</p><div className="wd-archive-grid">{humanTests.map(item => <FullImage key={item.image} image={item.image} alt={`Human ${item.label.toLowerCase()} in an actual Unreal test capture.`} caption={`Human — ${item.label}`} width={1280} height={720} />)}<FullImage image="worlds-mosquitto-model.webp" alt="Imported Mosquitto model in Unreal." caption="Mosquitto — character test" width={1280} height={720} /></div></details>
  </div>
}

const progressEvents = ['Cross progress plane 1', 'Cross progress plane 2', 'Cross progress plane 3', 'Clear the section cleanly']

export function ThresholdMechanism() {
  const ready = useInteractiveReady()
  const [events, setEvents] = useState(0)
  const [choice, setChoice] = useState<GateChoice | null>(null)
  const [entered, setEntered] = useState(false)
  const advanceButton = useRef<HTMLButtonElement>(null)
  const holdButton = useRef<HTMLButtonElement>(null)
  const resultStatus = useRef<HTMLParagraphElement>(null)
  const pendingFocus = useRef<'gate' | 'result' | 'advance' | null>(null)
  useEffect(() => {
    const target = pendingFocus.current === 'gate' ? holdButton.current : pendingFocus.current === 'result' ? resultStatus.current : pendingFocus.current === 'advance' ? advanceButton.current : null
    if (target) { target.focus({ preventScroll: true }); pendingFocus.current = null }
  }, [events, entered])
  const state = thresholdExample(events, choice, entered)
  const stepText = events < 4 ? `${events} of 4 section events completed. ${events === 3 ? 'A first-attempt clean clear earns another 20.' : 'Each progress plane earns 10 Momentum.'}` : !choice ? 'The section is clear. Choose a gate for the next act; this example recommends Hold.' : !entered ? `${choice} selects rating ${state.rating} and a ×${state.factor.toFixed(2)} section-score factor. ${choice === 'Hold' ? 'Following the recommendation earned 10 Momentum.' : 'A different choice is allowed; it adds no recommended-gate bonus.'} Enter the next section to continue.` : state.flow ? 'Flow is active at 100 Momentum. It adds a ×1.25 scoring multiplier; movement speed and jump height stay unchanged.' : `Next section entered with ${state.momentum} Momentum. Flow has not activated; more earned progress is needed.`
  return <div className="wd-threshold">
    <FullImage image="worlds-threshold-current.webp" alt="Actual THRESHOLD 0.3.1 Roblox gameplay capture showing the starting calibration lane, the avatar, the 13-section objective, and remaining time." caption="Actual THRESHOLD 0.3.1 gameplay · Calibration lane · Captured 6 September 2026" width={1505} height={847} />
    <div className="wd-chapter-heading"><p className="w-overline">Inspect the mechanic</p><h3>Momentum comes from what you do.</h3><p>This small rule example begins with 40 Momentum at the start of an adaptive section. Advance its events, choose a gate, and see what changes. It is an explanation of the game’s rules, not a playable parkour course.</p></div>
    <div className="wd-momentum-lab">
      <div className="wd-momentum-head"><div><span>Earned Momentum</span><strong>{state.momentum}<small>/100</small></strong></div><div className={`wd-flow-state${state.flow ? ' is-active' : ''}`}>{state.flow ? 'Flow active · ×1.25 score' : state.momentum === 100 ? 'Flow ready · enter a section' : 'Flow inactive'}</div></div>
      <progress max={100} value={state.momentum} aria-label="Earned Momentum in this example" />
      <ol className="wd-progress-events">{progressEvents.map((event, index) => <li key={event} data-complete={events > index}><span>{events > index ? <Check size={15} aria-hidden="true" /> : `0${index + 1}`}</span>{event}<strong>+{index === 3 ? 20 : 10}</strong></li>)}</ol>
      <div className="wd-momentum-action">{events < 4 ? <button type="button" className="wd-solid" disabled={!ready} ref={advanceButton} onClick={() => {if (events === 3) pendingFocus.current = 'gate'; setEvents(value => value + 1)}}>{progressEvents[events]} <ArrowRight size={18} aria-hidden="true" /></button> : <div className="wd-gate-choice"><p>Gate recommendation: <strong>Hold</strong> / Starting rating: <strong>5</strong></p><div role="group" aria-label="Choose the next THRESHOLD gate">{(['Recover', 'Hold', 'Push'] as const).map(gate => <button type="button" disabled={!ready || entered} key={gate} ref={gate === 'Hold' ? holdButton : undefined} aria-pressed={choice === gate} onClick={() => setChoice(gate)}><strong>{gate}</strong><span>Rating {5 + gates[gate].delta} · ×{gates[gate].factor.toFixed(2)}</span></button>)}</div>{choice && !entered && <button type="button" className="wd-solid" disabled={!ready} onClick={() => {pendingFocus.current = 'result'; setEntered(true)}}>Enter the next section <ArrowRight size={18} aria-hidden="true" /></button>}</div>}</div>
      <p className="wd-feedback" role="status" tabIndex={-1} ref={resultStatus}>{stepText}</p><button className="wd-reset" type="button" disabled={!ready || events === 0} onClick={() => {pendingFocus.current = 'advance';setEvents(0);setChoice(null);setEntered(false)}}><ArrowClockwise size={16} aria-hidden="true" /> Try another route</button>
    </div>
    <details className="wd-source-notes"><summary>Read the rule example without playing it</summary><p>Starting at 40, three progress planes earn 10 each: 50 → 60 → 70. A clean first-attempt clear earns 20: 90. Choosing the recommended Hold gate earns 10: 100. Flow activates only upon entering an active adaptive/finale section. Choosing Recover or Push changes the next rating and score factor, but does not earn this example’s recommended-gate bonus.</p><p>The real game has thirteen sections and three gates, after sections 5, 8, and 11. Its difficulty classifier recommends a gate based on performance; the player retains the choice. This isolated example omits earlier sections and does not reconstruct the full run.</p><p>Based on the current 0.3.1 configuration and Momentum Horizon gameplay contract. The screenshot shows calibration, not a captured Flow activation.</p></details>
  </div>
}

const worldAreas = [
  { name: 'Cinderfall', position: '01 / Mortal beginning', density: '1.0', vein: 'No spirit vein', note: 'The village is the starting anchor for the mortal-world slice. The authored world-systems target is Cinderfall Village; surrounding areas define the intended demo footprint.' },
  { name: 'Mountain passes', position: '02 / A route outward', density: '1.2', vein: 'No spirit vein', note: 'One of the four mortal areas in the planned demo scope. In the design notes its ambient Qi is richer than Cinderfall, connecting exploration with the pace of cultivation.' },
  { name: 'Oceanic cliffs', position: '03 / The mortal edge', density: '1.1', vein: 'No spirit vein', note: 'A distinct mortal area in the demo plan. The world document separates places the player is meant to traverse from distant locations that serve as lore or vistas.' },
  { name: 'Forbidden ruins', position: '04 / Something worth seeking', density: '1.5', vein: 'Tier 1 spirit vein', note: 'The only zone in these tunable starting values that meets the 1.5 breakthrough-density threshold. The design gives exploration a concrete purpose: find land rich enough to cultivate further.' },
]

export function WuhenDesignNotes() {
  const ready = useInteractiveReady()
  const [area, setArea] = useState(0)
  const selected = worldAreas[area]
  return <div className="wd-wuhen-notes">
    <div className="wd-development-spread"><figure><img src={media('wuhen-sect.webp')} width={1024} height={1024} alt="Wuhen & Xuan concept artwork showing a lone figure before a floating mountain sect." loading="lazy" decoding="async" /><figcaption>Beyond the mortal realm · Concept artwork</figcaption></figure><div><p className="w-overline">An idea becomes a design decision</p><h3>Let the world be vast.<br />Keep the first journey specific.</h3><p>The world document limits the demo footprint to four mortal areas. Capitals, distant sects, and higher realms can be seen or spoken of, while the first journey concentrates on survival and cultivation below.</p><p className="wd-qualifier">Authored development scope, not a statement that these areas are finished or publicly playable.</p></div></div>
    <div className="wd-scope-lab"><div className="wd-scope-heading"><span>Inspect the mortal-world plan</span><small>Tunable design notes · July 2026</small></div><div className="wd-area-choice" role="group" aria-label="Inspect Wuhen demo areas">{worldAreas.map((item, index) => <button type="button" disabled={!ready} aria-pressed={area === index} key={item.name} onClick={() => setArea(index)}><span>0{index + 1}</span>{item.name}</button>)}</div><div className="wd-area-detail"><div><p className="w-overline">{selected.position}</p><h4>{selected.name}</h4><p>{selected.note}</p></div><dl><div><dt>Ambient Qi</dt><dd>{selected.density}</dd></div><div><dt>Authored starting point</dt><dd>{selected.vein}</dd></div></dl></div><p className="wd-qualifier">The source proposes a linear density-to-regeneration relationship. These are development values, not a playable simulation or final balance.</p></div>
    <details className="wd-source-notes"><summary>Read the full scope note</summary><p>The World, Survival & Territory document names four demo areas: Cinderfall, mountain passes, oceanic cliffs, and forbidden ruins. Other mortal locations and higher realms are vista/lore references within that scope.</p><dl>{worldAreas.map(item => <div key={item.name}><dt>{item.name} — ambient Qi {item.density}</dt><dd>{item.note}</dd></div>)}</dl><p>The intended loop is to explore, find a spirit vein, establish an abode, and use formations to support cultivation. Implementation and broader-world questions remain open; the PC demo is in development.</p></details>
  </div>
}

const bankPlans = [
  { name: 'The base', image: 'run-bank-ship.webp', caption: 'Corporate playable ship', id: 'Corporate.Bounds.PlayableShip', heading: 'Give the expedition a place to begin.', note: 'The corporate ship plan groups arrival, social space, preparation, and gates into a connected base. It establishes the contrast between the controlled home space and the temple expedition.', width: 1672, height: 941 },
  { name: 'The route', image: 'worlds-run-bank-field.webp', caption: 'Zone 1 — large-loot opening field', id: 'Z01.Loot.Large.OpeningField', heading: 'Make the tempting route readable.', note: 'The construction brief calls for visible entrances and exits, changes in height, optional loot detours, and return paths. The large-loot opening field is one volume in that planned expedition.', width: 1672, height: 941 },
  { name: 'The vault', image: 'run-bank-vault.webp', caption: 'Zone 1 — final-loot treasure vault', id: 'Z01.Loot.Final.TreasureVault', heading: 'The relic still has to come home.', note: 'The prototype’s carried-relic flow asks the player to return across the King’s Highway and deposit at the Temple Vault. A failed run returns the carried artifact. The plan gives that risk a place in the world.', width: 1024, height: 1536 },
]

export function RunBankPlans() {
  const ready = useInteractiveReady()
  const [selected, setSelected] = useState(0)
  const [zoom, setZoom] = useState(100)
  return <div className="wd-run-bank">
    <div className="wd-chapter-heading"><p className="w-overline">From volume plan to expedition</p><h3>Read the route before it is built.</h3><p>Inspect three real environment references from the project. Each maps to an authored Roblox volume, with a different job in the expedition.</p></div>
    <div className="wd-plan-choice" role="group" aria-label="Inspect Run and Bank environment plans">{bankPlans.map((plan, index) => <button type="button" disabled={!ready} key={plan.name} aria-pressed={selected === index} onClick={() => {setSelected(index);setZoom(100)}}><img src={media(plan.image)} alt="" width={160} height={90} loading="lazy" /><span>0{index + 1} / {plan.name}</span></button>)}</div>
    <div className="wd-zoom-control"><label htmlFor="wd-plan-zoom">Inspect scale <strong>{zoom}%</strong></label><input id="wd-plan-zoom" type="range" min={100} max={180} step={10} value={zoom} disabled={!ready} onChange={event => setZoom(Number(event.target.value))} /><button type="button" disabled={!ready || zoom === 100} onClick={() => setZoom(100)}>Fit plan</button></div>
    {bankPlans.map((plan, index) => <section className="wd-plan-panel" hidden={ready && selected !== index} key={plan.name} aria-label={plan.caption}><div className="wd-plan-viewport" tabIndex={0} aria-label={`${plan.caption}; scroll to inspect at larger scale`}><img src={media(plan.image)} style={{ width: `${zoom}%`, maxWidth: 'none' }} width={plan.width} height={plan.height} alt={`Run & Bank ${plan.caption.toLowerCase()}, a roofless top-down environment design reference.`} loading="lazy" decoding="async" /></div><div className="wd-plan-caption"><span>{plan.caption} · Environment design reference</span><a href={media(plan.image)} target="_blank" rel="noopener noreferrer">Open full image <ArrowUpRight size={16} aria-hidden="true" /><span className="w-sr-only"> (new tab)</span></a></div><div className="wd-artifact-explanation"><h4>{plan.heading}</h4><p>{plan.note}</p><details><summary>Reference identity</summary><code>{plan.id}</code><p>Generated construction reference for Roblox Studio. The authoritative dimensions belong to the authored volume; this image is not literal game geometry or a gameplay capture.</p></details></div></section>)}
  </div>
}
