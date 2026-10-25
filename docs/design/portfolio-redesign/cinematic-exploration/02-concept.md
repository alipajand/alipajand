# Concept: Section A–A

## Statement

**THE WORK BEHIND THE INTERFACE**, drawn the way engineers draw what is behind a surface: as a **section**.

A section drawing cuts an object along a marked line (A–A) and shows what the cut reveals. The portfolio opens as a drawing sheet. Ali's name is set at architectural scale, and a red section line runs through it. Scrolling makes the cut. The sheet parts along the line, and behind it sits the real, shipped LedgerGuard interface. The camera then tilts to an exploded axonometric view. The interface becomes the top sheet of a stack, and each sheet below it is one layer of the system Ali built:

| Sheet | Layer                                       | Material                                                                                 |
| ----- | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| LG-01 | Next.js App Router product                  | **Real screenshot** (dark, glossy)                                                       |
| LG-02 | Node.js/Fastify API                         | Editorial diagram (vellum, ink)                                                          |
| LG-03 | Supabase PostgreSQL, Auth, Storage          | Editorial diagram: tenant A, tenant B                                                    |
| LG-04 | Redis/BullMQ orchestration                  | Editorial diagram: queue, retry, failure                                                 |
| LG-05 | Python extraction worker (Textract, OpenAI) | Editorial diagram                                                                        |
| A–A   | The review boundary                         | A red plane cutting through all five sheets                                              |
| A–A   | The boundary in the product                 | **Design prototype**, fictional data (dashed frame): the Document Intelligence Workspace |

The red of the section line returns as the **review boundary**: the rule that AI-suggested values cross into confirmed data only through explicit human review. The visual motif and the strongest engineering decision in LedgerGuard are the same line.

Once the plane has risen through the stack, it uncovers where that line sits in the product: the **Document Intelligence Workspace**, shown from LedgerGuard's interactive design prototype with fictional data. As the reader scrolls, the workspace moves from _Ready for review_ (0 of 13 terms confirmed) to _Partially reviewed_ (6 of 13) to _Confirmed_ (13 of 13). The reader can also pick a state by hand, or open the prototype itself.

The stack then collapses back into the interface, the cut closes, and the page is paper again, with a readable project story beneath it.

### Why this is not a portfolio with animated cards

- There is one object (the drawing set) and one camera. Nothing animates on its own.
- The 3D is earned: an exploded axonometric view is how engineers really show layered systems, and every sheet has content.
- Provenance is visible, in three materials. Glass is the shipped product, paper is drawn, and a dashed frame is a design prototype. Each says which in its label: "Screenshot · shipped product", "Editorial diagram", or "Design prototype · fictional data". The dashed line is the drafting convention for what is proposed rather than built.
- The reading layer is complete without any of it.

### Deliberate deviation to flag

The accepted creative brief lists "a light theme (unless Ali asks)" as a non-goal, and production is dark-only. Section A–A is built on **paper**: the outside of the cut is light and the inside is dark. This is one committed look, not a theme toggle. It is the central creative bet, and **it needs Ali's explicit decision**. A dark-paper variant (blueprint ground, cream ink) is possible, but it would lose the paper/glass material split that encodes provenance.

**Decision, after P2.1:** the prototype is now **dark only**, to match production. The paper is a warm near-black, ink is light, and the interior behind the cut is a deeper void. Provenance no longer rests on light paper against dark glass: the labels, plate edges and dashed prototype frames carry it. The workspace design prototype (`workspace.html`) keeps its own product styling.

## Scene 01: opening composition

> **Revised in revision 2.** The cover below is the first proof's closed cover. Revision 2 opens with the cut already open on the shipped interface, and its sequence is four beats; see [03-storyboard.md § The first frame](03-storyboard.md#the-first-frame) and [04-motion-spec.md](04-motion-spec.md).

The first screen at 1440×900 in revision 1 ([before/desktop-first-frame.webp](screenshots/before/desktop-first-frame.webp)):

