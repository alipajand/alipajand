# Creative brief: portfolio redesign

Date: 2026-10-23. Status: **draft for Ali's review.** Not approved for implementation.

Scope: `/portfolio` and `/portfolio/[slug]`. Shared chrome (nav, footer) only where the portfolio needs it. The homepage is out of scope but should inherit the visual system later.

Inputs: `baseline-audit.md`, `architecture-and-motion-audit.md`, `content-and-evidence-inventory.md`, `documentation-conflicts.md`, `findings-and-issue-register.md`.

---

## 1. The problem in one paragraph

The current portfolio is accurate, accessible, fast on desktop, and well structured, but it reads as a long document. The first viewport shows four paragraphs of prose and no project at any width (F-05); seven case studies sit at identical weight (F-06); and the motion that exists hides content until it is scrolled into view rather than adding meaning (F-03). For a recruiter, the work arrives late. For an Awwwards jury, there is no distinct visual idea. The redesign has to fix both without trading away the text-first clarity and accessibility that already work.

## 2. Goals

1. **Recruitment:** a hiring manager understands within one screen who Ali is, what level, what stack, and which three projects to read, and can reach a case study in one click.
2. **Craft:** the page is good enough to submit to Awwwards (Design, Usability, Creativity, Content), with a visual identity and interaction quality that are clearly Ali's own and that demonstrate frontend skill directly.
3. **Honesty:** every claim on the page is traceable to `data/projects.ts` or an artefact Ali supplies. The design never implies evidence that does not exist.

Non-goals: new career facts, new metrics, illustrative UI presented as real, a CMS, a light theme (unless Ali asks), changes to URLs.

## 3. Target employers

Derived from `CLAUDE.md` positioning and the published footer ("Based in Montreal, Canada · Open to remote work within Canada"). Ali should confirm order.

| Segment                                                                                  | What they hire for                                                                        | Strongest evidence on the site         |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------- |
| Product companies building workflow-heavy SaaS (B2B, fintech, legal/contract, analytics) | Senior frontend or full-stack product engineer who owns ambiguous features end to end     | LedgerGuard, Emplifi, TallyFolio       |
| Teams with a design system or platform frontend group                                    | Senior engineer for component libraries, accessibility, conventions, CI quality gates     | AlwaysGeeky, Emplifi components        |
| AI product teams                                                                         | Engineer who designs human-in-the-loop UX and keeps model output behind a review boundary | LedgerGuard, MapBylaw, TallyFolio      |
| Developer-tools and AI-coding-tool companies                                             | Engineer with DX product sense and supply-chain-safe tooling                              | Agent tooling (public repos, releases) |

Readers, in order of how often they arrive: recruiters (skim, 30–60 s), hiring managers (read one case study), engineers on the interview loop (read decisions and trade-offs, click GitHub), design-minded reviewers and juries (judge craft first).

## 4. User journeys

### Primary: recruiter or hiring manager, 2–5 minutes

1. Lands on `/portfolio` from LinkedIn, an application, or the homepage.
2. **First viewport:** name/role line, one-sentence thesis, and the three featured projects with outcome lines. Contact/booking reachable without scrolling.
3. Opens the strongest matching case study.
4. Reads the header (problem, role, timeframe, stack) and skims the decisions.
5. Returns to the index **at the same position** (F-04), opens a second case study or books a call.

Success: featured projects visible in the first viewport at 1440 and the first featured project at 390; ≤ 1 click to any case study; Back restores position; booking link within one scroll from anywhere.

### Secondary A: engineer on the interview loop, 10–20 minutes

1. Arrives directly on a case study link.
2. Uses the outline to jump to Technical decisions.
3. Interacts with diagrams, reads trade-offs, follows GitHub or related writing.

Success: outline reachable early by keyboard (F-14); diagrams usable by keyboard and touch; every claim has its provenance nearby.

### Secondary B: design-minded reviewer or Awwwards juror, 1–3 minutes

1. Lands on `/portfolio` on desktop, often with screen recording.
2. Judges the first impression, typography, transitions, and how the index responds to hover/focus.
3. Opens one case study and judges the page transition and reading experience.

Success: a memorable but quick first moment, polished index interactions, smooth transitions, nothing blank in screenshots (F-03).

