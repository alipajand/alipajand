# 04 · Compatibility and performance risk

This records what was run, in which engine, and what is still open. Nothing here is a claim of browser support, and no headless result is treated as one. **Safari support is not claimed. Firefox support is not claimed.** No shipping Safari, Firefox, screen reader or real device was tested for P2, P2.1 or P2.2. None of them is available in this environment.

| Environment                         | Status                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------------- |
| Chromium, headless                  | 3D LedgerGuard renders when asked for with `?depth=3d`. Everything in 05 was run here.      |
| WebKit, headless                    | The default flat LedgerGuard path runs. In P1 the 3D anatomy flattened here.                |
| Shipping Safari, macOS and iOS      | **Unverified.**                                                                             |
| Firefox                             | **Unverified.** Not installed in this environment.                                          |
| Real phones, tablets, webview hosts | **Unverified.** Touch, momentum scrolling, thermal limits and GPU differences are untested. |

## What was tested, and where

| Engine                                     | How                                                                         | What it shows                                                                                                            | What it does not show                                                                                           |
| ------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Chromium (Playwright build 1243, headless) | The full review (05), the recordings, the stills and the performance probe  | Every automated check in 05                                                                                              | Real GPU, real input, real devices                                                                              |
| WebKit (Playwright 1.63, headless)         | Screenshots of five states, plus one recording of the LedgerGuard flat path | That the pages render without script errors, that AG and EM run live, and that the LedgerGuard flat path runs by default | **Shipping Safari.** Headless WebKit is not Safari. Its rendering, compositing and scroll behaviour can differ. |
| Firefox                                    | Not installed in this environment                                           | Nothing                                                                                                                  | Everything                                                                                                      |
| VoiceOver, NVDA, TalkBack                  | Not run                                                                     | Nothing                                                                                                                  | Everything; axe and the keyboard walk are not a screen-reader test                                              |
| Real phones and tablets                    | Not run                                                                     | Nothing                                                                                                                  | Touch scrolling, momentum, webview hosts, thermal throttling                                                    |

## LedgerGuard depth: flat by default

**The 3D path remains an unresolved shipping blocker.** The P1 review recorded that in headless WebKit the LedgerGuard anatomy flattened: the 3D stack rendered as a flat pile and the depth reading was lost. That is not evidence that shipping Safari is broken, and it is not evidence that Safari works.

**What P2.1 changed.** P2 chose 3D wherever `navigator.userAgentData` existed, which is a guess about the engine, not a test of what it can render. The review rejected that. Now:

- **The flat "drawn section" is the default everywhere.** On wide screens it runs the P1 narrow-screen section beside the cards: LG-01 as a drawn plate with bands below it, a red line dropping through every band, then the workspace and the match cut. No tilt, no folded edge, no 3D transform on any element. The review checks that last point mid-sequence.
- **3D runs only on request**, with `?depth=3d`, for design review in Chromium. No user-agent or client-hints API is read. The review checks the page source for `userAgentData` and `navigator.userAgent`.
- **No production browser configuration was changed.** This is the prototype only.

**Where the flat path was seen:** headless Chromium (review, stills, `ledgerguard-flat-depth.mp4`) and headless WebKit (screenshot and `webkit-ledgerguard-flat-depth.mp4`). **Where it was not:** shipping Safari, Firefox, any real device.

**Before the 3D path could ship anywhere,** it would need to be seen working in shipping Safari on macOS and iOS and in Firefox, or be gated by a rendering probe rather than an engine guess. Until then the flat path is the verified stable presentation, and the owner should treat 3D as a review-only variant.

## AlwaysGeeky and Emplifi: no 3D at all

Both P2 scenes use 2D transforms, opacity, SVG stroke draw-in and SVG attribute tweens only. They have no `perspective`, no `preserve-3d` and no `rotateX/Y`. They avoid the class of problem that blocks LedgerGuard's 3D path by design. In headless WebKit both run live without errors.

