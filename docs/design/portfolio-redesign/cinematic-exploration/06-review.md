# Review: self-critique, failure modes and open decisions

Revision 2 of the Section A–A proof. The concept was accepted for further exploration; this prototype is **not approved as final**, and no production implementation has started.

## Creative self-critique

Judged by looking at the frames and recordings, not by the automated checks. Passing checks says the page is safe and accessible; it says nothing about whether it is good.

| Criterion               | Where it stands                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Verdict                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Opening composition     | Much stronger than the closed cover. The cut now _shows_ something real in the first frame: shipped table rows, status chips and the red "unsafe to act" column, tipped back so they read as behind the page. Role, focus, thesis and title block are all readable. **Weak:** the aperture tag sits over the first table row, and at 22° the rows are legible as product but not as text. On mobile the crop is narrow, so it reads more as texture than interface. The split name is still the loudest thing on the page.              | Improved; not final      |
| Cinematic continuity    | The one shipped screenshot is on screen from the first frame to the story's figure. It changes scale, tilt and framing, and is never swapped for another image in transit. The hand-off is measured (below), not claimed. **Weak:** in beat C the screenshot is dimmed to 20% behind the workspace for over a viewport, so continuity there rests on the reader remembering it. In beat D on desktop, two things change at once (the void fading to paper, and the sheet flattening), which slightly muddies the cut.                   | Real; one soft patch     |
| Visual originality      | The drafting language (section line, sheet numbers, hatched poché, a red cut that becomes the product's rule) is specific to this portfolio, and the mobile section with hatched bands is the most original frame in the set. **Weak:** the desktop exploded stack of five tilted sheets is a familiar "layers of the stack" image; the drawing style carries it, the composition does not.                                                                                                                                             | Mostly original          |
| Motion pacing           | 4.5 vh on desktop and 3.9 on mobile, down from about 11.5 and 12. Beats now have one job each. **Weak:** B is the longest beat (1.55 vh) and has the least new information once the stack has opened. C plays three states in about 0.5 vh on desktop, so a fast trackpad flick can skip "partially reviewed"; the scrub smoothing (0.6 s) softens it but does not stop it. The arrival draw-in is under 600 ms and gates nothing.                                                                                                      | Good; B could be shorter |
| Product credibility     | Every material is labelled with its provenance: the shipped screenshot, the editorial diagrams and the design prototypes with fictional data. Prototype claims are explicit about what is shipped and what is proposed. Visitor-facing "Source pending" badges are gone: the unverified metrics are omitted, not flagged. **Weak:** the diagram sheets at the tilt cannot be read in place; the layer list carries the facts. The workspace is three captures of a prototype, cross-faded, not the prototype itself.                    | Strong and honest        |
| Mobile experience       | Recomposed, not shrunk: a window at the top, a drawn section in place of the 3D stack, the workspace cropped to its review list, and a tally whose ticks show the state change at any size. No text sits over motion; the cards read beneath the window. **Weak:** the window takes 56% of the screen, so the reading area below is short and the long cards need a lot of thumb travel. In beat D the sheet moves down to the figure while the page moves up, so for about 0.2 vh they travel in opposite directions before they meet. | Good; reading area tight |
| Recruiter comprehension | The first frame says who, what and where, with Book a call, and the bar's "Case study" link is visible in every frame. The story is reached in 4.5 vh or one click. **Weak:** "Section A–A · Sheet 01" is drafting jargon with no payoff for a recruiter in the first frame, and the layer list is dense for a skim. The thesis line does more work than the section label.                                                                                                                                                             | Good                     |

**Overall:** a materially better proof than revision 1, and the three asks that mattered most (a first frame that reveals, a compressed sequence, a real match cut) are demonstrated in the prototype. It is still a prototype. The open weaknesses are the aperture tag's placement, beat B's length, the desktop stack's familiarity, and the mobile reading area.

## Match-cut measurement

`getBoundingClientRect()` of the stage's screenshot sheet and of the story's figure, at fractions of the sequence's scroll length (x, y, width in CSS px; the figure is hidden until the hand-off, but its box is measured).

| Progress | Desktop 1440×900: sheet | Figure        | Mobile 390×844: sheet | Figure       |
| -------- | ----------------------- | ------------- | --------------------- | ------------ |
| 0.80     | 165, 155, 509           | 100, 950, 690 | 162, 144, 194         | 16, 736, 358 |
| 0.90     | 206, 213, 734           | 100, 545, 690 | 22, 300, 352          | 16, 404, 358 |
| 0.95     | 109, 226, 693           | 100, 342, 690 | 16, 238, 358          | 16, 238, 358 |
| 0.98     | 100, 221, 690           | 100, 221, 690 | 16, 138, 358          | 16, 138, 358 |
| 1.00     | 100, 140, 690           | 100, 140, 690 | 16, 72, 358           | 16, 72, 358  |

From 0.98 on desktop and 0.94 on mobile the two rectangles are identical while both move with the page; at 1.00 the figure takes over and the stage lets go. Recorded in [04-match-cut.mp4](recordings/04-match-cut.mp4) and [mobile-match-cut.mp4](recordings/mobile-match-cut.mp4).

## Failure-mode and functional results

From `capture/review.mjs`: Chromium (Playwright's build 1243) for everything except the engine rows. **82 of 82 checks pass, 1 not run.** Every result, with its measured value, is in [`capture/review-results.json`](capture/review-results.json).

| Area                      | What was checked                                                                                                                                                                           | Result      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| Accessibility             | axe-core on both pages, motion on and off; no console errors                                                                                                                               | 8/8 pass    |
| Keyboard                  | First Tab is the skip link, visible with a focus ring, landing on the story; 11 tab stops on screen, each with a focus ring. Motion on and off                                             | 8/8 pass    |
| Layer list                | A layer button focuses its sheet, sets `aria-pressed` and keeps keyboard focus; pressing it again clears. Motion on and off                                                                | 4/4 pass    |
| Workspace states          | A state button switches every view and announces it; focus stays; scrolling through beat C shows ready, partial and confirmed in that order; one jump across the whole step ends confirmed | 6/6 pass    |
| Workspace prototype       | `workspace.html` renders with no errors, and its back link lands on `#boundary`                                                                                                            | 2/2 pass    |
| Anchors                   | `#work`, `#anatomy`, `#boundary`, `#project-ledgerguard` land at the top of their section; `#contact` lands at the end of the page. Motion on and off                                      | 10/10 pass  |
| Back/Forward              | Back from the case study restores the scroll position and skips the arrival; the case study's return link lands on the story. Motion on and off                                            | 6/6 pass    |
| Direct access             | The bar's Case study link is visible in the first frame. Motion on and off                                                                                                                 | 2/2 pass    |
| Fail-safes                | Static layout, nothing pinned, no inline transforms left, story and figure visible, controls either working or disabled, under each of the six failures below                              | 12/12 pass  |
| Reduced motion, live      | The OS switches to reduced motion mid-page: the sequence comes off at once and the reader keeps their place; switching back brings it back                                                 | 3/3 pass    |
| Stored motion choice      | Stored "on" made before the OS asked for reduced motion → off. Stored "on" chosen while the OS asked for it → on. Stored "off" → off                                                       | 3/3 pass    |
| Motion toggle             | Turns the sequence off, keeps the reader's place, persists across reload                                                                                                                   | 3/3 pass    |
| Overflow                  | No horizontal overflow at 1440, 768 and 390, both pages, motion on and off                                                                                                                 | 12/12 pass  |
| WebKit (Playwright 2359)  | The sequence activates and lands at 1440 and 390 with no errors; reduced motion keeps the static layout                                                                                    | 3/3 pass    |
| Firefox (Playwright 1543) | The browser did not launch on this machine ("Could not find profile folder")                                                                                                               | **Not run** |

**The six failures**, each forced in the browser:

| Failure                   | How it was forced                          | What the page does                                                            |
| ------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------- |
| Reduced motion            | `reducedMotion: "reduce"`                  | Static layout; the state and layer buttons work                               |
| JavaScript disabled       | `javaScriptEnabled: false`                 | Static layout; the buttons are disabled, so none is offered that does nothing |
| GSAP unavailable          | `gsap.min.js` request aborted              | Static layout; the buttons work                                               |
| ScrollTrigger unavailable | `ScrollTrigger.min.js` request aborted     | Static layout; the buttons work                                               |
| `sequence.js` unavailable | `sequence.js` request aborted              | Static layout; the buttons are disabled                                       |
| The timeline build throws | A stub ScrollTrigger whose `create` throws | Static layout, with every transform the half-built timeline had set reverted  |

**Found and fixed by this review:**

- **Dead buttons.** Without `sequence.js`, the layer and state buttons did nothing. They now ship `disabled`, and the script enables them.
- **A stale state.** Scrolling back above beat C left the workspace on "partially reviewed", so it wiped in showing a state from further down. Anything before the first mark is now "ready".
- **A half-built timeline stayed posed.** When the build threw, `ctx` was never assigned, so teardown could not revert the 8 transforms already set, and the static cover was drawn at the timeline's pose instead of its own. The context is now kept when the build throws. The check now requires zero inline transforms.
- **A jump past the workspace left it on "ready".** Past the step's last mark the state was left alone, so one jump from beat B to the end of beat C skipped every crossing. Everything below the second mark is now "confirmed". A new check jumps across the whole step.
- **The fail-safe shifted the layout.** Adding `motion-live` only after GSAP arrived reflowed the page after first paint: a layout shift of 0.64 on desktop and 1.0 at 390 px (found by `perf.mjs`, not by the functional review). The boot script now applies the animated layout before first paint, and `sequence.js` confirms it; see [04 § Activation and fail-safes](04-motion-spec.md#activation-and-fail-safes).

**WebKit, read with care.** Playwright's headless WebKit build on this machine **flattens `preserve-3d`**. A five-plane test page with nothing else on it draws every plane in the same place, with no depth. So in the WebKit captures ([`screenshots/engines/`](screenshots/engines/)), beat B shows only the top sheet: the four diagram sheets are laid out correctly (their boxes match Chromium's to the pixel) but are painted under it. This is a limit of the test browser, not a result for Safari. The flat frames (first frame, mobile, landed) render as in Chromium. **Shipping Safari was not tested.**

**Not verified:** VoiceOver or any other screen reader; real devices; shipping Safari; Firefox; the 3D stack in any WebKit.

## Kept out of visitor-facing pages

These need a source before they can appear anywhere a visitor reads them. The prototype omits them; it does not flag them.

- **LedgerGuard's "90%" figure** in `data/projects.ts`. It is not on the case page any more (the page drops any line with a percentage figure).
- **Emplifi's "80%" figure**. It is not featured in the prototype.

## Open decisions for Ali

1. **New copy.**
   - Sequence line: "Five layers and one review boundary. Scroll, or pick a layer." It replaces the scroll instruction.
   - LedgerGuard line: "Independent product · designed and built end to end". The case-page kicker reads "… · Independent product".
   - Tally lines: "0 of 13 confirmed. Nothing counts yet." / "6 of 13 confirmed. Only those count." / "13 of 13 confirmed. Every term now counts."
   - The thesis "The interface, and the work behind it." is approved and unchanged.
2. **LedgerGuard role.** `data/projects.ts` gives the role as "Senior Product Engineer". The prototype does not print it, because LedgerGuard is Ali's own product, not employment. It says "Independent product" instead, which the project's own text supports ("built alone"). Decide whether the data should change. The prototype introduces no title, and the site-wide role stays "Senior Software Engineer".
3. **Story figure.** The story and case-study hero are back to the shipped dashboard screenshot. Earlier review feedback ("this should be replaced as well") had moved them to the dashboard design prototype. The match cut needs the one real screenshot to persist into the story, and a prototype must not stand in for the shipped UI there. The dashboard prototype states remain in the case study's design-prototype section. Confirm this reversal.
4. **Paper versus dark** is unchanged from revision 1 and still needs a decision.
5. **Whether to continue.** Next would be the weaknesses above, then real-device, Safari and VoiceOver passes, still as a prototype.
