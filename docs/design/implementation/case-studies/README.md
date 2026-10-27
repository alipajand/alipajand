# Case studies: reference vs actual

Every dedicated case study, captured from the design artifact (`docs/design/pages/case-<slug>.html`,
opened from `file://`) and from the production build (`/portfolio/<slug>`) at 1440x900 and 390x844.
Both sides run with reduced motion, every lazy image forced to load, full page.

The artifact pages keep the browser's default 8px body margin when opened from `file://`. The
captures remove it (`body { margin: 0 }`) so both sides lay out at the same width; without that,
every line of text wraps differently and the comparison measures the margin, not the page.

## Files

| File | Contents |
| --- | --- |
| `<slug>-<w>-fold-ref-actual-diff.png` | First screen: reference, actual, and the actual faded with changed pixels in red (halved at 1440). |
| `<slug>-<w>-reference.jpg` / `-actual.jpg` | Full pages (50% at 1440, 100% at 390). |
| `pixel-diff.json` | Page heights, % of first-screen pixels that changed (channel delta > 32), and a coarse 1/16-scale mean delta. |

## Results

| Route | 1440 height ref / actual | 1440 first screen changed | 390 height ref / actual | 390 first screen changed |
| --- | --- | --- | --- | --- |
| ledgerguard | 7137 / 7148 | 4.47% | 11786 / 11853 | 2.26% |
| alwaysgeeky | 6715 / 6726 | 2.21% | 11563 / 11626 | 1.04% |
| emplifi | 5145 / 5159 | 1.95% | 8893 / 8956 | 2.81% |
| agent-tooling | 5413 / 5388 | 1.71% | 10270 / 10318 | 1.32% |
| tallyfolio | 6443 / 6455 | 2.54% | 10748 / 10791 | 1.13% |
| controltech | 4567 / 4578 | 1.47% | 7971 / 8034 | 1.56% |
| mapbylaw | 5895 / 5881 | 1.58% | 9876 / 9943 | 1.03% |

## Known differences

- **Navigation and footer** come from the shared shell: production links ("Portfolio", "Principles"),
  the menu disclosure below 520px, and the footer's motion pause row (about 47px of the extra height
  at 390).
- **Breadcrumb** reads "Case studies" (production breadcrumb data) where the artifact says "Portfolio".
- **Screenshots.** The artifact uses design-prototype images and forces every screenshot to a
  1728:1084 crop. Production uses the real screenshots at their own ratios (redacted copies for the
  LedgerGuard and MapBylaw dashboards), so the LedgerGuard hero and the evidence figures differ in
  content and, for the TallyFolio landing and MapBylaw dashboard, in height.
- **Chapter rail** marks the current chapter under reduced motion too (an `aria-current`
  affordance); the artifact's reduced-motion branch never marks one.
- **Agent tooling** has no live link, so the empty link box the artifact draws is not rendered.
- **Live links** open in a new tab and say so, as on the current site; the artifact opens them in
  place.
