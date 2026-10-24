# Concept C · Systems in Motion

Published prototype: <https://claude.ai/artifact/21kVstkEg2EzVa5FWBoKBU> (private until shared). Source: this folder, built by `../build.mjs`.

**Idea.** Each featured project is introduced by its own flow: the real step sequence from its case study, drawn as a trace (LedgerGuard: Upload → Queue job → Extract → Review → Confirm). On hover or focus an amber signal runs the length of the trace and lights each step as it passes. Case studies keep that flow in a sticky rail beside the reading column as a step-through walkthrough, so the system stays in view while the decisions are read. The accent is the signal itself: it marks what is moving, focused, or current.

**What it shows a recruiter first.** Name, title, thesis, Book a call, and three side-by-side cards with role, years, outcome line and flow. All three featured cards are fully inside the first viewport at 1440 × 900, with the supporting tier starting above the fold.

## Screenshots

All in `screenshots/`, captured by `../review.mjs` in Chromium at device scale 1, about 0.9 s after load.

| View                     | 1440                                                                 | 768                                  | 390                                           |
| ------------------------ | -------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------- |
| Index, first viewport    | `index-1440-first-viewport.png`                                      | `index-768-first-viewport.png`       | `index-390-first-viewport.png`                |
| Index, full page         | `index-1440-full.jpg`                                                | `index-768-full.jpg`                 | `index-390-full.jpg`                          |
| Index, reduced motion    | `index-1440-reduced-motion-first-viewport.png`                       | not captured                         | `index-390-reduced-motion-first-viewport.png` |
| Index, keyboard focus    | `index-1440-keyboard-focus.png` (signal mid-run on the focused card) | not captured                         | not captured                                  |
| LedgerGuard, first view  | `ledgerguard-1440-first-viewport.png`                                | `ledgerguard-768-first-viewport.png` | `ledgerguard-390-first-viewport.png`          |
| LedgerGuard, full page   | `ledgerguard-1440-full.jpg`                                          | `ledgerguard-768-full.jpg`           | `ledgerguard-390-full.jpg`                    |
| Flow walkthrough, step 2 | `ledgerguard-1440-flow-step.png`                                     | not captured                         | `ledgerguard-390-flow-step.png`               |

Machine-readable results: `screenshots/review-results.json`.

## Typography

| Role                     | Face           | Weights used                        | Licence                    | Loading                       |
| ------------------------ | -------------- | ----------------------------------- | -------------------------- | ----------------------------- |
| Display and body         | Archivo        | variable, wdth 62–125, wght 400–800 | SIL OFL 1.1 (Omnibus-Type) | Google Fonts in the prototype |
| Labels, traces, metadata | JetBrains Mono | 400, 500                            | SIL OFL 1.1 (JetBrains)    | Google Fonts                  |

Measured font transfer on first load: **118.6 KB**. One variable family does both display and body: names are set extra-wide and heavy (wdth 118–125, wght 800), running text at normal width. The width axis is the expressive tool, so no third face is needed.

Scale: 0.75 / 0.875 / 1 / 1.125 / 1.375 rem, fluid 1.625–2.25 rem (section heads), 2–2.75 rem (card names), 2.5–4.75 rem (case-study H1, capped at 10.5 vw so long names never break mid-word).

## Colour tokens

Single committed dark look. Ratios computed with the WCAG 2.x formula.

| Token          | Hex       | Role                                   | Contrast                            |
| -------------- | --------- | -------------------------------------- | ----------------------------------- |
| `--ground`     | `#131117` | Page                                   | n/a                                 |
| `--surface`    | `#1c1922` | Cards, rail, decisions                 | n/a                                 |
| `--line`       | `#3a3441` | Borders, traces at rest                | 1.56:1 on page (non-text)           |
| `--text`       | `#efeaf2` | Body and headings                      | 15.82:1 on page, 14.63:1 on surface |
| `--muted`      | `#b2a9ba` | Metadata                               | 8.28:1 on page, 7.66:1 on surface   |
| `--signal`     | `#f2b84b` | The moving signal, focus, current step | 10.47:1 on page, 9.68:1 on surface  |
| `--signal-ink` | `#2b1b00` | Text on signal fills                   | 9.32:1 on signal                    |

