# 01 · Shared design-system specification

P2 tests whether the Section A–A visual language from P1 can carry the whole engineering portfolio, and not only LedgerGuard. This document separates the grammar every sheet shares from the storytelling that belongs to one project.

It is a design specification for review. It does not approve a production theme, and nothing here changes the production site.

## The rule in one line

Every project is drawn as a **sheet in one drawing set**. The set shares paper, type, materials, sheet numbering, navigation and motion. Each project gets **one drafting move and one ink**, and that move carries its story.

| Layer             | Owned by         | Examples                                                                                                                              |
| ----------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Universal grammar | Every sheet      | Paper and void, type scale, three provenance materials, sheet codes, title block, strips, motion contract, match cut, navigation      |
| Project move      | One project only | LedgerGuard: section cut and review boundary (red). AlwaysGeeky: detail callout (blue). Emplifi: dimension line and time axis (ochre) |

A project never borrows another project's move or ink. The red review boundary stays on LedgerGuard.

## Universal grammar

### Surfaces

- **Paper exterior.** `--paper #ebe6da` on a 24 px drafting grid. Scenes show the grid; reading pages are plain paper.
- **Void interior.** `--void #100f0d`. On the scene and case-study pages only shipped screenshots sit on void, so dark means "this is the real product". The index's section is the one exception: below the A–A cut the bays show the system behind each project as a light-ink diagram on void, and the cut band names it ("LG-02 ↓ Diagram") so the material is never left to colour alone. 06 flags this as an open question.
- **Vellum.** `--vellum #f2ede2` under every editorial drawing and every reading card.

The paper and void pairing is a concept for this exploration only. It is not a proposed site-wide light theme, and nothing here changes the production theme.

### Type

| Role    | Face                                     | Use                                                |
| ------- | ---------------------------------------- | -------------------------------------------------- |
| Display | Big Shoulders Display 700/900, uppercase | Names, sheet titles, step headings, drawing titles |
| Text    | Instrument Sans 400–600                  | Body, cards, case-study prose, drawing labels      |
| Mono    | Martian Mono 400/500, uppercase, tracked | Sheet codes, strips, kickers, materials, the bar   |

Running text is held to 40 rem. Headings use `text-wrap: balance`.

### Provenance materials

Every image in the set is one of three materials. The material is visible in its frame and named in its strip.

| Material                          | Frame                                | Strip text                                                               | Used for                                                                       |
| --------------------------------- | ------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Shipped product                   | Void plate, solid 1 px `--edge-shot` | `Screenshot · shipped product`                                           | LedgerGuard dashboard, AlwaysGeeky marketplace and login, TallyFolio, MapBylaw |
| Editorial diagram                 | Vellum, drafting edge `--edge-draw`  | `Editorial diagram` (plus `illustrative data` or `schematic` where true) | Every drawing in AlwaysGeeky and Emplifi; LedgerGuard bands LG-02 to LG-05     |
| Design prototype · fictional data | Dashed frame                         | `Design prototype · fictional data`                                      | LedgerGuard workspace and dashboard prototypes only                            |

Where there is nothing to show, the drawing convention for an **opening** is used: a dashed box with its two diagonals, labelled "No screenshot in this portfolio". It appears for Agent tooling, ControlTech, and AlwaysGeeky's product and account surfaces. An empty frame is honest; an invented screen is not.

Crops follow the same rule. AlwaysGeeky's Detail 1 is a crop of the shipped marketplace screenshot, and its label says "crop of the shipped screenshot, enlarged · not a Storybook screen".

### Sheet codes and strips

- Each project has a two-letter code: LG, AG, EM, AT, TF, CT, MB. The index is Sheet 00.
- Drawings and plates are numbered within their sheet (AG-01, AG-02 and so on). Details are named "Detail 1".
- Every plate and drawing ends in a **strip** with three parts: code, title, material.

### Title block

The index carries a drafting title block: stack, experience, base and availability, with "Book a call" as its last row. On wide screens it sits to the right of the name. Every value in it comes from the public facts already on the site.

### The A–A mark

The red section line through the name, and `A–A` in the bar, are the set's identity. They are the only red on AlwaysGeeky and Emplifi, apart from the focus ring.

### Focus and controls

- Focus ring: 3 px `--red`, offset 3 px, on every interactive element. Bays and supporting rows draw it inset on the whole link.
- Controls are square-cornered, outlined, at least 32 px tall in the bar and 36 px elsewhere.
- Controls that need script ship disabled and hidden, so a page without script never offers a control that does nothing.

### Navigation

