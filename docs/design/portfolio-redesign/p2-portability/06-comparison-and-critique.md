# 06 · Creative comparison and self-critique

This is the P2.2 critique. P2.2 answered the second design review on PR #216: the navigation loop sent readers out of the set, the opening shifted the page, phones showed every drawing twice and too small, the condensed uppercase type and the micro-labels read as a generic kit, and the materials were told apart mainly by colour. The P2.1 critique follows it, marked as historical, so the two can be compared.

## Verdict (P2.2)

**Closer, and still not finished.** The four structural problems are fixed and checked (05): the set is one connected experience, the opening has no layout shift in the lab, phone readers get one readable figure per step, and the case study leads every bay. The type change is the biggest visual gain: names set in a drafting serif, in sentence case, make the first screen read as a drawing set rather than a poster, and with the kickers gone the page has fewer things shouting at once. What keeps it from finished:

1. **The set's type is split.** LedgerGuard's P1 pages still use Big Shoulders Display in uppercase. A reader who follows "Next sheet" from LedgerGuard to AlwaysGeeky changes typeface mid-set. Moving the P1 pages to the P2.2 type is the next change, and it is a P1 rebuild, so it was kept out of this round.
2. **Untested where it matters.** Shipping Safari, Firefox, screen readers and real phones were not available. The opening's closing under real touch scrolling and the phone sheets' draw-in have only been seen in headless Chromium (04).
3. **The cut band is still dense.** Each bay's band carries a sheet code and two material tags; on a laptop it is the busiest strip on the page.

## What P2.2 changed, and whether it worked

| Area            | Before (P2.1)                                                                                                                         | After (P2.2)                                                                                                                                                                           | Did it work?                                                                                                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation      | LedgerGuard's logo and "Work" went to the P1 index, which sent AlwaysGeeky and Emplifi to production. Return links landed at the top. | One set: every return link lands on its project in the condensed register; case studies link in a loop; nothing featured goes to production.                                           | Yes. The journey script walks every path and Back/Forward in three configurations, with no shift on any landing (05). A reader returning from a case study sees the bay they left, not the opening again.                   |
| Opening         | Margin and height animation; CLS 0.117 desktop, 0.378 phone.                                                                          | Fixed-height stage, transforms and clipping only; CLS 0.004 and 0.002, the same as before any scroll.                                                                                  | Yes in the lab. The picture is unchanged: the identity slides away and the bays close on the cut. The closing now trims each pane from its far edge, which reads more like a section being drawn tighter than a resize did. |
| Phone scenes    | A stage window too small to read, plus a sideways-scrolling copy of each drawing.                                                     | No window. One phone sheet per step, recomposed for a 360-unit column, every label 12 px or more, drawn in as it arrives.                                                              | Yes. Each step fits on about one phone screen. The cost: phones lose the match cut and the camera moves; the motion is local to each figure.                                                                                |
| Index on phones | The picture was the Scene link and came first.                                                                                        | "Read the case study →" leads each bay; Scene is a small chip on the picture's corner, after it in the tab order.                                                                      | Yes. The direct path is the larger, first target in every bay.                                                                                                                                                              |
| Type            | Big Shoulders Display, uppercase; mono kickers on most blocks.                                                                        | Instrument Serif names and headings in sentence case; Instrument Sans actions; mono for codes, dates and materials only, in normal case. "Featured" kickers and the notes row removed. | Mostly. It no longer looks like the condensed-caps template. The serif is light at small sizes, so step headings rely on size for weight; a production version should check it on low-DPI screens.                          |
| Materials       | Plates told apart mainly by ground colour, which the dark palette had made nearly equal.                                              | Mounted screenshots (light solid frame, void mat), drawing sheets (faint edge, corner ticks), dashed prototypes.                                                                       | Yes. The three read as three objects at a glance, in stills and on phones, without relying on colour.                                                                                                                       |

## Does the first screen still look like generic AI-generated editorial design?

**Less than in P2.1.** The table below is the P2.1 assessment with a P2.2 column.

