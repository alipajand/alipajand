# 05 · Review results

`capture/review.mjs` runs every check below in headless Chromium, with a short WebKit pass at the end. The latest run is in [`capture/review-results.json`](capture/review-results.json).

**Result: 74 pass, 0 fail, 1 skip.** The skip is Firefox, which is not installed in this environment. No Firefox result is claimed.

These are automated checks in a headless engine. They are not a screen-reader test, a real-device test or a shipping-Safari test (see 04).

## What is checked

| Area                                                                | Checks                                                                                                                                                                                                                                                                            | Result                       |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Accessibility (axe-core: WCAG 2.0 and 2.1 A/AA, plus best practice) | All three pages, live and reduced motion                                                                                                                                                                                                                                          | No violations                |
| Console                                                             | All three pages, live and reduced                                                                                                                                                                                                                                                 | No errors or page exceptions |
| Keyboard                                                            | The skip link is the first Tab stop. Every Tab stop is on screen and has a visible focus ring (index 31 stops, AG 14, EM 13). Every register row's case-study link is a Tab stop (7 of 7).                                                                                        | Pass, both modes             |
| Register                                                            | Pointer and keyboard focus both drive the key plan. Keyboard focus wins over a resting pointer. The wipe is 280 ms or less. Design systems marks AlwaysGeeky and Emplifi in the rows and the schedule. The status line names them, is a polite live region, and Escape clears it. | Pass                         |
| No script                                                           | The register keeps 7 links and the full schedule, and shows no dead controls. Scenes hide the stage and show every step figure (AG 3, EM 4).                                                                                                                                      | Pass                         |
| Motion modes                                                        | Live mode is confirmed. Reduced motion gives static steps with no inline transforms. The toggle turns the scene on and off cleanly.                                                                                                                                               | Pass, both scenes            |
| Fail-safes                                                          | GSAP blocked, ScrollTrigger blocked, the scene script blocked, and a throw mid-build. Each leaves the full static page.                                                                                                                                                           | 4 of 4, both scenes          |
| Anchors                                                             | `#case` opens at the case study with the hero shown                                                                                                                                                                                                                               | Pass, both scenes            |
| Match cut                                                           | The subject's box and the hero's box differ by 2 px or less at hand-off, at 1440 and 390 px                                                                                                                                                                                       | Largest difference 0.44 px   |
| Layout                                                              | No sideways scroll on any page from 320 to 1440 px, in both modes                                                                                                                                                                                                                 | Pass                         |
| Facts and provenance                                                | No percentage on any page. Every figure has a strip or is a labelled drawing, and every strip names its material. Emplifi has no raster image. AlwaysGeeky uses only crops of its two shipped screenshots and states that no Storybook screen is shown.                           | Pass                         |
| Ink                                                                 | No red on AlwaysGeeky or Emplifi outside the A–A mark                                                                                                                                                                                                                             | Pass                         |
| LedgerGuard                                                         | Chromium runs 3D by default. `?depth=flat` runs the drawn section with no tilt and no 3D transform mid-sequence. The review captions match the design review and say "Prototype state · fictional data".                                                                          | Pass                         |
| WebKit (headless)                                                   | The index, AG detail and assembly, EM composition, and the LedgerGuard section render without errors. LedgerGuard is flat by default.                                                                                                                                             | Pass, with the limits in 04  |

## Defects found and fixed in this round

The first full run found 16 failures. All were fixed, and the review and recordings were run again.

1. **The register row link was not keyboard-reachable.** It was a `display: contents` link, and Chromium skipped it in the Tab order. The visible secondary link took its place, so a keyboard user on a featured row could reach "Open the scene" but not the case study. The link is now a real box that repeats the row's columns. The review now checks that all 7 row links are Tab stops.
2. **Contrast.** `--ink-3` was 4.49:1 on paper and is now 4.5:1 or better. The red "A–A" in the title block was 4.29:1 as small text. It now uses `--red-ink`.
3. **Duplicate landmark name.** The schedule's scroll region had the same name as its section. It now has its own name.
4. **Strips without a material.** The Agent tooling and ControlTech key-plan openings now say "Editorial diagram · no screenshot".
5. **LedgerGuard flat path still set `z`.** The flat path set a small `z` offset on the stacked plates, which is a 3D transform. It is now omitted when depth is flat.

The stills and recordings also showed defects that no automated check covered:

6. **EM-03 layer notes overflowed their boxes.** The boxes are taller now.
7. **AG-04 bus lines crossed the gate notes.** The shared-scripts bracket now sits above the gates. The footnote is moved clear of the frame.
8. **Content showed through the top bar.** The bar's background faded out too early, so headings scrolling under it stayed legible behind the navigation. Its top band is now opaque paper.

## Recordings: what was reviewed

Each recording was reviewed as video and as frame strips sampled across the clip. These are notes on what the motion actually did, not on stills.

- **Desktop, `desktop-full.mp4` (53 s).** The register: the key plan follows the pointer through LedgerGuard, AlwaysGeeky and Emplifi, and the capability mark dims the unmatched rows and then clears. **AlwaysGeeky:** the callouts draw, the lens lifts at 2.2× with the rest dimmed, and the screenshot steps back into the first surface while the band and the openings assemble. The camera follows the bus to AG-03 and AG-04, and the marketplace screenshot returns into the hero. **Emplifi:** the cursor sweeps the chart and the webview turns ochre. The phone steps aside as the timeline grows and the spill marks appear. The layers rise, the dimension line appears, the timeline redraws to "after", and the stamp appears. The webview lands in the hero.
- **Phone, `mobile-full.mp4`.** Both scenes run in the window above the cards. The readable drawings are in the cards. Both match cuts land.
- **Reduced motion, `reduced-motion.mp4`.** The Motion control reads "Motion off". The register works, and the key plan swaps instantly. Both scenes are static steps with their figures, followed by the case study.
- **LedgerGuard flat path, `ledgerguard-flat-depth.mp4` (Chromium, forced) and `webkit-ledgerguard-flat-depth.mp4` (headless WebKit, default).** The first frame is open and not tipped back. The plate settles flat beside the cards. The layers arrive as a drawn section: LG-01 above, and LG-02 to LG-05 as bands below it, each split by the red line into "suggested" and "confirmed". The workspace prototype follows with the approved captions, from "0 of 13 terms confirmed. Review required." to "13 of 13 terms confirmed. Review complete.", each marked "Prototype state · fictional data". The dashboard screenshot lands in the story's figure. The same sequence plays in both engines. In the WebKit take, the switch from the dark interior back to the paper story lags behind Chromium by a few frames, so one sampled frame is almost entirely dark. That may be the recorder: WebKit uses Playwright's own video recorder, which samples less evenly than Chromium's screencast. It is not a shipping-Safari observation.

The recordings showed two things the stills did not:

- In AlwaysGeeky beat 3, the shared-scripts bracket on AG-04 is still drawing as the card settles on a steady scroll. It finishes before the card leaves.
- In the Emplifi match cut, the webview drawing passes over the case study's heading for a few frames on its way to the hero. The heading is legible before and after, but the overlap is visible.

## Not covered

- Shipping Safari (macOS, iOS), Firefox, and Chromium on Android
- VoiceOver, NVDA, TalkBack
- Real touch scrolling and momentum, real GPUs, thermal throttling
- Cross-document view transitions in an engine that lacks them
- Text zoom at 200% and Windows high-contrast mode
