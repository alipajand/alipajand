# LayersDiagram

A `layers` diagram block: a stack of labelled layers, each inset a little more than the one above, with the last one dashed. As the stack crosses the screen, one layer at a time is lit.

- Spec: `{type: "layers", title, caption?, layers: [{label, detail?}]}`, the same as `utils/diagramBlocks.ts`.
- Lighting comes from `lightDiagrams(vh)` in the kit's diagrams.js, through `[data-light]` on the list.
