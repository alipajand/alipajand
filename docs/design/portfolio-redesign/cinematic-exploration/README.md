# Cinematic exploration: Section A–A

> **This exploration replaces the three P1 concepts in [#214](https://github.com/alipajand/alipajand/pull/214)** (A Editorial, B Interface Atlas, C Systems in Motion), which were rejected. None of them was used as a template. #214 is left unchanged and unmerged.
>
> Design artefact only. No production code, dependency, configuration, token or content changes. No production implementation is authorised.

**Proposition:** THE WORK BEHIND THE INTERFACE.

**Concept:** the portfolio is a drawing set. The name is cut by a section line, A–A, and the cut is already open: through it, the real LedgerGuard interface. Four beats follow, in 4.5 viewport heights on desktop and 3.9 on mobile:

- **A.** The cut reveals the interface.
- **B.** The anatomy: its five layers, which the reader can also pick from a list.
- **C.** The verification boundary: the same red cut as the product's rule, shown in the workspace design prototype.
- **D.** A match cut. The one shipped screenshot travels into the readable case study.

> **Status.** Revision 2. The Section A–A concept was accepted for further exploration. This prototype is **not approved as final**, and production implementation has not started.

> **Provenance.** Three materials, always labelled: **shipped product** (screenshots), **editorial diagrams** (paper sheets) and **design prototypes with fictional data** (dashed frames). No prototype is presented as the production UI, and no prototype interaction is claimed to reproduce production behaviour.

> **Dark only.** The prototype now uses the same dark-only palette as P2: light ink on a warm near-black paper, the interior on a deeper void. The stills and storyboards are recaptured in dark; the `before/` images keep the earlier light palette. See [02-concept.md](02-concept.md#palette).

> **Part of the P2 set.** These pages are LedgerGuard's sheet in the P2 drawing set ([`../p2-portability/`](../p2-portability/)). The logo goes to the P2 register; "Work" and "Back to the work" return to LedgerGuard in that register; the "other sheets" list and "Next sheet" go to the AlwaysGeeky and Emplifi sheets there. This prototype's own index page is the LedgerGuard scene; it no longer acts as a portfolio index. The pages keep their P1 type (Big Shoulders Display); P2.2 moved AlwaysGeeky and Emplifi to Instrument Serif, so the set's type is not yet consistent (see P2's 06).

![Storyboard, desktop](screenshots/storyboard-desktop.webp)

## Revision 2 deliverables

| #   | Deliverable                   | Where                                                                                                                                                                                |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Revised prototype             | [`prototype/`](prototype/): `index.html`, `ledgerguard.html`                                                                                                                         |
| 2   | First frame, before and after | [03-storyboard.md § The first frame](03-storyboard.md#the-first-frame), [`screenshots/before/`](screenshots/before/)                                                                 |
| 3   | Revised storyboard            | [03-storyboard.md](03-storyboard.md), [storyboard-desktop.webp](screenshots/storyboard-desktop.webp), [storyboard-mobile.webp](screenshots/storyboard-mobile.webp)                   |
| 4   | Updated motion timeline       | [04-motion-spec.md](04-motion-spec.md)                                                                                                                                               |
| 5   | Desktop recording             | [recordings/desktop-full.mp4](recordings/desktop-full.mp4), with beat clips 01–05 below                                                                                              |
| 6   | Mobile recording              | [recordings/mobile-full.mp4](recordings/mobile-full.mp4)                                                                                                                             |
| 7   | Reduced-motion demo           | [recordings/reduced-motion.mp4](recordings/reduced-motion.mp4)                                                                                                                       |
| 8   | Match-cut demo                | [recordings/04-match-cut.mp4](recordings/04-match-cut.mp4), [recordings/mobile-match-cut.mp4](recordings/mobile-match-cut.mp4); measured in [06](06-review.md#match-cut-measurement) |
| 9   | Failure-mode test results     | [06-review.md § Failure-mode and functional results](06-review.md#failure-mode-and-functional-results), [`capture/review-results.json`](capture/review-results.json)                 |
| 10  | Performance measurements      | [05-feasibility-and-performance.md § Measured cost](05-feasibility-and-performance.md#measured-cost-lab)                                                                             |
| 11  | Creative self-critique        | [06-review.md § Creative self-critique](06-review.md#creative-self-critique)                                                                                                         |

Research and the concept statement from revision 1 are unchanged: [01-research.md](01-research.md), [02-concept.md](02-concept.md).

### Clips from the desktop take

1. [01-cut-reveal.mp4](recordings/01-cut-reveal.mp4): the first frame, and beat A
2. [02-anatomy.mp4](recordings/02-anatomy.mp4): beat B, with one layer picked from the list and put back
3. [03-review-boundary.mp4](recordings/03-review-boundary.mp4): beat C; scrolling plays the workspace states and the tally
4. [04-match-cut.mp4](recordings/04-match-cut.mp4): beat D, the screenshot into the story's figure
5. [05-into-the-case-study.mp4](recordings/05-into-the-case-study.mp4): the story, the view transition into the case study, and back

## Run it locally

The prototype is static HTML, CSS and JS. GSAP 3.12.5 and ScrollTrigger load from cdnjs, and fonts from Google Fonts. No install is needed. Run these from this folder:

```bash
python3 -m http.server 4417 --directory prototype
```

Then open <http://localhost:4417/index.html>. The interactive workspace prototype is at <http://localhost:4417/workspace.html>; it loads React 18.3.1 and htm 3.1.1 from jsDelivr.

### Rebuild the pages from project data

`prototype/build.mjs` reads `data/projects.ts` and writes `index.html` and `ledgerguard.html`. It needs Node 23.6 or later, which strips TypeScript types without a flag.

```bash
node prototype/build.mjs
```

Then format the generated pages, which `pnpm format:check` covers:

```bash
pnpm exec prettier --write prototype
```

### Capture, review and record

The capture scripts use `playwright-core` and `axe-core`. **They are deliberately not project dependencies.** Install them anywhere outside the repo and point `NODE_PATH` and `CHROME_PATH` at them:

```bash
npm install --prefix /tmp/aa-tools playwright-core axe-core
```

The WebKit and Firefox checks in `review.mjs` need the browser builds that match a Playwright version. Point `ENGINES_NODE_PATH` at that version's `node_modules`. The review here used `playwright-core@1.63.0`, matching the installed WebKit 2359 and Firefox 1543.

```bash
NODE_PATH=/tmp/aa-tools/node_modules CHROME_PATH="/path/to/chrome" node capture/review.mjs
```

| Script                                                                         | Output                                                                                                                                                  |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `capture/review.mjs [out.json] [shotDir]`                                      | Functional review: axe, keyboard, layer list, workspace states, anchors, Back/Forward, fail-safes, motion choice, overflow; WebKit and Firefox captures |
| `capture/record.mjs recordings desktop\|mobile\|reduce`                        | Screencast → mp4 with ffmpeg (desktop also writes the five beat clips; desktop and mobile write their match cut)                                        |
| `capture/stills.mjs <dir>`                                                     | Storyboard stills per beat, desktop and mobile, and the static layout; WebP via `cwebp -q 82`                                                           |
| `capture/frames.mjs <dir> <w> <h> <full\|reduce> <positions…>`                 | Still frames at element ids, viewport multiples, or `ws-<fraction>` through the workspace states                                                        |
| `capture/prototype-states.mjs <prototype.html> <dir> <name>=<Label>:<value>,…` | Captures a design prototype's states by driving its review bar (run against `workspace.html`); WebP via `cwebp -q 80`                                   |
| `capture/perf.mjs`                                                             | Delivered bytes, main-thread time, frame pacing and `will-change` census, live and static, with CPU throttling                                          |

## Files

```
cinematic-exploration/
├─ README.md, 01–06 *.md           documentation
├─ prototype/
│  ├─ build.mjs                    page generator (reads data/projects.ts)
│  ├─ drawings.mjs                 editorial SVG diagrams for sheets LG-02 to LG-05
│  ├─ index.html, ledgerguard.html generated pages
│  ├─ styles.css                   all styles; tokens are local to the prototype
│  ├─ sequence.js                  motion toggle, workspace states, scroll timeline
│  ├─ case.js                      motion toggle on the case page
│  ├─ workspace.html               local copy of the Document Intelligence Workspace design prototype (v1.0.1, fictional data)
│  └─ media/                       ledgerguard-*: screenshots re-encoded from public/portfolio-media (unaltered)
│                                  proto-*: captures of the workspace and dashboard design prototypes (fictional data)
├─ capture/                        review, record, stills, frames, perf, static server
├─ recordings/                     mp4 captures and their timing marks
└─ screenshots/                    WebP stills and storyboard sheets
   ├─ before/                      the revision 1 first frames, for comparison
   └─ engines/                     WebKit captures from the review
```
