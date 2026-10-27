# Hairline foundations: implementation report

The production build of the Pajand Hairline foundations: tokens, fonts, shell, motion lifecycle, the
component set, and the first two pages (home and portfolio index). The design source is
`docs/design/` from #223 (pinned at `b8856fec`). Case-study pages and the other routes still use their
current markup and are out of scope here.

## Architecture

- **Tokens.** `app/globals.css` holds the only colour, type, spacing, stroke and gutter tokens. The
  dark surface is the default; `Band` redefines `--tone-fg`, `--tone-mute` and `--tone-rule` for the
  bone surface, so components never branch on the surface they sit on.
- **Fonts.** `app/fonts.ts` loads Archivo (variable `wdth` axis, normal and italic) through
  `next/font/google` and Geist Mono from the existing `geist` package. No new font packages.
- **Styling.** One CSS Module per component. Shared type roles (`mono`, `display`, `pageHead`,
  `cardTitle`, `srOnly`) live in `components/hairline/styles/type.module.css` and are pulled in with
  `composes`. Tailwind remains for its preflight only.
- **Rendering.** Everything is a Server Component except these narrow client islands:
  `SiteNavigation` (menu disclosure and scroll progress), `DisplayWord`, `Ticker`, `BandChevrons`,
  `LitList`, `StrataCanvas`, `PlatesField`, `StackWords`,
  `OperatingModelScene`, `ChapterRail`, `ScreenshotFrame`, `LayersDiagram`, `FlowBand`, and the
  existing `ContactForm`. Each renders complete, readable markup on the server; script only adds
  motion or interaction.
- **Motion lifecycle.** `utils/motion/useMotion` is the single abstraction. It covers:
  - setup after mount, re-setup on reduced-motion or `resetKey` changes (route changes);
  - pausing off screen (IntersectionObserver) and in hidden tabs;
  - element resizes (ResizeObserver) and back/forward-cache restores;
  - teardown on unmount;
  - failures: an error marks the island `data-motion="failed"` and keeps the server markup.

  `scrollScheduler` coalesces scroll and resize into one frame shared by all islands. Frames stop
  when velocity decays, so nothing runs while the page is at rest. `createEasedPointer` gives the
  same guarantee to pointer parallax.
- **Content.** Production copy comes from the existing `data/` modules unchanged. New display copy
  lives in `data/homepage.ts`, `data/nav.ts` and `data/portfolioIndex.ts` (listed below for sign-off).

## Component contracts

| Component | Kind | Contract |
| --- | --- | --- |
| `SiteShell` | server | Skip link, `Frame`, `SiteNavigation`, page children, `SiteFooter`. Pages own `<main id="main-content">`. |
| `SiteNavigation` | client | Five production links, "Open to roles", "Book a call" (new tab, announced). Below 520px the links fold into a non-modal disclosure: Escape closes and returns focus; it also closes on link choice, on route change and when the viewport widens. 2px scroll-progress line. |
| `SiteFooter` | server | Name, location, site and year. |
| `Band` / `BandChevrons` | server / client | Full-bleed bone surface that keeps the column's container. Chevrons light on scroll and stay lit without JS or with reduced motion. |
| `SectionHead` / `SectionFoot` | server | `{ title, titleId, lede?, note?, action? }`; foot `{ count, action }`. |
| `DisplayWord` | client | `{ words: [a, b], variant: "hero" \| "index", as: "h1" \| "p", motion: "scroll" \| "center", reach, pulse }`. Rest layout is pure CSS; screen readers get the words once as text. |
| `Ticker` | client | `{ items, icon, direction, label? }`. Scroll-velocity driven only. With `label` it is one labelled list; without, it is decorative. The duplicate run is always hidden; reduced motion wraps it. |
| `Tags`, `LinkRows`, `LitList` | server / server / client | Pill list; boxed contact rows that label new-tab links; list that lights the row nearest the viewport centre. |
| `NextLinks` | server | `{ label, links: { eyebrow, title, href }[] }` rendered as a labelled `nav`. |
| `FactsPanel` | server | `{ facts: { term, detail }[], stacked? }` rendered as a `dl`. |
| `ChapterRail` | client | `{ label, chapters: { id, label }[] }`. In-page links work without JS. With JS it adds `aria-current` on the chapter under the top 30%, a `[data-chapter-for]` band counting as its chapter, and a progress line. |
| `CaseSection`, `CaseLead`, `CaseItems` | server | Numbered section with sticky side heading; items as rows or cells. |
| `DecisionCard` | server | `{ index, decision, why, tradeOff, result, labels }`. |
| `ScreenshotFrame` | client | `next/image` in a window frame. The button opens a native modal `<dialog>` (focus, Escape and backdrop handled). Optional scroll/pointer tilt, flat under reduced motion. |
| `LayersDiagram` | client | Spec from `utils/diagramBlocks` (`LayersDiagramSpec`); lights one layer while crossing the screen. |
| `CompareDiagram` | server | `CompareDiagramSpec`; last column is the chosen one. Marks are backed by visually hidden "Chosen" / "Not chosen" text. |
| `FlowBand` | client | `FlowDiagramSpec` plus `{ chapterId, label, eyebrow }`. Bone band; steps become columns at a 1000px container. The current step inverts and passed steps get a check; reduced motion marks all passed. Labels shrink together to fit. |

