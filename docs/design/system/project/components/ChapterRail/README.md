# ChapterRail

A sticky, horizontally scrolling bar of numbered sections. The section under the reader's eye is inverted, and a 2px line tracks progress through the page.

- Build it from the sections the page actually has. Numbers are their order, so empty sections are dropped and the rest renumber.
- The active chip scrolls itself to the middle of the rail.
- A full-bleed band counts as the section it belongs to.
- Sections and bands take `scroll-margin-top: 50px` so anchor jumps land below the rail.
