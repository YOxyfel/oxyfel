import { useEffect, useRef, useState } from 'react'

// --- DATA FOR THE ECOSYSTEM ---
interface Project {
  id: string
  title: string
  category: string
  image: string
  /** External destination. When present, the card becomes a link; otherwise it is "Coming soon". */
  href?: string
  /** Call-to-action label shown on an active live card. */
  cta?: string
}

const PROJECTS: Project[] = [
  {
    id: '01',
    title: 'Yanez',
    category: 'Personal Portfolio',
    href: 'https://v0-yanez.vercel.app/en',
    cta: 'Visit site',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '02',
    title: 'Wan Lin',
    category: 'Games',
    href: 'https://yoxyfel.github.io/wan-lin-immortal/',
    cta: 'Play now',
    image:
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '03',
    title: 'Studio',
    category: 'Creative Works',
    image:
      'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '04',
    title: 'Labs',
    category: 'Experimental',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
  },
]

// A device "qualifies" for the pointer-driven experience only if it has a real
// hovering pointer (mouse/trackpad) and a wide enough viewport.
const DESKTOP_QUERY = '(min-width: 768px) and (hover: hover) and (pointer: fine)'

export default function OxyfelApp() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(DESKTOP_QUERY).matches : false,
  )
  const heroRef = useRef<HTMLElement | null>(null)

  // --- TRACK WHETHER THIS IS A POINTER-DRIVEN DESKTOP DEVICE ---
  useEffect(() => {
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
        .font-display { font-family: 'Syne', sans-serif; }
        .font-serif { font-family: 'Cormorant Garamond', serif; }

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
      <div className="fixed inset-0 pointer-events-none z-50 p-5 sm:p-6 md:p-12 flex flex-col justify-between mix-blend-difference text-white">
        <div className="flex justify-between items-start font-display text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
          <a
            href="#top"
            className={`pointer-events-auto hover:opacity-50 transition-opacity ${isDesktop ? 'cursor-none' : ''}`}
          >
            OXYFEL / INDEX
          </a>
          <div className="text-right pointer-events-auto">
            EST. <br />2024
          </div>
        </div>
        <div className="flex justify-between items-end font-display text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
          <div className="flex flex-col gap-1 pointer-events-auto">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className={`hover:opacity-50 transition-opacity ${isDesktop ? 'cursor-none' : ''}`}
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className={`hover:opacity-50 transition-opacity ${isDesktop ? 'cursor-none' : ''}`}
            >
              LinkedIn
            </a>
          </div>
          <div className="pointer-events-auto text-right">
            SCROLL <br /> ↓
          </div>
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
              <p className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 text-center text-lg md:text-2xl lg:text-3xl font-serif italic text-[#050505]/70">
                "From nothing we layer..."
              </p>
            </div>

            {/* Hint to move the cursor — mix-blend keeps it legible over both layers */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 font-display text-[10px] uppercase tracking-[0.4em] text-white mix-blend-difference animate-pulse pointer-events-none">
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

      {/* --- THE PORTFOLIO: INTERACTIVE ACCORDION GRID --- */}
      <section className="flex flex-col md:flex-row md:h-screen bg-[#f5f5f5] text-[#050505] relative z-20 border-t border-black/10 overflow-hidden">
        {PROJECTS.map((project, index) => {
          const isActive = hoveredProject === index
          const isLive = Boolean(project.href)

          const cardClassName = `
            group relative flex flex-col justify-between text-left no-underline border-b md:border-b-0 md:border-r border-black/15 overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] min-h-[34vh] md:min-h-0
            ${isDesktop ? 'cursor-none' : 'cursor-pointer'}
            ${isActive ? 'flex-[3] md:flex-[4] bg-black text-white' : 'flex-1 md:flex-[1] hover:bg-black/5'}
          `

          const enter = () => {
            if (!isDesktop) return
            setHoveredProject(index)
            setHovering(true)
          }
          const leave = () => {
            if (!isDesktop) return
            setHoveredProject(null)
            setHovering(false)
          }

          const inner = (
            <>
              {/* Background image (reveals on activation) */}
              <div
                className={`absolute inset-0 z-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-30' : 'opacity-0'
                }`}
              >
                <img
                  src={project.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover grayscale mix-blend-luminosity"
                />
              </div>

              {/* Top header info */}
              <div className="p-4 md:p-8 z-10 flex flex-row md:flex-col justify-between md:h-full gap-4 items-center md:items-start">
                <div className="flex items-center gap-3 md:flex-col md:items-start">
                  <span
                    className={`font-display text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold transition-colors duration-500 ${
                      isActive ? 'text-white' : 'text-black/40'
                    }`}
                  >
                    {project.id}
                  </span>
                  {isLive ? (
                    <span
                      aria-hidden="true"
                      className={`text-sm leading-none transition-colors duration-500 ${
                        isActive ? 'text-white' : 'text-black/40'
                      }`}
                    >
                      ↗
                    </span>
                  ) : (
                    <span
                      className={`font-display text-[8px] md:text-[9px] uppercase tracking-[0.25em] px-2 py-1 border transition-colors duration-500 ${
                        isActive ? 'border-white/40 text-white/80' : 'border-black/20 text-black/40'
                      }`}
                    >
                      Soon
                    </span>
                  )}
                </div>

                {/* Vertical category text (desktop) */}
                <span
                  className={`hidden md:block font-display text-[10px] uppercase tracking-[0.4em] transform -rotate-180 writing-vertical-rl whitespace-nowrap transition-colors duration-500 ${
                    isActive ? 'text-white/70' : 'text-black/40'
                  }`}
                >
                  {project.category}
                </span>

                {/* Horizontal category text (mobile) */}
                <span
                  className={`md:hidden font-display text-[10px] uppercase tracking-[0.3em] transition-colors duration-500 text-right ${
                    isActive ? 'text-white/70' : 'text-black/40'
                  }`}
                >
                  {project.category}
                </span>
              </div>

              {/* Title (bottom) */}
              <div className="p-4 md:p-8 z-10 mt-auto relative w-full">
                <h3
                  className={`
                  font-display font-bold uppercase tracking-tighter transition-all duration-[800ms] leading-[0.9]
                  ${
                    isActive
                      ? 'text-4xl sm:text-5xl md:text-6xl lg:text-[6vw]'
                      : 'text-2xl md:text-3xl md:transform md:-rotate-90 md:origin-bottom-left md:translate-y-4 md:translate-x-2 md:w-max'
                  }
                `}
                >
                  {project.title}
                </h3>

                {/* Expandable description block */}
                <div
                  className={`overflow-hidden transition-all duration-700 w-full ${
                    isActive ? 'max-h-40 opacity-100 mt-4 md:mt-6' : 'max-h-0 opacity-0 mt-0'
                  }`}
                >
                  {isLive ? (
                    <span className="inline-flex items-center gap-2 font-serif italic text-lg md:text-2xl lg:text-3xl text-white/90 border-t border-white/20 pt-4">
                      {project.cta}
                      <span aria-hidden="true">↗</span>
                    </span>
                  ) : (
                    <p className="font-display uppercase tracking-[0.3em] text-xs md:text-sm text-white/60 border-t border-white/20 pt-4">
                      Coming soon
                    </p>
                  )}
                </div>
              </div>
            </>
          )

          if (isLive) {
            return (
              <a
                key={project.id}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} — ${project.category}, opens in a new tab`}
                className={cardClassName}
                onMouseEnter={enter}
                onMouseLeave={leave}
                onFocus={() => isDesktop && setHoveredProject(index)}
                onBlur={() => isDesktop && setHoveredProject(null)}
              >
                {inner}
              </a>
            )
          }

          return (
            <button
              type="button"
              key={project.id}
              aria-expanded={isActive}
              className={cardClassName}
              onMouseEnter={enter}
              onMouseLeave={leave}
              onClick={() => {
                if (isDesktop) return
                setHoveredProject((prev) => (prev === index ? null : index))
              }}
            >
              {inner}
            </button>
          )
        })}
      </section>

      {/* --- FOOTER: THE FOUNDATION --- */}
      <footer className="bg-[#050505] text-[#f5f5f5] pt-32 pb-12 px-6 md:px-12 relative z-20 border-t border-white/10 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="reveal-block w-full max-w-full px-4">
          <p className="font-display text-[10px] md:text-xs uppercase tracking-[0.5em] text-white/40 mb-8">
            Initiate Sequence
          </p>
          <a
            href="mailto:inquiries@oxyfel.com"
            className={`inline-block text-[8vw] md:text-[6vw] font-serif italic hover:text-white/50 transition-colors duration-500 break-all ${
              isDesktop ? 'cursor-none' : ''
            }`}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            inquiries@oxyfel.com
          </a>
        </div>

        <div className="mt-24 md:mt-32 w-full border-t border-white/10 pt-8 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center font-display text-[9px] uppercase tracking-[0.3em] text-white/30 reveal-block delay-100">
          <span>&copy; {new Date().getFullYear()} Oxyfel</span>
          <span>Perfection is standard</span>
        </div>
      </footer>
    </div>
  )
}
