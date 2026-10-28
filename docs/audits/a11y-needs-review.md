# axe "needs review" contrast: human review

axe's `color-contrast` rule leaves text as "needs review" when it cannot work out what is behind it. `e2e/a11y.e2e.ts` records these results but does not fail on them. This file reviews each one: it groups the results, measures them from pixels, and gives a verdict for each group.

Measured on 2026-10-27 on `main` at 97651be plus #290, using a production build with the e2e clock pinned. Engines: Chromium and Playwright WebKit. Playwright WebKit is not Safari, and these are emulated viewports, not real devices.

## What was scanned

Every sitemap route plus the 404 page, at 390×844 and 1440×900, in both engines. At 390px the scan also covers the open menu, the open screenshot dialog, the open launch contents, the filtered writing list and the contact form with errors. This is the same set of scans as `e2e/a11y.e2e.ts`.

That gives 1,862 `color-contrast` needs-review nodes in total, the same count #285 recorded. axe gives a reason for each one:

| axe reason             | Nodes | What it means here                                                                       |
| ---------------------- | ----: | ---------------------------------------------------------------------------------------- |
| `pseudoContent`        | 1,112 | A `::before` or `::after` (hover underlays, index brackets) sits in the background stack |
| `nonBmp`               |   336 | The text is a symbol only (the ✓ and × marks in comparison diagrams)                     |
| `elmPartiallyObscured` |   234 | A sticky rail or a scroll container clips the text                                       |
| `equalRatio`           |    68 | The fill is transparent (outlined numerals), so axe compares the background with itself  |
| `imgNode`              |    58 | An image or SVG sits under the text (hero image, contribution calendar, section art)     |
| `bgGradient`           |    36 | A gradient background (the "upcoming" row on /writing)                                   |
| `bgOverlap`            |    18 | Another element overlaps the text (the rotated stack words and the intro on /portfolio)  |

axe never reads canvas pixels, so text drawn over a `<canvas>` passes without anyone looking at it. This review adds that text (102 nodes on /, /portfolio, /writing, /open-source, /engineering-principles and /now). It also adds the scroll-driven tickers and the Agent Readiness Doctor launch scene in the middle of a step change.

## How it was measured

For each node:

1. Scroll it to the centre of the viewport and let transitions finish, with the pointer parked at the top-left corner.
2. Screenshot the text box at 2× device pixels.
3. Make only that element's own glyphs transparent (colour, fill, stroke and shadow), then screenshot the same box again. The second shot is the real backdrop.
4. Compare the computed text colour (alpha and ancestor opacity composited, the stroke colour for outlined text, the fill for SVG text) with every backdrop pixel under the glyphs, and take the 5th percentile, which is the lowest-contrast 5%. As a cross-check, the glyph-core pixels of shot 2 are compared with shot 3.

The pass mark is WCAG 1.4.3 AA: 4.5:1, or 3:1 for text that is at least 24px, or at least 18.66px and bold.

The full set was sampled at up to four nodes per group, engine and width (386 nodes), and all the interactive states again at up to six (80 nodes). `e2e/contrast-pixels.e2e.ts` keeps the same measurement as a regression test.

**Limitations.**

- Pixels come from the engine's own rasteriser, with no display gamma or colour management, so a real screen can differ slightly.
- Antialiasing lowers the glyph-core number for text of 12px and under. That is why the verdicts use the computed colour against the backdrop pixels.
- A mid-transition frame is measured only where it is noted.

Contact sheets: [needs-review-groups.jpg](evidence/a11y/needs-review-groups.jpg) and [canvas-ticker-transition.jpg](evidence/a11y/canvas-ticker-transition.jpg).

## Verdicts by group

Lowest value measured across both engines and both widths. Grey `#a3a39c` on ink `#0f0f0e` is 7.56:1, and line `#ecece6` on ink is 16.17:1.