## Feature dependencies and what happens without each

| Feature                                              | Used for                                                                 | Without it                                                                                                                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JavaScript                                           | Every scene, the index condensation and the discipline marks             | Static pages. Every fact is in the HTML, every step shows its figure, and controls that need script are hidden. Tested.                                                           |
| GSAP 3.12.5 and ScrollTrigger (cdnjs)                | Scene timelines                                                          | Fail-safe: the static page returns. Tested with each one blocked.                                                                                                                 |
| `prefers-reduced-motion`                             | Static steps, no transitions                                             | Full motion. The Motion toggle can turn it off per page.                                                                                                                          |
| Cross-document view transitions (`@view-transition`) | 420 ms shared-element page changes                                       | Plain navigation. Not tested in an engine without it.                                                                                                                             |
| `:has()`                                             | Index bay focus (quieting the other bays), AG surfaces that are openings | The other bays are not quieted; frames keep their default ground. Cosmetic.                                                                                                       |
| `position: sticky`                                   | Index opening stage, scene stages (900 px and up)                        | The opening is not pinned. The condensation still scrubs but scrolls away with the page; content stays readable. Not tested in an engine without it.                              |
| `clip-path: inset()` animated by GSAP                | Index condensation: trimming each bay's panes toward the cut             | If a browser ignores it, the panes still move toward the cut but are not trimmed, so the open panes overlap the condensed row for the length of the scrub. Not tested.            |
| `text-wrap: balance`                                 | Headings                                                                 | Normal wrapping                                                                                                                                                                   |
| `svh` units                                          | Stage and step heights                                                   | No `vh` fallback is declared, so a browser without `svh` (Safari before 15.4, Chrome before 108) drops those heights. Not tested. A production version should declare `vh` first. |

## Performance (lab)

Headless Chromium on a laptop, using `capture/perf.mjs`. The whole page is scrolled in 10 s with an rAF loop, and every frame interval is recorded. "4×" is CDP CPU throttling. These numbers show **relative cost between pages and modes**. They are not field performance and say nothing about Safari, Firefox or a real phone.

**Fresh run (P2.2).**

