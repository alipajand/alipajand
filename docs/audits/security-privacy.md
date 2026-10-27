# Security and privacy review

Date: 2026-10-27. Baseline: `main` at `780cd8f` (before any fix below). Re-checked against `main` at `03b0539` and against production (`https://alipajand.com`) after the owner merged #229 to #234.

Scope: contact API, Resend integration, Resend webhook, Markdown/HTML rendering, analytics and consent, security headers, build output and `public/`, images in `public/`, external links, dependencies. The visual redesign is out of scope.

Method: code reading plus running things. A production build (`pnpm build && pnpm start -p 3464`) was exercised with `curl`, with `RESEND_BASE_URL` pointed at a local mock of the Resend API so every outgoing email request could be inspected without sending mail. Production was only read: `GET` requests, plus 26 `POST /api/contact` requests with empty or wrong-type bodies that are rejected before any email is sent.

Severity: P0 Critical, P1 High, P2 Medium, P3 Low, Info (no defect, or accepted by design).

## Summary

| ID     | Sev  | Finding                                                                                                                          | Status                                              |
| ------ | ---- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| SEC-01 | P2   | No security headers (no CSP/frame-ancestors, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy); `X-Powered-By` sent | Fixed in #229 (merged, verified live)               |
| SEC-02 | P2   | Contact API accepts `text/plain` bodies, so any site can submit messages from a visitor's browser (CSRF)                         | Fixed in #230 (merged, verified live)               |
| SEC-03 | P2   | Contact API has no body size limit; a 20 MB body was accepted and forwarded to Resend                                            | Fixed in #230 (merged)                              |
| SEC-04 | P3   | Contact `name` keeps CR/LF into the email subject; `name` and `message` have no length cap                                       | Fixed in #231 (merged)                              |
| SEC-05 | P3   | `isValidEmail` accepts address-list syntax (`"x",other@example.com`) which is passed as `replyTo`                                | Fixed in #231 (merged)                              |
| SEC-06 | P3   | Resend error messages and setup hints are shown to visitors                                                                      | Fixed in #232 (merged)                              |
| SEC-07 | P3   | Path traversal in post slug: `/writing/..%2F..%2FREADME/opengraph-image` reads `README.md`                                       | Fixed in #233 (merged)                              |
| SEC-08 | P2   | No rate limiting or bot check on `/api/contact`; documented edge rate limit could not be confirmed                               | Fixed: Vercel Firewall rule (verified live)         |
| SEC-09 | P2   | Google Analytics script loads on every visit before any consent decision; it is live in production                               | Open; owner decided: remove GA, keep Vercel         |
| SEC-10 | P3   | Dependency advisories (brace-expansion pinned to a vulnerable 5.0.9, source-map-js, zod); build/lint-time only                   | Fixed in #234 (merged)                              |
| SEC-11 | P3   | Post Markdown is rendered without sanitising: raw HTML, `<script>`, event handlers and `javascript:` links pass through          | Fix in #256 (draft): build-time allowlist sanitiser |
| SEC-19 | P3   | JSON-LD is inlined with `JSON.stringify` only, so a `</script>` in any value would end the script element                        | Open; owner decided: fix in a small PR              |
| SEC-12 | P3   | Inbound mail forwarding re-sends external mail from the owner's own domain without the original sender or authentication result  | Open; owner decided: fix in a separate PR           |
| SEC-13 | Info | Resend webhook signature verification is sound; two non-exploitable robustness gaps                                              | No action needed                                    |
| SEC-14 | Info | Screenshots: owner login email in LedgerGuard and MapBylaw dashboards; LedgerGuard workspace name                                | Owner decided: redact before assets are final       |
| SEC-15 | Info | Build output and `public/`: no source maps, no secrets, only the public contact email                                            | No action needed                                    |
| SEC-16 | Info | External links all carry `rel="noopener noreferrer"`; no `http://` links                                                         | No action needed                                    |
| SEC-17 | Info | Scheduled posts reachable by URL, RSS, sitemap and `llms-full.txt` before their date                                             | By design ("Preview article"); see audit A-01       |
| SEC-18 | Info | Minor configuration robustness in `utils/resend.ts` and the 503 message                                                          | No action needed                                    |

