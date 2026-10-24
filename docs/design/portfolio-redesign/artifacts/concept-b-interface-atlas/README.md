# Concept B · Interface Atlas

Published prototype: <https://claude.ai/artifact/7fJ6yYv7t6YMJMSMjtDNbk> (private until shared). Source: this folder, built by `../build.mjs`.

**Idea.** The portfolio as a survey sheet of systems. A compact title block, then an indexed table: every project has a reference code that encodes its tier and position (F1–F3, S1–S3, E1), and each featured row carries a plate drawn from that project's real system-layers diagram. A highlight filter maps capabilities across the index. Case studies are spec sheets: a facts table, a sticky numbered section index, and diagrams drawn on grid paper.

**What it shows a recruiter first.** Title, focus line, thesis, Book a call, the capability filter, and the three featured rows with role, years, outcome line and system layers. All three featured names sit in the first viewport at 1440 × 900.

## Screenshots

All in `screenshots/`, captured by `../review.mjs` in Chromium at device scale 1, about 0.9 s after load.

| View                      | 1440                                           | 768                                  | 390                                           |
| ------------------------- | ---------------------------------------------- | ------------------------------------ | --------------------------------------------- |
| Index, first viewport     | `index-1440-first-viewport.png`                | `index-768-first-viewport.png`       | `index-390-first-viewport.png`                |
| Index, full page          | `index-1440-full.jpg`                          | `index-768-full.jpg`                 | `index-390-full.jpg`                          |
| Index, reduced motion     | `index-1440-reduced-motion-first-viewport.png` | not captured                         | `index-390-reduced-motion-first-viewport.png` |
| Index, keyboard focus     | `index-1440-keyboard-focus.png`                | not captured                         | not captured                                  |
| Highlight: Design systems | `index-1440-highlight-design-systems.png`      | not captured                         | not captured                                  |
| LedgerGuard, first view   | `ledgerguard-1440-first-viewport.png`          | `ledgerguard-768-first-viewport.png` | `ledgerguard-390-first-viewport.png`          |
| LedgerGuard, full page    | `ledgerguard-1440-full.jpg`                    | `ledgerguard-768-full.jpg`           | `ledgerguard-390-full.jpg`                    |
| Flow walkthrough, step 2  | `ledgerguard-1440-flow-step.png`               | not captured                         | `ledgerguard-390-flow-step.png`               |

Machine-readable results: `screenshots/review-results.json`.

## Typography

| Role                             | Face                    | Weights used  | Licence           | Loading                       |
| -------------------------------- | ----------------------- | ------------- | ----------------- | ----------------------------- |
| Display: project names, headings | IBM Plex Sans Condensed | 500, 600      | SIL OFL 1.1 (IBM) | Google Fonts in the prototype |
| Body and UI                      | IBM Plex Sans           | 400, 500, 600 | SIL OFL 1.1 (IBM) | Google Fonts                  |
| Reference codes, labels, plates  | IBM Plex Mono           | 400, 500      | SIL OFL 1.1 (IBM) | Google Fonts                  |

Measured font transfer on first load: **73.4 KB**, the lightest of the three. One superfamily keeps metrics consistent between roles. It replaces Geist on the site, which is a wider change than A or C.

Scale: 0.75 / 0.875 / 1 / 1.125 / 1.375 rem, fluid 1.625–2.125 rem (section heads), 2–3 rem (featured names), 3–5.75 rem (case-study H1).

## Colour tokens

Single committed dark look. Ratios computed with the WCAG 2.x formula.

| Token          | Hex       | Role                                               | Contrast                                |
| -------------- | --------- | -------------------------------------------------- | --------------------------------------- |
| `--ground`     | `#0e1517` | Page                                               | n/a                                     |
| `--plate`      | `#142024` | Raised surface (plates, spec sheet)                | n/a                                     |
| `--grid`       | `#172327` | Survey grid behind content                         | decorative, deliberately near-invisible |
| `--line`       | `#2c444b` | Borders and rules                                  | 1.79:1 on page (non-text)               |
| `--text`       | `#e3ece9` | Body and headings                                  | 15.32:1 on page, 13.82:1 on plate       |
| `--muted`      | `#9fb4b2` | Metadata; non-matching rows when a highlight is on | 8.47:1 on page, 7.64:1 on plate         |
| `--signal`     | `#86d4c6` | Selection, focus, highlight, reference codes       | 10.76:1 on page, 9.71:1 on plate        |
| `--signal-ink` | `#072320` | Text on signal fills                               | 9.64:1 on signal                        |

