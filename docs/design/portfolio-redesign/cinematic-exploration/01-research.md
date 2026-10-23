# Research: five references

Inspected 2026-10-23 in a desktop Chromium browser at 1280×800. Every reference was opened and scrolled live where a live version exists. Where the awarded version is no longer online, the analysis comes from Awwwards' own element recordings, and the text says so.

## How each reference was inspected

| Reference                  | Source used                                                                                                                                                                                | Inspected interactively?                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0110 Studio, 3D scroll     | Awwwards element "3D Scroll Animation" (10.8 s video), plus the live site at `amirvl.com/0110Studio` and its `/3DA` page                                                                   | **Yes.** Live site uses three.js and GSAP; WebGL canvas confirmed.                                                                                                     |
| LVCIDIA                    | Awwwards Honorable Mention, 21 Aug 2023 (Pier-Luc Cossette, Deven Caron, Domaine Public), plus the live site at `lvcidia.xyz`                                                              | **Yes**, live site.                                                                                                                                                    |
| Le:mma Studio              | Awwwards Site of the Day, 11 Mar 2023 (Artemii Lebedev, Sveta Markova), plus the live site at `lemma.studio`                                                                               | **Partly.** The live site was inspected, but it may have changed since the 2023 award; the awarded version could not be confirmed.                                     |
| Aramco, "The Birth of Oil" | The live experience at `aramco.com/en/about-us/our-history/the-birth-of-oil`, reached from Aramco Life                                                                                     | **Yes**, after declining non-essential cookies. **No Awwwards entry was found** in Awwwards listings or web search; the brief's "Awwwards entry" could not be located. |
| Peak'n Film                | Awwwards Site of the Day, 20 Jun 2020 (Corentin Magnetti, Jordan Thiervoz), via its two Awwwards element recordings ("Portfolio navigation transition", "Rollover animated variable font") | **No.** `peaknfilm.com` is now a different site built on Wix. The awarded 2020 build is offline; only the Awwwards recordings were reviewed.                           |

The Le:mma and Peak'n Film notes describe what was visible. They are not claims about the awarded builds beyond that.

---

## 1. 0110 Studio: 3D scroll

- **Composition.** Usually one central object on near-black: a sphere, a tunnel mouth, or a ring. Copy is small and set to one side, so the object carries the frame.
- **Art direction.** Monochrome, with one acid-green word ("IMAGINATION") as the only colour. Binary "1s & 0s" art matches the studio name.
- **Camera.** A continuous dolly forward. Scroll pushes the camera through radial lines, past a row of striped spheres, and into a concentric ring that becomes a tunnel. The `/3DA` page orbits a small isometric room model.
- **Typography choreography.** Very little. Single words appear between camera moves, like title cards.
- **Transitions.** Scene-to-scene by flying through an object: the ring becomes the next frame. There are no cuts.
- **Depth and lighting.** Real 3D: matcap-style shading, soft falloff, grain over everything.
- **Interaction.** Scroll drives the camera. A loader shows a "0110" glyph counting to 100%. There is also a "drag and release the ball" toy.
- **Timing.** Long, even camera moves, with no pauses inside a move.
- **What makes it memorable.** The tunnel. One unbroken forward motion turns a portfolio into a journey.
- **Relevant to an engineering portfolio.** An unbroken camera move as the spine of the page. Going _into_ an object is a strong metaphor for "behind the interface".
- **Do not copy.** The spheres, tunnels and glow are exactly the "arbitrary 3D, particles and glowing spheres" the brief rules out. A blocking loader and a toy game cost a recruiter time.

## 2. LVCIDIA

- **Composition.** Full-bleed renders behind extended uppercase sans-serif headlines. Information sits in small mono labels at the edges, like a HUD.
- **Art direction.** Pure black and white (`#000`/`#fff`). Colour comes only from the artwork, such as the orange desert and monolith of the "FVCKRENDER: TRANSFER" feature.
- **Camera.** Mostly still frames. Depth comes from the render, plus a wireframe terrain mesh that pans slowly.
- **Typography choreography.** Large headlines ("Immersive platform for digital art") arrive with the section. Labels and pills stay put.
- **Transitions.** Awwwards highlights its transition and menu: full-screen wipes between sections.
- **Depth and lighting.** Supplied by the imagery. The interface itself stays flat.
- **Interaction.** Hover states on featured cards. A "Welcome" loader.
- **Timing.** Slow, gallery pacing.
- **What makes it memorable.** Restraint: a strict black-and-white frame lets each artwork be the only colour on screen.
- **Relevant.** Let the real artefact supply the colour. For us, the dark LedgerGuard screenshot should be the one "lit" object in an otherwise quiet frame.
- **Do not copy.** The dark crypto-gallery look reads as generic dark SaaS when the content is software. HUD labels without real data are decoration.

