# Storyboard

Frames are real captures of the prototype in Chromium at 1440×900 (desktop) and 390×844 (mobile), taken at the scroll position named in each row. Scroll distances are at 1440×900; the sequence is about 10.5 viewport heights.

## Scene 01: Opening (0 → 1.25 vh)

| #   | Frame                                                                                                                | What happens                                                                                                                                                                                                                                                         |
| --- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1a  | [desktop-01-cover](screenshots/desktop-01-cover.webp) · [mobile](screenshots/mobile-01-cover.webp)                   | Arrival. Name, role, focus, thesis and title block are all on screen. The section line draws in and the "A" markers land (580 ms total). This frame is the still the page is judged on.                                                                              |
| 1b  | [desktop-02-cut-opening](screenshots/desktop-02-cut-opening.webp) · [mobile](screenshots/mobile-02-cut-opening.webp) | **Anticipation**: both halves press 8 px _toward_ the line, and the cut faces (red hatched edges) appear. Then the halves part. The name splits along its x-height; the header text fades so the bar stays readable. Behind the cut: the real LedgerGuard dashboard. |

## Scene 02: Transformation (1.25 → 3 vh)

| #   | Frame                                                                                           | What happens                                                                                                                                                                                                                         |
| --- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2a  | [desktop-03-work](screenshots/desktop-03-work.webp) · [mobile](screenshots/mobile-03-work.webp) | The interface drifts left to make room for the reading column. The intro card (LedgerGuard, featured 01 of 03, role, overview) scrolls up natively beside it. The screenshot is labelled **LG-01 · Screenshot · shipped product**.   |
| 2b  | (in motion; see [02-into-the-project.mp4](recordings/02-into-the-project.mp4))                  | The camera tilts to an axonometric view (rotateX 56°, rotateZ −36°). Four vellum sheets separate _below_ the interface on the z-axis, 150 px apart. A floor shadow fades in. The product interface is now the top sheet of a system. |

## Scene 03: LedgerGuard (3 → 9 vh)

The camera descends one sheet per step. The step's card scrolls normally on the right (bottom on mobile); only the stage is sticky.

| #   | Frame                                                                                                             | Sheet in focus                                                                                                                                                                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3a  | [desktop-04-layer-api](screenshots/desktop-04-layer-api.webp) · [mobile](screenshots/mobile-04-layer-api.webp)    | **LG-02 Node.js/Fastify API.** Sheets above fade to 6%, sheets below shade down, and the focused sheet lifts 36 px while its ink draws in. Card: the deterministic-vs-probabilistic decision and its trade-off. |
| 3b  | [desktop-05-layer-data](screenshots/desktop-05-layer-data.webp) · [mobile](screenshots/mobile-05-layer-data.webp) | **LG-03 Supabase PostgreSQL, Auth, Storage.** Tenant A, with its _suggested_ store (red, dashed, hatched) and _confirmed_ store. Tenant B is drawn out of scope.                                                |
| 3c  | [desktop-06-layer-jobs](screenshots/desktop-06-layer-jobs.webp) · [mobile](screenshots/mobile-06-layer-jobs.webp) | **LG-04 Redis/BullMQ**, then **LG-05 Python worker** in the same step: API → queue (one failed job with a red retry loop) → worker; contract PDF → Textract → OpenAI → suggested.                               |
| 3d  | [desktop-07-boundary](screenshots/desktop-07-boundary.webp) · [mobile](screenshots/mobile-07-boundary.webp)       | **A–A, the review boundary.** The camera pulls back, and a red hatched plane rises through all five sheets. Card: the rule, plus the interactive demonstration (below).                                         |

### The project interaction

In step A–A, three AI-suggested values (notice window, renewal date, auto-renew) each have a **Confirm** button. Confirming one:

- moves its chip on sheet LG-03 from the suggested store to the confirmed store (800 ms, power3.inOut);
- changes the row's state label to "Confirmed by a reviewer";
- announces "Confirmed: notice window. 2 still suggested." through a polite live region;
- keeps keyboard focus on the button, which becomes `aria-disabled`.