| Page        | Run                                     | Live | Delivered KB | CLS load / after scroll | Frame median / p95 ms | Script ms | Style ms | Layout ms | Task ms |
| ----------- | --------------------------------------- | ---- | ------------ | ----------------------- | --------------------- | --------- | -------- | --------- | ------- |
| index       | desktop                                 | yes  | 342          | 0.004 / 0.004           | 16.7 / 16.7           | 70        | 31       | 57        | 379     |
| index       | desktop, 4x CPU slowdown                | yes  | 342          | 0.004 / 0.004           | 16.7 / 16.7           | 71        | 97       | 186       | 641     |
| index       | phone viewport                          | yes  | 342          | 0.002 / 0.002           | 16.7 / 16.7           | 58        | 11       | 23        | 265     |
| index       | phone viewport, 4x CPU slowdown         | yes  | 342          | 0.002 / 0.002           | 16.7 / 16.8           | 40        | 41       | 101       | 358     |
| index       | phone viewport, 6x CPU slowdown         | yes  | 342          | 0.002 / 0.002           | 16.7 / 16.7           | 96        | 53       | 141       | 608     |
| index       | desktop reduced motion, 4x CPU slowdown | no   | 342          | 0.004 / 0.004           | 16.7 / 16.7           | 31        | 0        | 0         | 131     |
| alwaysgeeky | desktop                                 | yes  | 490          | 0.042 / 0.042           | 16.7 / 16.7           | 69        | 14       | 5         | 267     |
| alwaysgeeky | desktop, 4x CPU slowdown                | yes  | 490          | 0.042 / 0.042           | 16.7 / 16.8           | 81        | 30       | 14        | 359     |
| alwaysgeeky | phone viewport                          | yes  | 490          | 0.039 / 0.039           | 16.7 / 16.7           | 39        | 3        | 1         | 123     |
| alwaysgeeky | phone viewport, 4x CPU slowdown         | yes  | 490          | 0.039 / 0.039           | 16.7 / 16.7           | 80        | 17       | 3         | 307     |
| alwaysgeeky | phone viewport, 6x CPU slowdown         | yes  | 490          | 0.04 / 0.04             | 16.7 / 16.7           | 51        | 12       | 3         | 214     |
| alwaysgeeky | desktop reduced motion, 4x CPU slowdown | no   | 490          | 0.007 / 0.007           | 16.7 / 16.8           | 9         | 0        | 0         | 47      |
| emplifi     | desktop                                 | yes  | 249          | 0.035 / 0.035           | 16.7 / 16.7           | 109       | 25       | 10        | 399     |
| emplifi     | desktop, 4x CPU slowdown                | yes  | 245          | 0.035 / 0.035           | 16.7 / 16.7           | 36        | 14       | 8         | 157     |
| emplifi     | phone viewport                          | yes  | 249          | 0.001 / 0.001           | 16.7 / 16.7           | 88        | 13       | 2         | 319     |
| emplifi     | phone viewport, 4x CPU slowdown         | yes  | 249          | 0.004 / 0.004           | 16.7 / 16.7           | 36        | 6        | 1         | 151     |
| emplifi     | phone viewport, 6x CPU slowdown         | yes  | 249          | 0.001 / 0.001           | 16.7 / 16.7           | 61        | 7        | 3         | 234     |
| emplifi     | desktop reduced motion, 4x CPU slowdown | no   | 249          | 0.003 / 0.003           | 16.7 / 16.7           | 11        | 0        | 0         | 60      |

**Historical, P2.1, the index only** (from [`capture/perf-results-p2.1.jsonl`](capture/perf-results-p2.1.jsonl), for comparison; the P2.1 run had no phone 1× or 6× row):

| Page  | Run                                     | Live | Delivered KB | CLS load / after scroll | Frame median / p95 ms | Script ms | Style ms | Layout ms | Task ms |
| ----- | --------------------------------------- | ---- | ------------ | ----------------------- | --------------------- | --------- | -------- | --------- | ------- |
| index | desktop                                 | yes  | 337          | 0.002 / 0.117           | 16.7 / 16.7           | 85        | 155      | 126       | 672     |
| index | desktop, 4x CPU slowdown                | yes  | 337          | 0.001 / 0.116           | 16.7 / 16.8           | 72        | 409      | 318       | 1280    |
| index | phone viewport, 4x CPU slowdown         | yes  | 337          | 0.001 / 0.378           | 16.7 / 16.8           | 82        | 222      | 330       | 1013    |
| index | desktop reduced motion, 4x CPU slowdown | no   | 324          | 0.002 / 0.002           | 16.7 / 16.8           | 15        | 0        | 0         | 63      |

Raw results: [`capture/perf-results.jsonl`](capture/perf-results.jsonl) (P2.2) and [`capture/perf-results-p2.1.jsonl`](capture/perf-results-p2.1.jsonl) (P2.1).

### Reading the numbers