## 3. Le:mma Studio

- **Composition.** A black-and-white photograph of a hand and arm, broken up by large pixel blocks. "LE:MMA STUDIO" in monospace sits at the bottom centre.
- **Art direction.** Monochrome, with a deliberately digital mask over a photograph: analogue subject, digital cut.
- **Camera.** Locked off. Motion comes from the mask, not the camera.
- **Typography choreography.** Minimal. A monospace wordmark and small corner labels.
- **Transitions.** The pixel mask redraws as you scroll. Awwwards lists the hero, scroll, footer and 404 as its strong elements.
- **Depth and lighting.** Flat. Depth is implied by the photo's own lighting.
- **Interaction.** Scroll and cursor drive the mask.
- **Timing.** Stepped, not eased, which suits pixels.
- **What makes it memorable.** The cut itself is the identity: the image is defined by what is removed.
- **Relevant.** **A cut through an image as the identity mark.** This directly informed Section A–A: the name is cut by a section line, and the cut is what opens.
- **Do not copy.** Pixel masks and glitch aesthetics are well worn, and say nothing about engineering.

## 4. Aramco: "The Birth of Oil"

- **Composition.** Centred, large, light-weight sans-serif headings ("The birth of oil, of a kingdom, of Aramco") on a misty mint-to-grey gradient. Later chapters lay a topographic map with fault lines ("Continual shift") under the text, then a globe.
- **Art direction.** Pale, atmospheric, almost scientific: geology rendered as soft gradients and survey lines. No corporate chrome inside the experience.
- **Camera.** Slow vertical travel through time, as if descending through strata. Maps scale and drift with scroll.
- **Typography choreography.** Headings fade in at the centre and step aside for the map. Each chapter is one sentence.
- **Transitions.** Cross-dissolves between chapters, with the map persisting underneath.
- **Depth and lighting.** Fog layers and gradients. Depth is atmospheric, not geometric.
- **Interaction.** A "Press to discover" gate and a sound toggle before the content. The cookie banner covers the experience until it is answered.
- **Timing.** Very slow and documentary.
- **What makes it memorable.** Descent as narrative: going down through layers is going back in time.
- **Relevant.** **Descending through layers, one per chapter, with each layer named.** This became the per-sheet camera descent in Scene 03. Survey and map drafting also points to drawing conventions as an art direction that belongs to its subject.
- **Do not copy.** The gate before content, the sound prompt and the documentary pace all block a recruiter who wants answers in seconds.

## 5. Peak'n Film

- **Composition.** A pastel field (pink, beige or blue, per project), a centred landscape-format image window, and the next project's image peeking in from the right edge.
- **Art direction.** Soft pastels with large photography. A giant serif word ("ARCHITECT") masked over an image.
- **Camera.** None. Motion is 2D: the image window slides and resizes between projects.
- **Typography choreography.** The large word sweeps across the frame during a transition. A variable font animates its weight on hover.
- **Transitions.** The highlighted "portfolio navigation transition": the background colour changes, the current image exits left, and the peeking image grows into the centre. One continuous move.
- **Depth and lighting.** Flat, with depth only from layered image windows.
- **Interaction.** A circular cursor button over the image. Hover changes the variable-font weight.
- **Timing.** Brisk, well under a second per transition, with strong ease-in-out.
- **What makes it memorable.** The index _is_ the transition. You never leave the frame; the next project slides in.
- **Relevant.** Keep the project frame continuous between the index and the detail. This became the shared-element view transition (`lg-shot`) from the story to the case study, and the "peek" of other sheets in the register.
- **Do not copy.** Colour-per-project pastels, photo-led layout and hover-weight type suit a filmmaker, not an engineer.

---

## What the five share, and what we take

1. **One governing idea per page.** A tunnel, a cut, a descent, a slide. Never a collection of effects.
2. **Material belongs to the subject.** Geology for Aramco, film frames for Peak'n Film. For an engineer, the native material is the **technical drawing**: sections, exploded views, title blocks, sheet numbers.
3. **The camera has one path.** Scroll moves one camera; elements do not animate independently.
4. **Restraint around one lit object.** LVCIDIA's black frame around one artwork. For us, the real screenshot is the only lit object.

What none of them does, and an engineering portfolio must: show **what is real and what is diagrammatic**. Section A–A encodes that in material: the screenshot is dark glass, and the editorial diagrams are paper and ink.
