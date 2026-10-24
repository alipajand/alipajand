# 04 · Compatibility and performance risk

This records what was run, in which engine, and what is still open. Nothing here is a claim of browser support. **Safari support is not claimed.** No shipping Safari, Firefox, screen reader or real device was tested for P2.

## What was tested, and where

| Engine                                     | How                                                                         | What it shows                                                                                                            | What it does not show                                                                                           |
| ------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Chromium (Playwright build 1243, headless) | The full review (05), the recordings, the stills and the performance probe  | Every automated check in 05                                                                                              | Real GPU, real input, real devices                                                                              |
| WebKit (Playwright 1.63, headless)         | Screenshots of five states, plus one recording of the LedgerGuard flat path | That the pages render without script errors, that AG and EM run live, and that the LedgerGuard flat path runs by default | **Shipping Safari.** Headless WebKit is not Safari. Its rendering, compositing and scroll behaviour can differ. |
| Firefox                                    | Not installed in this environment                                           | Nothing                                                                                                                  | Everything                                                                                                      |
| VoiceOver, NVDA, TalkBack                  | Not run                                                                     | Nothing                                                                                                                  | Everything; axe and the keyboard walk are not a screen-reader test                                              |
| Real phones and tablets                    | Not run                                                                     | Nothing                                                                                                                  | Touch scrolling, momentum, webview hosts, thermal throttling                                                    |

## LedgerGuard depth: still an unresolved shipping blocker

**Status: unresolved shipping blocker for the 3D path.** The P1 review recorded that in headless WebKit the LedgerGuard anatomy flattened. The 3D stack rendered as a flat pile and the depth reading was lost. That is not evidence that shipping Safari is broken. It is also not evidence that Safari works. Until the 3D path is seen working in shipping Safari, it must not ship there.

P2 adds a **non-3D fallback**, so the blocker has an exit that does not depend on Safari's 3D behaviour:

- **What it is.** On wide screens, the flat path runs the P1 narrow-screen "drawn section" beside the cards. LG-01 is a drawn plate with bands below it, a red line drops through every band, and the workspace and match cut follow. There is no tilt, no folded edge, and no 3D transform on any element. The review checks that last point mid-sequence.
- **When it runs.** 3D runs only where `navigator.userAgentData` exists, which today is Chromium-based browsers. Every other engine gets the flat path. `?depth=flat` and `?depth=3d` force either one for review.
- **Where it was seen.** In Chromium with `?depth=flat`, in the review, the stills and the recording `ledgerguard-flat-depth.mp4`. In headless WebKit by default, in a screenshot and the recording `webkit-ledgerguard-flat-depth.mp4`.
- **What is still needed.** Before the blocker can be closed, the flat path must be seen in shipping Safari on macOS and iOS, and in Firefox. The owner must also accept that Safari and Firefox readers get a different, flatter LedgerGuard sequence. That is a product decision, not a technical one.

**Risk in the detection rule.** `navigator.userAgentData` is a Chromium API. Using it to choose 3D is a capability guess, not a capability test. If Safari ships 3D correctly, its readers still get the flat path. If a Chromium browser renders 3D badly, its readers still get 3D. A production version should replace the guess with a rendering probe, or ship the flat path everywhere.

## AlwaysGeeky and Emplifi: no 3D at all

Both P2 scenes use 2D transforms, opacity, SVG stroke draw-in and SVG attribute tweens only. They have no `perspective`, no `preserve-3d` and no `rotateX/Y`. They avoid the class of problem that blocks LedgerGuard's 3D path by design. In headless WebKit both run live without errors.

## Feature dependencies and what happens without each

| Feature                                              | Used for                                                                  | Without it                                                                                                                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JavaScript                                           | Every scene, the key plan and capability marks                            | Static pages. Every fact is in the HTML, every step shows its figure, and controls that need script are hidden. Tested.                                                           |
| GSAP 3.12.5 and ScrollTrigger (cdnjs)                | Scene timelines                                                           | Fail-safe: the static page returns. Tested with each one blocked.                                                                                                                 |
| `prefers-reduced-motion`                             | Static steps, no transitions                                              | Full motion. The Motion toggle can turn it off per page.                                                                                                                          |
| Cross-document view transitions (`@view-transition`) | 420 ms shared-element page changes                                        | Plain navigation. Not tested in an engine without it.                                                                                                                             |
| `:has()`                                             | Key-plan thumbnails that hold drawings, and AG surfaces that are openings | Those frames keep their default ground. Cosmetic.                                                                                                                                 |
| `text-wrap: balance`                                 | Headings                                                                  | Normal wrapping                                                                                                                                                                   |
| `svh` units                                          | Stage and step heights                                                    | No `vh` fallback is declared, so a browser without `svh` (Safari before 15.4, Chrome before 108) drops those heights. Not tested. A production version should declare `vh` first. |
| `clip-path: inset()`                                 | Key-plan wipe                                                             | No wipe; the sheet swaps                                                                                                                                                          |

## Performance (lab)

Headless Chromium on a laptop, using `capture/perf.mjs`. The whole page is scrolled in 10 s with an rAF loop, and every frame interval is recorded. "4×" is CDP CPU throttling. These numbers show **relative cost between pages and modes**. They are not field performance and say nothing about Safari, Firefox or a real phone.