- **The index opening no longer shifts the page (resolved in P2.2).** P2.1 animated the identity block's top margin and the bays' heights, so every scrolled frame counted as layout shift: 0.117 after a full scroll on desktop and **0.378 at phone width**, a production blocker. P2.2 fixes the opening's height and gives the sticky stage its condensed height at build, then closes the open composition with transforms and `clip-path` only (02). Fresh lab runs: **0.004 on desktop and 0.002 at phone width**, the same at 1×, 4× and 6× CPU slowdown and the same as before any scroll, so what remains is the font swap at load (the shifted nodes are text in the opening, the Scene chips and the bar, moved as the web fonts replace their fallbacks), not the opening. Under reduced motion it is 0.004. Style plus layout work for a full scroll at 4× slowdown on desktop fell from about 730 ms to about 280 ms, and at phone width from about 550 ms to about 140 ms. The review now asserts that the condensation leaves the page's layout unchanged and keeps CLS at or under 0.1 (05). **The 0.1 target is met in the lab only;** a real phone, Safari and Firefox are untested.
- **Main-thread time is the useful signal, not frame pacing.** Headless Chromium paces requestAnimationFrame at 60 Hz without a real compositor or GPU, so every run shows a 16.7 ms median and no long frames. That does not mean a real device holds 60 fps.
- **The scenes cost more than their reduced-motion versions, as expected**, and these runs vary by tens of percent between takes (the AlwaysGeeky 4× run is lower than its 1× run in this take, which is noise, not a gain). Compare orders of magnitude, not single numbers.
- **AlwaysGeeky's world plane is smaller** (1200 × 1400, from 2300), and its style and layout time stays under 30 ms.
- **Scene pages' remaining CLS is at load, not during scroll.** AlwaysGeeky shows 0.039–0.042 and Emplifi up to 0.035, identical before and after the scroll, so it comes from fonts and images settling at load, not from the scenes. AlwaysGeeky's phone value is higher than in P2.1 (0.014): the shifted nodes are the first step's paragraphs (`step__lede`, `step__ctx`, `step__prov`), moving once at load. On desktop they are the stage's plate and world. Reserving the first figure's space or matching fallback font metrics would remove it; that was not done here. All values are under 0.1.
- **Weight.** The index delivers about 342 KB (P2: about 208 KB), because the three bay pictures load on every width and the page loads GSAP, ScrollTrigger and the opening script. AlwaysGeeky delivers about 490 KB and Emplifi about 249 KB.

### Risks

1. **Opening lag.** The index stage is sticky (compositor) while its closing is scrubbed from the main thread. In P2.1 the stage's height was scripted, so a slow frame could open a seam between the stage and the briefs. In P2.2 the briefs never move and sit above the stage, so no seam can open; on a slow device the closing can still trail the scroll by a frame. Real devices are untested.
2. **Stage images on phones.** Phones no longer show the stage, but its markup still loads: the AG stage's 1600 px marketplace screenshot and the lens crop are fetched on every width. A production version should not load stage media below 900 px.
3. **Rebuild on resize.** Each scene rebuilds its timeline when the width changes or fonts load, because every beat is measured from layout. Phones fire width changes rarely, but a desktop window drag rebuilds often. The rebuild is debounced. A production version should measure the cost on a slow device.
4. **SVG draw-in on large drawings.** Stroke dash animation repaints the SVG each frame while it runs. AG-03 and EM-04 are the largest drawings. Each draws for 10–20% of one step on wide screens; on phones each phone sheet's parts draw as they enter the viewport. This is acceptable in the lab; on low-end Android it has not been measured.
5. **Scrub lag.** `scrub: 0.6` smooths motion but means the stage trails a fast flick by up to 0.6 s. That is a deliberate choice, and it should be checked with real touch input.
6. **Three CDN dependencies.** GSAP, ScrollTrigger and Google Fonts. The fail-safe covers GSAP. A font failure falls back to the declared stacks, which changes the measured layout, and the scene rebuilds when fonts load.

## Before any production decision

- Shipping Safari, macOS and iOS: index (including the opening condensation), AG, EM, and LedgerGuard's flat path. Decide whether 3D is ever offered.
- Firefox, desktop and Android: the same set.
- VoiceOver on macOS and iOS: the opening, the bays' two links, a scene's steps, the discipline marks and their live region.
- A mid-range Android phone and an older iPhone: the opening's closing under real touch scrolling, the phone sheets' draw-in, frame pacing through each scene, and the return links' landing position.
- An embedded webview, if the portfolio is ever opened from inside another app. It is not a stated requirement.
