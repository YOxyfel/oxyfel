# Oxyfel — an experience hub

Oxyfel brings the work of Yane Zhekov into four connected pages. The hub makes the first choice clear; Worlds, Everyday, and Studio each have their own atmosphere, useful interactions, and paths into the actual work.

| Route | Experience | What visitors can do |
| --- | --- | --- |
| `/oxyfel/` | Hub | Choose an experience through the visual entrances or compact mobile chooser; inspect all eight projects and their readiness. |
| `/oxyfel/worlds/` | Original games | Select any of five cinematic worlds, try small mechanics, inspect real gameplay or development artifacts, and follow the work into Studio. |
| `/oxyfel/care/` | Everyday / Eldervice | Explore a sample technology-help visit in English or Bulgarian, perform a small task, edit its visual guide, and download or print it. |
| `/oxyfel/studio/` | Creative development | Inspect Games, Websites, and Interactive cases through their problem, role, constraints, decisions, and recorded outputs. |

The shared **All projects** directory preserves the complete collection: Cultivation → Wuhen & Xuan; InfiniteWord → Constellore; Mosquitto → Mosquittoz; Threshold → THRESHOLD; Eldervice → Eldervice; Personal Website → Yane Zhekov; Business Website → Oxyfel; plus the existing Run & Bank prototype.

