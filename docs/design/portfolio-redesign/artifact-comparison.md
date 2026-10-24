# P1 artifact comparison

Date: 2026-10-23. Inputs: the three prototypes in `artifacts/` (each with its own `README.md`), their review results in `artifacts/*/screenshots/review-results.json`, and the baseline in `baseline-audit.md`. Status: **for owner review**. Choosing a concept authorises refinement only, not production implementation.

| Concept                   | Prototype                                           | Notes                                             |
| ------------------------- | --------------------------------------------------- | ------------------------------------------------- |
| A · Engineering Editorial | <https://claude.ai/artifact/6gk5XktRx4nZMRWBmqRDag> | `artifacts/concept-a-editorial/README.md`         |
| B · Interface Atlas       | <https://claude.ai/artifact/7fJ6yYv7t6YMJMSMjtDNbk> | `artifacts/concept-b-interface-atlas/README.md`   |
| C · Systems in Motion     | <https://claude.ai/artifact/21kVstkEg2EzVa5FWBoKBU> | `artifacts/concept-c-systems-in-motion/README.md` |

The published artifacts are private until Ali shares them.

## What all three share

These are not differentiators; they are the floor every concept met in review (Chromium, automated, at 1440 × 900, 768 × 1024 and 390 × 844):

- Content complete in the first frame: no element with text sits below full opacity at rest (baseline: 13 of 13 reveal elements at opacity 0, F-03).
- axe-core 4.10, WCAG 2.0–2.2 A/AA plus best practice: 0 violations on the index and LedgerGuard at every width.
- Every keyboard stop has a visible focus ring; the smallest standalone target is 24 px (F-21).
- One link per project: 10 links in `main` on the index (3 profile/booking + 7 case studies), down from 54 (F-15).
- Correct heading levels under a "Case studies" heading (F-16); the case-study outline comes before the article in DOM and tab order (F-14).
- Browser Back from a case study returns with the same content in the same place on screen at all widths; the return link lands on `#project-<slug>` (F-04, owner decision 6).
- Reduced motion: zero running animations, followed live (F-22). Entrances never replay on Back/Forward or anchor arrivals.
- No horizontal overflow at any width.
- All text pairs at least 7.46:1, including text inside filled buttons (F-07).
- Tiers, closed Voxies Marketplace, omitted ControlTech link, no staff framing, Emplifi featured without invented UI, 80 % and 90 % kept off every index and flagged in case studies.
- Images: 640/1280 px WebP with `sizes`, lazily loaded; none requested on first load of the LedgerGuard page at any width (F-10).

## 1. Recruiter scannability

Measured: the vertical position of each featured project's name link on load. "Yes" means the whole name is inside the first viewport.

| Featured project in first viewport | A Editorial                    | B Atlas                        | C Systems                                                                         | Baseline                             |
| ---------------------------------- | ------------------------------ | ------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------ |
| 1440 × 900                         | 3 of 3 (Emplifi name ends 850) | 3 of 3 (Emplifi name ends 880) | **3 of 3, whole cards** (names at 362–454; supporting tier starts above the fold) | 0 of 3 (first at ~1,607)             |
| 768 × 1024                         | 2 of 3                         | 2 of 3                         | 2 of 3                                                                            | 0 of 3                               |
| 390 × 844                          | 1 of 3 (LedgerGuard at 745)    | 1 of 3 (LedgerGuard at 613)    | 1 of 3 (LedgerGuard at 651)                                                       | 0 of 3                               |
| Index length at 1440               | 1,805 px                       | 1,794 px                       | **1,289 px**                                                                      | 6,346 px (with the full site footer) |

All three meet the brief's success test (all featured at 1440, first featured at 390). Differences that matter to a recruiter:

- **C** shows the most per project at desktop without scrolling: role, years, outcome line, and the shape of the system, for all three featured projects at once, with Supporting already visible.
- **B** is fastest to compare across projects (reference codes, aligned role and years columns) and the only one that answers "show me design-systems work" directly, through the highlight. It puts a filter row before the first project on mobile.
- **A** reads most like a CV: the masthead stays beside the list on desktop. On mobile its masthead is the tallest, so LedgerGuard starts lowest (745 px of 844).

## 2. Awwwards potential

Judgement, not measurement. Juries score Design, Usability, Creativity and Content.

