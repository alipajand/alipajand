# Data model

All site content is static TypeScript or Markdown. There is no database. Types live next to their
data; there is no separate `types/` directory.

## Content files

| File                                                         | Holds                                                                                  | Used by                                     |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------- |
| `data/site.ts`                                               | Name, canonical URL, tagline, meta descriptions, keywords, schema ids                  | Layout, metadata, JSON-LD, footer, llms     |
| `data/homepage.ts`                                           | Hero copy, selected-work cards, strata layers                                          | `features/home`                             |
| `data/about.ts`, `data/hiringFit.ts`, `data/selectedWork.ts` | Homepage sections                                                                      | `features/home`                             |
| `data/projects.ts`                                           | `Project` records: case-study sections, figures, decisions, links; portfolio page copy | Portfolio routes, llms, JSON-LD             |
| `data/projectsPublication.ts`                                | Claims withheld from public surfaces, and per-project public overrides                 | `utils/projects.ts` (`toPublicProject`)     |
| `data/projectsDisplay.ts`, `data/projectsUi.ts`              | Case-study display names and UI labels                                                 | `features/portfolio`                        |
| `data/portfolioIndex.ts`, `data/portfolioFit.ts`             | Portfolio index copy                                                                   | `features/portfolio`                        |
| `data/openSourcePage.ts`, `data/openSourceTools.ts`          | Open-source page copy and tool list                                                    | `features/open-source`, `features/home`     |
| `data/openSourceActivity.ts`                                 | Dated snapshot of public contributions, with its source, for the activity graph        | `features/open-source`                      |
| `data/writing.ts`                                            | Writing labels and index copy                                                          | Writing routes, home writing section        |
| `data/diagrams.ts`                                           | Labels for the MCP workflow diagram                                                    | `features/writing`, design kit              |
| `data/now.ts`                                                | `/now` sections and the hand-set `NOW_UPDATED` date                                    | `/now`, sitemap                             |
| `data/engineeringPrinciples.ts`                              | Principles and their evidence links                                                    | `/engineering-principles`                   |
| `data/contact.ts`, `data/contactForm.ts`                     | Contact section copy, form labels and error messages                                   | `components/Contact`                        |
| `data/links.ts`                                              | Public profile links (GitHub, LinkedIn, email, booking)                                | Navigation, footer, contact, JSON-LD        |
| `data/nav.ts`, `data/footer.ts`, `data/pageChrome.ts`        | Site shell labels                                                                      | `components/hairline`                       |
| `data/breadcrumbs.ts`                                        | Breadcrumb trails per route                                                            | Breadcrumb components and BreadcrumbList    |
| `data/notFound.ts`                                           | 404 copy                                                                               | `app/not-found.tsx`, `features/not-found`   |
| `data/profileImage.ts`                                       | Profile image variants                                                                 | `/images/profile-*.png`, Person JSON-LD     |
| `data/testimonials.ts`                                       | Peer quotes                                                                            | `components/Testimonials` (not on any page) |

## Writing posts

Posts are Markdown files in `content/posts/`. `utils/posts.ts` reads them at build time, parses the
frontmatter with js-yaml, renders Markdown with marked and highlight.js, and sanitises the HTML
(`utils/sanitizePostHtml.ts`). A fenced ` ```diagram ` block becomes a diagram figure
(`utils/diagramBlocks.ts`).

### Frontmatter schema

```yaml
---
title: string # Post title (required)
date: string # YYYY-MM-DD, read as a Toronto calendar day (required)
excerpt: string # One-line summary for listings, cards and the feed (required)
seoTitle: string # Optional page/OG/Twitter title override
seoDescription: string # Optional page/OG/Twitter description override
featured: boolean # Optional; pins the post on the homepage and writing index
tags: string[] # Topic tags (optional)
---
```

The slug is the filename without `.md`. Slugs must be stable: renaming a file breaks existing
URLs. A post dated after today is treated as scheduled; see
[decisions/writing-publication-policy.md](decisions/writing-publication-policy.md).

## Key TypeScript types

```ts
// utils/posts.ts
interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  tags?: string[];
  contentHtml: string;
  headings: PostHeading[];
  diagrams: DiagramSpec[];
}

// data/projects.ts
interface Project {
  id: string;
  slug: string;
  hasDedicatedCaseStudy: boolean;
  name: string;
  caseStudyTitle: string;
  caseStudyMetaTitle: string;
  caseStudyMetaDescription: string;
  employerContext: string;
  cardProblem: string;
  role: string;
  timeframe?: string;
  capabilityTags: string[];
  caseStudy: ProjectCaseStudy;
  liveLinks: ProjectLink[];
  relatedLinks: ProjectLink[];
}
```

Public surfaces read projects through `utils/projects.ts`. Its `toPublicProject` applies the
overrides in `data/projectsPublication.ts` and throws if a withheld figure is still present.
