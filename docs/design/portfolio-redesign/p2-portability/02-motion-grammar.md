# 02 · Motion grammar and transition specification

One motion contract for every sheet. Projects write their beats; the contract stays the same. The implementation is `prototype/motion.js`, about 330 lines and shared by every page. Each scene adds its own file: `ag.js` and `em.js` in P2, and the P1 `sequence.js` for LedgerGuard.

## Principles

1. **Native scroll drives everything.** There is no scroll-jacking and no smooth-scroll library. One GSAP timeline is scrubbed by ScrollTrigger (`scrub: 0.6`) over a sticky stage.
2. **Text never moves with the stage.** Cards scroll natively. Only the drawing moves.
3. **Change while the card arrives, hold while it is read.** Each step's motion starts as its card begins to enter (step top at 55% of the viewport below the top). It settles in the first 60–75% of the step's span and then holds.
4. **Nothing gates content.** Every fact is in the HTML without script. The stage is `aria-hidden`; the steps and the case study carry the content.
5. **Never 3D in P2.** Every P2 scene uses 2D translate, scale and opacity, SVG stroke draw-in, and SVG attribute tweens. The LedgerGuard 3D anatomy now runs only where it has been seen to render (see 04).
6. **Ends in a match cut.** The scene's subject lands in the case study's hero, and the stage lets go.

## Activation and fail-safe

| Moment                                                                                      | What happens                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<head>` boot script                                                                        | Resolves the motion mode: a stored choice (`aa-motion2`) wins when the OS asks for nothing, or when the choice was itself made under reduced motion. On a scene page in full mode it adds `.motion-live` before first paint, so there is no layout shift. |
| `motion.js` builds                                                                          | Fits the canvas, builds the timeline inside a GSAP context, then adds `.motion-ready`.                                                                                                                                                                    |
| Build fails (GSAP or ScrollTrigger missing, the scene script missing, or a throw mid-build) | `teardown()` reverts the context, which removes every inline style GSAP set. It removes `.motion-live` and `.motion-ready`, and the static page returns.                                                                                                  |
| `load` fires without `.motion-ready`                                                        | The boot script removes `.motion-live` and re-scrolls to the hash target.                                                                                                                                                                                 |
| Toggle or OS change                                                                         | Rebuilds in place and keeps the reader's section at the same height on screen.                                                                                                                                                                            |
| Resize (width change) or fonts loaded                                                       | Rebuilds, because every beat is measured from layout.                                                                                                                                                                                                     |

All four failure routes are tested in the review: GSAP blocked, ScrollTrigger blocked, scene script blocked, and timeline throws.

## The stage

- **Canvas:** a fixed 1200 × 800 drawing, scaled by `--k` to fit the picture area. It is drawn large and only scaled down.
- **Wide screens (≥ 900 px):** the picture area is the stage left of the cards. Cards are `min(28rem, 31vw)` on the right.
- **Narrow screens:** a **window** at the top shows the canvas full-width (paper band with a 1.5 px ink rule). Cards scroll beneath it, never over it. Because diagram labels are too small for a phone at that scale, each card carries the readable drawing in a sideways-scrolling frame.
- **World and camera:** a scene may place its drawing on a larger world plane and move the camera over it. AlwaysGeeky uses a 1200 × 2300 world to travel down from the interface to the gates.

## Timing

| Token            | Value                                               | Use                                                   |
| ---------------- | --------------------------------------------------- | ----------------------------------------------------- |
| Scrub lag        | 0.6 s                                               | All scenes                                            |
| Step span        | 130 svh on wide screens, at least 110 svh on narrow | One card per step                                     |
| Settle           | 60–75% of the step's span                           | Motion done before the card leaves the centre         |
| Draw-in          | `pathLength="1"`, `stroke-dashoffset` 1 → 0         | Callouts, leaders, drops, buses, ticks, gate outlines |
| Hover/focus wipe | 280 ms, `--ease-out`                                | Key plan in the register                              |
| Quick state      | 180 ms                                              | Row dimming                                           |
| Page transition  | 420 ms, `--ease-out`                                | Cross-document view transitions                       |

Eases are `power2.inOut` for moves of the subject or camera, `power2.out` for things being laid down, `power1.inOut` for the measuring cursor, and `none` for the final ride. No entrance animation runs on load: the first frame is the open frame. The only timed animations are the 280 ms wipe and the 420 ms view transition, both under the 600 ms ceiling, and neither gates content.

## Beat patterns

These are the reusable shapes. Each project picks some and adds its own move.

| Pattern        | Shape                                                                                         | Used by                                 |
| -------------- | --------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Open frame** | The first frame already shows the subject. Nothing is hidden waiting for scroll.              | All                                     |
| **Annotate**   | Ink draws onto the subject: callouts, cursors, dimension lines                                | AG callouts, EM cursor, LG section line |
| **Lift**       | A part comes forward, enlarged, with the rest dimmed behind it                                | AG lens                                 |
| **Step back**  | The subject shrinks into its place in a larger drawing                                        | AG plate into surface, EM phone aside   |
| **Assemble**   | Parts arrive in order, staggered 6–8% of the step                                             | AG surfaces, EM blocks, LG bands        |
| **Explode**    | A stack opens from its base into layers                                                       | EM composition, LG anatomy              |
| **Descend**    | The camera follows an inked line to the next drawing                                          | AG bus to contract and gates            |
| **Revise**     | The same drawing redrawn to a new state; labels swap at one point                             | EM before → after                       |
| **Match cut**  | The subject travels to the hero, arrives a short way before the end, then rises with the page | All                                     |

## The match cut, precisely

1. At build time, `motion.js` measures the hero's media (`[data-slot] .slot-media`) where it will be when the scroll reaches the end of the sequence. It converts that into canvas units.
2. The subject travels there, arriving `min(0.3 × viewport, half the remaining span)` before the end, while the hero is still rising.
3. For the last stretch, the subject rises linearly with the page, exactly as the hero does.
4. At timeline progress > 0.998, `data-landed` is set: the stage hides and the hero's media shows. The timeline's own progress is used, not the scroll position, so the hand-off happens on the frame where the two coincide.
5. Before the hand-off, the hero's media is hidden and, for a screenshot, so is its dark plate. The strip and caption are already in place.

The review checks that the subject's box and the hero's box differ by 2 px or less at hand-off, on desktop and on a phone, for both scenes.

## Page transitions

Same-origin page changes use cross-document view transitions (`@view-transition { navigation: auto }`) at 420 ms. One element on each page carries the shared name:

| From                                                | To               | Shared element                                                    |
| --------------------------------------------------- | ---------------- | ----------------------------------------------------------------- |
| Register, key plan (wide) or row thumbnail (narrow) | AG or EM scene   | The stage's subject: the marketplace plate or the webview drawing |
| Register                                            | AG or EM `#case` | The case study's hero                                             |
| Anything else                                       | —                | Root cross-fade only                                              |

