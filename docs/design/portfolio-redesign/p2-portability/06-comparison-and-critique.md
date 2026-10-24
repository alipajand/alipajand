# 06 · Creative comparison and self-critique

## The question P2 had to answer

Can Section A–A carry a whole engineering portfolio? Or is it a striking LedgerGuard piece that falls apart on the second project?

**Short answer:** the grammar carries. The **index** and the **two new scenes** hold together as one set, and neither new scene borrows LedgerGuard's metaphor. One shared rule makes it work. Each project gets one drafting move and one ink, and the move has to be about that project's actual work. Where the evidence is thin, the grammar's honesty devices take over: the opening, the material strips and the schematic notes. They make "nothing to show" look deliberate rather than missing.

The answer is weaker for the **supporting** projects. They have rows and key-plan sheets, but no scenes and no case studies inside this set. P2 does not show that every project deserves a scene. It argues that most should not have one.

## The three projects, side by side

|                     | LedgerGuard (P1)                                                                     | AlwaysGeeky (P2)                                              | Emplifi (P2)                                                    |
| ------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------- | --------------------------------------------------------------- |
| Evidence available  | Shipped screenshot, design prototypes with fictional data, a documented architecture | Two shipped screenshots, a documented system                  | No screenshots; a documented approach and an unsupported metric |
| Drafting move       | Section cut                                                                          | Detail callout                                                | Dimension line and time axis                                    |
| Ink                 | Red                                                                                  | Blueprint blue                                                | Ochre                                                           |
| What the move means | The human review boundary                                                            | This part is shared                                           | This is a measure                                               |
| Transition          | The cut opens into the interface, then the anatomy                                   | Descent: from a part of the interface down through the system | Instrument: a cursor's reading becomes a frame timeline         |
| Depth               | 3D on Chromium, flat elsewhere                                                       | None                                                          | None                                                            |
| Match-cut subject   | Dashboard screenshot                                                                 | Marketplace screenshot                                        | Webview drawing                                                 |

The three transitions differ in kind, not only in colour. LedgerGuard **cuts**, AlwaysGeeky **descends**, Emplifi **measures**. That matters more than the inks. A reader who sees all three should not feel one animation reskinned three times.

## What works

1. **The register is not a card grid.** It reads as a list a hiring manager can scan in seconds: code, name, title, one sentence, role and years, and what kind of proof is behind the row. The key plan makes it visual on desktop without making images necessary. Every row is one link to the case study, so the scene is always optional.
2. **The evidence line in each row.** "Editorial diagrams only · illustrative data · no screenshots" is the most useful new device in P2. It sets expectations before the click and turns a weakness (Emplifi has nothing to show) into a sign of rigour.
3. **AlwaysGeeky's lens.** Lifting a crop of the shipped screenshot, rather than redrawing a component, keeps the scene honest. The descent from that crop to the library, the contract and the gates follows one blue line. It explains "shared component architecture" without a single invented component.
4. **Emplifi without screenshots.** The scene is about the constraint, not the UI. That is closer to what the work actually was. The frame budget is a property of the display, so the one hard number in the scene, 16.7 ms, is true by definition rather than claimed.
5. **The flat LedgerGuard path.** It is a real fallback with its own choreography, not a degraded 3D scene. It gives the depth blocker an exit that does not depend on Safari.

## What does not work yet

1. **AlwaysGeeky's beat 3 is dense.** The camera travels twice, to the contract and then to the gates, and both drawings appear within one card. In the recording, the AG-04 bracket is still drawing as the card settles. Splitting the beat into two steps would read better, but it adds 130 svh to what is already the longest scene.
2. **The schematic proportions can still be read as data.** The EM-04 "after" blocks are about a third to a half of their "before" lengths. The note says they are illustrative, and there is no number. A reader may still read the drawing as a measured reduction, which is close to the unsupported claim. A safer version would change the order or the composition of the blocks, not only their lengths, or show no "after" lengths at all.
3. **Small type on the stage.** The smallest drawing labels on the desktop stage render at about 10–12 px on a 1440 px screen and about 9–10 px on a 1280 px laptop. The full-size drawings in the case study and the phone frames carry the readable versions, but on a laptop the smallest stage labels are decoration, not content. That is acceptable only because the stage is `aria-hidden` and every fact is in the cards.
4. **The thumbnail problem on phones.** Featured rows show thumbnails inline on phones, which makes the register long (about 5,600 px at 390 px wide). A phone reader scrolls past three large images before reaching the supporting projects.
5. **Ochre is the weakest ink.** At line weight it reads as brown on paper, and it needs a darker text variant (`--em-ink`). It works, but blue and red are clearly stronger marks.
6. **The Emplifi match cut crosses the heading.** For a few frames, the webview drawing passes over the case study's title on its way to the hero. The AlwaysGeeky screenshot lands without crossing its title, so this is a timing problem particular to Emplifi. Either the subject should arrive from below the title, or the title should rise later.
7. **The case studies are long.** The scene, then the case study with its full-size drawings, makes AlwaysGeeky about 13 viewport heights on desktop. The scene is skippable, and "Read the case study" is the first link. Still, the page is heavy for a recruiter.

## Alternatives considered and rejected

- **One shared scene for every project**, with the content swapped. Rejected: it would repeat the LedgerGuard metaphor, which the brief rules out, and it would flatten the projects into one story.
- **A Storybook-style component grid for AlwaysGeeky.** Rejected: there is no verified component inventory, and any grid would be an invented Storybook.
- **An abstract "chart" animation for Emplifi**, with bars growing and lines drawing. Rejected: it would look like a product screen and invite the reader to treat illustrative data as real.
- **A gallery index with large hero images.** Rejected by the brief and by the content guidance: images must support, not carry.
- **A 3D stack for AlwaysGeeky's layers.** Rejected so that no P2 scene inherits the depth blocker.

## Decisions for the owner

1. **Approve or replace the new copy** listed in 01, especially the register intro, the AG and EM step headings, and the EM disclosure.
2. **The 80% claim.** It is hidden from this exploration. The production data still has it, in the Emplifi `cardProblem`, `outcome` and meta description. It should be supported with a source or removed there too. That is a content change, outside this branch.
3. **The flat LedgerGuard path for non-Chromium browsers.** Accept a different sequence for Safari and Firefox readers, or ship the flat path to everyone.
4. **Which projects get scenes.** P2 recommends at most three, the current featured set. Supporting projects keep rows, key-plan sheets and case studies, without scenes.
5. **Paper and void outside this concept.** Still approved for the concept only. Nothing in P2 assumes a site-wide theme.