| Criterion  | A Editorial                                                          | B Atlas                                                                      | C Systems                                                                                                           |
| ---------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Design     | Strong typography (variable-optical-size serif) but a familiar genre | Coherent system; the survey grid and plates are distinctive; can read as dry | Expanded-width display type plus the traces give the strongest visual signature                                     |
| Usability  | Very good; calm and legible                                          | Very good for scanning; the filter adds a real interaction                   | Very good on desktop; the hover run does not exist on touch                                                         |
| Creativity | Medium: execution must carry it                                      | Medium–high: the index-as-instrument idea is clear                           | **High**: the motion is the content (each project's real pipeline), which is the brief's "systems drawn as systems" |
| Content    | Decisions as editor's notes put judgement up front                   | Spec sheets make evidence auditable                                          | Flows plus decision chains show how the systems work, not just what they are                                        |
| Overall    | Safe, polished; lowest ceiling                                       | Distinctive to engineers; moderate ceiling                                   | **Highest ceiling**; the riskiest to execute well                                                                   |

## 3. Accessibility and performance risk

Fonts are the biggest weight difference between concepts. Measured on first load from Google Fonts in the prototypes (WOFF2 bytes); production would self-host through `next/font`, subset, and preload.

| Measure (prototype, index page)           | A Editorial          | B Atlas | C Systems           |
| ----------------------------------------- | -------------------- | ------- | ------------------- |
| Font transfer                             | 241.7 KB             | 73.4 KB | 118.6 KB            |
| CSS (uncompressed)                        | 21.0 KB              | 23.4 KB | 23.1 KB             |
| Page JS (uncompressed, shared + page)     | 6.6 KB               | 8.0 KB  | 6.6 KB              |
| Worst CLS measured (index or LedgerGuard) | 0.022 (mobile index) | 0.001   | 0.023 (LedgerGuard) |

CLS above zero comes from web-font swap; `next/font` fallback metrics should remove it. Local LCP numbers (all under 150 ms) are not meaningful for production and are not reported as evidence.

| Risk                                   | A                                                                   | B                                                                         | C                                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Performance                            | **Highest**: serif with optical-size axis is the heaviest font load | Lowest                                                                    | Moderate                                                                                                     |
| Motion and vestibular                  | Lowest: rules and small settles                                     | Low: short horizontal slides                                              | **Highest**: a signal run per hover (≈1.6 s), mitigated by reduced motion, an on-page toggle, and no looping |
| Interaction surface                    | Smallest                                                            | Filter group with live region (keyboard-checked)                          | Walkthrough rail and motion toggle (keyboard-checked)                                                        |
| Untested areas specific to the concept | Serif rendering on low-DPI screens                                  | Grid background in forced-colours mode; horizontal filter scroll on touch | Touch behaviour (no hover run); sticky rail in short windows                                                 |

Common gaps for all three, not covered by this review: VoiceOver (macOS and iOS), Safari, Firefox, real touch devices, 200 % zoom, text spacing, forced colours, and visual verification of view transitions.

## 4. Implementation cost against the current stack

Current stack: Next.js 16.4 App Router, React 19, Tailwind CSS 4, GSAP 3.15, Lenis 1.3, Geist.

Work every concept needs (decided in P0, independent of the choice):

- `Project` data model: `tier`, an approved short index line, link `status` for closed/omitted links, and provenance for figures.
- Back/anchor behaviour in `RouteChangeFocus` (F-04), visible-by-default content (F-03), server components with thin client islands (F-12).
- Native scroll on `/portfolio`. None of the prototypes uses Lenis or GSAP, and all three meet the motion rules with CSS and about 230 lines of plain script. Keeping Lenis would conflict with "no animation may interfere with native scroll, anchors or Back/Forward"; removing it (at least on portfolio routes) is a behaviour change that needs owner approval.
- **Page transitions.** The prototypes use cross-document view transitions because each page is a separate document. Next.js navigations are client-side, so production needs React's `<ViewTransition>` behind Next's experimental `viewTransition` flag (a `next.config` change that needs approval), or no shared-element transition. Either way the fallback is an instant change, which is acceptable.
- Fonts through `next/font/google` add no npm dependency.

| Concept     | Specific work                                                                                                                                                                                                                              | Relative cost   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- |
| A Editorial | Two-column index with sticky masthead; serif and mono added through `next/font`; restyle the existing `Flow`/`Layers`/`Compare` diagrams; walkthrough added to `FlowDiagram`. Mostly server components.                                    | **Low–medium**  |
| B Atlas     | Index table with reference codes; plates rendered from existing `layers` diagram data; one small client component for the highlight; spec-sheet case-study header and sticky section strip; site-wide type change from Geist to IBM Plex.  | **Medium**      |
| C Systems   | Trace component rendered from existing `flow` diagram data (all seven projects have one); CSS-only hover run; motion toggle with persisted preference (small client island); sticky flow rail on case studies; touch affordance to design. | **Medium–high** |

None of the three needs a new runtime dependency. GSAP could be dropped from the portfolio path in any of them, which also helps F-12 and F-27.

## Recommendation

**Refine C, "Systems in Motion".**

It is the only concept whose expressive layer is made of Ali's actual evidence: each featured card is the real pipeline from its case study, and the motion explains it rather than decorating it. It has the best desktop first viewport of the three (three complete cards, outcome lines, and the start of the supporting tier) and the shortest index. It carries the Awwwards goal furthest while staying inside the two-layer rule: with motion off it is still a complete, legible card index.

Refinement should address C's specific risks before anything else:

1. **Touch.** Design a visible way to run a trace on touch devices (or accept the static trace) and test on iOS and Android.
2. **Mobile first viewport.** Trim the intro on narrow screens so LedgerGuard's outcome line, not just its name, is visible at 390 px.
3. **Motion review.** Agree the signal-run duration (now 0.32 s per step) and confirm the on-page toggle is wanted in production.
4. **Screen-reader pass** of the trace lists and the walkthrough rail (VoiceOver, macOS and iOS).

Worth carrying over from the other concepts: A's key-decision note as an optional detail on the featured cards at wide widths, and B's capability highlight as a later addition if Ali approves the groupings.

**Fallback:** if Ali prefers lower motion and implementation risk, **A** is the safest to build and still meets every recruiter test, at the cost of a lower Awwwards ceiling and the heaviest font load.

## Decisions needed from Ali

1. Which concept to refine (recommendation: C).
2. Approve or rewrite the seven index lines in `artifacts/shared/content.mjs` (new condensed copy).
3. Still open from P0: sources for the Emplifi 80 % and LedgerGuard 90 % figures; LedgerGuard role label; whether a ControlTech destination exists.
4. Whether the Voxies login link stays on AlwaysGeeky (it is live, but it is a different brand from the employer name).
5. Whether to drop Lenis on portfolio routes and to enable Next's experimental view transitions during refinement (both are config or behaviour changes needing approval).