## Findings

### SEC-01 · P2 · Missing security headers

- **Evidence.** `next.config.ts` had no `headers()` and there was no middleware/proxy. Local production build: `curl -sSI localhost:3464/` returned only `Vary`, `Link`, `X-Powered-By: Next.js`, `Cache-Control`, `Content-Type`. Production before the fix: `strict-transport-security: max-age=63072000` (added by Vercel), `x-powered-by: Next.js`, nothing else.
- **Exploit scenario.** Another site frames `alipajand.com` and overlays the contact form (clickjacking); responses can be MIME-sniffed; the framework is advertised.
- **Remedy.** `next.config.ts` sends `Content-Security-Policy: frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()`, and sets `poweredByHeader: false`. HSTS stays with Vercel. Test: `app/__tests__/securityHeaders.spec.ts`.
- **Status.** Fixed in #229. Verified on production after merge: all five headers present, `x-powered-by` absent.
- **Remaining risk.** The CSP does not restrict `script-src`. A nonce-based CSP needs `proxy.ts` (or middleware) to mint a nonce per request and pass it to the inline Next.js bootstrap, the JSON-LD blocks and the GA snippet. That makes every page dynamic, so it is a separate decision.

### SEC-02 · P2 · Cross-site submissions to the contact API

- **Evidence.** `app/api/contact/route.ts:15` (at `780cd8f`) called `request.json()` without checking `Content-Type`. `curl -X POST /api/contact -H 'content-type: text/plain' -H 'Origin: https://evil.example' -d '{"name":"CSRF",...}'` → `{"success":true}`, and the mock received the email.
- **Exploit scenario.** A page on any origin includes `<form enctype="text/plain" action="https://alipajand.com/api/contact">` with a JSON-shaped body. Each visitor's browser then sends a message to the owner's inbox (a simple request needs no preflight). That spreads spam across many IPs and gets around any per-IP limit added later.
- **Remedy.** Answer 415 unless the content type is `application/json` (parameters allowed). Cross-site JSON then needs a CORS preflight, which the route does not grant. Test: `app/api/contact/__tests__/route.intake.spec.ts`.
- **Status.** Fixed in #230. Verified on production: `text/plain` → 415.

### SEC-03 · P2 · Unbounded request body

- **Evidence.** A 20 MB JSON body (100,000-character name, 20 MB message) → `{"success":true}`, and the mock received the 20 MB email with a 100 KB subject. Vercel caps function bodies at 4.5 MB. Self-hosted or local runs have no cap.
- **Exploit scenario.** Memory and CPU spent buffering and parsing huge bodies; multi-megabyte emails to the owner; faster use of the Resend quota.
- **Remedy.** `utils/readLimitedText.ts` streams the body with a 64 KB cap (413 above it, including chunked bodies with no `Content-Length`). Tests: `route.intake.spec.ts`, `utils/__tests__/readLimitedText.spec.ts`.
- **Status.** Fixed in #230.

### SEC-04 · P3 · Multi-line and unbounded contact fields

- **Evidence.** `route.ts:18-20` only trimmed. `name = "X\r\nBcc: victim@example.com\r\nX"` reached Resend as `"subject":"Portfolio contact from X\r\nBcc: victim@example.com\r\nX"`.
- **Exploit scenario.** If any layer between Resend's JSON API and SMTP wrote the subject without encoding, the CR/LF would start a new header. Resend most likely encodes or rejects it. That could not be checked without a live key, so this is defence in depth, not a proven header injection. The missing caps also allow very long subjects and bodies.
- **Remedy.** Control characters in `name` collapse to one space. `name` is capped at 200 characters and `message` at 10,000. Normal input produces a byte-identical email. Test: `route.fields.spec.ts`.
- **Status.** Fixed in #231.

