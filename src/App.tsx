import { useEffect, useState } from 'react'
import { HubHeader, HubFooter, Intro } from './components/HubShell'
import { installEffects } from './components/effects'
import { ChapterRail, PlayBar } from './components/Wayfinding'
import type { Experience, SiteLocale } from './components/HubShell'
import HubExperience from './experiences/HubExperience'
import GamesExperience from './experiences/GamesExperience'
import CareExperience from './experiences/CareExperience'
import StudioExperience from './experiences/StudioExperience'
import { NotFoundExperience, PrivacyExperience } from './experiences/InfoPages'

export default function OxyfelApp({ page = 'hub' }: { page?: Experience }) {
  const [locale, setLocale] = useState<SiteLocale>('en')
  useEffect(() => {
    const sync = () => setLocale(page === 'care' && new URLSearchParams(window.location.search).get('lang') === 'bg' ? 'bg' : 'en')
    const language = (event: Event) => setLocale((event as CustomEvent).detail === 'bg' ? 'bg' : 'en')
    sync()
    window.addEventListener('oxyfel-language', language)
    window.addEventListener('popstate', sync)
    return () => { window.removeEventListener('oxyfel-language', language); window.removeEventListener('popstate', sync) }
  }, [page])
  useEffect(() => { document.documentElement.lang = locale }, [locale])
  useEffect(() => installEffects(), [])
  return <div id="top" className={`experience-shell theme-${page}`}>
    <Intro />
    <HubHeader page={page} locale={locale} />
    <main id="main" tabIndex={-1}>
      {page === 'hub' && <HubExperience />}
      {page === 'games' && <GamesExperience />}
      {page === 'care' && <CareExperience />}
      {page === 'studio' && <StudioExperience />}
      {page === 'privacy' && <PrivacyExperience />}
      {page === 'notfound' && <NotFoundExperience />}
    </main>
    {(page === 'hub' || page === 'games' || page === 'studio' || page === 'care') && <ChapterRail />}
    {(page === 'hub' || page === 'games') && <PlayBar />}
    <HubFooter page={page} locale={locale} />
  </div>
}
