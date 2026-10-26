# 02 · Motion grammar and transition specification

One motion contract for every sheet. Projects write their beats; the contract stays the same. The implementation is `prototype/motion.js`, about 390 lines and shared by every page. Each scene adds its own file: `ag.js` and `em.js` in P2, and the P1 `sequence.js` for LedgerGuard. The index has its own small file, `register.js`, for the opening's condensation and the discipline marks.

## Principles

1. **Native scroll drives everything.** There is no scroll-jacking and no smooth-scroll library. One GSAP timeline is scrubbed by ScrollTrigger (`scrub: 0.6`) over a sticky stage.
2. **Text never moves with the stage.** Cards scroll natively. Only the drawing moves.
3. **Change while the card arrives, hold while it is read.** Each step's motion starts as its card begins to enter (step top at 55% of the viewport below the top). It settles in the first 60–75% of the step's span and then holds.
4. **Nothing gates content.** Every fact is in the HTML without script. The stage is `aria-hidden`; the steps and the case study carry the content.
5. **Never 3D in P2.** Every P2 scene uses 2D translate, scale and opacity, SVG stroke draw-in, and SVG attribute tweens. The LedgerGuard 3D anatomy now runs only on request, with `?depth=3d` (see 04).
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
- **Narrow screens (below 900 px): no stage.** P2.1 showed the canvas in a window at the top, with each card carrying a second, readable copy of the drawing beneath it. On a phone that put two versions of every drawing on screen at once, with labels too small to read in the window. P2.2 removes the window. Each step is a short vertical unit, heading, text and one figure, and the figure is the motion: as it arrives, its parts (`[data-in]`) fade in and their inked lines draw (`top 92%` to `top 55%` of the viewport, scrubbed), and lines that run the length of a sheet, such as a spine or a probe, draw as the reader goes down it. Below 768 px each figure is a **phone sheet**, a drawing recomposed for a 360-unit-wide column (see 03); from 768 to 899 px it is the wide drawing.
- **World and camera:** a scene may place its drawing on a larger world plane and move the camera over it. AlwaysGeeky uses a 1200 × 1400 world: one move from the assembly down to AG-03. (P2 used 2,300 px and two stops, which the review found over-dense.)

## Timing

| Token           | Value                                                | Use                                                   |
| --------------- | ---------------------------------------------------- | ----------------------------------------------------- |
| Scrub lag       | 0.6 s                                                | All scenes                                            |
| Step span       | 130 svh on wide screens; natural height below 900 px | One card per step                                     |
| Settle          | 60–75% of the step's span                            | Motion done before the card leaves the centre         |
| Draw-in         | `pathLength="1"`, `stroke-dashoffset` 1 → 0          | Callouts, leaders, drops, buses, ticks, gate outlines |
| Opening         | Scrubbed, no lag; length = the height given up       | Index condensation (see below)                        |
| Phone figures   | Scrubbed, 0.4 s lag, from `top 92%` to `top 55%`     | Draw-in of each part of a step's figure below 900 px  |
| Quick state     | 180 ms                                               | Bay and row dimming                                   |
| Page transition | 420 ms, `--ease-out`                                 | Cross-document view transitions                       |

Eases are `power2.inOut` for moves of the subject or camera, `power2.out` for things being laid down, `power1.inOut` for the measuring cursor, and `none` for the final ride. No entrance animation runs on load: the first frame is the open frame. The only timed animations are the 180 ms dimming and the 420 ms view transition, both under the 600 ms ceiling, and neither gates content.

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
| **Descend**    | The camera follows an inked line to the next drawing, which then draws in reading order       | AG spine, clauses, gates                |
| **Probe**      | A line runs along a process and drops onto the stages it inspects                             | EM render path                          |
| **Condense**   | A pinned composition shortens toward a datum until it is a row of the next layout             | Index opening                           |
| **Match cut**  | The subject travels to the hero, arrives a short way before the end, then rises with the page | All                                     |

## The opening: a pinned condensation

The index's first frame is the section through the three featured projects (see 01). The transition into the register is one authored move, scrubbed by native scroll. P2.1 drew it by animating the identity block's margin and the bays' heights, which the browser counts as layout shift on every scrolled frame (0.117 on desktop, 0.378 at phone width; see 04). P2.2 draws the same picture with **stable geometry**:

1. **One layout change, before anything moves.** At build, `.op` is fixed at its natural height H₀ and the sticky `.op__stage` is given its _condensed_ height, H₀ − D, where D is what the opening gives up: the identity block plus the two bay reductions. Everything after the opening is laid out exactly where it was without script. The stage's open composition overflows its box at the start and is closed over D px of scroll.
2. **Identity.** The identity block and the section translate up by the block's height (`y`) while the block fades.
3. **Above the cut.** Each pane rises by dA (the space above the cut goes from about 30 vh to 84 px; 176 to 60 px on a phone) and is clipped from its top by the same amount (`clip-path: inset(dA 0 0 0)`), so its lower edge rides the cut. The picture inside drifts down by dA/2 and settles from 1.08 to 1, so the strip that stays is the picture's middle, not its foot.
4. **The cut** and everything hung from it (the hatched band, the A–A line and its bubbles, the side datums) rise by dA with the pane.
5. **Below the cut.** Each pane rises by dA and is clipped from its bottom by dB (about 22 vh to 64 px; 150 to 46 px on a phone), keeping its upper edge on the cut. The drawing-title blocks rise by dA + dB.
6. On wide screens the side datums, the left A bubble and the key-column end of the cut fade, because the condensed row would run through the key text. Phones keep the legend and timeframes.

