import { useEffect, useId, useState } from 'react'
import { ArrowUpRight, Check, Copy, EnvelopeSimple } from '@phosphor-icons/react'
import { CONTACT_EMAIL } from '../content'
import './contact.css'

type Locale = 'en' | 'bg'
type Context = 'care' | 'studio'
const words = {
  en: {
    careTitle: 'What would make your day easier?', studioTitle: 'Tell me what you have in mind.',
    careIntro: 'Ask about help at home in Varna, or the tools for making personal guides. We can work out the next step together.',
    studioIntro: 'A new world, a useful website, an experiment you cannot stop thinking about. Start with the idea, even if it is still taking shape.',
    kicker: 'A conversation starts here', choose: 'I would like to talk about', help: 'Help at home', guides: 'Guide tools', games: 'A game', websites: 'A website', interactive: 'An interactive experience', other: 'Something else',
    helpNote: 'Eldervice is a pilot project in Varna. Tell me the device and the task you need help with; availability and the scope of a visit are agreed by email.',
    guidesNote: 'Tell me who the guide is for and the task it should explain. Ask to see the guide tools or discuss making a personal guide.',
    studioNote: 'Tell me the idea, who it is for, and what you already have. Include a rough time frame if you know it. We can discuss scope and whether I am the right fit.',
    label: 'A little about your idea or question', optional: 'Optional', placeholderCare: 'For example: I would like help making video calls on my phone…', placeholderStudio: 'For example: I am making a game and need help with its multiplayer systems…',
    open: 'Open email draft', copyMessage: 'Copy message', copyEmail: 'Copy email', copied: 'Copied.', failed: 'Copy is unavailable here. Select and copy the address or your text below.',
    draftNote: 'This prepares a draft in your email app. You review and send it there.', privacy: 'Your text stays in this page until you choose to open or copy the draft. Nothing is submitted by this website.',
    direct: 'Or write directly to Yane', reply: 'What happens next', replyCare: 'Yane will discuss your question and the pilot’s fit by email. This is an inquiry, not a confirmed appointment.', replyStudio: 'I will read your idea and discuss the scope, availability and possible next steps with you by email.',
    fallback: 'Your draft', greeting: 'Hi Yane,', topic: 'I would like to ask about', bodyHint: 'My idea or question:', signoff: 'Thank you.',
  },
  bg: {
    careTitle: 'Какво би улеснило деня ви?', studioTitle: 'Разкажете ми за идеята си.',
    careIntro: 'Попитайте за помощ с техниката у дома във Варна или за инструментите за лични ръководства. Заедно ще уточним следващата стъпка.',
    studioIntro: 'Нова игра, полезен сайт или интерактивен проект. Започнете с идеята, дори още да се оформя.',
    kicker: 'Нека поговорим', choose: 'Искам да попитам за', help: 'Помощ у дома', guides: 'Ръководства', games: 'Игра', websites: 'Уебсайт', interactive: 'Интерактивен проект', other: 'Друга идея',
    helpNote: 'Eldervice е пилотен проект във Варна. Опишете устройството и задачата, за която ви трябва помощ. Възможността и обхватът на посещение се уточняват по имейл.',
    guidesNote: 'Кажете за кого е ръководството и каква задача трябва да обяснява. Можете да попитате за инструментите или за изработване на лично ръководство.',
    studioNote: 'Опишете идеята, за кого е предназначена и с какво разполагате. Ако имате ориентировъчен срок, добавете го.',
    label: 'Вашата идея или въпрос', optional: 'По желание', placeholderCare: 'Например: Искам помощ с видеоразговорите на телефона си…', placeholderStudio: 'Например: Разработвам игра и имам нужда от помощ…',
    open: 'Подгответе имейл', copyMessage: 'Копирайте текста', copyEmail: 'Копирайте адреса', copied: 'Копирано.', failed: 'Копирането не е достъпно тук. Маркирайте и копирайте адреса или текста по-долу.',
    draftNote: 'Отваря чернова в приложението ви за имейл. Преглеждате и изпращате съобщението оттам.', privacy: 'Текстът остава в тази страница, докато не отворите или копирате черновата. Сайтът не изпраща съобщения.',
    direct: 'Или пишете директно на Яне', reply: 'Какво следва', replyCare: 'Яне ще обсъди с вас въпроса и възможностите на пилотния проект по имейл. Това е запитване, а не потвърден час за посещение.', replyStudio: 'Ще обсъдим идеята, обхвата, възможностите и следващите стъпки по имейл.',
    fallback: 'Вашата чернова', greeting: 'Здравейте, Яне,', topic: 'Искам да попитам за', bodyHint: 'Моята идея или въпрос:', signoff: 'Благодаря.',
  },
} as const

