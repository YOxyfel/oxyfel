import { useEffect, useRef } from 'react'
import { ArrowRight, ArrowUpRight, CaretDown, List, X } from '@phosphor-icons/react'
import { divisions, media, portfolioProjects, ROBLOX_URL } from '../content'
import type { Division } from '../content'
import { OxyfelStar } from './OxyfelStar'
import { pageUrl, ShareButton } from './Share'

export type Experience = 'hub' | 'games' | 'care' | 'studio' | 'privacy' | 'notfound'
export type SiteLocale = 'en' | 'bg'
const paths: Record<Experience, string> = { hub: '', games: 'games/', care: 'care/', studio: 'studio/', privacy: 'privacy/', notfound: '' }
export const route = (page: Experience) => `${import.meta.env.BASE_URL}${paths[page]}`
export function projectRoute(id: string) {
  if (id === 'eldervice') return `${route('care')}#eldervice`
  if (id === 'personal') return `${route('studio')}#personal`
  if (id === 'oxyfel') return `${route('studio')}#case-websites`
  return `${route('games')}#${id}`
}
export const divisionOf = (page: Experience): Division | undefined => page === 'games' || page === 'studio' || page === 'care' ? page : undefined
export const toneOf: Record<Division, 'tone-gold' | 'tone-ice' | 'tone-jade'> = { games: 'tone-gold', studio: 'tone-ice', care: 'tone-jade' }

const words = {
  en: {
    skip: 'Skip to content', home: 'Oxyfel, home', homeLink: 'Oxyfel home', backHome: 'back to the Oxyfel home page', nav: 'Oxyfel and its divisions', games: 'Games', studio: 'Studio', care: 'Care',
    audience: { games: 'For players', studio: 'For companies', care: 'For people at home' },
    play: 'Play Chop-a-Chop!', playShort: 'Play', talk: 'Start a project', talkShort: 'Talk', help: 'Ask for help', helpShort: 'Help',
    all: 'All of Oxyfel', menu: 'Menu', close: 'Close the menu', directory: 'All of Oxyfel', directoryIntro: 'Every division and project, and where each one stands.', newTab: '(opens in a new tab)',
    statement: ['Find', 'your light.'], line: 'Games for players. Work for companies. Help for people.', made: 'Made by Yane Zhekov', privacy: 'Privacy',
    footerGames: [['Chop-a-Chop!', 'games/#chop-a-chop'], ['Games in development', 'games/#in-development'], ['Press and creators', 'games/#press']], footerStudio: [['What we build', 'studio/#studio-workbench'], ['Start a project', 'studio/#start-a-project'], ['The person behind it', 'studio/#personal']], footerCare: [['Eldervice', 'care/#eldervice'], ['Ask for help at home', 'care/#care-contact'], ['На български', 'care/?lang=bg']],
    playRoblox: 'Play on Roblox',
  },
  bg: {
    skip: 'Към съдържанието', home: 'Oxyfel, начало', homeLink: 'Начало на Oxyfel', backHome: 'обратно към началото на Oxyfel', nav: 'Oxyfel и направленията', games: 'Игри', studio: 'Студио', care: 'Грижа',
    audience: { games: 'За играчите', studio: 'За компании', care: 'За хората у дома' },
    play: 'Играйте Chop-a-Chop!', playShort: 'Играйте', talk: 'Започнете проект', talkShort: 'Проект', help: 'Попитайте', helpShort: 'Помощ',
    all: 'Всичко от Oxyfel', menu: 'Меню', close: 'Затваряне на менюто', directory: 'Всичко от Oxyfel', directoryIntro: 'Всички направления и проекти, и докъде е стигнал всеки.', newTab: '(отваря нов раздел)',
    statement: ['Намерете', 'своята светлина.'], line: 'Игри за играчите. Работа за компании. Помощ за хората.', made: 'От Яне Жеков', privacy: 'Поверителност (EN)',
    footerGames: [['Chop-a-Chop!', 'games/#chop-a-chop'], ['Игри в разработка', 'games/#in-development'], ['За медии', 'games/#press']], footerStudio: [['Какво създаваме', 'studio/#studio-workbench'], ['Започнете проект', 'studio/#start-a-project'], ['Кой стои зад него', 'studio/#personal']], footerCare: [['Eldervice', 'care/?lang=bg#eldervice'], ['Помощ у дома', 'care/?lang=bg#care-contact'], ['In English', 'care/']],
    playRoblox: 'Играйте в Roblox',
  },
} as const

// Pictures for the division cards in the menu (small files, loaded only when it opens).
const menuArt: Record<Division, string> = {
  games: `${import.meta.env.BASE_URL}media/chop-a-chop/night-640.webp`,
  studio: media('studio-mosquitto-model-640.webp'),
  care: media('care-world-640.webp'),
}

