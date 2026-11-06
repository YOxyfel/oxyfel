// Shared polish for every page, installed once by the app:
// - the header turns to glass once the page scrolls;
// - [data-spotlight] elements get a light that follows the cursor (--mx, --my);
// - [data-tilt] elements lean toward the cursor in 3D (--rx, --ry);
// - [data-magnetic] buttons drift toward the cursor (--tx, --ty);
// - the first-visit intro can be skipped with any key, click or tap.
// Pointer effects run only with a fine pointer and normal motion settings.
export function installEffects() {
  const cleanups: (() => void)[] = []
  const on = <K extends keyof DocumentEventMap>(target: Document | Window, type: K, handler: (event: DocumentEventMap[K]) => void, options?: AddEventListenerOptions) => {
    target.addEventListener(type, handler as EventListener, options)
    cleanups.push(() => target.removeEventListener(type, handler as EventListener, options))
  }

  const header = document.querySelector('.h-header')
  const scrolled = () => header?.classList.toggle('is-scrolled', window.scrollY > 12)
  scrolled()
  on(window, 'scroll', scrolled, { passive: true })

  const root = document.documentElement
  const endIntro = () => {
    if (root.dataset.intro !== 'play') return
    root.dataset.intro = 'done'
    try { sessionStorage.setItem('ox-intro', '1') } catch { /* private mode: the intro may play again */ }
  }
  if (root.dataset.intro === 'play') {
    const timer = window.setTimeout(endIntro, 2300)
    cleanups.push(() => window.clearTimeout(timer))
    on(document, 'keydown', endIntro)
    on(document, 'pointerdown', endIntro)
  }

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (fine && !still) {
    let frame = 0
    let pending: PointerEvent | null = null
    let tilted: HTMLElement | null = null
    let pulled: HTMLElement | null = null
    const release = (element: HTMLElement | null, keys: string[]) => { if (element) for (const key of keys) element.style.removeProperty(key) }
    const update = () => {
      frame = 0
      const event = pending
      if (!event) return
      const start = event.target instanceof Element ? event.target : null
      const spot = start?.closest<HTMLElement>('[data-spotlight]')
      if (spot) {
        const rect = spot.getBoundingClientRect()
        spot.style.setProperty('--mx', `${event.clientX - rect.left}px`)
        spot.style.setProperty('--my', `${event.clientY - rect.top}px`)
      }
      const tilt = start?.closest<HTMLElement>('[data-tilt]') ?? null
      if (tilt !== tilted) { release(tilted, ['--rx', '--ry']); tilted = tilt }
      if (tilt) {
        const rect = tilt.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5, y = (event.clientY - rect.top) / rect.height - 0.5
        tilt.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`)
        tilt.style.setProperty('--ry', `${(x * 9).toFixed(2)}deg`)
      }
      const magnet = start?.closest<HTMLElement>('[data-magnetic]') ?? null
      if (magnet !== pulled) { release(pulled, ['--tx', '--ty']); pulled = magnet }
      if (magnet) {
        const rect = magnet.getBoundingClientRect()
        magnet.style.setProperty('--tx', `${((event.clientX - rect.left - rect.width / 2) * 0.22).toFixed(1)}px`)
        magnet.style.setProperty('--ty', `${((event.clientY - rect.top - rect.height / 2) * 0.32).toFixed(1)}px`)
      }
    }
    // A soft light follows the cursor, tinted by the light of whatever it is over.
    const cursor = document.createElement('div')
    cursor.className = 'ox-cursor'
    cursor.setAttribute('aria-hidden', 'true')
    document.body.appendChild(cursor)
    cleanups.push(() => cursor.remove())
    const at = [-999, -999], goal = [-999, -999]
    let glide = 0
    const follow = () => {
      at[0] += (goal[0] - at[0]) * 0.16; at[1] += (goal[1] - at[1]) * 0.16
      cursor.style.setProperty('--cx', `${at[0].toFixed(1)}px`); cursor.style.setProperty('--cy', `${at[1].toFixed(1)}px`)
      glide = Math.abs(goal[0] - at[0]) + Math.abs(goal[1] - at[1]) > 0.5 ? requestAnimationFrame(follow) : 0
    }
    on(document, 'pointerover', event => {
      const target = event.target instanceof Element ? event.target : null
      const light = target ? getComputedStyle(target).getPropertyValue('--light').trim() : ''
      if (light) cursor.style.setProperty('--cursor-light', light)
    }, { passive: true })
    on(document, 'pointerout', event => { if (!event.relatedTarget) cursor.classList.remove('is-on') })
    cleanups.push(() => cancelAnimationFrame(glide))
    on(document, 'pointermove', event => {
      pending = event; if (!frame) frame = requestAnimationFrame(update)
      goal[0] = event.clientX; goal[1] = event.clientY
      if (at[0] < -900) { at[0] = goal[0]; at[1] = goal[1] }
      cursor.classList.add('is-on')
      if (!glide) glide = requestAnimationFrame(follow)
    }, { passive: true })
    on(document, 'pointerleave', () => { release(tilted, ['--rx', '--ry']); release(pulled, ['--tx', '--ty']); tilted = pulled = null })
    cleanups.push(() => cancelAnimationFrame(frame))
  }
  return () => { for (const cleanup of cleanups) cleanup() }
}
