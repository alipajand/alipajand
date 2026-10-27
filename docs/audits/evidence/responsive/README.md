# Responsive gate evidence (emulated)

Everything here comes from the Playwright gate (`e2e/responsive.e2e.ts`, `e2e/interactions.e2e.ts`,
`e2e/a11y.e2e.ts`, `e2e/vitals.e2e.ts`, `e2e/smoke.e2e.ts`) running in **emulated** Chromium
(Playwright 1.64 device emulation, device scale 1) against a production build. It is not
real-device evidence: Safari on iOS, Chrome on Android, real touch, dynamic toolbars, safe-area
insets and field Core Web Vitals are still open and need a check on hardware.

Run on macOS against `main` at 14fa46d. The new specs add 406 tests; the full suite (929 tests, macOS visual baselines included) passes.

## Matrix

- **Routes (18):** `/`, `/portfolio`, all 7 case studies, `/writing`, four articles
  (`agent-readiness-doctor`, `agent-instructions-are-code` with the comparison diagram,
  `why-i-automate-code-review-with-mcp`, `mapbylaw-ai-recommendations`), `/open-source`,
  `/engineering-principles`, `/now` and a 404.
- **Viewports (13):** phones 320x568, 375x812, 390x844, 430x932, landscape 568x320 and 844x390;
  tablets 768x1024, 820x1180, 1024x768, 1180x820; desktops 1280x800, 1440x900, 1920x1080. Plus a
  390x844 to 844x390 rotation with the menu open.
- **Per route and viewport (234 layouts):** sideways scroll, elements past the viewport edge, text
  clipped inside its box, the display line clipped at rest, WCAG 2.5.8 target size (24px or the
  spacing exception), the shell's real hit areas (probed with `elementFromPoint`), broken, cropped
  or spilling images.
- **Per family:** focus ring on the first 18 keyboard stops; scroll-linked motion plays, looping
  motion stops when paused, and nothing moves under reduced motion; LCP, CLS, INP (scripted taps,
  clicks and keys) and long tasks at 390 and 1440.
- **axe-core 4.13.0:** every route at 390 and 1440, plus the open menu, an open screenshot dialog,
  the open launch contents, a filtered writing list and the contact form with errors.
- **Interactions on touch emulation:** screenshot dialogs on the 4 case studies that have
  screenshots at 390, 768, 1024 and 1440 (fit, focus kept inside, Escape and focus return, close
  button, backdrop); article contents (reader rail and launch disclosure); the case-study chapter
  rail; writing filters; sticky elements (chapter rail, contents, nav) pinning at their offset and
  not covered.
- **Shell:** menu open/close, focus order, Escape and focus return, close on link and on rotation,
  44px menu targets; Back/Forward through home, portfolio and a case study; contact form error,
  failure and success states at 320, 390, 768 and 1440.
- **Smoke:** every sitemap page answers 200 with one `h1`, a `main` landmark, a title and no page
  errors; an unknown case study answers 404; the feed, sitemap, robots, llms, manifest and image
  routes answer with the right type.
- **Recordings:** Playwright `recordVideo` of a slow wheel scroll through home, LedgerGuard,
  "Agent instructions are code" and `/open-source` at 390 and 1440, reviewed through eight sampled frames each.
  The videos are not committed (11 MB); `sheet-scroll-recordings.jpg` holds eight frames of each.
- **Design artifacts:** the first screen of each pinned page in `docs/design/pages` next to the
  build at 390 and 1440.

## Results

- All 234 route-viewport layouts: no sideways scroll, nothing past the edge, no clipped text or
  display word, no target under 24px without spacing, no covered header or footer control, no
  broken or cropped image.
- Focus is visible on every measured stop.
- Local vitals (no throttling, so a floor and not field data): LCP 28–88 ms, CLS 0–0.038 (404 at
  1440), INP 32–64 ms. There were no long tasks during page load or during any of the 8 recorded
  scrolls.
- Reduced motion leaves every scroll-linked transform unset, runs no looping animation, and
  requests no frames once scrolling settles.
- The recordings show the sticky chapter rail, the contents and the nav pinning cleanly. Scenes
  play in order, and no sampled frame shows a jump or a blank screen.
- Every family matches its design artifact on the first screen. Differences are copy (the reader
  artifact uses a sample article) and the artifact's 404 showing a hover outline on the lower
  block.

