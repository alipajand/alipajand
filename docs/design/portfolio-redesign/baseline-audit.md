# Baseline audit: alipajand.com/portfolio

Audit date: 2026-10-23. Production deployment tested: `https://alipajand.com` (Vercel, deployment id `dpl_6Y4U4bdXcGbRHUgbGKxzKgCu3H6H` as seen in image URLs). Repository state: `6f43749`.

This file is the behavioural baseline for the redesign. Everything a new design changes should be compared against it.

## How this was measured

| Tool                           | Version | Notes                                                                                                                                                                              |
| ------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Playwright (`playwright-core`) | 1.64.1  | Chromium 1243 build ("Chrome for Testing"), headless. Script: `evidence/playwright-audit-script.mjs`. Raw output: `evidence/playwright-results.json`.                              |
| Lighthouse                     | 12.8.2  | Same Chromium. One run per page per form factor. Mobile = simulated throttling (Moto G-class, slow 4G); desktop = `--preset=desktop`. Summary: `evidence/lighthouse-summary.json`. |
| curl / gh                      | n/a     | Outbound link status and open-source release checks.                                                                                                                               |

Viewports: 1440×900 (desktop, DPR 1), 768×1024 (tablet, DPR 1, touch), 390×844 (mobile, DPR 3, touch, iPhone UA). Each was run with `prefers-reduced-motion: no-preference` and `reduce` (the AlwaysGeeky page only with `no-preference`).

**Limits of these numbers.** Lab numbers come from a single machine on a fast connection, plus one Lighthouse run per configuration. They are not field data. Vercel Speed Insights is installed on the site (`GatedVercelSpeedInsights`) but its data was not accessed for this audit. Treat lab values as directional and re-run before comparing against a redesign.

## Evidence key

- **Observed**: seen in a screenshot or the live DOM.
- **Measured**: a number from Playwright or Lighthouse.
- **Inferred**: a reasoned risk, not reproduced.
- **Untested**: listed in §10.

---

## 1. First-viewport clarity

| Viewport | What is visible on load (observed)                                                                                                                                                             | Screenshot                                      |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 1440×900 | Nav, breadcrumb, H1 "Portfolio", four intro paragraphs, location/language line, 3 profile cards, 11 role-fit pills. **No project entry is visible.** The first case study starts at ~1,607 px. | `screenshots/portfolio-1440-first-viewport.png` |
| 768×1024 | Same content, reflowed. No project entry visible.                                                                                                                                              | `screenshots/portfolio-768-first-viewport.png`  |
| 390×844  | Nav, breadcrumb, H1, and roughly two and a half intro paragraphs. Profile links, role fit, and every project are below the fold.                                                               | `screenshots/portfolio-390-first-viewport.png`  |

**Assessment.** The H1 is the single word "Portfolio", so the page's thesis lives in ~180 words of muted 15–16 px body text. A recruiter scanning for 5–10 seconds sees prose, not work. The intro does name the three strongest projects with inline links, which is the only project signal above the fold. Lighthouse identified the third intro paragraph as the LCP element on `/portfolio` (mobile and desktop), which confirms that body text is the largest thing on screen.

Case-study first viewports are clearer: overline (employer context), H1 project name, subtitle, overview, role · timeframe, tags, and a live-link button are all visible at 1440 and 390 (`ledgerguard-1440-first-viewport.png`, `alwaysgeeky-390-first-viewport.png`). The hero screenshot starts at the bottom of the desktop viewport.

## 2. Content hierarchy

Heading outline of `/portfolio` (measured, identical at all widths):

```
H1 Portfolio
  H2 What to look for
    H3 Architecture decisions, with their costs
    H3 Systems other engineers build on
    H3 Complex product states
    H3 Ownership past the browser
  H2 (sr-only) Case studies
  H2 LedgerGuard
  H2 AlwaysGeeky Games
  H2 Emplifi
  H2 Agent Engineering Tools
  H2 TallyFolio
  H2 ControlTech
  H2 MapBylaw
```

Observations:

- The seven project headings are siblings of the hidden "Case studies" H2 instead of its children (H3). Screen-reader heading navigation shows "Case studies" as an empty section followed by seven peers.
- Order of the page: positioning prose → profile links → role labels → "What to look for" (a reading guide) → projects. The work appears fourth.
- All seven project entries have the same layout, type size, and spacing (`portfolio-1440-full.jpg`). The intro says "ordered by how much they show", but nothing visual marks LedgerGuard as more important than MapBylaw.
- Each entry is text only: overline, linked name, linked subtitle, role, 2–4 line problem statement, three tags, "Read the … case study →", and outbound links.

