# 04 · Compatibility and performance risk

This records what was run, in which engine, and what is still open. Nothing here is a claim of browser support, and no headless result is treated as one. **Safari support is not claimed. Firefox support is not claimed.** No shipping Safari, Firefox, screen reader or real device was tested for P2 or P2.1.

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
| `position: sticky`                                   | Index opening stage, scene stages                                        | The opening is not pinned. The condensation still scrubs but scrolls away with the page; content stays readable. Not tested in an engine without it.                              |
| CSS custom properties animated by GSAP               | Index bay heights during the condensation                                | If a browser ignores them, the bays keep their open height and the identity block still slides. Not tested.                                                                       |
| `text-wrap: balance`                                 | Headings                                                                 | Normal wrapping                                                                                                                                                                   |
| `svh` units                                          | Stage and step heights                                                   | No `vh` fallback is declared, so a browser without `svh` (Safari before 15.4, Chrome before 108) drops those heights. Not tested. A production version should declare `vh` first. |

## Performance (lab)

Headless Chromium on a laptop, using `capture/perf.mjs`. The whole page is scrolled in 10 s with an rAF loop, and every frame interval is recorded. "4×" is CDP CPU throttling. These numbers show **relative cost between pages and modes**. They are not field performance and say nothing about Safari, Firefox or a real phone.

| Page        | Run                                     | Live | Delivered KB | CLS load / after scroll | Frame median / p95 ms | Script ms | Style ms | Layout ms | Task ms |
| ----------- | --------------------------------------- | ---- | ------------ | ----------------------- | --------------------- | --------- | -------- | --------- | ------- |
| index       | desktop                                 | yes  | 337          | 0.002 / 0.117           | 16.7 / 16.7           | 85        | 155      | 126       | 672     |
| index       | desktop, 4x CPU slowdown                | yes  | 337          | 0.001 / 0.116           | 16.7 / 16.8           | 72        | 409      | 318       | 1280    |
| index       | phone viewport, 4x CPU slowdown         | yes  | 337          | 0.001 / 0.378           | 16.7 / 16.8           | 82        | 222      | 330       | 1013    |
| index       | desktop reduced motion, 4x CPU slowdown | no   | 324          | 0.002 / 0.002           | 16.7 / 16.8           | 15        | 0        | 0         | 63      |
| alwaysgeeky | desktop                                 | yes  | 497          | 0.042 / 0.042           | 16.7 / 16.7           | 139       | 27       | 8         | 482     |
| alwaysgeeky | desktop, 4x CPU slowdown                | yes  | 497          | 0.042 / 0.042           | 16.7 / 16.8           | 72        | 25       | 11        | 289     |
| alwaysgeeky | phone viewport, 4x CPU slowdown         | yes  | 497          | 0.014 / 0.014           | 16.7 / 16.7           | 63        | 22       | 15        | 279     |
| alwaysgeeky | desktop reduced motion, 4x CPU slowdown | no   | 497          | 0.010 / 0.010           | 16.7 / 16.7           | 22        | 0        | 0         | 91      |
| emplifi     | desktop                                 | yes  | 251          | 0.035 / 0.035           | 16.7 / 16.7           | 164       | 30       | 15        | 547     |
| emplifi     | desktop, 4x CPU slowdown                | yes  | 251          | 0.036 / 0.036           | 16.7 / 16.7           | 109       | 32       | 17        | 466     |
| emplifi     | phone viewport, 4x CPU slowdown         | yes  | 251          | 0.018 / 0.018           | 16.7 / 16.8           | 128       | 41       | 18        | 576     |
| emplifi     | desktop reduced motion, 4x CPU slowdown | no   | 251          | 0.003 / 0.003           | 16.7 / 16.8           | 77        | 0        | 0         | 295     |

Raw results: [`capture/perf-results.jsonl`](capture/perf-results.jsonl).

### Reading the numbers

- **The index opening causes layout shift while scrolling. This is a blocker for production as built.** The condensation animates the identity block's top margin and the bays' heights, which are layout properties, so the browser counts each scrolled frame as a shift. Cumulative layout shift after a full scroll is 0.117 on desktop and **0.378 at phone width**, against 0.031 and 0.023 for the static P2 register. Above 0.1 is "needs improvement" and above 0.25 is "poor" in Core Web Vitals. Under reduced motion it is 0.002. It also costs main-thread time: about 730 ms of style and layout work for a full scroll at 4× slowdown on desktop, against none for the static page. **The fix belongs to the next round:** keep the stage at a fixed layout height and condense with transforms and a clip (the bays' upper and lower panes translate toward the cut, a `clip-path` trims them), moving the following content with a transform until the pin releases. That keeps the same picture without layout work per frame. It was not attempted here because it changes the transition's mechanics and needs its own review.
- **Main-thread time is the useful signal, not frame pacing.** Headless Chromium paces requestAnimationFrame at 60 Hz without a real compositor or GPU, so every run shows a 16.7 ms median and no long frames. That does not mean a real device holds 60 fps.
- **The scenes cost more than their reduced-motion versions, as expected**, and these runs vary by tens of percent between takes (the AlwaysGeeky 4× run is lower than its 1× run in this take, which is noise, not a gain). Compare orders of magnitude, not single numbers.
- **AlwaysGeeky's world plane is smaller** (1200 × 1400, from 2300), and its style and layout time stays under 30 ms.
- **Weight.** The index now delivers about 337 KB, from about 208 KB in P2, because the three bay pictures load on every width and the page loads GSAP, ScrollTrigger and the opening script. AlwaysGeeky delivers about 497 KB and Emplifi about 251 KB.

### Risks

1. **Opening seam.** The index stage is sticky, which the compositor handles, while its height is driven from the main thread by the scrubbed timeline. On a slow device or under a long task the two can disagree for a frame, showing a seam or jump between the condensing stage and the briefs below. Headless recordings did not show it; real devices are untested. A production version would need to test this on a mid-range Android phone and an older iPhone, and could fall back to an unpinned opening if it appears.
2. **Stage images on phones.** The AG stage carries a 1600 px marketplace screenshot and a second crop of it in the lens. On a phone both are drawn at a fraction of their size. A production version should serve a smaller source to the stage on narrow screens.
3. **Rebuild on resize.** Each scene rebuilds its timeline when the width changes or fonts load, because every beat is measured from layout. Phones fire width changes rarely, but a desktop window drag rebuilds often. The rebuild is debounced. A production version should measure the cost on a slow device.
4. **SVG draw-in on large drawings.** Stroke dash animation repaints the SVG each frame while it runs. AG-03 and EM-04 are the largest drawings. Each draws for 10–20% of one step. This is acceptable in the lab; on low-end Android it has not been measured.
5. **Scrub lag.** `scrub: 0.6` smooths motion but means the stage trails a fast flick by up to 0.6 s. That is a deliberate choice, and it should be checked with real touch input.
6. **Three CDN dependencies.** GSAP, ScrollTrigger and Google Fonts. The fail-safe covers GSAP. A font failure falls back to the declared stacks, which changes the measured layout, and the scene rebuilds when fonts load.

## Before any production decision

- Shipping Safari, macOS and iOS: index (including the opening condensation), AG, EM, and LedgerGuard's flat path. Decide whether 3D is ever offered.
- Firefox, desktop and Android: the same set.
- VoiceOver on macOS and iOS: the opening, the bays' two links, a scene's steps, the discipline marks and their live region.
- A mid-range Android phone and an older iPhone: the opening seam, frame pacing through each scene, and both match cuts.
- An embedded webview, if the portfolio is ever opened from inside another app. It is not a stated requirement.
