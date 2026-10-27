# FlowBand

A `flow` diagram block on the bone band: numbered steps that light in order as the band crosses the screen. Steps already passed keep a ✓.

- Spec: `{type: "flow", title, caption?, loop?, steps: [{label, detail?}]}`.
- On a case study it breaks out of the shell to both screen edges, right after the section it belongs to, followed by the chevron row. Inside an article it stays in the column.
- Steps sit in columns when the figure is at least 1000px wide (container query), otherwise in rows.
- With reduced motion, every step shows as done.
