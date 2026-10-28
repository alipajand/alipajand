# Device matrix and design parity

Date: 2026-10-27. Baseline: `main` at `de7fac2` (PRs #244 to #265 merged). Spot re-checks on `main` at `cf528c8`, which adds #266 to #275; each re-check says so. #288 (DM-01) merged after these runs, at `05cc19c`.

Method: a production build (`pnpm build && pnpm start -p 3506`) driven by Playwright 1.64 scripts outside the e2e suite. Every route was loaded fresh in a new browser context per viewport, scrolled through, measured, and checked with axe-core 4.13.

Severity: P0 Critical, P1 High, P2 Medium, P3 Low, Info (no defect, or by design).

## Coverage

**All results are emulated.** Mobile and tablet sizes are Playwright device emulation (viewport, device pixel ratio, `hasTouch`, and `isMobile` in Chromium and WebKit). WebKit is **Playwright WebKit, not Safari**. **No real devices were used, and there are no real-device results.** Nothing here claims Safari, iOS, Android or Firefox coverage.

Routes (30): every `<loc>` in `/sitemap.xml` (29: home, `/writing`, `/portfolio`, `/engineering-principles`, `/now`, `/open-source`, 16 posts including the scheduled `preparing-integrations-for-anthropic-and-cursor-directories`, and 7 case studies), plus `/404`.

| Engine                                        | Viewports (CSS px, DPR)                                                                                                                                                                                                             | Runs                                                     |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Chromium 156.0.8078.4 (Playwright build 1248) | Phones 320×568@2, 375×812@3, 390×844@3, 430×932@3, 568×320@2, 844×390@3. Tablets 768×1024, 820×1180, 1024×768, 1180×820 (@2). Desktops 1280×800@1, 1440×900@2, 1920×1080@1. Zoom 640×400@2 (200% of 1280×800) and 320×200@4 (400%). | 15 × 30 + reduced motion at 390 and 1440 (60) = 510      |
| Playwright WebKit 27.2 (build 2370)           | 320×568, 375×812, 390×844, 430×932, 844×390, 768×1024, 820×1180, 1024×768, 1280×800, 1440×900, 320×200 (400%)                                                                                                                       | 11 × 30 + reduced motion at 390 and 1440 (60) = 390      |
| Firefox                                       | none                                                                                                                                                                                                                                | 0. Could not be launched on this host (see Limitations). |

Each run checked:

- **Overflow and clipping.** Document `scrollWidth` vs `clientWidth`, measured at the top and again after scrolling to the bottom. Every visible element past the viewport edge outside a clipping box. Elements with hidden or clipped overflow whose own text is wider (sideways) or taller (`line-clamp`) than the box. `text-overflow: ellipsis`. Display words outside their line.
- **Typography.** Smallest rendered text, the count of text under 12px, `h1` and paragraph size.
- **Touch targets.** WCAG 2.5.8 (24px, or the spacing exception), a count of targets under 44px (2.5.5, AAA), and overlapping block-level targets.
- **Scroll-linked motion.** A scroll-through in 0.7-viewport steps, recording any text in view with effective opacity under 0.3 or `visibility: hidden` (dimmed `[data-step]` excluded). Repeated under `prefers-reduced-motion: reduce`, which also counts running animations.
- **Contrast.** axe `color-contrast` after the scroll-through. At 390 and 1440 the full WCAG 2.0 to 2.2 A/AA tag set ran instead.
- **Assets.** Every response of 400 or above, failed requests, `document.fonts` errors, images with `naturalWidth` 0, and console errors.
- **Responsive images.** The `next/image` candidate chosen against rendered width × DPR, flagging under-delivery and picks more than 2× too large.
- **Menu.** Opens, shows five links, Escape closes it and returns focus, plus the panel's size against the viewport.
- **Additional checks at 390 and 1440:**
  - keyboard order (up to 45 Tab stops) with a visible indicator and the focused element not obscured;
  - the screenshot dialog (opens, focus inside, Escape closes, focus returns);
  - Back/Forward after a hash jump and a route change;
  - LCP and CLS.

Raw results (900 rows) are in the audit's scratch output (`results.jsonl`, `matrix-results.csv`) and are not committed.

## Matrix summary

Counts are runs (route × viewport) with at least one issue of that kind. Columns with zero in every row are listed after the table.

| Engine, viewport                                   | Runs | Ellipsis (by design) | Contrast | Other axe | Scroll regions not focusable | Notes                                                                      |
| -------------------------------------------------- | ---- | -------------------- | -------- | --------- | ---------------------------- | -------------------------------------------------------------------------- |
| Chromium 320×568                                   | 30   | 16                   | 1        | –         | 7                            |                                                                            |
| Chromium 375×812                                   | 30   | 16                   | 2        | –         | 7                            |                                                                            |
| Chromium 390×844                                   | 30   | 16                   | 2        | 7         | 7                            |                                                                            |
| Chromium 390×844 reduced motion                    | 30   | 16                   | 0        | –         | 7                            |                                                                            |
| Chromium 430×932                                   | 30   | 15                   | 2        | –         | 7                            |                                                                            |
| Chromium 568×320                                   | 30   | 14                   | 1        | –         | 6                            |                                                                            |
| Chromium 844×390                                   | 30   | 13                   | 1        | –         | 1                            | 1 lazy image still loading at capture                                      |
| Chromium 768×1024 / 820×1180 / 1024×768 / 1180×820 | 120  | 52                   | 8        | –         | 9                            |                                                                            |
| Chromium 1280×800 / 1440×900 / 1920×1080           | 90   | 39                   | 5        | –         | 0                            |                                                                            |
| Chromium 1440×900 reduced motion                   | 30   | 13                   | 0        | –         | 0                            |                                                                            |
| Chromium 640×400 (200%)                            | 30   | 14                   | 1        | –         | 6                            |                                                                            |
| Chromium 320×200 (400%)                            | 30   | 16                   | 1        | –         | 7                            | Menu panel taller than the viewport; it is in flow and scrolls (no defect) |
| WebKit 320×568 / 375×812 / 430×932 / 844×390       | 120  | 60                   | 6        | –         | 22                           |                                                                            |
| WebKit 390×844                                     | 30   | 16                   | 2        | 7         | 7                            |                                                                            |
| WebKit 390×844 reduced motion                      | 30   | 16                   | 0        | –         | 7                            |                                                                            |
| WebKit tablets (768, 820, 1024)                    | 90   | 39                   | 8        | –         | 8                            |                                                                            |
| WebKit 1280×800 / 1440×900                         | 60   | 26                   | 3        | –         | 0                            |                                                                            |
| WebKit 1440×900 reduced motion                     | 30   | 13                   | 0        | –         | 0                            |                                                                            |
| WebKit 320×200 (400%)                              | 30   | 16                   | 1        | –         | 7                            | 1 lazy image still loading at capture                                      |

**Zero in all 900 runs:**

- **Layout:** horizontal document overflow, element edge overflow, clipped text, vertical clipping, clipped display words, WCAG 2.5.8 target failures, overlapping targets.
- **Loading and errors:** broken images, font load errors, failed requests or 4xx/5xx responses (excluding the two `/_vercel/*` analytics scripts, which only exist on Vercel), and console errors (same exclusion).
- **Motion:** text left hidden or stuck after a scroll-through, and running animations under reduced motion.
- **Keyboard:** focus not visible, and focus fully obscured.

Breakdown of the non-zero columns:

- **Ellipsis.** The current-page crumb in the breadcrumb truncates long titles. The full title is the `h1` directly below, so this is by design.
- **Contrast.**
  - The portfolio operating model's inactive steps (RG-A1) fail at every width in both engines, about half of these runs. This is fixed on `main` by #269; see DM-04.
  - The rest are captured mid-fade and pass at rest (DM-05).
- **Other axe.** Only `scrollable-region-focusable` on code blocks (DM-06, fixed on `main` by #273).
- **Scroll regions not focusable.** The same code blocks, measured directly.

**Additional checks at 390 and 1440 (Chromium and WebKit, 30 routes each):**

- **Menu.** It opens, shows five links of 356×47 at 390, closes on Escape and returns focus to the toggle in both engines. WebKit leaves focus on `body` after a mouse click on the toggle, which is the macOS click-focus convention, not a defect.
- **Dialog.** On the four case studies with screenshots (LedgerGuard, AlwaysGeeky, TallyFolio, MapBylaw), the dialog opens with focus inside, Escape closes it and focus returns to the opener in both engines. The dialog is 374×637 at 390×844.
- **Keyboard.**
  - First stop is "Skip to content". The automated indicator check flagged the home and portfolio project rows; a manual check shows they invert to a light fill when focused (`:focus-visible` true, text `#0f0f0e` on the light card), so this is a false positive.
  - Order goes across the hero's two columns on case studies: the live link, then back up to "Enlarge". On home the order goes from the contact form to the contact rows beside it. Both follow the DOM's reading order (Info).
- **Back/Forward.** See DM-01.
- **LCP and CLS.** See the next table.

### LCP and CLS (local, indicative only)

Localhost with no network throttling and a warm server cache, so these are only useful for comparing routes. LCP is in ms. CLS is at load / after a full scroll. W = Playwright WebKit (not Safari).

| Route                             | Chromium 390       | W 390          | Chromium 1440          | W 1440         |
| --------------------------------- | ------------------ | -------------- | ---------------------- | -------------- |
| `/`                               | 44 · 0 / 0.002     | 62 · 0 / 0     | 112 · 0 / 0            | 131 · 0 / 0    |
| `/portfolio`                      | 32 · 0 / 0.008     | 83 · 0 / 0     | 124 · 0 / 0            | 96 · 0 / 0     |
| `/writing`                        | 32 · 0 / 0         | 92 · 0 / 0     | 112 · 0.001 / 0.002    | 94 · 0 / 0     |
| `/open-source`                    | 40 · 0 / 0         | 111 · 0 / 0    | 56 · 0 / 0             | 91 · 0 / 0     |
| `/engineering-principles`         | 32 · 0 / 0         | 53 · 0 / 0     | 80 · 0 / 0             | 92 · 0 / 0     |
| `/now`                            | 60 · 0 / 0         | 40 · 0 / 0     | 56 · 0 / 0             | 55 · 0 / 0     |
| `/404`                            | 28 · 0 / 0         | 95 · 0 / 0     | 44 · **0.038** / 0.038 | 73 · 0 / 0     |
| `/writing/agent-readiness-doctor` | 28 · 0 / 0.007     | 43 · 0 / 0     | 88 · 0 / 0             | 36 · 0 / 0     |
| Case studies (7), range           | 40–72 · 0 / ≤0.006 | 74–311 · 0 / 0 | 36–60 · 0 / 0          | 73–138 · 0 / 0 |
| Posts (15), range                 | 32–72 · 0 / 0      | 48–783 · 0 / 0 | 40–76 · 0 / 0          | 47–99 · 0 / 0  |

### Typography and images

- **Typography.**
  - Display headings scale smoothly with width. For example, `/now` measures 36px at 320, 45 at 390, 92 at 768, 177 at 1440 and 238 at 1920. An article `h1` measures 20–24px at 320, 26–30 at 390, 35–38 at 768 and 71–76 at 1440 and above.
  - An article's first paragraph (the standfirst) is 18px up to tablet widths and 21.6–22px on desktop.
  - The smallest text is the 11px mono labels, as the design specifies. The contribution graph's month labels on `/open-source` are smaller (DM-10).
- **Responsive images.**
  - No under-delivery anywhere: every chosen candidate covers rendered width × DPR.
  - The case-study intro screenshot picks one srcset step above the smallest sufficient candidate at some sizes (DM-09). For example, at 390@3x it renders 322px wide (966 device px needed) and picks 1200w.
  - The dialog's full-size images (`sizes="96vw"`) only load when the dialog opens.
- **Assets.** No font, script, stylesheet or image request failed or returned 4xx/5xx, except `/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js`, which are 404 under `next start` and served by Vercel in production. Archivo (normal), Archivo italic (loaded where used) and Geist Mono all load.

## Findings

| ID    | Sev  | PR of origin                                           | Finding and evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Already fixed?                                                                                                                                    | Disposition                                                                                                                                                                                                           | Acceptance criteria                                                                                                                                                                                                                                                    |
| ----- | ---- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DM-01 | P2   | Before the range (`2bf26be`, the Lenis integration)    | **Back/Forward never restores the reader's place.**<br>`components/RouteChangeFocus/RouteChangeFocus.tsx:13-18` forces `history.scrollRestoration = "manual"`, and `:20-46` calls `scrollToTop()` on every pathname change, including popstate.<br>On `/portfolio/ledgerguard` at 390, scrolled to y=10902, following "Related work" then pressing Back lands at y=0 (Chromium and WebKit; [evidence](evidence/device-matrix/dm01-back-resets-scroll-390.png)).<br>Back to a `#hash` entry after leaving the page lands at y=0 in Chromium on 49 of 51 route checks. WebKit reaches the section only because its `hashchange` fires. | Yes, #288 merged after the matrix run (`05cc19c`)                                                                                                 | **Fixed in #288:** a popstate step keeps the browser's restored position, and link navigations still go to the top and focus `main`.                                                                                  | Back after following a link restores the position within 40px, and Back to a hash entry lands on the section, in Chromium and WebKit at 390 and 1440. `e2e/history.e2e.ts` in #288. With #288: route Back is correct on 113 of 116 checks and hash Back on 102 of 102. |
| DM-02 | P3   | Launch page scene                                      | **With #288, Back to `/writing/agent-readiness-doctor` lands about 1,780px below the saved position.** Seen in Chromium 1440, WebKit 1440 and WebKit 390, not at the top. A trace shows the position is already shifted when the page is left. That matches the launch scene's height change between its tall (animated) and static forms; this cause is not confirmed.                                                                                                                                                                                                                                                              | No                                                                                                                                                | Report to the owner of the launch scene (T2).                                                                                                                                                                         | Back to the launch page after following an in-article link restores the position within 40px in both engines.                                                                                                                                                          |
| DM-03 | P3   | Writing (publication policy)                           | **The scheduled post reads as published.** On `/writing/preparing-integrations-for-anthropic-and-cursor-directories` (dated 2026-10-28; audited on 2026-10-27), the facts panel says "Published Oct 28, 2026" with no marker. The approved reader artifact puts a "Scheduled" pill first in the topics for a future-dated post ([evidence](evidence/device-matrix/dm05-scheduled-label-1440.png), artifact left, live right). `/writing` does label it "Upcoming".                                                                                                                                                                   | No                                                                                                                                                | **Owner decision:** part of `docs/decisions/writing-publication-policy.md`. No code change, because scheduled-publication behaviour is out of scope here.                                                             | If kept public before its date, the article page marks it as scheduled, as the artifact does.                                                                                                                                                                          |
| DM-04 | P2   | Operating-model scene; RG-A1 (known before this audit) | **Portfolio operating-model inactive step labels fail AA contrast** at every width in both engines on `de7fac2` (4–6 nodes per run).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | **Yes, #269.** Re-checked on `cf528c8`: no `color-contrast` violations at 390 or 1440 in Chromium or WebKit, after a scroll-through and at rest.  | Fixed (T2).                                                                                                                                                                                                           | `e2e/scene-contrast.e2e.ts` (on `main`).                                                                                                                                                                                                                               |
| DM-05 | P3   | Launch scene; engineering principles                   | **Contrast measured mid-fade.** Right after a scroll-through, axe flags these during their 0.3–0.45s fades: <ul><li>the launch scene's third step (1.9–3.1:1)</li><li>the scene's repository "after" values `.new` (1.7–2.5:1; 1.03–1.12:1 at the start of the fade)</li><li>the aria-hidden principle numeral at 768–820 (1.4–1.6:1)</li></ul>All pass 2 seconds later, re-checked on `cf528c8` in both engines. The repository rows also put both the "before" and "after" value in the accessibility tree; the hidden one is only at opacity 0.                                                                                   | n/a                                                                                                                                               | **No action** for the fades. For T2: `scene-contrast.e2e.ts` checks only the portfolio halfway through a change. Whether screen readers should hear both repository values is a content question for the scene owner. | At rest, no `color-contrast` violations (already true).                                                                                                                                                                                                                |
| DM-06 | P3   | Article prose; RG-A2                                   | **Wide code blocks scroll sideways but cannot take keyboard focus.** axe `scrollable-region-focusable` (serious): <ul><li>Chromium and WebKit at 390: the same 7 articles (`agent-instructions-are-code`, `deterministic-review-triage-for-agent-prs`, `designing-a-small-library-for-logs-too-big-to-hold`, `how-i-structure-a-frontend-that-owns-almost-no-truth`, `how-i-would-build-a-real-time-backgammon-platform`, `ledgerguard-truth-between-extraction-and-finance`, `mapbylaw-ai-recommendations`)</li><li>Measured directly: 7 articles at 320 to 430 in both engines</li></ul>                                           | **Yes, #273.** Re-checked on `cf528c8`: 0 violations on all 7 articles at 390 in Chromium and WebKit; every overflowing `pre` has `tabindex="0"`. | Fixed (T2).                                                                                                                                                                                                           | Every code block or table wider than its column can be reached and scrolled by keyboard in Chromium and WebKit.                                                                                                                                                        |
| DM-07 | P3   | Shell and breadcrumbs                                  | **Phone targets under 44px (AAA 2.5.5; AA 2.5.8 passes everywhere).** At 390: <ul><li>"Book a call" 152×28</li><li>breadcrumb links about 33×16–18</li><li>"Pause automatic motion" 204×18</li><li>contents rows 322×39–40</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                 | n/a. The sizes are unchanged on `cf528c8` (#274 gates the shell at AA size and overlap).                                                          | T4 (Book a call, nav, footer).                                                                                                                                                                                        | Only if the owner adopts 44px: the shell controls reach 44px tall on touch viewports.                                                                                                                                                                                  |
| DM-08 | P3   | Not-found page / shell                                 | **`/404` layout shift in Chromium.** CLS 0.038 at 1440 (0.034 at 1280, 0.028 at 1024), 3 of 3 loads, about 40ms after load. The sources are the "404" display text and the primary nav, which widens by 4px. WebKit 0. Other routes are 0 to 0.008.                                                                                                                                                                                                                                                                                                                                                                                  | No                                                                                                                                                | Report. Below the 0.1 threshold and local only.                                                                                                                                                                       | CLS 0 on `/404` at desktop widths in Chromium.                                                                                                                                                                                                                         |
| DM-09 | P3   | Case-study rebuild (`18cf795`)                         | **The case-study intro screenshot's `sizes` overstates its width:** `features/portfolio/CaseStudyIntro.tsx:91` sets `(max-width: 760px) 100vw, 58vw`. The image is about 83% of the viewport at 390 and 49% at 768. Next.js therefore picks one step larger than needed: <ul><li>1200w where 1080 suffices (390@3x, 375@3x, 1920@1x)</li><li>1080w where 828 suffices (768@2x, 820@2x)</li></ul>                                                                                                                                                                                                                                     | No                                                                                                                                                | Report. A performance nit; there is no visual defect.                                                                                                                                                                 | The chosen candidate is the smallest that covers rendered width × DPR at the matrix sizes.                                                                                                                                                                             |
| DM-10 | Info | Open-source contribution graph                         | **The graph's month labels render about 8px tall below 768.** The SVG `<text>` is 9 units in a 720px-minimum graph inside a horizontal scroller. The same data is in the contribution table.                                                                                                                                                                                                                                                                                                                                                                                                                                         | n/a                                                                                                                                               | No action.                                                                                                                                                                                                            | n/a                                                                                                                                                                                                                                                                    |
| DM-11 | Info | Design parity                                          | **Drift without an explanation in the implementation notes.** <ul><li>The `/404` artifact draws a focus ring around the region it focuses on load. Production focuses `main` without a visible ring.</li><li>The home and case-study `h1` choices (positioning statement; product name, with the display word as a paragraph) are intended semantics, but only the portfolio `h1` is written down in `docs/design/implementation/README.md`.</li></ul>                                                                                                                                                                               | n/a                                                                                                                                               | **Owner decision** on the 404 ring. A docs note for T1.                                                                                                                                                               | The implementation notes record both choices.                                                                                                                                                                                                                          |

## Design parity

The approved artifacts in `docs/design/pages/*.html` were opened as local files in Playwright Chromium and compared with the live build at 1440×900 and 390×844, with reduced motion. The artifacts have no viewport meta tag (their publish wrapper adds it), so they were rendered with a 390px layout viewport and `body { margin: 0 }`, which the implementation reports also use.

Pairs: home, portfolio, all seven case studies, open source, writing, Agent Readiness Doctor, and the reader with five posts: three representative ones, the scheduled one, and `how-i-would-design-a-document-review-workspace`. Then engineering principles, Now, and Not found: 20 pairs at two widths each.

### Layout, type, spacing, colour

These match:

- **Colour.** Body ground `rgb(15,15,14)` and text `rgb(236,236,230)` on every page and width.
- **Fonts.** Archivo (variable, normal and italic) and Geist Mono. Production loads Geist Mono as one variable face; the artifact loads 400 and 500.
- **Frame.** Full-bleed with the same gutters at both widths.
- **Type.** Display heading sizes, weight 800, width 125% (112% for article titles) and letter-spacing are identical to the artifact at both widths on every page that shares the element. For example:

  | Page                   | 1440      | 390      |
  | ---------------------- | --------- | -------- |
  | Writing                | 132.164px | 32.752px |
  | Article titles         | 73.112px  | 29.904px |
  | Engineering principles | 143.412px | 35.6px   |
  | Now                    | 177.156px | 44.856px |
  | 404                    | 70.3px    | 34px     |
  | Home display word      | 163.096px | 40.584px |

  The case-study display words are within 1.5px. For example, LedgerGuard is 122.4 in the artifact and 123.85 live.

Page heights:

| Page                                                             | 1440           | 390            |
| ---------------------------------------------------------------- | -------------- | -------------- |
| Case studies, writing, open source, principles, Now, launch page | +0.4% to +2.7% | +0.4% to +2.7% |
| Home                                                             | +4.2%          | +4.5%          |
| Portfolio                                                        | +17.6%         | +13.9%         |
| Articles with comparison diagrams                                | −3% to −9%     | −3% to −9%     |
| 404                                                              | +4.7%          | +10.4%         |

### Intended and documented differences

These are recorded in `docs/design/implementation/README.md`, `case-studies/README.md` or `writing/README.md`, or are accessibility adaptations:

- **Shell.**
  - Five production nav links instead of the artifact's four, folding into a menu below 520px. At 390 the artifact shows a second row of links.
  - The footer adds contact links and the "Automatic motion" toggle.
  - The breadcrumb reads "Case studies".
- **Headings.**
  - Every page keeps one `h1`; display words are read once.
  - Case-study section headings are `h2` (the artifact uses `h3`), and subsection `h3`s were added.
  - The portfolio `h1` is "[ Portfolio ]" (documented).
  - The home and case-study `h1` choices are intended but not documented (DM-11).
- **Screen-reader text.**
  - Comparison diagrams carry visually hidden "Chosen" / "Not chosen" text.
  - `/open-source` adds a contributions-per-month table as the text alternative to the graph.
- **Content.**
  - Production copy is kept where the artifact had its own. The portfolio intro, profile strip and "Own the whole stack / Build shared systems / Check before merge" cards are replaced by the production summary, capability list and "What to look for". That is the portfolio height difference.
  - The home tools list is newer than the artifact: Agent Readiness MCP, Agent Readiness skill and plugins, and GitBot Agent Readiness Doctor (Oct 2026) replace agent-context-doctor, agent-pr-reviewer-lite and agent-readiness-kit (Sep 2026).
  - The contribution snapshot wording was corrected in `a044b20`.
- **Screenshots.** Real screenshots at their own ratios, with redacted LedgerGuard and MapBylaw dashboards. The captions and the window URL labels differ, for example `login.voxies.io` against `market.voxies.io` on AlwaysGeeky's evidence figure.
- **Writing.**
  - Comparison diagrams render as designed. The artifact's prose styles leak into them, which explains the shorter articles.
  - The timeline cursor rests on the newest post.
  - "More writing" lists every post, including the launch article as an ordinary dated row. The artifact appends a separate "Agent Readiness Doctor / Read the launch article" row only because its reader excludes that post. Same destination, different label: no action.
- **Motion.** All idle time-based drift was removed, and scenes are static under reduced motion.

### Drift without an explanation

- The "Scheduled" marker is missing on the scheduled post (DM-03, owner decision).
- The `/404` auto-focused region shows no ring (DM-11, owner decision).
- The home and case-study `h1` choices are undocumented (DM-11, docs only).

No unexplained layout, spacing, colour or component drift was found. Every component in the artifacts is present: tickers, display words, chapter rail, screenshot frames with dialog, facts panel, decision cards, flow bands, compare and layers diagrams, contribution graph, timeline, filters, and the Now ruler.

## Limitations

- **No real devices.** Every phone and tablet result is Playwright emulation. Emulation does not reproduce mobile browser chrome (dynamic toolbars, `100vh` behaviour), real touch input, OS font scaling, iOS text autosizing or real GPU and network performance.
- **WebKit is Playwright WebKit (not Safari).** It shares the engine but not Safari's UI, ITP, media and font settings, or iOS behaviour.
  - Keyboard order in WebKit used Option+Tab: plain Tab skips links in macOS WebKit by default, as in Safari.
  - LCP is reported by this WebKit build. WebKit reports no `layout-shift` entries (the Layout Instability API is Chromium-only), so the WebKit CLS figures are not measurements.
- **Firefox was not tested.** Playwright Firefox (build 1555, Firefox 157, and the older 1543) exits at launch on this macOS host with "Could not find profile folder", both inside and outside the sandbox. No Firefox results exist; the minimum Firefox set (390×844, 820×1180, 1440×900) is still open and should run on Linux CI or another Mac.
- **Zoom is emulated.** "200%" and "400%" are 640×400@2 and 320×200@4 CSS viewports. They equal a 1280×800 window zoomed, but this is not browser zoom (no text-only zoom, and no minimum font size).
- **Vitals are local.** LCP and CLS are from localhost with no throttling: use them to compare routes, not as field data.
- **Contrast is automated.** It is axe's computed contrast at the moment of the scan. Text over images and canvas was not checked by eye.
- **Design artifacts need fonts from the network.** They load fonts from Google Fonts. The run had network access and the fonts loaded, but parity was not checked offline.
