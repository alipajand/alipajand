# Execution queue

> Audit of the Pajand Hairline design artifacts against the Next.js application.
> Frozen revision: `b8856fec6703f6213d5b6e4ac42a9c0f86b3f375` (PR #223 head, branch `ali/nostalgic-blackwell-0b3838`). The brief expected `6e0ffc8`; the head had advanced by three commits (`d6dc60a`, `89a649f`, `b8856fe`), all inside `docs/design/`.
> Application baseline: the same revision. Next.js 16.4.2, React 19.3.1 installed. `origin/main` is 6 commits ahead of the merge base `6f43749` (PR #222 and dependency bumps; see M-05).
> Every finding states a severity (Critical, High, Medium, Low, Info) and a status: **Verified failure** (reproduced from code, build output or capture), **Risk** (pattern confirmed, impact not reproduced) or **Untested** (could not be checked read-only).

The queue is ordered by dependency, not by page. Each step lists:

- what it depends on;
- the findings it closes;
- the acceptance criteria that end it.

Steps marked **Parallel** can run alongside the step before them once their own dependencies are met.

## Q-00: Owner decisions (blocks Q-03, Q-04, Q-07, Q-08 and Q-09)

Implementation should not guess these. Each one changes positioning, factual claims, privacy or public behaviour.

| ID | Decision | Findings | Blocks |
| --- | --- | --- | --- |
| DEC-1 | The 80% and 90% outcome claims. Supply evidence, reword, or drop them. They remain on the live site, in `llms.txt` and in the embedded artifact JSON. | C-03, C-04, C-11, A-11 | Q-04 |
| DEC-2 | Are the TallyFolio dashboard figures real personal finances? Should the personal email shown in the MapBylaw (and truncated in the LedgerGuard) dashboard images stay public? | C-05, C-06 | Q-02b, Q-04 |
| DEC-3 | How to label LedgerGuard design-prototype images, and whether they may sit under the `ledgerguard.io` frame bar | C-01, C-02 | Q-04, Q-08 |
| DEC-4 | Information architecture. Should the nav drop "Principles"? Should the home `<h1>` change from the positioning line to the name? What replaces "Additional experience"? Should the Lead / Supporting / Experiment labels be used, and where does role availability copy come from? | A-10, A-11, C-09, C-10, C-17 | Q-04, Q-07, Q-09 |
| DEC-5 | Motion policy versus the `CLAUDE.md` UI rules. Covers tickers, canvases and the blinking dot, plus whether a pause control is acceptable. | C-19, D-06 | Q-06 |
| DEC-6 | Contribution activity source: live Algora image (main), build-time snapshot (artifact), or a server fetch with revalidation | A-12 | Q-08 |
| DEC-7 | Keep or remove Lenis | D-26 | Q-06, Q-07 |
| DEC-8 | Analytics consent policy (GA, Vercel Analytics, Speed Insights) and DNT/GPC handling | B-26, B-27 | Q-13 |

Acceptance: each decision is recorded in `docs/design/implementation-audit/09-risk-register.md` (decision log section) with the owner's answer and date.

## Q-01: Bring the branch up to date (no dependencies)

- Bring PR #223's branch up to date with `main`. `main` adds PR #222 (Algora card), `next@^16.4.3` and the `resend` bump. Then rebuild the artifacts and rerun this audit's capture script.
- Findings: M-05, A-12 (prerequisite).
- Acceptance: `git merge-base --is-ancestor origin/main HEAD` succeeds; `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` pass; the installed `next` is 16.4.3 or later.

## Q-02: Production defects independent of the redesign (depends on Q-01)

These ship on their own and must not wait for the visual port.

- **Q-02a. Scheduled posts.**
  - Use one `getPublishedPosts()` for the sitemap, feed, `llms.txt`, `llms-full.txt` and OG images.
  - Emit `noindex` on unpublished post pages, and set a revalidation interval on the static exports.
  - Findings: A-01, B-24, B-25, A-05.
- **Q-02b. Screenshot privacy.** Replace or crop images per DEC-2. Findings: C-05, C-06.
- **Q-02c. Contact API hardening and tests.**
  - Add a honeypot, a rate limit, length caps and a content-type/origin check.
  - Return generic visitor-facing errors and a 400 for malformed JSON.
  - Add the first route tests.
  - Findings: B-01, B-02, B-03, B-04, A-13. Changing `app/api/contact` needs explicit approval under `AGENTS.md`.
- **Q-02d. Manifest icon.** Fix the icon path and declared size. Finding: A-03.
- **Q-02e. Navigation defects.**
  - Restore scroll on Back/Forward.
  - Reset the mobile menu when the viewport crosses the breakpoint, and stop Lenis while the menu is open.
  - Findings: B-10, B-12, B-13, B-14.
- **Q-02f. Content hidden before JavaScript.** Remove CSS hiding of the hero and sections. Findings: B-18, M-01.

Acceptance: each sub-step has a failing test first, then a passing one. With the clock fixed at 2026-10-27, the scheduled post is absent from the sitemap, feed and llms and its page is `noindex`. The LCP on `/portfolio/alwaysgeeky` and `/portfolio/mapbylaw` with motion enabled falls to within 200 ms of the reduced-motion value in the same capture run.

## Q-03: Guidance and docs refresh (depends on Q-00) (parallel with Q-02)

- Update `AGENTS.md`, `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/ROUTES.md` and `docs/SITE_STRUCTURE.md` to match the code and the Q-00 decisions:
  - Next.js 16;
  - the real env var names;
  - the webhook route listed as protected;
  - the test policy;
  - the motion rules.
- Findings: A-02, A-04, C-15, C-16, C-17, C-18, C-20, C-21, D-29.
- Acceptance: no stale version, env name or nonexistent file remains in those documents (grep for `Next.js 15`, `CONTACT_TO_EMAIL`, `experience.ts`).

## Q-04: Content and provenance in `data/` (depends on Q-00: DEC-1, DEC-3, DEC-4)

- Add image provenance and status fields.
- Correct the alt text, captions and TallyFolio dimensions.
- Move the approved hand-written kit copy into `data/*.ts`.
- Fix `scrubCase()` so that omitted claims never reach serialised JSON.
- Findings: C-01, C-02, C-03, C-07, C-08, C-09, C-10, C-12.
- Acceptance:
  - `grep -c "80%" docs/design/pages/*.html` matches DEC-1.
  - Every image in `data/projects.ts` has a status.
  - The kit copy check script reports no unmatched sentences.

## Q-05: Foundations (depends on Q-01) (parallel with Q-02 to Q-04)

- Add the Hairline tokens to `@theme` (additive).
- Load Archivo (with `wdth` and italics) and Geist Mono through `next/font`.
- Add the component CSS layer, the breakpoints and the frame container.
- Findings: D-09, D-21, D-24.
- Acceptance:
  - Existing routes render pixel-identical to the pre-change capture, because the tokens are additive only.
  - Fonts are self-hosted, with no Google CSS request.
  - CLS from font swap is below 0.01.

## Q-06: Motion runtime (depends on Q-05 and DEC-5, DEC-7)

- Build the shared scroll scheduler, the live `useReducedMotion`, IntersectionObserver and visibility gating, a ticker pause control, and GSAP context cleanup.
- Use CSS scroll-driven animations where supported.
- Findings: D-01, D-02, D-03, D-04, D-06, D-17, D-18, D-19, B-19, B-20, B-21, B-22.
- Acceptance:
  - Five seconds idle shows zero page rAF callbacks.
  - A client-side route change leaves no listeners.
  - Toggling the OS motion setting at runtime updates every island.
  - Each auto-moving element can be paused from the keyboard.

## Q-07: Shared chrome (depends on Q-05, Q-06, DEC-4, DEC-7)

- Build the Hairline nav with the mobile menu contract, the footer and NextLinks, the skip link, `<main>`, the scroll progress bar, the pager and breadcrumbs, and the error boundaries.
- Findings: A-09, B-11, B-15, B-28, B-29, D-15, D-26, D-27, M-06.
- Acceptance:
  - Keyboard-only navigation reaches every link in order, with a visible focus ring at 3:1 or better.
  - The menu works at 320 px.
  - `app/error.tsx` renders inside the chrome.
  - Landmarks match the current production set, as `AGENTS.md` requires.

## Q-08: Content components (depends on Q-05, Q-06, Q-07, Q-04, DEC-3, DEC-6)

- Build each component as a Server Component unless it is listed as an island in 03:
  - DisplayWord (no post-paint fitting);
  - FactsPanel, CaseSection, DecisionCard and ChapterRail;
  - the Layers, Compare and Flow diagrams (with label fitting under reduced motion);
  - ScreenshotFrame and the lightbox;
  - Ticker and Badges;
  - the activity graph;
  - the hero canvases, with static fallbacks.
- Findings: D-05, D-07, D-08, D-10, D-11, D-16, D-20, D-23, D-25, B-17, B-23, A-08.
- Acceptance: each component has a Testing Library test that covers the ARIA contract in 03, keyboard use, reduced motion and unmount. Components render their content with JavaScript disabled.

## Q-09: Route ports (depends on Q-08; order chosen by component reuse)

1. **`/portfolio/[slug]`, all seven case studies.** One template exercises the most components (rail, diagrams, screenshots, lightbox, decisions, pager).
2. **`/portfolio`.**
3. **`/open-source`.** Activity graph per DEC-6; copy buttons are announced (D-28).
4. **`/writing` and `/writing/[slug]`.**
   - Canonical URLs are kept and the `#slug` reader is not ported.
   - The TOC covers h2 and h3, and focus is handled on in-page navigation.
   - Findings: B-16, D-22, A-07.
5. **`/engineering-principles`, `/now`, then the not-found page.**
6. **`/` last.**
   - The contact form keeps the production pipeline and gains the artifact's error-summary contract.
   - The `<h1>` follows DEC-4.
   - Findings: B-05, B-06, B-07, B-08, D-14, A-10.

Acceptance for each route:

- **Parity.** The capture at 1440 and 390 px matches its artifact (layout, type, colour, hairlines) except where 02 records an intentional difference.
- **Metadata and URLs.** Metadata, canonical and JSON-LD are unchanged or improved (A-15).
- **Validation.** `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` pass.
- **Performance.** The JS and LCP budgets in Q-12 hold.

## Q-10: Accessibility pass (runs per route inside Q-09)

- Findings: D-12, D-13, D-14, D-15, D-16, A-09.
- Acceptance:
  - All text/background pairs listed in 05 meet WCAG 2.2 AA in every state (rest, hover, focus, active, disabled).
  - Non-text graphics meet 3:1.
  - The activity graph detail is reachable by keyboard.

## Q-11: SEO and nonvisual regression (depends on Q-09)

- Findings: A-06, A-07, A-14, A-15.
- Acceptance:
  - Tests cover the sitemap, feed, llms, OG images, manifest and redirects.
  - `dynamicParams = false` is set on `/writing/[slug]` and `/portfolio/[slug]`.
  - No `claude.ai` URL appears in `data/`, `components/`, `features/` or `app/`.

## Q-12: Performance verification (depends on Q-09)

- Findings: M-01, M-02, M-03.
- Acceptance, re-measured with the same capture method:
  - LCP is not delayed by entrance motion.
  - CLS is below 0.05 on every route.
  - Uncompressed client JS on case studies is at least 30% below the 728 KB baseline.
  - Speed Insights field data shows no regression after release.

## Q-13: Analytics consent (depends on DEC-8 and Q-01) (parallel)

- Findings: B-26, B-27.
- Acceptance: no analytics request before consent; DNT and GPC are respected; outbound-link events fire once per click.

## Q-14: Retire preview-only mechanisms (depends on Q-09)

- Keep `docs/design/` as the reference.
- Document that `urls.json`, `fit.js`, hash routing and the artifact contact form are preview-only and must not be imported by the app.
- Acceptance: `grep -r "docs/design" app components features utils` returns nothing.
