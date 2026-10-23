# Content and evidence inventory

Audit date: 2026-10-23. Source of truth: `data/projects.ts` (all seven projects, `PORTFOLIO_CASE_STUDY_ORDER` at line 104), `public/portfolio-media/`, `content/posts/`, and HTTP checks of each project's outbound links.

**Rules for this file**

- Facts are quoted or paraphrased from the repository. Nothing has been rewritten or added.
- "Verified" means checked against the repository or a live URL during this audit. It does **not** mean the career claim itself has been independently confirmed; only Ali can confirm employment facts.
- "Claims requiring verification" lists statements a reviewer or interviewer could reasonably ask Ali to back up. They are not assumed to be wrong.
- Prominence recommendations are proposals for the redesign and need Ali's sign-off (see `documentation-conflicts.md` DC-7).

## Overview

| #   | Project                 | Role (as published)                   | Timeframe     | Screenshots in repo | Diagrams | Related writing     | Outbound link status (2026-10-23)                                            | Proposed tier |
| --- | ----------------------- | ------------------------------------- | ------------- | ------------------- | -------- | ------------------- | ---------------------------------------------------------------------------- | ------------- |
| 1   | LedgerGuard             | Senior Product Engineer               | 2026–Present  | 3                   | 3        | 1                   | ledgerguard.io → 200                                                         | Featured      |
| 2   | AlwaysGeeky Games       | Senior Frontend Engineer              | 2024–2026     | 2                   | 3        | 0                   | market.voxies.io → redirects to `/closed` (shut down); login.voxies.io → 200 | Featured      |
| 3   | Emplifi                 | Senior Frontend Engineer              | 2022–2023     | 0                   | 3        | 0                   | emplifi.io → 403 to curl (bot block, not confirmed in browser)               | Featured      |
| 4   | Agent Engineering Tools | Independent / Ongoing                 | none          | 0                   | 2        | several (see below) | github.com/alipajand → 200; four public repos                                | Supporting    |
| 5   | TallyFolio              | Founder · Product Engineer · Designer | "Independent" | 2                   | 3        | 0                   | tallyfolio.com → 200                                                         | Supporting    |
| 6   | ControlTech             | Frontend Engineer                     | 2018–2022     | 0                   | 2        | 0                   | ctrltech.org → **DNS does not resolve**                                      | Supporting    |
| 7   | MapBylaw                | Independent / Product experiment      | none          | 2                   | 2        | 1                   | mapbylaw.ca → 200                                                            | Experiment    |

Media weight: `public/portfolio-media/` is 18 MB for 10 PNGs. `alwaysgeeky-marketplace.png` alone is 8.1 MB and `mapbylaw-landing.png` 3.6 MB. `data-flow.png` is used by a writing post, not by the portfolio.

Dimension mismatch: `tallyfolio-dashboard.png` is 3456×2234 on disk, but `data/projects.ts:428-429` declares 3454×1982. `tallyfolio-landing.png` matches (3186×1768). See finding F-11.

---

## 1. LedgerGuard

- **Verified name / role:** "LedgerGuard", "Senior Product Engineer", "2026–Present" (`data/projects.ts:119-129`). The homepage uses the same label (`data/homepage.ts:37`).
- **Actual contribution (as written):** sole builder. "I designed and built it alone: the product, the API, the data model, the document pipeline, billing, infrastructure, and delivery." Stack: Next.js App Router, Node.js/Fastify, Supabase PostgreSQL/Auth/Storage, Redis/BullMQ, Python worker with AWS Textract and OpenAI.
- **Strongest engineering evidence:**
  - The suggested-vs-confirmed boundary held "across the schema, the API, and the UI". This is a clear, interview-ready architecture decision with a stated trade-off.
  - Deterministic API vs probabilistic worker split behind job contracts.
  - Async extraction states modelled as product states.
  - Live product link, a related long-form post (`ledgerguard-truth-between-extraction-and-finance`), and three diagrams.
- **Existing screenshots:** landing, login, dashboard (`ledgerguard-*.png`, 3456×2234, 0.6–0.75 MB each).
- **Missing evidence:**
  - No screenshot of the review/verification UI, which is the feature the whole case study is about. The three images are landing, sign-in, and dashboard.
  - No view of async/partial/failed extraction states.
  - No code excerpt, schema sketch, or API contract sample.
- **Claims requiring verification:**
  - "Reached 90% unit-test coverage on the web application" (`:225`). A coverage report or CI badge would support it.
  - Role title "Senior Product Engineer" on a solo product: confirm Ali wants a job title rather than "Founder" or "Independent", as TallyFolio uses.
  - "Multi-tenant" and "billing": confirm both are live in production, not planned.
- **Recommended prominence:** **Featured, first.** Strongest end-to-end evidence and the best match for the full-stack positioning. The redesign should give it the most space and lead with the review UI once a screenshot exists.

## 2. AlwaysGeeky Games

