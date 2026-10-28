# Routes

All routes use the Next.js 16 App Router. Pages are Server Components; interactive parts are small
client islands inside them. The rendering column is what `pnpm build` reports: ○ static, ● static
from `generateStaticParams`, ƒ rendered per request.

## Page routes

| Route                     | File                                  | Rendering | Description                                                                       |
| ------------------------- | ------------------------------------- | --------- | --------------------------------------------------------------------------------- |
| `/`                       | `app/page.tsx`                        | ○         | Homepage: hero, selected work, about, capabilities, open source, writing, contact |
| `/portfolio`              | `app/portfolio/page.tsx`              | ○         | Index of case studies                                                             |
| `/portfolio/[slug]`       | `app/portfolio/[slug]/page.tsx`       | ●         | One case study per dedicated project in `data/projects.ts`                        |
| `/open-source`            | `app/open-source/page.tsx`            | ○         | Open-source tools and the contribution snapshot                                   |
| `/writing`                | `app/writing/page.tsx`                | ○         | Writing index of published posts                                                  |
| `/writing/[slug]`         | `app/writing/[slug]/page.tsx`         | ●         | One article per published post; a scheduled one is a 404 unless it is a preview   |
| `/now`                    | `app/now/page.tsx`                    | ○         | Current focus, dated by `NOW_UPDATED` in `data/now.ts`                            |
| `/engineering-principles` | `app/engineering-principles/page.tsx` | ○         | Engineering principles                                                            |
| `*` (not found)           | `app/not-found.tsx`                   | ○         | 404 page (`noindex`)                                                              |

A post is a draft, scheduled until 00:00 America/Toronto on its `date`, or published
(`utils/publication.ts`). Only published posts appear on `/`, `/writing`, "More writing", the
sitemap, RSS, `llms.txt` and `llms-full.txt`. Every non-draft slug is generated so it exists under
`dynamicParams = false`; before its date the article and OG image answer 404, or a `noindex`
preview without structured data when the post sets `preview: true`. All of this is evaluated when
a route renders. Every one of these routes sets `revalidate = 3600`, so a scheduled post goes live
within about an hour after midnight in Toronto, on the first visit to each route after that, with no
deploy. A deployment publishes it at once.

## API routes

| Route                  | Method | File                               | Description                            |
| ---------------------- | ------ | ---------------------------------- | -------------------------------------- |
| `/api/contact`         | POST   | `app/api/contact/route.ts`         | Contact form handler (Resend)          |
| `/api/webhooks/resend` | POST   | `app/api/webhooks/resend/route.ts` | Forwards inbound mail (Resend webhook) |

See [API.md](API.md) for request and response details.

## Generated files and feeds

| Path                                 | File                                     | Purpose                                         |
| ------------------------------------ | ---------------------------------------- | ----------------------------------------------- |
| `/sitemap.xml`                       | `app/sitemap.ts`                         | XML sitemap                                     |
| `/robots.txt`                        | `app/robots.ts`                          | Crawler rules                                   |
| `/feed.xml`                          | `app/feed.xml/route.ts`                  | RSS feed of posts (`force-static`)              |
| `/llms.txt`                          | `app/llms.txt/route.ts`                  | Site summary for language models                |
| `/llms-full.txt`                     | `app/llms-full.txt/route.ts`             | Full text of case studies and posts             |
| `/opengraph-image`                   | `app/opengraph-image.tsx`                | Default Open Graph image                        |
| `/writing/[slug]/opengraph-image`    | `app/writing/[slug]/opengraph-image.tsx` | Per-article Open Graph image                    |
| `/icon`, `/apple-icon`               | `app/icon.tsx`, `app/apple-icon.tsx`     | Favicon and Apple touch icon                    |
| `/images/profile-{1x1,4x3,16x9}.png` | `app/images/profile-*.png/route.ts`      | Profile images referenced by the Person JSON-LD |

## Redirects

`next.config.ts` redirects `/blog` to `/writing` and `/blog/:slug` to `/writing/:slug`
permanently.

## Slug stability

Post slugs are the filenames in `content/posts/` without `.md`, and case-study slugs are the `slug`
fields in `data/projects.ts`. Do not rename either without adding a redirect: external links and
search rankings depend on them.
