# Architecture

## Overview

This is a Next.js 16 App Router site written in TypeScript with Tailwind CSS v4 and CSS modules.
All content is TypeScript data in `data/` or Markdown in `content/posts/`. There is no database.
The server-side surface is two API routes: the contact form and the Resend inbound-mail webhook.

## Directory structure

```
app/                     App Router tree: pages, API routes, metadata routes, feeds
  layout.tsx             Root layout: fonts, site shell, analytics, structured data
  page.tsx               Homepage
  portfolio/             /portfolio and /portfolio/[slug]
  open-source/           /open-source
  writing/               /writing, /writing/[slug] and its Open Graph image
  now/                   /now
  engineering-principles/
  api/contact/           POST: sends the contact message through Resend
  api/webhooks/resend/   POST: verifies and forwards inbound mail
  feed.xml/ llms.txt/ llms-full.txt/ images/   generated text and image routes

features/                Page-level sections, one folder per route
  home/ portfolio/ open-source/ writing/ now/ engineering-principles/ not-found/

components/              Shared UI
  hairline/              The site's component kit: shell, navigation, footer, bands, diagrams,
                         screenshot frame, motion toggle, tickers
  Contact/               Contact section and form (react-hook-form)
  *JsonLd/, StructuredData/, HomeStructuredData/   JSON-LD script tags
  RouteChangeFocus/, SkipLink/, NotFoundMainFocus/ Focus management
  Analytics/             Vercel Analytics and Speed Insights, gated

data/                    Typed copy and content: the source of truth for site text
content/posts/           Markdown posts with YAML frontmatter

utils/                   Pure helpers and hooks
  posts.ts               Post loader: js-yaml frontmatter, marked, highlight.js, sanitize-html
  metadata.ts            Per-route Next.js Metadata builders
  projects.ts            Case-study ordering and the public-claim filter
  llms.ts, feed.ts       Builders for /llms.txt, /llms-full.txt and /feed.xml
  motion/                Shared scroll scheduler, useMotion lifecycle, reduced-motion and pause

e2e/                     Playwright specs (run against a production build)
public/                  Static assets: case-study screenshots, post images
docs/                    This documentation, audits, decisions and the design kit
```

## Key data flow

```
data/*.ts            ──► features/ and components/ ──► app/**/page.tsx
content/posts/*.md   ──► utils/posts.ts ──► app/writing/**, feed, sitemap, llms
data/projects.ts     ──► utils/projects.ts (toPublicProject) ──► case studies, llms
app/api/contact      ──► Resend API (server only)
Resend webhook       ──► app/api/webhooks/resend ──► Resend API (forward inbound mail)
```

## Rendering strategy

- Pages are React Server Components. `"use client"` is limited to interactive or animated islands:
  the contact form, navigation menu, screenshot dialog, writing filters and contents, and the
  canvas and scroll-linked motion built on `utils/motion/useMotion`.
- Motion islands share one scroll listener and one animation-frame loop
  (`utils/motion/scrollScheduler.ts`). They pause off screen and in hidden tabs, respect
  `prefers-reduced-motion`, and stop idle animation when the visitor pauses motion.
- Case studies and articles are generated at build time with `generateStaticParams`. Post HTML is
  sanitised against an allowlist during the build (`utils/sanitizePostHtml.ts`).
- `/` and `/writing` are `force-dynamic` so scheduled posts appear on their date. Every other page
  and feed is static. See [ROUTES.md](ROUTES.md).

## Environment variables

| Variable                | Purpose                                                                    | Required                       |
| ----------------------- | -------------------------------------------------------------------------- | ------------------------------ |
| `RESEND_API_KEY`        | Resend key for the contact form and inbound forwarding                     | Yes, or both routes answer 503 |
| `RESEND_WEBHOOK_SECRET` | Verifies Resend webhook signatures                                         | For inbound forwarding         |
| `CONTACT_EMAIL`         | Inbox for contact messages and forwarded mail (has a built-in default)     | No                             |
| `RESEND_FROM`           | Sender address on a verified domain; falls back to `onboarding@resend.dev` | No                             |

`.env.example` documents each one. Never commit real values. All of them are read on the server
only; none is prefixed with `NEXT_PUBLIC_`.

## Security considerations

- Response headers are set in `next.config.ts` (`securityHeaders`): a CSP limited to
  `frame-ancestors`, `base-uri`, `form-action` and `object-src`, plus `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`. HSTS comes from the hosting
  edge. There is no script or style CSP yet.
- `POST /api/contact` accepts only `application/json` bodies up to 64 KB and enforces the field
  limits in `utils/contactFields.ts`. A Vercel Firewall rule rate limits it (5 requests per
  10 minutes per client IP, answered with `429`). The rule lives in the Vercel project, not in this
  repository; [CONTACT_RATE_LIMIT.md](CONTACT_RATE_LIMIT.md) has its definition and how to verify
  it.
- The Resend webhook verifies the Svix signature before reading the event.
- JSON-LD is serialised with `utils/jsonLd.ts`, which escapes characters that could close the
  script element.
- No authentication or authorisation is required for this site.
