# Routes

All routes use the Next.js 15 App Router. Pages are Server Components by default.

## Page routes

| Route                     | File                                  | Description                                                         |
| ------------------------- | ------------------------------------- | ------------------------------------------------------------------- |
| `/`                       | `app/page.tsx`                        | Homepage — hero, proof strip, selected work, contact teaser         |
| `/portfolio`              | `app/portfolio/page.tsx`              | Full portfolio — about, experience, case studies, skills, education |
| `/writing`                | `app/writing/page.tsx`                | Blog post listing                                                   |
| `/writing/[slug]`         | `app/writing/[slug]/page.tsx`         | Individual blog post (Markdown from `content/`)                     |
| `/now`                    | `app/now/page.tsx`                    | Current status (what I'm working on)                                |
| `/engineering-principles` | `app/engineering-principles/page.tsx` | Engineering philosophy and principles                               |
| `*` (not found)           | `app/not-found.tsx`                   | 404 page                                                            |

## API routes

| Route          | Method | File                       | Description                   |
| -------------- | ------ | -------------------------- | ----------------------------- |
| `/api/contact` | POST   | `app/api/contact/route.ts` | Contact form handler (Resend) |

## Special files

| File                      | Purpose                                   |
| ------------------------- | ----------------------------------------- |
| `app/sitemap.ts`          | Auto-generated XML sitemap                |
| `app/robots.ts`           | robots.txt configuration                  |
| `app/layout.tsx`          | Root layout — fonts, analytics, providers |
| `app/apple-icon.tsx`      | Apple touch icon (generated)              |
| `app/icon.tsx`            | Favicon (generated)                       |
| `app/opengraph-image.tsx` | Default OG image (generated)              |

## Slug stability

Blog post slugs are derived from `content/*.md` filenames. **Do not rename Markdown files** without setting up redirects — external links and SEO rankings depend on slug stability.
