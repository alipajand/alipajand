# Findings and issue register

Audit date: 2026-10-23. Each finding has an ID, priority, evidence type, source evidence, and a proposed correction. Nothing has been fixed. Corrections are proposals for a later, approved implementation pass.

**Priority**

- **P0**: blocks the redesign or misrepresents Ali to an employer. Resolve before any redesign work ships.
- **P1**: materially hurts recruiter comprehension, accessibility, or core navigation.
- **P2**: quality, performance, or maintainability issue the redesign should absorb.
- **P3**: polish or hygiene.

**Evidence type**: **M** measured live · **O** observed in screenshots/DOM · **C** code fact · **I** inferred risk (not reproduced) · **D** needs Ali's decision.

Detailed evidence lives in `baseline-audit.md` (B§), `architecture-and-motion-audit.md` (A§), `content-and-evidence-inventory.md` (CI), and `documentation-conflicts.md` (DC).

## Summary

| ID   | P   | Area            | Finding (short)                                                           | Type    |
| ---- | --- | --------------- | ------------------------------------------------------------------------- | ------- |
| F-01 | P0  | Content         | Two outbound "live" project links are dead or closed                      | M       |
| F-02 | P0  | Docs / process  | Design rules forbid the Awwwards goal; no motion or perf budget           | C, D    |
| F-03 | P1  | Motion          | Content is invisible until scrolled into view                             | M, C    |
| F-04 | P1  | Navigation      | Returning to the index loses position (link and Back button)              | M, C    |
| F-05 | P1  | First viewport  | No project is visible in the first viewport at any width                  | O       |
| F-06 | P1  | Hierarchy       | Seven case studies at identical visual weight                             | O, C    |
| F-07 | P1  | Accessibility   | Live-link host hint fails contrast (2.41:1)                               | M       |
| F-08 | P1  | Positioning     | "Staff-level" intro paragraph conflicts with Senior title                 | C, D    |
| F-09 | P1  | Evidence        | Headline claims lack provenance; key UI not shown                         | C, D    |
| F-10 | P2  | Performance     | Case-study images download 3840 px at every viewport; LCP not prioritised | M, C    |
| F-11 | P2  | Media           | TallyFolio dashboard declared dimensions do not match the file            | C       |
| F-12 | P2  | Architecture    | Motion forces the whole portfolio into client components                  | C, M    |
| F-13 | P2  | Motion          | Header blur/scale re-hides readable text after hydration                  | O, C, I |
| F-14 | P2  | Keyboard        | Desktop outline is last in tab order                                      | M       |
| F-15 | P2  | Links           | Three links per project to the same URL; 54 links in `main`               | M, C    |
| F-16 | P2  | Semantics       | Project headings are siblings of the hidden "Case studies" heading        | M, C    |
| F-17 | P2  | Mobile          | Case-study screenshots unreadable at 390 px                               | O       |
| F-18 | P2  | Testing         | No browser, a11y, visual, or performance tests                            | C       |
| F-19 | P2  | Best practices  | Manifest icon `/icon.png` returns 404                                     | M       |
| F-20 | P2  | Docs            | Architecture/route docs describe a page that no longer exists             | C       |
| F-21 | P2  | Accessibility   | Small standalone targets (< 24 px tall)                                   | M       |
| F-22 | P3  | Motion          | Reduced-motion preference read once, not live                             | C       |
| F-23 | P3  | Accessibility   | Profile-card accessible names don't match visible text                    | M       |
| F-24 | P3  | Tokens          | `.bg-card` override, misnamed red token, off-token colour                 | C       |
| F-25 | P3  | SEO             | Shared OG image; sitemap dates always "now"                               | C       |
| F-26 | P3  | Maintainability | Dead code paths in the portfolio module                                   | C       |
| F-27 | P3  | Performance     | ~100 KiB unused JS; 14 KiB legacy JS                                      | M       |

---

## P0

### F-01 · Two outbound "live" project links are dead or closed

