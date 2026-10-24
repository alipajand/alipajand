# P2 · Design-system portability

> Design artefact only. No production code, dependency, configuration, token or content changes. Nothing here is approved for production, and production implementation has not started. Branched from the reviewed head of [#215](https://github.com/alipajand/alipajand/pull/215) (`33c51a9`), which stays unmerged.

**The question:** can the Section A–A visual language carry the whole engineering portfolio, and not only LedgerGuard?

**The answer this branch proposes:** every project is a **sheet in one drawing set**. The set shares paper, type, three provenance materials, sheet codes, navigation and one motion contract. Each project gets **one drafting move and one ink**, about its own work:

- **LedgerGuard** keeps the section cut, in red. The red review boundary stays LedgerGuard's alone.
- **AlwaysGeeky** gets the detail callout, in blue. Its scene descends from a part of the shipped interface to the shared library, the Storybook contract and the CI gates.
- **Emplifi** gets the dimension line and the time axis, in ochre. Its scene has no screenshots and measures one chart update against the frame budget.

The **index** is a drawing register, not a card grid. Every row goes straight to its case study. The three featured rows also open a scene, which is always optional.

> **Provenance.** Shipped screenshots sit on dark plates. Editorial diagrams sit on vellum and say "illustrative data" or "schematic" where true. LedgerGuard's design prototypes keep their dashed frames and "fictional data" labels. Where there is nothing to show, the sheet shows an opening labelled "No screenshot in this portfolio". No Storybook screen, Emplifi interface or measured value is shown or implied. No percentage figure appears anywhere.

![AlwaysGeeky scene, desktop storyboard](screenshots/storyboard-ag.webp)

![Emplifi scene, desktop storyboard](screenshots/storyboard-em.webp)

## Deliverables

| #   | Deliverable                           | Where                                                                                                                                                                                                                                                                                    |
| --- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Portfolio index                       | [`prototype/index.html`](prototype/index.html); stills `screenshots/{desktop,mobile}-0*-index-*`                                                                                                                                                                                         |
| 2   | AlwaysGeeky scene                     | [`prototype/alwaysgeeky.html`](prototype/alwaysgeeky.html); beats in [03-scenes.md](03-scenes.md#alwaysgeeky--from-the-interface-to-the-component-system-under-it)                                                                                                                       |
| 3   | Emplifi scene                         | [`prototype/emplifi.html`](prototype/emplifi.html); beats in [03-scenes.md](03-scenes.md#emplifi--measure-the-update-not-the-data)                                                                                                                                                       |
| 4   | Shared design-system specification    | [01-design-system.md](01-design-system.md)                                                                                                                                                                                                                                               |
| 5   | Motion and transition specification   | [02-motion-grammar.md](02-motion-grammar.md)                                                                                                                                                                                                                                             |
| 6   | Desktop and mobile recordings         | [`recordings/desktop-full.mp4`](recordings/desktop-full.mp4), [`recordings/mobile-full.mp4`](recordings/mobile-full.mp4), and the clips below; phone storyboards for [AlwaysGeeky](screenshots/storyboard-mag.webp) and [Emplifi](screenshots/storyboard-mem.webp)                       |
| 7   | Reduced-motion presentation           | [`recordings/reduced-motion.mp4`](recordings/reduced-motion.mp4); stills `screenshots/*-reduced-*`                                                                                                                                                                                       |
| 8   | Compatibility and performance risk    | [04-compatibility-and-performance.md](04-compatibility-and-performance.md); LedgerGuard flat path in [`recordings/ledgerguard-flat-depth.mp4`](recordings/ledgerguard-flat-depth.mp4) and [`recordings/webkit-ledgerguard-flat-depth.mp4`](recordings/webkit-ledgerguard-flat-depth.mp4) |
| 9   | Creative comparison and self-critique | [06-comparison-and-critique.md](06-comparison-and-critique.md)                                                                                                                                                                                                                           |
| —   | Review results                        | [05-review.md](05-review.md), [`capture/review-results.json`](capture/review-results.json)                                                                                                                                                                                               |

### Clips

Desktop, 1440 × 900:

1. [01-index.mp4](recordings/01-index.mp4): the register, the key plan following the pointer, and a capability mark
2. [02-alwaysgeeky-scene.mp4](recordings/02-alwaysgeeky-scene.mp4): detail, assembly, contract and gates
3. [03-alwaysgeeky-match-cut.mp4](recordings/03-alwaysgeeky-match-cut.mp4): the marketplace screenshot into the case study's hero
4. [04-emplifi-scene.mp4](recordings/04-emplifi-scene.mp4): the webview, the frame timeline, composition, and before → after
5. [05-emplifi-match-cut.mp4](recordings/05-emplifi-match-cut.mp4): the webview drawing into the hero

Phone, 390 × 844: [mobile-index.mp4](recordings/mobile-index.mp4), [mobile-alwaysgeeky.mp4](recordings/mobile-alwaysgeeky.mp4), [mobile-emplifi.mp4](recordings/mobile-emplifi.mp4).

The recordings are headless Chromium, except the one marked WebKit, which is headless WebKit. **Neither is shipping Safari.** The cursor dot is added by the recorder for legibility and is not part of the prototype.

## What changed in the P1 prototype

P2 touches the P1 LedgerGuard prototype in [`../cinematic-exploration/prototype/`](../cinematic-exploration/prototype/) in two ways only:

- **Review captions**, as the design review asked: "0 of 13 terms confirmed. Review required.", "6 of 13 terms confirmed. 7 await review." and "13 of 13 terms confirmed. Review complete.". Each is marked "Prototype state · fictional data".
- **A flat depth path.** Chromium-based browsers keep the 3D anatomy. Every other engine gets a non-3D "drawn section" with no 3D transforms. `?depth=flat` and `?depth=3d` force either path. The WebKit 3D flattening is still recorded as an **unresolved shipping blocker** (see 04).

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

`capture/` holds the scripts that produced the evidence: `review.mjs` (05), `record.mjs` (the recordings), `stills.mjs` (the screenshots) and `perf.mjs` (04). They need `playwright-core` and `axe-core` on `NODE_PATH`, a Chromium build at `CHROME_PATH` and ffmpeg on `PATH`. WebKit runs need a Playwright install that includes WebKit, on `ENGINES_NODE_PATH`. None of these are project dependencies, and none were added to `package.json`.