## Source to implementation

| Design source | Implementation |
| --- | --- |
| `kit/base.css` tokens, frame, nav, footer, band, chevrons | `app/globals.css`, `components/hairline/{Frame,SiteNavigation,SiteFooter,Band}` |
| `kit/base.js` scroll loop (`runPortal`) | `utils/motion/{scrollScheduler,useMotion,easedPointer,reducedMotion}` |
| `kit/fit.js` display-word spread | `components/hairline/DisplayWord` |
| `pages/home.html` | `features/home/*`, `components/Contact/*` |
| `pages/portfolio.html` | `features/portfolio/{PortfolioHero,PlatesField,PortfolioBand,StackWords,PortfolioWorks,OperatingModelScene,PortfolioContact}` |
| `kit/case.src.html` | `components/hairline/{ChapterRail,CaseSection,DecisionCard,FactsPanel,ScreenshotFrame,NextLinks}` |
| `kit/diagrams.css`, `kit/diagrams.js` | `components/hairline/{Diagram,LayersDiagram,CompareDiagram,FlowBand}` |

## Screenshots and pixel diff

The `screenshots/` folder has three kinds of capture, all taken with reduced motion:

- `*-reference.jpg` and `*-actual.jpg`: full-page reference and actual at 1440 and 390.
- `*-fold-ref-actual-diff.png`: the first screen, reference | actual | changed pixels in red.

Metrics are in `pixel-diff.json`:

| Page | Reference height | Actual height | First screen: pixels changed | First screen: coarse delta (1/8 scale) |
| --- | --- | --- | --- | --- |
| Home 1440 | 5933 | 6097 | 17.6% | 5.4% |
| Home 390 | 11079 | 11114 | 24.1% | 10.2% |
| Portfolio 1440 | 4591 | 5387 | 7.5% | 2.3% |
| Portfolio 390 | 7866 | 8617 | 13.5% | 4.4% |

Reading the numbers:

- Most changed pixels are anti-aliased text edges shifted by a few pixels. The causes are production nav links in place of the artifact's four, and production copy in place of artifact copy.
- The 390 references also carry the browser's default 8px body margin. The artifact files rely on their publish wrapper for the reset, so every hairline in the reference sits 8px further in.
- The coarse delta, which ignores text edges, is the better layout signal.
- Height differences come from longer production copy. The portfolio additionally renders the operating-model scene static (640px) under reduced motion; with motion it is 260vh, as designed.

Visual regression baselines for all six required viewports, plus no-JS at 1440, are in
`e2e/__screenshots__/` and checked by `pnpm test:e2e`.

## Tests

