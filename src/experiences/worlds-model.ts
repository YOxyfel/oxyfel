// A deliberately small excerpt of the authored Constellore recipe graph.
// Verified against InfiniteWord/server.mjs on 6 September 2026; no API requests.
export const sampleRecipes = [
  { a: 'Earth', b: 'Water', result: 'Mud', note: 'Water softens earth into mud.' },
  { a: 'Fire', b: 'Water', result: 'Steam', note: 'Heat lifts water into steam.' },
  { a: 'Air', b: 'Water', result: 'Mist', note: 'Water suspended in air becomes mist.' },
  { a: 'Air', b: 'Earth', result: 'Dust', note: 'Air carries fine pieces of earth.' },
  { a: 'Earth', b: 'Fire', result: 'Lava', note: 'Earth melts under fierce heat.' },
  { a: 'Air', b: 'Fire', result: 'Energy', note: 'Fire fed by air releases energy.' },
  { a: 'Mud', b: 'Fire', result: 'Brick', note: 'Fired mud becomes a brick.' },
  { a: 'Lava', b: 'Water', result: 'Stone', note: 'Water cools lava into stone.' },
  { a: 'Air', b: 'Steam', result: 'Cloud', note: 'Steam gathers in the cool air.' },
  { a: 'Cloud', b: 'Water', result: 'Rain', note: 'A water-heavy cloud releases rain.' },
  { a: 'Air', b: 'Energy', result: 'Light', note: 'Energy racing through air becomes light.' },
  { a: 'Light', b: 'Rain', result: 'Rainbow', note: 'Rain splits light into a rainbow.' },
  { a: 'Dust', b: 'Water', result: 'Clay', note: 'Fine dust and water form clay.' },
  { a: 'Clay', b: 'Fire', result: 'Pottery', note: 'Fire hardens shaped clay.' },
  { a: 'Water', b: 'Water', result: 'Ocean', note: 'Water gathered without end becomes an ocean.' },
  { a: 'Fire', b: 'Fire', result: 'Inferno', note: 'Fire feeding fire becomes an inferno.' },
  { a: 'Air', b: 'Air', result: 'Wind', note: 'Air moving against air becomes wind.' },
  { a: 'Earth', b: 'Earth', result: 'Land', note: 'Earth joined with earth becomes land.' },
] as const

export function combineSample(a: string, b: string) {
  return sampleRecipes.find(recipe => (recipe.a === a && recipe.b === b) || (recipe.a === b && recipe.b === a))
}

export type GateChoice = 'Recover' | 'Hold' | 'Push'
export const gates: Record<GateChoice, { delta: number; factor: number }> = {
  Recover: { delta: -1, factor: 0.85 }, Hold: { delta: 0, factor: 1 }, Push: { delta: 1, factor: 1.15 },
}

// A labelled rule example, not a recreated Roblox run. The current game's
// authoritative rules are Config.luau and PerformanceModel.applyGate.
export function thresholdExample(eventCount: number, choice: GateChoice | null, entered: boolean) {
  const completed = Math.max(0, Math.min(4, Math.floor(eventCount)))
  const momentum = Math.min(100, 40 + Math.min(completed, 3) * 10 + (completed === 4 ? 20 : 0) + (completed === 4 && choice === 'Hold' ? 10 : 0))
  return { momentum, rating: 5 + (choice ? gates[choice].delta : 0), factor: choice ? gates[choice].factor : 1, flow: entered && momentum === 100 }
}
