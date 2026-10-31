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
  portfolio/             /portfolio and /portfolio/[slug], each with its own Open Graph image
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
docs/                    This documentation, the decision register and the design kit
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
- Every page and feed is static except `/open-source`, which renders per request. One function
  (`utils/publication.ts`) decides which posts are published each time a route renders. The routes
  that list or serve posts re-render hourly (ISR), each one independently, so a scheduled post
  reaches each surface separately: no surface sees it before the first request an hour or more
  after its date, and only a deployment publishes it everywhere at once. See
  [ROUTES.md](ROUTES.md).

## Environment variables

| Variable                | Purpose                                                                            | Required                                       |
| ----------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------- |
| `RESEND_API_KEY`        | Resend key for the contact form and inbound forwarding                             | Yes, or both routes answer 503                 |
| `RESEND_WEBHOOK_SECRET` | Verifies Resend webhook signatures                                                 | For inbound forwarding                         |
| `CONTACT_EMAIL`         | Inbox for contact messages and forwarded mail (has a built-in default)             | No                                             |
| `RESEND_FROM`           | Sender address on a verified domain; falls back to `onboarding@resend.dev`         | No                                             |
| `GITHUB_TOKEN`          | Reads the live contribution calendar on `/open-source` (classic, `read:user` only) | No; the committed snapshot is shown without it |

`.env.example` documents each one. Never commit real values. All of them are read on the server
only; none is prefixed with `NEXT_PUBLIC_`.

## Security considerations

- Response headers are set in `next.config.ts` (`securityHeaders`). HSTS comes from the hosting
  edge.
- `POST /api/contact` accepts only `application/json` bodies with a size cap and enforces the field
  limits in `utils/contactFields.ts`. It is rate limited at the edge; the rule is project
  configuration in Vercel, not code in this repository.
- The Resend webhook verifies the Svix signature before reading the event.
- JSON-LD is serialised with `utils/jsonLd.ts`, which escapes characters that could close the
  script element.
- No authentication or authorisation is required for this site.