### Secondary C: mobile skim from a phone (LinkedIn in-app browser)

Success: first featured project visible on load; no horizontal scroll; images legible or replaced by crops (F-17); lightweight first load.

## 5. Differentiation

What makes this portfolio different from typical senior-frontend portfolios, using only existing material:

1. **Decisions, not screenshots.** Every case study already names a decision, why, trade-off, and result. Make the decision the visual unit, not the screenshot.
2. **Systems drawn as systems.** Each case study has 2–3 interactive diagrams (layers, flow, compare). They are the most distinctive asset Ali has and can carry the visual identity.
3. **Honest AI boundaries.** LedgerGuard, MapBylaw, and TallyFolio share one idea: model output stays behind a review or a typed contract. The design can make "suggested vs confirmed" a visible motif, as long as it is a design motif, not fake product UI.
4. **The site is the proof.** For a frontend architect, the portfolio's own performance, accessibility, and motion engineering are evidence. A small, honest "How this page is built" note (budgets met, accessibility checks passed) is an option once the numbers are real.

## 6. Awwwards design ambitions

Ambitions, not specifications. Each must pass §7.

- **Typographic identity.** Move beyond a single Geist weight scale: a confident display treatment for project names and a monospace or technical secondary face for metadata, decisions, and diagram labels. Type does most of the visual work, so the page stays text-first.
- **Index as an instrument.** A tiered index where featured projects get large typographic entries with a short outcome line and optional cover media, and supporting/experiment projects are compact rows. Hover/focus reveals a preview (cover crop or diagram) without moving layout.
- **Diagrams as the visual language.** Restyle the existing Flow/Layers/Compare diagrams as the signature element: consistent line weights, a restrained accent colour, and motion that explains state changes (e.g. a step lighting up as the flow advances).
- **Page transitions.** Index → case study transition that carries the project name into the case-study H1 (shared-element style), with an instant fallback under reduced motion or unsupported browsers.
- **One choreographed moment per page.** A short title entrance on load, then quiet reading. No scroll-jacking, no motion gating content.
- **Colour.** Keep the dark base, define one accent with a clear meaning (e.g. "confirmed / decision") instead of the current misnamed red, and give cards a real surface colour (F-24).
- **Detail polish.** Cursor-independent hover states, focus states designed as carefully as hover, tabular numerals for dates and metrics, consistent caption styling.

## 7. Constraints

### Accessibility (must)

- WCAG 2.2 AA on every page. Lighthouse Accessibility 100 on `/portfolio` and all case studies; no axe violations.
- Contrast ≥ 4.5:1 for body and metadata text on every surface, including text inside buttons (F-07).
- Every interaction available by keyboard and touch; visible focus on everything focusable; outline before content in tab order (F-14).
- One primary link per project (F-15); correct heading levels (F-16).
- Targets ≥ 24×24 px for standalone controls (F-21).
- `prefers-reduced-motion: reduce` removes all non-essential motion and smooth scrolling and is honoured live (F-22). Consider an on-page motion toggle if motion is significant.
- Content is readable with JavaScript disabled, without scrolling, and with images off (F-03).
- Screen-reader pass on VoiceOver (macOS + iOS) before launch; this was not done in the audit.

### Performance (must, numbers pending Ali's approval; DC-6)

- Mobile lab: LCP ≤ 2.5 s, TBT ≤ 200 ms, CLS ≤ 0.1, Lighthouse Performance ≥ 90 on the index and every case study.
- Field (Speed Insights, p75): LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- Images: correct `sizes`, only the LCP image prioritised, everything else lazy (F-10). Index cover media ≤ 300 KB total on first load.
- No new heavy dependencies without approval. GSAP and Lenis are already installed; prefer them or CSS over adding WebGL/3D libraries. Any WebGL must be optional, lazy, and off under reduced motion.
- Keep content in server components; motion in thin client wrappers (F-12).

### Content (must)

- No new metrics, employers, titles, dates, team sizes, or customers.
- Screenshots only of real products. Recreated or illustrative visuals must be labelled.
- Dead or closed links resolved before launch (F-01).
- Positioning paragraph decision made (F-08).

### Technical (must)