- **Verified name / role:** "AlwaysGeeky Games", "Senior Frontend Engineer", "2024–2026" (`:552-563`). Homepage matches (`data/homepage.ts:53`).
- **Actual contribution (as written):** built and owned the shared React/TypeScript component library used by four product surfaces; Storybook documentation; conventions for component APIs, accessibility, TypeScript, and review; CI gates; design docs; mentoring through pairing and review; Cursor + MCP setup.
- **Strongest engineering evidence:**
  - Ownership of a shared library across four surfaces, plus the conventions and gates that kept them aligned. This is the main senior/leverage evidence on the site.
  - The decision to treat Storybook as the contract and CI as enforcement, with trade-offs stated.
- **Existing screenshots:** marketplace (8.1 MB PNG), login (3.0 MB PNG).
- **Missing evidence:**
  - No Storybook screenshot, component API sample, or before/after showing consolidation.
  - No artefact for the design docs or CI gates.
  - No related writing. `content/posts/design-systems-that-stick.md` exists but does not mention AlwaysGeeky and is not linked from the case study.
- **Claims requiring verification:**
  - **The "Marketplace" live link now lands on a closure page.** On 2026-10-23, `https://market.voxies.io` redirected to `/closed`, which reads "The Voxies Marketplace has shut down" and dates the closure to July 17, 2026. The case study still presents it as a live link (`:749`). This needs a decision: relabel as archived, remove, or link an archived capture.
  - "Four product surfaces", "drove adoption across the teams", and "mentored engineers": these are the claims that support the senior framing in the portfolio intro, so they are the most likely interview topics.
  - The relationship between "AlwaysGeeky Games" (employer name) and "Voxies" (link domain) is not explained on the page. A recruiter clicking through will see a different brand.
- **Recommended prominence:** **Featured, second.** Strongest evidence for design-system and cross-team work. Needs the dead marketplace link resolved before any redesign ships.

## 3. Emplifi

- **Verified name / role:** "Emplifi", "Senior Frontend Engineer", "2022–2023" (`:758-767`).
- **Actual contribution (as written):** React/TypeScript/D3.js dashboard modules; rendering performance work on embedded mobile webviews; shared accessible components and their documentation; Sentry and Hotjar for post-release behaviour.
- **Strongest engineering evidence:** the only quantified performance result on the site: "Cut unnecessary re-renders and chart-update paint cost on lower-powered devices by 80%." The webview-first profiling decision is a good senior story.
- **Existing screenshots:** none.
- **Missing evidence:**
  - No interface evidence at all. Emplifi is enterprise software, so screenshots may not be shareable. A diagram or a recreated, clearly labelled illustrative chart would help, but must be labelled as such.
  - No description of how the 80% was measured (tool, metric, baseline, device).
  - The live link goes to the company homepage, not to anything Ali built.
- **Claims requiring verification:**
  - The 80% figure: measurement method and scope. It appears in the meta description, the card, the outcome, a diagram, and the README, so it is the most repeated number on the site.
  - "Colleagues credited with helping the team ship faster" (`:823`): consider a testimonial or remove the attribution.
- **Recommended prominence:** **Featured, third.** Strong performance and data-viz evidence; weak visually. The redesign must not require images for this card.

## 4. Agent Engineering Tools

- **Verified name / role:** "Agent Engineering Tools", "Independent / Ongoing", no timeframe (`:1064-1073`). The `/open-source` page covers the same projects.
- **Actual contribution (as written):** three TypeScript CLIs (`agent-context-doctor`, `agent-pr-reviewer-lite`, `agent-readiness-kit`), a GitHub Action (`agent-readiness-action`), and integrations (MCP server, portable skill, Claude Code and Cursor plugins).
- **Verified during audit:** all four repos are public under `alipajand` (1 star each, pushed 2026-10-21/22). `agent-readiness-action` releases include `v1.2.0` (2026-10-12) and `integrations-v0.1.2` (2026-10-13), matching the outcome text.
- **Strongest engineering evidence:** the supply-chain decision: an early action ran `npx agent-readiness-kit`, which resolved to an unrelated author's npm package; fixed by bundling engines at pinned commits and reading config from the base branch. This is a specific, verifiable security story.
- **Existing screenshots:** none. No terminal output, SARIF view, or PR annotation captures.
- **Missing evidence:** a terminal/PR screenshot of real output; adoption evidence beyond Ali's own repositories.
- **Claims requiring verification:** "The MCP package is published on npm and in the official MCP Registry" and "directory submissions remain under review in the October 14 record" (`:1137`). These are time-sensitive and will go stale.
- **Recommended prominence:** **Supporting.** Strong for the AI/DX positioning and fully public, but independent and early. Best presented with real CLI/PR output, which suits an expressive, code-forward visual treatment.

## 5. TallyFolio

