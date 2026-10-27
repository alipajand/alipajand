# Motion and performance

> Audit of the Pajand Hairline design artifacts against the Next.js application.
> Frozen revision: `b8856fec6703f6213d5b6e4ac42a9c0f86b3f375` (PR #223 head, branch `ali/nostalgic-blackwell-0b3838`). The brief expected `6e0ffc8`; the head had advanced by three commits (`d6dc60a`, `89a649f`, `b8856fe`), all inside `docs/design/`.
> Application baseline: the same revision. Next.js 16.4.2, React 19.3.1 installed. `origin/main` is 6 commits ahead of the merge base `6f43749` (PR #222 and dependency bumps; see M-05).
> Every finding states a severity (Critical, High, Medium, Low, Info) and a status: **Verified failure** (reproduced from code, build output or capture), **Risk** (pattern confirmed, impact not reproduced) or **Untested** (could not be checked read-only).

Motion scheduling, reduced-motion behaviour, cleanup and measured performance for both the production app and the artifact code. The capture method and raw numbers are in [`captures/measurements.md`](captures/measurements.md). Timings come from a local `next start`, so treat them as relative, not as field data.

### Measured (1440 px, local production build)

| Signal | Production | Artifacts |
| --- | --- | --- |
| Client script, uncompressed | 689–780 KB per route | inline only; page totals 149–781 KB including embedded images |
| LCP, motion on | 32–2104 ms; four case studies 552–2104 ms | 32–144 ms |
| LCP, reduced motion | 32–80 ms | 28–128 ms |
| CLS, motion on | 0.000–0.002 | up to 0.197 |
| CLS, reduced motion | 0.000 | up to 0.621 (writing reader) |
| Hidden first-viewport text at 1.8 s | 1–2 elements on several routes | none |

## Findings

| ID | Severity | Status | Finding |
| --- | --- | --- | --- |
| [M-01](#m-01) | Medium | Verified failure (local production build, capture run) | Entrance motion delays Largest Contentful Paint on case studies |
| [M-02](#m-02) | Medium | Verified failure (artifact capture) | Artifact pages shift layout after first paint |
| [M-03](#m-03) | Medium | Verified (local production build) | Every route ships 579–780 KB of client JavaScript |
| [M-04](#m-04) | Info | Verified (capture with JavaScript disabled) | Production pages stay readable without JavaScript |
| [D-01](#d-01) | High | Verified failure (by code) | Unbounded per-frame loops that never stop or yield |
| [D-02](#d-02) | Medium | Risk (pattern verified by code; frame cost untested) | Layout thrash inside the frame loop (interleaved reads and writes, per-frame DOM queries) |
| [D-03](#d-03) | Medium | Verified failure | Reduced-motion preference read once, never updated |
| [D-04](#d-04) | Medium | Verified failure | Reduced motion also removes non-motion state (active section, progress, highlights) |
| [D-05](#d-05) | Medium | Verified failure (by code; visual result Untested) | Flow step labels are not fitted under reduced motion (contradicts the brand book) |
| [D-06](#d-06) | High | Verified failure (by code) | Auto-moving and blinking content with no pause control (WCAG 2.2.2) |
| [D-07](#d-07) | Medium | Risk (CLS untested) | Post-paint title fitting (fit.js): layout shift, font-swap dependence, unthrottled resize, permanent observers |
| [D-11](#d-11) | Medium | Risk (mobile behaviour Untested) | Tall sticky scroll scenes: 100vh on mobile, blank canvases before JS |
| [D-17](#d-17) | Low | Verified failure | Permanent `will-change: transform` |
| [D-18](#d-18) | Low | Verified failure | Frame-rate-dependent motion |
| [D-19](#d-19) | Medium | Risk | Missing cleanup (listeners, observers, timers) |
| [B-18](#b-18) | High | Risk** (code-verified; failure scenario not reproduced) | Hero and every cinematic section are hidden by CSS before JS runs |
| [B-19](#b-19) | Medium | Verified failure** (code) | GSAP work is not torn down on unmount; DOM mutated under React |
| [B-20](#b-20) | Low | Verified** (code); perf impact Untested | Permanent `will-change` on every split word and stage; full-stage blur filters |
| [B-21](#b-21) | Low | Untested | Hero parallax overwrites the intro fade |
| [B-22](#b-22) | Low | Verified** (code) | Reduced-motion preference is read once (production and artifact) |
| [B-23](#b-23) | Info | Verified** (artifact code) | Artifact canvases need an explicit production port contract |

<a id="m-01"></a>

### M-01: Entrance motion delays Largest Contentful Paint on case studies
- **Severity:** Medium. **Status:** Verified failure (local production build, capture run).
- **Paths:** `app/globals.css:71-79,532-536` (content hidden under `html.js` until animated, see B-18); `components/CinematicSections/hooks/useCinematicSections.ts`.
- **Evidence:** `next start` of the frozen revision, Chromium, 1440×900, cold context, LCP from `PerformanceObserver` (`captures/measurements.md`). Motion on vs reduced motion: `/portfolio/alwaysgeeky` 2104 ms vs 72 ms; `/portfolio/mapbylaw` 1324 vs 36; `/portfolio/ledgerguard` 696 vs 48; `/portfolio/tallyfolio` 552 vs 60. At 1.8 s after load, 8 of 16 routes still had 1–2 first-viewport text elements at computed `opacity: 0` (2 on `/`, `/open-source` and `/writing/agent-instructions-are-code`).
- **Remedy:** Never hide LCP candidates behind JavaScript. Animate from a visible state, or use `@starting-style` and CSS transitions that do not gate paint. See Q-02f.
- **Acceptance:** With motion enabled, LCP on every route is within 200 ms of the reduced-motion LCP in the same run, and no first-viewport text has `opacity: 0` 500 ms after `load`.

<a id="m-02"></a>

### M-02: Artifact pages shift layout after first paint
- **Severity:** Medium (for the port). **Status:** Verified failure (artifact capture).
- **Paths:** `docs/design/kit/fit.js`, `docs/design/kit/reader.src.html` (see D-07).
- **Evidence:** CLS from `PerformanceObserver` in the capture run (`captures/measurements.md`): `case-alwaysgeeky` 0.197, `case-agent-tooling` 0.146, `case-emplifi` 0.084 at 1440 px with motion on; the writing reader reached 0.621 with reduced motion. Production routes measured 0.000–0.005.
- **Remedy:** Do not port post-paint fitting or client-rendered article bodies. Size titles with CSS (`clamp()`/`cqi`) or at build time, and render articles on the server (08, "Titles inside the page without fit.js").
- **Acceptance:** Ported routes keep CLS below 0.05 at 1440 and 390 px, with and without reduced motion.

<a id="m-03"></a>

### M-03: Every route ships 579–780 KB of client JavaScript
- **Severity:** Medium. **Status:** Verified (local production build).
- **Paths:** all `features/*/…PageContent.tsx` carry `"use client"`, and so do 57 files in total (`grep -rln '"use client"' app components features utils`).
- **Evidence:** Uncompressed script bytes per route, from the capture run: `/` 780 KB, case studies 728 KB, `/writing` 737 KB, `/engineering-principles` 766 KB, `/open-source` 689 KB at 1440 px (579–738 KB at 390 px). Transfer size after compression was not measured (`next start` locally).
- **Remedy:** Make page shells and sections Server Components; keep client islands small (08, "Rendering boundaries").
- **Acceptance:** No `…PageContent.tsx` is a client component, and uncompressed script bytes on a case study fall at least 30% below 728 KB in the same capture method.

<a id="m-04"></a>

### M-04: Production pages stay readable without JavaScript
- **Severity:** Info. **Status:** Verified (capture with JavaScript disabled).
- **Evidence:** All 16 sampled routes rendered their `<h1>` and body copy with JavaScript disabled, and no first-viewport text was hidden. Captures: `captures/home-1440-prod-nojs.jpg`, `captures/case-ledgerguard-1440-prod-nojs.jpg`, `captures/open-source-1440-prod-nojs.jpg`. The artifacts render key headings and lists with JavaScript (A-08, D-10), so this is a property the port must keep.
- **Acceptance:** The same no-JS capture after each route port shows all copy.

<a id="d-01"></a>

### D-01 Unbounded per-frame loops that never stop or yield
- Severity: High. Status: Verified failure (by code).
- Where: kit/base.js:16-53 (`runPortal`: `requestAnimationFrame(frame)` re-queued unconditionally at :50, never cancelled, no scroll/idle condition); static/home.html:774-812; portfolio.html:789-830; open-source.html:881-931. Used by case.src.html:319, post.src.html:295, reader.src.html:199, writing.src.html:340, principles.src.html:253, now.src.html:158, not-found.src.html:100.
- Evidence: every page polls `scrollY` and recomputes transforms, class toggles and canvas draws 60–120 times per second for as long as the tab is foreground, including when the user is not scrolling and the animated elements are off-screen. Only the hero canvases are gated by IntersectionObserver (home.html:772, portfolio.html:786, open-source.html:878, writing.src.html:339, principles.src.html:252); tickers, display word, chevrons, rail, diagrams, capability rows, badges and activity weeks run regardless. The 404 and Now canvases redraw every frame even when nothing changes (not-found.src.html:100, now.src.html:158-161). Browsers pause rAF in background tabs, so the hidden-tab case is mitigated natively; the off-screen and idle cases are not.
- Remedy (React/Next): one shared client scheduler, modelled on production's `onScrollFrame` (utils/cinematic.ts:81-105): schedule a single rAF on `scroll`/`resize`/pointer events only, run subscribers, stop. Each island subscribes in `useEffect` and unsubscribes on unmount; continuous animations (ticker drift, canvas idle motion) run only while their element intersects (IntersectionObserver) and `document.visibilityState === "visible"`. Prefer CSS where possible: `animation-timeline: scroll()` for progress bars, `view()` for chevrons and lighting, CSS keyframes for the marquee.
- Acceptance: DevTools Performance recording of 5 s idle (no input) on each page shows zero rAF callbacks from page code (CSS animations excepted); scrolling then stopping returns to zero within one frame; navigating away (client route change) leaves no running callbacks (verify with a rAF counter in tests or the Performance panel).

<a id="d-02"></a>

### D-02 Layout thrash inside the frame loop (interleaved reads and writes, per-frame DOM queries)
- Severity: Medium. Status: Risk (pattern verified by code; frame cost untested).
- Where: base.js:26-48 (writes `--p` at :27, then reads `scrollWidth` per track at :29 and writes transform at :33; then `getComputedStyle(name)`, `offsetWidth`×2, `getBoundingClientRect` at :37-38 after those writes; then `chevBand.getBoundingClientRect()` at :45 after transform writes); diagrams.js:54-68 (`querySelectorAll` ×3 every frame, `getBoundingClientRect` per diagram, class writes in between, plus `fitFlowLabels` key check per flow at :55); case.src.html:328-339 (`getBoundingClientRect` per section every frame, plus `secs[0]`, `secs[last]`, band); home.html:780-807 (same pattern, plus per-cap `getBoundingClientRect` at :804); open-source.html:887-923 (per project, badges box, activity box); portfolio.html:582-583 (`copyEl.offsetWidth/offsetHeight` inside the canvas draw after style writes); principles.src.html:255 (`getComputedStyle(display)` called twice per frame inside `free()`); reader.src.html:200-205 (two `getBoundingClientRect` per heading per frame).
- Evidence: a style write (custom property or transform) followed by a geometry read in the same frame forces synchronous style recalculation and, for `offsetWidth`/`scrollWidth`/`getBoundingClientRect`, layout. This repeats several times per frame, every frame (D-01).
- Remedy: measure once and cache with ResizeObserver (ticker half-width, display word free space, section offsets relative to the document), recompute on resize/font load only; use IntersectionObserver (with `rootMargin` thresholds like `-30% 0 -70% 0`) for "which section is active"; in any remaining frame handler, do all reads first then all writes; never `querySelectorAll` inside a frame.
- Acceptance: Performance panel shows no "Forced reflow" warnings attributed to page scripts during a scroll from top to bottom; scripting time per frame during continuous scroll stays under 2 ms on a mid-range laptop at 4× CPU throttle on the case study page.

<a id="d-03"></a>

### D-03 Reduced-motion preference read once, never updated
- Severity: Medium. Status: Verified failure.
- Where: base.js:3; home.html:618; portfolio.html:531; open-source.html:695.
- Evidence: `const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches` is evaluated at load; no `change` listener. Toggling the OS setting while the page is open leaves the JS loops running (CSS stops transitions via the media query, but JS-driven transforms, ticker translation and canvas animation continue). Production has the same pattern (`prefersReducedMotion()` utils/gsap.ts:5-9).
- Remedy: a `useReducedMotion()` hook built on `useSyncExternalStore` subscribed to `matchMedia(...).addEventListener("change")`, default `true` on the server render so SSR output is the still state; islands tear down/start loops when it flips.
- Acceptance: with the page open, enabling "Reduce motion" in OS settings stops tickers, display-word movement and canvas animation within one second without reload; disabling it restarts them.

<a id="d-04"></a>

### D-04 Reduced motion also removes non-motion state (active section, progress, highlights)
- Severity: Medium. Status: Verified failure.
- Where: case.src.html:303-306 (returns before rail/progress code at 308-342); post.src.html:294 (TOC `.on` never set); reader.src.html:198 (TOC `.on` and per-item progress never set); principles.src.html:239-245 (index `.on` never set); open-source.html:858-864 (index `.on`, project `.on` never set); all pages: nav progress `--p` never updated.
- Evidence: the chapter rail, article contents and index never indicate the current section and the progress lines stay at `scaleX(0)` for reduced-motion users. These are wayfinding states, not motion. ds/README.md:52 says "nothing depends on scrolling to be read", but the current-location affordance is lost.
- Remedy: separate "state" from "motion": active-section tracking (IntersectionObserver) and progress values run for everyone; reduced motion only removes transitions, smooth scrolling, transforms and continuous animation.
- Acceptance: with reduced motion on, scrolling a case study updates the rail's active item (with `aria-current="location"`) and the progress line jumps (no transition) to the right value.

<a id="d-05"></a>

### D-05 Flow step labels are not fitted under reduced motion (contradicts the brand book)
- Severity: Medium. Status: Verified failure (by code; visual result Untested).
- Where: diagrams.js:37-51 (`fitFlowLabels`) is only called from `lightDiagrams` (diagrams.js:55), which only runs inside `runPortal` (case.src.html:341; reader.src.html:207). Reduced motion returns before either (case.src.html:303-306; reader.src.html:198). fit.js:5 `TITLES` does not include `.flow li b`. ds/README.md:29 claims fit.js "shrinks … flow steps".
- Evidence: under reduced motion, long single-word labels (the code comment names "READINESS", diagrams.js:32) fall back to `overflow-wrap: break-word` (diagrams.css:37) and break mid-word in the 5-column layout. The 6f43749 commit history ("Fit flow diagram step labels to their columns") shows this was a known overflow.
- Remedy: label fitting is layout, not motion: run it from a ResizeObserver + `document.fonts.ready` in the FlowDiagram island regardless of motion preference, or solve in CSS (`font-size: min(clamp(19px, 2.4cqi, 30px), calc((100cqi / var(--steps)) / var(--longest-word-chars) * 1.6))` with `--longest-word-chars` computed on the server).
- Acceptance: with reduced motion on, at 1000px, 1280px and 1440px container widths, no flow label breaks inside a word and none overflows its column (check `scrollWidth <= clientWidth` for each `li b`).

<a id="d-06"></a>

### D-06 Auto-moving and blinking content with no pause control (WCAG 2.2.2)
- Severity: High. Status: Verified failure (by code).
- Where: ticker drift baseline 0.45px/frame even with zero scroll (base.js:30; home.html:782; portfolio.html:798; open-source.html:889); `.dot` blink `2.4s infinite` (base.css:47-48); portfolio scroll cue `1.8s infinite` (portfolio.html:99-100); canvases animating on `time` with no input: strata drift (home.html:697), plate rotation and signal (portfolio.html:597,623), sphere spin (portfolio.html:719), route packets and file scan (open-source.html:779,814,836), timeline wobble (writing.src.html:298), tangle (principles.src.html:202).
- Evidence: content that moves or blinks automatically, lasts more than 5 s and sits beside other content needs a pause/stop/hide mechanism (WCAG 2.2.2, Level A). The only stop is the OS reduced-motion setting, which is not a page mechanism. `aria-hidden` does not exempt visual motion. ds/README.md:3 says motion "never a timer", which the code contradicts.
- Remedy: either make all motion strictly scroll-bound (no baseline drift, no `time` terms, no infinite keyframes) or add one visible, keyboard-operable "Pause motion" toggle in the Nav that sets a `data-motion="paused"` attribute (persisted in localStorage) which CSS and islands respect; stop the blink after a few cycles (`animation-iteration-count: 3`).
- Acceptance: with no input for 10 s and reduced motion off, nothing on screen moves, or a visible Pause control stops all of it and the state persists across navigation; axe/manual check against 2.2.2 passes.

<a id="d-07"></a>

### D-07 Post-paint title fitting (fit.js): layout shift, font-swap dependence, unthrottled resize, permanent observers
- Severity: Medium. Status: Risk (CLS untested).
- Where: kit/fit.js:1-45, appended to every page (build.mjs:185-188).
- Evidence: titles first paint at their CSS size, then fit.js rewrites inline `font-size` (fit.js:28), then again on `document.fonts.ready` (:34) and each `loadingdone` (:35) because Google Fonts uses `display=swap` (build.mjs:58); every resize runs `fitAll` over every `h1, h2, h3, .name, [data-fit], .next strong, .pager strong` with no debounce (:36), each doing remove-property (write) then `getComputedStyle`/`clientWidth`/`scrollWidth` (reads) up to 4 times (:18-30), i.e. one forced layout per title per pass. The MutationObserver on `document.body` subtree (:39-44) is never disconnected; on the home and portfolio pages `readout.textContent` is rewritten every frame (home.html:746; portfolio.html:753), so the observer callback fires every frame (it filters them out, but still runs). `data-grow` scales the case display word up to 1.5× after paint (fit.js:26-28), which also moves everything below it.
- Remedy: in Next, render final sizes on the server: compute a per-title `font-size` cap from the string (longest word length × average advance for Archivo at the given stretch) as a CSS variable, and use `font-size: min(clamp(...), var(--fit))`; self-host fonts via `next/font` with `adjustFontFallback` so the swap does not change metrics much; if JS fitting is kept, use a `useLayoutEffect` + per-element ResizeObserver (no global resize listener, no body MutationObserver), batch reads before writes, and run before first paint of the hydrated tree.
- Acceptance: Lighthouse/Web Vitals CLS < 0.05 on home, a case study and the reader on a cold cache with slow 4G; no title overflows its box at 320, 375, 760, 1024, 1440 and 1920px widths; resize from 1440 to 375 produces no "Forced reflow" warnings longer than 5 ms.

<a id="d-11"></a>

### D-11 Tall sticky scroll scenes: 100vh on mobile, blank canvases before JS
- Severity: Medium. Status: Risk (mobile behaviour Untested).
- Where: post.src.html:20-21 (`.scene { height: 260vh }`, `.scene__stick { height: 100vh; min-height: 560px }`, no `svh`/`dvh`); portfolio.html:192-193 (`height: 260vh`; stage `100vh` then `100svh`, good) and :252 (220vh ≤760); portfolio hero `min-height: min(84vh, 860px)` (:72); reader `.toc__stick { max-height: 100vh }` (reader.src.html:29); lightbox `max-height: 94vh; width: 96vw` (case.src.html:133).
- Evidence: on iOS/Android browsers `100vh` is the large viewport, so the bottom of the post scene's sticky stage (the `scene__foot` caption "The example from this post, not a report…", post.src.html:179) can sit under the browser toolbar. With JS disabled or before hydration the post scene stays on step 1 for 260vh of scroll, and the portfolio scene shows an empty canvas for 260vh.
- Remedy: use `height: 100svh` (with `100vh` fallback) for sticky stages; render the scene's pre-hydration state as a static, non-sticky layout (all three steps visible) and switch to the sticky version only when the island mounts and motion is allowed; same for the portfolio sphere (static SVG poster).
- Acceptance: on iPhone Safari and Android Chrome with toolbars visible, the post scene footer is fully visible while the stage is stuck; with JS disabled, the post scene shows all three states without extra empty scroll.

<a id="d-17"></a>

### D-17 Permanent `will-change: transform`
- Severity: Low. Status: Verified failure.
- Where: base.css:61,66; case.src.html:37; principles.src.html:7; post.src.html:11 (`.title span`, but no JS ever transforms it); home.html:67,94; portfolio.html:104,120; open-source.html:68,90.
- Evidence: layers are promoted for the page's lifetime, including under reduced motion and when off-screen; `post.src.html:11` promotes elements that never animate.
- Remedy: set `will-change` only while an island is actively animating that element (add on intersect, remove on leave/stop), or rely on `transform` alone; remove from `.title span`.
- Acceptance: Layers panel shows no promoted layers for display words/tickers when reduced motion is on or the element is off-screen.

<a id="d-18"></a>

### D-18 Frame-rate-dependent motion
- Severity: Low. Status: Verified failure.
- Where: ticker speed in px per frame (base.js:30), velocity in px per frame (base.js:25), lerps per frame (`.18` base.js:25; `.07` home.html:685; `.06` portfolio.html:574; `.08` case.src.html:323, open-source.html:778, not-found.src.html:100; `.15` writing.src.html:277); `flow += speed` per frame (open-source.html:779).
- Evidence: on 120 Hz displays tickers run twice as fast and smoothing converges twice as quickly as on 60 Hz.
- Remedy: compute `dt` from the rAF timestamp and use `x += v * dt`, `k = 1 - Math.pow(1 - k60, dt / 16.67)`; or move the marquee to CSS keyframes with a duration in seconds.
- Acceptance: ticker speed measured in px/s matches within 5% at 60 Hz and 120 Hz.

<a id="d-19"></a>

### D-19 Missing cleanup (listeners, observers, timers)
- Severity: Medium when ported (Low in static artifacts). Status: Risk.
- Where: IntersectionObservers never disconnected (home.html:772; portfolio.html:786; open-source.html:878; writing.src.html:339; principles.src.html:252); pointer listeners (home.html:675-679; portfolio.html:553-558; open-source.html:730-734; case.src.html:315-316; writing.src.html:241-242; principles.src.html:179-180); global `addEventListener("pointermove")` (not-found.src.html:83) and `resize` (not-found.src.html:98; now.src.html:154; post.src.html:284; reduced paths home.html:760 etc.); `document.fonts` `loadingdone` listeners (diagrams.js:35; fit.js:35); fit.js MutationObserver on body (fit.js:39-44) and resize (fit.js:36); copy-button `setTimeout` not cleared and racing on repeated clicks (open-source.html:645); `setInterval` scramble (not-found.src.html:73).
- Evidence: fine for single-document static pages; in Next App Router these become leaks across client navigations if ported as is (the layout and Lenis persist).
- Remedy: every subscription inside `useEffect` with a returned cleanup; `AbortController` signal for grouped listeners; one shared observer per concern.
- Acceptance: navigate home → case study → writing → home 10 times; heap snapshot shows no growth in detached nodes/listeners; React StrictMode double-mount produces no duplicate loops.

<a id="b-18"></a>

### B-18 — Hero and every cinematic section are hidden by CSS before JS runs
- Severity: **High** · Status: **Risk** (code-verified; failure scenario not reproduced)
- Location: `app/layout.tsx:106-110` (inline script adds `html.js` before any bundle); `app/globals.css:71-79` (`html.js [data-hero-animate] { opacity: 0; }`), `app/globals.css:532-536` (`html.js [data-cine-section] { opacity: 0; }`); reveal relies on `components/Hero/hooks/useHero.ts:35-112` and `utils/cinematic.ts:124-170`. No `@media print` rule in `app/globals.css` (grep count 0).
- Evidence: `layout.tsx:108` `__html: \`document.documentElement.classList.add("js")\``; `globals.css:533-534` `html.js [data-cine-section] { opacity: 0;`.
- Impact: if the JS bundle fails to load, a chunk 404s after deploy, hydration throws, or JS is slow on a recruiter's locked-down laptop, the homepage H1, CTAs and every wrapped section stay invisible; the H1 (LCP element) is opacity 0 until the intro tween, delaying LCP; printing a page prints blank sections that were never scrolled into view.
- Remedy: add a safety timeout in the inline script (e.g. remove `js` class or add `js-ready` fallback after ~2.5 s unless the app sets `motion-ready`), or gate the hidden state on a class set by the client after hydration (`html.motion-ready`), never by the pre-hydration script; exempt the hero H1 from opacity 0 (animate transform/clip only); add `@media print { [data-cine-section], [data-hero-animate], [data-reveal] { opacity: 1 !important; transform: none !important; } }`.
- Acceptance criteria: with JS blocked after the inline script (DevTools request blocking of `/_next/static/chunks/*`), all text is visible within 3 s; print preview of `/` and `/portfolio/ledgerguard` shows all sections; Lighthouse LCP element is visible at first paint.

<a id="b-19"></a>

### B-19 — GSAP work is not torn down on unmount; DOM mutated under React
- Severity: **Medium** · Status: **Verified failure** (code)
- Location:
  - `components/Hero/hooks/useHero.ts:35-112` — intro timeline, effect returns nothing.
  - `components/Hero/hooks/useHero.ts:168-178` — `gsap.to(scrollIndicatorRef.current, { … repeat: -1, yoyo: true })`, no cleanup (infinite tween keeps ticking after leaving `/`).
  - `components/Hero/hooks/useGridOutlineAnimation.ts:74-98` — one tween per grid path, no cleanup.
  - `utils/cinematic.ts:147-169,189-205` — cleanup disconnects the observer but leaves in-flight tweens.
  - `utils/cinematic.ts:37-39` and `utils/hooks/usePageHeader.ts:38` — `splitElementWords` replaces React-owned text nodes (`el.textContent = ""; el.appendChild(fragment);`).
- Evidence: `useHero.ts:175` `repeat: -1,` inside an effect with `}, []);` at `:178` and no `return`.
- Impact: tweens accumulate on detached nodes across client navigations and in React StrictMode double-mount; if a split title's text prop changes without remount, React will update a node it no longer owns.
- Remedy: wrap each effect in `gsap.context(() => { … }, ref)` and `return () => ctx.revert()`; for splits, render word spans in JSX (as `HeroTitle.tsx:16-27` already does) instead of mutating DOM.
- Acceptance criteria: after navigating `/` → `/portfolio`, `gsap.globalTimeline.getChildren().length` returns to baseline; specs assert `revert`/`kill` on unmount for useHero, useGridOutlineAnimation, useScrollReveal.

<a id="b-20"></a>

### B-20 — Permanent `will-change` on every split word and stage; full-stage blur filters
- Severity: **Low** · Status: **Verified** (code); perf impact Untested
- Location: `app/globals.css:450-453` (`.cine-stage { will-change: transform, opacity; }`), `app/globals.css:462-465` (`.cine-word { … will-change: transform, opacity; }`), only released under reduced motion (`:549-552`); blur on large containers `useHero.ts:54-59` (`filter: "blur(14px)"`), `usePageHeader.ts:41`.
- Remedy: set `will-change` only during the tween (GSAP `onStart`/`onComplete` or `clearProps: "will-change"`), and prefer opacity/transform over `filter: blur` on the full stage.
- Acceptance criteria: after intro completes, no element under `#hero`/article header has computed `will-change` ≠ `auto`; Performance panel shows no long "Paint/Composite" tasks during intro on a 4x CPU throttle.

<a id="b-21"></a>

### B-21 — Hero parallax overwrites the intro fade
- Severity: **Low** · Status: **Untested**
- Location: `components/Hero/hooks/useHero.ts:54-59` (stage set to `opacity: 0`), `:127-136` (`apply()` sets `opacity: 1 - progress * 0.85`), `:157` (`apply()` called immediately on mount).
- Evidence: second effect runs after the first in the same commit, so the stage is `opacity: 1` before the timeline records its start values.
- Remedy: animate parallax on an inner wrapper or use a separate property (`--parallax-y`), and start parallax after the intro timeline completes.
- Acceptance criteria: intro stage visibly fades from 0; scrolling during the intro does not cause opacity jumps.

<a id="b-22"></a>

### B-22 — Reduced-motion preference is read once (production and artifact)
- Severity: **Low** · Status: **Verified** (code)
- Location: `utils/gsap.ts:5-9`; `components/SmoothScroll/SmoothScroll.tsx:15`; artifact `docs/design/kit/base.js:3`.
- Remedy: a tiny `usePrefersReducedMotion()` hook with a `change` listener; destroy Lenis and `gsap.globalTimeline.progress(1)` when it flips on.
- Acceptance criteria: toggling the OS setting mid-session stops Lenis and ongoing reveals without reload.

<a id="b-23"></a>

### B-23 — Artifact canvases need an explicit production port contract
- Severity: **Info** (becomes Medium when ported) · Status: **Verified** (artifact code)
- Location: `docs/design/kit/static/home.html:337,672-812` (`#strata`, perpetual rAF, `getComputedStyle` + `getBoundingClientRect` every frame at `:785-799`), `docs/design/kit/base.js:16-53` (shared `runPortal` loop, never cancelled), `static/open-source.html:329`, `static/portfolio.html:304,494`, `writing.src.html:112,331-341`, `now.src.html:76,155`, `principles.src.html:107,239`, `not-found.src.html:37`.
- Evidence: production has no canvas (`grep -rnE "<canvas|getContext" app components features utils` → none). Artifact: `if (reduce) { const still = () => drawStrata(0, .97); … return; }` and `requestAnimationFrame(frame);` with no stop.
- Remedy (port contract): one client component per canvas; `aria-hidden` stays; SSR a static SVG/PNG poster of the reduced-motion frame as the no-JS/initial state; start rAF only while `IntersectionObserver` reports visible and `document.visibilityState === "visible"`; cache layout reads on resize/scroll instead of per frame; `cancelAnimationFrame` + remove listeners on unmount; DPR cap 2 (already in `fitCanvas`); canvas text uses loaded production fonts (artifact uses "Archivo"/"Geist Mono").
- Acceptance criteria: navigating away from the page leaves zero rAF callbacks; hidden tab → no frames; reduced motion → static frame and no rAF; no-JS → poster visible; no layout reads inside the per-frame draw.
