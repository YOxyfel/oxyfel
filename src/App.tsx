import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// --- DATA FOR THE ECOSYSTEM ---
interface Member {
  name: string
  role: string
  href: string
}

interface ProductItem {
  name: string
  href?: string
  action: string
}

interface ProductCategory {
  name: string
  items: ProductItem[]
}

type Division = {
  id: string
  title: string
  label: string
  image: string
  cta?: { label: string; href: string; external?: boolean }
} & ({ kind: 'team'; members: Member[] } | { kind: 'products'; categories: ProductCategory[] })

// TODO switch the mailto to hello@yanezhekov.dev (or an oxyfel address) once the
// domain family + Cloudflare Email Routing exist.
const CONTACT_EMAIL = 'zhekov.yane123@gmail.com'

const DIVISIONS: Division[] = [
  {
    id: '01',
    kind: 'team',
    title: 'Team',
    label: 'The People',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=60&w=800&auto=format&fit=crop',
    members: [{ name: 'Yanez', role: 'Founder', href: 'https://v0-yanez.vercel.app/en' }],
    cta: { label: 'Hire us for UE5 gameplay systems', href: `mailto:${CONTACT_EMAIL}` },
  },
  {
    id: '02',
    kind: 'products',
    title: 'Products',
    label: 'What We Build',
    image:
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=60&w=800&auto=format&fit=crop',
    categories: [
      {
        name: 'Games',
        items: [
          {
            name: 'Wuhen & Xuan: Heaven Defying',
            href: 'https://yoxyfel.github.io/wan-lin-immortal/',
            action: 'Explore',
          },
          {
            name: 'Constellore',
            href: 'https://yoxyfel.github.io/constellore/#wishlist',
            action: 'Wishlist',
          },
          { name: 'Mosquitto', action: 'Coming soon' },
          { name: 'Run & Bank', action: 'Coming soon' },
        ],
      },
    ],
  },
]

// A device "qualifies" for the pointer-driven experience only if it has a real
// hovering pointer (mouse/trackpad) and a wide enough viewport.
const DESKTOP_QUERY = '(min-width: 768px) and (hover: hover) and (pointer: fine)'

