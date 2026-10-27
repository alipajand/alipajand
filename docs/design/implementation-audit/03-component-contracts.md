# Component contracts

> Audit of the Pajand Hairline design artifacts against the Next.js application.
> Frozen revision: `b8856fec6703f6213d5b6e4ac42a9c0f86b3f375` (PR #223 head, branch `ali/nostalgic-blackwell-0b3838`). The brief expected `6e0ffc8`; the head had advanced by three commits (`d6dc60a`, `89a649f`, `b8856fe`), all inside `docs/design/`.
> Application baseline: the same revision. Next.js 16.4.2, React 19.3.1 installed. `origin/main` is 6 commits ahead of the merge base `6f43749` (PR #222 and dependency bumps; see M-05).
> Every finding states a severity (Critical, High, Medium, Low, Info) and a status: **Verified failure** (reproduced from code, build output or capture), **Risk** (pattern confirmed, impact not reproduced) or **Untested** (could not be checked read-only).

The recurring patterns in the artifacts, with the DOM and ARIA contract each one needs, its data, states, motion and reduced-motion behaviour, the closest production component, and whether it should be a Server Component or a client island. The architecture these contracts plug into is in [08](08-architecture-plan.md).

## Contracts

### 2. Component contracts

Conventions: "Server" = React Server Component with no client JS; "Island" = small `"use client"` component mounted inside a server parent. Every island below should consume one shared scroll scheduler and one `useReducedMotion` hook (see D-01, D-03).

#### 2.1 Nav (site header)
- Defined: kit/build.mjs:59-75 (markup), base.css:33-48,100-107 (style); static copies home.html:305-318, portfolio.html:288-301, open-source.html:296-309. ds/components/Nav/README.md.
- DOM: `header.nav[aria-label="Site"]` > `a.nav__name` + `nav.nav__links[aria-label="Primary"]` > 4×`a` (current one `aria-current="page"`) + `div.nav__cta` > `span` (`span.dot[aria-hidden]` + "Open to roles") + `a` (Book a call) + `span.progress#progress[aria-hidden]`.
- Data: 4 destinations, current key, CTA href, availability label.
- States: link hover underline offset 5px (base.css:39); `aria-current` underline 2px (base.css:40; static pages differ: 1px, portfolio.html:54); CTA link hover inverts to line/ink (base.css:45); focus = global 2px line outline.
- Motion: `.dot` blink 2.4s infinite (base.css:47); progress `scaleX(var(--p))` set per frame (base.js:26-27).
- Reduced motion: blink removed by blanket rule (base.css:119); progress never updates on pages that `return` before `runPortal` (D-04).
- Prod analogue: components/Nav/Nav.tsx (client, fixed, mobile menu) + components/ReadingProgress/ReadingProgress.tsx (client, fixed top). `utils/navAriaCurrent.ts` for current state.
- Recommendation: Server Component for the boxed header; progress line as its own island (or CSS `animation-timeline: scroll(root)` with `@supports` and no JS at all).

#### 2.2 DisplayWord / name
- Defined: build.mjs:84-98 (`display()` split at first space or camel-case join, `aria-label`, `data-part data-grow`), base.css:51-62, case.src.html:12; motion base.js:35-43; per-page variants home.html:57-68,320-324, open-source.html:311-315 (`<p aria-hidden>`), portfolio.html:110-121,334-338 (`.display`), principles.src.html:6-9,92-95 (two lines), writing.src.html:96-100 (second half `aria-hidden` "2026"), now.src.html:67-71.
- DOM: `h1.name[aria-label]` > `span` + `svg.star[aria-hidden] use#spark` + `span`.
- Data: name, split rule, optional second word, size (cqi), `grow` flag.
- States: none interactive.
- Motion: halves translateX toward/away from spark by scroll (base.js:36-41), spark rotates `y*.35deg`; portfolio adds velocity scale (portfolio.html:812).
- Reduced motion: no JS transforms (pages return early), `will-change: transform` stays (D-17).
- Prod analogue: components/Hero/HeroTitle.tsx, HeroDisplayChar.tsx (client).
- Recommendation: Server-rendered `h1` with real text (`aria-label` only if the visual split changes reading); fit via CSS (`font-size: min(Ncqi, …)` precomputed per string length at build/render time) rather than post-paint JS (D-07); scroll motion as an optional island.

#### 2.3 Ticker
- Defined: base.css:65-69,120-122; base.js:17,28-34; markup home.html:349-366,458-473; portfolio.html:317-355; open-source.html:334-351,422-435; JS-built in writing.src.html:186-187, principles.src.html:171-172, now.src.html:125-126, reader.src.html:168-170.
- DOM: `div.ticker[aria-hidden="true"]` > `div.ticker__track[data-dir=±1]` > 2×`div.ticker__run` (second also `aria-hidden`) of `span` + `span.sep` + `svg use#ring|#spark`.
- Data: list of short strings, direction, icon.
- Motion: per-frame translate, baseline 0.45px/frame, + |velocity|×.35, reverses when scrolling up (base.js:30); wraps at half `scrollWidth`.
- Reduced motion: second run hidden, track `width:auto`, run wraps as a static list (base.css:120-122).
- Prod analogue: none.
- Recommendation: Server-rendered list; motion via CSS `@keyframes` marquee (`translateX(-50%)`) with `animation-play-state` driven by a visible pause control and IntersectionObserver; velocity surge, if kept, as an island that only adjusts `animation-duration`/`playbackRate` through the Web Animations API. Must add a pause mechanism (D-06).

#### 2.4 NextLinks + Footer
- Defined: base.css:88-98,111-116; markup now.src.html:88-92, writing.src.html:152-156, post.src.html:241-245, principles.src.html:137-141, reader.src.html:139-143; footer build.mjs:76-80.
- DOM: `nav.next[aria-label]` > 3×`a` > `span.mono` (bracketed label) + `strong` (title + `span.chev[aria-hidden] svg use#chev`). Footer `footer.foot.mono` > 3×`span`.
- States: hover/focus-visible invert to line/ink, label to mute-ink, focus outline ink offset -4px (base.css:93-95); chevron slides 8px (base.css:30).
- Reduced motion: transitions removed.
- Prod analogue: components/Footer/Footer.tsx (server, different content: latest writings, channels).
- Recommendation: Server.

#### 2.5 FactsPanel (+ live links)
- Defined: case.src.html:19-32,96-98, build 240-245; ds/components/FactsPanel/README.md.
- DOM: `dl.facts(.facts--stack)` > `div` > `dt.mono` + `dd` (stack as `span.tags > span`); `div.lives` > `a.live` (label + `small` host + chev).
- Data: role, timeframe?, capabilityTags[], liveLinks[].
- States: `.live:hover` bone-2 (case.src.html:31). No focus-visible style beyond global outline; adjacent `.live` rows have line backgrounds that hide the outline's top/bottom edges (D-15).
- Prod analogue: components/Projects/ProjectCaseStudyArticle.tsx, ProjectCardBadge.tsx.
- Recommendation: Server.

#### 2.6 ChapterRail
- Defined: case.src.html:49-57,196-199,287,308-339; ds/components/ChapterRail/README.md.
- DOM: `nav.rail[aria-label="Table of contents for …"]` > `ol#rail` > `li > a[href="#id"]` (`span.mono` index + title) + `span.rail__p[aria-hidden]`.
- Data: sections (id, title), band→section mapping.
- States: hover ink-2; active `.on` inverts; active item scrolled to centre with `scrollTo({behavior:"smooth"})` (case.src.html:336). No `aria-current` on the active link (state is class-only).
- Motion: progress `--p` per frame (case.src.html:338-339).
- Reduced motion: whole block skipped, so no active state and no progress (D-04).
- Prod analogue: components/TableOfContents/TableOfContents.tsx + hooks/useActiveHeading.ts.
- Recommendation: Server-rendered list; island for active section via IntersectionObserver (not per-frame `getBoundingClientRect`), setting `aria-current="location"`; keep active state under reduced motion, only drop the smooth scroll.

#### 2.7 CaseSection
- Defined: case.src.html:60-77,108-112,255-286; ds/components/CaseSection/README.md.
- DOM: `section.sec#id[aria-labelledby]` > `div.sec__side > div.sec__stick` (`span.sec__n.mono` + `h3#id-t`) + `div.sec__main` > blocks (`p.lead`, `ul.items li[data-n]`, `ul.cells`, `div.decisions`, figure, `div.evidence`, `ul.outcome`, `div.related`).
- Data: project.caseStudy fields; empty sections dropped and renumbered.
- States: sticky side `top:50px` (static ≤760).
- Prod analogue: components/Projects/ProjectCaseStudyArticle.tsx; features/portfolio/ProjectCaseStudyPageContent.tsx.
- Recommendation: Server. Note heading levels: page `h1` (display word), intro `h2`, section `h3` while sections have no `h2` parent in between, acceptable but check outline.

#### 2.8 DecisionCard
- Defined: case.src.html:80-90,142-144,262-266; ds/components/DecisionCard/README.md.
- DOM: `article.dec` > `div.dec__head` (`span.mono` "Decision NN" + `p`) + `dl` > 3×`div` (`dt.mono` Why/Trade-off/Result + `dd`).
- States: none. Result `dd` in line (case.src.html:90).
- Prod analogue: components/Projects/ProjectDecisionCard.tsx (currently `"use client"`).
- Recommendation: Server (no interactivity needed).

#### 2.9 ScreenshotFrame + lightbox dialog
- Defined: case.src.html:36-46,104-105,133-139,169,227-234,209-212,291-301,313-325; ds/components/ScreenshotFrame/README.md.
- DOM: `figure.shot(.shot--side)` > `div.shot__win[data-tilt]` > `div.shot__bar.mono[aria-hidden]` (3×`i`, host span, caption-lead `b`) + `button[type=button][data-shot][aria-label="Enlarge: …"] > img[width=1728][height=1084][alt][loading=lazy except hero][decoding=async]`; `figcaption` (`b` lead + body). Dialog: `dialog.lb#lb[aria-label="Screenshot"]` > `div.lb__bar` (`span.mono#lb-title` + `button#lb-close`) + `div.lb__img > img#lb-img`.
- Data: interfaceEvidence[] (src, alt, captionLead, captionBody), host.
- States: button focus-visible outline (case.src.html:43); dialog close button hover inverts; backdrop click closes (case.src.html:301); Escape native.
- Motion: hero tilt rotateX up to 14° flattening over 55% of a viewport, pointer tilt ±5°, scale .94→1 (case.src.html:313-325), every frame forever.
- Reduced motion: `transform:none !important` (case.src.html:169) and JS loop skipped.
- Prod analogue: components/Projects/ProjectFigure.tsx (client, next/image, no lightbox, no frame chrome).
- Recommendation: Server frame using `next/image`; lightbox as a small island wrapping native `<dialog>` with `showModal()`, `aria-labelledby` the title span, focus return (native) and an inner scroller with `tabIndex=0` (D-26). Tilt as optional island gated by IntersectionObserver.

#### 2.10 LayersDiagram
- Defined: diagrams.js:8-12, diagrams.css:6-14,56-57; lighting diagrams.js:56-61; ds/components/LayersDiagram/README.md.
- DOM: `figure.dg.dg--layers` > `figcaption.dg__head.mono` + `ol.layers[data-light]` > `li` (`span.mono` NN + `b` + `span` detail) + `p.dg__cap`.
- Data: `{type:"layers", title, caption?, layers:[{label, detail?}]}` (utils/diagramBlocks.ts).
- States: `.on` inverts one layer.
- Reduced motion: no lighting; static.
- Prod analogue: components/diagrams/LayersDiagram.tsx (client), DiagramFigure.tsx, PostDiagram.tsx.
- Recommendation: Server markup; lighting island via IntersectionObserver with thresholds or CSS scroll-driven `view()` timelines.

#### 2.11 CompareDiagram
- Defined: diagrams.js:14-18, diagrams.css:16-26,58-60.
- DOM: `figure.dg.dg--compare` > figcaption + `div.compare[style="--cols:N"]` > N×`div` (`h4` + `ul > li`), markers via `::before` "×"/"✓".
- Note: the ×/✓ meaning is CSS-generated content; screen readers may or may not read it; the column heading carries the meaning.
- Prod analogue: components/diagrams/CompareDiagram.tsx (server).
- Recommendation: Server.

#### 2.12 FlowBand (flow diagram + chevrons band)
- Defined: diagrams.js:21-27,34-51,62-67; diagrams.css:28-53,61-64; band wrapper case.src.html:93-94,285-286; ds/components/FlowBand/README.md.
- DOM: `section.band[data-for][aria-label]` > `div.band__in` > `figure.dg.dg--flow[data-flow]` (`figcaption.dg__band-head` + `ol.flow[style=--steps:N] > li` (`span.mono` "Step NN" + `b` + `p`) + `div.flow__loop` + `p.flow__cap`) + `div.chevrons#chevrons[aria-hidden]` (12 svgs, build.mjs:81).
- Data: `{type:"flow", title, caption?, loop?, steps:[{label, detail?}]}`.
- States: `.on` step inverted to ink, `.done` steps get " ✓" via `::after` (diagrams.css:39-41).
- Motion: lights by scroll; labels shrink to fit per frame-check (diagrams.js:37-51).
- Reduced motion: case page adds `.done` to all steps (case.src.html:304); reader does not; label fitting skipped (D-05).
- Prod analogue: components/diagrams/FlowDiagram.tsx (client), McpWorkflowDiagram.tsx.
- Recommendation: Server markup; label fit with ResizeObserver island or CSS-only (`font-size: min(clamp(...), calc(100cqi / chars))`); chevrons via CSS scroll-driven animation.

#### 2.13 Scroll progress bar
- Defined: base.css:46; base.js:26-27; rail variant case.src.html:57,338-339; TOC variant reader.src.html:37,204-205; portfolio scene bar portfolio.html:203,754.
- Prod analogue: components/ReadingProgress/ReadingProgress.tsx (client; uses `onScrollFrame`, utils/cinematic.ts:81-105, which is event-driven and cancellable).
- Recommendation: CSS `animation-timeline: scroll(root block)` first, island fallback using `onScrollFrame`.

#### 2.14 Chevrons band
- Defined: base.css:82-85; static home.html:141-144,428-430; portfolio.html:131-134,367-377; open-source.html:161-164,392-394; base.js:19-20,44-48.
- DOM: `div.chevrons#chevrons[aria-hidden]` > N×`svg[viewBox="0 0 40 60"] path`.
- Motion: `.off` (opacity .16, translateX -6px) toggled by scroll.
- Reduced motion: all stay lit (class never added).
- Recommendation: Server markup + CSS `view()` timeline or a single IntersectionObserver; decorative.

#### 2.15 Badges grid (open-source "Technology and scope")
- Defined: open-source.html:167-173,227-230,266-269,405,637,914-918.
- DOM: `ul.badges#badges > li` (`span.mono` NN + text).
- States: one `.on` cell walks the grid by scroll; borders rely on `nth-child(4n)`/`nth-last-child(-n+4)` and `!important` overrides per breakpoint (assumes item count is a multiple of the column count; 12 items).
- Prod analogue: OpenSourceTools (components/OpenSourceTools/*), features/open-source/OpenSourcePageContent.tsx.
- Recommendation: Server; drop the walking highlight or make it CSS-only.

#### 2.16 Contact form
- Defined: home.html:186-227,275-277 (CSS), 561-596 (markup), 622-652 (JS).
- DOM: `form#contact-form[novalidate][aria-labelledby]` > head + `div#form-summary[role=alert][hidden]` + fields (`label[for]`, `input|textarea[aria-describedby="hint err"][required]`, `small` hint, `small.err[hidden]`) + `p#form-status[role=status]` + `button[type=submit]`.
- States: input focus: `outline:none`, bottom border to line, focus-visible `box-shadow 0 2px 0 0 line` (home.html:212-213); invalid: `data-invalid`, 2px line border, `aria-invalid`; error summary with in-page links that focus fields.
- Prod analogue: components/Contact/ContactForm.tsx + hooks/useContactForm.ts (client), Resend backend (utils/resend.ts).
- Recommendation: Island (already client). Fix D-14 items in the port.

#### 2.17 Pager
- Defined: case.src.html:121-129,163-165,202-204,288-289.
- DOM: `nav.pager#pager[aria-label="Case studies"]` > `a` (Index) + optional `a` (Next case study); `.pager--single`.
- States: hover/focus inverts; label colour fix only on hover (D-12).
- Prod analogue: features/portfolio/ProjectCaseStudyPageContent.tsx (next project link, not traced in detail).
- Recommendation: Server.

#### 2.18 404 "ways back"
- Defined: not-found.src.html:7-31 (CSS), 37-49 (markup), 54-101 (JS).
- DOM: `div.code[aria-hidden]` (`b#code` + `canvas#route`), `main#main[tabindex=-1][aria-labelledby]` (`div.msg` + `nav.ways[aria-label="Ways back"]` > 2×`a` with `span[data-fit]`).
- Behaviour: focuses `main` on load (not-found.src.html:67) with `main { outline:none }` (line 10); code scramble via `setInterval` 45ms (73-77); route gap follows window pointer (83) and redraws every frame forever (100).
- Prod analogue: features/not-found/NotFoundPageContent.tsx (client, GSAP, rAF scramble) + components/NotFoundMainFocus.
- Recommendation: Server page; NotFoundMainFocus island already exists; canvas optional island.

#### 2.19 Activity graph (open-source)
- Defined: CSS open-source.html:175-204,260-265; markup 408-420; JS 650-693, 920-923; data kit/activity.json (snapshot), refreshed by `build.mjs --activity` (build.mjs:196-221).
- DOM: `dl.act__stats#act-stats` (4×div: dt/dd/span); `div.act__graph#act-graph` > `svg[role=img][aria-label="N contributions … between A and B"]` > month `text`, day `text`, 53×`g.wk` > `rect.l0..l4[data-i]`; `div.act__foot` > `span#act-readout` + legend `[aria-hidden]` + link.
- Data: `{user, taken, from, total, counts[], levels}`.
- States: `rect:hover` stroke; pointerover updates readout; weeks fade in by scroll (`.wk.off` opacity 0).
- Reduced motion: no fade (class never added).
- Prod analogue: none.
- Recommendation: Server-rendered SVG from a build-time snapshot (or `revalidate` fetch); optional island for hover/focus readout. Fix D-16.

#### 2.20 Canvases (hero scenes)
| Page | Defined | Draw cost / gating | Reduced motion |
| --- | --- | --- | --- |
| Home strata probe | home.html:663-762,809 | every frame while hero intersects (IO home.html:772) | single still frame at depth .97 (756-762) |
| Portfolio stack plates | portfolio.html:547-704,826 | every frame while hero intersects (786-787) | still (768-773) |
| Portfolio sphere scene | portfolio.html:706-766,827 | 765 points, ~1,500 segments/frame while visible; rotates with `time` even when idle (719) | still at fold 1 (761) |
| Open-source route | open-source.html:708-856,925-928 | every frame while hero visible; layout cached until resize (775) | still (858-864) |
| Writing timeline | writing.src.html:233-340 | every frame while hero visible | still (331-337) |
| Principles align | principles.src.html:174-268 | every frame while hero visible | still (239-245) |
| Now ruler | now.src.html:129-161 | every frame, no visibility gate | single draw (153-155) |
| 404 route | not-found.src.html:80-100 | every frame forever, no gate | single draw (97-99) |
All: `fitCanvas` caps DPR at 2 and resizes the backing store only on size change (base.js:8-15), no `getContext` null check, no fallback content, `aria-hidden` wrappers with HTML readouts. Prod analogue: components/Hero/HeroBackground.tsx, GridOutlinePath.tsx (client). Recommendation: lazy `dynamic(() => import(...), { ssr:false })` islands, gated by IntersectionObserver + `visibilitychange`, server-rendered static SVG/poster as the pre-hydration and no-JS state.

#### 2.21 Other recurring patterns (brief)
- Breadcrumbs `nav.crumbs.mono[aria-label="Breadcrumb"]` (case.src.html:8-11,176-180; post/reader/now) → components/Breadcrumbs (server).
- Section head `.head` (base.css:72-76) → Server.
- TOC (post `.toc` + mobile `<details>`; reader sticky TOC with per-item progress) post.src.html:62-72,95-107,183-190; reader.src.html:28-38,130 → components/TableOfContents (client).
- Writing topic chips `button.chip[aria-pressed]` in `div.filters[role=group]` + `span#count[role=status]` (writing.src.html:44-51,144-148,221-230) → features/writing/WritingIndexPageContent.tsx (client).
- Selected work cards `.case` (home.html:107-125), work index rows `.work a` (portfolio.html:163-189), tool cards `.tool` (home.html:158-169), open-source project article `.proj` + copy button (open-source.html:114-147,600-648) → SelectedWorkCard, ProjectIndexItem, OpenSourceToolCard (server) + copy island.
- Post sticky scene (3 steps) post.src.html:19-59,154-181,261-300 → none; island.

---

## Findings

| ID | Severity | Status | Finding |
| --- | --- | --- | --- |
| [D-08](#d-08) | Medium | Risk | Canvas text uses literal font family names that will not resolve under next/font |
| [D-10](#d-10) | Medium | Verified failure (artifact behaviour) | Templates render core content client-side only |
| [D-20](#d-20) | Low | Risk | Canvas robustness: no context guard, no fallback, redundant work |
| [D-23](#d-23) | Low | Risk | Element lookups by fixed IDs assume one instance per page |
| [D-25](#d-25) | Low | Risk | Lightbox details |

<a id="d-08"></a>

### D-08 Canvas text uses literal font family names that will not resolve under next/font
- Severity: Medium. Status: Risk.
- Where: `ctx.font` strings with `"Geist Mono"` / `"Archivo"` (home.html:716,719,721,730; portfolio.html:586-587; open-source.html:741,785,830,841; writing.src.html:248,256,285; principles.src.html:216; now.src.html:138; not-found.src.html:94).
- Evidence: `next/font` emits hashed family names (for example `'__Archivo_ab12cd'`) exposed through a CSS variable; a canvas `font` naming `"Archivo"` falls back to Arial/monospace in production. Canvas text also does not re-render on font load in non-reduced mode except because the loop redraws every frame (D-01); once loops are event-driven, labels drawn before fonts load would stay in the fallback face.
- Remedy: read the resolved family once on mount (`getComputedStyle(document.documentElement).getPropertyValue("--font-mono")`) and build `ctx.font` from it; redraw on `document.fonts.ready` and on `loadingdone`.
- Acceptance: in production build, canvas labels render in Geist Mono / Archivo (compare glyph shapes of "0" and "R" in a screenshot against HTML text); first draw after `document.fonts.ready` uses the web font.

<a id="d-10"></a>

### D-10 Templates render core content client-side only
- Severity: Medium (for the port; Info for the artifacts themselves). Status: Verified failure (artifact behaviour).
- Where: case.src.html:236-289 (intro, facts, all sections, rail, pager next link from JSON); open-source.html:600-637,657-693 (project index, project articles, badges, activity); writing.src.html:185-231 (featured, list, chips, count); principles.src.html:155-172; now.src.html:106-127; reader.src.html:160-184; not-found.src.html:60-66 (h1, description and link labels are empty until JS runs).
- Evidence: with JavaScript disabled or failing, these pages show chrome only (empty `h1` on the 404 page). Production pages are Server Components today; the port must keep that.
- Remedy: render every content block in Server Components from `data/*.ts` and `content/posts`; islands only enhance. Do not port the `innerHTML` templating.
- Acceptance: with JavaScript disabled, every page shows all text, links and headings in the same order as with JS; the HTML response contains the case study sections and the open-source project list.

<a id="d-20"></a>

### D-20 Canvas robustness: no context guard, no fallback, redundant work
- Severity: Low. Status: Risk.
- Where: base.js:8-15 (no null check on `getContext("2d")`; DPR capped at 2 and re-read per call, which is good); `ctx.measureText` for all labels every frame (portfolio.html:588-590; writing.src.html:249,289); `getContext` per frame.
- Evidence: a failed or lost context throws inside the loop and stops every other per-frame behaviour on the page (they share one frame function). Canvases have no static fallback; with JS off they are empty boxes 520–560px tall (home.html:81; open-source.html:83; writing.src.html:15; principles.src.html:20).
- Remedy: guard context creation and isolate each canvas in its own island with an error boundary; cache text metrics on resize/font load; listen for `contextlost`/`contextrestored`; server-render an SVG/poster placeholder of the still frame.
- Acceptance: forcing `getContext` to return null leaves the rest of the page interactive; no-JS view shows a meaningful still image instead of empty space.

<a id="d-23"></a>

### D-23 Element lookups by fixed IDs assume one instance per page
- Severity: Low. Status: Risk.
- Where: base.js:19-21 (`#chevrons`, `#progress`); case.src.html:286 (each flow band emits `id="chevrons"`).
- Evidence: data/projects.ts currently has one flow diagram per project (7 flows across 7 diagram lists), so no duplicate today; a second flow on a case page would create duplicate IDs and only the first band would animate.
- Remedy: components own their refs; no global ID lookups.
- Acceptance: a case study with two flow diagrams lights both chevron bands and has unique IDs (validated by an HTML validator/axe `duplicate-id`).

<a id="d-25"></a>

### D-25 Lightbox details
- Severity: Low. Status: Risk.
- Where: case.src.html:133-139,209-212,292-301.
- Evidence: native `<dialog>` with `showModal()` gives focus trapping, Escape and focus return, which is good. The dialog name is the static "Screenshot" (`aria-label`) while the title span is updated; the image scroller `.lb__img { overflow: auto }` with `img { min-width: 900px }` is not focusable, so on narrow screens keyboard users cannot pan it; no `prefers-reduced-motion` concern (no animation). The click handler is on `document` (:293) and looks up `evidence[+b.dataset.shot]` without bounds checking.
- Remedy: `aria-labelledby` the title span; `tabIndex={0}` + `role="region"` + `aria-label` on the scroller; scoped click handlers per button in the island.
- Acceptance: VoiceOver announces the screenshot title on open; at 375px the enlarged image can be panned with arrow keys.