const statusBg: Record<string, string> = {
  'chop-a-chop': 'Вече излезе · Безплатно в Roblox', wuhen: 'PC демо в разработка', constellore: 'Играйте в браузъра', mosquittoz: 'LAN алфа за Windows', threshold: 'Локален прототип',
  eldervice: 'Пилотен проект · Варна', 'run-bank': 'Ранен прототип', personal: 'Публично портфолио', oxyfel: 'Пример от практиката',
}

export function Lockup({ division, className = '' }: { division?: Division; className?: string }) {
  return <span className={`ox-lockup ${division ? toneOf[division] : ''} ${className}`}>
    <OxyfelStar className="ox-lockup-star" />
    <span className="ox-lockup-word">OXYFEL</span>
    {division && <span className="ox-lockup-division">{divisions[division].word.toUpperCase()}</span>}
  </span>
}

export function HubHeader({ page, locale = 'en' }: { page: Experience; locale?: SiteLocale }) {
  const t = words[locale]
  const bg = locale === 'bg'
  const division = divisionOf(page)
  const directory = useRef<HTMLDetailsElement>(null)
  const summary = useRef<HTMLElement>(null)
  const close = () => { if (directory.current) directory.current.open = false; summary.current?.focus() }
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && directory.current?.open) { directory.current.open = false; summary.current?.focus() } }
    const outside = (event: PointerEvent) => { if (directory.current?.open && !directory.current.contains(event.target as Node)) directory.current.open = false }
    const navigation = () => { if (directory.current) directory.current.open = false }
    document.addEventListener('keydown', escape)
    document.addEventListener('pointerdown', outside)
    window.addEventListener('hashchange', navigation)
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); window.removeEventListener('hashchange', navigation) }
  }, [])
  const careRoute = `${route('care')}${bg ? '?lang=bg' : ''}`
  const divisionHref = (id: Division) => id === 'care' ? careRoute : route(id)
  const action = page === 'care'
    ? { href: '#care-contact', label: t.help, short: t.helpShort, external: false }
    : page === 'studio'
      ? { href: '#start-a-project', label: t.talk, short: t.talkShort, external: false }
      : { href: ROBLOX_URL, label: t.play, short: t.playShort, external: true }
  const closeMenu = () => { if (directory.current) directory.current.open = false }
  return <>
    <a className="h-skip" href="#main">{t.skip}</a>
    <header className="h-header" lang={locale}>
      <a className="h-brand" href={route('hub')} aria-label={division ? `${divisions[division].name}, ${t.backHome}` : t.home}><Lockup division={division} /></a>
      <nav className="h-nav" aria-label={t.nav}>
        <a className="h-nav-home tone-gold" href={route('hub')} aria-current={page === 'hub' ? 'page' : undefined}><OxyfelStar className="h-nav-star" /><span className="h-nav-home-word">Oxyfel</span></a>
        {(['games', 'studio', 'care'] as const).map(id => <a key={id} className={toneOf[id]} href={divisionHref(id)} aria-current={page === id ? 'page' : undefined}><i aria-hidden="true" />{t[id]}</a>)}
      </nav>
      <div className="h-end">
        <details className="h-directory" ref={directory}>
          <summary ref={summary}><span>{t.all}</span><span className="h-menu-label">{t.menu}</span><List size={18} className="h-menu-icon" aria-hidden="true" /><CaretDown size={14} weight="bold" className="h-caret" aria-hidden="true" /></summary>
          <div className="h-directory-panel">
            <noscript><style>{'.h-directory-title button{display:none}'}</style></noscript>
            <div className="h-directory-title"><p>{t.directory}</p><a className="h-directory-home tone-gold" href={route('hub')} onClick={closeMenu} aria-current={page === 'hub' ? 'page' : undefined}><OxyfelStar className="h-directory-home-star" />{t.homeLink}<ArrowRight size={16} aria-hidden="true" /></a><button type="button" aria-label={t.close} onClick={close}><X size={22} aria-hidden="true" /></button></div>
            <p className="h-directory-intro">{t.directoryIntro}</p>
            <nav className="h-menu-divisions" aria-label={t.nav}>
              {(['games', 'studio', 'care'] as const).map(id => <a key={id} className={toneOf[id]} href={divisionHref(id)} onClick={closeMenu} aria-current={page === id ? 'page' : undefined}>
                <span className="h-menu-art" aria-hidden="true"><img src={menuArt[id]} width="640" height="360" alt="" loading="lazy" decoding="async" /></span>
                <span className="h-menu-word">{t[id]}</span><small>{t.audience[id]}</small>
                <span className="h-menu-go" aria-hidden="true"><ArrowRight size={18} /></span>
              </a>)}
            </nav>
            <div className="h-directory-groups">
              {(['games', 'studio', 'care'] as const).map(id => <nav key={id} className={`h-directory-group ${toneOf[id]}`} aria-label={divisions[id].name}>
                <a className="h-directory-division" href={divisionHref(id)} onClick={closeMenu}><Lockup division={id} /><ArrowRight size={16} aria-hidden="true" /></a>
                {portfolioProjects.filter(project => project.division === id).map(project => <a key={project.id} className={project.id === 'chop-a-chop' ? 'h-directory-live' : undefined} href={project.id === 'eldervice' && bg ? `${route('care')}?lang=bg#eldervice` : project.id === 'chop-a-chop' ? `${route('games')}#chop-a-chop` : projectRoute(project.id)} onClick={closeMenu}>
                  <span className="h-project-description"><strong>{project.name}</strong><span className="h-project-status">{bg ? statusBg[project.id] ?? project.status : project.status}</span></span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>)}
                {id === 'games' && <a className="h-directory-cta" href={ROBLOX_URL} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>{t.playRoblox}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> {t.newTab}</span></a>}
                {id === 'studio' && <a className="h-directory-cta" href={`${route('studio')}#start-a-project`} onClick={closeMenu}>{t.talk}<ArrowRight size={16} aria-hidden="true" /></a>}
                {id === 'care' && <a className="h-directory-cta" href={`${careRoute}#care-contact`} onClick={closeMenu}>{t.help}<ArrowRight size={16} aria-hidden="true" /></a>}
              </nav>)}
            </div>
          </div>
        </details>
        <a className="h-action" href={action.href} {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          <span className="h-action-long">{action.label}</span><span className="h-action-short" aria-hidden="true">{action.short}</span><ArrowUpRight size={16} weight="bold" aria-hidden="true" />
          {action.external && <span className="sr-only"> {t.newTab}</span>}
        </a>
      </div>
    </header>
  </>
}

