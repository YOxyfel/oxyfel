import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, DeviceMobile, Monitor, Television } from '@phosphor-icons/react'
import { elderviceWebsite, media } from '../content'
import { ContactPanel } from '../components/ContactPanel'
import { LightField } from '../components/LightField'
import { careCopy } from './care-copy'
import type { CareDevice, CareLocale } from './care-copy'
import { CareDeviceTask } from './CareDeviceTask'
import { CareGuide } from './CareGuide'
import { advanceCareTask, initialCareTask } from './care-task-logic'
import { emptyCareGuide } from './care-guide-render'
import type { CareGuideDraft } from './care-guide-render'
import './care.css'
import './care-system.css'

const devices: { id: CareDevice; Icon: typeof DeviceMobile }[] = [
  { id: 'phone', Icon: DeviceMobile }, { id: 'computer', Icon: Monitor }, { id: 'television', Icon: Television },
]

export default function CareExperience() {
  const [locale, setLocale] = useState<CareLocale>('en')
  const [device, setDevice] = useState<CareDevice>('phone')
  const [stage, setStage] = useState(0)
  const [task, setTask] = useState(initialCareTask)
  const [feedback, setFeedback] = useState('')
  const [guides, setGuides] = useState<Record<CareDevice, CareGuideDraft>>({ phone: { ...emptyCareGuide }, computer: { ...emptyCareGuide }, television: { ...emptyCareGuide } })
  const t = careCopy[locale]
  const example = t.devices[device]
  const DeviceIcon = devices.find(item => item.id === device)!.Icon

  useEffect(() => {
    const readLanguage = () => {
      const next: CareLocale = new URLSearchParams(window.location.search).get('lang') === 'bg' ? 'bg' : 'en'
      setLocale(next)
      window.dispatchEvent(new CustomEvent('oxyfel-language', { detail: next }))
    }
    readLanguage()
    window.addEventListener('popstate', readLanguage)
    return () => window.removeEventListener('popstate', readLanguage)
  }, [])

  function changeLanguage(next: CareLocale) {
    setLocale(next)
    const url = new URL(window.location.href)
    url.searchParams.set('lang', next)
    window.history.replaceState(window.history.state, '', url)
    window.dispatchEvent(new CustomEvent('oxyfel-language', { detail: next }))
  }

  function chooseDevice(next: CareDevice) {
    setDevice(next)
    setStage(0)
    setTask({ ...initialCareTask })
    setFeedback('')
  }

  function chooseStage(next: number) {
    setStage(next)
    setFeedback(next === 2 ? 'guide' : '')
  }

  function restartVisit() {
    setStage(0)
    setTask({ ...initialCareTask })
    setFeedback('')
  }

  function act(action: string) {
    const next = advanceCareTask(device, task, action)
    setTask(next)
    setFeedback(next.feedback)
  }

  const status = feedback === 'wrongStep' ? t.wrongStep : t.status[feedback as keyof typeof t.status] || ''

  return <div className="care-experience" lang={locale}>
    <section className="ct-hero" id="eldervice" aria-labelledby="care-title">
      <div className="ox-scene"><LightField tone="jade" calm focus={[0.62, 0.3]} /></div>
      <div className="ct-hero-copy">
        <div className="c-language" role="group" aria-label={t.language}><span>{t.language}</span><button type="button" lang="en" aria-pressed={locale === 'en'} onClick={() => changeLanguage('en')}>English</button><button type="button" lang="bg" aria-pressed={locale === 'bg'} onClick={() => changeLanguage('bg')}>Български</button></div>
        <p className="ox-kicker">Oxyfel Care · {t.openingKicker}</p>
        <h1 id="care-title" className="ct-title"><span className="ox-line"><span>{t.title[0]}</span></span>{' '}<span className="ox-line"><span>{t.title[1]}</span></span>{' '}<span className="ox-line"><span className="ox-glow">{t.title[2]}</span></span></h1>
        <p className="ox-lede ct-lede">{t.opening}</p>
        <div className="ct-actions">
          <a className="ox-button ox-button--light ox-button--big" href="#a-visit" data-magnetic>{t.explore} <ArrowDown size={19} aria-hidden="true" /></a>
          <a className="ox-button ox-button--ghost ox-button--big" href="#care-contact" data-magnetic>{locale === 'bg' ? 'Попитайте за помощ' : 'Ask for help'} <ArrowRight size={19} aria-hidden="true" /></a>
        </div>
        <div className="ct-meta"><a className="c-website-link" href={elderviceWebsite.href} target="_blank" rel="noopener noreferrer">{locale === 'bg' ? 'Посетете сайта на Eldervice' : 'Visit the Eldervice website'}<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only">{locale === 'bg' ? ' (отваря нов раздел)' : ' (opens in a new tab)'}</span></a><p className="c-pilot"><span aria-hidden="true" />{t.pilot}</p></div>
      </div>
      <figure className="ct-hero-art ox-card" data-tilt><img src={media('care-world-1280.webp')} srcSet={`${media('care-world-640.webp')} 640w, ${media('care-world-1280.webp')} 1280w`} sizes="(max-width: 1000px) 100vw, 48vw" alt={t.openingAlt} width="1280" height="720" fetchPriority="high" /><figcaption>{t.illustration}</figcaption></figure>
    </section>

    <section className="c-visit c-width" id="a-visit" aria-labelledby="visit-title" data-chapter={locale === 'bg' ? 'Посещение' : 'A visit'}>
      <div className="c-section-intro"><p className="c-kicker"><span className="ox-num">01</span>{t.visitKicker}</p><h2 id="visit-title">{t.visitTitle[0]}<br /><em>{t.visitTitle[1]}</em></h2><p>{t.visitBody}</p></div>
      <div className="c-device-choices" role="group" aria-label={t.chooseDevice}>{devices.map(item => <button key={item.id} type="button" aria-pressed={device === item.id} onClick={() => chooseDevice(item.id)}><item.Icon size={22} aria-hidden="true" />{t.devices[item.id].label}</button>)}</div>

      <div className={'c-visit-demo c-depth-demo c-depth-stage-' + stage}>
        <div className="c-stages" role="group" aria-label={t.chooseStage}>{t.stages.map((label, index) => <button key={index} type="button" aria-pressed={stage === index} onClick={() => chooseStage(index)}><span className="c-stage-number" aria-hidden="true">{stage > index ? <Check size={17} /> : '0' + (index + 1)}</span><span>{label}</span></button>)}</div>
        <div className="c-demo-content">
          <div className="c-demo-story"><span className="c-demo-label"><DeviceIcon size={19} aria-hidden="true" />{example.label} · {stage + 1} {t.of} 3</span><h3>{stage === 0 ? example.listenTitle : stage === 1 ? example.doingTitle : t.guideHeading}</h3><p>{stage === 0 ? example.listenBody : stage === 1 ? example.doingBody : t.guideIntro}</p></div>
          {stage === 0 ? <div className="c-example-surface"><div className="c-listening-note"><DeviceIcon className="c-note-device" size={51} weight="light" aria-hidden="true" /><p className="c-paper-label">{t.everydayGoal}</p><blockquote>{example.question}</blockquote><p className="c-listening-close">{t.begin}</p><span className="c-note-line" aria-hidden="true" /></div></div> : stage === 1 ? <CareDeviceTask locale={locale} device={device} state={task} onAction={act} /> : <CareGuide locale={locale} device={device} draft={guides[device]} onDraft={draft => setGuides(current => ({ ...current, [device]: draft }))} onStatus={setFeedback} />}
        </div>
        <p className="c-task-feedback" role="status" aria-live="polite" aria-atomic="true">{status}</p>
        <div className="c-visit-actions"><button className="c-next-step" type="button" onClick={() => stage === 2 ? restartVisit() : chooseStage(stage + 1)}>{stage === 0 ? t.tryTogether : stage === 1 ? t.keepGuide : t.startAgain}<ArrowRight size={20} aria-hidden="true" /></button></div>
        <p className="c-example-caption">{t.exampleNote}</p>
        <noscript><style>{'.care-experience .c-language,.care-experience .c-device-choices,.care-experience .c-stages,.care-experience .c-visit-actions,.care-experience .c-guide-story-copy .c-next-step{display:none!important}'}</style><div className="c-no-script"><p>{t.noJs}</p><div>{devices.map(item => <p key={item.id}><a href={media('care-guide-' + item.id + '-en.html')}>{careCopy.en.devices[item.id].task} — English</a><br /><a href={media('care-guide-' + item.id + '-bg.html')} lang="bg">{careCopy.bg.devices[item.id].task} — Български</a></p>)}</div></div></noscript>
      </div>
    </section>

    <section className="c-guide-story" aria-labelledby="guide-tools-title" data-chapter={locale === 'bg' ? 'Ръководства' : 'Guides'}>
      <figure className="c-together-scene"><img src={media('care-together.webp')} alt={t.togetherAlt} width="1672" height="941" loading="lazy" decoding="async" /><figcaption>{t.togetherCaption}</figcaption></figure>
      <div className="c-guide-story-copy"><p className="c-kicker"><span className="ox-num">02</span>{t.guideKicker}</p><h2 id="guide-tools-title">{t.guideStoryTitle[0]}<br /><em>{t.guideStoryTitle[1]}</em></h2><p>{t.guideStory}</p><p>{t.guideToolBody}</p><a className="c-next-step" href="#a-visit" onClick={() => chooseStage(2)}>{t.openWorkbench}<ArrowRight size={20} aria-hidden="true" /></a></div>
    </section>

    <section className="c-care-boundaries c-width" aria-labelledby="care-founder-title" data-chapter={locale === 'bg' ? 'Кой помага' : 'Who helps'}><div><p className="c-kicker"><span className="ox-num">03</span>{t.founder}</p><h2 id="care-founder-title">{t.boundariesTitle}</h2><p>{t.founderBody}</p></div><div><p>{t.boundaries}</p><p>{t.privacy}</p></div></section>
    <section className="c-inquiry" id="care-contact" aria-label={t.contactKicker} data-chapter={locale === 'bg' ? 'Контакт' : 'Ask for help'}><ContactPanel context="care" locale={locale} /><span className="c-inquiry-mark" aria-hidden="true">Eldervice</span></section>
  </div>
}
