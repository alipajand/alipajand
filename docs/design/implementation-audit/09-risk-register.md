# Risk register

> Audit of the Pajand Hairline design artifacts against the Next.js application.
> Frozen revision: `b8856fec6703f6213d5b6e4ac42a9c0f86b3f375` (PR #223 head, branch `ali/nostalgic-blackwell-0b3838`). The brief expected `6e0ffc8`; the head had advanced by three commits (`d6dc60a`, `89a649f`, `b8856fe`), all inside `docs/design/`.
> Application baseline: the same revision. Next.js 16.4.2, React 19.3.1 installed. `origin/main` is 6 commits ahead of the merge base `6f43749` (PR #222 and dependency bumps; see M-05).
> Every finding states a severity (Critical, High, Medium, Low, Info) and a status: **Verified failure** (reproduced from code, build output or capture), **Risk** (pattern confirmed, impact not reproduced) or **Untested** (could not be checked read-only).

Every finding in this audit, ranked by severity. Full evidence, remedy and acceptance criteria live in the linked document. No Critical findings were found.

### Totals

| Severity | Verified failure | Risk | Untested | Verified / info |
| --- | --- | --- | --- | --- |
| Critical | 0 | 0 | 0 | 0 |
| High | 7 | 2 | 1 | 0 |
| Medium | 24 | 16 | 1 | 5 |
| Low | 9 | 10 | 4 | 13 |
| Info | 1 | 1 | 1 | 6 |

### Decisions that need the owner

These are not defects to fix silently; they change positioning, factual claims, privacy or public behaviour. They are DEC-1 to DEC-8 in [10](10-execution-queue.md#q-00-owner-decisions-blocks-q-03-q-04-q-07-q-08-and-q-09).

| ID | Topic | Driven by | Answer | Date |
| --- | --- | --- | --- | --- |
| DEC-1 | 80% and 90% outcome claims | C-03, C-04, C-11, A-11 | pending | |
| DEC-2 | Personal finance figures and email in screenshots | C-05, C-06 | pending | |
| DEC-3 | Labelling of LedgerGuard design-prototype images | C-01, C-02 | pending | |
| DEC-4 | Nav, home `<h1>`, section and label copy | A-10, A-11, C-09, C-10, C-17 | pending | |
| DEC-5 | Motion policy and pause control | C-19, D-06 | pending | |
| DEC-6 | Contribution activity source | A-12 | pending | |
| DEC-7 | Keep or remove Lenis | D-26 | pending | |
| DEC-8 | Analytics consent and DNT/GPC | B-26, B-27 | pending | |

### Untested parts

These findings have at least one part that could not be checked read-only and needs a browser, a device, production configuration or the owner: A-06, A-13, A-14, B-05, B-10, B-13, B-20, B-21, B-26, B-27, C-02, C-06, C-14, D-02, D-05, D-07, D-11, D-27. Also untested: behaviour on iOS Safari and Android Chrome, Vercel edge rate limiting on `/api/contact` (documented in `docs/ARCHITECTURE.md` but not visible in the repository), whether Google Analytics is enabled in production, and compressed transfer sizes.

### Register

| ID | Severity | Status | Finding | Detail | Queue |
| --- | --- | --- | --- | --- | --- |
| A-01 | High | Verified failure (existing build output) | Scheduled post leaks into sitemap, RSS, llms exports, and an indexable page before its date | [05](05-seo-accessibility.md#a-01) | Q-02 |
| A-07 | High | Risk (verified in artifact source) | Hairline artifact link conventions that break production URLs if copied | [04](04-interaction-matrix.md#a-07) | Q-09, Q-11 |
| B-01 | High | Verified failure** (code + grep) | Contact API has no abuse controls (rate limit, honeypot/bot check, size caps, content-type/origin check) | [04](04-interaction-matrix.md#b-01) | Q-02 |
| B-18 | High | Risk** (code-verified; failure scenario not reproduced) | Hero and every cinematic section are hidden by CSS before JS runs | [06](06-motion-performance.md#b-18) | Q-02 |
| C-01 | High | Verified failure | LedgerGuard design-prototype captures are framed and captioned as the shipped product | [07](07-content-and-assets.md#c-01) | Q-00, Q-04 |
| C-03 | High | Verified failure (relative to the stated rule that "two claims were deliberately omitted") | The Emplifi 80% claim is still shipped inside `case-emplifi.html` | [07](07-content-and-assets.md#c-03) | Q-00, Q-04 |
| C-06 | High | Untested (cannot be determined from the repo) | The TallyFolio dashboard may show real personal finance data | [07](07-content-and-assets.md#c-06) | Q-00, Q-02 |
| D-01 | High | Verified failure (by code) | Unbounded per-frame loops that never stop or yield | [06](06-motion-performance.md#d-01) | Q-06 |
| D-06 | High | Verified failure (by code) | Auto-moving and blinking content with no pause control (WCAG 2.2.2) | [06](06-motion-performance.md#d-06) | Q-00, Q-06 |
| D-09 | High | Verified failure (parity gap) | Font stack parity: production lacks Archivo (with wdth and italics) and Geist Mono; artifact uses render-blocking Google CSS | [02](02-artifact-parity-matrix.md#d-09) | Q-05 |
| A-02 | Medium | Verified failure (docs vs code) | docs/*` and `AGENTS.md` declare Next.js 15, static-only rendering, server-component defaults, and wrong env names | [08](08-architecture-plan.md#a-02) | Q-03 |
| A-03 | Medium | Verified failure | manifest.json` points at a non-existent `/icon.png` | [01](01-route-coverage.md#a-03) | Q-02 |
| A-06 | Medium | Risk / **Untested | getPostBySlug` builds a filesystem path from the raw URL segment | [01](01-route-coverage.md#a-06) | Q-11 |
| A-08 | Medium | Risk (verified in artifact HTML) | Artifacts render key headings and content client-side; a literal port would regress SEO and no-JS rendering | [05](05-seo-accessibility.md#a-08) | Q-08 |
| A-09 | Medium | Risk (verified: 0 of 16 artifacts have a skip link or `lang`; only `not-found | Artifacts drop the skip link, `<main>`, `lang`, JSON-LD and metadata; AGENTS.md forbids changing landmarks without approval | [05](05-seo-accessibility.md#a-09) | Q-07, Q-10 |
| A-11 | Medium | Risk | Redesign IA and content changes need sign-off (CLAUDE.md conflicts) | [02](02-artifact-parity-matrix.md#a-11) | Q-00 |
| A-13 | Medium | Untested | No tests for the contact API route | [01](01-route-coverage.md#a-13) | Q-02 |
| B-02 | Medium | Verified failure | Provider error text and deployment guidance are shown to site visitors | [04](04-interaction-matrix.md#b-02) | Q-02 |
| B-03 | Medium | Verified failure | api/contact` has zero automated tests | [04](04-interaction-matrix.md#b-03) | Q-02 |
| B-05 | Medium | Risk** (code-verified; screen-reader/browser behaviour Untested) | Focus and announcements after submit are fragile | [04](04-interaction-matrix.md#b-05) | Q-09 |
| B-07 | Medium | Verified failure** (design/production mismatch) | Artifact form contract differs from production (focus target, field links, persistent status, missing email fallback) | [04](04-interaction-matrix.md#b-07) | Q-09 |
| B-10 | Medium | Verified failure** (code; behaviour confirmed by existing spec expectations, browser run Untested) | Browser Back/Forward always jumps to the top of the page | [04](04-interaction-matrix.md#b-10) | Q-02 |
| B-12 | Medium | Risk** (absence of handler verified in code; resize/rotation scenario not run in a browser) | Mobile menu state survives a breakpoint change, leaving page inert and scroll-locked | [04](04-interaction-matrix.md#b-12) | Q-02 |
| B-16 | Medium | Verified** (artifact behaviour) / production compliant today | Artifact reader hash routing and TOC contract must not be ported as-is | [04](04-interaction-matrix.md#b-16) | Q-09 |
| B-17 | Medium | Verified failure** (feature gap) | No screenshot enlarge/lightbox in production; artifact specifies one | [04](04-interaction-matrix.md#b-17) | Q-08 |
| B-19 | Medium | Verified failure** (code) | GSAP work is not torn down on unmount; DOM mutated under React | [06](06-motion-performance.md#b-19) | Q-06 |
| B-24 | Medium | Verified failure | Future-dated posts are filtered inconsistently across surfaces | [04](04-interaction-matrix.md#b-24) | Q-02 |
| B-26 | Medium | Risk** (code verified; whether `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in production is **Untested**) | Analytics load without consent; no DNT/GPC handling | [04](04-interaction-matrix.md#b-26) | Q-00, Q-13 |
| C-02 | Medium | Risk (whether the live product now matches is Untested; there is no network check of ledgerguard | The prototype captures carry product claims not evidenced anywhere in the repo | [07](07-content-and-assets.md#c-02) | Q-00, Q-04 |
| C-04 | Medium | Risk (no evidence found; this does not prove the claims are false) | The 80% and 90% claims have no supporting evidence in the repo and remain on the live site and README | [07](07-content-and-assets.md#c-04) | Q-00 |
| C-05 | Medium | Verified failure (visible) | The personal email is visible in screenshots on the live site and in the artifacts | [07](07-content-and-assets.md#c-05) | Q-00, Q-02 |
| C-09 | Medium | Verified failure (against `docs/design/README | The hand-built kit pages contain copy that is not in `data/` or `content/`, against the "verbatim" rule | [07](07-content-and-assets.md#c-09) | Q-00, Q-04 |
| C-15 | Medium | Verified failure | The documented Next.js version is wrong | [08](08-architecture-plan.md#c-15) | Q-03 |
| C-16 | Medium | Verified | The test requirements disagree | [08](08-architecture-plan.md#c-16) | Q-03 |
| C-17 | Medium | Verified | The availability and positioning line differs between CLAUDE.md and data | [08](08-architecture-plan.md#c-17) | Q-00, Q-03 |
| C-18 | Medium | Verified failure | docs/ARCHITECTURE.md is stale and contradicts the code and itself; AGENTS.md misses the webhook route | [08](08-architecture-plan.md#c-18) | Q-03 |
| C-19 | Medium | Risk (needs an owner decision, not a code defect) | Hairline motion and complexity conflict with the CLAUDE.md UI rules and the system's own motion rule | [08](08-architecture-plan.md#c-19) | Q-00 |
| D-02 | Medium | Risk (pattern verified by code; frame cost untested) | Layout thrash inside the frame loop (interleaved reads and writes, per-frame DOM queries) | [06](06-motion-performance.md#d-02) | Q-06 |
| D-03 | Medium | Verified failure | Reduced-motion preference read once, never updated | [06](06-motion-performance.md#d-03) | Q-06 |
| D-04 | Medium | Verified failure | Reduced motion also removes non-motion state (active section, progress, highlights) | [06](06-motion-performance.md#d-04) | Q-06 |
| D-05 | Medium | Verified failure (by code; visual result Untested) | Flow step labels are not fitted under reduced motion (contradicts the brand book) | [06](06-motion-performance.md#d-05) | Q-08 |
| D-07 | Medium | Risk (CLS untested) | Post-paint title fitting (fit.js): layout shift, font-swap dependence, unthrottled resize, permanent observers | [06](06-motion-performance.md#d-07) | Q-08 |
| D-08 | Medium | Risk | Canvas text uses literal font family names that will not resolve under next/font | [03](03-component-contracts.md#d-08) | Q-08 |
| D-10 | Medium | Verified failure (artifact behaviour) | Templates render core content client-side only | [03](03-component-contracts.md#d-10) | Q-08 |
| D-11 | Medium | Risk (mobile behaviour Untested) | Tall sticky scroll scenes: 100vh on mobile, blank canvases before JS | [06](06-motion-performance.md#d-11) | Q-08 |
| D-12 | Medium | Verified failure (computed) | Focus states fail contrast where only hover was restyled | [05](05-seo-accessibility.md#d-12) | Q-10 |
| D-13 | Medium | Verified failure (computed) | Inactive portfolio scene steps rendered at 38% opacity | [05](05-seo-accessibility.md#d-13) | Q-10 |
| D-14 | Medium | Verified failure | Contact form contrast and description issues | [05](05-seo-accessibility.md#d-14) | Q-09, Q-10 |
| D-16 | Medium | Verified failure | Activity graph: pointer-only detail, weak level encoding, unfocusable scroller | [05](05-seo-accessibility.md#d-16) | Q-08, Q-10 |
| D-19 | Medium | Risk | Missing cleanup (listeners, observers, timers) | [06](06-motion-performance.md#d-19) | Q-06 |
| D-22 | Medium | Verified failure | Reader swaps articles in place without focus or announcement | [04](04-interaction-matrix.md#d-22) | Q-09 |
| D-26 | Medium | Risk | Production integration conflicts: fixed nav, Lenis, progress duplicates | [02](02-artifact-parity-matrix.md#d-26) | Q-00, Q-07 |
| M-01 | Medium | Verified failure (local production build, capture run) | Entrance motion delays Largest Contentful Paint on case studies | [06](06-motion-performance.md#m-01) | Q-02, Q-12 |
| M-02 | Medium | Verified failure (artifact capture) | Artifact pages shift layout after first paint | [06](06-motion-performance.md#m-02) | Q-12 |
| M-03 | Medium | Verified (local production build) | Every route ships 579–780 KB of client JavaScript | [06](06-motion-performance.md#m-03) | Q-12 |
| M-05 | Medium | Verified | The design branch is behind `main` | [01](01-route-coverage.md#m-05) | Q-01 |
| A-04 | Low | Verified failure | Root `docs/ROUTES.md` / `docs/SITE_STRUCTURE.md` / `docs/ARCHITECTURE.md` route and content contracts are stale | [08](08-architecture-plan.md#a-04) | Q-03 |
| A-05 | Low | Verified (existing build output) | Footer "latest writing" freezes at build time on static routes | [01](01-route-coverage.md#a-05) | Q-02 |
| A-10 | Low | Risk | The home `<h1>` changes from the positioning line to the name | [02](02-artifact-parity-matrix.md#a-10) | Q-00, Q-09 |
| A-12 | Low | Risk | origin/main's Algora activity card diverges from the Hairline snapshot graph | [01](01-route-coverage.md#a-12) | Q-00, Q-01 |
| A-14 | Low | Untested | Test gaps on route assembly and nonvisual outputs | [01](01-route-coverage.md#a-14) | Q-11 |
| A-15 | Low | Verified (source and build output) unless noted | Smaller JSON-LD and metadata correctness items | [05](05-seo-accessibility.md#a-15) | Q-09, Q-11 |
| B-04 | Low | Verified failure | Malformed JSON returns 500 instead of 400 | [04](04-interaction-matrix.md#b-04) | Q-02 |
| B-06 | Low | Risk | Duplicate assertive announcements on failed validation | [04](04-interaction-matrix.md#b-06) | Q-09 |
| B-11 | Low | Verified failure | Back to all case studies" targets an anchor the router deliberately ignores | [04](04-interaction-matrix.md#b-11) | Q-07 |
| B-13 | Low | Untested | Lenis keeps scrolling the page behind the open mobile menu | [04](04-interaction-matrix.md#b-13) | Q-02 |
| B-14 | Low | Verified failure | Nav "scrolled" style not initialised on mount; non-passive listener | [04](04-interaction-matrix.md#b-14) | Q-02 |
| B-15 | Low | Risk | Hash targets are scrolled but never focused; retry window is short | [04](04-interaction-matrix.md#b-15) | Q-07 |
| B-20 | Low | Verified** (code); perf impact Untested | Permanent `will-change` on every split word and stage; full-stage blur filters | [06](06-motion-performance.md#b-20) | Q-06 |
| B-21 | Low | Untested | Hero parallax overwrites the intro fade | [06](06-motion-performance.md#b-21) | Q-06 |
| B-22 | Low | Verified** (code) | Reduced-motion preference is read once (production and artifact) | [06](06-motion-performance.md#b-22) | Q-06 |
| B-25 | Low | Verified** (code + history) | force-dynamic` used only to evaluate the date; static routes freeze the footer list | [04](04-interaction-matrix.md#b-25) | Q-02 |
| B-27 | Low | Verified** (grep); GA4 SPA page views **Untested | Link/event tracking is partial and some hooks are inert | [04](04-interaction-matrix.md#b-27) | Q-00, Q-13 |
| B-28 | Low | Verified | Case-study navigation parity; breadcrumb list semantics | [04](04-interaction-matrix.md#b-28) | Q-07 |
| B-29 | Low | Verified** (grep over `docs/design/pages/ | Artifact pages lack production landmarks (skip link, `<main>`, menu) | [04](04-interaction-matrix.md#b-29) | Q-07 |
| C-07 | Low | Verified failure | Some alt text and captions do not describe what the image shows | [07](07-content-and-assets.md#c-07) | Q-04 |
| C-08 | Low | Verified failure (data) | The declared TallyFolio dashboard dimensions do not match the file | [07](07-content-and-assets.md#c-08) | Q-04 |
| C-10 | Low | Verified | The canonical positioning line does not appear verbatim in any artifact | [07](07-content-and-assets.md#c-10) | Q-00, Q-04 |
| C-11 | Low | Verified | The design docs mislabel the 80% figure as a "coverage" figure | [07](07-content-and-assets.md#c-11) | Q-00 |
| C-20 | Low | Verified | The content-source rules are bypassed by the static kit pages, and the validation commands do not cover them | [08](08-architecture-plan.md#c-20) | Q-03 |
| C-21 | Low | Verified | Smaller inconsistencies | [08](08-architecture-plan.md#c-21) | Q-03 |
| D-15 | Low | Risk | Focus ring visibility gaps | [05](05-seo-accessibility.md#d-15) | Q-07, Q-10 |
| D-17 | Low | Verified failure | Permanent `will-change: transform` | [06](06-motion-performance.md#d-17) | Q-06 |
| D-18 | Low | Verified failure | Frame-rate-dependent motion | [06](06-motion-performance.md#d-18) | Q-06 |
| D-20 | Low | Risk | Canvas robustness: no context guard, no fallback, redundant work | [03](03-component-contracts.md#d-20) | Q-08 |
| D-21 | Low | Risk | Hard-coded data assumptions in layout and drawing | [02](02-artifact-parity-matrix.md#d-21) | Q-05 |
| D-23 | Low | Risk | Element lookups by fixed IDs assume one instance per page | [03](03-component-contracts.md#d-23) | Q-08 |
| D-24 | Low | Verified failure | Design-system bundle is not self-contained; tokens.json display size inconsistent | [02](02-artifact-parity-matrix.md#d-24) | Q-05 |
| D-25 | Low | Risk | Lightbox details | [03](03-component-contracts.md#d-25) | Q-08 |
| D-27 | Low | Untested | Mobile nav row width at 320px | [02](02-artifact-parity-matrix.md#d-27) | Q-07 |
| D-28 | Low | Risk | Copy button feedback is not announced | [04](04-interaction-matrix.md#d-28) | Q-09 |
| M-06 | Low | Verified | No route error boundary | [08](08-architecture-plan.md#m-06) | Q-07 |
| B-08 | Info | Verified** (by design) | Artifact preview form must not replace the production pipeline | [04](04-interaction-matrix.md#b-08) | Q-09 |
| B-09 | Info | Verified** (code + 15 passing tests) | Resend inbound webhook: sound | [04](04-interaction-matrix.md#b-09) | — |
| B-23 | Info | Verified** (artifact code) | Artifact canvases need an explicit production port contract | [06](06-motion-performance.md#b-23) | Q-08 |
| B-30 | Info | Verified** (command output) | pnpm test -- <args>` does not forward args under pnpm 12 | [01](01-route-coverage.md#b-30) | — |
| C-12 | Info | Risk (no current drift) | The Agent Readiness Doctor article is a hand-maintained copy of the Markdown post | [07](07-content-and-assets.md#c-12) | Q-04 |
| C-13 | Info | Verified | Secrets and contact-data grep found nothing | [07](07-content-and-assets.md#c-13) | — |
| C-14 | Info | Untested | Use of employer and third-party brand imagery has no recorded permission | [07](07-content-and-assets.md#c-14) | — |
| D-29 | Info | Verified failure | Documentation claims that the code contradicts | [08](08-architecture-plan.md#d-29) | Q-03 |
| M-04 | Info | Verified (capture with JavaScript disabled) | Production pages stay readable without JavaScript | [06](06-motion-performance.md#m-04) | — |
