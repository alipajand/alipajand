# Nav

The boxed site header: name, four primary links, the open-to-roles status and a Book a call link, with a 2px scroll progress line along its bottom edge.

- The current section's link gets `aria-current="page"` and a 2px underline.
- The progress line reads `--p` (0 to 1). The page's frame loop sets it from scroll position.
- Below 760px the links drop to a second row, spaced evenly.
- The consumer supplies the four destinations. Contact points at the home page's `#contact`.