- **Bar:** the A–A mark and name (link to the register), two or three section links, and the Motion toggle.
- **Register (Sheet 00):** the project index. See below.
- **Sheet navigation:** at the end of every case study: previous sheet, index, next sheet.
- **Skip link:** first in tab order on every page, to the selected work or the case study.

## The portfolio index: a section through the work

P2 drew the index as a register: a typeset list with a key-plan aperture. The review found it clear but not cinematic, and long on a phone. P2.1 keeps every destination and turns the first screen into one drawing.

### The first frame

The page opens on the name and the title block, and directly under them a **section through the three featured projects**, cut on the A–A line:

- **Three bays**, one per featured project, separated by solid walls. Bay widths are equal; a dimension string above them gives each one's timeframe and the key says "Bays dimensioned by time · not to scale".
- **Above the cut**, what a user saw: the shipped LedgerGuard dashboard, the historical Voxies marketplace, and for Emplifi the EM-01 webview drawing (there is no Emplifi screenshot).
- **The cut band**, hatched, carries both materials as tags: "LG-01 ↑ Shipped screenshot" and "LG-02 ↓ Diagram". Where a tag would be cut short (below 1,360 px), only the sheet code shows; the brief under the bay names the material in full.
- **Below the cut**, the system behind it, in the project's own ink on void: LedgerGuard's five layers and red review boundary, AlwaysGeeky's four surfaces on one library, Emplifi's React frame around the D3 chart.
- **The thesis as two datums**, set in the key column against the cut: "The interface," above the line and "and the work behind it." below it. On narrow screens they become a two-line legend above the bays.
- **Red A bubbles** at both ends of the cut, the set's identity mark, on wide screens only.

Each bay has a drawing-title block under it: code bubble, name and "Case study →" (one link, straight to the case study), and the case-study title. The picture is a second link, marked "Scene", into the optional scene. Pointing at or focusing a bay quiets the other two; nothing depends on hover.

### The condensation

With motion on, the opening pins while it condenses into the register (see 02): the identity block slides up under the bar, then the bays shorten toward the cut until the row of three is the register's top row. What follows rises at reading speed. Without motion, or without script, the page is the same content as one static column.

### Below the section

| Group      | Sheets                                           | Treatment                                                                                                                                                       |
| ---------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Featured   | LG, AG, EM                                       | The bays, then one **brief** each: role and years, the first sentence of the problem, and what the two materials are ("LG-01 above the cut: … LG-02 below: …"). |
| Supporting | Agent Engineering Tools, TallyFolio, ControlTech | Three columns of plain rows: code box, name, case-study title, "Case study on alipajand.com ↗", role, years and evidence type.                                  |
| Experiment | MapBylaw                                         | Its own group, behind a dashed rule: "A self-directed experiment, kept apart from client and product work."                                                     |

Every one of the seven destinations is a single link from the index. Featured case studies are reachable without opening a scene.

### Mobile

At 390 px the bays become three slender cores side by side, each still cut on the line, with the name and "Case study →" under it. There are no inline screenshots beyond the cores, so the page is about 4,000 px tall (P2 was about 5,600). Supporting work starts around 1,500 px down.

### Disciplines

The capability table is now headed "By discipline": "Explore the work by technical discipline." Seven buttons mark matching projects in the bays and rows and in the table. A polite live region announces the result, for example "Design systems: 2 projects marked, AlwaysGeeky Games, Emplifi." Escape clears it. Without script, the table is a plain table and the buttons are not shown.

## Project moves

### LedgerGuard · the section cut (P1)

Red, `--red #c8321b`. The red line means the human review boundary: suggested values on one side, confirmed values on the other. That meaning is LedgerGuard's alone. P2 changes only the review-state captions (see 04) and adds the flat depth path.

### AlwaysGeeky · the detail callout

Blueprint blue, `--ag #2148b8`, about 6.4:1 on paper; `--ag-v #98adff` on void.

AlwaysGeeky Games makes Voxies. The marketplace and login shown are Voxies surfaces; the marketplace closed in July 2026, so the screenshots are labelled historical and neither address is linked.

- The **callout** is a circle and leader on the shipped screenshot. It names a part of the interface without redrawing it.
- The **lens** lifts that part out, enlarged, as a crop of the same screenshot.
- The **blue line** continues from the lens down through the system: drop lines from each surface to the library, then one spine down AG-03. Storybook contract clauses branch off the spine; the CI gates hang from its foot. Blue always means "this part is shared".

AG-03 is a single drawing so the scene needs one camera move, not two stops. It is not a Storybook screen and names no tool, check count or pass rate.