Live site: [yoxyfel.github.io/oxyfel](https://yoxyfel.github.io/oxyfel/). Source: [YOxyfel/oxyfel](https://github.com/YOxyfel/oxyfel).

## Inside the experiences

### Worlds

The five-world picker is visible near arrival and remains below the shared header while scrolling. Native fragments such as `/oxyfel/worlds/#constellore` and `/oxyfel/worlds/#proof-threshold` select the corresponding scene and proof. Browser history and keyboard navigation are preserved.

- **Wuhen & Xuan:** inspect the authored four-area demo scope and tunable world-design values, alongside correctly credited concept artwork. These are development decisions, not a claim that the areas are finished.
- **Constellore:** combine starter words in a small local sample using eighteen recipes verified against the game source. Earth + Water → Mud, then Mud + Fire → Brick forms the first complete route. Hints, a discovery trail, unsupported-pair feedback, and reset support exploration. The wider project includes the discovery board, expeditions, progression, and competitive modes; the public Pages link opens local, unranked browser practice.
- **Mosquittoz:** switch between real in-engine Human action tests and a Mosquitto character test; try a simplified carry, bank, and loss example. The archived character/action captures are labelled development tests, not finished-match gameplay. The project remains a Windows LAN systems alpha.
- **THRESHOLD:** inspect an actual 0.3.1 calibration capture and advance a source-based Momentum example. Progress events earn points; gate choices affect the next rating and score factor; Flow activates only after entering an active section with enough Momentum. This is a rule explanation, not a recreated parkour game.
- **Run & Bank:** switch among three actual environment construction references, zoom and scroll the plans, and inspect their authoring identities. Generated plans are distinguished from literal game geometry and gameplay.

All five worlds and their explanatory material are included in the static HTML. JavaScript enhances selection and the local samples; native notes, recipe explanations, images, and links remain useful without it.

### Everyday / Eldervice

The English/Bulgarian interface supports `?lang=bg`. The visit follows **Listen → Do together → Keep a guide** for Phone, Computer, or Television. Visitors interact with clearly labelled simulated controls: making a phone video call, preparing a computer call, or selecting a television input. These examples do not operate a real device or place a real call.

The matching guide uses captures of those working sample controls. Its title, personal note, and large/extra-large text can be edited in the page. **Download** creates a standalone HTML guide with embedded images; **Print** opens an image-complete print view. The browser's print dialog can save a PDF where supported. Unedited English and Bulgarian guide files are also linked in the no-JavaScript fallback.

Guide edits are local page state, with a separate draft for each device while the page remains open. This is an illustrative guide workbench, not a claim that the full Eldervice authoring application is embedded here. Eldervice is presented as a pilot in Varna, with service boundaries and availability discussed by email; there is no booking or payment flow.

### Studio

The three cases connect the problem and the maker's role to concrete decisions and outputs. Websites includes a controllable comparison of real previous/current hub captures and a mobile result. Games uses correctly labelled Mosquittoz model and LAN-menu evidence. Interactive exposes details of a real Constellore practice interface and links to its playable browser edition. Case fragments such as `/oxyfel/studio/#case-games` and `#case-interactive` support curated links from Worlds.

The Studio entrance uses actual work materials rather than presenting fantasy artwork as evidence of development. Screenshot labels distinguish gameplay, menus, models, sample interfaces, and previous website editions.

## Contact and local state

Everyday separates **Help at home** from **Guide tools**. Studio offers game, website, interactive-experience, and other-project inquiries. The contextual contact panel supplies prompts, a visible email address, copy controls, and an optional message draft.

**Open email draft** creates a `mailto:` draft for the visitor's email application. The visitor reviews and sends it there. The website does not submit an inquiry, send email, confirm an appointment, or accept payment. Draft text remains in page memory until the visitor chooses to open or copy it; it is not stored by this application or sent to a backend. Direct email and manual-copy fallbacks remain available. Clipboard access happens only after an explicit copy action.

## Run locally

Use the installed Node.js/npm environment:

```powershell
npm ci
npm run dev -- --host 127.0.0.1
```

Open the URL printed by Vite, including `/oxyfel/`. For production preview:

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

The build checks TypeScript, bundles the client, and then builds a temporary SSR entry. `scripts/prerender.mjs` writes real HTML for all four route directories, with individual titles, descriptions, and canonical URLs. The client hydrates the page matching its pathname. There is no client-router dependency or application server in production. The temporary SSR output is removed only within the verified workspace path.

## Source

- `src/App.tsx` selects the route. `src/components/HubShell.tsx` provides shared navigation, the complete project directory, and cross-experience footer; `src/hub.css` supplies the shell and hub presentation.
- `src/content.ts` holds project identities, statuses, and destinations. `src/experiences/` contains the route implementations and their scoped styles.
- `worlds-depth.tsx` and `worlds-model.ts` contain the project demonstrations and small source-verified models.
- The `care-*` modules and `CareDeviceTask.tsx` / `CareGuide.tsx` contain bilingual content, simulated task behavior, and safe guide rendering/export.
- `src/components/ContactPanel.tsx` builds local contextual drafts and explicit copy actions.
- `src/main.tsx`, `src/entry-server.tsx`, and `scripts/prerender.mjs` supply client hydration and static route generation.
- `public/images/` contains self-hosted project media and static sample guides. Fontsource fonts are bundled locally. `public/privacy.html` remains a standalone page.

## Review and evidence

Local design captures, source backups, and audit notes are excluded from this repository. They are not needed to build or run the site.

A passing build alone does not establish visual quality. For changes to this experience, inspect the actual routes at wide and narrow sizes and exercise:

- The shared directory, mobile chooser, direct URLs, browser Back, skip links, and keyboard focus across scene/case transitions.
- All five Worlds scenes; the complete Brick route; Mosquitto cargo banking/loss; THRESHOLD's recommended and alternative gates; the Wuhen scope inspector; and Run & Bank plan zoom.
- All three Care device tasks in both languages, guide edits, standalone downloads, and print views using their matching step images.
- Studio evidence selection, comparison endpoints, mobile result, annotated details, and contextual inquiry intent.
- Local contact drafts, explicit copy/fallback behavior, reduced motion, no-JavaScript content, readable labels, and document overflow.

Run `npm run build` for the portable TypeScript and production-build check. Source-parity checks against the original game projects and local browser-audit scripts require the author’s development environment; they are not production dependencies.

## Hosting

The existing GitHub Pages base is `https://yoxyfel.github.io/oxyfel/`. All four route directories are static outputs compatible with that hosting; the sitemap also includes Privacy. Public game/portfolio destinations stay separate from this site's local samples. Private previews and unfinished projects are not presented as public releases.

GitHub Pages serves the root of the existing `gh-pages` branch. Source is maintained on `main`. To publish a validated release with repository write access:

```powershell
npm run deploy
```

`npm run deploy` rebuilds and publishes only `dist/` to `gh-pages`, including `.nojekyll` and the four prerendered routes. Keep the corresponding source changes committed and pushed to `main`.

To change the hosting base, update Vite's `VITE_BASE` and the canonical/social/structured-data URLs, prerender origin, manifest, sitemap, robots, and standalone-page links together.
