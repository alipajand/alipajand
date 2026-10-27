# Responsive gate evidence (emulated)

Everything here comes from `e2e/responsive.e2e.ts` running in **emulated** Chromium (Playwright
1.64 device emulation, device scale 1) against a production build. It is not real-device
evidence: Safari on iOS, Chrome on Android, real touch, dynamic toolbars and safe-area insets are
still open and need a check on hardware.

Run on macOS against `main` at 49f5e2e plus this branch.

## Matrix

- **Routes (9):** `/`, `/portfolio`, `/portfolio/ledgerguard` (case study), `/writing`,
  `/writing/agent-readiness-doctor` (article), `/open-source`, `/engineering-principles`, `/now`, a 404.
- **Viewports (13):** phones 320x568, 375x812, 390x844, 430x932, landscape 568x320 and 844x390;
  tablets 768x1024, 820x1180, 1024x768, 1180x820; desktops 1280x800, 1440x900, 1920x1080. Plus a
  390x844 to 844x390 rotation with the menu open.
- **Per route and viewport:** sideways scroll, elements past the viewport edge, text clipped inside
  its box, the display line clipped at rest, WCAG 2.5.8 target size (24px or the spacing
  exception), the shell's real hit areas (probed with `elementFromPoint`), broken, cropped or
  spilling images.
- **Per route:** focus ring on the first 18 keyboard stops, CLS and `longtask` entries through a full
  scroll at 390 and 1440, scroll-linked transforms under reduced motion, one `h1` and no page errors.
- **Shell:** menu open/close, focus order, Escape and focus return, close on link and on rotation,
  44px menu targets; Back/Forward through home, portfolio and a case study; contact form error,
  failure and success states at 320, 390, 768 and 1440.

## Results

All 174 responsive checks pass. Every one of the 117 route-viewport layouts has no sideways scroll, no
element past the edge, no clipped text and no clipped display word. Focus is visible on every
measured stop. Max CLS through a scroll is 0.038 (404 at 1440); no `longtask` entries were recorded
while scrolling. Reduced motion leaves every scroll-linked transform unset. The 4 content images
(case study and article) are neither broken, cropped by `object-fit` nor spilling.

| ID  | Sev | Finding                                                                                                                                                                                                                                                                          | Evidence                                                                                                                                                 | Disposition                                                                                                                                                                                          |
| --- | --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | P1  | On the 404 at 1024px and up, the header's links could not be clicked: the `404` numerals (`24cqi`, `line-height: 0.8`) have a text box about 40px taller than their block, and their positioned wrapper paints above the header. At 1440 a click on "Writing" stayed on the 404. | `elementFromPoint` at the link centre returned the `<b data-code>`; hit probe gave 1x1 for Portfolio, Open Source, Principles and the name at 1180–1920. | Fixed: `.nav { z-index: 1 }` in `SiteNavigation.module.css`. Covered by "header links on the 404 take the click" and the hit-area probe.                                                             |
| R2  | P2  | Desktop and tablet primary links had 14px-tall hit areas inside a 56px (46px at 960 and below) row. They pass 2.5.8 by spacing but miss the 44px the row suggests.                                                                                                               | Hit probe: 86x14 (Portfolio) at 1280.                                                                                                                    | Fixed: a transparent `::after` makes each link 44px tall. No pixel moves; all macOS baselines still pass.                                                                                            |
| R3  | P3  | Footer "Pause motion" was 18px tall.                                                                                                                                                                                                                                             | Hit probe: 114x18 at every width.                                                                                                                        | Fixed the same way in `MotionToggle.module.css` (44px tall).                                                                                                                                         |
| R4  | P2  | Article and case-study "On this page" links are 17px tall and stacked closer than 24px, failing 2.5.8.                                                                                                                                                                           | `summary.json` `smallTargets`: 23 (article) and 38 (case study) across 13 viewports, e.g. "Context" 56x17.                                               | Needs owner decision: `components/TableOfContents` belongs to the pre-redesign layouts the writing and case-study work replaces. Waived per route in `AUDIT_ROUTES`; drop the waiver when they land. |
| R5  | P3  | "Book a call" in the header is 28px tall at every width (the CTA is split in two rows).                                                                                                                                                                                          | Hit probe: 121x28.                                                                                                                                       | Needs owner decision. Passes 2.5.8; growing it would overlap the "Open to roles" label.                                                                                                              |
| R6  | P3  | The site menu is a non-modal disclosure, not a dialog: it has no focus trap or scroll lock by design (`useSiteMenu.ts`). Tab leaves the panel after the last link; Escape closes it and returns focus; rotation past 520px closes it.                                            | "site menu (emulated phones)" and rotation tests.                                                                                                        | No action. Making it modal would change ARIA wiring and needs approval.                                                                                                                              |
| R7  | P3  | The footer year is rendered from the clock, so full-page baselines will differ on 1 January. The Now week ruler is already masked.                                                                                                                                               | `SiteFooter.tsx` `new Date().getFullYear()`.                                                                                                             | Needs owner decision: mask the footer year in screenshots, or re-render baselines each January.                                                                                                      |
| R8  | —   | `/open-source` code samples spilled up to 436px past a 320px screen on 2e03467.                                                                                                                                                                                                  | First run before merging #240.                                                                                                                           | Fixed on `main` by #240; the gate now covers it.                                                                                                                                                     |

## Files

- `sheet-<route>.jpg`: top-of-page captures at all 13 viewports for each route.
- `sheet-shell-states.jpg`: the open menu at four phone sizes, the rotation, and contact form
  errors and success at four widths.
- `summary.json`: per route and viewport numbers behind the table.

To regenerate:

```bash
pnpm build
RESPONSIVE_EVIDENCE=/tmp/responsive pnpm exec playwright test e2e/responsive.e2e.ts
node e2e/responsive-sheet.mjs /tmp/responsive docs/audits/evidence/responsive
```