| ID    | Sev | Finding                                                                                                                                                                                                                             | Evidence                                                                                                                                                                                        | Disposition                                                                                                                                                            |
| ----- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RG-A1 | P2  | Text in the scroll scenes that is not the current step is dimmed to 38% opacity. Affected: the portfolio operating model step labels, titles and copy, and the ARD launch steps. Contrast falls below 4.5:1 while a step is dimmed. | axe `color-contrast` (serious) on `portfolio` at 390 and 1440 and on the open launch contents; `OperatingModelScene.module.css` `.steps:has([data-on]) .step:not([data-on]) { opacity: 0.38 }`. | Needs a design decision: raise the dimmed opacity until mute text reaches 4.5:1, or dim only the rule and step number. Listed as a known finding in `e2e/a11y.e2e.ts`. |
| RG-A2 | P2  | Wide code blocks in articles and the enlarged screenshot scroll sideways but cannot take keyboard focus. Chromium and Firefox focus such scrollers on their own; Safari does not.                                                   | axe `scrollable-region-focusable` (serious) on `pre` at 390 in two articles and on `.dialogImage` in the open dialog.                                                                           | Fix proposed in a separate draft PR (`tabindex="0"` with a label). It changes focus order, so it needs owner review.                                                   |
| RG-A3 | P2  | Contact error summary links are 15px tall on a 21px pitch, so their 24px target circles overlap.                                                                                                                                    | axe `target-size` (serious); measured 102x15, 100x15 and 131x15 at 390.                                                                                                                         | Fix proposed in a separate draft PR (CSS only).                                                                                                                        |
| RG-D1 | P3  | The page behind an open screenshot dialog still scrolls with the wheel. Native `<dialog>` does not lock scroll.                                                                                                                     | `summary.json` `dialogs[].backgroundScrolled`: 13 of 16.                                                                                                                                        | Owner decision. Behaviour matches the platform, and focus never leaves the dialog.                                                                                     |
| RG-D2 | P3  | Emplifi, ControlTech and Agent tooling have no screenshots, so they have no dialog to test.                                                                                                                                         | 0 `aria-haspopup="dialog"` openers.                                                                                                                                                             | Recorded. The spec fails if the list of case studies with screenshots changes, so new ones get covered.                                                                |
| RG-B1 | P3  | Main's own case-study and writing visual tests failed after #247 (footer 1px shorter). Diffs were confined to the last 64–93px.                                                                                                     | 11 macOS baselines.                                                                                                                                                                             | Re-recorded on main. Footer changes (#244) will churn baselines again.                                                                                                 |
| R5    | P3  | "Book a call" in the header is 28px tall. That passes 2.5.8 but is under 44px on touch tablets (1024x768, 1180x820).                                                                                                                | Hit probe 121x28 at the 13 widths that show it.                                                                                                                                                 | Needs owner decision. Growing it would overlap the "Open to roles" label.                                                                                              |
| R6    | P3  | The site menu is a non-modal disclosure by design: no focus trap or scroll lock.                                                                                                                                                    | Menu tests.                                                                                                                                                                                     | No action. Making it modal changes ARIA wiring and needs approval.                                                                                                     |
| R7    | P3  | The footer year is rendered from the clock, so full-page baselines will differ on 1 January.                                                                                                                                        | `SiteFooter.tsx` `new Date().getFullYear()`.                                                                                                                                                    | Needs owner decision: mask the year in screenshots, or re-render each January.                                                                                         |
| R4    | —   | Round 1: "On this page" links were 17px tall.                                                                                                                                                                                       | —                                                                                                                                                                                               | Resolved by the redesigned writing and case-study layouts. The waiver is gone and every layout passes 2.5.8.                                                           |
| R1–R3 | —   | Round 1: header clicks were swallowed on the 404, and the header and footer hit areas were small.                                                                                                                                   | —                                                                                                                                                                                               | Fixed by #251 and #252, and kept under test.                                                                                                                           |

## Files

- `sheet-<route>.jpg`: top-of-page captures at all 13 viewports for each of the 18 routes.
- `sheet-shell-states.jpg`: the open menu at four phone sizes, the rotation, and contact form
  errors and success at four widths.
- `sheet-dialogs.jpg`, `sheet-contents-filters.jpg`: open screenshot dialogs, article contents and
  filtered writing on touch emulation.
- `sheet-scroll-recordings.jpg`: frames from the eight scroll recordings.
- `sheet-design-compare-390.jpg`, `sheet-design-compare-1440.jpg`: design artifacts beside the
  build.
- `summary.json`: the numbers behind the table.

To regenerate:

```bash
pnpm build && pnpm start -p 3000 &
RESPONSIVE_EVIDENCE=/tmp/gate pnpm exec playwright test e2e/responsive.e2e.ts \
  e2e/interactions.e2e.ts e2e/a11y.e2e.ts e2e/vitals.e2e.ts
node e2e/responsive-sheet.mjs /tmp/gate docs/audits/evidence/responsive --base http://localhost:3000
```
