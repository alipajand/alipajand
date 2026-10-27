# CompareDiagram

A `compare` diagram block: columns of short items. Earlier columns are dim and marked ×. The last column has a lit heading and is marked ✓, because it is the approach the page argues for.

- Spec: `{type: "compare", title, caption?, columns: [{label, items: []}]}`, with two or more columns.
- Columns stack on phones, keeping their order.
