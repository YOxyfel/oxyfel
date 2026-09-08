import { useEffect, useRef } from 'react'
import { ArrowRight, ArrowUpRight, GridFour, X } from '@phosphor-icons/react'
import { elderviceWebsite, portfolioProjects } from '../content'

export type Experience = 'hub' | 'worlds' | 'care' | 'studio'
export type SiteLocale = 'en' | 'bg'
export const route = (page: Experience) => `${import.meta.env.BASE_URL}${page === 'hub' ? '' : `${page}/`}`
export function projectRoute(id: string) {
  if (id === 'eldervice') return `${route('care')}#eldervice`
  if (id === 'personal') return `${route('studio')}#personal`
  if (id === 'oxyfel') return `${route('studio')}#case-websites`
  return `${route('worlds')}#${id}`
}
const categoriesBg: Record<string,string> = {wuhen:'Екшън RPG',constellore:'Браузърна игра',mosquittoz:'Асиметрична мултиплейър игра',threshold:'Паркур в Roblox',eldervice:'Помощ и лични ръководства','run-bank':'Експедиция в Roblox',personal:'Лично портфолио',oxyfel:'Сайт на студиото'}
const statusesBg: Record<string,string> = {wuhen:'PC демо в разработка',constellore:'Играйте в браузъра',mosquittoz:'LAN алфа за Windows',threshold:'Локален прототип',eldervice:'Пилотен проект · Варна','run-bank':'Ранен прототип',personal:'Публично портфолио',oxyfel:'В момента сте тук'}

export function HubHeader({ page, locale = 'en' }: { page: Experience; locale?: SiteLocale }) {
  const bg = locale === 'bg'
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
  const talk = page === 'care' ? '#care-contact' : `${route('studio')}#start-a-project`
  return <>
    <a className="h-skip" href="#main">{bg ? 'Към съдържанието' : 'Skip to content'}</a>
    <header className="h-header" lang={locale}>
      <a className="h-brand" href={route('hub')} aria-label={bg ? 'Oxyfel — начало' : 'Oxyfel — back to the hub'}>OXYFEL<span>.</span></a>
      <span className="h-descriptor">{bg ? 'Създадено от Яне Жеков.' : 'The work of Yane Zhekov.'}<br />{bg ? 'Игри. Помощ. Нови идеи.' : 'Games. Everyday help. New ideas.'}</span>
      <nav className="h-nav" aria-label={bg ? 'Преживявания' : 'Experiences'}>
        <a href={route('worlds')} aria-current={page === 'worlds' ? 'page' : undefined}>{bg ? 'Светове' : 'Worlds'}</a>
        <a href={`${route('care')}${bg ? '?lang=bg' : ''}`} aria-current={page === 'care' ? 'page' : undefined}>{bg ? 'Ежедневие' : 'Everyday'}</a>
        <a href={route('studio')} aria-current={page === 'studio' ? 'page' : undefined}>{bg ? 'Студио' : 'Studio'}</a>
        <a className="h-talk" href={talk}>{bg ? 'Контакт' : 'Let’s talk'} <ArrowUpRight size={16} aria-hidden="true" /></a>
      </nav>
      <details className="h-directory" ref={directory}>
        <summary ref={summary}><GridFour size={19} aria-hidden="true" /><span>{bg ? 'Всички проекти' : 'All projects'}</span></summary>
        <div className="h-directory-panel">
          <noscript><style>{'.h-directory-title button{display:none}'}</style></noscript>
          <div className="h-directory-title"><p>{bg ? 'Всички посоки' : 'The whole collection'} <span>08</span></p><button type="button" aria-label={bg ? 'Затваряне на проектите' : 'Close project directory'} onClick={close}><X size={20} aria-hidden="true" /></button></div>
          <p className="h-directory-intro">{bg ? 'Какво можете да разгледате — и докъде е стигнал всеки проект.' : 'Find something to explore. See where each project stands.'}</p>
          <nav aria-label={bg ? 'Списък с проекти' : 'Project directory'}>
            {portfolioProjects.map((project, index) => <a key={project.id} href={project.id === 'eldervice' && bg ? `${route('care')}?lang=bg#eldervice` : projectRoute(project.id)} onClick={() => { if (directory.current) directory.current.open = false }}>
              <span className="h-project-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="h-project-description"><strong>{project.name}</strong><small>{bg ? categoriesBg[project.id] : project.category}</small><span className="h-project-status">{bg ? statusesBg[project.id] : project.status}</span></span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>)}
          </nav>
        </div>
      </details>
    </header>
  </>
}

export function HubFooter({ page, locale = 'en' }: { page: Experience; locale?: SiteLocale }) {
  const bg = locale === 'bg'
  return <footer id="contact" className="h-footer" lang={locale}>
    <div className="h-footer-top">
      <p>{bg ? 'Има още за откриване.' : 'There is more to discover.'}<br /><em>{bg ? 'Изберете друга посока.' : 'Follow a different thread.'}</em></p>
      <nav aria-label={bg ? 'Разгледайте още' : 'Keep exploring'}>
        <a href={elderviceWebsite.href} target="_blank" rel="noopener noreferrer">{bg ? 'Сайтът на Eldervice' : 'Eldervice website'}{elderviceWebsite.requiresSignIn && <span>{bg ? ' (с достъп)' : ' (sign-in required)'}</span>}<ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only">{bg ? ' (отваря нов раздел)' : ' (opens in a new tab)'}</span></a>
        {page !== 'hub' && <a href={route('hub')}>{bg ? 'Към началото' : 'Back to the hub'} <ArrowRight size={17} aria-hidden="true" /></a>}
        {page !== 'worlds' && <a href={route('worlds')}>{bg ? 'Оригинални игри' : 'Explore original games'} <ArrowUpRight size={17} aria-hidden="true" /></a>}
        {page !== 'care' && <a href={route('care')}>{bg ? 'Помощ в ежедневието' : 'Try an Eldervice visit'} <ArrowUpRight size={17} aria-hidden="true" /></a>}
        {page !== 'studio' && <a href={`${route('studio')}#case-websites`}>{bg ? 'Как се създава' : 'See how the work is made'} <ArrowUpRight size={17} aria-hidden="true" /></a>}
      </nav>
    </div>
    <div className="h-footer-bottom"><span>© {new Date().getFullYear()} Oxyfel</span><a href="https://v0-yanez.vercel.app/en" target="_blank" rel="noopener noreferrer">{bg ? 'От Яне Жеков' : 'Made by Yane Zhekov'} <span className="sr-only">{bg ? '(отваря нов раздел)' : '(opens in a new tab)'}</span></a><a href={`${import.meta.env.BASE_URL}privacy.html`}>{bg ? 'Поверителност (EN)' : 'Privacy'}</a></div>
  </footer>
}