- Keep URLs: `/portfolio`, `/portfolio/{ledgerguard, alwaysgeeky, emplifi, agent-tooling, tallyfolio, controltech, mapbylaw}`.
- Keep static generation, metadata, canonical URLs, JSON-LD, sitemap entries.
- Keep content in `data/*.ts`; extend the `Project` model rather than hard-coding copy in JSX (A§2).
- Behavioural baseline is production as recorded in `baseline-audit.md`. Any intentional change (e.g. back-navigation restoration) is listed in the PR.

## 8. What the new design must preserve

- Text-complete index: name, role, timeframe, one-line problem/outcome, and case-study link readable without media or motion.
- The nine-section case-study structure and the Decision / Why / Trade-off / Result format.
- Interactive diagrams and their accessibility.
- Skip link, focus management on navigation, mobile menu behaviour, visible focus.
- Reduced-motion support at load.
- Zero CLS and no horizontal overflow at 390/768/1440.
- Static generation, metadata, structured data, sitemap, canonical URLs, `llms.txt` coverage.
- Live product links (where live), related writing links, "Next case study" navigation.
- Careful scope language on experiments (MapBylaw) and on AI boundaries.

## 9. What to remove or reorganise

| Current                                                   | Proposal                                                                                                   | Reason       |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------ |
| H1 "Portfolio" + four intro paragraphs                    | One-line role statement + one-sentence thesis; the rest moves into case studies or "About" on the homepage | F-05         |
| "What to look for" (4 cards) above the projects           | Move below the index or turn into a one-line reading guide; drop the parallax                              | F-05, motion |
| 11 role-fit pills                                         | Reduce to 4–6 or fold into the role statement; they compete with project tags                              | Hierarchy    |
| Location / languages line                                 | Keep, but move to a compact meta line near contact                                                         | Hierarchy    |
| Profile cards (GitHub, LinkedIn, Book a call)             | Keep; make smaller and closer to the thesis; fix accessible names                                          | F-23         |
| Seven equal index entries                                 | Three tiers with distinct treatments                                                                       | F-06         |
| Three links per project                                   | One primary link + outbound links                                                                          | F-15         |
| Sticky outline after content                              | Outline before content in DOM                                                                              | F-14         |
| Opacity-0 scroll reveals on all content                   | Visible-by-default content; motion on decorative layers and transitions                                    | F-03         |
| Header blur/scale on load                                 | Remove; replace with one title moment that never hides text                                                | F-13         |
| Full-width dashboard screenshots on mobile                | Detail crops or zoomable figures                                                                           | F-17         |
| "Additional experience" dead path, `ProjectHighlightCard` | Remove or repurpose deliberately                                                                           | F-26         |
| Default OG image for every case study                     | Per-project OG image in the new identity                                                                   | F-25         |

## 10. Open questions for Ali

1. Approve the two-layer design rule and the motion/performance budgets (DC-4, DC-5, DC-6)?
2. Confirm tiers: Featured (LedgerGuard, AlwaysGeeky, Emplifi), Supporting (Agent tooling, TallyFolio, ControlTech), Experiment (MapBylaw)?
3. Keep, soften, or remove the "staff-level" intro paragraph (F-08)?
4. Voxies marketplace and ctrltech.org links: relabel, archive, or remove (F-01)?
5. Can you provide a LedgerGuard review-UI capture with demo data and one-line provenance for the 80% and 90% figures (F-09)?
6. Should `/portfolio#case-studies` scroll to the list again, or was disabling portfolio hash scrolling in `8624118` intentional (F-04)?
7. Is the redesign allowed to add a display or monospace typeface (font weight and licensing to be checked)?
8. Is an Awwwards submission a firm goal (it affects whether page transitions and a motion toggle are in scope for v1)?

## 11. Suggested sequencing (for planning only)

1. Decisions above; doc updates from `documentation-conflicts.md`.
2. Content fixes that are independent of design: F-01, F-07, F-19, F-11.
3. Behaviour fixes with tests: F-04, F-03, F-14 (protects the baseline before visual change).
4. Data model extension (tier, cover, link status, provenance).
5. Token layer and typography.
6. Index redesign, then case-study template, then transitions.
7. Verification against §7 at 390/768/1440, reduced motion, keyboard, screen reader, Lighthouse.