### SEC-05 · P3 · Address-list syntax accepted as reply-to

- **Evidence.** `utils/resend.ts:12-31` (at `780cd8f`) checked for one `@`, a dot in the domain and no whitespace. `email = "\"x\",bcc@evil.com"` passed and was sent as `"reply_to":"\"x\",bcc@evil.com"`.
- **Exploit scenario.** If the provider parses the string as a list, the owner's reply goes to more than one address. The sender already controls the reply-to, so the impact is small.
- **Remedy.** `isValidEmail` rejects `, ; " < > ( ) [ ] \`. `getFromEmail` still accepts `Name <addr>` because it validates the inner address. Tests: `utils/__tests__/resend.spec.ts`, `route.fields.spec.ts`.
- **Status.** Fixed in #231.

### SEC-06 · P3 · Provider error details shown to visitors

- **Evidence.** `route.ts:45-52` returned `error.message`, or for sender/domain problems `"Verify a domain at resend.com/domains and set RESEND_FROM ..."`. `components/Contact/hooks/useContactForm.ts:94` renders `body.error`. With the mock returning a 422, the visitor saw `Internal detail: account team_1234 quota exceeded for key re_abc`.
- **Exploit scenario.** Anyone can make sends fail (for example once the quota is used up) and read account, quota, domain or setup details.
- **Remedy.** Return the existing generic `"Failed to send message"` (same 500 and same shape), and log the provider `{ name, message }` without the visitor's input. Test: `route.errors.spec.ts`.
- **Status.** Fixed in #232.

### SEC-07 · P3 · Path traversal through the post slug

- **Evidence.** `utils/posts.ts:101-107` (at `780cd8f`) built the path with ``readFileSync(join(POSTS_DIR, `${slug}.md`))`` from the decoded route parameter. `app/writing/[slug]` allows dynamic params. `GET /writing/..%2F..%2FREADME/opengraph-image` → 200, an "ARTICLE" card titled `../../README`. `GET /writing/..%2F..%2FREADME` → 404 body, but `<title>../../README | Ali Pajand</title>`.
- **Exploit scenario.** Any `*.md` file the server can read is parsed with js-yaml, and its frontmatter `title`, `excerpt` and `seoDescription` leak into metadata and the OG image. On Vercel only traced files exist, so exposure is small. Self-hosted, it reaches any readable `.md` file.
- **Remedy.** `readPostFile` only opens slugs matching `^[a-z0-9]+(?:-[a-z0-9]+)*$` (what `toSafeSlug` produces). Test: `utils/__tests__/posts.slugs.spec.ts`.
- **Status.** Fixed in #233 (merged). Verified locally: traversal OG image identical to the unknown-slug fallback, title "Page not found", real posts unchanged.

### SEC-08 · P2 · No rate limiting or bot protection on the contact API

- **Evidence.** There is no limiter, honeypot or challenge in `app/api/contact/route.ts` or the form. `docs/ARCHITECTURE.md:78` says the limit is "handled at the Vercel edge level". Reading the project firewall config through the Vercel API failed with 403 (no access to the `pajand` team scope from this session). 25 rapid invalid `POST`s to production all returned 400 with no 429. That is consistent with no rule, but it does not prove there isn't one: a rule may count only successful requests or use a higher threshold.
- **Exploit scenario.** A script sends valid messages in a loop. The owner's inbox floods and the Resend quota runs out (100/day on the free plan), which silences the real contact channel. The recipient is fixed, so this is not an open relay. SEC-02 removed the browser-borne variant.
- **Proposed remedy (not implemented).**
  1. A Vercel Firewall rate-limit rule on `POST /api/contact`, for example 5 requests per 10 minutes per IP, returning 429. This is configuration only, with no code or contract change. The owner should confirm whether such a rule already exists and fix `docs/ARCHITECTURE.md` to match.
  2. Optionally, a hidden honeypot field (for example `website`) that the server silently accepts and drops when filled. This changes the request contract (new field) and the form markup, so it needs its own PR with tests and an impact note.
  3. An in-memory limiter in the route is not recommended: serverless instances do not share memory. A shared store (Upstash/Vercel KV) would work but adds a dependency.
- **Status.** Fixed. The owner added a Vercel Firewall custom rule (path `/api/contact` AND method `POST`, fixed window, 5 requests per 600 s per client IP, answered with `429`); definition in `docs/CONTACT_RATE_LIMIT.md`. Verified on production on 2026-10-27 with empty-body POSTs (rejected by the handler, so no email): `400 400 400 400 400 429 429`, response header `x-vercel-mitigated: deny`. The form shows a specific message for the `429` (#238). A honeypot is not added; it stays the next step only if edge limiting proves insufficient. Not tested: behaviour behind a shared network.

### SEC-09 · P2 · Analytics load without consent

- **Evidence.** `components/Analytics/GatedGoogleAnalytics.tsx:7-31` renders `gtag.js` with `strategy="afterInteractive"` whenever `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. "Gated" means environment-gated only. `app/layout.tsx:112-114` renders all three analytics components on every page. Production HTML includes `googletagmanager.com/gtag/js?id=G-Y5WGFLJSLR`, so GA is live. Nothing in `app/`, `components/`, `utils/` or `data/` mentions consent, `doNotTrack` or `globalPrivacyControl`. Vercel Web Analytics and Speed Insights are cookieless.
- **Exploit scenario / impact.** The third-party `gtag.js` script is requested and executed before any consent decision is offered. Whether a given visitor then receives GA4's `_ga*` cookies was not observed in a real browser and depends on browser settings and blockers; the verified problem is the script loading before consent. The owner is in Quebec (Law 25) and the site has EU visitors (GDPR/ePrivacy). This is a compliance risk, not a vulnerability, and this review does not give legal advice.
- **Remedy options** (owner decision, tracked as DEC-8 / Q-13 in `docs/design/implementation-audit/`):
  1. Drop GA and rely on Vercel Web Analytics (no cookies). This is the smallest change and removes the issue.
  2. Keep GA behind an explicit opt-in: no `gtag.js` request and no cookie until consent, Consent Mode v2 defaulting to `denied`, GPC/DNT honoured, and a short privacy note.