```
┌────────────────────────────────────────────────────────────────────┐
│ A–A ALI PAJAND                    WORK  SKIP INTRO  CONTACT  [●]   │  bar
│                                                                    │
│ SECTION A–A · SHEET 01                                             │  eyebrow (mono, red)
│ Senior Software Engineer                                           │  role (sans, 1.5rem)
│ Frontend architecture, design systems, and full-stack product work │  focus
│                                                                    │
│ Ⓐ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─Ⓐ │  section line through
│      A L I P A J A N D   (Big Shoulders 900, ~19.5vw)              │  the name's x-height
│                                                                    │
│ The interface, and the            ┌ STACK ──────┬ EXPERIENCE ─┐    │
│ work behind it.                   │ React·TS·…  │ 9+ years    │    │  title block
│                                   │ BASED       │ AVAILABILITY│    │
│                                   │ Montreal    │ Remote, CA  │    │
│                                   │ CONTACT: Book a call        │    │
└────────────────────────────────────────────────────────────────────┘
```

- **One dominant idea.** The name is cut by a line. Everything else is small and set at the margins, the way a drawing sheet works.
- **Senior positioning in the first screen.** The role, focus, stack, experience, location and availability are all visible without scrolling. They sit in the drawing's **title block**, the corner box every engineering drawing has.
- **Not a résumé hero.** There are no two columns, no headshot and no cards. The title block is a convention of the medium, not a layout grid.
- **Mobile** ([before/mobile-first-frame.webp](screenshots/before/mobile-first-frame.webp)): the name stacks as ALI / PAJAND. The cut moves to cross PAJAND (`--cut-at: 1.18em`), the markers shrink, and the title block becomes a two-column grid under the thesis.
- **Arrival** (fresh visits with motion on only): the section line draws from left to right in 520 ms, then the two "A" markers pop in, finishing by 580 ms. Nothing else moves; all text is present on first paint.

### Typography

| Role               | Face                      | Why                                                                                          |
| ------------------ | ------------------------- | -------------------------------------------------------------------------------------------- |
| Display (name, h2) | Big Shoulders Display 900 | Condensed, engineered capitals, like stencilled drawing titles. Gives scale at narrow width. |
| Text               | Instrument Sans 400–600   | Neutral and readable at body sizes; pairs with a condensed display face.                     |
| Labels, codes      | Martian Mono 400/500      | Sheet numbers, title-block labels and layer codes, the drafting vernacular.                  |

All three are OFL on Google Fonts. Production adoption depends on loading cost; see [05-feasibility-and-performance.md](05-feasibility-and-performance.md).

### Palette

| Token    | Value     | Use                                                                   |
| -------- | --------- | --------------------------------------------------------------------- |
| `paper`  | `#171612` | Sheet ground, outside the cut (dark only)                             |
| `ink`    | `#ece6d8` | Text and linework on paper                                            |
| `red`    | `#f0573c` | The section line and the review boundary, and nothing else decorative |
| `void`   | `#090807` | The interior behind the cut                                           |
| `vellum` | `#1f1d18` | Diagram sheets LG-02 to LG-05                                         |

These tokens are local to the prototype. Global design tokens were not touched.

## New copy needing approval

Everything on the pages comes from `data/projects.ts`, the public site and the LedgerGuard design prototypes, except the lines marked `NEW` in `prototype/build.mjs`:

- Thesis: "The interface, and the work behind it."
- Sequence note: "Five layers under one shipped product. Scroll down through them, or jump to a layer."
- Boundary lead: "In the product, the line runs through the Document Intelligence Workspace. Terms on the left, the contract on the right: a person confirms, corrects, or flags each extracted term, and only then does it count."
- The shipped-versus-proposed note under it, condensed from the workspace prototype's design notes.
- Story figure and case-study hero caption: "The dashboard's typical state: deadlines grouped by notice window, with verified and provisional totals kept apart."
- Case-study intro to the design prototypes: "Two of LedgerGuard's interactive design prototypes. They show designed states with fictional data, not screenshots of the shipped product. The workspace prototype's design notes separate shipped behaviour from proposals."
