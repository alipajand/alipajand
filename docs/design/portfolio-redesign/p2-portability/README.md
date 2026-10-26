# P2 · Design-system portability

> Design artefact only. No production code, dependency, configuration, token or content changes. Nothing here is approved for production, and production implementation has not started. Branched from the reviewed head of [#215](https://github.com/alipajand/alipajand/pull/215) (`33c51a9`), which stays unmerged.

**The question:** can the Section A–A visual language carry the whole engineering portfolio, and not only LedgerGuard?

**P2.1** was the revision after the first design review on this PR: a new first frame and mobile register, corrected Emplifi drawings, a calmer AlwaysGeeky contract beat, fixed match cuts and a flat LedgerGuard default.

**P2.2** (this revision) answers the second review:

- **One connected set.** LedgerGuard's P1 pages now link back into this register, and every return link lands on its project in the condensed register (`index.html#project-<slug>`). Case studies link to each other in a loop. Nothing sends a featured project to production.
- **An opening without layout shift.** The same section-cut opening and condensation, rebuilt on a fixed-height stage with transforms and clipping. Lab CLS after a full scroll fell from 0.117 to 0.004 on desktop and from 0.378 to 0.002 at phone width (both at 4× CPU slowdown).
- **Phones recomposed.** No stage window below 900 px. Each step is heading, text and one phone sheet that draws in as it arrives, with every label at 12 px or more. On the index the case-study link leads each bay; Scene is a small secondary chip on the picture's corner.
- **Type and framing.** Instrument Serif in sentence case replaces the condensed uppercase display face; mono is kept for codes, dates and materials only, and redundant kickers are gone. Screenshots are mounted, diagrams are drawing sheets with corner ticks, prototypes stay dashed.

The self-critique (06) says what is still weak.

**The proposal:** every project is a **sheet in one drawing set**. The set shares paper, type, three provenance materials, sheet codes, navigation and one motion contract. Each project gets **one drafting move and one ink**, about its own work:

- **LedgerGuard** keeps the section cut, in red. The red review boundary stays LedgerGuard's alone.
- **AlwaysGeeky** gets the detail callout, in blue. Its scene descends from a part of the shipped (now historical) Voxies marketplace to the shared library, then along one line through the Storybook contract to CI enforcement.
- **Emplifi** gets the probe and the reference ruler, in ochre. Its scene has no screenshots and shows technique, not magnitude: where the render path was investigated, and how the work was composed to fit a frame. No drawing shows a measured or comparative value.

**Dark only.** The prototype uses a single dark palette: light ink on a warm near-black paper, screenshots on a deeper void. There is no light theme. The tokens and contrast ratios are in 01. The P1 LedgerGuard pages under `cinematic-exploration/` use the same dark palette (since `3b0ddb3`); they keep their P1 type.

The **index** opens on a section through the three featured projects, cut on the A–A line: the interface above, the work behind it below. With motion on, it condenses, pinned, into the register's top row. Every one of the seven projects is one link from the index; scenes are always optional.

> **Current and historical images.** Everything directly in [`screenshots/`](screenshots/) and [`recordings/`](recordings/) is a **current P2.2 capture**. Earlier states live only under `history/`: [`screenshots/history/p2-light/`](screenshots/history/p2-light/) and [`recordings/history/p2-light/`](recordings/history/p2-light/) (P2, light palette), [`screenshots/history/p2.1-compare/`](screenshots/history/p2.1-compare/) (the P2 → P2.1 side-by-sides, light palette) and [`screenshots/history/p2.1-dark/`](screenshots/history/p2.1-dark/) (a few P2.1 dark frames, for comparison with this revision). [`capture/perf-results-p2.1.jsonl`](capture/perf-results-p2.1.jsonl) is the P2.1 performance run.

> **Provenance.** Shipped screenshots sit on dark plates. Editorial diagrams say "illustrative data" or "schematic" where true. LedgerGuard's design prototypes keep their dashed frames and "fictional data" labels. On the index, the cut band names both materials for every bay. No Storybook screen, Emplifi interface or measured value is shown or implied. No percentage figure appears anywhere.

![Index first frame, desktop, after](screenshots/desktop-00-index-first-screen.webp)

![AlwaysGeeky scene, desktop storyboard](screenshots/storyboard-ag.webp)

![Emplifi scene, desktop storyboard](screenshots/storyboard-em.webp)

## Deliverables

| #   | Deliverable                  | Where                                                                                                                                                                                                                                                                                                 |
| --- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Revised interactive index    | [`prototype/index.html`](prototype/index.html), [`prototype/opening.css`](prototype/opening.css), [`prototype/register.js`](prototype/register.js); spec in [01](01-design-system.md#the-portfolio-index-a-section-through-the-work) and [02](02-motion-grammar.md#the-opening-a-pinned-condensation) |
| 2   | Updated mobile register      | Stills `screenshots/mobile-0*-index-*`, full page `screenshots/mobile-05-index-full.webp`                                                                                                                                                                                                             |
| 3   | Corrected Emplifi sequence   | [`prototype/emplifi.html`](prototype/emplifi.html); beats in [03](03-scenes.md#emplifi--technique-not-magnitude)                                                                                                                                                                                      |
| 4   | Refined AlwaysGeeky sequence | [`prototype/alwaysgeeky.html`](prototype/alwaysgeeky.html); beats in [03](03-scenes.md#alwaysgeeky--from-the-interface-to-the-component-system-under-it)                                                                                                                                              |
| 5   | Corrected match cuts         | [02](02-motion-grammar.md#the-match-cut-precisely); frames reviewed in [05](05-review.md)                                                                                                                                                                                                             |
| 6   | Screenshots                  | Current: [`screenshots/`](screenshots/). Historical: [`screenshots/history/`](screenshots/history/) (see the note above)                                                                                                                                                                              |
| 7   | Desktop motion recordings    | [`recordings/desktop-full.mp4`](recordings/desktop-full.mp4) and clips 01–06 below; historical: [`recordings/history/p2-light/`](recordings/history/p2-light/)                                                                                                                                        |
| 8   | Mobile motion recordings     | [`recordings/mobile-full.mp4`](recordings/mobile-full.mp4), `mobile-index`, `mobile-alwaysgeeky`, `mobile-emplifi`, `mobile-case-to-register`                                                                                                                                                         |
| 9   | Reduced-motion captures      | [`recordings/reduced-motion.mp4`](recordings/reduced-motion.mp4); stills `screenshots/*-reduced-*`                                                                                                                                                                                                    |
| 10  | Updated design-system docs   | [01](01-design-system.md), [02](02-motion-grammar.md), [03](03-scenes.md), [04](04-compatibility-and-performance.md)                                                                                                                                                                                  |
| 11  | Updated review and critique  | [05](05-review.md), [06](06-comparison-and-critique.md), [`capture/review-results.json`](capture/review-results.json)                                                                                                                                                                                 |

### Clips

Desktop, 1440 × 900:

1. [01-index.mp4](recordings/01-index.mp4): the first frame, the pinned condensation into the register, bay focus, supporting work and a discipline mark, then AlwaysGeeky's Scene link
2. [02-alwaysgeeky-scene.mp4](recordings/02-alwaysgeeky-scene.mp4): detail, assembly, then one move down to the contract and enforcement
3. [03-alwaysgeeky-match-cut.mp4](recordings/03-alwaysgeeky-match-cut.mp4): the marketplace screenshot into the case study's hero
4. [04-emplifi-scene.mp4](recordings/04-emplifi-scene.mp4): the webview, the render path, composition, the frame budget
5. [05-emplifi-match-cut.mp4](recordings/05-emplifi-match-cut.mp4): the webview drawing into the hero, clear of the heading
6. [06-case-to-register.mp4](recordings/06-case-to-register.mp4): AlwaysGeeky's "Next sheet" into Emplifi's case study, "All work" back to Emplifi in the condensed register, then Emplifi's Scene link

Phone, 390 × 844: [mobile-index.mp4](recordings/mobile-index.mp4), [mobile-alwaysgeeky.mp4](recordings/mobile-alwaysgeeky.mp4), [mobile-emplifi.mp4](recordings/mobile-emplifi.mp4), [mobile-case-to-register.mp4](recordings/mobile-case-to-register.mp4).

The recordings are headless Chromium, except the one marked WebKit, which is headless WebKit. **Neither is shipping Safari.** The cursor dot is added by the recorder for legibility and is not part of the prototype.

## What changed in the P1 prototype

P2 touches the P1 LedgerGuard prototype in [`../cinematic-exploration/prototype/`](../cinematic-exploration/prototype/) in these ways only:

- **Review captions**, as the design review asked: "0 of 13 terms confirmed. Review required.", "6 of 13 terms confirmed. 7 await review." and "13 of 13 terms confirmed. Review complete.". Each is marked "Prototype state · fictional data".
- **Flat depth by default.** Every engine gets the non-3D "drawn section". The 3D anatomy runs only with `?depth=3d`, for review. No user-agent API is read. The 3D path stays an **unresolved shipping blocker** (see 04).
- **Dark palette** (P2.1), the same tokens as P2.
- **Navigation into this register** (P2.2). The logo goes to the register; "Work" and "Back to the work" go to LedgerGuard in the register; the scene and case study link to each other; the "other sheets" list and a new "Next sheet" go to the AlwaysGeeky and Emplifi sheets here, not to production. A skipped view transition no longer leaves an unhandled rejection.

## Run it locally

The pages are static HTML, CSS and JS. GSAP 3.12.5 and ScrollTrigger load from cdnjs, and fonts load from Google Fonts. Serve the `portfolio-redesign` folder, so that P2 can link to the P1 LedgerGuard pages:

```bash
python3 -m http.server 4417 --directory docs/design/portfolio-redesign
```

Then open <http://localhost:4417/p2-portability/prototype/index.html>.

### Rebuild the pages from project data

`prototype/build.mjs` reads `data/projects.ts` and writes the three pages. It needs Node 23.6 or later, which strips TypeScript types without a flag.

```bash
node --no-warnings docs/design/portfolio-redesign/p2-portability/prototype/build.mjs
```

### Capture scripts

`capture/` holds the scripts that produced the evidence: `review.mjs` (05), `journey.mjs` (the navigation walk in 05), `record.mjs` (the recordings), `stills.mjs` (the screenshots) and `perf.mjs` (04). They need `playwright-core` and `axe-core` on `NODE_PATH`, a Chromium build at `CHROME_PATH` and ffmpeg on `PATH`. WebKit runs need a Playwright install that includes WebKit, on `ENGINES_NODE_PATH`. None of these are project dependencies, and none were added to `package.json`.
