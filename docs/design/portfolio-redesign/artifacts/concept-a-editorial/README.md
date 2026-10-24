# Concept A · Engineering Editorial

Published prototype: <https://claude.ai/artifact/6gk5XktRx4nZMRWBmqRDag> (private until shared). Source: this folder, built by `../build.mjs`.

**Idea.** The portfolio set like an engineering journal. A masthead column states who Ali is; the contents page beside it lists the work. Project names are large serif titles, and each featured entry carries its first technical decision as an editor's note in the margin. Case studies read as long-form articles with an outline rail, numbered figures, and decision records. The one accent is non-photo blue, the pencil colour editors used for marks that never reach print. Here it marks decisions, focus, and the current state.

**What it shows a recruiter first.** Name, title, focus line, one-sentence thesis, Book a call, and the three featured projects with role, years, and an outcome line. All three featured names sit in the first viewport at 1440 × 900.

## Screenshots

All in `screenshots/`, captured by `../review.mjs` in Chromium at device scale 1, about 0.9 s after load.

| View                     | 1440                                           | 768                                  | 390                                           |
| ------------------------ | ---------------------------------------------- | ------------------------------------ | --------------------------------------------- |
| Index, first viewport    | `index-1440-first-viewport.png`                | `index-768-first-viewport.png`       | `index-390-first-viewport.png`                |
| Index, full page         | `index-1440-full.jpg`                          | `index-768-full.jpg`                 | `index-390-full.jpg`                          |
| Index, reduced motion    | `index-1440-reduced-motion-first-viewport.png` | not captured                         | `index-390-reduced-motion-first-viewport.png` |
| Index, keyboard focus    | `index-1440-keyboard-focus.png`                | not captured                         | not captured                                  |
| LedgerGuard, first view  | `ledgerguard-1440-first-viewport.png`          | `ledgerguard-768-first-viewport.png` | `ledgerguard-390-first-viewport.png`          |
| LedgerGuard, full page   | `ledgerguard-1440-full.jpg`                    | `ledgerguard-768-full.jpg`           | `ledgerguard-390-full.jpg`                    |
| Flow walkthrough, step 2 | `ledgerguard-1440-flow-step.png`               | not captured                         | `ledgerguard-390-flow-step.png`               |

Machine-readable results: `screenshots/review-results.json`.

## Typography

| Role                             | Face       | Weights used                             | Licence                       | Loading                                           |
| -------------------------------- | ---------- | ---------------------------------------- | ----------------------------- | ------------------------------------------------- |
| Display: names, thesis, headings | Newsreader | variable, opsz 6–72, 400–500, italic 400 | SIL OFL 1.1 (Production Type) | Google Fonts in the prototype                     |
| Body and UI                      | Geist      | 400, 500, 600                            | SIL OFL 1.1 (Vercel)          | Google Fonts; already the site's face via `geist` |
| Metadata, labels, figure numbers | Geist Mono | 400, 500                                 | SIL OFL 1.1 (Vercel)          | Google Fonts; also in the `geist` package         |