- **Status.** Open. Owner decision: option 1, remove GA and keep Vercel Web Analytics and Speed Insights. Any future GA integration needs its own consent design and privacy review. Fix in a separate PR.

### SEC-10 · P3 · Dependency advisories

- **Evidence.** `pnpm audit --prod`: 1 high (source-map-js 1.2.1, GHSA-68fv-2mgg-jv7q, via `next>postcss`). `pnpm audit`: 4 high and 1 moderate. brace-expansion 5.0.9 has GHSA-6j4f-fj2g-mc7p, GHSA-qhr7-859c-m2p7 and GHSA-q2hr-2g5m-vwhr. zod 4.4.3 has GHSA-mrhx-c7xc-m3w5. The `brace-expansion: 5.0.9` override in `pnpm-workspace.yaml` is what pinned the vulnerable version.
- **Reachability.** brace-expansion is reached through eslint → minimatch, and zod through eslint-config-next → eslint-plugin-react-hooks. Both run at lint time only. source-map-js is reached through postcss, which reads source maps of repo-authored CSS at build time. None takes input from a site visitor.
- **Remedy.** Overrides `brace-expansion: 5.0.12`, `source-map-js: ">=1.2.2"`, `zod: "^4.6.6"`, mirrored in `package.json`. Afterwards both `pnpm audit` runs report no known vulnerabilities.
- **Status.** Fixed in #234 (merged).

### SEC-11 · P3 · Unsanitised Markdown rendering