Case-study outline (LedgerGuard, measured): H1 LedgerGuard → H2 Context, Problem, My role, What I built, Technical decisions, UX and detail decisions, Interface evidence, Outcome, What I would improve, Related work. Clean and consistent across projects.

## 3. Project discoverability

| Path to a case study                           | Measured / observed                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Intro inline links                             | LedgerGuard, AlwaysGeeky (twice), Emplifi only                                                          |
| Project H2 link + "Read the … case study" link | 2 tab stops per project to the same URL; a third link on the subtitle is mouse-only (`tabIndex=-1`)     |
| Desktop sticky outline ("On this page")        | 7 in-page anchors; visible at ≥1024 px; reached by keyboard only after all 40 preceding links           |
| Mobile outline (`<details>`)                   | Collapsed by default above the first project                                                            |
| Case study → next                              | "Next case study: …" in Related work at the end of each article                                         |
| Case study → index                             | Breadcrumb "Case studies" (→ `/portfolio`) and "Back to all case studies" (→ `/portfolio#case-studies`) |

Duplicate links measured in `main` on `/portfolio`: `/portfolio/alwaysgeeky` ×5, `/portfolio/ledgerguard` ×4, `/portfolio/emplifi` ×4, each other case study ×3, every `#project-*` anchor ×2. 54 links in `main` in total.

## 4. Interaction behaviour (measured)

| Interaction                                                                        | Result                                                                                                                                                                     |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skip link                                                                          | First tab stop; Enter moves focus to `main#main-content` ✅                                                                                                                |
| Open a case study from the index                                                   | Navigates; scroll 0; focus moves to `main` ✅                                                                                                                              |
| "Back to all case studies" (`/portfolio#case-studies`)                             | URL updates with hash, but scroll stays at **0**; `#case-studies` is at 1,607 px ❌                                                                                        |
| Browser Back from `/portfolio/emplifi` to `/portfolio` after scrolling to 2,400 px | Returns to scroll **0** ❌ (`history.scrollRestoration = "manual"` plus `scrollToTop()` in `RouteChangeFocus`)                                                             |
| Mobile outline (`<details>`) on LedgerGuard, by tap                                | Opens on tap; tapping "Outcome" closes it and scrolls the section to 54 px from the top ✅ (section rule sits ~10 px under the 64 px fixed nav; heading itself is visible) |
| Mobile menu, by tap                                                                | Opens; `aria-expanded="true"`; focus to first link; body scroll locked ✅ (`portfolio-390-menu-open.png`)                                                                  |
| Diagrams (Layers / Flow)                                                           | Buttons reachable by keyboard with visible focus ✅ (activation not exercised by the script)                                                                               |
| Hover states                                                                       | Not measured (screenshots are static)                                                                                                                                      |

## 5. Navigation, focus, and keyboard

Measured by pressing Tab 45 times on `/portfolio` and 35 times on `/portfolio/ledgerguard` at 1440×900 (`evidence/playwright-results.json`, `focus` arrays).

- Every focused element had a visible indicator (outline or ring). ✅
- Order on `/portfolio`: skip link → 6 nav links → breadcrumb → 4 intro links → 3 profile cards → per project (name, "Read …", outbound links) × 7 → desktop outline (7 anchors) → footer.
- Order on LedgerGuard: skip → nav → breadcrumb → live link → 5 Layers buttons → Flow step and "Next" buttons → related links → **then** the 10-item outline → footer.
- The desktop outline is the most efficient way to move around both pages, and it comes last in tab order. ❌
- With motion enabled, off-screen reveal elements became visible when focused (keyboard focus scrolls them into view and triggers the observer). No invisible focused element was recorded. ✅

## 6. Motion and reduced motion

| Check                                                          | no-preference                                                                                                       | reduce                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `[data-reveal]` elements at `opacity: 0` on load, `/portfolio` | **13 / 13** at every width                                                                                          | 0 / 13                                                    |
| Same, case studies                                             | 10 / 11                                                                                                             | 0 / 11                                                    |
| After scrolling the full page                                  | 0 hidden                                                                                                            | 0 hidden                                                  |
| Lenis smooth scroll attached (`html.lenis`)                    | Yes                                                                                                                 | No                                                        |
| Unscrolled full-page capture                                   | Everything below the header is blank (`portfolio-1440-full-unscrolled.jpg`, `ledgerguard-1440-full-unscrolled.jpg`) | Fully rendered (`portfolio-1440-reduced-motion-full.jpg`) |
| Header text 2.5 s after load                                   | Visibly softer/offset vs reduced-motion capture                                                                     | Crisp                                                     |

