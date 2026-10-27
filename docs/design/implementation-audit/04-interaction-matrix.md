# Interaction matrix

> Audit of the Pajand Hairline design artifacts against the Next.js application.
> Frozen revision: `b8856fec6703f6213d5b6e4ac42a9c0f86b3f375` (PR #223 head, branch `ali/nostalgic-blackwell-0b3838`). The brief expected `6e0ffc8`; the head had advanced by three commits (`d6dc60a`, `89a649f`, `b8856fe`), all inside `docs/design/`.
> Application baseline: the same revision. Next.js 16.4.2, React 19.3.1 installed. `origin/main` is 6 commits ahead of the merge base `6f43749` (PR #222 and dependency bumps; see M-05).
> Every finding states a severity (Critical, High, Medium, Low, Info) and a status: **Verified failure** (reproduced from code, build output or capture), **Risk** (pattern confirmed, impact not reproduced) or **Untested** (could not be checked read-only).

Functional behaviour in production and in the artifacts. The artifact contact form is preview-only and does not replace the production email pipeline (B-08). The artifact writing reader uses `#slug`; production articles keep their canonical `/writing/[slug]` URLs (B-16, A-07).

## Matrix

### Interaction matrix

| Behavior | Production (path:line) | Artifact (path:line) | Gap | Tests |
| --- | --- | --- | --- | --- |
| Contact form: client validation | react-hook-form `mode: "onBlur"`, required + email regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (`components/Contact/ContactForm.tsx:91,124-130,180`; `components/Contact/hooks/useContactForm.ts:60-63`) | Same three rules and identical messages, run on submit only (`docs/design/kit/static/home.html:625-640`) | Parity on rules/copy. Artifact validates on submit only (no blur validation). | `ContactForm.spec.tsx` (validation, summary focus), `useContactForm.spec.tsx` |
| Contact form: error summary + focus | Summary `role="alert" aria-live="assertive" tabIndex=-1`, plain list, focused after failed submit (`ContactForm.tsx:59-74`; `useContactForm.ts:74-77`) | Summary `role="alert"` with **links to each field**; focus goes to **first invalid field**, not the summary (`home.html:566,641-646`) | Different focus contract; production summary has no field links (B-07) | `ContactForm.spec.tsx:65` (summary focus) |
| Contact form: submit / loading / success / error | `fetch("/api/contact")`, `status` idle/loading/success/error, inputs+button `disabled` while loading, success `role=status`, error `role=alert`, GA events (`useContactForm.ts:78-106`; `ContactForm.tsx:197-215`) | No network; persistent `role="status"` line explains preview (`home.html:593,647-650`) | Artifact must not replace pipeline (B-08). Focus loss after submit (B-05). | `useContactForm.spec.tsx` (success, API error, fetch error, invalid JSON), `ContactForm.spec.tsx` |
| Contact API | Required-field + `isValidEmail` checks, Resend send, raw provider error passthrough; no rate limit/honeypot/length caps (`app/api/contact/route.ts:13-58`; `utils/resend.ts:7-55`) | n/a (preview) | B-01, B-02, B-03, B-04 | **None** (no `app/api/contact` suite) |
| Resend inbound webhook | Svix signature via `resend.webhooks.verify`, handles only `email.received`, `alipajand.com` recipient filter, idempotent forward (`app/api/webhooks/resend/route.ts:26-107`) | n/a | None found (B-09 Info) | `app/api/webhooks/resend/__tests__/route.spec.ts` (15 cases incl. invalid signature, lookalike domain, retries) |
| Direct contact fallback | `LINKS` includes Email `mailto:` (`data/links.ts:2`); network error copy "email directly" (`data/contactForm.ts:31`) | Direct links are Calendly/LinkedIn/GitHub only, **no email** (`home.html:599-605`) | Recovery path referenced by error copy disappears if artifact links are ported verbatim (B-07) | `ContactChannelCard.spec.tsx` |
| Mobile navigation | Toggle button `aria-expanded/aria-controls`, `inert`+`aria-hidden` panel, focus first link on open, return to button on close, Tab trap, Escape, body scroll lock, `inert` on main+footer, close on route change (`components/Nav/Nav.tsx:55-107`; `components/Nav/hooks/useNav.ts:44-151`) | No menu button; links wrap to an always-visible second row ≤760px (`home.html:247-253`; `docs/design/kit/base.css:100-106`) | No breakpoint reset in prod (B-12); Lenis not stopped while locked (B-13); `isScrolled` not initialised (B-14). Artifact nav omits "Principles" (`docs/design/kit/build.mjs:60`) | `useNav.spec.tsx` (16 cases; no resize/breakpoint case), `Nav.spec.tsx` |
| Skip link | `SkipLink` → `#main-content` with rAF focus + scroll (`components/SkipLink/SkipLink.tsx:8-22`; `app/layout.tsx:131`) | **None** in any artifact page; only `not-found.html` has a `<main>` (grep count, see B-29) | Artifact landmarks are not a reference for production a11y | `SkipLink.spec.tsx` |
| Route-change focus | Focus `#main-content` (`tabIndex=-1`) on pathname change (`components/RouteChangeFocus/RouteChangeFocus.tsx:20-47`); `NotFoundMainFocus` focuses main on mount (`components/NotFoundMainFocus/NotFoundMainFocus.tsx:6-9`) | Static pages; `not-found.src.html:67` focuses main with `preventScroll` | Parity on intent | `RouteChangeFocus.spec.tsx`, `NotFoundMainFocus.spec.tsx` |
| Back/Forward + scroll restoration | `history.scrollRestoration = "manual"` and `scrollToTop()` on **every** pathname change, incl. popstate (`RouteChangeFocus.tsx:15-16,29-31`) | Standalone pages, browser default restoration | Back/Forward always lands at top (B-10) | `RouteChangeFocus.spec.tsx` asserts scroll-to-top on pathname change; no popstate case |
| Hash navigation | `scrollToHashElement` (30 rAF retries, `scrollIntoView`) on route change and `hashchange`; **disabled on `/portfolio`** (`utils/hashScroll.ts:3-35`; `RouteChangeFocus.tsx:27,33,55`) | Native anchors (`#contact`, `#posts`, rail `#section`) (`home.html:333`; `case.src.html:291`) | `/portfolio#case-studies` link is silently ignored (B-11); no focus move to target (B-15) | `hashScroll.spec.ts`, `RouteChangeFocus.spec.tsx` |
| Smooth scroll | Lenis 1.3.26 driven by `gsap.ticker`, skipped when reduced motion at mount, destroyed on unmount (`components/SmoothScroll/SmoothScroll.tsx:14-36`); `html { scroll-behavior: smooth }` (`app/globals.css:81-89`) | No smooth-scroll library; `scrollIntoView({behavior})` in reader (`reader.src.html:190`) | No ScrollTrigger anywhere in production (grep). Lenis/menu interaction (B-13) | `SmoothScroll.spec.tsx` (2 cases; cleanup untested) |
| Case study next/prev + breadcrumbs | Next only (no prev), none after last (`utils/projects.ts:23-28`; `components/Projects/ProjectCaseStudyArticle.tsx:169-188`); breadcrumbs `nav[aria-label=Breadcrumb]` (`components/Breadcrumbs/Breadcrumbs.tsx:12-44`) | Pager "Back to all case studies" + Next only (`case.src.html:202-204,288`; `build.mjs:232-240`) | Parity. Breadcrumb separators are `li[aria-hidden]` inside the `ol` (B-28) | `ProjectCaseStudyArticle.spec.tsx`, `Breadcrumbs.spec.tsx`, `portfolioRoutes.spec.ts` |
| Article headings / TOC / progress | `addHeadingIds` on h2+h3 with `-2` suffixes (`utils/headings.ts:7,56-71`); sticky TOC + `<details>` TOC, scroll-spy, `aria-current="location"`, `replaceState(#id)`, focus heading (`components/TableOfContents/TableOfContents.tsx:18-119`; `hooks/useActiveHeading.ts:12-61`); `ReadingProgress` scaleX bar (`components/ReadingProgress/ReadingProgress.tsx:11-23`) | Reader renders posts client-side from JSON, ids from the same `addHeadingIds` (`build.mjs:30,158`), TOC **h2 only** (`build.mjs:163`; `reader.src.html:174-176`), TOC links `href="#<slug>"` + `data-to`, no focus move, no `aria-current` (`reader.src.html:176,190`); post switching via `replaceState(#slug)` (`reader.src.html:193-196`) | Ids are identical; TOC depth, focus and URL contracts differ (B-16) | `headings.spec.ts`, `TableOfContents.spec.tsx`, `ReadingProgress.spec.tsx`, `WritingPostPageContent.spec.tsx` |
| Screenshot lightbox | **None.** `ProjectFigure` renders `next/image` inline, `loading="eager"` on every figure (`components/Projects/ProjectFigure.tsx:16-23`); grep for dialog/lightbox/showModal in `components`/`features`: no hits | Native `<dialog>` + `showModal()`, `<button data-shot aria-label="Enlarge: …">` triggers, Close button, backdrop click closes (`case.src.html:209-212,231,291-301`) | Feature gap (B-17) | none |
| Motion: reveal / hero / header | GSAP + IntersectionObserver reveals (`utils/cinematic.ts:49-206`), hero intro timeline + parallax + infinite indicator (`components/Hero/hooks/useHero.ts:35-178`), SVG grid stroke animation (`components/Hero/hooks/useGridOutlineAnimation.ts:74-98`), page header blur-in (`utils/hooks/usePageHeader.ts:19-75`) | Per-frame rAF loops (`base.js:16-53`; `home.html:762-812`), `reduce` → still frame and return | Content hidden pre-JS (B-18); leaked tweens (B-19); permanent `will-change` (B-20); intro/parallax conflict (B-21) | `useScrollReveal.spec.tsx`, `CinematicSections.spec.tsx`, `useHero.spec.tsx`, `useGridOutlineAnimation.spec.tsx`, `cinematic.spec.ts`, `gsap.spec.ts` (no unmount/cleanup assertions for hero tweens) |
| Reduced motion | Checked once per effect via `matchMedia` (`utils/gsap.ts:5-9`); CSS fallbacks (`globals.css:65-69,85-89,538-553,585+`); Lenis skipped | `reduce` read once (`base.js:3`; `home.html:618,756-761`); CSS kills animations/transitions (`home.html:287-292`) | Neither reacts to a mid-session preference change (B-22) | reduced-motion branches covered in Nav/Hero/SmoothScroll/HiringFit/Testimonials specs |
| Canvas | **No `<canvas>`/`getContext` in production** (grep) | 8 canvases across 7 pages: home `#strata`, open-source `#route`, portfolio `#field` + `#sceneCanvas`, writing `#time`, now `#ruler`, principles `#align`, not-found `#route` (grep) — all `aria-hidden`, reduced-motion still frame, IO-gated draw on home/open-source/portfolio/writing, no `<noscript>`/static fallback | Port contract needed (B-23) | n/a |
| Scheduled / draft posts | `isPostPublished` (Toronto calendar day) filters home + footer (`utils/date.ts:19-33`; `utils/posts.ts:163-184`); `/writing` shows future posts as "Upcoming" links (`app/writing/page.tsx:19-23`; `features/writing/WritingIndexPostListItem.tsx:24-54`); `/writing/[slug]` renders any post (`app/writing/[slug]/page.tsx:17-32`); sitemap/feed/llms use unfiltered `getAllPosts()` | Writing index/readers mark future posts "Upcoming"/"Scheduled" (`reader.src.html:153,166`; `writing.src.html:320`) | Inconsistent publish gating (B-24); `force-dynamic` only for date filtering (B-25). No draft flag exists. | `posts.spec.ts:113` (home section excludes future); none for sitemap/feed/llms/article route |
| Analytics consent + link tracking | GA4 via `next/script` `afterInteractive` when `NEXT_PUBLIC_GA_MEASUREMENT_ID` set; Vercel Analytics + Speed Insights when `NODE_ENV=production`; no consent/DNT/GPC (`components/Analytics/*.tsx`; `app/layout.tsx:127-129`); `trackGtagEvent` (`utils/analytics.ts:1-12`) | None (sandbox) | B-26, B-27 | `Gated*.spec.tsx`, `analytics*.spec.ts` (env gating only) |

---

## Validation commands

### Validation commands run (read-only)

| Command | Result |
| --- | --- |
| `pnpm test -- --listTests` | Fails under pnpm 12: the literal `--` is forwarded, so Jest treats `--listTests` as a path pattern ("No tests found, exiting with code 1"). |
| `pnpm exec jest --listTests` | 81 suites listed. **None** for `app/api/contact/route.ts`. |
| `pnpm exec jest components/Contact components/Nav components/RouteChangeFocus components/SmoothScroll components/SkipLink components/NotFoundMainFocus components/TableOfContents components/ReadingProgress components/Analytics components/CinematicSections components/MainReveal app/api utils/__tests__/{hashScroll,scrollToTop,posts,date,analytics,cinematic,gsap,headings,feed} app/__tests__/sitemap utils/hooks` | `Test Suites: 34 passed, 34 total` / `Tests: 176 passed, 176 total` |

---

## Test coverage map

### Test coverage map (relevant suites)

| Area | Suites | Notable gaps |
| --- | --- | --- |
| Contact UI | `components/Contact/__tests__/{Contact,ContactForm,ContactChannelCard,trackContactLinkClick}.spec.*`, `components/Contact/hooks/__tests__/useContactForm.spec.tsx` | focus after submit, live-region persistence |
| Contact API | **none** | everything in B-01..B-04 |
| Webhook | `app/api/webhooks/resend/__tests__/route.spec.ts` (15) | — |
| Nav | `components/Nav/__tests__/Nav.spec.tsx`, `components/Nav/hooks/__tests__/useNav.spec.tsx` (16) | breakpoint reset, Lenis stop, initial scrolled state |
| Focus/scroll | `RouteChangeFocus.spec.tsx`, `SkipLink.spec.tsx`, `NotFoundMainFocus.spec.tsx`, `utils/__tests__/{hashScroll,scrollToTop}.spec.ts`, `SmoothScroll.spec.tsx` (2) | popstate restoration, Lenis cleanup |
| Article | `headings.spec.ts`, `TableOfContents.spec.tsx`, `ReadingProgress.spec.tsx`, `WritingPostPageContent.spec.tsx` | duplicate-suffix collision |
| Motion | `cinematic.spec.ts`, `gsap.spec.ts`, `utils/hooks/__tests__/*`, `useHero.spec.tsx`, `useGridOutlineAnimation.spec.tsx`, `CinematicSections.spec.tsx`, `MainReveal.spec.tsx` | unmount cleanup, no-JS/print visibility |
| Scheduling | `posts.spec.ts:113`, `date.spec.ts`, `feed.spec.ts`, `app/__tests__/sitemap.spec.ts` | future-post exclusion for feed/sitemap/llms/article |
| Analytics | `Gated*.spec.tsx`, `analytics.spec.ts`, `analytics.node.spec.ts` | consent gate (none exists) |
| Lightbox / canvas | none (feature absent in production) | — |

## Findings

| ID | Severity | Status | Finding |
| --- | --- | --- | --- |
| [A-07](#a-07) | High | Risk (verified in artifact source) | Hairline artifact link conventions that break production URLs if copied |
| [B-01](#b-01) | High | Verified failure** (code + grep) | Contact API has no abuse controls (rate limit, honeypot/bot check, size caps, content-type/origin check) |
| [B-02](#b-02) | Medium | Verified failure | Provider error text and deployment guidance are shown to site visitors |
| [B-03](#b-03) | Medium | Verified failure | api/contact` has zero automated tests |
| [B-04](#b-04) | Low | Verified failure | Malformed JSON returns 500 instead of 400 |
| [B-05](#b-05) | Medium | Risk** (code-verified; screen-reader/browser behaviour Untested) | Focus and announcements after submit are fragile |
| [B-06](#b-06) | Low | Risk | Duplicate assertive announcements on failed validation |
| [B-07](#b-07) | Medium | Verified failure** (design/production mismatch) | Artifact form contract differs from production (focus target, field links, persistent status, missing email fallback) |
| [B-08](#b-08) | Info | Verified** (by design) | Artifact preview form must not replace the production pipeline |
| [B-09](#b-09) | Info | Verified** (code + 15 passing tests) | Resend inbound webhook: sound |
| [B-10](#b-10) | Medium | Verified failure** (code; behaviour confirmed by existing spec expectations, browser run Untested) | Browser Back/Forward always jumps to the top of the page |
| [B-11](#b-11) | Low | Verified failure | Back to all case studies" targets an anchor the router deliberately ignores |
| [B-12](#b-12) | Medium | Risk** (absence of handler verified in code; resize/rotation scenario not run in a browser) | Mobile menu state survives a breakpoint change, leaving page inert and scroll-locked |
| [B-13](#b-13) | Low | Untested | Lenis keeps scrolling the page behind the open mobile menu |
| [B-14](#b-14) | Low | Verified failure | Nav "scrolled" style not initialised on mount; non-passive listener |
| [B-15](#b-15) | Low | Risk | Hash targets are scrolled but never focused; retry window is short |
| [B-16](#b-16) | Medium | Verified** (artifact behaviour) / production compliant today | Artifact reader hash routing and TOC contract must not be ported as-is |
| [B-17](#b-17) | Medium | Verified failure** (feature gap) | No screenshot enlarge/lightbox in production; artifact specifies one |
| [B-24](#b-24) | Medium | Verified failure | Future-dated posts are filtered inconsistently across surfaces |
| [B-25](#b-25) | Low | Verified** (code + history) | force-dynamic` used only to evaluate the date; static routes freeze the footer list |
| [B-26](#b-26) | Medium | Risk** (code verified; whether `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in production is **Untested**) | Analytics load without consent; no DNT/GPC handling |
| [B-27](#b-27) | Low | Verified** (grep); GA4 SPA page views **Untested | Link/event tracking is partial and some hooks are inert |
| [B-28](#b-28) | Low | Verified | Case-study navigation parity; breadcrumb list semantics |
| [B-29](#b-29) | Low | Verified** (grep over `docs/design/pages/ | Artifact pages lack production landmarks (skip link, `<main>`, menu) |
| [D-22](#d-22) | Medium | Verified failure | Reader swaps articles in place without focus or announcement |
| [D-28](#d-28) | Low | Risk | Copy button feedback is not announced |

<a id="a-07"></a>

### A-07: Hairline artifact link conventions that break production URLs if copied
- **Severity:** High for the port. **Status:** Risk (verified in artifact source).
- **Every place:**
  1. `docs/design/kit/urls.json:1-18` maps every route, including `"/writing/*"` and `"/404"`, to `https://claude.ai/artifact/<id>`. 413 `claude.ai/artifact` URLs are baked into `docs/design/pages/*.html` (per-file counts: 7 to 81).
  2. `docs/design/kit/build.mjs:36-42` `link()` turns `/writing/<slug>` into `<reader>#<slug>` and everything unmapped into absolute `https://alipajand.com${path}`. Absolute links break Vercel previews and bypass `next/link` client routing.
  3. `build.mjs:44-49` `resolveLinks` rewrites every `href="/…"` and `href="https://alipajand.com/…"` in templates.
  4. `build.mjs:50-51` `linkRuntime` embeds the same map as client JS in every page, so runtime-generated links (case pager, reader "More writing", related links in `kit/case.src.html:271`) also point at claude.ai.
  5. `kit/reader.src.html:193-196` uses hash routing: `history.replaceState(null, "", \`#${slug}\`)` and `hashchange`. The production contract is `/writing/[slug]` (path), with `#` reserved for heading anchors from `utils/headings.ts`. 14 distinct `…/EwmjeKW4abUewm7znxnD6X#<slug>` links exist.
  6. Home anchors: `kit/static/home.html:368` `id="work"` and `:475` `id="open-source"` vs production `#case-studies` and `#open-source-tools`. Portfolio has no `#case-studies` id, but production links to `/portfolio#case-studies` (`components/Projects/ProjectCaseStudyArticle.tsx:183`) and uses it as a JSON-LD `@id` (`components/ProjectCaseStudyJsonLd/ProjectCaseStudyJsonLd.tsx:44`, `app/portfolio/page.tsx:22`).
  7. Case section ids lose the `${project.id}-` prefix, and `ux-decisions` becomes `ux` (`kit/case.src.html:258-271` vs `ProjectCaseStudyArticle.tsx:85-86,128`).
  8. Nav "Contact" is built as `link("/") + "#contact"` (`build.mjs:60-62`). Fine in production as `/#contact`, but only if the id is kept.
  9. Head chrome `build.mjs:55-58`: `<meta name="claude:viewport-fit-sides">` is artifact-only, and the Google Fonts `<link>` tags would add third-party requests. Production uses `next/font` (`app/layout.tsx:2`).
  10. Footer text `alipajand.com · 2026` is hard-coded (`build.mjs:79`).
  11. Artifact `<title>`s are artifact names ("Ali Pajand Home", "Writing Reader"). They must not replace `utils/metadata.ts` titles.
- **Remedy:** Port links as `next/link` with route constants (`data/nav.ts`, `data/footer.ts`). Treat `urls.json`/`link()` as preview-only. Keep production ids (`case-studies`, `${id}-${key}`) or add redirect anchors. Implement the reader as `/writing/[slug]` only.
- **Acceptance:** After the port, `grep -rn "claude.ai\|https://alipajand.com/" app features components data` finds only `CANONICAL_URL` uses. Every in-page `href="#x"` and `/path#x` resolves to an element id; a test walks `NAV_PRIMARY_LINKS`, footer links and `ProjectCaseStudyArticle` links.

<a id="b-01"></a>

### B-01 — Contact API has no abuse controls (rate limit, honeypot/bot check, size caps, content-type/origin check)
- Severity: **High** · Status: **Verified failure** (code + grep)
- Location: `app/api/contact/route.ts:13-26`; `components/Contact/ContactForm.tsx:84-186` (no hidden trap field); repo has no `middleware.ts`/`proxy.ts`.
- Evidence:
  - `grep -rniE "honeypot|rate.?limit|ratelimit|upstash|botid|turnstile|captcha|maxLength" app components utils data features package.json` → only hit is a test string `"rate limited"` in the webhook spec.
  - `route.ts:15-16`: `const body = await request.json(); const { name, email, message } = body;` — no length bounds; `request.json()` parses regardless of `Content-Type`, so a cross-site `text/plain` POST (no CORS preflight) reaches Resend.
- Impact: every accepted POST sends a real email through the Resend key; unbounded `name` lands in the subject and `message` in the body; a scripted flood can exhaust Resend quota and bury real recruiter mail.
- Remedy: (1) add a hidden honeypot field (e.g. `website`, `tabIndex=-1`, `autocomplete="off"`, visually hidden, `aria-hidden`) and return a silent 200 when filled; (2) per-IP rate limit (Vercel Firewall rate-limit rule on `/api/contact`, or Vercel BotID / KV-backed sliding window); (3) cap lengths server-side (e.g. name ≤ 120, email ≤ 254 already, message ≤ 5,000) and mirror `maxLength` client-side; (4) require `Content-Type: application/json` and same-origin `Origin`/`Sec-Fetch-Site`.
- Acceptance criteria: honeypot-filled request → 200 with no `resend.emails.send` call; > N requests/min from one IP → 429 with a user-facing message; oversize fields → 400; `text/plain` or cross-origin POST → 400/403; all covered by a new `app/api/contact/__tests__/route.spec.ts`.

<a id="b-02"></a>

### B-02 — Provider error text and deployment guidance are shown to site visitors
- Severity: **Medium** · Status: **Verified failure**
- Location: `app/api/contact/route.ts:45-52`; surfaced by `components/Contact/hooks/useContactForm.ts:94`.
- Evidence: `route.ts:50` `? "Verify a domain at resend.com/domains and set RESEND_FROM to an email on that domain."` / `route.ts:51` `: error.message;` → client sets `setErrorMessage(body.error ?? CONTACT_FORM_ERROR_GENERIC)`.
- Impact: a recruiter can see infrastructure instructions or raw Resend errors in the form; also leaks configuration state. Same for `503 "Email service is not configured"` (`route.ts:30`).
- Remedy: log provider details server-side (`console.error` with a request id) and return a stable `{ error: "send_failed" }` code; map codes to `data/contactForm.ts` copy on the client, always offering the mailto fallback.
- Acceptance criteria: no response body ever contains `resend`, `RESEND_`, or provider `error.message`; UI shows `CONTACT_FORM_ERROR_GENERIC` (or a specific approved string) plus the email link; test asserts the mapping.

<a id="b-03"></a>

### B-03 — `/api/contact` has zero automated tests
- Severity: **Medium** · Status: **Verified failure**
- Location: `app/api/contact/route.ts` (59 lines); test list from `pnpm exec jest --listTests`.
- Evidence: listTests contains `app/api/webhooks/resend/__tests__/route.spec.ts` but nothing under `app/api/contact`.
- Remedy: add a route spec mirroring the webhook spec style (mock `utils/resend`).
- Acceptance criteria: cases for each 400 branch, invalid JSON, 503 unconfigured, Resend error mapping (B-02), success payload shape (`replyTo`, escaped HTML), and B-01 controls.

<a id="b-04"></a>

### B-04 — Malformed JSON returns 500 instead of 400
- Severity: **Low** · Status: **Verified failure**
- Location: `app/api/contact/route.ts:15,56-57`.
- Evidence: `catch { return NextResponse.json({ error: "Failed to send message" }, { status: 500 }); }` wraps `request.json()`.
- Remedy: parse in its own try/catch and return 400; keep 500 for unexpected send failures.
- Acceptance criteria: `POST` with body `"{"` → 400; monitoring no longer counts client garbage as server errors.

<a id="b-05"></a>

### B-05 — Focus and announcements after submit are fragile
- Severity: **Medium** · Status: **Risk** (code-verified; screen-reader/browser behaviour Untested)
- Location: `components/Contact/ContactForm.tsx:89,122,160,178,209` (`disabled={isSubmitting}` on every control incl. the focused submit button); `ContactForm.tsx:197-206` (success/error live regions mounted only when status changes); `useContactForm.ts:98-100` (`form.reset` on success, no focus management).
- Evidence: `ContactForm.tsx:209` `disabled={isSubmitting}` on the button that has focus at submit time; `ContactForm.tsx:197-198` `{status === "success" && (<p ... role="status" aria-live="polite">`.
- Impact: disabling the focused button drops focus to `<body>` in Chromium; a live region inserted together with its text is not reliably announced (notably VoiceOver/NVDA with `role=status`). Keyboard and SR users may not learn the outcome.
- Remedy: keep one always-mounted status container (`role="status"`/`aria-live="polite"`, plus a separate always-mounted `role="alert"` for errors) and change its text; use `aria-disabled` + guarded handler instead of `disabled` on the submit button, or move focus to the status/heading after completion.
- Acceptance criteria: after success and after error, `document.activeElement` is a deliberate target (status region with `tabIndex=-1` or the form heading); live containers exist in the DOM before submit; test asserts focus target and text change; manual VoiceOver + NVDA check recorded.

<a id="b-06"></a>

### B-06 — Duplicate assertive announcements on failed validation
- Severity: **Low** · Status: **Risk**
- Location: `ContactForm.tsx:59-65` (summary `role="alert" aria-live="assertive"`), `ContactForm.tsx:98-105,137-144,187-194` (each field error `role="alert"`).
- Evidence: up to four `role="alert"` nodes mount in one render on submit.
- Remedy: keep `role="alert"` on the summary only; field errors become plain text referenced by `aria-describedby` (already wired at `:94-96,133-135,183-185`).
- Acceptance criteria: one alert region per failed submit; on-blur errors still reachable via `aria-describedby`.

<a id="b-07"></a>

### B-07 — Artifact form contract differs from production (focus target, field links, persistent status, missing email fallback)
- Severity: **Medium** · Status: **Verified failure** (design/production mismatch)
- Location: artifact `docs/design/kit/static/home.html:566` (summary), `:593` (persistent `role="status"`), `:641-646` (summary links, focus first invalid field), `:599-605` (direct links: Calendly, LinkedIn, GitHub — no email); production `ContactForm.tsx:59-74`, `useContactForm.ts:74-77`, `data/links.ts:2`, `data/contactForm.ts:31`.
- Evidence: artifact `summary.innerHTML = ... <li><a href="#${x.id}">${x.msg}</a></li> ...` then `document.getElementById(errors[0].id).focus();`; production `errorSummaryRef.current?.focus();`. Production network error copy: `"Failed to send. Please try again or email directly."`.
- Remedy: decide one contract and record it. Recommended: production keeps focusing the summary (GOV.UK pattern) **and** adopts the artifact's per-error links; adopt the artifact's always-mounted status line (fixes B-05); keep an Email/mailto direct link in the redesigned contact block or change the error copy.
- Acceptance criteria: summary items are links that focus the field; summary receives focus on failed submit; status container persistent; error copy only references channels that are visible on the page.

<a id="b-08"></a>

### B-08 — Artifact preview form must not replace the production pipeline
- Severity: **Info** · Status: **Verified** (by design)
- Location: `home.html:629-650` (`e.preventDefault()`, "Nothing was sent: this preview isn't connected"); production `useContactForm.ts:78-106` (`fetch("/api/contact")`, `trackGtagEvent("contact_form_submit", { outcome })`), `ContactForm.tsx:57,211` (`data-analytics-*`).
- Remedy: port only markup/styling; keep `useContactForm`, `/api/contact`, Resend env vars (`RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_EMAIL`, `RESEND_WEBHOOK_SECRET`; `.env.example:1-24`), loading/disabled/success/error states and analytics events.
- Acceptance criteria: existing `useContactForm.spec.tsx` and `ContactForm.spec.tsx` pass unchanged after the visual port (ids may change only with spec updates).

<a id="b-09"></a>

### B-09 — Resend inbound webhook: sound
- Severity: **Info** · Status: **Verified** (code + 15 passing tests)
- Location: `app/api/webhooks/resend/route.ts:26-107`.
- Evidence: signature via `resend.webhooks.verify({ payload, headers: { id, timestamp, signature }, webhookSecret })` on the raw text body (`:33-48`); non-`email.received` → 200 `{ ignored }` (`:50-52`); recipient domain check incl. lookalikes (`:8-17,54-59`); `idempotencyKey: inbound-forward/${emailId}` (`:99`); transient failures → 500 so Resend retries.
- Note: forwarded inbound HTML is sender-controlled (expected for a forwarder). No action needed for the redesign.

<a id="b-10"></a>

### B-10 — Browser Back/Forward always jumps to the top of the page
- Severity: **Medium** · Status: **Verified failure** (code; behaviour confirmed by existing spec expectations, browser run Untested)
- Location: `components/RouteChangeFocus/RouteChangeFocus.tsx:13-18,20-47`.
- Evidence: `:16` `window.history.scrollRestoration = "manual";` and `:29-30` `const handleRouteScroll = () => { scrollToTop();` runs for every pathname change with no push-vs-popstate distinction.
- Impact: a recruiter who opens a case study from deep in `/portfolio` or `/writing` and presses Back loses their place; reload also no longer restores position.
- Remedy: track navigation type (listen for `popstate` and set a flag before the pathname effect runs); on traversal, restore a stored `scrollY` per history entry (e.g. keyed by `history.state.__NA`/a session key in `sessionStorage`) via Lenis `scrollTo(y, { immediate: true })`; only scroll to top on push navigations; leave `scrollRestoration` `auto` or implement the manual restore fully.
- Acceptance criteria: push nav → top + main focused; Back/Forward → previous scroll offset within ±1 viewport-row after content renders; spec covers a popstate case.

<a id="b-11"></a>

### B-11 — "Back to all case studies" targets an anchor the router deliberately ignores
- Severity: **Low** · Status: **Verified failure**
- Location: `components/Projects/ProjectCaseStudyArticle.tsx:183`; `components/RouteChangeFocus/RouteChangeFocus.tsx:27,33,55`; target exists at `components/Projects/ProjectIndex.tsx:56`.
- Evidence: link `href={isDedicatedPage ? "/portfolio#case-studies" : "#case-studies"}`; router `if (hash && !isPortfolioIndex) {` (introduced in `8624118` "disable portfolio hash scrolling").
- Remedy: either point the link at `/portfolio` (matching current behaviour) or remove the `/portfolio` exception and let `#case-studies` scroll; pick one and test it.
- Acceptance criteria: link destination and landing scroll position agree; a spec asserts it.

<a id="b-12"></a>

### B-12 — Mobile menu state survives a breakpoint change, leaving page inert and scroll-locked
- Severity: **Medium** · Status: **Risk** (absence of handler verified in code; resize/rotation scenario not run in a browser)
- Location: `components/Nav/hooks/useNav.ts:57-83` (body `overflow:hidden`, `inert` on `#main-content` and `footer`); `components/Nav/Nav.tsx:61` (toggle is `md:hidden`), `:93` (panel `md:hidden`).
- Evidence: no `matchMedia("(min-width: 768px)")`/`resize` listener in `useNav.ts`; `useNav.spec.tsx` has no resize case.
- Impact: open the menu at < 768 px, rotate a tablet or widen the window → menu and its button disappear while `main` stays `inert` and the page cannot scroll; only Escape recovers.
- Remedy: subscribe to `matchMedia("(min-width: 768px)")` change and call `handleCloseMenu()` when it matches.
- Acceptance criteria: with menu open, crossing 768 px closes it, removes `inert`, restores `body.style.overflow`; spec covers it.

<a id="b-13"></a>

### B-13 — Lenis keeps scrolling the page behind the open mobile menu
- Severity: **Low** · Status: **Untested**
- Location: `components/SmoothScroll/SmoothScroll.tsx:16-20` (no `autoToggle`, no `stop()` API exposed); `useNav.ts:58-59` (only `document.body.style.overflow = "hidden"`); Lenis 1.3.26 defaults `autoToggle = false` (`node_modules/.pnpm/lenis@1.3.26_react@19.3.1/node_modules/lenis/dist/lenis.mjs:434`).
- Evidence: Lenis prevents wheel events and calls programmatic scroll, which `overflow:hidden` does not block.
- Remedy: export a `stopLenis/startLenis` from `utils/scrollToTop.ts` registry and call it from `useNav` when the menu toggles (or construct Lenis with `autoToggle: true` and lock via `html` overflow).
- Acceptance criteria: wheel/trackpad over a narrow desktop window with menu open does not move `window.scrollY`.

<a id="b-14"></a>

### B-14 — Nav "scrolled" style not initialised on mount; non-passive listener
- Severity: **Low** · Status: **Verified failure**
- Location: `components/Nav/hooks/useNav.ts:51-55`.
- Evidence: `const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD); window.addEventListener("scroll", onScroll);` — never invoked on mount, no `{ passive: true }`.
- Impact: on a deep link like `/#contact`, the browser scrolls before hydration, so the transparent header overlaps content until the user scrolls.
- Remedy: call `onScroll()` once in the effect and pass `{ passive: true }`.
- Acceptance criteria: mounting with `scrollY > 48` renders the bordered/solid header immediately; spec covers it.

<a id="b-15"></a>

### B-15 — Hash targets are scrolled but never focused; retry window is short
- Severity: **Low** · Status: **Risk**
- Location: `utils/hashScroll.ts:14-29`; `RouteChangeFocus.tsx:33-35,52-57`.
- Evidence: `target.scrollIntoView({ block: "start" }); return;` — no focus; 30-frame retry (`DEFAULT_MAX_ATTEMPTS = 30`, `:1`) ≈ 0.5 s at 60 Hz.
- Remedy: after scrolling, set `tabIndex=-1` if needed and `focus({ preventScroll: true })` (as `useActiveHeading.ts:56-57` already does for TOC clicks); make the retry time-based (e.g. 2 s).
- Acceptance criteria: navigating to `/#contact` leaves focus on the contact section; keyboard Tab continues from there.

<a id="b-16"></a>

### B-16 — Artifact reader hash routing and TOC contract must not be ported as-is
- Severity: **Medium** · Status: **Verified** (artifact behaviour) / production compliant today
- Location: artifact `docs/design/kit/reader.src.html:159-196` (`history.replaceState(null, "", \`#${slug}\`); show(slug);`, content injected with `innerHTML`), `:176` (TOC `href="#${post.slug}" data-to="${h.id}"`), `:190` (scroll only, no focus/`aria-current`), `build.mjs:163` (`headings.filter((h) => h.level === 2)`); production `app/writing/[slug]/page.tsx:17-53`, `utils/headings.ts:7,56-71`, `components/TableOfContents/hooks/useActiveHeading.ts:46-58`.
- Evidence: heading ids are generated by the same function in both (`build.mjs:30` imports `utils/headings.ts`), so anchors are interchangeable. In the reader, switching posts uses `replaceState`, so Back leaves the reader instead of returning to the previous post, and copying a TOC link yields the post hash, not the heading.
- Remedy: keep one SSR route per article; port only the reader's visual layout (progress per TOC item, numbering). Keep production TOC semantics: `href="#<heading-id>"`, `aria-current="location"`, focus on activation, h2+h3 depth (or make the h2-only decision explicit).
- Acceptance criteria: every article reachable at `/writing/<slug>` with full SSR HTML; TOC links are real heading fragments; Back from article B (reached from A) returns to A.
- Related Low risk: duplicate-suffix ids (`utils/headings.ts:65`, `base-2`) can collide with a natural heading slug like "Step 2" → `step-2`. Remedy: loop until unused id; test it.

<a id="b-17"></a>

### B-17 — No screenshot enlarge/lightbox in production; artifact specifies one
- Severity: **Medium** · Status: **Verified failure** (feature gap)
- Location: production `components/Projects/ProjectFigure.tsx:16-23` (`<Image … loading="eager" className="h-auto w-full" />`); artifact `docs/design/kit/case.src.html:209-212,231,291-301`.
- Evidence: `grep -rliE "dialog|lightbox|showModal" components features` → no files. Artifact: `<button type="button" data-shot="${i}" aria-label="Enlarge: …">` and `lb.showModal();`.
- Impact: 1728 px-wide dashboard screenshots are unreadable on phones; also every figure is eager-loaded.
- Remedy: small client component using native `<dialog>` + `showModal()`; trigger is a `<button>` wrapping the image; Close button autofocused; Esc + backdrop close; focus returns to trigger; `alt` copied; image scrollable inside dialog; keep `next/image` for the inline figure with `loading="lazy"` after the first figure; no-JS fallback = wrap image in a link to the full-size asset.
- Acceptance criteria: keyboard open/close, focus restore to trigger, `aria-label` on dialog, body not scrollable while open (Lenis stopped), reduced-motion has no zoom animation; RTL spec for open/close/focus.

<a id="b-24"></a>

### B-24 — Future-dated posts are filtered inconsistently across surfaces
- Severity: **Medium** · Status: **Verified failure**
- Location: `app/writing/[slug]/page.tsx:17-32` (renders any post; `generateStaticParams` includes all); `app/sitemap.ts:8-14`; `app/feed.xml/route.ts:4,7`; `app/llms.txt/route.ts` and `app/llms-full.txt/route.ts` (`getAllPosts()`); vs `utils/posts.ts:163-184` (home/footer use `getPublishedPosts`) and `app/writing/page.tsx:19-23` ("Upcoming").
- Evidence: `content/posts/preparing-integrations-for-anthropic-and-cursor-directories.md:3` `date: "2026-10-28"` (audit date 2026-10-27). `feed.xml/route.ts:7` `buildRssFeed(getAllPosts())` with `dynamic = "force-static"` → included at build time with a future `pubDate`; sitemap lists it; article page has no scheduled marker and default `index: true` robots with `publishedTime` in the future.
- Impact: RSS readers, crawlers and answer engines receive "published" posts before their date, while the homepage hides them; contradictory publish state.
- Remedy: define one rule: `getPublishedPosts()` for feed, sitemap, llms, OG and article JSON-LD; for "preview" access keep the article route but render a visible "Scheduled for <date>" notice and `robots: { index: false }` until published; consider `draft: true` frontmatter for unlisted work.
- Acceptance criteria: with `now` mocked before a post's date, the post is absent from `/feed.xml`, `/sitemap.xml`, `/llms*.txt`, home and footer; `/writing/<slug>` returns 200 with noindex + scheduled notice (or 404 if that is the chosen rule); tests cover each surface.

<a id="b-25"></a>

### B-25 — `force-dynamic` used only to evaluate the date; static routes freeze the footer list
- Severity: **Low** · Status: **Verified** (code + history)
- Location: `app/page.tsx:8`, `app/writing/page.tsx:14` (added in `988004c` "Schedule homepage writing…"); `app/layout.tsx:101` computes footer posts in the root layout, which is prerendered for static routes.
- Impact: every home and `/writing` request is server-rendered; footer "latest writing" differs between dynamic routes (current) and static ones (as of last build) after a scheduled date passes.
- Remedy: replace with `export const revalidate = 3600` (or a daily on-demand revalidation) on home, `/writing`, feed, sitemap and the layout data, so scheduled posts appear within the window everywhere.
- Acceptance criteria: build output marks `/` and `/writing` as ISR; footer and home agree within one revalidation window after a post's date.

<a id="b-26"></a>

### B-26 — Analytics load without consent; no DNT/GPC handling
- Severity: **Medium** · Status: **Risk** (code verified; whether `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in production is **Untested**)
- Location: `components/Analytics/GatedGoogleAnalytics.tsx:5-30`; `GatedVercelAnalytics.tsx:6-10`; `GatedVercelSpeedInsights.tsx:6-10`; mounted in `app/layout.tsx:127-129`.
- Evidence: "Gated" means env-gated only: `if (!GA_ID) { return null; }` / `if (process.env.NODE_ENV !== "production") { return null; }`; `grep -rniE "consent|doNotTrack|globalPrivacyControl|cookie" components app utils data` → no hits; no privacy page.
- Impact: when GA is configured, GA4 cookies are set on first load for every visitor. The site is Montreal-based; consent expectations (e.g. Quebec Law 25, GDPR for EU visitors) should be reviewed by the owner — this audit does not give legal advice. Vercel Web Analytics is cookieless.
- Remedy: either drop GA and rely on Vercel Analytics (cookieless), or load GA only after an explicit opt-in (Consent Mode v2 defaults `denied`), honour `navigator.globalPrivacyControl`, and publish a short privacy note.
- Acceptance criteria: with no stored consent, no request to `googletagmanager.com` and no `_ga` cookie; GPC=1 → GA never loads; spec covers the gate.

<a id="b-27"></a>

### B-27 — Link/event tracking is partial and some hooks are inert
- Severity: **Low** · Status: **Verified** (grep); GA4 SPA page views **Untested**
- Location: `data-analytics-event`/`data-analytics-form` attributes at `components/Contact/ContactForm.tsx:57,211`, `components/Contact/ContactChannelCard.tsx:34`, `features/portfolio/PortfolioProfileLinks.tsx:30` — no code reads them (grep for consumers returns only the attributes). Only contact/profile link clicks and form outcomes call `trackGtagEvent` (`utils/analytics.ts:1-12`). GA config sends one `page_view` with UA-era `page_path` (`GatedGoogleAnalytics.tsx:25-28`); App Router client navigations do not re-send unless GA4 "page changes based on browser history events" is enabled in the property.
- Remedy: remove the inert attributes or add a single delegated click listener; track outbound links (case-study repos, open-source tools) via one helper; for Vercel Analytics use `track()` for the same events; verify GA4 enhanced measurement or send `page_view` on pathname change.
- Acceptance criteria: one documented event list; every listed event fires once per action in a test; route changes produce exactly one page view.

<a id="b-28"></a>

### B-28 — Case-study navigation parity; breadcrumb list semantics
- Severity: **Low** · Status: **Verified**
- Location: production `utils/projects.ts:23-28` (next only, none after last), `components/Projects/ProjectCaseStudyArticle.tsx:169-188`; artifact `build.mjs:232-240`, `case.src.html:202-204,288`. Breadcrumbs `components/Breadcrumbs/Breadcrumbs.tsx:19-23`.
- Evidence: ordering source is the same `PORTFOLIO_CASE_STUDY_ORDER` (`data/projects.ts:104-112`) in both. Breadcrumb separators are `<li aria-hidden="true">/</li>` inside the `<ol>`, inflating the announced item count.
- Remedy: render separators with CSS (`li + li::before`) or inside the item `span[aria-hidden]`; optional "Previous" link is a product decision, not a gap.
- Acceptance criteria: SR announces "list, 3 items" for Home / Portfolio / <Case>.

<a id="b-29"></a>

### B-29 — Artifact pages lack production landmarks (skip link, `<main>`, menu)
- Severity: **Low** · Status: **Verified** (grep over `docs/design/pages/*.html`: `<main>` present only in `not-found.html`; no skip links — the "skip" text matches are prose such as "skipped tests")
- Location: e.g. `docs/design/kit/static/home.html:303-318` (header/nav, no skip link, no `<main>`).
- Remedy: when porting, keep `SkipLink`, `MainReveal`'s `<main id="main-content" tabIndex={-1}>`, `RouteChangeFocus`, and either the existing disclosure menu or an always-visible wrapped row that meets 44 px targets; artifact nav omits "Principles" (`build.mjs:60`) — confirm IA before removing it from production nav (`data/nav.ts`).
- Acceptance criteria: each route has exactly one `<main id="main-content">`, a working skip link, and an accessible primary nav at 320 px.

<a id="d-22"></a>

### D-22 Reader swaps articles in place without focus or announcement
- Severity: Medium. Status: Verified failure.
- Where: reader.src.html:160-184 (`show()` replaces title, prose and TOC, scrolls to top), :187-195 (intercepts links, `history.replaceState`).
- Evidence: no focus move to the new `h1`, no live announcement; `replaceState` means Back does not return to the previous article. TOC links use `href="#slug"` with `data-to` and `scrollIntoView` (:190), which does not move focus to the heading.
- Remedy: in Next, each post is its own route (already the case in production); keep production's RouteChangeFocus; TOC links should be real `#heading-id` anchors so focus/scroll follow natively.
- Acceptance: navigating between posts moves focus to the post title and is announced; Back returns to the previous post.

<a id="d-28"></a>

### D-28 Copy button feedback is not announced
- Severity: Low. Status: Risk.
- Where: open-source.html:639-648.
- Evidence: the button text changes to "Copied"/"Selected" for 1.6 s; changing a focused button's text is not reliably announced; the timeout is not cleared on repeated clicks.
- Remedy: add a polite live region ("Command copied") and clear the previous timeout.
- Acceptance: VoiceOver/NVDA announce the copy result once per click.
