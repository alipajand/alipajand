# Architecture plan

> Audit of the Pajand Hairline design artifacts against the Next.js application.
> Frozen revision: `b8856fec6703f6213d5b6e4ac42a9c0f86b3f375` (PR #223 head, branch `ali/nostalgic-blackwell-0b3838`). The brief expected `6e0ffc8`; the head had advanced by three commits (`d6dc60a`, `89a649f`, `b8856fe`), all inside `docs/design/`.
> Application baseline: the same revision. Next.js 16.4.2, React 19.3.1 installed. `origin/main` is 6 commits ahead of the merge base `6f43749` (PR #222 and dependency bumps; see M-05).
> Every finding states a severity (Critical, High, Medium, Low, Info) and a status: **Verified failure** (reproduced from code, build output or capture), **Risk** (pattern confirmed, impact not reproduced) or **Untested** (could not be checked read-only).

## Starting point

These facts come from the frozen revision. Each one has its own finding in the other documents.

- **Framework.** Next.js 16.4.2 is installed and React 19.3.1. `origin/main` already requires `^16.4.3`.
- **Client-heavy pages.** Every page-level feature component is `"use client"`. These are `features/*/…PageContent.tsx` and 57 client files in total (`grep -rln '"use client"' app components features utils`). Pages are server-rendered but ship 580–780 KB of uncompressed JavaScript each (see M-03).
- **Motion.** It runs on GSAP and Lenis. `utils/cinematic.ts:81-105` already has a scroll-frame scheduler (`onScrollFrame`).
- **Styling.** Tailwind CSS v4 uses `@theme inline` in `app/globals.css:20`. The only font is Geist Sans, loaded through `geist/font/sans` in `app/layout.tsx:2`.
- **No error boundaries.** There is no `error.tsx`, `global-error.tsx` or `loading.tsx` under `app/` (M-06). Only `app/not-found.tsx` exists.
- **Artifacts are standalone HTML.** They run their own runtime: an always-on `requestAnimationFrame` loop, `fit.js` title fitting, hash routing and `claude.ai` link rewriting. **None of that runtime should be ported as-is.** The port keeps the visual system and the content contracts, not the delivery mechanism.

## Target architecture

### Rendering boundaries

| Layer | Kind | Contents |
| --- | --- | --- |
| Route `page.tsx` and its section components | Server Component | All copy, headings, figures, diagrams' static SVG, JSON-LD, metadata |
| Shared chrome (nav shell, footer, skip link, `<main>`) | Server Component | Static markup, current-route state passed as props |
| Mobile menu toggle | Client island | `aria-expanded`, `inert`, scroll lock, breakpoint reset (B-12, B-13) |
| Scroll scheduler provider | Client island, mounted once in the layout | One rAF per scroll/resize/pointer event; subscribers register in `useEffect` and unregister on unmount (D-01, D-02, D-19) |
| Scroll-linked visuals (progress bar, chapter rail active state, chevrons, badges walk, activity weeks) | CSS first (`animation-timeline: scroll()` / `view()`), client island fallback | Must leave state readable with motion reduced (D-04) |
| Ticker | Client island | CSS keyframes plus a pause control (WCAG 2.2.2, D-06); off-screen pause |
| Hero canvases | Client island, `next/dynamic` with `ssr: false` behind a server-rendered static SVG or image fallback | Only drawn while intersecting and visible (D-11, D-20, B-23) |
| Screenshot lightbox | Client island wrapping a server-rendered `<figure>` | Native `<dialog>` + `showModal()`, focus return, Escape (B-17, D-25) |
| Contact form | Client island (existing `ContactForm` contract kept) | Production pipeline unchanged; the artifact form is visual reference only (B-07, B-08) |
| Article TOC active heading, reading progress | Client islands | Production URLs stay `/writing/[slug]`; the artifact `#slug` reader is not ported (B-16) |

Acceptance for the boundary model:

- No `features/*/…PageContent.tsx` file carries `"use client"`.
- Client JS on a case study route drops measurably from the 728 KB baseline recorded in `captures/` (re-measure with the same script).
- With JavaScript disabled, every route shows all copy. This already holds today and must keep holding.

### Design tokens and CSS

- Add the Hairline palette (`ink`, `ink-2`, `bone`, `bone-2`, `line`, `rule`, `mute`, `mute-ink`) as Tailwind v4 `@theme` tokens in `app/globals.css`. Use the exact values from `docs/design/system/project/tokens.json` (see the parity table in 02). Keep the old tokens until the last route moves, then delete them.
- Load fonts through `next/font`:
  - **Archivo** as a variable font, with the `wdth` axis and italics, from `next/font/google`.
  - **Geist Mono** from `geist/font/mono`, which is already a dependency.
  - Expose them as `--display`, `--sans` and `--mono`.
  - Canvas code must read the resolved family from a CSS variable, not a literal name (D-08).
- Port `docs/design/kit/base.css` as a `@layer components` file split by component. Keep the artifact breakpoints (960/760/420) as custom `@custom-media` or Tailwind screens rather than snapping to Tailwind defaults (D-27).
- Sizing that uses `cqi` needs `container-type: inline-size` on the frame. Keep it; it is the mechanism that keeps titles inside the page without post-paint JavaScript.

### Titles inside the page without `fit.js`

`fit.js` measures after paint and rescales, which causes layout shift (D-07, M-02). In React, replace it in this order:

1. CSS `clamp()` with `cqi` units, sized per component from the artifact values.
2. `text-wrap: balance`, `overflow-wrap: anywhere` as the last line of defence.
3. Only where a title is data-driven and long (case-study display words), a `font-size` computed at build time from character count and stored with the data.

Acceptance: the title check (every title inside its container at 320–1920 px) passes with JavaScript disabled, and CLS stays below 0.05 on every route.

### Motion policy

- **One preference hook.** A live `useReducedMotion()` hook listens to `matchMedia(...).addEventListener("change")`, replacing every read-once check (D-03, B-22).
- **Reduced motion keeps state.** It turns off movement only. Active section, progress and highlights stay visible (D-04), and flow labels are still fitted (D-05).
- **No hidden content before JS.** No element may be hidden by CSS waiting for JavaScript (B-18, M-01). Entrance effects animate from a visible state or use `@starting-style`.
- **Cleanup.** GSAP work is scoped with `gsap.context()` and reverted on unmount (B-19). Drop `will-change` after each transition (B-20, D-17).
- **Lenis decision.** Keep Lenis only if the sticky chapter rail and in-page anchors work with it (D-26); otherwise remove it. This needs a decision (see 09).

### Routing, links and content

- **Canonical URLs do not change.** Artifact hash routes (`#slug`), the `urls.json` map and all `claude.ai/artifact` links are build-time artifacts of the preview and must never reach `data/` or components (A-07).
- **Anchor ids keep their production names.** These are `#case-studies`, `#open-source-tools` and the project-prefixed case-section ids, unless a redirect or alias is added and approved. This matters because links and JSON-LD `@id` values use them (A-07).
- **New display copy goes into `data/*.ts`.** This covers group labels and section kickers. Add it only after sign-off, because the hand-built kit pages contain copy that is not in `data/` (C-09).
- **Contribution activity.** `main` has the live Algora card (#222); the artifact draws a GitHub snapshot (A-12). Recommended: one server component that fetches the public contribution calendar with `revalidate` (for example daily) and renders the Hairline graph, linking to the Algora profile. This adds a runtime fetch to a third party, so it needs approval.

### Images

- **`next/image`.** Use explicit `sizes`. Make only the first figure on a route `priority`; the rest lazy-load (B-17 notes eager loading today).
- **Status labels.** Each image's status (shipped product, design prototype, editorial) is stored in `data/projects.ts` and shown in the caption where it is not a shipped screenshot (C-01, C-02).

### Error, loading and not-found states

- Add `app/error.tsx` and `app/global-error.tsx` in the Hairline style, with a retry action and the same chrome as the 404 (M-06).
- Keep `app/not-found.tsx` returning HTTP 404. It does today (captures: status 404).

### Testing and validation (no new dependencies)

- **Route tests.** Add them for `/api/contact` (A-13, B-03), sitemap, feed, llms (A-14) and scheduled-post filtering (A-01).
- **Component tests.** Every new client island gets a Testing Library test covering:
  - keyboard operation;
  - reduced-motion behaviour, using a mocked `matchMedia`;
  - unmount cleanup, asserting that no listeners remain.
- **Capture script.** Keep the measurement method from this audit as a documented manual check in `docs/`: Playwright Core was run from outside the repository, and the script is not committed. Adding Playwright to the repository is a dependency change and needs approval.

## Guidance contradictions to resolve first

These findings sit in the repository's own guidance and docs. They should be fixed before implementation starts, so that later work is checked against correct rules.

## Guidance findings

| ID | Severity | Status | Finding |
| --- | --- | --- | --- |
| [M-06](#m-06) | Low | Verified | No route error boundary |
| [A-02](#a-02) | Medium | Verified failure (docs vs code) | docs/*` and `AGENTS.md` declare Next.js 15, static-only rendering, server-component defaults, and wrong env names |
| [A-04](#a-04) | Low | Verified failure | Root `docs/ROUTES.md` / `docs/SITE_STRUCTURE.md` / `docs/ARCHITECTURE.md` route and content contracts are stale |
| [C-15](#c-15) | Medium | Verified failure | The documented Next.js version is wrong |
| [C-16](#c-16) | Medium | Verified | The test requirements disagree |
| [C-17](#c-17) | Medium | Verified | The availability and positioning line differs between CLAUDE.md and data |
| [C-18](#c-18) | Medium | Verified failure | docs/ARCHITECTURE.md is stale and contradicts the code and itself; AGENTS.md misses the webhook route |
| [C-19](#c-19) | Medium | Risk (needs an owner decision, not a code defect) | Hairline motion and complexity conflict with the CLAUDE.md UI rules and the system's own motion rule |
| [C-20](#c-20) | Low | Verified | The content-source rules are bypassed by the static kit pages, and the validation commands do not cover them |
| [C-21](#c-21) | Low | Verified | Smaller inconsistencies |
| [D-29](#d-29) | Info | Verified failure | Documentation claims that the code contradicts |

<a id="m-06"></a>

### M-06: No route error boundary
- **Severity:** Low. **Status:** Verified.
- **Evidence:** `find app -name error.tsx -o -name global-error.tsx -o -name loading.tsx` returns nothing. Only `app/not-found.tsx` exists. A render error in any route falls back to the framework default page with no site chrome.
- **Remedy:** Add `app/error.tsx` and `app/global-error.tsx` styled like the 404 (Q-07).
- **Acceptance:** A test component that throws renders the Hairline error page inside the layout with a retry button; `global-error.tsx` renders its own `<html>`/`<body>`.

<a id="a-02"></a>

### A-02: `docs/*` and `AGENTS.md` declare Next.js 15, static-only rendering, server-component defaults, and wrong env names
- **Severity:** Medium. **Status:** Verified failure (docs vs code).
- **Paths:** `docs/ROUTES.md:3`, `docs/ARCHITECTURE.md:5`, `AGENTS.md:5,13` ("Next.js 15") vs `package.json` `"next": "^16.4.2"` (origin/main 16.4.3). `docs/API.md:3` ("All other pages are statically generated at build time") vs `app/page.tsx:8`/`app/writing/page.tsx:14` `force-dynamic`. `docs/ARCHITECTURE.md:60` ("Default: React Server Components") vs all 7 feature roots being `"use client"`. `docs/ARCHITECTURE.md:69`, `docs/API.md:41`, `docs/MIGRATIONS.md:29` say `CONTACT_TO_EMAIL`, but the code reads `process.env.CONTACT_EMAIL` (`utils/resend.ts:42`). `RESEND_FROM` and `NEXT_PUBLIC_GA_MEASUREMENT_ID` are not in the ARCHITECTURE table. `docs/API.md:87` documents a `buildMetadata()` that does not exist.
- **Evidence:** `docs/ROUTES.md:3`: "All routes use the Next.js 15 App Router." Also `utils/resend.ts:42`: `const raw = process.env.CONTACT_EMAIL?.trim() ?? …`.
- **Remedy:** Update the version, the rendering strategy (two dynamic routes and why), and the env table to `CONTACT_EMAIL`/`RESEND_FROM`/`RESEND_WEBHOOK_SECRET`/`NEXT_PUBLIC_GA_MEASUREMENT_ID`. Remove the `buildMetadata` reference.
- **Acceptance:** `grep -rn "Next.js 15\|CONTACT_TO_EMAIL\|buildMetadata()" docs AGENTS.md` returns nothing, and the env table matches `grep -rho "process.env.[A-Z_]*" app utils components`.

<a id="a-04"></a>

### A-04: Root `docs/ROUTES.md` / `docs/SITE_STRUCTURE.md` / `docs/ARCHITECTURE.md` route and content contracts are stale
- **Severity:** Low. **Status:** Verified failure.
- **Paths:** `docs/ROUTES.md:7-15` omits `/portfolio/[slug]`, `/open-source`, `/feed.xml`, `/llms*.txt`, `/images/profile-*.png`, `/writing/[slug]/opengraph-image`, `/manifest.json` and the `/blog` redirects. `docs/ROUTES.md:10` describes `/portfolio` as "about, experience, case studies, skills, education". `docs/SITE_STRUCTURE.md:3-4` lists testimonials on home, and experience/innovation/skills/education on portfolio. `docs/ARCHITECTURE.md:30-36,38-42` lists `data/experience.ts`, `education.ts`, `howIThink.ts`, `innovation.ts`, `data/posts/`, `content/*.md` and gray-matter. None of these exist: posts are in `content/posts/`, parsed by js-yaml in `utils/posts.ts:32-49`. `docs/ROUTES.md:37` says slugs come from `content/*.md`.
- **Evidence:** `ls data` has no experience/education/innovation/howIThink files. `grep` finds no importer of `components/Testimonials/Testimonials`.
- **Remedy:** Regenerate these docs from `app/` and `data/`. Either delete the orphan Testimonials component and its tests, or document it as unused.
- **Acceptance:** Every `app/**/(page|route).ts(x)` and special file appears in `docs/ROUTES.md`, and every path cited in `docs/ARCHITECTURE.md` exists.

<a id="c-15"></a>

### C-15: The documented Next.js version is wrong
- **Severity:** Medium · **Status:** Verified failure
- **Where:** `AGENTS.md:5` ("a Next.js 15 App Router site"), `AGENTS.md:13` ("Next.js 15 App Router") and `docs/ARCHITECTURE.md:5` ("This is a Next.js 15 App Router website").
- **Evidence:** `package.json` has `"next": "^16.4.2"`, the installed `node_modules/next/package.json` is `16.4.2`, and `origin/main:package.json:29` has `"next": "^16.4.3"`. `eslint-config-next` is pinned at `16.3.8` (`package.json`) on both branches. `CLAUDE.md:30` gives no version.
- **Remedy:** change these to "Next.js 16" (no patch version, so docs survive bumps). Optionally align `eslint-config-next` with the next minor version.
- **Acceptance:** `grep -rn "Next.js 15" AGENTS.md CLAUDE.md docs/*.md` returns nothing.

<a id="c-16"></a>

### C-16: The test requirements disagree
- **Severity:** Medium · **Status:** Verified
- **Where:** `AGENTS.md:63` says "Run `pnpm test` before finishing any task." `CLAUDE.md:205-210` says that for content-only changes `pnpm lint` and `pnpm typecheck` are enough (no test).
- **Remedy:** pick one rule. For example, AGENTS.md defers to the CLAUDE.md tiers, or CLAUDE.md adds `pnpm test` to the content tier.
- **Acceptance:** both files give the same command set for a content-only change.

<a id="c-17"></a>

### C-17: The availability and positioning line differs between CLAUDE.md and data
- **Severity:** Medium · **Status:** Verified
- **Where:**
  - `CLAUDE.md:21`: "available for full-stack, senior frontend, and product engineering opportunities."
  - `data/contact.ts:11`: "Open to lead frontend, senior frontend, and senior full-stack roles in Montreal or remote within Canada."
  - `data/footer.ts:38`: "Based in Montreal, Canada · Open to remote work within Canada."
  - The artifacts reproduce both versions (`static/home.html:560` vs `static/portfolio.html:510`). See C-09.
- **Remedy:** the owner chooses the canonical role list. Update CLAUDE.md or data to match, then fix `static/portfolio.html:510`.
- **Acceptance:** one role list across CLAUDE.md, data and every artifact.

<a id="c-18"></a>

### C-18: docs/ARCHITECTURE.md is stale and contradicts the code and itself; AGENTS.md misses the webhook route
- **Severity:** Medium · **Status:** Verified failure
- **Where:**
  - `docs/ARCHITECTURE.md:30-36` lists `experience.ts`, `education.ts`, `howIThink.ts`, `innovation.ts` and `posts/` under `data/`. None of these exist (`ls data/` shows 24 files, including `projects.ts`, `homepage.ts`, `contact.ts`).
  - `:38-39` says `content/*.md`. The actual path is `content/posts/*.md`.
  - `:69` names the env var `CONTACT_TO_EMAIL`. The code reads `CONTACT_EMAIL` (`utils/resend.ts:42`; `.env.example:12`).
  - `:76` says "The `app/api/contact` route is the only external API call surface", which contradicts its own `:55` (the Resend webhook route `app/api/webhooks/resend`).
  - `:79` says rate limiting is "handled at the Vercel edge level". Untested; there is no Vercel config in the repo to verify it.
  - `AGENTS.md:37` and `AGENTS.md:77` protect `app/api/contact` but not `app/api/webhooks/resend`, which also handles production mail.
- **Remedy:** regenerate the ARCHITECTURE directory listing from the tree, fix the env var name, reconcile the security statement, and add the webhook route to the AGENTS.md "human review" and "forbidden" lists.
- **Acceptance:** every path and env var named in ARCHITECTURE.md exists in the repo and code.

<a id="c-19"></a>

### C-19: Hairline motion and complexity conflict with the CLAUDE.md UI rules and the system's own motion rule
- **Severity:** Medium · **Status:** Risk (needs an owner decision, not a code defect)
- **Where:**
  - `CLAUDE.md:177` (avoid "Excessive animation").
  - `CLAUDE.md:84,89-90` ("clean index of case studies, not a heavy visual gallery", "lightweight and scannable").
  - `CLAUDE.md:190` ("Avoid visual complexity on recruiter-facing index pages").
  - The portfolio index artifact `static/portfolio.html` has two full canvases (hero field at :304, isometric "Operating model" scene at :491-503), two scroll-velocity tickers (:316-353), a display word that parts and closes on scroll, a scroll progress bar and a pointer-reactive layer. There are 19 matches for `ticker|requestAnimationFrame`.
  - The case template tilts the hero screenshot about 14° and follows the pointer (`ScreenshotFrame/README.md:7`).
  - `docs/design/system/project/README.md:3` says "Motion follows the reader's scroll, never a timer", but `docs/design/kit/base.css:47` runs `.dot { animation: blink 2.4s … infinite }`, a timer-driven loop.
- **Mitigations present:** `prefers-reduced-motion` is handled (11 occurrences; `base.css:119` disables animations and transitions; the scripts read `reduce`). The portfolio index uses no images, which satisfies `CLAUDE.md:90,189` (images optional). Case pages render without images (Emplifi, ControlTech and Agent Tooling have none).
- **Remedy:** the owner either updates CLAUDE.md to describe the Hairline motion budget, or trims the index page motion (for example, remove the scene canvas from `/portfolio`). Fix the "never a timer" statement or the blink.
- **Acceptance:** CLAUDE.md UI rules and the Hairline README describe the same motion policy, and the implementation matches it.

<a id="c-20"></a>

### C-20: The content-source rules are bypassed by the static kit pages, and the validation commands do not cover them
- **Severity:** Low · **Status:** Verified
- **Where:**
  - `AGENTS.md:7` ("All content is static TypeScript in `data/` and Markdown in `content/`") and `AGENTS.md:70` ("Static content lives in `data/*.ts` files — edit there, not scattered in JSX"). The three static kit pages hard-code copy (C-09).
  - `.prettierignore` ("docs/design/") and `eslint.config.mjs:16` (`"docs/design/**"`) exclude the kit, so the `CLAUDE.md:205-222` validation sets never touch the artifacts or `build.mjs`.
- **Remedy:** document in `docs/design/README.md` that the static pages are hand-maintained copy and need a manual copy check, or add the copy-check script as a kit step.
- **Acceptance:** a documented, runnable check exists for kit copy against data.

<a id="c-21"></a>

### C-21: Smaller inconsistencies
- **Severity:** Low/Info · **Status:** Verified
- `CLAUDE.md:58`: "Work on `main` unless explicitly told otherwise. Branch off `main` for anything non-trivial." This contradicts itself (work on main vs branch for non-trivial work).
- The final-report formats differ. `AGENTS.md:85-91` asks for summary, files, commands, test results and limitations. CLAUDE.md "When summarizing work" asks for what changed, why, files, validation and risks.
- `CLAUDE.md:259` "Location: Montreal, Canada" vs `data/site.ts:60` "Montreal, Quebec, Canada". These are compatible, but the artifacts mix both (C-09).
- `package.json` has a top-level npm-style `"overrides"` block that duplicates `pnpm-workspace.yaml` `overrides:`. pnpm does not read package.json `overrides` (the project memory notes that editing it alone is a silent no-op). Docs that say "use pnpm only" (`CLAUDE.md:52`) leave this misleading block in place. Info.
- **No contradiction:** the CLAUDE.md priority order (`CLAUDE.md:95-101`: LedgerGuard, AlwaysGeeky, Emplifi, Agent Tooling, TallyFolio, ControlTech, MapBylaw) is identical to `data/projects.ts:104-112` `PORTFOLIO_CASE_STUDY_ORDER`, which `build.mjs:232` uses and `static/portfolio.html` follows ([01]-[07]).
- **Remedy:** clarify the branch rule, align the two report formats, and remove or explain the package.json `overrides`.
- **Acceptance:** the files agree.

---

<a id="d-29"></a>

### D-29 Documentation claims that the code contradicts
- Severity: Info. Status: Verified failure.
- Where: ds/README.md:3 "Motion follows the reader's scroll, never a timer" (see D-06 timers); ds/README.md:29 "fit.js … flow steps" (see D-05); ds/README.md:52 "nothing depends on scrolling to be read" (see D-04); tokens.json:56 "7.6:1" (computed 7.56:1, fine) and tokens.json:61 "About 6:1 on bone" (computed 6.13:1, fine).
- Remedy: update the brand book once the port settles the behaviour.
- Acceptance: README statements match the shipped behaviour.

---