Reduced motion is respected at load. Changing the preference while a page is open was not tested (code reads it once; see `architecture-and-motion-audit.md` §4.2).

## 7. Images and media weight

| Page         | Images                    | Requested variant          | Rendered size (390 / 1440)        | AVIF transfer         |
| ------------ | ------------------------- | -------------------------- | --------------------------------- | --------------------- |
| `/portfolio` | 0                         | n/a                        | n/a                               | 0 KB                  |
| LedgerGuard  | 3 (all `loading="eager"`) | `w=3840` at every viewport | 342×221 / 896×579 (hero), 752×486 | 65 + 22 + 85 = 172 KB |
| AlwaysGeeky  | 2 (eager)                 | `w=3840`                   | 342×221 / 896×579                 | 202 + 68 = 270 KB     |
| MapBylaw     | 2 (eager)                 | `w=3840`                   | not measured                      | 238 + 70 = 308 KB     |

- All images are served as AVIF from the Vercel image cache (`x-vercel-cache: HIT`). Transfer is moderate because AVIF compresses the screenshots well, but every viewport downloads the 3840 px variant because `ProjectFigure` passes no `sizes`.
- Lighthouse "Properly size images" estimated savings: 252–260 KB (AlwaysGeeky), 162–166 KB (LedgerGuard).
- The LCP image on case studies is discoverable but has no `fetchpriority="high"` (Lighthouse `lcp-discovery-insight`).
- No layout shift was measured on any page (CLS 0 in Playwright and Lighthouse).
- Repository source PNGs: 18 MB in `public/portfolio-media/`.

## 8. Responsive layout

- **No horizontal overflow** at 390, 768, or 1440 on any tested page (`scrollWidth === clientWidth`, no un-clipped element past the viewport). ✅
- Page height (after scroll): `/portfolio` 6,346 px (1440) → 8,933 px (390); LedgerGuard 8,100 → 9,774; AlwaysGeeky 7,444 → 9,509.
- At 390 px, case-study screenshots render at 342×221 CSS px. Dashboard screenshots are unreadable at that size (inferred from `ledgerguard-390-toc-open.png`; text in the screenshot is ~4 px).
- The mobile case-study outline appears after the hero image, about 1.3 viewports down.

## 9. Accessibility

Automated (Lighthouse/axe, mobile and desktop):

| Page         | A11y score | Failing audits                                                                                                                                                                                                                                                                                                                                                     |
| ------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/portfolio` | 100        | `label-content-name-mismatch` failed: profile cards' `aria-label` ("GitHub: github.com/alipajand (opens in new tab)") does not contain the visible text in the same order as rendered ("GitHub" + "github.com/alipajand"). The category score is still 100, so this audit does not affect it here, which is one reason a score of 100 is not proof of conformance. |
| LedgerGuard  | 96         | `color-contrast`: the host hint inside the white "Live product" button is `#a3a3a3` on `#fafafa` = **2.41:1** (needs 4.5:1).                                                                                                                                                                                                                                       |
| AlwaysGeeky  | 96         | Same contrast failure on both live-link buttons.                                                                                                                                                                                                                                                                                                                   |

Manual / scripted:

- Landmarks present: `header`, `nav[Primary]`, `main#main-content`, breadcrumb `nav`, two "Case studies on this page" navs (one hidden per breakpoint), `footer` with three labelled navs. ✅
- Heading structure: see §2 (project H2s are siblings of the sr-only H2).
- Small targets (measured, < 24 px tall): breadcrumb "Home" (38×18), inline intro links (~19–21 px tall), "Next case study" and "Back to all case studies" links (19–21 px). Inline links in sentences are exempt under WCAG 2.5.8; the breadcrumb and the two standalone related links are not, unless spacing satisfies the exception. Not evaluated against the spacing rule.
- External links announce host and "opens in new tab". ✅
- `ProjectFigure` captions are visible and alt text is descriptive. ✅
- Not tested with a real screen reader (§10).

## 10. Core Web Vitals and Lighthouse (lab)