export function HubFooter({ page, locale = 'en' }: { page: Experience; locale?: SiteLocale }) {
  const t = words[locale]
  const base = import.meta.env.BASE_URL
  const columns: { division: Division; links: readonly (readonly [string, string])[] }[] = [
    { division: 'games', links: t.footerGames }, { division: 'studio', links: t.footerStudio }, { division: 'care', links: t.footerCare },
  ]
  return <footer id="contact" className="h-footer" lang={locale}>
    <div className="h-footer-top">
      <a href={route('hub')} aria-label={t.home}><OxyfelStar className="h-footer-star" /></a>
      <p className="h-footer-statement">{t.statement.map((line, index) => <span key={line}>{index ? ' ' : ''}{line}</span>)}</p>
      <p className="h-footer-line">{t.line}</p>
      <div className="h-footer-actions">
        {page !== 'hub' && <a className="h-footer-home tone-gold" href={route('hub')}><OxyfelStar className="h-footer-home-star" />{t.homeLink}<ArrowRight size={17} aria-hidden="true" /></a>}
        <ShareButton label={locale === 'bg' ? 'Споделете Oxyfel' : 'Share Oxyfel'} title="Oxyfel" text={t.line} url={pageUrl()} />
      </div>
    </div>
    <div className="h-footer-columns">
      {columns.map(column => <nav key={column.division} aria-label={divisions[column.division].name} className={`h-footer-column ${toneOf[column.division]}`}>
        <a className="h-footer-division" href={`${route(column.division)}${column.division === 'care' && locale === 'bg' ? '?lang=bg' : ''}`} aria-current={page === column.division ? 'page' : undefined}><Lockup division={column.division} /></a>
        {column.links.map(([label, href]) => <a key={href} href={base + href}>{label}</a>)}
        {column.division === 'games' && <a href={ROBLOX_URL} target="_blank" rel="noopener noreferrer">{t.playRoblox} <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> {t.newTab}</span></a>}
      </nav>)}
    </div>
    <div className="h-footer-bottom"><span>© {new Date().getFullYear()} Oxyfel</span><a href="https://v0-yanez.vercel.app/en" target="_blank" rel="noopener noreferrer">{t.made} <span className="sr-only">{t.newTab}</span></a><a href={route('privacy')} aria-current={page === 'privacy' ? 'page' : undefined}>{t.privacy}</a></div>
  </footer>
}

export function Intro() {
  return <div className="ox-intro" aria-hidden="true"><span className="ox-intro-flare" /><OxyfelStar className="ox-intro-star" /></div>
}
