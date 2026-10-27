# Writing: reference vs implementation

Captures of every writing route next to its design artifact, at 1440x900 and 390x844 with reduced
motion (the artifacts' static branch). The artifact pages were opened from `file://` with their
default 8px body margin removed, so both captures share the same origin.

- `/writing` is compared with `docs/design/pages/writing.html`.
- `/writing/agent-readiness-doctor` is compared with `docs/design/pages/agent-readiness-doctor.html`.
- Every other article is compared with `docs/design/pages/writing-reader.html#<slug>`.

## Files

- `screenshots/<route>-<width>-fold-ref-actual-diff.png`: the first screen as reference | actual |
  difference (red marks pixels that differ by more than about 10%). 1440 images are at 50%.
- `screenshots/<route>-<width>-reference.jpg` and `-actual.jpg`: full pages for the index, Agent
  Readiness Doctor and three representative articles (`agent-instructions-are-code`,
  `why-i-automate-code-review-with-mcp`, `how-i-would-build-a-real-time-backgammon-platform`).
  1440 pages are at 50%.
- `metrics.json`: page heights and first-screen difference for every route and width.

## Reading the numbers

- Most of the first-screen difference on every page is the site navigation, which is the shared
  shell from the foundations (five links and the phone menu), not the artifact's four-link bar.
- Pages are shorter than the reference only where the article has a `compare` diagram. In the
  artifact the prose list styles leak into the comparison lists and set one word per line; the
  implementation renders the comparison as designed. Articles without a comparison
  (`agent-readiness-doctor`, `designing-a-small-library-for-logs-too-big-to-hold`,
  `how-i-would-design-a-document-review-workspace`,
  `preparing-integrations-for-anthropic-and-cursor-directories`) are within 85px of the reference.
- `mapbylaw-ai-recommendations` differs most on the first screen: its title has a word too long for
  the column. The artifact shrinks titles with a script; at 390 its capture still runs past the
  frame. The implementation sizes the title on the server so the longest word fits, so the title
  sets one step smaller and the lines below move up.
- The index timeline cursor rests on the newest post. The artifact's reduced-motion frame leaves it
  near the start of the axis because its easing runs once from zero, while its readout names the
  newest post.