- **Evidence (M):** On 2026-10-23, `https://market.voxies.io` (AlwaysGeeky "Marketplace" button, `data/projects.ts:749`) redirected to `/closed`, whose page reads that the Voxies Marketplace has shut down and dates the closure to July 17, 2026. `https://ctrltech.org` (ControlTech "Company website", `:1057`) failed DNS resolution (`curl: Could not resolve host`). Both links appear on the index and the case studies, and the Voxies one is styled as a primary button.
- **Why P0:** a hiring manager who clicks either sees a dead end on the employer-facing page. This is a factual-accuracy issue, not a design one.
- **Proposed correction:** Ali decides per link: relabel ("Marketplace — closed July 2026"), replace with an archived capture, or remove. Add a `status: "live" | "archived"` field to `ProjectLink` so the UI can show archived links differently. Add a scheduled link check (outside this audit's scope). Recheck ctrltech.org from another network before removing it, since this was one observation.

### F-02 · Design rules forbid the Awwwards goal; no motion or performance budget

- **Evidence (C, D):** `CLAUDE.md` requires `/portfolio` to be "not a heavy visual gallery", to "avoid visual complexity on recruiter-facing index pages" and "excessive animation", with no definition. No file defines motion or performance budgets. `ProjectIndex.spec.tsx` encodes "should not render project figures" as a test. Details: DC-4, DC-5, DC-6.
- **Why P0:** any redesign either breaks the written rules or stays inside them and cannot meet the Awwwards goal. This must be decided first.
- **Proposed correction:** adopt the two-layer rule in DC-4 (text-complete baseline + expressive layer within budgets), the motion rules in DC-5, and the budget in DC-6, after Ali approves them. Update the test to assert the text baseline rather than the absence of figures.

## P1

### F-03 · Content is invisible until scrolled into view

- **Evidence (M, C):** with motion enabled, 13/13 `[data-reveal]` elements on `/portfolio` and 10/11 on case studies had `opacity: 0` on load at every viewport (B§6). Full-page captures without scrolling are blank below the header (`screenshots/portfolio-1440-full-unscrolled.jpg`). Cause: `cinematicReveal` sets `opacity: 0` and waits for IntersectionObserver (`utils/cinematic.ts:142-169`). Reduced motion is unaffected.
- **Inferred impact:** non-scrolling consumers (link previews, capture tools, some embedded webviews) see empty sections; if the GSAP chunk or the observer fails after hydration, content stays hidden. For an Awwwards submission, jurors' screenshot tools will capture blank sections.
- **Proposed correction:** start content in its visible state and animate only `transform` from a small offset, or animate decorative layers only. Add a fail-safe that reveals everything after a short timeout. Add a browser test asserting content is visible without scrolling.

### F-04 · Returning to the index loses position

- **Evidence (M):** "Back to all case studies" (`/portfolio#case-studies`) landed at `scrollY 0` while `#case-studies` is at 1,607 px. Browser Back from a case study after scrolling to 2,400 px returned to 0 (B§4). Cause: `RouteChangeFocus.tsx:15-17` sets `history.scrollRestoration = "manual"`, and lines 27-35 call `scrollToTop()` and skip hash handling when the path is `/portfolio`.
- **Why P1:** index → case study → back is the core recruiter loop. Each return drops them at the intro prose.
- **Proposed correction:** restore scroll on history navigation (keep native or Next.js restoration for `popstate`), honour `#case-studies` and `#project-*` hashes on `/portfolio`, and keep the focus-to-`main` behaviour only for forward navigation. History: commit `8624118` ("add breadcrumbs and simplify cross-page navigation") deliberately disabled portfolio hash scrolling, with no reason given in the message, while `ProjectCaseStudyArticle.tsx:183` still links to `/portfolio#case-studies`. The two decisions now contradict each other; ask Ali which behaviour was intended before changing either.

### F-05 · No project is visible in the first viewport

- **Evidence (O):** at 1440×900, 768×1024, and 390×844 the first viewport contains the H1 "Portfolio", intro prose, profile cards, and role pills, and no project entry. The first case study begins at ~1,607 px on desktop (B§1). Lighthouse's LCP element on `/portfolio` is the third intro paragraph.
- **Proposed correction:** lead with the work. The redesign should show at least the three featured projects (name, one-line outcome, role, timeframe) inside the first desktop viewport, and the first featured project inside the first mobile viewport. Move the four-paragraph intro to a shorter statement (one or two sentences) and push "What to look for" below the projects or into case studies.

### F-06 · Seven case studies at identical visual weight

- **Evidence (O, C):** every `ProjectIndexItem` has the same layout and type scale (`portfolio-1440-full.jpg`). `PORTFOLIO_PAGE_INTRO` says the list is "ordered by how much they show", but no visual signal marks tiers. `Project` has no tier field (A§2).
- **Proposed correction:** add `tier` to the data model and design three distinct treatments: Featured (LedgerGuard, AlwaysGeeky, Emplifi), Supporting (Agent tooling, TallyFolio, ControlTech), Experiment (MapBylaw). Tier assignment needs Ali's confirmation (CI, DC-7).

### F-07 · Live-link host hint fails contrast

- **Evidence (M):** Lighthouse `color-contrast` on LedgerGuard and AlwaysGeeky: `<span class="text-muted">` inside the white `CTA_PRIMARY` button is `#a3a3a3` on `#fafafa`, 2.41:1, at 14 px (needs 4.5:1). Source: `ProjectLinkAnchor.tsx:36` reuses `text-muted`, which was designed for dark backgrounds.
- **Proposed correction:** give the hint a colour role that is valid on light surfaces (e.g. `text-background/70`, checked ≥ 4.5:1), or move the host outside the button. In the redesign, define foreground/muted pairs per surface instead of one global muted colour.

### F-08 · "Staff-level" intro paragraph conflicts with the Senior title

- **Evidence (C, D):** `data/projects.ts:84` opens with "The staff-level part is leverage, not a title". `CLAUDE.md` and commit `ba8081b` set the public title to Senior Software Engineer. DC-11.
- **Proposed correction:** Ali decides: keep, soften (e.g. lead with the AlwaysGeeky evidence without the staff framing), or remove. Not a design decision.

### F-09 · Headline claims lack provenance; key UI is not shown

- **Evidence (C, D):** the Emplifi "80%" appears five times on the site without method; LedgerGuard "90% unit-test coverage" has no supporting artefact; LedgerGuard has no screenshot of the review UI the case study is about; Emplifi and ControlTech have no interface evidence at all (CI).
- **Proposed correction:** Ali supplies one-line provenance for each metric (tool, metric, scope) and, where shareable, a review-UI capture with demo data. The redesign must not invent illustrative UI; any recreated visual must be labelled as illustrative.

## P2

### F-10 · Images download 3840 px at every viewport; LCP image not prioritised

- **Evidence (M, C):** at 390 px, LedgerGuard figures rendered at 342×221 but requested `w=3840` (B§7). `ProjectFigure.tsx` passes intrinsic 3456 px width, no `sizes`, `loading="eager"` for every figure, and no `priority`/`fetchPriority`. Lighthouse: "Properly size images" savings 162–260 KiB; `lcp-discovery-insight` flags missing `fetchpriority=high`. LedgerGuard mobile LCP 5.3 s in one run.
- **Proposed correction:** set `sizes` from the layout (e.g. `(min-width: 1024px) 896px, 100vw`), `priority` on the hero figure only, `loading="lazy"` for evidence figures. Re-encode source PNGs (18 MB) to reasonable dimensions. This must be fixed before adding index cover images.

### F-11 · TallyFolio dashboard dimensions mismatch

- **Evidence (C):** `tallyfolio-dashboard.png` is 3456×2234 on disk; `data/projects.ts:428-429` declares 3454×1982. The reserved aspect ratio differs from the real one (1.74 vs 1.55). CLS was not measured on the TallyFolio page.
- **Proposed correction:** correct the declared dimensions, and add a unit test that reads image headers and compares them with `data/projects.ts`.

### F-12 · Motion forces the portfolio into client components

- **Evidence (C, M):** `PortfolioPageContent`, `ProjectIndex`, `ProjectCaseStudyPageContent`, and `ProjectCaseStudyArticle` are `"use client"` because they call motion hooks; `ProjectFigure`, `ProjectDecisionCard`, and `ProjectHighlightCard` are client components with no client behaviour (A§1). Lighthouse estimates 97–118 KiB unused JS on first load.
- **Proposed correction:** keep content in server components and attach motion through a thin client wrapper that queries `[data-reveal]` under a ref, or through CSS. Remove `"use client"` from components without hooks.

### F-13 · Header blur/scale re-hides readable text after hydration

- **Evidence (O, C, I):** `usePageHeader` sets the already-rendered header to `opacity 0, scale 1.03, blur(10px)` and animates back over 1.4 s. The motion-enabled screenshot 2.5 s after load shows softer, offset header text compared with reduced motion (`portfolio-1440-first-viewport.png` vs `portfolio-1440-reduced-motion-first-viewport.png`). `.cine-stage` keeps `will-change` permanently. The cause of the residual softness is inferred.
- **Proposed correction:** do not animate text that is already visible from server HTML. If a title moment is wanted, run it on a decorative layer, and remove `will-change` when the animation ends.

### F-14 · Desktop outline is last in tab order

- **Evidence (M):** on `/portfolio` the "Case studies on this page" outline is reached at tab stops 41–47, after all project links; on LedgerGuard at 21–30, after the article (B§5).
- **Proposed correction:** place the outline before the content in DOM order (visual position can stay to the right via grid), or add a "Jump to case studies" link near the top.

### F-15 · Three links per project to the same URL

- **Evidence (M, C):** `ProjectIndexItem` links the name, the subtitle (`tabIndex=-1`), and "Read the … case study" to one URL; intro paragraphs add more. Measured duplicates: `/portfolio/alwaysgeeky` ×5, others ×3–4; 54 links in `main`.
- **Proposed correction:** one primary link per project (block-link pattern with the name as the accessible label, or a single "Read case study" link), plus outbound links. Drop the mouse-only subtitle link.

### F-16 · Project headings are siblings of the hidden section heading

- **Evidence (M, C):** outline is `H2 (sr-only) Case studies` followed by seven `H2` project names (B§2). `ProjectIndexItem.tsx:26` hardcodes `h2`.
- **Proposed correction:** render project names as `h3` under a visible or sr-only `h2 Case studies`, or remove the sr-only heading and label the section with `aria-label`.

### F-17 · Case-study screenshots unreadable at 390 px

- **Evidence (O):** dashboard screenshots render at 342×221 CSS px on mobile (`ledgerguard-390-toc-open.png`); in-image text is around 4 px.
- **Proposed correction:** provide mobile crops or detail crops of the relevant UI region, or open figures in a zoomable, accessible lightbox. Captions already carry the meaning, which should be kept.

### F-18 · No browser, accessibility, visual, or performance tests

- **Evidence (C):** tests are Jest + Testing Library with GSAP mocked and an IntersectionObserver mock that fires immediately (`jest.setup.ts`); Playwright and axe are not project dependencies; CI runs lint, typecheck, test, build only (`.github/workflows/ci.yml`).
- **Proposed correction:** add a small Playwright suite for the redesign covering the behaviours in B§4–§6 (back navigation, hash targets, content visible without scrolling, reduced motion, no horizontal overflow at 390/768/1440) plus axe checks, and optionally Lighthouse CI with the DC-6 budgets. Adding dependencies needs approval (AGENTS.md).

### F-19 · Manifest icon returns 404

- **Evidence (M):** `public/manifest.json` references `/icon.png` (404). The generated icon route `/icon` returns 200. Lighthouse Best Practices 96 on every page because of this console error.
- **Proposed correction:** point the manifest at `/icon` with the correct type and size, or add a static 512×512 PNG. Site-wide, small, and independent of the redesign.

### F-20 · Docs describe a page that no longer exists

- **Evidence (C):** see DC-1, DC-2, DC-3, DC-9.
- **Proposed correction:** apply the documentation changes listed there once approved.

### F-21 · Small standalone targets

- **Evidence (M):** breadcrumb "Home" 38×18; "Next case study" and "Back to all case studies" ~19–21 px tall (B§9). Inline links in prose are exempt under WCAG 2.5.8; these are not inline.
- **Proposed correction:** give standalone links `min-h-6` (24 px) or more, as `ProjectIndexItem` already does with `min-h-11`.

## P3

### F-22 · Reduced-motion preference is read once

- **Evidence (C):** `prefersReducedMotion()` is evaluated in effects with no `matchMedia` change listener (`utils/gsap.ts`, `SmoothScroll.tsx`). Not reproduced.
- **Proposed correction:** subscribe to `matchMedia("(prefers-reduced-motion: reduce)")` changes and tear down Lenis and running animations when it flips.

### F-23 · Profile-card accessible names don't match visible text

- **Evidence (M):** Lighthouse `label-content-name-mismatch` on the three profile cards (`PortfolioProfileLinks.tsx:29`).
- **Proposed correction:** drop the custom `aria-label` and let the visible text plus a visually hidden "(opens in new tab)" form the name, or make the `aria-label` start with the exact visible text.

### F-24 · Token hygiene

- **Evidence (C):** unlayered `.bg-card { background-color: #000 }` (`globals.css:446`) overrides `--card: #0a0a0a`; `--organic-orange` is `#ea2b2b` (red); `text-orange-200` in `ProjectIndex.tsx:112`; `SECTION_INNER` and `SECTION_INNER_WIDE` are identical.
- **Proposed correction:** fold into the redesign's token layer: named colour roles, one card surface definition, no raw palette colours.

### F-25 · Shared OG image; sitemap dates always "now"

- **Evidence (C):** every case study uses the default OG image (`utils/metadata.ts`); `app/sitemap.ts` sets `lastModified: new Date()` for every case study.
- **Proposed correction:** per-case-study OG images built from the new visual identity; real modification dates stored in project data.

### F-26 · Dead code paths

- **Evidence (C):** `ProjectHighlightCard` is not imported; the "Additional experience" section never renders (all projects have dedicated case studies); `ProjectCaseStudyArticle`'s embedded mode (`isDedicatedPage=false`) is only used in tests.
- **Proposed correction:** remove or deliberately keep each during the redesign, with a note on why.

### F-27 · Unused and legacy JavaScript

- **Evidence (M):** Lighthouse: 97–118 KiB unused JS, 14 KiB legacy JS on first load; render-blocking insight on all pages.
- **Proposed correction:** largely addressed by F-12. Re-measure after the client boundary changes.

---

## What is working and must be preserved

These are measured or verified strengths. The redesign should not regress them.

- No horizontal overflow at 390/768/1440 (M).
- CLS 0 on every tested page (M).
- Skip link, focus-to-main on navigation, visible focus on every tab stop (M).
- Mobile menu: `aria-expanded`, focus trap, Escape, `inert`, scroll lock (M + C).
- Reduced-motion path removes reveals and smooth scroll at load (M).
- Text-first index that works with images off (O).
- Accessible interactive diagrams (C).
- Unique metadata, canonical URLs, JSON-LD (`CollectionPage`, `Article`, `BreadcrumbList`), SEO 100 (M).
- Static generation for all portfolio routes (C).
- Consistent nine-section case-study template with stated trade-offs (C).
- External links announce their host and new-tab behaviour (C, M).
