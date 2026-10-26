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

The prototype is **dark only**: a drafting board at night. There is no light theme and no theme switch; every page sets `color-scheme: dark`.

- **Paper exterior.** `--paper #171612`, a warm near-black, on a 24 px drafting grid drawn in light ink at low alpha. Scenes show the grid; reading pages are plain paper.
- **Void interior.** `--void #090807`, a deeper black. On the scene and case-study pages only shipped screenshots sit on void. Void and paper are close (about 1.1:1), so the ground colour cannot carry the material: a shipped screenshot is **mounted** (a light solid frame, `--frame-shot`, around a 6 px void mat) and a diagram is a **drawing sheet** (vellum, a fine drafting edge and registration ticks at its corners). See "Provenance materials" below. The index's section is the one exception: below the A–A cut the bays show the system behind each project as a light-ink diagram on void, and the cut band names it ("LG-02 ↓ Diagram") so the material is never left to colour alone. 06 flags this as an open question.
- **Vellum.** `--vellum #1f1d18`, one step lighter than paper, under every editorial drawing and every reading card.
- **Contact band.** The contact sheet at the foot of every page sits on void with a strong rule above it.

The dark palette is a concept for this exploration only. It is not a proposed site-wide theme, and nothing here changes the production theme.

### Type

| Role  | Face                                       | Use                                                                                          |
| ----- | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Names | Instrument Serif 400, sentence case        | Project names, sheet and step headings, drawing titles, section heads, the contact line      |
| Text  | Instrument Sans 400–600                    | Body, cards, case-study prose, drawing labels, every action ("Read the case study →")        |
| Codes | Martian Mono 400/500, normal case, tracked | Only what a drafting sheet would set in mono: sheet codes, dates, materials, strips, the bar |

