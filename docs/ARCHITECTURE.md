# Architecture

## Overview

This is a Next.js 15 App Router website. It is a static-first site: all content is either TypeScript data files or Markdown. There are no databases. The only runtime server concern is a single API route for the contact form.

## Directory structure

```
app/                    Next.js App Router tree
  layout.tsx            Root layout (font, analytics, smooth scroll)
  page.tsx              Homepage
  portfolio/            /portfolio route
  writing/              /writing route (blog listing + posts)
  now/                  /now route (current status)
  engineering-principles/ /engineering-principles route
  api/contact/          POST handler — sends email via Resend

features/               Page-level feature modules, colocated with their logic
  home/                 Sections rendered on the homepage
  portfolio/            Sections rendered on the portfolio page
  writing/              Writing list and article rendering
  now/                  Current-status page content
  engineering-principles/ Engineering principles page content

components/             Shared UI components (About, Hero, Nav, etc.)
  <Name>/__tests__/     Colocated Jest tests for each component

data/                   Static typed content — source of truth for all copy
  experience.ts         Work history entries
  education.ts          Education entries
  skills / expertise     Skills and expertise data
  howIThink.ts          "How I Think" section content
  innovation.ts         Innovation entries
  hiringFit.ts          Hiring fit signals
  posts/                Post metadata index

content/                Markdown files for the writing/blog section
  *.md                  Individual posts with gray-matter frontmatter

utils/                  Pure helpers, hooks, and shared logic
  posts.ts              Markdown post loader (gray-matter + fs)
  metadata.ts           Shared Next.js metadata builder
  hooks/                Custom React hooks

public/                 Static assets (images, fonts, OG images)
```

## Key data flow

```
data/*.ts  ──►  features/ / components/  ──►  app/page.tsx
content/*.md ──► utils/posts.ts ──► app/writing/[slug]/page.tsx
app/api/contact ──► Resend API  (server only, POST)
```

## Rendering strategy

- **Default: React Server Components.** Use `"use client"` only for interactivity (hooks, browser APIs, animations).
- Static pages use `generateStaticParams` / `generateMetadata` for SEO.
- GSAP animations and Lenis scroll are client-side only, wrapped in `"use client"` components.

## Environment variables

| Variable | Purpose | Required |
| --------------------- | ------------------------- | -------- |
| `RESEND_API_KEY` | Contact form email sender | Yes |
| `CONTACT_TO_EMAIL` | Recipient email address | Yes |

See `.env.example` for the full list. Never commit real values.

## Security considerations

- The `app/api/contact` route is the only external API call surface. It uses server-side secrets only.
- No authentication or authorization is required for this site.
- All environment variables are server-side only; none are exposed to the client bundle.
- Rate limiting for the contact form is handled at the Vercel edge level.