Under reduced motion both `pageswap` and `pagereveal` skip the transition. Browsers without cross-document view transitions simply navigate.

## Reduced motion

- With reduced motion, `.motion-live` is never set. Scenes become a sequence of readable steps, each with its static figure, followed by the case study.
- Every CSS transition is set to 0 s, so the wipe and the row dimming become instant.
- The Motion toggle can turn the scene on for this page. That choice is stored, and it wins only under the rule above.

## LedgerGuard and depth

LedgerGuard keeps its P1 choreography. Where depth is flat, wide screens run the P1 narrow-screen "drawn section" beside the cards, with these changes:

- The first frame is not tipped back.
- Sheets have no folded edge.
- No element receives a 3D transform; the review checks for this mid-sequence.

See 04 for how depth is chosen.

## Adding a scene

1. Mark up `.seq[data-scene]` with `.stage` (containing `.stage__win`, `.pic`, `.canvas` and the scene's world), then `.track` with one `.step` per beat, each with a static `.step__fig`, and `.beat--land`.
2. Give the case study's hero `data-slot` and its media `.slot-media`, and give the stage's subject `data-vt-subject`.
3. Call `AA.scene(fn)`. Inside `fn`, use the helpers: `S.start(step)`, `S.landStart`, `S.at()`, `S.from()`, `S.onUpdate()` and `S.land(el, base, t0)`.
4. Hide anything that should arrive later with `data-late` in the markup and set its start state in `fn`.