- **Evidence.** `utils/posts.ts` passes post bodies to `marked.parse`, and `features/writing/WritingPostProse.tsx` injects the result with `dangerouslySetInnerHTML` (at `780cd8f` this was `WritingPostPageContent.tsx:47`). `marked` 18 does not sanitise: `marked.parse("[x](javascript:alert(1)) <img src=x onerror=alert(1)> <script>alert(1)</script>")` returns all three unchanged.
- **Current exposure.** None of the 16 posts in `content/posts/` contains raw `<script>`, `<iframe>`, event handlers, `javascript:` or `target=` (checked with grep). All rendered content is authored in the repo, so exploiting this needs a merged change to `content/`.
- **Remedy (hardening, optional).** Add a small `marked` renderer hook that drops `javascript:`/`data:` link and image URLs, and either strip raw HTML blocks or run the output through a sanitiser at build time (pages are static, so there is no runtime cost). Not urgent while all content is owner-authored.
- **Fix.** #256 (draft) sanitises the rendered Markdown at build time with `sanitize-html` 2.18.0 against an explicit allowlist (`utils/sanitizePostHtml.ts`, called from `renderPostHtml` in `utils/posts.ts`). Nothing reaches the client bundle. Link URLs are limited to http, https, mailto, relative and `#` fragments, and image URLs to http, https and relative. Entity-encoded schemes (`javascript&colon;`, `&#x6A;avascript:`) are rejected by `isAllowedUrl`, because the library does not decode entities in the byte-preserving mode used here. Hand-written diagram slots fail the build. The rendered HTML of all 16 posts is unchanged. Probes and tests: `utils/__tests__/sanitizePostHtml.spec.ts`.
- **Status.** Fix open in #256 (draft), pending owner review. Until it merges, the trust boundary is still owner-authored Markdown in the repo.

### SEC-19 · P3 · JSON-LD serialisation

- **Evidence.** The JSON-LD components (`components/*JsonLd*`, `HomeStructuredData`, `StructuredData`) inline `JSON.stringify(...)` in `<script type="application/ld+json">` through `dangerouslySetInnerHTML`. `JSON.stringify` does not escape `<`, so a value containing `</script>` (for example a post title) would end the script element early, and the rest would be parsed as HTML.
- **Current exposure.** Values come from repo-owned content and data, so exploiting this needs a merged change. It is listed separately from SEC-11 because the fix is cheap and should not stay an accepted risk.
- **Remedy.** Serialise with a helper that runs `JSON.stringify` and then escapes `<` as `\u003c` (and `>`, `&`, U+2028, U+2029 likewise), which stays valid JSON that parses back to the same object.
- **Status.** Open. Owner decision: fix in a small independent PR.

### SEC-12 · P3 · Forwarded inbound mail hides the original sender