- **Jest** (`pnpm test`), with new specs covering:
  - `useMotion`: setup and teardown, no listener leaks, idle after settle, reduced-motion re-setup, failure fallback, route reset;
  - `createEasedPointer`;
  - `SiteNavigation`: links, `aria-current`, disclosure, Escape with focus return, closing on link choice and on route change;
  - `Ticker`, `DisplayWord`, `LinkRows` (new-tab labelling);
  - case-study parts: sections, facts, decisions, next links, chapter rail, screenshot dialog, layers, compare, flow under reduced motion;
  - contact form error-summary links;
  - the rewritten portfolio spec.
- **Playwright** (`pnpm build && pnpm test:e2e`) on both pages:
  - visual baselines at 1440x900, 1280x800, 768x1024, 390x844, 375x812 and 320x720, plus no-JS;
  - no console errors or hydration warnings through a full scroll;
  - one `h1` and the main landmark;
  - no horizontal scroll at any viewport;
  - CLS under 0.05;
  - zero animation frames once scrolling stops;
  - motion at rest under reduced motion;
  - content and navigation present without JavaScript;
  - every internal link and anchor resolves;
  - keyboard menu at 390;
  - the contact form posts the unchanged `{ name, email, message }` payload to `/api/contact` and links each error to its field.

## Performance delta

These are local production builds (`next start`). Each figure is the median of five loads at 1440x900, with transfer sizes as encoded on the wire.

| | Home main | Home branch | Portfolio main | Portfolio branch |
| --- | --- | --- | --- | --- |
| JS | 197.3 KB | 176.1 KB | 177.6 KB | 157.7 KB |
| CSS | 3.5 KB | 11.8 KB | 3.5 KB | 11.8 KB |
| Fonts | 0 | 264.3 KB | 0 | 264.3 KB |
| Total | 291.9 KB | 499.3 KB | 239.0 KB | 480.3 KB |
| LCP (local) | 40 ms | 68 ms | 24 ms | 56 ms |
| CLS | 0 | 0 | 0 | 0 |
| DOM nodes | 444 | 597 | 391 | 529 |

`main` currently ships no web fonts (it was stripped ahead of this redesign), so the font weight is
the cost of the design's Archivo and Geist Mono. JavaScript is about 20 KB smaller on both pages.

## Known deviations

- **Content.** Production copy is kept wherever the artifact had its own text. Remaining content differences:
  - the hero social links were dropped; the same links remain in Contact;
  - the per-tool "Open source page" link and the home writing tags were dropped;
  - the portfolio breadcrumbs, table of contents and profile strip were dropped; the JSON-LD stays;
  - the email row is kept in Contact;
  - form hints sit under the inputs;
  - the mono date labels use short months.
- **Navigation.** All five production links are kept. The artifact shows four at 390px; here they fold into the menu below 520px. The menu is a non-modal disclosure.
- **Footer.** Simplified to name, location, site and year.
- **Motion.** All idle time-based drift was removed: ticker drift and the time terms in the strata, plates and scene canvases. Everything moves only on scroll, resize or pointer, then stops. The portfolio scroll cue runs two iterations. The operating-model scene is only tall and sticky when it can animate.
- **Portfolio rows at 320–420px.** The index and arrow share the top line so long single-word names keep their full width instead of breaking mid-word.
- **Headings.** The portfolio `h1` is the bracketed eyebrow. Its brackets are hidden from assistive technology, so the heading reads "Portfolio".

## New display copy for sign-off

- **Home:**
  - display words "Ali / Pajand";
  - strata layer labels;
  - capability ticker: the five capability area names;
  - tooling ticker: "Deterministic rules", "Human review in charge", "CLIs · CI · MCP · editor plugins", "Checks you run, not assume";
  - About labels "Start / Scope / Strength / Leadership";
  - eyebrows "[ About ]" and "[ Contact ]";
  - counts "2 of 7 case studies", "4 of N tools" and "5 areas".
- **Navigation:** "Open to roles".
- **Portfolio:**
  - display words "Selected / Work" and the Montreal coordinates;
  - hero layer labels;
  - principle ticker;
  - "[ How to read this index ]" and "Ordered by how much each one shows";
  - quote "AI as acceleration, not authority." cited as "Operating principle";
  - group labels Lead / Supporting / Experiment;
  - operating-model heading and steps;
  - "[ Next step ]" and "Let’s talk".