| Component (reason)                                        | Nodes | Routes                                | Lowest measured                        | Verdict | Reason / limitation                                                                                                                                                                       |
| --------------------------------------------------------- | ----: | ------------------------------------- | -------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WritingPostToc index (pseudoContent)                      |   576 | articles, open contents               | 7.56                                   | pass    | Solid ink behind the 11px grey index. The pseudo-element is the active-row marker.                                                                                                        |
| CompareDiagram ✓ / × (nonBmp)                             |   336 | 12 articles, 7 case studies           | 16.17                                  | pass    | `aria-hidden`; a visually hidden "Chosen:" or "Not chosen:" and the column header carry the meaning. Measured anyway.                                                                     |
| Tags (pseudoContent)                                      |   236 | /, /portfolio, menu, form errors      | 11.76                                  | pass    | Pill text on its own fill.                                                                                                                                                                |
| ChapterRail link and index (elmPartiallyObscured)         |   200 | 7 case studies                        | 7.56                                   | pass    | The rail scrolls sideways, so its edge clips some items. The visible glyphs sit on ink.                                                                                                   |
| PortfolioWorks role, summary, index, link, title          |   168 | /portfolio                            | 7.56                                   | pass    | The hover underlay is a pseudo-element, transparent at rest. The hover state (ink on line, `#4b4b46` on line) is 7.37:1 or more from tokens.                                              |
| HomeSelectedWork label, support, case, link, go           |    96 | /, menu, form errors                  | 7.56                                   | pass    | As above.                                                                                                                                                                                 |
| OpenSourceActivity month and day labels (imgNode)         |    42 | /open-source                          | 7.56 (5.76 at the box edge)            | pass    | 9px SVG text next to calendar cells; the edge value comes from a neighbouring cell. Cell shading ranges from 1.7:1 to 16:1, but a screen-reader table carries the data, so 1.4.11 is met. |
| Outlined numerals (equalRatio)                            |    68 | /engineering-principles, /open-source | 16.17 (stroke)                         | pass    | `aria-hidden` and decorative. The 1px stroke uses the line colour.                                                                                                                        |
| WritingPostProse table cells (elmPartiallyObscured)       |    34 | 4 articles                            | 16.17                                  | pass    | Clipped by the table's own scroll region (keyboard reachable, see `e2e/scroll-regions.e2e.ts`).                                                                                           |
| PortfolioBand stack words (bgOverlap)                     |    16 | /portfolio                            | 13.41 ink, 4.63 grey `#5d5d58` on bone | pass    | Large (44px or more), `aria-hidden`, rotated. The bounding box takes in neighbouring words, so the glyph-masked value is the one that counts.                                             |
| PortfolioBand intro (bgOverlap)                           |     2 | /portfolio                            | 6.13                                   | pass    | `#4b4b46` on bone.                                                                                                                                                                        |
| WritingIndexFeatured mono, title, body, tagline, go       |    36 | /writing, filtered                    | 7.56                                   | pass    | Hover underlay pseudo-element.                                                                                                                                                            |
| WritingIndexPosts "upcoming" row (bgGradient)             |    36 | /writing, filtered                    | 7.56                                   | pass    | The gradient is a faint wash of the ink. Every pixel under the glyphs keeps 7.56:1 or more.                                                                                               |
| Operating model head, hero coordinates, heading (imgNode) |    16 | /portfolio                            | 7.56                                   | pass    | The art sits beside the text, not under it; the 1.22 minimum is a single pixel of artwork at the box edge.                                                                                |

**Canvas and ticker text**, which axe does not report:

| Surface                                                                              | Lowest measured                  | Verdict                             | Reason / limitation                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------ | -------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Text over canvases on /, /portfolio, /writing, /open-source, /engineering-principles | 7.56                             | pass                                | Each canvas draws thin lines behind captions. The 5th percentile under the glyphs never drops below the grey-on-ink value. Measured at rest; the canvases only redraw while the page scrolls.                                                   |
| /now week ruler labels (drawn on the canvas)                                         | 6.30                             | pass                                | Measured from screenshot pixels (glyph `#949490` on ink). The DOM `Q1`–`Q4` labels are hidden while the canvas runs, so the DOM measurement records them as having no visible glyphs.                                                           |
| Tickers on /, /portfolio, /engineering-principles, /open-source                      | 16.17 (5.76 at the clipped edge) | pass                                | Plain line-coloured text on ink. It moves only while the page scrolls, never on its own.                                                                                                                                                        |
| Agent Readiness Doctor launch steps, mid-change                                      | 1.04 at 100ms, 3.10 at 200ms     | **can't determine** (see A11Y-NR-1) | Both steady states pass (16.17 and 7.56). Each 400ms step change cross-fades an inverted panel, so in both engines the outgoing or incoming step is below 4.5:1 from about 60ms to 230ms. WCAG gives no rule for intermediate animation frames. |

During the review, a text box measured mid-way through its hover transition (a list row that slid under the pointer after the filter click) read as low as 1.24:1. With the pointer moved away, the same nodes measured 7.56:1 or more in every state. The regression test parks the pointer for this reason.

## Open items

- **A11Y-NR-1 (P3, owner decision).** The launch scene's 0.4s cross-fade between an inverted current step and the muted steps passes through low contrast for about 170ms of each change. The portfolio operating model (#269) avoids this by never inverting. Any cross-fade between inverted states has frames like this, so a fix is a design change. One option is to mark the current step the way the operating model does, with no inversion. The other is to accept transitional frames as outside 1.4.3. No change has been made: the launch scene belongs to the history track and only for DM-02.

## How to rerun

```sh
pnpm build
E2E_PORT=3521 RESPONSIVE_EVIDENCE=/tmp/a11y pnpm exec playwright test e2e/contrast-pixels.e2e.ts
```

Each route writes `contrast-pixels__<engine>__<width>__<route>.json` with every measured node, its reason and its ratio.
