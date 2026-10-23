# Motion specification

## Principles

1. **One camera, one timeline.** The whole sequence is a single GSAP timeline scrubbed by native scroll. Sheets, panels and the boundary move together as one rig. No element has its own scroll trigger, reveal or loop.
2. **Reading text never moves.** Cards in the text track scroll at native speed, in normal document flow. Only the sticky stage behind them is animated. No paragraph fades, slides or scales.
3. **Scroll is never taken over.** There is no Lenis, `preventDefault` on wheel, snapping or pinning spacer. The sticky stage is CSS `position: sticky`. Keyboard scrolling, anchors, Find in page, and Back/Forward all behave natively.
4. **Anticipation and inertia, not bounce.** Each phase has a short counter-move before it and a long ease-out after it. The scrub smoothing (0.9 s) gives the camera weight: it catches up after the reader stops.
5. **Nothing gates content.** All content is in the HTML on first paint. Motion only rearranges what is already there.

## Time-based motion

These run on time, not scroll, and only on a fresh visit with motion on (`:root[data-motion="full"]:not(.returning)`).

| What                                      | Duration | Delay  | Ease                             | Ends at |
| ----------------------------------------- | -------- | ------ | -------------------------------- | ------- |
| Section line draws (`scaleX` 0 → 1)       | 520 ms   | 80 ms  | `cubic-bezier(0.16, 1, 0.3, 1)`  | 600 ms  |
| "A" markers land (scale 0.4 → 1, fade)    | 240 ms   | 340 ms | same                             | 580 ms  |
| Story heading cut draws                   | 520 ms   | 80 ms  | same                             | 600 ms  |
| Page cross-fade (view transition)         | 240 ms   | —      | UA default                       | 240 ms  |
| Dashboard morph, story → case (`lg-shot`) | 520 ms   | —      | `cubic-bezier(0.65, 0, 0.35, 1)` | 520 ms  |
| Demo chip, suggested → confirmed          | 800 ms   | —      | `power3.inOut`                   | 800 ms  |

The demo chip runs over the 600 ms default. Under the owner decision, explanatory interactions may take longer when the duration serves comprehension: the eye has to follow one value across the store boundary. It is triggered by the reader and never blocks input.

## Scroll-linked timeline

Positions are fractions of the sequence's scroll distance (`#sequence` height minus one viewport), computed from real element offsets at build time and rebuilt on width changes. Smoothing is `scrub: 0.9`.

| Phase                      | Starts → ends                                        | Rig (camera)                                                                                      | Sheets and planes                                                                                                                                                                    | Ease                                              |
| -------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| **1a Anticipation**        | 0 → min(1.2%, 10% of phase 1)                        | —                                                                                                 | Top half +8 px, bottom half −8 px (toward the line); cut faces appear                                                                                                                | `power1.in`                                       |
| **1b Cut opens**           | → 95% of the opening beat (125 vh)                   | Dolly in (scale 0.84 → 0.94), then drift left (`x = −0.15 vw`) and settle to 0.84 in the last 45% | Halves part to ∓102% of their height; section line fades over the first 20%; header and foot fade over 35%                                                                           | `power3.inOut`; rig `power1.out` / `power2.inOut` |
| **2 Tilt**                 | end of 1b → intro card at 25% of the viewport        | rotateX 0 → 56°, rotateZ 0 → −36°, scale → 0.54 (mobile 0.6), drop 12 vh                          | Sheets 2–5 go from 0 to full opacity and spread to z = −i × 150 px (mobile 96 px); the floor shadow fades in                                                                         | `power2.inOut`                                    |
| **3 Descent**, per sheet k | step top at 85% → 30% of the viewport                | Recentre on sheet k; rotateZ eases −36° → −29° across the five sheets; scale 0.74 (mobile 0.7)    | Sheets above k → opacity 0.06; sheets below → shade 0.55; sheet k lifts +36 px; its ink paths draw (dashoffset 1 → 0) over the last 90%. Sheet 5 runs mid-way through the jobs step. | `power2.inOut`; ink `power1.out`                  |
| **4 Boundary**             | A–A step top at 85% → 25%                            | Pull back: scale 0.5 (mobile 0.56), rotateZ −26°, centred on sheet 3.4                            | All sheets return, shaded 0.12 × depth; the red plane fades in at 40% of the phase and wipes up (`clip-path` inset 100% → 0) over the last 60%                                       | `power2.inOut`; wipe `power2.out`                 |
| **5a Collapse**            | collapse beat at 70% of the viewport → its 35% point | rotateX/Z → 0, scale 0.62 (mobile 0.86), recentre                                                 | Sheets flatten to z = −i × 2 px; sheets 2–5 fade out; boundary and floor fade                                                                                                        | `power2.inOut`                                    |
| **5b Cut closes**          | → end of the sequence                                | —                                                                                                 | Halves return to 0; the name stays hidden; cut faces fade over the last 25%                                                                                                          | `power3.inOut`                                    |

### Derived states

- `data-ground="void"` while the reader is inside the cut (after 55% of the opening beat and before 5b). It shows the layer index.
- The **bar tone** follows whatever is actually under the bar: `elementsFromPoint` at the bar's centre, read up to the nearest `[data-tone]`. It is re-read on scroll _and_ on every timeline update, because the scrub keeps moving the paper halves after scrolling stops.
- `aria-current="step"` on the layer-index link for the step whose top has passed the middle of the viewport.

### Arrivals mid-page

On Back/Forward, a hash link, or a rebuild after resize, the timeline jumps straight to the current scroll progress (`tl.progress(st.progress)`). It never scrubs through the frames above. The boot script adds `motion-live` before first paint, so the layout is final before the browser restores scroll.

## Modes

| Mode          | Trigger                                                                    | Behaviour                                                                                                                                                                     |
| ------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full          | Default, unless the OS asks for reduced motion                             | All of the above                                                                                                                                                              |
| Reduced       | `prefers-reduced-motion: reduce` (followed live), or the toggle set to off | No `motion-live`: no sticky stage, no timeline, no keyframes, no transitions, no view transitions. A static exploded drawing replaces the sequence. The demo moves instantly. |
| No JavaScript | Script blocked or failed                                                   | Same as reduced: the page is complete, readable HTML.                                                                                                                         |
| Returning     | Back/Forward (`navigation.type === "back_forward"`) or arrival with a hash | Arrival keyframes are skipped; the timeline jumps to its frame.                                                                                                               |

The toggle's choice is stored under `localStorage["aa-motion"]`. Storage failure is caught, and the OS setting then wins.
