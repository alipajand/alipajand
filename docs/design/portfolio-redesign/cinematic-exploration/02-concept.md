# Concept: Section A–A

## Statement

**THE WORK BEHIND THE INTERFACE**, drawn the way engineers draw what is behind a surface: as a **section**.

A section drawing cuts an object along a marked line (A–A) and shows what the cut reveals. The portfolio opens as a drawing sheet. Ali's name is set at architectural scale, and a red section line runs through it. Scrolling makes the cut. The sheet parts along the line, and behind it sits the real, shipped LedgerGuard interface. The camera then tilts to an exploded axonometric view. The interface becomes the top sheet of a stack, and each sheet below it is one layer of the system Ali built:

| Sheet | Layer                                       | Material                                    |
| ----- | ------------------------------------------- | ------------------------------------------- |
| LG-01 | Next.js App Router product                  | **Real screenshot** (dark, glossy)          |
| LG-02 | Node.js/Fastify API                         | Editorial diagram (vellum, ink)             |
| LG-03 | Supabase PostgreSQL, Auth, Storage          | Editorial diagram: tenant A, tenant B       |
| LG-04 | Redis/BullMQ orchestration                  | Editorial diagram: queue, retry, failure    |
| LG-05 | Python extraction worker (Textract, OpenAI) | Editorial diagram                           |
| A–A   | The review boundary                         | A red plane cutting through all five sheets |

The red of the section line returns as the **review boundary**: the rule that AI-suggested values cross into confirmed data only through explicit human review. The visual motif and the strongest engineering decision in LedgerGuard are the same line.

The stack then collapses back into the interface, the cut closes, and the page is paper again, with a readable project story beneath it.

### Why this is not a portfolio with animated cards

- There is one object (the drawing set) and one camera. Nothing animates on its own.
- The 3D is earned: an exploded axonometric view is how engineers really show layered systems, and every sheet has content.
- Provenance is visible. Glass is real and paper is drawn; each sheet says which in its title strip ("Screenshot · shipped product" or "Editorial diagram").
- The reading layer is complete without any of it.

### Deliberate deviation to flag

The accepted creative brief lists "a light theme (unless Ali asks)" as a non-goal, and production is dark-only. Section A–A is built on **paper**: the outside of the cut is light and the inside is dark. This is one committed look, not a theme toggle. It is the central creative bet, and **it needs Ali's explicit decision**. A dark-paper variant (blueprint ground, cream ink) is possible, but it would lose the paper/glass material split that encodes provenance.

## Scene 01: opening composition

The first screen at 1440×900 ([desktop-01-cover.webp](screenshots/desktop-01-cover.webp)):

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
- **Mobile** ([mobile-01-cover.webp](screenshots/mobile-01-cover.webp)): the name stacks as ALI / PAJAND. The cut moves to cross PAJAND (`--cut-at: 1.18em`), the markers shrink, and the title block becomes a two-column grid under the thesis.
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
| `paper`  | `#ebe6da` | Sheet ground, outside the cut                                         |
| `ink`    | `#16140f` | Text and linework on paper                                            |
| `red`    | `#c8321b` | The section line and the review boundary, and nothing else decorative |
| `void`   | `#100f0d` | The interior behind the cut                                           |
| `vellum` | `#f2ede2` | Diagram sheets LG-02 to LG-05                                         |

These tokens are local to the prototype. Global design tokens were not touched.

## New copy needing approval

Everything on the pages comes from `data/projects.ts` and the public site, except two lines marked `NEW` in `prototype/build.mjs`:

- Thesis: "The interface, and the work behind it."
- Sequence note: "Five layers under one shipped product. Scroll down through them, or jump to a layer."
