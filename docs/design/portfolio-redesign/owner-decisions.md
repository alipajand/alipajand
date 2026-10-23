# Owner decisions

Recorded 2026-10-23 from Ali's review of the P0 audit.

## Gate status

- **P0 audit:** accepted as the design baseline, subject to correcting evidence and documentation inconsistencies. The corrections below were applied to the audit documents in the same change as this file.
- **P1:** interactive design exploration is authorised. Design artefacts and design documentation only.
- **Not authorised:** production changes, dependency changes to the production app, merging, or deploying. Choosing a P1 concept authorises refinement, not production implementation.

The proposed changes to `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, and `docs/*.md` in `documentation-conflicts.md` are still **not applied**. The decisions below settle their direction; applying them to the guidance files is a separate, approved change.

## Decisions on the open questions

| #   | Topic                                      | Decision                                                                                                                                                                                        |
| --- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Design rule and budgets (DC-4, DC-5, DC-6) | **Approved with revisions.** Adopt the two-layer rule: complete, accessible content first; expressive visual design on top. Motion and performance budgets are mandatory, as revised below.     |
| 2   | Tiers (F-06, DC-7)                         | **Approved.** Featured: LedgerGuard, AlwaysGeeky Games, Emplifi. Supporting: Agent Engineering Tools, TallyFolio, ControlTech. Experiment: MapBylaw.                                            |
| 3   | Staff-level framing (F-08, DC-11)          | **Remove.** Present the actual Senior roles and show influence through engineering evidence. Do not argue about title equivalence.                                                              |
| 4   | Dead links (F-01)                          | Voxies Marketplace is presented as historical work, explicitly marked closed; its live-product CTA is removed. The ControlTech website link is omitted until a working destination is verified. |
| 5   | Evidence (F-09)                            | A real LedgerGuard review screenshot is desirable but does not block design. The Emplifi 80% and LedgerGuard 90% figures must not be featured prominently until their sources are established.  |
| 6   | Navigation (F-04)                          | Browser Back restores the previous scroll position. Explicit return links go to the relevant project anchor (e.g. `/portfolio#project-ledgerguard`). Keyboard focus management is preserved.    |
| 7   | Typography                                 | Additional display and monospace typefaces are permitted in design artefacts. Final selection depends on licensing, loading cost, and performance.                                              |
| 8   | Awwwards                                   | A firm goal: build for an actual submission across the complete site experience, prioritising `/portfolio`. Recruiter usability is non-negotiable.                                              |

## Revisions to the proposed specifications

### Accessibility

A Lighthouse accessibility score of 100 is not proof of WCAG conformance. Verification requires all of:

- automated axe checks with no violations;
- a full keyboard walk-through;
- a screen-reader pass (VoiceOver on macOS and iOS at minimum);
- manual review of contrast, focus visibility, reading order, target size, and reduced motion.

### Performance

- Kept: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, Lighthouse mobile Performance ≥ 90.
- Dropped: the fixed 1 MB limit on every committed source image. What is budgeted is what visitors receive; source files may be larger where the delivery pipeline (Next.js image optimisation, correct `sizes`, lazy loading) is appropriately configured.

### Motion

- 600 ms is the **default** entrance budget, not a universal limit. Complex explanatory interactions (e.g. a diagram stepping through a workflow) may take longer when the duration serves comprehension.
- No animation may gate content, interfere with native navigation (scrolling, keyboard scrolling, anchors, Back/Forward), or remove information.

### Content

- Emplifi stays **featured** even without screenshots. Design should use real architecture diagrams and evidence-based visualisations, not an invented product interface.
- No invented product images, customer results, or performance metrics anywhere.
