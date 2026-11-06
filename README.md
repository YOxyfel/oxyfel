# Oxyfel

The website of Oxyfel and its three divisions. One star, three lights: every page shares one design system, and each division has its own light.

| Address | Page | Light |
| --- | --- | --- |
| `/` | **Oxyfel**: the star, what's new (Chop-a-Chop! is out), the three divisions, who is behind them, and the right contact for each | Gold |
| `/games/` | **Oxyfel Games**: Chop-a-Chop! (gameplay hero, trailer, drop countdowns, features, six clips, the drops), the five games in development, press | Gold |
| `/studio/` | **Oxyfel Studio**: work for companies; case studies (games, websites, interactive), the person behind it, start a project | Ice |
| `/care/` | **Oxyfel Care**: Eldervice, patient technology help at home in Varna; a practice visit, personal guides, English and Bulgarian (`?lang=bg`) | Jade |
| `/privacy/` | Privacy, with a note for parents | Gold |
| `404.html` | "This tree already fell." | Gold |
| `/worlds/`, `/privacy.html` | Forward to `/games/` (the `#hash` is kept) and `/privacy/` | |

Products keep their own names, with an endorsement line: "A production by Oxyfel Games", "An Oxyfel Care service", "Built by Oxyfel Studio". Chop-a-Chop! has its own site, [playchopachop.com](https://playchopachop.com/).

## The design system

- **Tokens and building blocks** live in `src/shell.css`:
  - colours: one black base, plus gold, ice and jade lights;
  - type: Inter for reading and the interface, Syne for headlines and big numbers, Cormorant italic for accent words and the wordmark;
  - buttons, cards with a cursor light and 3D tilt, graded imagery, the kinetic marquee and scroll reveals;
  - the header, menu and footer, the drop countdowns, the shared contact panel and the first-visit intro.
- **Choosing a light:** a page picks its light through its theme class (`theme-games`, `theme-studio`, `theme-care`); any element can pick one with `tone-gold`, `tone-ice` or `tone-jade`.
- **`src/components/StarScene.tsx`:** the star in real-time 3D, ray-marched gold. It turns toward the cursor, spins when clicked and reflects the light of the division in focus. Without WebGL the vector star stays.
- **`src/components/Showreel.tsx`:** the home page filmstrip, real frames from every division.
  - On wide screens it pins and rolls sideways as you scroll. The frame passing the gate turns to full colour, while the others rest in their division's tone.
  - On phones, with reduced motion and without JavaScript, it is a swipeable row.
- **Home page scroll story:** on wide screens the three divisions are a pinned scroll story (`LightStory` in `HubExperience.tsx`) in which the light shifts from gold to ice to jade. On phones, with reduced motion and without JavaScript, the same chapters show as a stack.
- **Ultra-wide:** content is centred up to `--max` (1680 px, rising to 1960 px from 2000 px wide and 2240 px from 2800 px), while backgrounds stay full-bleed. Type and controls step up at 2000 px. On 2:1 and wider screens the home hero adds side panels: a playing clip and the next drops.
- **`src/components/TimberChallenge.tsx`:** the 10-second TIMBER! challenge on the Games page.
  - Tap, click or press Space to chop; five hits fell a tree, and golden trees are worth three.
  - The best score stays in the visitor's browser.
  - "Challenge a friend" shares a link with `?challenge=N#challenge`, which shows the friend the score to beat.
- **`src/components/Share.tsx`:** `ShareButton` uses the device's share sheet, or falls back to copy-link plus plain links to X, WhatsApp, Telegram, Reddit, Facebook and email. No SDKs or trackers load. `RemindMe` adds a timed drop to Google Calendar or downloads an .ics file, and both work without JavaScript.
- **The way home:** the logo always leads to the Oxyfel home page, and the division switcher starts with Oxyfel. The "All of Oxyfel" menu opens with "Oxyfel home", and every page except home ends with an "Oxyfel home" button.
- **The "All of Oxyfel" menu:** on wide screens, a panel with a picture card for each division and its projects in three columns. On phones it is the full-screen menu.
- **`src/components/Wayfinding.tsx`:**
  - `ChapterRail` is the numbered index on the right edge of wide screens, built from sections marked `data-chapter`.
  - `PlayBar` is the floating "Play free" bar on the home and Games pages. It steps aside for the hero, the footer and anything marked `data-hide-playbar`, and can be dismissed for the visit.
- **`src/components/LightField.tsx`:** the live WebGL light behind the heroes, tinted per division: drifting fog, light shafts from the star, a flare, and dust at three depths.
  - It renders at reduced resolution, pauses off screen and in background tabs, and draws one still frame for reduced motion.
  - The CSS gradient underneath stays visible wherever WebGL is unavailable.
- **`src/components/effects.ts`:** the glass header on scroll, the cursor light and tilt (`data-spotlight`, `data-tilt`), magnetic buttons (`data-magnetic`) and skipping the intro.
  - Pointer effects only run with a mouse or trackpad and normal motion settings.
- **`src/components/Media.tsx`:** the marquee and the muted gameplay loops.
  - Loops load only when they scroll into view, play only while visible, skip reduced motion and data saver, and always have a pause button.
- **`src/components/Countdown.tsx`:** drop countdowns in the visitor's own time. They turn into "Live now" by themselves. The drop list is `chopDrops` in `src/content.ts`.
- **`src/components/OxyfelStar.tsx`:** the star, redrawn as a vector from the gold logo.
  - The star and the OXYFEL wordmark take the light they sit in: gold for Oxyfel and Games, ice for Studio, jade for Care. So every lockup is one colour, never gold beside ice or jade.
- **Glass blur:** write `backdrop-filter` on its own, without a `-webkit-` copy. The build (Lightning CSS) adds the prefix itself. A hand-written copy makes it keep only the prefixed line, which switches the blur off in Chrome and Edge.
- **Per-page styles:** each page has its own stylesheet next to it (`home.css`, `games.css`, `info.css`). The older Studio, Care and Worlds stylesheets keep their layout; `studio-system.css`, `care-system.css` and `worlds-system.css` bring them into the system.
- **Care's light panel:** its practice area deliberately stays on a light "paper" panel with dark text, because that is where older visitors read and try things.

## Inside the divisions

- **Games: the five worlds in development.** Their demos are unchanged:
  - the Constellore word sample;
  - THRESHOLD's Momentum example;
  - the Mosquittoz inspector;
  - the Run & Bank plans;
  - the Wuhen scope notes.

  Statuses stay honest. Concept art, development captures and environment references are labelled as such. `/games/#constellore` and the old `/worlds/#constellore` both open that world.
- **Care: the visit.** It follows Listen → Do together → Keep a guide for a phone, a computer or a television, using clearly labelled simulated controls. The guide can be edited, downloaded as standalone HTML or printed. Nothing operates a real device or places a real call. There is no booking or payment.
- **Studio: the cases.** Each case shows the problem, the role, the decisions and real outputs. The Websites case compares the September hub with today's site.
- **Contact:** contact prepares a draft in the visitor's own email app; the site never sends anything. The visitor's text stays in the page until they open or copy the draft.

## Run locally

```powershell
npm ci
npm run dev -- --host 127.0.0.1
```

Open the printed address, including `/oxyfel/`. For the production build:

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

The build has three steps:
1. It type-checks and bundles the client.
2. It builds a temporary server entry.
3. `scripts/prerender.mjs` writes real HTML for every page, each with its own title, description, canonical link and share card (`public/og/*.jpg`).
   - It also writes `404.html`, the forwarding pages, `sitemap.xml`, `robots.txt` and `site.webmanifest`.
   - For the domain build, it writes `CNAME`.

The client hydrates the page named by `data-page`. Everything works without JavaScript except the live effects and samples.

## Hosting and the move to oxyfel.com

The site is served by GitHub Pages from the `gh-pages` branch. `npm run deploy` builds and publishes `dist/` there, with your OK each time. Keep the source committed and pushed to `main`.

Every absolute address comes from `site.config.mjs`. `LIVE_TARGET` is `'pages'` (https://yoxyfel.github.io/oxyfel/) until the domain is ready. `npm run build:domain` builds the oxyfel.com variant locally without changing anything. To switch:

1. **DNS at Cloudflare for oxyfel.com.** The records are:
   - four `A` records for `@`: 185.199.108.153, .109.153, .110.153 and .111.153;
   - four `AAAA` records for `@`: 2606:50c0:8000::153 through 8003::153;
   - a `CNAME` for `www` pointing to `yoxyfel.github.io`.

   Set every one of them to **DNS only** (grey cloud), so GitHub can issue the HTTPS certificate.
2. **On GitHub,** open YOxyfel/oxyfel > Settings > Pages and set the custom domain to `oxyfel.com`. In your profile's Settings > Pages, verify the domain with the TXT record GitHub shows.
3. **In the code,** change `LIVE_TARGET` to `'domain'` in `site.config.mjs`, then `npm run deploy`. The build now serves from `/` and includes the `CNAME` file, which keeps the domain on every deploy.
4. **Once GitHub offers it,** tick **Enforce HTTPS**. The old yoxyfel.github.io/oxyfel/ address forwards to oxyfel.com by itself.

Don't deploy the domain build before the DNS and GitHub steps: until then it would point visitors at a domain that doesn't answer yet.

## Media

Chop-a-Chop! media in `public/media/chop-a-chop/` was copied from the game site's folder:
- the hero loops and clips, without audio and re-encoded lighter;
- the trailer;
- the logo;
- clean gameplay frames taken from the trailer and clips (`shot-*`). The Games feature grid sets its titles in the site's own type instead of using the Roblox thumbnails.

The app icons in `public/icons/` come from the gold-star artwork. The share cards in `public/og/` were rendered with the site's own fonts; the Games card is the game site's own.

## Review

A passing build alone doesn't establish visual quality. After changes, check every page at 320, 390, 768 and 1440 px, then:
- reduced motion and no JavaScript;
- keyboard use: the skip link, the menu and Escape, and focus;
- the Worlds demos, the Care tasks in both languages, and guide download and print;
- the Studio cases and comparison;
- no sideways scrolling.

The local capture and check scripts live in `audit/`, which is not part of the repository.
