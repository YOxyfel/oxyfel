import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import { CONTACT_EMAIL, CONTACT_HREF, GAME_SITE_URL, ROBLOX_URL } from '../content'
import { route } from '../components/HubShell'
import { OxyfelStar } from '../components/OxyfelStar'
import './info.css'

export function PrivacyExperience() {
  return <article className="info-page info-privacy" aria-labelledby="privacy-title">
    <header className="info-head">
      <p className="info-kicker">Oxyfel / Privacy</p>
      <h1 id="privacy-title">Privacy.</h1>
      <p className="info-intro">A simple website, with a clear account of how information is handled.</p>
      <p className="info-updated">Last updated: 6 November 2026</p>
    </header>
    <div className="info-body">
      <section aria-labelledby="privacy-website">
        <h2 id="privacy-website"><span>01</span> This website</h2>
        <p>The Oxyfel website has no visitor accounts, analytics or tracking scripts, and it sets no cookies. Fonts, images and videos are served from the website itself. Interactive examples, countdowns and guide previews run in your browser.</p>
      </section>
      <section aria-labelledby="privacy-parents">
        <h2 id="privacy-parents"><span>02</span> For parents</h2>
        <p>Chop-a-Chop! by Oxyfel Games is an all-ages game. This website asks children for nothing: there are no sign-ups, no newsletter, no chat and no tracking.</p>
        <p>The game itself is played on Roblox, where Roblox’s own privacy policy and parental controls apply.</p>
      </section>
      <section aria-labelledby="privacy-hosting">
        <h2 id="privacy-hosting"><span>03</span> Hosting and external links</h2>
        <p>This site is hosted on GitHub Pages. GitHub may receive technical information, including your IP address, when serving pages and files. Its handling of that information is described in the <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub Privacy Statement</a>.</p>
        <p>Roblox, the game’s own site, the Eldervice website, GitHub and the founder’s portfolio are separate websites. Following those links takes you to services with their own privacy practices.</p>
      </section>
      <section aria-labelledby="privacy-email">
        <h2 id="privacy-email"><span>04</span> If you email us</h2>
        <p>The inquiry tools prepare an email draft in your browser. Your text is not submitted to a server by this website and is not saved when you leave the page. Opening a draft passes the text to your email application; copying it places it on your clipboard. Guide samples can also be downloaded or printed on your device.</p>
        <p>If you choose to send a message, we receive the information you include, such as your email address and project details, so we can reply. Your email provider and ours also handle the message. To ask about information you have shared with us, including requests to access, correct or delete it, email <a href={CONTACT_HREF}>{CONTACT_EMAIL}</a>.</p>
      </section>
      <section aria-labelledby="privacy-changes">
        <h2 id="privacy-changes"><span>05</span> Questions and changes</h2>
        <p>Questions about this page can be sent to <a href={CONTACT_HREF}>{CONTACT_EMAIL}</a>. This page will be updated if the website’s use of forms, analytics or other information-handling features changes.</p>
      </section>
    </div>
  </article>
}

export function NotFoundExperience() {
  return <section className="info-page info-missing" aria-labelledby="missing-title">
    <OxyfelStar className="info-missing-star" spin />
    <p className="info-missing-code" aria-hidden="true">404</p>
    <h1 id="missing-title">This tree already fell.</h1>
    <p className="info-intro">The page you were looking for isn’t here. It may have moved when Oxyfel grew its new doors.</p>
    <nav className="info-missing-links" aria-label="Find your way back">
      <a className="ox-button ox-button--light" href={route('hub')}>Oxyfel home <ArrowRight size={18} aria-hidden="true" /></a>
      <a className="ox-button ox-button--ghost" href={route('games')}>Oxyfel Games</a>
      <a className="ox-button ox-button--ghost" href={route('studio')}>Oxyfel Studio</a>
      <a className="ox-button ox-button--ghost" href={route('care')}>Oxyfel Care</a>
    </nav>
    <p className="info-missing-play">Looking for the game? <a href={ROBLOX_URL} target="_blank" rel="noopener noreferrer">Play Chop-a-Chop! on Roblox <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a> or visit <a href={GAME_SITE_URL} target="_blank" rel="noopener noreferrer">its own site<span className="sr-only"> (opens in a new tab)</span></a>.</p>
  </section>
}
