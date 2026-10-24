# P1 concept prototypes

Three standalone prototypes of `/portfolio` and its case studies, built for the P1 design exploration authorised in `../owner-decisions.md`. They are design artefacts only: nothing here is imported by the Next.js app, and no production component, style, route, content file or asset was changed.

| Concept                   | Folder                         | Published artifact (private until shared)           |
| ------------------------- | ------------------------------ | --------------------------------------------------- |
| A · Engineering Editorial | `concept-a-editorial/`         | <https://claude.ai/artifact/6gk5XktRx4nZMRWBmqRDag> |
| B · Interface Atlas       | `concept-b-interface-atlas/`   | <https://claude.ai/artifact/7fJ6yYv7t6YMJMSMjtDNbk> |
| C · Systems in Motion     | `concept-c-systems-in-motion/` | <https://claude.ai/artifact/21kVstkEg2EzVa5FWBoKBU> |

Each concept folder has an `index.html` (the `/portfolio` index), one page per case study (all seven, with LedgerGuard as the reviewed one), its own `styles.css` and `concept.js`, a `README.md` with typography, colour tokens, interaction inventory, motion rationale, accessibility notes and risks, and a `screenshots/` folder. The comparison and recommendation are in `../artifact-comparison.md`.

## Where the content comes from

- `shared/content.mjs` imports `PROJECTS` and `PORTFOLIO_CASE_STUDY_ORDER` from `data/projects.ts` at build time. Names, roles, timeframes, overviews, sections, decisions, diagrams, captions and links are all read from there.
- The only new copy is one **index line per project**, each condensed from that project's `cardProblem`, `overview` or `myRole`. These lines need Ali's approval before any production use.
- Owner decisions applied in `shared/content.mjs`: tiers; Voxies Marketplace shown as closed with no link; ControlTech website omitted; no staff-level framing (the intro uses sentences from intro paragraphs 1 and 4 only); sentences with the Emplifi 80 % and LedgerGuard 90 % figures kept in the case-study body only, muted, and flagged "Source pending" for review. Neither figure appears on any index.
- Screenshots are the real files from `public/portfolio-media/`, resized to 640 and 1280 px WebP in `shared/media/` (480 KB in total). The real pixel sizes are used, which also corrects the TallyFolio dimension mismatch (F-11). No interface was invented; Emplifi, ControlTech and Agent tooling are presented through their existing diagrams and text.
- External links point at the live site (`alipajand.com/...`), Calendly, GitHub and LinkedIn, as published today.

## Shared behaviour

`shared/behaviour.js` is progressive enhancement used by all three concepts. Every page is complete and readable without it.

- Motion preference: `data-motion="full" | "reduce"` on `<html>`, set before first paint from the system setting (followed live) or an explicit on-page choice. All animation is gated on it.
- Entrances are skipped on Back/Forward and on arrivals at an anchor; animated elements never act as scroll anchors.
- Flow diagrams gain a walkthrough: Play / Pause, Previous step, Next step, Escape to pause, and a polite live status line.
- Case-study outlines mark the section being read with `aria-current`.
- Nothing touches `history.scrollRestoration`, scroll position, or anchors, so Back restores position natively and return links (`index.html#project-<slug>`) land on the project.

Each page is a real document, so index → case study → Back is a real browser navigation. In Next.js the same pages would be client-side navigations; see the implementation notes in the comparison.

## Rebuilding and reviewing

```bash
node docs/design/portfolio-redesign/artifacts/build.mjs
```

Writes all 24 pages from `data/projects.ts`. Add `--publish <dir>` to also write self-contained copies (shared files and media inside each concept) for publishing. Run `pnpm exec prettier --write docs/design/portfolio-redesign` afterwards, because the generated HTML is not pre-formatted.

```bash
CHROME_PATH="<path to a Chromium binary>" NODE_PATH="<dir>/node_modules" node docs/design/portfolio-redesign/artifacts/review.mjs concept-a-editorial
```

`review.mjs` needs `playwright-core` and `axe-core` resolvable through `NODE_PATH`; they are deliberately not project dependencies (this review used playwright-core 1.56.1 and axe-core 4.10.3 installed in a scratch directory, with the Chromium build in `~/Library/Caches/ms-playwright`). For 1440, 768 and 390 px it captures first-viewport and full-page screenshots, checks which featured projects are in the first viewport, looks for horizontal overflow and text hidden at rest, runs axe, walks the keyboard, exercises Back, the return link and the flow walkthrough, and repeats the index under reduced motion. Results go to each concept's `screenshots/review-results.json`.

## What this review did not cover

- Screen readers (VoiceOver on macOS and iOS is required by the owner decisions before launch).
- Safari, Firefox, and real touch devices. All automated checks ran in Chromium.
- Zoom to 200 %, text-spacing overrides, and forced-colours mode.
- The cross-document view transitions were implemented but not visually verified.
- Lighthouse. Local page weight and CLS were measured (see the comparison), but a static prototype served from localhost says little about production LCP.
- Each desktop run logged one "Failed to load resource: 404" console message on the first page load. A response listener on the same page found no failing page resource, so it is most likely the browser's automatic favicon request; that was not confirmed.
