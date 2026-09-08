import { ArrowUpRight } from '@phosphor-icons/react'
import { media } from '../content'
import { route } from '../components/HubShell'

const entrances = [
  { id: 'worlds' as const, number: '01', label: 'Worlds', kind: 'Original games', promise: 'Some worlds are worth getting lost in.', action: 'Play & explore', image: 'wuhen-world.webp', alt: 'A mountain world beneath a red sun, from Wuhen & Xuan concept artwork.', detail: 'Five projects · Browser play & worlds in development', credit: 'Wuhen & Xuan · Concept artwork' },
  { id: 'care' as const, number: '02', label: 'Everyday', kind: 'Help with technology', promise: 'A little help can change the whole day.', action: 'Try a little help', image: 'care-world.webp', alt: 'An Eldervice illustration of a technology helper with an older person at home.', detail: 'Eldervice · Varna pilot & personal visual guides', credit: 'Eldervice · Service illustration' },
  { id: 'studio' as const, number: '03', label: 'Studio', kind: 'Design & development', promise: 'See what goes into bringing an idea to life.', action: 'Explore the making', image: 'studio-portal.webp', alt: 'Real work from the studio: an in-engine model, an interactive game and a website design.', detail: 'Case studies · Games, websites & interactive work', credit: 'Selected work · Development & interface captures' },
]

export default function HubExperience() {
  return <div className="hub-experience">
    <section className="h-arrival" aria-labelledby="hub-title">
      <div className="h-introduction"><p className="h-eyebrow">The independent work of Yane Zhekov</p><h1 id="hub-title">Curiosity takes <em>many forms.</em></h1><p className="h-intro-copy">Original games. Help with everyday technology. Ideas made real.<br className="h-desktop-break" /> Choose an experience and find your way in.</p></div>
      <nav id="work" className="h-entrances" aria-label="Choose your experience">
        {entrances.map(entrance => <a key={entrance.id} className={`h-entrance h-entrance-${entrance.id}`} href={route(entrance.id)} aria-labelledby={`entrance-${entrance.id}-title`} aria-describedby={`entrance-${entrance.id}-description`}>
          <img className="h-entrance-image" src={media(entrance.image)} alt={entrance.alt} width="1792" height="1024" fetchPriority={entrance.id === 'worlds' ? 'high' : 'auto'} />
          <div className="h-entrance-top"><span>{entrance.number} / {entrance.kind}</span><ArrowUpRight size={22} aria-hidden="true" /></div>
          <div className="h-entrance-copy"><h2 id={`entrance-${entrance.id}-title`}>{entrance.label}<span>.</span></h2><p id={`entrance-${entrance.id}-description`}>{entrance.promise}</p><span className="h-entrance-action">{entrance.action}<span className="h-entrance-orbit"><ArrowUpRight size={21} aria-hidden="true" /></span></span><small className="h-entrance-detail">{entrance.detail}</small></div>
          <small className="h-entrance-credit">{entrance.credit}</small>
        </a>)}
      </nav>
    </section>
    <aside className="h-hub-note"><p>Eight projects. Three different ways in.</p><a href={`${route('studio')}#personal`}>Meet the person behind the work <ArrowUpRight size={17} aria-hidden="true" /></a></aside>
  </div>
}