- **Verified name / role:** "TallyFolio", "Founder · Product Engineer · Designer", timeframe "Independent" (`:348-358`). "Independent" is in the timeframe field, not a date range.
- **Actual contribution (as written):** product strategy, UX, frontend, backend shape, and data model for a manual-first personal-finance PWA.
- **Strongest engineering evidence:** integer minor-unit storage with pure domain modules; CSV/XLSX parsed in memory and never persisted; AI limited to explaining computed figures.
- **Existing screenshots:** landing, dashboard. The dashboard file's declared dimensions do not match the file (F-11).
- **Missing evidence:** import review screen; forecast view; any test or correctness artefact for the money-math claim.
- **Claims requiring verification:** "production-grade auth" (`:437`) is vague. Name what it is or drop "production-grade".
- **Recommended prominence:** **Supporting.** Good full-stack and product-judgment evidence, but it overlaps with LedgerGuard's story (solo, AI kept behind a deterministic boundary). The redesign should present it as a second example of the same principle rather than a separate headline.

## 6. ControlTech

- **Verified name / role:** "ControlTech", "Frontend Engineer", "2018–2022" (`:929-939`).
- **Actual contribution (as written):** frontend delivery across several early-stage SaaS products at a startup studio; PWAs, dashboards, form-heavy workflows; Jest, RTL, Playwright, Cypress; CI/CD checks.
- **Strongest engineering evidence:** four years of MVP-to-production delivery and test automation. It explains where the later habits came from.
- **Existing screenshots:** none.
- **Missing evidence:** no named product, no screenshot, no artefact. The case study's own "What I would improve" says so (`:989-990`).
- **Claims requiring verification:**
  - **The company link is broken.** `https://ctrltech.org` did not resolve in DNS on 2026-10-23 (`curl: Could not resolve host`). Also note the spelling: "ControlTech" vs `ctrltech.org`.
  - Playwright usage in 2018–2022: Playwright's first public release was in 2020, so it can only apply to the later part of the range. Worth confirming wording.
- **Recommended prominence:** **Supporting, or fold into an "Earlier work" block.** It is the weakest case study on evidence, but it carries four of the nine-plus years. A dedicated page is fine; a full-weight index card is hard to justify.

## 7. MapBylaw

- **Verified name / role:** "MapBylaw", "Independent / Product experiment", no timeframe (`:1226-1235`).
- **Actual contribution (as written):** information architecture and map-led exploration UI; filtering and progressive disclosure; a typed AI-recommendation contract shared by a Fastify API, React dashboard, and React-PDF report, with Zod-validated output.
- **Strongest engineering evidence:** one typed recommendation payload rendered identically by API, dashboard, and PDF, with out-of-schema output rejected. Supported by a related post (`mapbylaw-ai-recommendations`).
- **Existing screenshots:** landing (3.6 MB), dashboard (1.1 MB).
- **Missing evidence:** a screenshot of a recommendation with cited inputs; the PDF report.
- **Claims requiring verification:** scope language is already careful ("experiment", "not an official municipal reference"). No numeric claims.
- **Recommended prominence:** **Experiment tier.** Good visual material (maps suit an expressive design) and a strong AI-contract story, but it is explicitly an experiment. `CLAUDE.md` lists it as "if relevant and strong enough", and the README omits it.

---

## Cross-project observations

1. **Interface evidence is thinnest exactly where seniority claims are strongest.** Emplifi (the only metric) and AlwaysGeeky (the leverage story) have the least verifiable visual evidence. LedgerGuard has screenshots, but not of the review UI the case study is about.
2. **Two of seven outbound "live" links are not live** (Voxies marketplace closed; ctrltech.org unresolved). These are the kind of thing a hiring manager clicks.
3. **Every case study uses the same nine-section template.** Good for scanning and consistent for engineers. For the redesign, the template can stay, but the index needs tiers so the strongest three are not buried among seven equals.
4. **Repeated claims:** "four product surfaces" appears in the portfolio intro, homepage, engineering principles, AlwaysGeeky case study, and README; "80%" appears five times. Any correction must be made everywhere at once.
5. **Diagrams are the most reusable design asset.** Every case study has 2–3 interactive diagrams (`components/diagrams/`). They are accessible (buttons with `aria-expanded`/`aria-pressed`, `aria-live` panel) and could anchor a more expressive visual system without new claims.

## Owner decisions (2026-10-23)

Full record in `owner-decisions.md`.

- **Tiers approved:** Featured (LedgerGuard, AlwaysGeeky, Emplifi), Supporting (Agent tooling, TallyFolio, ControlTech), Experiment (MapBylaw).
- **Voxies Marketplace:** historical work, explicitly marked closed; no live-product CTA.
- **ControlTech:** website link omitted until a working destination is verified.
- **LedgerGuard review screenshot:** desirable, not a design-phase blocker.
- **Emplifi 80% and LedgerGuard 90%:** not featured prominently until their sources are established. Emplifi stays featured, using real diagrams and evidence-based visualisations.

## Still open

1. Provenance for the Emplifi 80% figure (tool, metric, device class) and the LedgerGuard 90% coverage figure.
2. LedgerGuard role label: "Senior Product Engineer" or "Founder / Independent"? Not covered by the 2026-10-23 decisions; the current published label stays until Ali decides.
3. Whether a replacement destination exists for ControlTech.
