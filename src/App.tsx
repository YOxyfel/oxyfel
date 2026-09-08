import { useEffect, useState } from 'react'
import { HubHeader, HubFooter } from './components/HubShell'
import type { Experience, SiteLocale } from './components/HubShell'
import HubExperience from './experiences/HubExperience'
import WorldsExperience from './experiences/WorldsExperience'
import CareExperience from './experiences/CareExperience'
import StudioExperience from './experiences/StudioExperience'

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
  return <div id="top" className={`experience-shell theme-${page}`}>
    <HubHeader page={page} locale={locale} />
    <main id="main" tabIndex={-1}>
      {page === 'hub' && <HubExperience />}
      {page === 'worlds' && <WorldsExperience />}
      {page === 'care' && <CareExperience />}
      {page === 'studio' && <StudioExperience />}
    </main>
    <HubFooter page={page} locale={locale} />
  </div>
}
