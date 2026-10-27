# Ticker

A marquee of short items separated by sparks. It drifts slowly, speeds up with scroll velocity and reverses when the reader scrolls up.

- The track holds two copies of the run, so it loops without a seam. The second copy is `aria-hidden`.
- Always repeat the same content somewhere readable on the page, such as a chip list or the headings, because the ticker itself is `aria-hidden`.
- On the bone band it uses display type at poster size, as on Now's Current Stack.
- With reduced motion it becomes a static wrapped list.