export function ContactPanel({ context, locale = 'en' }: { context: Context; locale?: Locale }) {
  const t = words[locale]
  const id = useId()
  const choices = context === 'care' ? ['help', 'guides'] as const : ['games', 'websites', 'interactive', 'other'] as const
  const [intent, setIntent] = useState<string>(choices[0])
  const [message, setMessage] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'email' | 'message' | 'failed'>('idle')
  useEffect(() => {
    const selectIntent = (event: Event) => {
      const next = (event as CustomEvent).detail
      const available = context === 'care' ? ['help', 'guides'] : ['games', 'websites', 'interactive', 'other']
      if (available.includes(next)) { setIntent(next); setCopyState('idle') }
    }
    window.addEventListener('oxyfel-inquiry', selectIntent)
    return () => window.removeEventListener('oxyfel-inquiry', selectIntent)
  }, [context])
  const selected = choices.find(choice => choice === intent) || choices[0]
  const subject = `${context === 'care' ? 'Eldervice' : 'Oxyfel'} — ${t[selected]}`
  const body = `${t.greeting}\n\n${t.topic} ${t[selected].toLocaleLowerCase(locale)}.\n\n${message.trim() || t.bodyHint + '\n'}\n\n${t.signoff}`
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  async function copy(kind: 'email' | 'message') {
    try {
      await navigator.clipboard.writeText(kind === 'email' ? CONTACT_EMAIL : `${subject}\n\n${body}`)
      setCopyState(kind)
    } catch { setCopyState('failed') }
  }
  return <div className={`contact-panel contact-panel-${context}`} lang={locale}>
    <noscript><style>{'.contact-panel .contact-compose,.contact-panel .contact-direct button{display:none}.contact-panel{grid-template-columns:1fr}'}</style></noscript>
    <div className="contact-intro">
      <p className="contact-kicker">{t.kicker}</p>
      <h2 id={`${id}-title`}>{context === 'care' ? t.careTitle : t.studioTitle}</h2>
      <p>{context === 'care' ? t.careIntro : t.studioIntro}</p>
      <div className="contact-next"><span>01 / {t.reply}</span><p>{context === 'care' ? t.replyCare : t.replyStudio}</p></div>
      <div className="contact-direct"><span>{t.direct}</span><a href={`mailto:${CONTACT_EMAIL}`}><EnvelopeSimple size={20} aria-hidden="true" />{CONTACT_EMAIL}</a><button type="button" onClick={() => copy('email')}>{copyState === 'email' ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}{copyState === 'email' ? t.copied : t.copyEmail}</button></div>
    </div>
    <div className="contact-compose" aria-labelledby={`${id}-title`}>
      <fieldset><legend>{t.choose}</legend><div className="contact-options">{choices.map(choice => <label key={choice} className={selected === choice ? 'is-selected' : ''}><input type="radio" name={`${id}-intent`} value={choice} checked={selected === choice} onChange={() => { setIntent(choice); setCopyState('idle') }} /><span>{t[choice]}</span></label>)}</div></fieldset>
      <p className="contact-intent-note">{context === 'care' ? selected === 'help' ? t.helpNote : t.guidesNote : t.studioNote}</p>
      <label className="contact-message-label" htmlFor={`${id}-message`}>{t.label}<span>{t.optional}</span></label>
      <textarea id={`${id}-message`} rows={4} maxLength={1200} value={message} onChange={event => { setMessage(event.target.value); setCopyState('idle') }} placeholder={context === 'care' ? t.placeholderCare : t.placeholderStudio} aria-describedby={`${id}-privacy`} />
      <div className="contact-actions"><a className="contact-open" href={href}>{t.open}<ArrowUpRight size={20} aria-hidden="true" /></a><button type="button" onClick={() => copy('message')}><Copy size={18} aria-hidden="true" />{t.copyMessage}</button></div>
      <p className="contact-draft-note">{t.draftNote}</p>
      <p className="contact-privacy" id={`${id}-privacy`}>{t.privacy}</p>
      <p className="contact-copy-status" role="status">{copyState === 'failed' ? t.failed : copyState === 'email' || copyState === 'message' ? t.copied : ''}</p>
      {copyState === 'failed' && <details open><summary>{t.fallback}</summary><pre className="contact-fallback">{subject}{'\n\n'}{body}</pre></details>}
    </div>
  </div>
}
