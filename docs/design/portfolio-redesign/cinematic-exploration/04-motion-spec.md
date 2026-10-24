# Motion timeline

Revision 2. It replaces the five-phase, 11.5-viewport timeline of the first proof.

## Principles

1. **One camera, one timeline.** The whole sequence is a single GSAP timeline scrubbed by native scroll (`scrub: 0.6`). The screenshot, the diagram sheets, the boundary plane and the workspace move as one rig. No element has its own scroll trigger, reveal or loop.
2. **The first frame is already open.** The cover is drawn cut open in plain CSS, so it needs no script. It shows the shipped interface through the aperture before any scroll, script or font. The script reads that pose back from CSS and starts the timeline from it, so there is no jump when motion activates. The static and live first frames are pixel-identical in the stage; they differ only in the bar, where the motion toggle exists only with script.
3. **Reading text never moves.** Text scrolls at native speed in normal flow, and only the sticky stage is animated. No paragraph fades, slides or scales.
4. **Scroll is never taken over.** There is no smooth-scroll library, wheel `preventDefault`, snapping or pin spacer. The stage is CSS `position: sticky`. Keyboard scrolling, anchors, Find in page and Back/Forward behave natively.
5. **Nothing gates content.** All content is in the HTML on first paint. Motion only rearranges what is already there, and only after it has proved it can (see [Activation and fail-safes](#activation-and-fail-safes)).

## Length

| Viewport | Sequence scroll       | First version |
| -------- | --------------------- | ------------- |
| 1440×900 | 4,049 px = **4.5 vh** | about 11.5 vh |
| 390×844  | 3,319 px = **3.9 vh** | about 12 vh   |

The case study can be reached at any point. The bar's "Case study" link is visible in every frame, the skip link is the first Tab stop, and the intro card links to the case study.

## Scroll-linked timeline, desktop (1440×900)

Positions are scroll offsets into the sequence, in viewport heights (vh = 900 px). They are computed from real element offsets at build time and recomputed on width change and after web fonts load.

| Beat                        | Scroll     | Camera (rig)                                                                                                                                                                                                | Everything else                                                                                                                                                                                                                                                                                                                                                                           | Ease                                    |
| --------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **A · The cut reveals**     | 0 → 0.65   | From the rest pose (the dashboard's table rows close up, tipped back 22°) to the whole screenshot, flat, at 0.74 of the stage width, moved left of the text column                                          | The aperture tag fades over the first 20%. The section line fades over 30% and the heading and title block over 40%. The paper halves part to ∓104% over 80%.                                                                                                                                                                                                                             | `power2.inOut`                          |
| **B · The anatomy**         | 0.65 → 2.2 | rotateX 0 → 56°, rotateZ 0 → −36°, scale 0.54, over the first 35%. Then a slow drift down the stack, rotateZ −36° → −32°                                                                                    | Sheets LG-02 to LG-05 appear and spread to z = −i × 150 px with the floor shadow. Each drawing inks in (`stroke-dashoffset` 1 → 0) in turn, at 30, 46, 62 and 78% of the beat. The layer list beside it greys out entries whose sheet has not been drawn yet.                                                                                                                             | `power2.inOut`; drift `sine.inOut`      |
| **C · The review boundary** | 2.2 → 3.45 | Pull back to scale 0.5, rotateZ −26°, over 25%                                                                                                                                                              | Sheets below LG-01 shade by depth. The red plane fades in and wipes up through every sheet (10–30%). At 30% the workspace prototype wipes up over the stack, which dims to 20%. Its review state then follows scroll: Ready from 2.65 vh, Partially reviewed from 2.9 vh, Confirmed from 3.15 vh. The tally of 13 terms fills with the state. The workspace wipes away over the last 10%. | wipe `power2.out` / `power2.in`         |
| **D · Into the case study** | 3.45 → 4.5 | Over the first 45%: rotateX/Z → 0, scale 0.8 × base, and the sheet moves straight to the story figure's column. Then it eases to the figure's position and size, and for the last 87 px rises with the page | Sheets LG-02 to LG-05 close onto LG-01 and fade; the boundary and floor fade. The void fades to the story's paper (35–70%), and the bar's tone turns to paper at 55%. At timeline progress > 0.998 the story's own figure becomes visible and the stage's copy is hidden.                                                                                                                 | `power2.inOut`, then linear with scroll |

## Scroll-linked timeline, mobile (390×844)

The desktop rig is not shrunk. Below 900 px the stage is a window across the top 56% of the screen, and the text reads beneath it. Positions are in vh = 844 px.

| Beat                        | Scroll     | What moves                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A · The cut reveals**     | 0 → 0.6    | The screenshot comes flat, full width, into the window. The interior is clipped to the window (`clip-path` bottom inset), so the lower half of the screen is free for text.                                                                                                                                                                                               |
| **B · The anatomy**         | 0.47 → 1.3 | A drawn **section** replaces the exploded stack: five horizontal bands with drafting hatches (LG-01 to LG-05). The screenshot settles into band LG-01, and bands 2–5 are drawn in from the left, one at a time.                                                                                                                                                           |
| **C · The review boundary** | 1.6 → 2.9  | A red vertical line drops through all five bands, splitting each into "suggested" and "confirmed" halves. Then the workspace prototype, cropped to its review list so it is legible at phone size, slides over the section. Its states advance with scroll, and the 13-tick tally beneath it fills: 0, 6, then 13 confirmed. The section returns as the workspace leaves. |
| **D · Into the case study** | 2.9 → 3.9  | The section fades and the window opens to full height. The screenshot grows out of band LG-01 into the story's figure, which on every width now comes first in the story. It meets the figure at 3.7 vh and rides with it to the end.                                                                                                                                     |

## Time-based motion

These run on time, not scroll, and only on a fresh visit with motion on (`:root[data-motion="full"]:not(.returning)`). None is longer than 600 ms, and none gates content.

| What                                             | Duration | Delay  | Ease                             | Ends at |
| ------------------------------------------------ | -------- | ------ | -------------------------------- | ------- |
| Section line draws on the cover (`scaleX` 0 → 1) | 520 ms   | 80 ms  | `cubic-bezier(0.16, 1, 0.3, 1)`  | 600 ms  |
| "A" markers land (scale 0.4 → 1, fade)           | 240 ms   | 340 ms | same                             | 580 ms  |
| Workspace state cross-fade, tally ticks          | 240 ms   | —      | same                             | 240 ms  |
| Page cross-fade (cross-document view transition) | 240 ms   | —      | UA default                       | 240 ms  |
| Screenshot morph, story → case (`lg-shot`)       | 520 ms   | —      | `cubic-bezier(0.65, 0, 0.35, 1)` | 520 ms  |

## Derived states

- **`data-landed`** on the root, when timeline progress passes 0.998. It swaps the stage's screenshot for the story's own figure at the same position and size: the hand-off of the match cut.
- **Bar tone.** While the stage is on screen, the tone comes from timeline progress: void from 45% of beat A to 55% of beat D. Elsewhere, `elementsFromPoint` at the bar reads the nearest `[data-tone]`. The bar has a paper or void backing in every mode, so it stays legible over the dark cards as they scroll under it.
- **Workspace state** (`data-state` on every `[data-ws]` view, `aria-pressed` on the state buttons) is set from the raw scroll position, and only when that position crosses into another state: ready above the first mark, partial between the marks, confirmed below the second, including everywhere after the step, so a jump straight past it never leaves a stale state. A state the reader picked stays until the next crossing.
- **Layer list.** `data-drawn` marks the layers already inked. Pressing a layer button sets `data-focus` on the root, which lifts that sheet (desktop) or band (mobile and static) and dims the rest. Pressing it again clears the focus.

## Activation and fail-safes

Two classes on the root:

- **`motion-live`** lays out the animated version: the sticky stage, the beat spacers, the story pulled up under the stage. On the sequence page, the boot script in `<head>` adds it before first paint when the resolved mode is `full`, so the layout never shifts when the timeline arrives.
- **`motion-ready`** confirms it. Only `sequence.js` adds it, and only after the timeline is built. Until then the CSS rest pose holds the first frame, and the parts GSAP owns (the lower sheets, the boundary plane, the workspace) stay hidden. The provisional frame and the built frame are the same: in a capture with ScrollTrigger held back, they differ by at most 1 of 255 levels on desktop (antialiasing) and are byte-identical at 390 px.

`build()` adds `motion-ready` only when all of these hold:

1. The resolved mode is `full`.
2. `window.gsap` and `window.ScrollTrigger` both exist.
3. The rest pose can be read from CSS.
4. The timeline builds without throwing.

If anything throws, `teardown()` reverts the GSAP context, removes `motion-live`, `motion-ready` and `data-landed`, and logs one warning. The GSAP context is kept even when the build throws, so every transform the half-built timeline set is reverted. If `sequence.js` never runs at all, the boot script's `load` handler sees no `motion-ready` and removes `motion-live`. Either way the page returns to the static layout, and an anchor arrival is put back on its target.

**Why provisional.** Revision 2 first added `motion-live` only from `sequence.js`, after GSAP loaded from the CDN. The static layout painted first and then reflowed into the animated one: a layout shift of 0.64 on desktop and 1.0 at 390 px, almost all of it the beat track moving onto the stage. With the provisional class it is 0.018 and 0.006, the same as the static fallback (font swap). Production would face the same choice, since server-rendered HTML paints before hydration.

| Condition                                                | Result                                                                                                                           | Tested                                    |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| JavaScript disabled                                      | Static layout. No toggle; the boot script does not run.                                                                          | Chromium                                  |
| GSAP fails to load                                       | Static layout once the page has loaded; the toggle still works and the workspace states still switch                             | Chromium, route abort                     |
| ScrollTrigger fails to load                              | Same                                                                                                                             | Chromium, route abort                     |
| `sequence.js` fails to load                              | Static layout: the boot script's `load` handler removes the provisional `motion-live`; the state and layer buttons stay disabled | Chromium, route abort                     |
| The timeline throws while building                       | Torn down to the static layout; one console warning                                                                              | Chromium, stubbed ScrollTrigger           |
| Reduced motion at load                                   | Static layout                                                                                                                    | Chromium, WebKit (Firefox did not launch) |
| The OS switches to reduced motion while the page is open | `motion-live` comes off at once; the reader stays on the section they were reading                                               | Chromium                                  |
| The OS switches back                                     | The sequence returns at the current scroll position                                                                              | Chromium                                  |

### The motion choice

The toggle stores `{ m, os }` under `localStorage["aa-motion2"]`: the choice, and what the OS asked for when it was made.

- A stored choice applies when the OS asks for nothing.
- A stored "on" made **before** the OS asked for reduced motion does not override it. Turning on reduced motion in the OS later always wins.
- A stored "on" made **while** the OS asked for reduced motion is a deliberate choice, made with the visible toggle, and it is honoured.
- If storage fails, the OS setting wins.

### Arrivals mid-page

On Back/Forward, a hash link, or a rebuild after resize, the timeline jumps straight to the current scroll progress (`tl.progress(st.progress)`). It never scrubs through the frames above. When a layout change would move the reader (activation, a teardown, the toggle, an OS change), `keepPlace()` keeps the section they were reading at the same height on screen. After the first successful build, a hash target is scrolled to again, because activation changes where it is.

## Modes

| Mode          | Trigger                                                                    | Behaviour                                                                                                                                                                                                                                                                            |
| ------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Full          | Default, unless the OS asks for reduced motion or a stored choice says off | All of the above                                                                                                                                                                                                                                                                     |
| Reduced       | `prefers-reduced-motion: reduce` (followed live), or the toggle set to off | No `motion-live`: no sticky stage, no timeline, no keyframes, no transitions, no view transitions. The first frame is the same cut-open cover. The anatomy is a static drawn section with the same layer buttons, and the workspace is an inline figure with the same state buttons. |
| No JavaScript | Script blocked or failed                                                   | The same static layout, without the toggle                                                                                                                                                                                                                                           |
| Returning     | Back/Forward or an arrival with a hash                                     | Arrival keyframes are skipped; the timeline jumps to its frame                                                                                                                                                                                                                       |