P2.2 replaced the condensed uppercase display face (Big Shoulders Display) with a drafting-room serif. The uppercase display read as generic poster type and, with the mono kickers, turned every block into a stack of shouted labels. Now a heading is a name, set like a title on a drawing; mono is kept for the codes, dates and provenance that a sheet would actually carry, in normal case. Kickers that only repeated what the page already said ("Featured", "Featured sheet", the index's notes row) were removed. The P1 LedgerGuard pages keep their own P1 type (see 06).

Running text is held to 40 rem. Headings use `text-wrap: balance`.

### Provenance materials

Every image in the set is one of three materials. The material is visible in its frame and named in its strip.

| Material                          | Frame                                                                                   | Strip text                                                               | Used for                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Shipped product                   | **Mounted:** solid 1 px `--frame-shot` (light ink at 30%), a 6 px void mat, strip below | `Screenshot · shipped product`                                           | LedgerGuard dashboard, AlwaysGeeky marketplace and login, TallyFolio, MapBylaw |
| Editorial diagram                 | **Drawing sheet:** vellum, 1 px `--edge-draw`, 12 px registration ticks at each corner  | `Editorial diagram` (plus `illustrative data` or `schematic` where true) | Every drawing in AlwaysGeeky and Emplifi; LedgerGuard bands LG-02 to LG-05     |
| Design prototype · fictional data | Dashed 1.5 px frame                                                                     | `Design prototype · fictional data`                                      | LedgerGuard workspace and dashboard prototypes only                            |

The three frames differ in line weight and construction, not only in colour: a bright solid line with a mat (a mounted print), a faint edge with corner ticks (a drawing sheet), a dashed line (a proposal). The SVG drawings draw the same registration ticks in their own frame, so a drawing reads as a drawing at any size. On the index the bays carry the same distinction: the screenshot half of each bay has the light mount line, Emplifi's drawn half the drafting edge.

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
- **Sheet navigation:** at the end of every case study: previous sheet, "Register · All work", next sheet. Previous and next go case study to case study in a loop, LedgerGuard → AlwaysGeeky → Emplifi → LedgerGuard, so a reader can read the set without returning to the index.
- **Return links land on the project.** Every link back to the index (the bar's "Index", "All work", LedgerGuard's logo, "Work" and "Back to the work") goes to `index.html#project-<slug>`. The index scrolls past the opening to that project's bay in the condensed register, so a reader returns to where they left, not to the top. Browser Back and Forward restore the scroll position the browser kept.
- **One set, including LedgerGuard.** LedgerGuard's P1 pages (`../cinematic-exploration/prototype/`) link back into this register, and their "other sheets" list and "Next sheet" link go to the AlwaysGeeky and Emplifi sheets here. No link in either prototype sends a featured project to the production site.
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

Each bay has a drawing-title block under it: code bubble, the name and "Read the case study →" as one link straight to the case study, the case-study title. A small outlined "Scene" chip on the picture's upper corner is a second, secondary link into the optional scene. The bay's picture repeats the case-study link for pointer users; it is out of the tab order and hidden from assistive technology, so a keyboard reader meets the case study first and Scene second in every bay. Pointing at or focusing a bay quiets the other two; nothing depends on hover.

### The condensation

With motion on, the opening pins while it condenses into the register (see 02): the identity block slides up under the bar, then the bays close toward the cut until the row of three is the register's top row. The condensation is drawn with transforms and clipping inside a stage of fixed height, so nothing after the opening moves while it runs. Without motion, or without script, the page is the same content as one static column.

### Below the section

| Group      | Sheets                                           | Treatment                                                                                                                                                       |
| ---------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Featured   | LG, AG, EM                                       | The bays, then one **brief** each: role and years, the first sentence of the problem, and what the two materials are ("LG-01 above the cut: … LG-02 below: …"). |
| Supporting | Agent Engineering Tools, TallyFolio, ControlTech | Three columns of plain rows: code box, name, case-study title, "Case study on alipajand.com ↗", role, years and evidence type.                                  |
| Experiment | MapBylaw                                         | Its own group, behind a dashed rule: "A self-directed experiment, kept apart from client and product work."                                                     |

Every one of the seven destinations is a single link from the index. Featured case studies are reachable without opening a scene.

### Mobile

At 390 px the bays become three slender cores side by side, each still cut on the line, with the name and "Read the case study →" (32 px tall) under it, and the Scene chip on the core's upper corner. There are no inline screenshots beyond the cores, so the page is about 4,000 px tall (P2 was about 5,600). Supporting work starts around 1,500 px down.

### Disciplines

The capability table is now headed "By discipline": "Explore the work by technical discipline." Seven buttons mark matching projects in the bays and rows and in the table. A polite live region announces the result, for example "Design systems: 2 projects marked, AlwaysGeeky Games, Emplifi." Escape clears it. Without script, the table is a plain table and the buttons are not shown.

## Project moves

### LedgerGuard · the section cut (P1)

Red, `--red #f0573c`. The red line means the human review boundary: suggested values on one side, confirmed values on the other. That meaning is LedgerGuard's alone. P2 changes only the review-state captions (see 04) and adds the flat depth path.

### AlwaysGeeky · the detail callout

Blueprint blue, `--ag #8ea4ff`, about 7.7:1 on paper; `--ag-v #98adff` on void.

AlwaysGeeky Games makes Voxies. The marketplace and login shown are Voxies surfaces; the marketplace closed in July 2026, so the screenshots are labelled historical and neither address is linked.

- The **callout** is a circle and leader on the shipped screenshot. It names a part of the interface without redrawing it.
- The **lens** lifts that part out, enlarged, as a crop of the same screenshot.
- The **blue line** continues from the lens down through the system: drop lines from each surface to the library, then one spine down AG-03. Storybook contract clauses branch off the spine; the CI gates hang from its foot. Blue always means "this part is shared".

AG-03 is a single drawing so the scene needs one camera move, not two stops. It is not a Storybook screen and names no tool, check count or pass rate.

### Emplifi · the render path and the frame budget

Ochre, `--em #e3a33f`, for lines and fills. Its text ink is `--em-ink #ebb560`, about 9.8:1 on paper. On void it is `--em-v #e3a33f`.

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
color-scheme: dark                 dark only; no light theme
--paper #171612   --paper-2 #201e19   --vellum #1f1d18
--ink #ece6d8     --ink-2 #bdb4a2     --ink-3 #9c937f   (14.5, 8.8 and 5.9:1 on paper)
--rule rgba(236,230,216,.07)   --rule-strong rgba(236,230,216,.2)
--edge-draw #4d4739   --edge-shot #3a362e
--void #090807    --void-2 #13120f   --on-void #ede7da   --on-void-2 #b2a998
--shade rgba(0,0,0,.5)   --tint rgba(236,230,216,.06)   shadows and surface tints
--red #f0573c                      identity mark, focus ring, LedgerGuard boundary (5.3:1)
--red-ink #f0846e                  red as small text on paper (7.1:1)
--ag #8ea4ff  --ag-wash            AlwaysGeeky (7.7:1)
--em #e3a33f  --em-ink #ebb560  --em-wash   Emplifi (ink 9.8:1)
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