Measured font transfer on first load: **241.7 KB** across all faces (Newsreader's optical-size axis is most of it). This is the heaviest of the three concepts. In production, self-host through `next/font` with Latin subsetting, preload only the display roman, and consider pinning `opsz` to two static instances to cut the variable file.

Scale: 0.75 / 0.875 / 1 / 1.1875 / 1.5 rem, then fluid steps to 2.375 rem (section heads) and 4.25 rem (featured names). Headings use `text-wrap: balance`; running text stays near 60–65 characters.

## Colour tokens

Single committed dark look, as the brief keeps the dark base and excludes a light theme. Ratios computed with the WCAG 2.x formula.

| Token          | Hex       | Role                                     | Contrast                              |
| -------------- | --------- | ---------------------------------------- | ------------------------------------- |
| `--ink`        | `#161513` | Page                                     | n/a                                   |
| `--sheet`      | `#1e1c19` | Raised surface (diagram rows, figures)   | n/a                                   |
| `--rule`       | `#3b372f` | Hairlines, decorative only               | 1.54:1 on page (non-text, decorative) |
| `--text`       | `#ede7da` | Body and headings                        | 14.81:1 on page, 13.80:1 on sheet     |
| `--muted`      | `#b3ab9b` | Metadata, secondary text                 | 8.01:1 on page, 7.46:1 on sheet       |
| `--pencil`     | `#9fd4ec` | Decisions, focus ring, current state     | 11.39:1 on page, 10.61:1 on sheet     |
| `--pencil-ink` | `#10232c` | Text on pencil fills (Book a call, Play) | 10.09:1 on pencil                     |

Every text pair clears 4.5:1 with room to spare, including text inside filled buttons (finding F-07).

## Interaction inventory

| Element                     | Pointer                                                                                | Keyboard                                                    | Notes                                                                                                    |
| --------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Project entry (block link)  | Whole entry clickable; pencil underline draws under the name; margin note brightens    | One tab stop per project; ring drawn around the whole entry | Accessible name "LedgerGuard case study". One link per project (F-15): 10 links in `main`, down from 54. |
| Return arrival              | n/a                                                                                    | n/a                                                         | `:target` adds "You were here" above the years when arriving at `#project-<slug>`.                       |
| Profiles and booking        | Pills; Book a call is filled                                                           | Tab stops, 44 px tall                                       | Accessible names start with the visible label (F-23).                                                    |
| Site menu under 768 px      | Native `<details>`                                                                     | Enter/Space toggles                                         | No focus trap; it is a disclosure, not a modal.                                                          |
| Case-study outline          | Left rail at ≥ 1024 px; collapsed disclosure below                                     | Before the article in DOM and tab order (F-14)              | Current section marked with `aria-current` as you read; opened by script at ≥ 1024 px.                   |
| Flow walkthrough            | Play / Pause, Previous step, Next step                                                 | Buttons; Escape pauses; status in a polite live region      | All steps stay readable as a list without script. 1.7 s per step when playing.                           |
| Return and next links       | "All case studies" at top, "Back to all case studies" and "Next case study" at the end | Tab stops                                                   | Return links go to `index.html#project-<slug>`.                                                          |
| Evidence figures            | "Open larger image" link per figure                                                    | Tab stop                                                    | Answers F-17 without a modal lightbox.                                                                   |
| Name hand-off between pages | Cross-document view transition on the project name                                     | Same                                                        | Implemented with `view-transition-name`; not visually verified (see below).                              |

## Motion rationale

The page is complete in the first frame. Motion only confirms structure:

- **Entrance (fresh visits only):** rules under each entry draw left to right (`scaleX`, 400 ms, 60 ms stagger) and names settle 0.2 em into place (`translateY`, 400 ms). Text is never hidden; opacity never changes. Last entrance ends by about 580 ms, inside the 600 ms default.
- **Hover/focus:** pencil underline 280 ms; margin note colour 200 ms.
- **Page change:** the project name morphs from the index into the case-study H1 (380 ms), root cross-fade 220 ms.
- **Explanatory:** the flow walkthrough advances one step every 1.7 s, only after the visitor presses Play.
- **Off switches:** `prefers-reduced-motion: reduce` (followed live) sets `data-motion="reduce"`, which removes every animation and transition and skips view transitions. Entrances also skip on Back/Forward and on anchor arrivals, so a returning visitor never sees the page re-perform, and animated elements carry `overflow-anchor: none` so scroll anchoring cannot shift a restored position.

## Accessibility notes

Verified in this pass (Chromium, automated):

- axe-core 4.10 (WCAG 2.0–2.2 A/AA plus best practice): **0 violations** on the index and LedgerGuard at 1440, 768 and 390.
- Keyboard walk: every stop has a visible ring; the smallest standalone target is 24 px tall.
- Heading order: H1, H2 "Case studies", H3 per tier, H4 per project (F-16). Case study: H1, H2 per section, H3 per decision.
- No horizontal overflow at any width; no text below 0.99 opacity at rest.
- Browser Back from a case study returns to the same position (content measured in the same place on screen at all three widths); the return link lands on `#project-ledgerguard`.
- Reduced motion: zero running animations.

Not verified: VoiceOver (macOS or iOS) or any screen reader, Safari and Firefox, touch devices, 200 % zoom and text-spacing overrides, Windows high-contrast mode.

## Risks

- **Font weight.** 241.7 KB of fonts is the largest budget item in any concept; it threatens mobile LCP unless subset and self-hosted.
- **Serif at small sizes.** Newsreader is used down to 1.1875 rem for body lede text; check rendering on low-DPI Windows.
- **Margin notes repeat the case study.** The key-decision note is useful at 1440 but adds length on mobile, where the first featured project starts at 745 px of an 844 px viewport. Trimming the masthead on mobile would buy room.
- **Editorial look is the most familiar of the three.** Strong craft is needed for it to read as distinctive rather than as a well-set blog.
- **View transitions** are Chromium and Safari 18.2+ only; Firefox gets an instant change, which is acceptable.