Dimmed rows under a highlight use `--muted`, so they stay above 7:1.

## Interaction inventory

| Element                     | Pointer                                                                             | Keyboard                                                                                                                     | Notes                                                                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Project row (block link)    | Row raises to the plate colour; name underlines; plate layers step right one by one | One tab stop per project; ring around the whole row                                                                          | 10 links in `main` (F-15).                                                                                                              |
| Capability highlight        | Toggle buttons, one at a time                                                       | Buttons with `aria-pressed`; result in a polite live region ("Design systems: 2 of 7 projects. AlwaysGeeky Games, Emplifi.") | Marks matches and mutes the rest; never hides or reorders rows. Hidden without script. Groupings are listed in `../shared/content.mjs`. |
| Return arrival              | n/a                                                                                 | n/a                                                                                                                          | `:target` draws a signal bar on the row.                                                                                                |
| Site menu under 768 px      | Native `<details>`                                                                  | Enter/Space                                                                                                                  |                                                                                                                                         |
| Section index (case study)  | Sticky strip, scrolls sideways on narrow screens                                    | Before the article in DOM and tab order (F-14)                                                                               | Current section filled with the signal colour.                                                                                          |
| Flow walkthrough            | Play / Pause, Previous step, Next step                                              | Buttons; Escape pauses; live status                                                                                          | Steps readable as a list without script.                                                                                                |
| Return and next links       | "Atlas index" at top; back and next at the end                                      | Tab stops                                                                                                                    | Return links go to `index.html#project-<slug>`.                                                                                         |
| Name hand-off between pages | Cross-document view transition                                                      | Same                                                                                                                         | Implemented; not visually verified.                                                                                                     |

## Motion rationale

Motion reads as a survey being taken, and stays short:

- **Entrance (fresh visits only):** rows slide 0.75 rem from the left into place (`translateX`, 420 ms, 60 ms stagger within each tier); featured reference codes flash the signal colour once (400 ms). Text stays visible throughout. Last entrance ends by about 570 ms.
- **Hover/focus:** plate layers shift right in sequence (250 ms with 40 ms per layer), echoing the stack being read top to bottom.
- **Page change:** name hand-off 320 ms; root cross-fade 180 ms.
- **Explanatory:** flow walkthrough at 1.7 s per step after Play.
- **Off switches:** same as all concepts: reduced motion followed live, entrances skipped on Back/Forward and anchor arrivals, `overflow-anchor: none` on animated rows.

## Accessibility notes

Verified in this pass (Chromium, automated):

- axe-core 4.10: **0 violations** on the index and LedgerGuard at 1440, 768 and 390.
- Keyboard walk with visible rings on every stop; smallest standalone target 24 px.
- Headings: H1, H2 "Case studies", H3 per tier band, H4 per project.
- No horizontal overflow; no text hidden at rest; Back restores position at all widths; return link lands on the anchor; zero animations under reduced motion.
- The system plates are real lists exposed to assistive technology, not decoration.

- Highlight filter by keyboard: Enter on "Design systems" set the live region to "Design systems: 2 of 7 projects. AlwaysGeeky Games, Emplifi.", marked two rows, hid none; Enter again reset it. (Whether a screen reader speaks it was not tested.)

Not verified: screen readers, Safari, Firefox, touch, zoom and text-spacing, forced colours. The background grid needs a forced-colours check.

## Risks

- **Density.** The atlas reads as a tool. That suits engineers and juries who like systems, but a recruiter on a phone sees a filter row before the first project (LedgerGuard starts at 613 px of 844).
- **Filter groupings are editorial.** "AI review boundaries" or "Testing and DX" are groupings of existing claims; Ali should confirm each mapping before it ships.
- **Plates only exist for projects with a layers diagram.** All three featured projects have one today; a future featured project without one would need a diagram first.
- **Typeface change.** Moving from Geist to Plex touches the whole site, not just `/portfolio`.
- **Grid background** adds texture that may read as busy at large sizes; it must stay below perceptible contrast for text.