**Reset** returns all three. The fieldset says plainly: "A demonstration of the rule, drawn on sheet LG-03. Not product UI." It works the same with motion off; the chips just move instantly.

See [03-boundary-interaction.mp4](recordings/03-boundary-interaction.mp4).

## Scene 04: Close, story and navigation (9 vh → end)

| #   | Frame                                                                                                             | What happens                                                                                                                                                                                                                                                                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4a  | [desktop-08-close](screenshots/desktop-08-close.webp) · [mobile](screenshots/mobile-08-close.webp)                | The sheets collapse back into the flat interface, and the paper halves close over it. The sequence ends on paper, as it began.                                                                                                                                                                                |
| 4b  | [desktop-09-story](screenshots/desktop-09-story.webp) · [mobile](screenshots/mobile-09-story.webp)                | `#project-ledgerguard`: the readable project story. The section line draws through the heading. Dashboard figure, problem, three decision notes (decision and result), "Read the LedgerGuard case study", and the ledgerguard.io link. Then the register of the six other projects, linking to the live site. |
| 4c  | [desktop-11-case-study](screenshots/desktop-11-case-study.webp) · [mobile](screenshots/mobile-11-case-study.webp) | `ledgerguard.html`. A cross-document view transition morphs the story's dashboard into the case-study hero (`lg-shot`, 520 ms). Full case study: context, problem, role, what I built, decisions (why, trade-off, result), UX, interface evidence, outcome, next.                                             |
| 4d  | [desktop-10-contact](screenshots/desktop-10-contact.webp) · [mobile](screenshots/mobile-10-contact.webp)          | `#contact`: Book a call, GitHub, LinkedIn, location, availability, languages. Not the full production footer.                                                                                                                                                                                                 |

### Navigation contract

| Need                          | How                                                                                                                                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Skip the sequence             | First Tab stop: "Skip the sequence" → `#project-ledgerguard`. The bar also has **Skip intro**.                                                                                                                                                                           |
| Reach the work                | Bar **Work** → `#work`. The layer index (bottom left) jumps to any sheet, with `aria-current="step"` on the sheet in view.                                                                                                                                               |
| Reach contact                 | Bar **Contact** → `#contact`, always visible.                                                                                                                                                                                                                            |
| Open the case study           | "Read the LedgerGuard case study" in the story.                                                                                                                                                                                                                          |
| Return without losing context | Browser **Back** restores the exact scroll position (measured: 10243 → 10243) and skips the arrival animation. The case study's **Back to the work** link goes to `index.html#project-ledgerguard`, and the story heading turns red as the `:target` "you are here" cue. |
| Turn motion off               | Bar **Motion on/off** toggle (`aria-pressed`), remembered per browser. It follows `prefers-reduced-motion` until the visitor chooses.                                                                                                                                    |

## Reduced motion

| Frame                                                                                                               | What it shows                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [reduced-01-cover](screenshots/reduced-01-cover.webp) · [mobile](screenshots/reduced-mobile-01-cover.webp)          | The same cover, already composed. No draw-in.                                                                                                                                         |
| [reduced-02-work](screenshots/reduced-02-work.webp) · [mobile](screenshots/reduced-mobile-02-work.webp)             | The sequence is a normal page: no sticky stage. The intro carries a **static exploded drawing** of all five sheets and the boundary plane, the strongest single still of the concept. |
| [reduced-03-boundary](screenshots/reduced-03-boundary.webp) · [mobile](screenshots/reduced-mobile-03-boundary.webp) | Step cards stack and read in order. The demo still works.                                                                                                                             |
| [reduced-04-story](screenshots/reduced-04-story.webp)                                                               | The story is identical.                                                                                                                                                               |

Recording: [reduced-motion.mp4](recordings/reduced-motion.mp4).