| Element                                               | P2.1    | P2.2   | Why                                                                                                                                                                   |
| ----------------------------------------------------- | ------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The section through three projects, cut on A–A        | No      | No     | A drafting convention used for its meaning; unchanged.                                                                                                                |
| Condensed display caps for the name and headings      | **Yes** | No     | Replaced by a drafting serif in sentence case. The name now reads as the title of a drawing.                                                                          |
| Tracked uppercase mono labels everywhere              | **Yes** | Partly | Mono is kept for sheet codes, dates and materials, in normal case. "Section A–A · Sheet 00" became "Sheet 00 · Portfolio"; the kickers are gone. The cut tags remain. |
| Dark paper with a grid, one red accent                | Partly  | Partly | Unchanged; the red still has a meaning.                                                                                                                               |
| Name, role and a four-cell title block above the work | Partly  | Partly | Unchanged. Setting the name on the drawing's own title block (P2.1's suggestion 3) was not done.                                                                      |

## P2.1 critique (historical)

Kept as written for P2.1, so the change can be judged. Its open items 1 (type) and 2 (the opening's mechanics) are answered above.

### Verdict (P2.1)

**The creative work is not finished.** The structural problems the review named are fixed, and they are shown in recorded frames (05). The first screen now has one idea of its own: a section cut through the three projects, the interface above the line and the work behind it below. But the type and labelling around that idea still use the kit that most AI-generated "editorial" portfolios use. Until that changes, the first screen does not meet the brief's originality bar. The opening's condensation also needs re-engineering before it could ship: it animates layout and registers as layout shift during scroll (04). The next round should be a typographic and art-direction pass on the first screen, with the condensation moved to transforms, not more motion.

### Does the first screen still look like generic AI-generated editorial design? (P2.1)

**Partly, yes.** Taken apart:

| Element                                                                | Reads as generic? | Why                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The section through three projects, cut on A–A                         | No                | It is a specific drafting convention used for its meaning: what a user sees above the cut, the system below it. It works only for this portfolio's thesis. Nothing like it appears in the common templates.              |
| Real screenshots above, light-ink diagrams on void below               | No                | The contrast is earned by the material: the shipped surface against the drawn interior. On the dark-only palette the void is close to the paper, so the cut band and plate edges carry more of this than colour does.    |
| Hatched cut band with provenance tags                                  | Mostly no         | Drafting hatch is specific. The tags are needed for honesty, but there are many small labels on one band.                                                                                                                |
| Condensed display caps for the name and headings (Big Shoulders)       | **Yes**           | Tall condensed uppercase on a plain ground is the most common "bold editorial" choice in generated portfolios. It is well set here, but it is not ours.                                                                  |
| Tracked uppercase mono labels everywhere (kickers, strips, keys, tags) | **Yes**           | Mono micro-labels are the signature of the generic look. P2.1 has fewer than P2 but still too many: "Section A–A · Sheet 00", "Bays dimensioned by time · not to scale", the dimension string, the cut tags, the strips. |
| Dark paper with a grid, one red accent                                 | Partly            | The grid is hidden on the index now, which helps. Dark plus one warm accent is common, but here the red has a meaning (the A–A mark and LedgerGuard's review boundary) rather than being a brand accent.                 |
| Name, role and a four-cell title block above the work                  | Partly            | It is clear for recruiters, and the title block is a real drafting reference. But a big name over a fact table is a familiar portfolio hero.                                                                             |

So the drawing is ours and the frame around it is not. A reader's first impression is set by the frame (the name, the type, the labels) before they read the drawing.

**What would fix it, for the next round** (not done here):

1. **Change the display face**, or drop all-caps for the name. A drafting-appropriate serif or a wide grotesk in sentence case would separate the page from the condensed-caps look. This is a typography decision for the owner, because it affects every sheet.
2. **Cut the micro-labels by half.** Keep the sheet codes and the provenance tags (they carry facts). Remove "Section A–A · Sheet 00", fold the "not to scale" key into the dimension string, and drop the mono kickers on the briefs.
3. **Let the drawing carry the name.** Set the name smaller, on the drawing's title block, and give the section more of the first frame. The identity block would become the drawing's title, not a hero above it.
4. **Draw the cut by hand-like means**: a line weight hierarchy and a real section hatch per material (glass for the screenshot face, solid poché for the walls), so the index looks drafted rather than styled.

### What changed in P2.1, and whether it worked

#### P1 · The opening

**Before:** a typeset register with a key-plan aperture. Clear, but the first frame was a list, and the review called it "not cinematically distinctive".

**After:** the first frame is the section through the work. The scroll then condenses it, pinned, into the register's top row, with the identity block sliding away and the bays closing toward the cut. One authored transition, scrubbed by native scroll, with no lag and no entrance animation. The condensed row leads straight into the briefs, supporting work and the experiment.

**Did it work?** The first frame has impact without bigger type or decorative motion, and every project is still one link from the first screen. The condensation has a purpose: it turns the hero into the index instead of scrolling it away. Three weaknesses: it registers layout shift during scroll, which must be re-engineered before production (04); the transition is subtle (on a 1440 × 900 screen the bays lose about 300 px in all), so in a fast scroll it reads as a resize more than a move; and the pinned stage carries a seam risk on slow devices (04). It connects to the scenes through the shared bay picture (view transition into the AG and EM scenes), but the LedgerGuard bay only cross-fades, because the P1 page names its own pictures.

#### P2 · Mobile

**Before:** about 5,600 px at 390 px, because three featured rows each showed a large screenshot.

**After:** about 4,000 px. The three bays sit side by side as narrow cores, still cut on the line, each with its name and "Case study →" under it, no hover needed. Supporting work starts around 1,500 px down. Featured, supporting and experiment are visibly different treatments.

**Did it work?** The length and the route to supporting work are fixed. The cores are small (about 115 px wide) and their screenshots are crops, which reads as texture more than as evidence. A reader who wants to see the product has to open the case study. That is acceptable for an index, but the cores should be checked on a real phone.

#### P3 · Emplifi evidence

**Before:** before/after frame timelines whose shorter "after" blocks implied a measured gain.

**After:** EM-02 is the render path with five equal stations and a probe line; EM-04 is a reference 60 Hz ruler, labelled as a reference and not a measurement, beside an illustrative module tree showing that a chart update stays inside the D3-owned region. No comparative length anywhere. The review checks that every 16.7 ms is called a reference and that no drawing or heading says before, after, reduced, faster or saved.

**Did it work?** Yes on honesty. EM-04 now explains a technique (composition that keeps chart updates out of React) rather than claiming an outcome. It is denser than the old timeline and depends on reading, which suits a case study more than a scene.

#### P4 · AlwaysGeeky

**Before:** two drawings and two camera stops inside one step.

**After:** one drawing (AG-03), one camera move, drawn in reading order: spine, four clauses, three gates. The Voxies relation and the July 2026 closure are stated on the first card, on the plate's strip and in the caption, and the closed marketplace is not linked.

**Did it work?** The beat is calmer and holds while the card is read. AG-03 on a phone is tall in its sideways frame. The Voxies sentence needs the owner to confirm its facts.

#### P5 · Match cuts

**Before:** the EM phone crossed the case-study heading.

**After:** the case study's top block puts the hero under the stage's picture area and the heading in the card column on wide screens; on phones the hero comes first. Both scenes now hold their last drawing until the card is mostly read, then hand off. Reviewed in recorded frames at 1440 and 390 px (05).

**Did it work?** Yes. Neither subject crosses readable text in the reviewed frames. The hand-off still lands within 2 px.

#### P6 · Compatibility

The flat LedgerGuard path is now the default everywhere; 3D runs only with `?depth=3d`. No user-agent API is read. 04 lists what is verified (headless Chromium and WebKit only) and what is not.

### Still weak (P2.1)

1. **The generic type kit**, above. This is the main reason the work is not finished.
2. **The opening's mechanics.** The condensation animates layout, so it shows up as layout shift during scroll (0.378 at phone width, "poor") and as main-thread work (04). The picture is right; the implementation would have to move to transforms and a clip before it could ship.
3. **Provenance by colour on the index.** Elsewhere, void means "shipped product". Below the cut on the index it holds diagrams. The cut tags say so, but the rule is weaker than it was. The owner should decide whether the interior should be vellum instead, at some cost to the first frame's contrast.
4. **The condensation is quiet.** If it stays, it may need one more legible change, for example the dimension string re-labelling into the register's column heads, so the reader sees the hero become an index.
5. **Small type on the stage** at laptop widths, as in P2. The stage is `aria-hidden` and the cards carry every fact.
6. **Ochre** remains the weakest ink at line weight.
7. **Case studies are long**, about 12–13 viewport heights for AlwaysGeeky on desktop including the scene. The scene is skippable and "Read the case study" is the first link.

### Alternatives considered for the opening and rejected (P2.1)

- **Larger type or a full-bleed name.** Ruled out by the brief, and it would make the generic look worse.
- **A horizontal film strip of screenshots.** A gallery in motion; ruled out.
- **Three stacked cards that expand on hover.** Generic cards, and hover-dependent.
- **A 3D exploded stack per project.** Inherits the depth blocker and repeats LedgerGuard's anatomy.
- **The rejected concepts A, B and C** were not revisited.

## The three projects, side by side

|                      | LedgerGuard (P1)                                                                     | AlwaysGeeky (P2)                                          | Emplifi (P2)                                              |
| -------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------- | --------------------------------------------------------- |
| Evidence available   | Shipped screenshot, design prototypes with fictional data, a documented architecture | Two shipped screenshots (historical), a documented system | No screenshots; a documented approach                     |
| Drafting move        | Section cut                                                                          | Detail callout                                            | Probe and reference ruler                                 |
| Ink                  | Red                                                                                  | Blueprint blue                                            | Ochre                                                     |
| What the move means  | The human review boundary                                                            | This part is shared                                       | Where the cost was looked for; the frame a display allows |
| Transition           | The cut opens into the interface, then the anatomy                                   | Descent along one blue line                               | Probe along the render path, then a budget                |
| Depth                | Flat by default; 3D on request                                                       | None                                                      | None                                                      |
| Match cut (≥ 900 px) | Dashboard screenshot                                                                 | Marketplace screenshot                                    | Webview drawing                                           |

## Still weak (P2.2)

1. **Split type across the set** (verdict, above). LedgerGuard's pages keep Big Shoulders Display.
2. **Provenance by colour on the index.** Below the cut the index still shows diagrams on void, where everywhere else void means "shipped". The new frames help (Emplifi's drawn bay has the drafting edge), but the owner's decision from P2.1 still stands.
3. **The cut band's labels** are still many for one strip.
4. **Phones have no match cut** and no camera moves. That is deliberate (one readable figure beats a moving one too small to read) but it means phone readers see less of each project's drafting move in motion.
5. **The remaining CLS is font swap at load** (0.002–0.004 on the index, 0.042 on AlwaysGeeky, unchanged from P2.1). A production version should preload the faces or match fallback metrics.
6. **Stage media still loads on phones** although the stage is hidden (04).
7. **Ochre** remains the weakest ink at line weight; **case studies are long**. Unchanged from P2.1.

## Decisions for the owner

1. **Typography:** approve Instrument Serif and sentence-case names for the set, which would mean moving LedgerGuard's pages to it as well.
2. **Approve or replace the new copy** in 01. The Voxies sentence needs its facts confirmed.
3. **The index interior:** void (current, stronger first frame) or vellum (stricter provenance rule).
4. **The 80% claim** stays out of this exploration. Production data still contains it; changing that is outside this PR.
5. **3D LedgerGuard:** treat it as review-only, or plan a rendering probe and real-browser testing.
6. **The dark-only palette** is concept-only, not a site-wide theme. Both prototypes, P1 LedgerGuard included, now use it.
7. **Phones:** accept phone sheets without a match cut, or ask for a phone-scale motion beat per scene.
