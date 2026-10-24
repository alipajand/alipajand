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
- **Void interior.** `--void #100f0d`. Only shipped screenshots sit on void, so dark always means "this is the real product".
- **Vellum.** `--vellum #f2ede2` under every editorial drawing and every reading card.

The paper and void pairing is approved for this concept only. It is not approved as a site-wide light theme.

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

The index carries a drafting title block: stack, experience, base, availability and contact. On wide screens it sits in the sheet's lower right, where a title block sits on a drawing. Every value in it comes from the public facts already on the site.

### The A–A mark

The red section line through the name, and `A–A` in the bar, are the set's identity. They are the only red on AlwaysGeeky and Emplifi, apart from the focus ring.

### Focus and controls

- Focus ring: 3 px `--red`, offset 3 px, on every interactive element. The register rows draw it inset on the whole row.
- Controls are square-cornered, outlined, at least 32 px tall in the bar and 36 px elsewhere.
- Controls that need script ship disabled and hidden, so a page without script never offers a control that does nothing.

### Navigation

- **Bar:** the A–A mark and name (link to the register), two or three section links, and the Motion toggle.
- **Register (Sheet 00):** the project index. See below.
- **Sheet navigation:** at the end of every case study: previous sheet, index, next sheet.
- **Skip link:** first in tab order on every page, to the register or the case study.

## The portfolio index: a drawing register

The index is a drafting **drawing register**, not a gallery and not a grid of cards. A register is the list a drawing set opens with: every sheet, numbered, with its title and status.

### First screen

The first screen establishes who and what before any project:

- Name, cut by the A–A line.
- `Senior Software Engineer`.
- Focus line and the approved thesis, "The interface, and the work behind it."
- The title block.

On a 1440 × 900 screen the first featured row is visible without scrolling.

### Rows

| Group      | Sheets         | Row content                                                                                         |
| ---------- | -------------- | --------------------------------------------------------------------------------------------------- |
| Featured   | LG, AG, EM     | Large code, name, case-study title, first sentence, role and years, evidence type, "Open the scene" |
| Supporting | AT, TF, CT, MB | Smaller code, same lines, "Case study on alipajand.com"                                             |

- The whole row is one link to the case study, so the case study is always reachable directly and the scene is never required. Featured rows add a second link, "Open the scene".
- The row link is a real box that repeats the row's columns, not `display: contents`. A `display: contents` link was skipped in the tab order in Chromium, which the review caught.
- **Evidence type** is part of every row. Examples: "Shipped screenshots · editorial diagrams", "Editorial diagrams only · illustrative data · no screenshots", "Text and diagrams · no screenshot". A reader knows what kind of proof is behind a row before opening it.
- MapBylaw is filed under Supporting with the tier label "Experiment" in its role line, as its data describes it.

### Key plan

On wide screens a sticky aperture beside the list shows the sheet under the pointer or keyboard focus, with its strip. The change is a top-to-bottom wipe of 280 ms, with none under reduced motion. Its contents:

- **LG, AG, TF, MB:** shipped screenshots.
- **EM:** the EM-01 webview drawing.
- **AT, CT:** openings.

The aperture is decorative (`aria-hidden`); every fact it shows is also in the row.

On narrow screens there is no aperture. Featured rows show their own thumbnail inline.

### Capability schedule

A table of seven capabilities against seven sheets. Every mark cites its evidence, which is either the project's own tag or, marked "(case study)", a phrase from its case study. Seven toggle buttons above the register mark matching sheets in both the register and the table. A polite live region announces the result, for example "Design systems: 2 sheets marked, AlwaysGeeky Games, Emplifi." Escape clears it.

Without script, the table is a plain table and the buttons are not shown.

## Project moves

### LedgerGuard · the section cut (P1)

Red, `--red #c8321b`. The red line means the human review boundary: suggested values on one side, confirmed values on the other. That meaning is LedgerGuard's alone. P2 changes only the review-state captions (see 04) and adds the flat depth path.

### AlwaysGeeky · the detail callout

Blueprint blue, `--ag #2148b8`, about 6.4:1 on paper.

- The **callout** is a circle and leader on the shipped screenshot. It names a part of the interface without redrawing it.
- The **lens** lifts that part out, enlarged, as a crop of the same screenshot.
- The **blue line** continues from the lens down through the system: drop lines from each surface to the library, then a bus down to the contract and the gates. Blue always means "this part is shared".

### Emplifi · the dimension line and the time axis

Ochre, `--em #a8670a`, used for lines and fills only. Its text ink is `--em-ink #7d4c05`, about 5.5:1, because the line ochre is too light for small text.

- The **cursor** reads across a chart the way a measuring instrument would.
- The **time axis** is a frame timeline whose ticks are the 60 Hz frame budget. That budget is a property of the display, not a measurement.
- **Spill marks** show the frames an update runs into.
- The **dimension line** marks where React's ownership ends and D3's begins.

No drawing on the Emplifi sheet carries a measured value. Each timeline says "Schematic. Block lengths are illustrative; no profile or measured value is shown."

## Tokens

All tokens are in `prototype/grammar.css`. Project inks are declared there so the whole set is visible in one place, and used only in `projects.css`.

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
--ease-out cubic-bezier(.16,1,.3,1)   --t-quick 180ms   --t-wipe 280ms
```

## How a new project joins the set

1. Give it a sheet code and a register row, with its evidence type stated honestly.
2. Use only the three materials. If there is no screenshot, use the opening.
3. Choose one drafting move that carries its specific story, and one ink that is not red and not already taken. Possible future moves include a plan view, an elevation, a schedule or a revision cloud.
4. If it gets a scene, reuse the scene shell and motion contract unchanged (see 02). Write only its beats.

## New copy for owner approval

All other text is read from `data/projects.ts` or was approved in the P1 review. The following lines are new and need approval:

- Register intro: "Seven projects, drawn as one set. The three featured sheets each open into a short scene and a full case study; every row goes straight to the case study."
- Schedule intro: "Which sheets show evidence of what. Every mark cites the project's own tag or case-study text. Pick a capability to mark its sheets in the register."
- AlwaysGeeky step headings: "From the interface to its parts", "Storybook as the contract, CI as the gate". The scene note: "Four beats. Scroll, or go straight to the case study."
- Emplifi step headings: "A dense chart, where it actually ran", "Measure the update, not the data", "The same update, cheaper to draw". The disclosure: "No screenshots: the dashboards are proprietary. Every drawing here is an editorial diagram with illustrative data."
- Evidence-type lines in the register, the materials notes on each scene's first card, and the drawing titles and notes inside the AG and EM drawings.
