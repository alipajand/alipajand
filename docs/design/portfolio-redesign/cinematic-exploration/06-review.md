# Review: creative and functional

## Creative review

Judged against the brief's own tests, not against automated checks.

| Test                                            | Result                                                                                                                                                                                                                                                                                                            |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One dominant idea                               | **Yes.** The section cut is the identity mark, the transition, the 3D view and the product's key rule (the review boundary). The same red line does all four jobs.                                                                                                                                                |
| Original, not a template                        | **Yes.** Drafting conventions (section line, title block, sheet numbers, exploded axonometric view, vellum versus glass) are not a portfolio template. None of the rejected P1 layouts (editorial index, interface atlas, systems-in-motion) is reused.                                                           |
| Interface → engineering anatomy, with meaning   | **Yes.** Every sheet is a real layer from `data/projects.ts`. Each step card carries a real decision and trade-off. The 3D exists because exploded views are how layered systems are drawn.                                                                                                                       |
| Real versus diagram is distinguishable          | **Yes.** Only LG-01 is a screenshot (dark glass, labelled "Screenshot · shipped product"). LG-02 to LG-05 are paper, labelled "Editorial diagram". The demo says "Not product UI."                                                                                                                                |
| Choreographed motion, not per-element animation | **Yes.** One timeline and one rig, with anticipation before the cut and scrub inertia after. Reading text never animates.                                                                                                                                                                                         |
| Avoid list                                      | No purple, glass, particles, spheres, feature grid or fake dashboard. The diagram linework is content, not decoration: every line is labelled and drawn from the documented architecture.                                                                                                                         |
| "Standard portfolio with animated cards"?       | **Not in the sense the brief warns against.** The step cards are plain text that scrolls natively beside a stage, which is the scrollytelling pattern. The cinematic part is the stage, not the cards. A reviewer who reads only the cards will see a conventional layout, so this is listed as a weakness below. |

**Verdict:** a credible cinematic proof of concept with one strong governing idea. It is **not yet Awwwards-ready**; see "What is still weak".

## Functional review

Automated with `capture/review.mjs` in Chromium; full results are in [`capture/review-results.json`](capture/review-results.json). **36 of 36 checks pass.**

| Area                | Check                                                                                                                                                                                  | Result                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Accessible content  | axe-core (WCAG 2.0/2.1 A and AA plus best practice) on both pages, with motion on and off                                                                                              | 0 violations                  |
| Console             | No errors or failed requests on either page in either mode                                                                                                                             | Clean                         |
| Keyboard            | First Tab reaches "Skip the sequence", visible with a focus ring; Enter lands on `#project-ledgerguard`; every Tab stop on the index is on screen with a visible ring                  | Pass                          |
| Layer index         | Jumping to each sheet marks it `aria-current="step"`                                                                                                                                   | Pass                          |
| Project interaction | Confirm moves the row and its chip, updates the live region, and keeps focus; Reset restores it, with motion on and off                                                                | Pass                          |
| Back                | Index → case study → browser Back restores the exact scroll position and skips the arrival animation                                                                                   | Pass                          |
| Return link         | "Back to the work" lands on `#project-ledgerguard`                                                                                                                                     | Pass                          |
| Reduced motion      | No sticky sequence, 0 running animations, static exploded drawing shown                                                                                                                | Pass                          |
| Motion toggle       | Turns the sequence off; the choice survives a reload                                                                                                                                   | Pass                          |
| Mobile and layout   | No horizontal overflow at 1440, 768 or 390, sampled through the whole page                                                                                                             | Pass                          |
| Native scroll       | No wheel or touch handlers, no Lenis; the stage is CSS `sticky`                                                                                                                        | By construction (code review) |
| Misleading claims   | All facts from `data/projects.ts`. The 90% coverage figure is shown only on the case page, flagged "Source pending", and never in the sequence. Two new lines are marked for approval. | Pass (manual)                 |

### Not verified

These are required by the owner's accessibility decision or are otherwise open. **None was done in this exploration.**

- A **VoiceOver** pass on macOS and iOS. The visible split name is `aria-hidden`, and a visually hidden `h1` carries it; this needs a real screen-reader check.
- **Safari and Firefox.** Everything was tested in Chromium only. Cross-document view transitions do not run in Firefox; the page navigates normally there.
- **Real phones.** Mobile was emulated at 390×844, not run on a device GPU.
- **Field performance.** The numbers in [05](05-feasibility-and-performance.md) are lab probes.
- **Human scrolling.** The recordings use a scripted, eased `scrollTo`, not a wheel or trackpad.

## What is still weak

1. **The first frame at rest is mostly type.** The cut, the markers and the title block lift it above an oversized-text-only hero, but the idea only fully lands once the cut opens. A still-frame judge may not see it. Options: let the dashboard show through a sliver of the cut on arrival, or start the anticipation on a short idle delay. The second needs the 600 ms budget relaxed.
2. **Mobile boundary step.** The step card covers most of the stage, so the chip movement on sheet LG-03 is not visible while confirming on a phone. The demo still works and announces itself, but the payoff is lost.
3. **Collapse to story is a bookend, not a match cut.** The sheets flatten and the paper closes, then the story starts below. A true match cut would hand the screenshot from the stage into the story figure.
4. **Diagram text is too small in perspective.** At the tilt, sheet labels read as texture; the cards carry the meaning. That is acceptable, but the diagrams cannot be read in place.
5. **Sequence length.** About 10 viewport heights before the story. "Skip the sequence", "Skip intro" and the layer index mitigate it, but recruiters scrolling casually pay that cost. It could be tightened to about 7.
6. **Only LedgerGuard is cinematic.** The other six projects sit in a plain register that links to the live site. That is intended for this proof, but the system has not shown how a second project (Emplifi, which has no screenshots) would work.
7. **The step cards are conventional.** As noted above, the reading track is a standard scrollytelling column.

## Risks

| Risk                               | Why it matters                                                                                          | Mitigation                                                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Paper look contradicts the brief   | The creative brief's non-goals include a light theme; production is dark-only                           | Owner decision required before any further work                                                                                 |
| Lenis conflict                     | Production wraps every page in Lenis; the sequence assumes native scroll                                | Disable Lenis on this route, or remove it; see [05](05-feasibility-and-performance.md)                                          |
| Compositing cost on low-end phones | Five 3D-transformed sheets with a large screenshot                                                      | A lower-cost mobile path (fewer sheets, no floor shadow) and a reduced-motion default under a device-memory or frame-rate probe |
| Content drift                      | Sheet diagrams are hand-drawn SVG that mirrors `data/projects.ts`                                       | Generate diagram labels from the same data, as the step cards already are                                                       |
| Role label inconsistency           | LedgerGuard's data says "Senior Product Engineer"; the site positioning says "Senior Software Engineer" | Owner decision; the prototype shows the data as is                                                                              |

## Open decisions for Ali

1. **Paper versus dark.** Accept the light paper exterior as the one deliberate deviation, or ask for a dark-paper variant.
2. **New copy.** Thesis: "The interface, and the work behind it." Sequence note: "Five layers under one shipped product. Scroll down through them, or jump to a layer."
3. **LedgerGuard role label.** Keep "Senior Product Engineer" from the project data, or align it to the site title.
4. **Whether to continue.** If yes, the next step is fixing weaknesses 1 to 3 and a VoiceOver and Safari pass, still as a prototype. No production implementation is authorised.