Each part's share of the timeline matches its share of D, and the timeline is D px long, so the stage closes at exactly the scroll rate: the briefs below stay attached to its foot, never covered and never left behind. Because the page's layout was already in its condensed state, **nothing moves when the pin releases.** The briefs sit above the stage (`z-index: 1`, paper ground), so a frame of scrub lag cannot show the stage through them. Every moving property is `transform`, `opacity` or `clip-path`.

**Return links.** A link to `index.html#project-<slug>` (every return link in the set; see 01) lands past the condensation, on the register row with every bay in place: on load, unless the visit is a Back or Forward one, and on `hashchange`. A Back or Forward visit keeps the scroll position the browser restores.

Keyboard focus that lands in the identity block after it has slid away scrolls back to the top. The build is torn down and rebuilt on the Motion toggle, a width change and font load; teardown removes the two inline heights and every GSAP style, and any throw leaves the static column.

**Measured cost** (lab, 04): cumulative layout shift after a full scroll is now 0.004 on desktop and 0.002 at phone width, at 1×, 4× and 6× CPU slowdown, and it is the same before any scroll: what remains comes from the font swap at load, not from the opening. Style and layout work for a full scroll at 4× slowdown on desktop fell from about 730 ms to about 280 ms.

**Risk:** the stage is sticky (compositor) while the closing is scrubbed from the main thread. The seam the P2.1 version risked between the stage and the briefs cannot open now, because the briefs never move; on a slow device the closing can still trail the scroll by a frame. Not tested on real devices (see 04).

## The match cut, precisely

1. At build time, `motion.js` measures the hero's media (`[data-slot] .slot-media`) where it will be when the scroll reaches the end of the sequence. It converts that into canvas units.
2. The scene's last drawing holds for the first 12% of the landing span, so its card can be read; it fades by 24%. The subject then travels to the hero, arriving `min(0.3 × viewport, half the remaining span)` before the end, while the hero is still rising.
3. For the last stretch, the subject rises linearly with the page, exactly as the hero does.
4. At timeline progress > 0.998, `data-landed` is set: the stage hides and the hero's media shows. The timeline's own progress is used, not the scroll position, so the hand-off happens on the frame where the two coincide.
5. Before the hand-off, the hero's media is hidden and, for a screenshot, so is its dark plate. The strip and caption are already in place.

The review checks that the subject's box and the hero's box differ by 2 px or less at hand-off, on desktop, for both scenes. **The match cut runs from 900 px up.** Below 900 px there is no stage to travel from; a phone reader scrolls from the last step into the case study, whose hero is already in place.

**Layout, so the subject never crosses text.** In P2 the EM phone travelled across the case-study heading. The case study's top block (`.case__top`) now puts the hero on the left, under the stage's picture area, and the heading in the right-hand column where the cards were, from 900 px up. Below 900 px the hero comes first and the heading follows it. Either way the subject's path and the heading never overlap. This was checked in recorded frames, not only by box geometry (see 05).

## Page transitions

Same-origin page changes use cross-document view transitions (`@view-transition { navigation: auto }`) at 420 ms. One element on each page carries the shared name:

| From                              | To                | Shared element                                                  |
| --------------------------------- | ----------------- | --------------------------------------------------------------- |
| Index bay picture (above the cut) | AG or EM scene    | The stage's subject (≥ 900 px) or the case study's hero (below) |
| Index bay picture                 | LedgerGuard scene | Root cross-fade (P1 names its own pictures)                     |
| Anything else                     | —                 | Root cross-fade only                                            |

Under reduced motion both `pageswap` and `pagereveal` skip the transition (and catch the rejected `ready` promise a skipped transition leaves, so no error reaches the console). Browsers without cross-document view transitions simply navigate.

## Reduced motion

- With reduced motion, `.motion-live` is never set. Scenes become a sequence of readable steps, each with its static figure, followed by the case study.
- The index opening does not pin or condense; it is one static column with the same content.
- Every CSS transition is set to 0 s, so the bay and row dimming become instant.
- The Motion toggle can turn the scene on for this page. That choice is stored, and it wins only under the rule above.

## LedgerGuard and depth

LedgerGuard keeps its P1 choreography. Where depth is flat, wide screens run the P1 narrow-screen "drawn section" beside the cards, with these changes:

- The first frame is not tipped back.
- Sheets have no folded edge.
- No element receives a 3D transform; the review checks for this mid-sequence.

See 04 for how depth is chosen.

## Adding a scene

1. Mark up `.seq[data-scene]` with `.stage` (containing `.pic`, `.canvas` and the scene's world), then `.track` with one `.step` per beat, each with a static `.step__fig`, and `.beat--land`. Where a drawing needs a phone version, the figure holds both: `.fig-w` (the wide drawing in a sideways-scrolling frame) and `.fig-p` (the phone sheet). Mark the parts of a phone sheet that should arrive one by one with `data-in`.
2. Give the case study's hero `data-slot` and its media `.slot-media`, and give the stage's subject `data-vt-subject`.
3. Call `AA.scene(fn)`. Inside `fn`, use the helpers: `S.start(step)`, `S.landStart`, `S.at()`, `S.from()`, `S.onUpdate()` and `S.land(el, base, t0)`.
4. Hide anything that should arrive later with `data-late` in the markup and set its start state in `fn`.