State is never colour-only: the current flow step is also filled and announced, done steps keep a solid connector, and the chosen column in comparisons carries an "Approach taken" label.

## Interaction inventory

| Element                        | Pointer                                                                          | Keyboard                                                           | Notes                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| System card (block link)       | Border turns amber; signal runs the trace (0.32 s per step) and lights each node | Same run on focus; ring around the whole card                      | 10 links in `main` (F-15). The trace is a readable ordered list of step names.                          |
| Motion toggle                  | Button in the intro and in each case-study header                                | `aria-pressed`; choice stored per browser                          | Hidden without script. Defaults to the system setting, which it follows live until the visitor chooses. |
| Supporting and experiment rows | Name underlines                                                                  | One tab stop each                                                  | Each row lists its flow as text ("Repo readiness → … → Human decision").                                |
| Return arrival                 | n/a                                                                              | n/a                                                                | `:target` outlines the card or row.                                                                     |
| Site menu under 768 px         | Native `<details>`                                                               | Enter/Space                                                        |                                                                                                         |
| Flow rail (case study)         | Sticky beside the article at ≥ 1200 px; inline under the header below that       | Play / Pause, Previous step, Next step; Escape pauses; live status | The flow is lifted out of its section into the rail, not duplicated.                                    |
| Section chips                  | Wrap under the header                                                            | Before the article in DOM and tab order                            | Current section filled amber as you read.                                                               |
| Return and next links          | "All case studies" at top; back and next at the end                              | Tab stops                                                          | Return links go to `index.html#project-<slug>`.                                                         |
| Name hand-off between pages    | Cross-document view transition                                                   | Same                                                               | Implemented; not visually verified.                                                                     |

## Motion rationale

This concept spends its motion budget on explanation, because the flows are the evidence:

- **Entrance (fresh visits only):** cards lift 0.75 rem into place (`translateY`, 400 ms, 70 ms stagger); each trace line draws once (`scaleX`, 380 ms). Text is visible from the first frame. Last entrance ends by about 580 ms.
- **Explanatory, visitor-started:** on hover or focus the signal runs the trace in `steps × 0.32 s` (1.6 s for LedgerGuard). This exceeds the 600 ms entrance default on purpose: it shows the order of a real pipeline, as owner decision "Motion" allows. It never blocks the click and does not loop.
- **Walkthrough:** 1.8 s per step after Play, pausable, with a live status line.
- **Page change:** name hand-off 420 ms; root cross-fade 200 ms.
- **Off switches:** reduced motion (followed live) and the on-page toggle remove every animation; under them a hovered or focused card still marks its nodes in amber, so the state change survives without movement. Entrances skip on Back/Forward and anchor arrivals; animated cards carry `overflow-anchor: none`. That last rule fixed a real bug found in review: before it, Back at 768 and 390 px came back 12 px off because Chromium's scroll anchoring followed a card mid-lift.

## Accessibility notes

Verified in this pass (Chromium, automated):

- axe-core 4.10: **0 violations** on the index and LedgerGuard at 1440, 768 and 390.
- Keyboard walk with visible rings on every stop; smallest standalone target 24 px.
- Headings: H1, H2 "Case studies" (visually hidden), H3 per tier, H4 per project.
- No horizontal overflow; no text hidden at rest; Back restores position at all widths; return link lands on the anchor; zero animations under reduced motion.
- The published artifact was opened in a browser: index → LedgerGuard → "All case studies" returned to the LedgerGuard card with the `:target` outline.

Not verified: screen readers, Safari, Firefox, touch (there is no hover, so the trace run happens only on focus), zoom and text-spacing, forced colours.

## Risks

- **Motion is the identity.** If a visitor has reduced motion on, C looks like a clean card layout; the idea has to survive as static traces, and it mostly does.
- **Touch devices** never see the hover run. A tap navigates, so mobile visitors get the static trace only, unless a separate "run" control is added (more UI on cards).
- **Three columns at 1440** give each card about 400 px; long project names wrap (AlwaysGeeky Games takes two lines).
- **Sticky rail** at ≥ 1200 px uses `max-height` with internal scroll for long flows; a five-step flow fits at 900 px tall, but very short windows will scroll inside the rail.
- **The flow is lifted out of its section** into the rail. Readers of the rail see it next to every section, but the "Technical decisions" section no longer contains it inline; the rail note says where it comes from.