### Emplifi · the render path and the frame budget

Ochre, `--em #a8670a`, used for lines and fills only. Its text ink is `--em-ink #7d4c05`, about 5.5:1, because the line ochre is too light for small text. On void it is `--em-v #e3a33f`.

The Emplifi sheet shows **technique, not magnitude**. P2's before/after timelines were removed: their shorter "after" blocks read as a measured gain that no source supports.

- **EM-02, the render path.** Five equal stations from input to paint, and an ochre probe line along them: "Profiled where the cost showed up first: in the embedded webview". Brackets mark the two stages the case study names, unnecessary re-renders and chart-update paint work. The note says the boxes are equal on purpose: stages, not durations.
- **EM-04, the frame budget.** A **reference** ruler of three 60 Hz frames, bracketed "16.7 ms", with the text "This is a reference budget, not a measurement; other refresh rates set other budgets." Beside it, an illustrative module tree shows the composition decision: a chart update runs inside the D3-owned region and does not re-render the React controls and legend around it.
- The **dimension line** marks where React's ownership ends and D3's begins.

No drawing on the Emplifi sheet carries a measured value, and no length in it is comparative.

### The index section

The section reuses each project's ink on void (`--lg-v #f0674c` for LedgerGuard's review boundary only, `--ag-v`, `--em-v`). Red on the index appears only in the A–A mark, the A bubbles, the focus ring and LedgerGuard's bay.

## Tokens

All tokens are in `prototype/grammar.css`, except the void inks the index section uses, which are in `prototype/opening.css`. Project inks are used only in `projects.css` and the index section.

```text
--paper #ebe6da   --paper-2 #e2dccd   --vellum #f2ede2
--ink #16140f     --ink-2 #4b463c     --ink-3 #686155   (4.5:1 or better on paper)
--rule rgba(22,20,15,.09)   --rule-strong rgba(22,20,15,.22)
--edge-draw #bdb39c   --edge-shot #2a2723
--void #100f0d    --void-2 #1b1915   --on-void #ede7da   --on-void-2 #b2a998
--red #c8321b                      identity mark, focus ring, LedgerGuard boundary
--red-ink #b02a14                  red as small text on paper (4.29:1 at --red is too low)
--ag #2148b8  --ag-wash            AlwaysGeeky
--em #a8670a  --em-ink #7d4c05  --em-wash   Emplifi
--lg-v #f0674c  --ag-v #98adff  --em-v #e3a33f   project inks on void (index section only, opening.css)
--ease-out cubic-bezier(.16,1,.3,1)   --t-quick 180ms   --t-wipe 280ms
```

## How a new project joins the set

1. Give it a sheet code and a register row, with its evidence type stated honestly.
2. Use only the three materials. If there is no screenshot, use the opening.
3. Choose one drafting move that carries its specific story, and one ink that is not red and not already taken. Possible future moves include a plan view, an elevation, a schedule or a revision cloud.
4. If it gets a scene, reuse the scene shell and motion contract unchanged (see 02). Write only its beats.

## New copy for owner approval

All other text is read from `data/projects.ts` or was approved in an earlier review. Lines marked "review" are the wording the P2 review suggested.

- Selected work: "Seven projects; three explored in depth." (review)
- Disciplines: "By discipline", "Explore the work by technical discipline." (review), and the note "Every mark cites the project's own tag or case-study text. Pick a discipline to mark its projects above."
- Index key and datums: "Bays dimensioned by time · not to scale", "The interface," / "and the work behind it." (the approved thesis, split), cut tags "Shipped screenshot", "Historical screenshot", "Illustrative diagram", "Diagram".
- Supporting and experiment notes: "Case studies on alipajand.com.", "A self-directed experiment, kept apart from client and product work."
- **Voxies relation, needs owner confirmation of the facts:** "AlwaysGeeky Games makes Voxies; the marketplace and login shown here are Voxies surfaces. The marketplace closed in July 2026, so these screenshots are a historical record, not a live product." and "The Voxies marketplace closed in July 2026, so neither the marketplace nor the login address is linked from this prototype."
- AlwaysGeeky headings: "From interface to shared system", "Storybook contracts. CI enforcement." (both review).
- Emplifi headings: "A dense chart in an embedded webview", "Investigating the render path", "Designing within the frame budget" (all review). Disclosure: "No interface screenshots included. Diagrams illustrate the approach with fictional, unmeasured data." (review)
- The notes inside EM-02 and EM-04 quoted above, the AG-03 drawing title and note, and the briefs' material lines.