| Page         | Form factor | Perf   | A11y | BP  | SEO | FCP   | LCP       | TBT    | CLS | Weight  |
| ------------ | ----------- | ------ | ---- | --- | --- | ----- | --------- | ------ | --- | ------- |
| `/portfolio` | mobile      | 98     | 100  | 96  | 100 | 0.9 s | 2.1 s     | 110 ms | 0   | 550 KiB |
| `/portfolio` | desktop     | 100    | 100  | 96  | 100 | 0.3 s | 0.4 s     | 0 ms   | 0   | 577 KiB |
| LedgerGuard  | mobile      | **75** | 96   | 96  | 100 | 2.7 s | **5.3 s** | 80 ms  | 0   | 704 KiB |
| LedgerGuard  | desktop     | 100    | 96   | 96  | 100 | 0.3 s | 0.6 s     | 0 ms   | 0   | 730 KiB |
| AlwaysGeeky  | mobile      | 99     | 96   | 96  | 100 | 1.0 s | 2.1 s     | 50 ms  | 0   | 801 KiB |
| AlwaysGeeky  | desktop     | 100    | 96   | 96  | 100 | 0.3 s | 0.5 s     | 0 ms   | 0   | 824 KiB |

- The LedgerGuard mobile result is one run. Its LCP element is the hero image; AlwaysGeeky's mobile LCP was a paragraph, which is why it scored higher despite heavier images. Re-run several times before treating 5.3 s as the baseline. What is consistent across runs: the hero image is the LCP candidate on case studies and is not prioritised.
- Best Practices 96 everywhere: a 404 for `/icon.png`, referenced by `public/manifest.json`. The generated icon route is `/icon` (200).
- Unused JavaScript: Lighthouse estimates 97–118 KiB unused on first load.
- Playwright lab LCP (fast connection, no throttling): 72–1,332 ms; CLS 0 on every page.

## 11. SEO provisions (observed)

- Unique titles, meta descriptions, and canonicals on `/portfolio` and case studies.
- JSON-LD: `WebSite` + `CollectionPage` + `BreadcrumbList` on the index; `WebSite` + `Article` + `BreadcrumbList` on case studies.
- All case studies share the site-wide default OG image.
- Lighthouse SEO 100 on every page.

## 12. Untested areas

- Real screen readers (VoiceOver, NVDA, TalkBack).
- Physical touch devices; touch was emulated in Chromium only.
- Safari / WebKit and Firefox rendering; all runs were Chromium.
- Field Core Web Vitals (Vercel Speed Insights not accessed).
- INP (requires real interactions; not measured).
- Changing reduced-motion preference mid-session.
- Hover and focus-within visual states on cards.
- Diagram activation by keyboard/touch (buttons were focused, not activated).
- Print styles.
- Slow-network or JavaScript-disabled loading. Inferred from code: with JS disabled, the `html.js` class is never added and reveals never run, so content stays visible; not verified.
- Other routes (`/`, `/open-source`, `/writing`) except where shared components overlap.
- Five case studies not opened in the browser: Emplifi (index link only), Agent tooling, TallyFolio, ControlTech, MapBylaw (MapBylaw images were fetched, page not inspected).

## Screenshot index

All in `screenshots/`. PNG = viewport capture; JPG = full page (quality 55–60, CSS pixels). In full-page JPGs, the fixed nav appears where the capture stitched it; it is a capture artefact, not a layout bug.

| File                                                         | Content                                                                    |
| ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `portfolio-{1440,768,390}-first-viewport.png`                | Index, first viewport, motion on                                           |
| `portfolio-{1440,768,390}-reduced-motion-first-viewport.png` | Same, reduced motion                                                       |
| `portfolio-{1440,768,390}-full.jpg`                          | Index, full page after scrolling through                                   |
| `portfolio-{1440,768,390}-reduced-motion-full.jpg`           | Same, reduced motion                                                       |
| `portfolio-1440-full-unscrolled.jpg`                         | Index, full page **without** scrolling (shows hidden reveals)              |
| `portfolio-390-menu-open.png`                                | Mobile menu open                                                           |
| `ledgerguard-…`                                              | Same set for `/portfolio/ledgerguard`, plus `ledgerguard-390-toc-open.png` |
| `alwaysgeeky-{1440,768,390}-{first-viewport.png,full.jpg}`   | `/portfolio/alwaysgeeky`, motion on                                        |