- **Evidence.** `app/api/webhooks/resend/route.ts:84-100` re-sends inbound mail with `from: getFromEmail()` (the owner's verified domain), the original subject and the original HTML. The original sender appears only as `replyTo`, and no SPF/DKIM/DMARC result is passed on.
- **Exploit scenario.** Someone sends spoofed mail to `info@alipajand.com` (for example pretending to be a bank or a recruiter). It arrives in the owner's inbox DKIM-signed by the owner's own domain, with the provider's spam signals lost, and is more convincing than the original.
- **Proposed remedy (not implemented; changes the forwarded email contract).** Prepend a short header block to the forwarded body: original From, To, Date and, if Resend exposes them, the authentication results. Optionally prefix the subject (for example `[info@]`). This needs a separate PR with a webhook test and an impact note.
- **Status.** Open. Owner decision: fix in a separate PR. Prepend a labelled forwarding header with the original From, To and Date when available. Include authentication results only when the provider supplies them in a trustworthy field. Preserve Reply-To, attachments and idempotency. Never present the forwarded message as authenticated just because Resend re-sent it.

### SEC-13 · Info · Webhook verification

Verified sound:

- The raw body is read with `request.text()` and verified before parsing (`route.ts:33-48`).
- `resend.webhooks.verify` → `standardwebhooks@1.1.1` HMAC-SHA256 over `id.timestamp.body`, with `timingSafeEqual`.
- Timestamps outside ±5 minutes are rejected. Locally, a correctly signed request 10 minutes old → 400, a fresh one → 200, a one-byte body change → 400.
- Replays inside the 5-minute window are accepted. The forward uses `idempotencyKey: inbound-forward/<email_id>`, so a replay does not send a second email.
- Recipient filtering uses `received_for`, which is part of the signed payload.
- `GET` → 405. Nothing is logged. Error bodies are generic.

Robustness notes, not exploitable without the secret:

- A malformed `RESEND_WEBHOOK_SECRET` makes the `Webhook` constructor throw inside the `try`, so a misconfiguration shows as `400 Invalid signature` rather than a 5xx.
- A correctly signed empty body makes `verify` return `undefined`, and `event.type` then threw an unhandled `TypeError` (500). The same happened for a signed `null`, an `email.received` event without `data`, non-array recipient lists, and an inbound email or attachment listing without its array. Fixed: the route now answers `400 Invalid payload` to a signed body that is not an event with a string `type` (and, for `email.received`, a non-empty `email_id`), and treats missing or non-array lists as empty. Tests in `app/api/webhooks/resend/__tests__/route.spec.ts` sign real payloads and verify them with the SDK.
- If `CONTACT_EMAIL` were ever set to an `@alipajand.com` address, forwarded mail would come back through the webhook (a forwarding loop). The default is a Gmail address.

### SEC-14 · Info · Personal data in screenshots

Every image under `public/` was viewed:

- `portfolio-media/ledgerguard-dashboard.png`, bottom left: the owner's private login email (not the public contact address). The workspace switcher shows a real workspace name that has no documented permission to publish. Vendor rows (Salesforce, Shopify, BP) and amounts look like sample contracts.
- `portfolio-media/mapbylaw-dashboard.png`, bottom left: the owner's name and private login email. The report cards show a bridge/area address (Pont Île-des-Sœurs, H3C 5K4) and `0.00 CAD` amounts, not a home address or real payments.
- `portfolio-media/tallyfolio-dashboard.png`: income, spending and card balances. The owner has confirmed this is demo data.
- `tallyfolio-landing.png` ("Sample workspace"), `ledgerguard-landing.png`, `ledgerguard-login.png`, `mapbylaw-landing.png`, `alwaysgeeky-login.png`, `alwaysgeeky-marketplace.png`, `data-flow.png`, `writing/agent-readiness-doctor-poster.png`: no personal data beyond the owner's public name and handle.
- PNG metadata: every screenshot carries only an XMP block with pixel dimensions and `UserComment: Screenshot`. There are no paths, usernames, GPS or device fields.

Status: owner decision. Redact before the assets are treated as final: replace the login email with a fictional account and the workspace name with a clearly fictional one, and keep the labels that distinguish real product screenshots from editorial or demo images. Being a file in a public repository is not evidence that its contents are safe to publish. Redacted copies are being made in the case-study branch; the originals are still present on `main` at `03b0539`.

### SEC-15 · Info · Build output, `public/` and environment variables

- `find .next/static -name '*.map'` → 0. `productionBrowserSourceMaps` is not enabled.
- `grep` of `.next/static` for `re_…`, `whsec_`, `RESEND`, `sk_live`, AWS and GitHub token patterns: no hits.
- `NEXT_PUBLIC_*` in source and bundles: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (public by nature), plus Vercel's own `NEXT_PUBLIC_VERCEL_OBSERVABILITY_*`. `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `RESEND_FROM` and `CONTACT_EMAIL` are read only in route handlers and `utils/resend.ts`.
- Email addresses in client bundles: `alipajand@gmail.com` (public contact link, `data/links.ts:2`) and the `you@company.com` placeholder.
- `public/` contains only `manifest.json` and the images above. There are no dotfiles, backups or env files.

### SEC-16 · Info · External links

The three `target="_blank"` sites in code (`components/Projects/ProjectLinkAnchor.tsx:25`, `components/hairline/SiteNavigation/SiteNavigation.tsx:84`, `components/hairline/LinkRows/LinkRows.tsx:35`) all set `rel="noopener noreferrer"`. The rendered HTML of `/`, `/portfolio`, `/open-source`, `/portfolio/ledgerguard`, `/now` and a writing post has no `target="_blank"` without `noopener`. There are no `http://` links in source, data, content or rendered pages. Markdown links in posts open in the same tab.

### SEC-17 · Info · Scheduled posts are public before their date

`getAllPosts()` (not `getPublishedPosts()`) feeds `generateStaticParams`, `app/feed.xml`, `app/sitemap.ts`, `app/llms.txt` and `app/llms-full.txt` (which includes the full Markdown). `/writing` lists upcoming posts with a "Preview article" link. That is deliberate (commit `988004c`), so it is not a confidentiality defect. The SEO side is tracked as A-01 in `docs/design/implementation-audit/09-risk-register.md`. If any future draft must stay private before its date, it must not be committed to `content/posts/`.

### SEC-18 · Info · Configuration robustness

- `utils/resend.ts:42`: `process.env.CONTACT_EMAIL?.trim() ?? "alipajand@gmail.com"` does not fall back when the variable is set to an empty string, so the send would go to `""` and fail. With #232 this now shows a generic error and logs the cause.
- The 503 `"Email service is not configured"` reveals only that the key is missing, which is acceptable.

## Commands run

| Command                                                                                                                             | Result                                             |
| ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `pnpm install --frozen-lockfile`                                                                                                    | pass                                               |
| `pnpm lint` / `pnpm typecheck` / `pnpm test` / `pnpm format:check` on `780cd8f`                                                     | pass (56 suites, 266 tests)                        |
| `pnpm build`                                                                                                                        | pass                                               |
| `pnpm start -p 3464` with `RESEND_BASE_URL` → local mock                                                                            | run                                                |
| `curl -sSI` on `/`, a post, `/api/contact`, an image, `/feed.xml`                                                                   | no security headers before #229, all present after |
| `curl -X POST /api/contact` probes (valid, `text/plain`, CRLF name, address-list email, malformed JSON, 20 MB body, provider error) | findings SEC-02 to SEC-06                          |
| `curl` webhook probes (GET, unsigned, bad signature, 10-minute-old signed, fresh signed, tampered body)                             | 405 / 400 / 400 / 400 / 200 / 400                  |
| `curl /writing/..%2F..%2FREADME[/opengraph-image]`                                                                                  | SEC-07 reproduced; fixed on #233                   |
| `find .next/static -name '*.map'`, `grep` for secrets and emails                                                                    | SEC-15                                             |
| `pnpm audit --prod`                                                                                                                 | fail before #234 (1 high), pass after              |
| `pnpm audit`                                                                                                                        | fail before #234 (4 high, 1 moderate), pass after  |
| `curl -sSI https://alipajand.com/` before and after the merges                                                                      | SEC-01 before; headers live after                  |
| 25 × `POST https://alipajand.com/api/contact` with `{}`                                                                             | 25 × 400, no 429 (SEC-08 inconclusive)             |
| Vercel API `GET firewall config` for the project                                                                                    | 403, no access from this session                   |
| Each fix branch: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`                                                           | pass                                               |

## Not verified

- Whether a Vercel Firewall rate-limit rule exists for `/api/contact` (SEC-08).
- How Resend's API treats a subject containing CR/LF, or a `reply_to` containing a comma (SEC-04, SEC-05).
- Whether Resend's inbound processing applies SPF/DMARC filtering before the webhook fires (SEC-12).
- Real-browser submission of the contact form against the new 415/413 checks. The form sends `application/json` (unit-tested), and the Playwright suite mocks the route rather than calling it.
- Cookies actually set by GA in a browser (SEC-09). Only the script tag in the production HTML was confirmed.