export default function OxyfelApp() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  // Starts `false` on the server AND on the first client render so the
  // prerendered HTML (see scripts/prerender.mjs) hydrates without mismatch;
  // the layout effect below flips it before first paint on desktop devices.
  const [isDesktop, setIsDesktop] = useState<boolean>(false)
  const heroRef = useRef<HTMLElement | null>(null)

  // --- TRACK WHETHER THIS IS A POINTER-DRIVEN DESKTOP DEVICE ---
  // useLayoutEffect (not useEffect) so the desktop hero swaps in before the
  // browser paints — no flash of the mobile variant on pointer devices.
  useLayoutEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const update = () => setIsDesktop(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  // --- MOUSE TRACKING FOR REVEAL MASK & CURSOR (desktop only) ---
  useEffect(() => {
    if (!isDesktop) return

    setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

    let frame = 0
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY })
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isDesktop])

  // --- SCROLL OBSERVER FOR EDITORIAL FADE-INS ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    document.querySelectorAll('.reveal-block').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Keep the hover-class helpers harmless on touch devices.
  const setHovering = (state: boolean) => {
    if (!isDesktop) return
    document.body.classList.toggle('is-hovering', state)
  }

  return (
    <div
      className={`bg-[#050505] text-[#f5f5f5] min-h-screen selection:bg-white selection:text-black relative overflow-x-hidden ${
        isDesktop ? 'cursor-none' : ''
      }`}
    >
      {/* --- INJECTED STYLES & FONTS --- */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .font-display { font-family: 'Syne Variable', 'Syne', sans-serif; }
        .font-serif { font-family: 'Cormorant Garamond Variable', 'Cormorant Garamond', serif; }

        /* Safe-area aware padding for the fixed corner navigation
           (viewport-fit=cover is declared in index.html). */
        .corner-nav {
          padding-top: max(1.25rem, env(safe-area-inset-top));
          padding-right: max(1.25rem, env(safe-area-inset-right));
          padding-bottom: max(1.25rem, env(safe-area-inset-bottom));
          padding-left: max(1.25rem, env(safe-area-inset-left));
        }
        @media (min-width: 640px) {
          .corner-nav {
            padding-top: max(1.5rem, env(safe-area-inset-top));
            padding-right: max(1.5rem, env(safe-area-inset-right));
            padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
            padding-left: max(1.5rem, env(safe-area-inset-left));
          }
        }
        @media (min-width: 768px) {
          .corner-nav {
            padding-top: max(3rem, env(safe-area-inset-top));
            padding-right: max(3rem, env(safe-area-inset-right));
            padding-bottom: max(3rem, env(safe-area-inset-bottom));
            padding-left: max(3rem, env(safe-area-inset-left));
          }
        }

        /* Precision Crosshair Cursor */
        .crosshair {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none; z-index: 100; mix-blend-mode: difference;
        }
        .crosshair::before, .crosshair::after {
          content: ''; position: absolute; background: white;
          transition: transform 0.1s ease-out;
        }
        .crosshair::before {
          width: 1px; height: 40px;
          top: calc(var(--y) - 20px); left: var(--x);
        }
        .crosshair::after {
          width: 40px; height: 1px;
          top: var(--y); left: calc(var(--x) - 20px);
        }

        /* Hover state for crosshair */
        body.is-hovering .crosshair::before { transform: scaleY(0.5); }
        body.is-hovering .crosshair::after { transform: scaleX(0.5); }

        /* Smooth Reveal Blocks */
        .reveal-block {
          opacity: 0; transform: translateY(40px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-block.in-view {
          opacity: 1; transform: translateY(0);
        }
        .reveal-block.delay-100 { transition-delay: 0.15s; }

        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .reveal-block { opacity: 1; transform: none; transition: none; }
        }
      `,
        }}
      />

      {/* --- CUSTOM CURSOR (desktop pointer devices only) --- */}
      {isDesktop && (
        <div
          className="crosshair hidden md:block"
          style={{ '--x': `${mousePos.x}px`, '--y': `${mousePos.y}px` } as React.CSSProperties}
        />
      )}

      {/* --- FOUR-CORNER NAVIGATION (EDITORIAL STRUCTURE) --- */}
      <div className="fixed inset-0 pointer-events-none z-50 corner-nav flex flex-col justify-between mix-blend-difference text-white">
        <div className="flex justify-between items-start font-display text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
          <a
            href="#top"
            className={`pointer-events-auto p-3 -m-3 hover:opacity-50 transition-opacity ${isDesktop ? 'cursor-none' : ''}`}
          >
            OXYFEL / INDEX
          </a>
          <div className="text-right pointer-events-auto">
            EST. <br />2024
          </div>
        </div>
        <div className="flex justify-between items-end font-display text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
          {/* TODO add X/LinkedIn when real profiles exist */}
          <div className="flex flex-col gap-3 pointer-events-auto">
            <a
              href="https://github.com/YOxyfel"
              target="_blank"
              rel="noopener noreferrer"
              className={`py-2 px-3 -mx-3 hover:opacity-50 transition-opacity ${isDesktop ? 'cursor-none' : ''}`}
            >
              GitHub
            </a>
          </div>
          <a
            href="#contact"
            className={`pointer-events-auto text-right p-3 -m-3 hover:opacity-50 transition-opacity ${isDesktop ? 'cursor-none' : ''}`}
          >
            CONTACT <br /> ↓
          </a>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <section
        id="top"
        ref={heroRef}
        className="relative min-h-[100svh] w-full overflow-hidden bg-[#050505] flex items-center justify-center"
      >
        {isDesktop ? (
          <>
            {/* BASE LAYER (The Dark/Hidden Layer) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-0 w-full overflow-hidden">
              <div
                aria-hidden="true"
                className="text-[8vw] font-display font-bold leading-[0.8] tracking-tighter text-[#f5f5f5] whitespace-nowrap"
              >
                PERFECTION
              </div>
              <p
                aria-hidden="true"
                className="mt-6 font-display text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/40"
              >
                A studio building original games and UE5 gameplay systems.
              </p>
              <p className="absolute bottom-[19%] left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 text-center text-lg md:text-2xl lg:text-3xl font-serif italic text-white/70">
                "...until perfection is but the result."
              </p>
            </div>

            {/* TOP LAYER (The White Layer acting as the mask) */}
            <div
              className="absolute inset-0 bg-[#f5f5f5] flex flex-col items-center justify-center text-center px-4 z-10 pointer-events-none w-full overflow-hidden"
              style={{
                WebkitMaskImage: `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`,
                maskImage: `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`,
              }}
            >
              <p className="mb-4 text-[10px] md:text-sm font-display tracking-[0.4em] uppercase text-[#050505] font-bold">
                The Philosophy of
              </p>
              <h1 className="text-[18vw] md:text-[14vw] lg:text-[11vw] font-display font-bold leading-[0.8] tracking-tighter text-[#050505] whitespace-nowrap">
                OXYFEL
              </h1>
              <p className="mt-6 font-display text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#050505]/50">
                A studio building original games and UE5 gameplay systems.
              </p>
              <p className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 text-center text-lg md:text-2xl lg:text-3xl font-serif italic text-[#050505]/70">
                "From nothing we layer..."
              </p>
            </div>

            {/* Hint to move the cursor — mix-blend keeps it legible over both layers */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 font-display text-[10px] uppercase tracking-[0.4em] text-white mix-blend-difference motion-safe:animate-pulse pointer-events-none">
              Move to reveal
            </div>
          </>
        ) : (
          /* MOBILE / TOUCH HERO — clean, fully legible, no pointer required */
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full">
            <p className="mb-5 text-[11px] font-display tracking-[0.4em] uppercase text-white/50 font-bold">
              The Philosophy of
            </p>
            <h1 className="max-w-full text-[clamp(2rem,11vw,5rem)] font-display font-bold leading-[0.82] tracking-tighter text-[#f5f5f5]">
              OXYFEL
            </h1>
            <p className="mt-6 font-display text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/50 max-w-md leading-relaxed">
              A studio building original games and UE5 gameplay systems.
            </p>
            <p className="mt-8 text-lg sm:text-xl font-serif italic text-white/70 max-w-md">
              "From nothing we layer, until perfection is but the result."
            </p>
          </div>
        )}
      </section>

      {/* --- THE MANIFESTO: TYPOGRAPHIC ARCHITECTURE --- */}
      <section className="py-24 md:py-48 px-6 md:px-12 bg-[#050505] relative z-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
            {/* Left Column Structure */}
            <div className="md:col-span-4 reveal-block">
              <h2 className="font-display text-[10px] md:text-sm uppercase tracking-[0.3em] text-white/50 border-b border-white/20 pb-4 mb-8">
                I. The Integration
              </h2>
              <p className="text-3xl md:text-4xl font-serif leading-tight">
                We integrate anything and everything.
              </p>
              <p className="mt-6 text-xs md:text-sm font-display text-white/40 leading-relaxed uppercase tracking-widest">
                A unified ecosystem devoid of friction. Operating across disciplines to form a
                singular, monolithic standard.
              </p>
            </div>

            {/* Right Column Typography Poster */}
            <div className="md:col-span-8 md:mt-32 reveal-block delay-100 flex h-full w-full">
              <div className="w-full border border-white/10 p-6 pt-16 md:p-12 md:pt-20 relative overflow-hidden group hover:border-white/30 transition-colors duration-700 flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-4 md:p-6 font-display text-[10px] text-white/30 whitespace-nowrap">
                  OXYFEL DOC. 01
                </div>

                <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-display font-bold leading-[0.9] tracking-tighter uppercase break-words mt-2">
                  The limit <br />
                  <span className="text-white/20">&</span> the <br />
                  minimum
                </h3>

                <div className="mt-16 md:mt-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
                  <div className="w-16 h-px bg-white/50 shrink-0"></div>
                  <p className="text-3xl md:text-5xl lg:text-6xl font-serif italic text-white/90">
                    is perfection, for us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE DIVISIONS: INTERACTIVE DISCLOSURE GRID --- */}
      <section className="flex flex-col md:flex-row md:h-screen bg-[#f5f5f5] text-[#050505] relative z-20 border-t border-black/10 overflow-hidden">
        <h2 className="sr-only">The Divisions</h2>
        {DIVISIONS.map((division, index) => {
          const isActive = hoveredProject === index
          const linkTabIndex = isActive ? 0 : -1

          const detailLinkClass =
            'group/item flex items-baseline justify-between gap-6 hover:text-white/60 transition-colors duration-300'

          return (
            <div
              key={division.id}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              aria-label={`${division.title} — ${division.label}`}
              className={`
                group relative flex flex-col justify-between text-left border-b md:border-b-0 md:border-r border-black/15 overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] min-h-[40vh] md:min-h-0 outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-black/40
                ${isDesktop ? 'cursor-none' : 'cursor-pointer'}
                ${isActive ? 'flex-[3] md:flex-[4] bg-black text-white' : 'flex-1 md:flex-[1] hover:bg-black/5'}
              `}
              onMouseEnter={() => {
                if (!isDesktop) return
                setHoveredProject(index)
                setHovering(true)
              }}
              onMouseLeave={() => {
                if (!isDesktop) return
                setHoveredProject(null)
                setHovering(false)
              }}
              onFocus={() => {
                if (isDesktop) setHoveredProject(index)
              }}
              onBlur={(e) => {
                if (isDesktop && !e.currentTarget.contains(e.relatedTarget as Node)) {
                  setHoveredProject(null)
                }
              }}
              onClick={() => {
                if (isDesktop) return
                setHoveredProject((prev) => (prev === index ? null : index))
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setHoveredProject((prev) => (prev === index ? null : index))
                }
              }}
            >
              {/* Background image (reveals on activation) */}
              <div
                className={`absolute inset-0 z-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-25' : 'opacity-0'
                }`}
              >
                <img
                  src={division.image}
                  srcSet={`${division.image.replace('w=800', 'w=480')} 480w, ${division.image} 800w`}
                  sizes="(min-width: 768px) 80vw, 100vw"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover grayscale mix-blend-luminosity"
                />
              </div>

              {/* Top header info */}
              <div className="p-4 md:p-8 z-10 flex flex-row md:flex-col justify-between md:h-full gap-4 items-center md:items-start">
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
                  <span
                    className={`font-display text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold transition-colors duration-500 ${
                      isActive ? 'text-white' : 'text-black/40'
                    }`}
                  >
                    {division.id}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`font-display text-lg leading-none transition-all duration-500 ${
                      isActive ? 'rotate-45 text-white' : 'text-black/40'
                    }`}
                  >
                    +
                  </span>
                </div>

                {/* Vertical label (desktop) */}
                <span
                  className={`hidden md:block font-display text-[10px] uppercase tracking-[0.4em] transform -rotate-180 writing-vertical-rl whitespace-nowrap transition-colors duration-500 ${
                    isActive ? 'text-white/70' : 'text-black/40'
                  }`}
                >
                  {division.label}
                </span>

                {/* Horizontal label (mobile) */}
                <span
                  className={`md:hidden font-display text-[10px] uppercase tracking-[0.3em] transition-colors duration-500 text-right ${
                    isActive ? 'text-white/70' : 'text-black/40'
                  }`}
                >
                  {division.label}
                </span>
              </div>

              {/* Title + expandable details (bottom) */}
              <div
                className={`p-4 md:p-8 z-10 mt-auto relative w-full transition-all duration-700 ${
                  isActive ? 'pb-24 md:pb-28' : ''
                }`}
              >
                <h3
                  className={`
                  font-display font-bold uppercase tracking-tighter transition-all duration-[800ms] leading-[0.9]
                  ${
                    isActive
                      ? 'text-4xl sm:text-5xl md:text-6xl lg:text-[5vw]'
                      : 'text-2xl md:text-3xl md:transform md:-rotate-90 md:origin-bottom-left md:translate-y-4 md:translate-x-2 md:w-max'
                  }
                `}
                >
                  {division.title}
                </h3>

                <div
                  className={`overflow-hidden transition-all duration-700 w-full ${
                    isActive
                      ? 'max-h-[26rem] opacity-100 mt-5 md:mt-7'
                      : 'max-h-0 opacity-0 mt-0 pointer-events-none'
                  }`}
                >
                  <div className="border-t border-white/20 pt-5 max-w-xl">
                    {division.kind === 'team' ? (
                      <ul className="space-y-3">
                        {division.members.map((m) => (
                          <li key={m.name}>
                            <a
                              href={m.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              tabIndex={linkTabIndex}
                              className={`${detailLinkClass} border-b border-white/15 pb-3`}
                            >
                              <span className="font-serif italic text-2xl md:text-3xl lg:text-4xl">
                                {m.name}
                              </span>
                              <span className="font-display text-[10px] uppercase tracking-[0.25em] text-white/50 whitespace-nowrap">
                                {m.role} <span aria-hidden="true">↗</span>
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="space-y-5">
                        {division.categories.map((c) => (
                          <div key={c.name}>
                            <p className="font-display text-[10px] uppercase tracking-[0.4em] text-white/50 mb-2">
                              {c.name}
                            </p>
                            <ul className="space-y-2">
                              {c.items.map((it) => (
                                <li key={it.name}>
                                  {it.href ? (
                                    <a
                                      href={it.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      tabIndex={linkTabIndex}
                                      className={detailLinkClass}
                                    >
                                      <span className="font-serif italic text-2xl md:text-3xl lg:text-4xl">
                                        {it.name}
                                      </span>
                                      <span className="shrink-0 font-display text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-white/50">
                                        {it.action} <span aria-hidden="true">↗</span>
                                      </span>
                                    </a>
                                  ) : (
                                    <div
                                      aria-disabled="true"
                                      className="flex items-baseline justify-between gap-6 text-white/60"
                                    >
                                      <span className="font-serif italic text-2xl md:text-3xl lg:text-4xl">
                                        {it.name}
                                      </span>
                                      <span className="shrink-0 font-display text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-white/35">
                                        {it.action}
                                      </span>
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                    {division.cta && (
                      <a
                        href={division.cta.href}
                        tabIndex={linkTabIndex}
                        {...(division.cta.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="mt-6 inline-block font-display text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors duration-300 border-b border-white/30 pb-1"
                      >
                        {division.cta.label} <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {/* --- FOOTER: THE FOUNDATION --- */}
      <footer
        id="contact"
        className="bg-[#050505] text-[#f5f5f5] pt-32 pb-24 md:pb-12 px-6 md:px-12 relative z-20 border-t border-white/10 flex flex-col items-center justify-center text-center overflow-hidden"
      >
        <div className="reveal-block w-full max-w-full px-4">
          <p className="font-display text-[10px] md:text-xs uppercase tracking-[0.5em] text-white/40 mb-8">
            Initiate Sequence
          </p>
          {/* TODO switch to hello@yanezhekov.dev (or an oxyfel address) once the
              domain family + Cloudflare Email Routing exist. */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className={`inline-block text-[8vw] md:text-[6vw] font-serif italic hover:text-white/50 transition-colors duration-500 break-all ${
              isDesktop ? 'cursor-none' : ''
            }`}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="mt-24 md:mt-32 w-full border-t border-white/10 pt-8 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center font-display text-[9px] uppercase tracking-[0.3em] text-white/30 reveal-block delay-100">
          <span>&copy; {new Date().getFullYear()} Oxyfel</span>
          <a
            href={`${import.meta.env.BASE_URL}privacy.html`}
            className={`hover:text-white/60 transition-colors ${isDesktop ? 'cursor-none' : ''}`}
          >
            Privacy
          </a>
          <span>Perfection is standard</span>
        </div>
      </footer>
    </div>
  )
}