| Page        | Run                                     | Live | Delivered KB | CLS   | Frame median / p95 ms | Script ms | Style ms | Layout ms | Task ms |
| ----------- | --------------------------------------- | ---- | ------------ | ----- | --------------------- | --------- | -------- | --------- | ------- |
| index       | desktop                                 | no   | 208          | 0.031 | 16.7 / 16.8           | 52        | 0        | 0         | 219     |
| index       | desktop, 4x CPU slowdown                | no   | 208          | 0.031 | 16.7 / 16.7           | 20        | 0        | 0         | 117     |
| index       | phone viewport, 4x CPU slowdown         | no   | 284          | 0.023 | 16.7 / 16.7           | 9         | 0        | 0         | 47      |
| index       | desktop reduced motion, 4x CPU slowdown | no   | 207          | 0.031 | 16.7 / 16.7           | 14        | 0        | 0         | 75      |
| alwaysgeeky | desktop                                 | yes  | 514          | 0.041 | 16.7 / 16.8           | 82        | 15       | 5         | 272     |
| alwaysgeeky | desktop, 4x CPU slowdown                | yes  | 515          | 0.041 | 16.7 / 16.8           | 114       | 32       | 14        | 465     |
| alwaysgeeky | phone viewport, 4x CPU slowdown         | yes  | 514          | 0.02  | 16.7 / 16.7           | 142       | 47       | 17        | 586     |
| alwaysgeeky | desktop reduced motion, 4x CPU slowdown | no   | 514          | 0.003 | 16.7 / 16.7           | 47        | 0        | 0         | 196     |
| emplifi     | desktop                                 | yes  | 249          | 0.035 | 16.7 / 16.8           | 65        | 16       | 14        | 241     |
| emplifi     | desktop, 4x CPU slowdown                | yes  | 248          | 0.035 | 16.7 / 16.7           | 90        | 31       | 16        | 406     |
| emplifi     | phone viewport, 4x CPU slowdown         | yes  | 248          | 0.014 | 16.7 / 16.7           | 67        | 30       | 13        | 343     |
| emplifi     | desktop reduced motion, 4x CPU slowdown | no   | 248          | 0.003 | 16.7 / 16.7           | 66        | 0        | 0         | 286     |

Raw results: [`capture/perf-results.jsonl`](capture/perf-results.jsonl).

### Reading the numbers

- **Main-thread time is the useful signal here, not frame pacing.** Headless Chromium paces requestAnimationFrame at 60 Hz without a real compositor or GPU, so every run shows a 16.7 ms median and no long frames. That does not mean a real device holds 60 fps.
- **The scenes cost more than the static pages, as expected.** For a full scroll at 4× slowdown, AlwaysGeeky uses about 465 ms of task time on desktop and 586 ms on a phone viewport. Emplifi uses 406 ms and 343 ms. The same pages under reduced motion use 196 ms and 286 ms. The index, which has no scene, uses 75–117 ms.
- **AlwaysGeeky is the heavier scene.** It moves raster images (the screenshot and the lens crop) and a 1200 × 2300 world plane. Emplifi moves SVG only.
- **Layout shift is small but not zero.** The index and the live scenes shift by 0.03–0.04 on load, below the 0.1 "good" threshold. The reduced-motion scenes shift by 0.003. The likely causes are the web-font swap and, on scene pages, the stage being fitted after fonts load. This is not yet traced.
- **Weight.** AlwaysGeeky delivers about 515 KB, mostly its two screenshots at two sizes. Emplifi delivers about 250 KB and the index about 210 KB. The index delivers about 285 KB on a phone, because its featured rows show thumbnails there.

### Risks

1. **Stage images on phones.** The AG stage carries a 1600 px marketplace screenshot and a second crop of it in the lens. On a phone both are drawn at a fraction of their size. A production version should serve a smaller source to the stage on narrow screens.
2. **Rebuild on resize.** Each scene rebuilds its timeline when the width changes or fonts load, because every beat is measured from layout. Phones fire width changes rarely, but a desktop window drag rebuilds often. The rebuild is debounced. A production version should measure the cost on a slow device.
3. **SVG draw-in on large drawings.** Stroke dash animation repaints the SVG each frame while it runs. The AG gates and EM timeline are the largest drawings. Each draws for 10–20% of one step. This is acceptable in the lab; on low-end Android it has not been measured.
4. **Scrub lag.** `scrub: 0.6` smooths motion but means the stage trails a fast flick by up to 0.6 s. That is a deliberate choice, and it should be checked with real touch input.
5. **Three CDN dependencies.** GSAP, ScrollTrigger and Google Fonts. The fail-safe covers GSAP. A font failure falls back to the declared stacks, which changes the measured layout, and the scene rebuilds when fonts load.

## Before any production decision

- Shipping Safari, macOS and iOS: index, AG, EM, and LedgerGuard with the flat path. Close or keep the depth blocker.
- Firefox, desktop and Android: the same set. Firefox gets the flat path by the current rule.
- VoiceOver on macOS and iOS: the register, a scene's steps, the capability marks and their live region.
- A mid-range Android phone and an older iPhone: frame pacing through each scene, and the match cut.
- An embedded webview, if the portfolio is ever opened from inside another app. It is not a stated requirement.
