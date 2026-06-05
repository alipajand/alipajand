# Data model

All site content is static TypeScript. There is no database. The source of truth for every section is a typed file in `data/`.

## Content files

| File                            | Type                 | Used in                                   |
| ------------------------------- | -------------------- | ----------------------------------------- |
| `data/experience.ts`            | `Experience[]`       | Portfolio page — work history             |
| `data/education.ts`             | `Education[]`        | Portfolio page — education section        |
| `data/expertise.ts`             | `Expertise[]`        | Portfolio page — skills and tools         |
| `data/hiringFit.ts`             | `HiringFit[]`        | Portfolio page — hiring fit signals       |
| `data/howIThink.ts`             | `HowIThink[]`        | Homepage and portfolio — thinking section |
| `data/innovation.ts`            | `Innovation[]`       | Portfolio page — innovation entries       |
| `data/contact.ts`               | `ContactInfo`        | Homepage contact section                  |
| `data/contactForm.ts`           | `ContactFormField[]` | Contact form field definitions            |
| `data/engineeringPrinciples.ts` | `Principle[]`        | Engineering principles page               |
| `data/about.ts`                 | `About`              | Portfolio about section                   |
| `data/posts/`                   | `Post[]`             | Writing section — post metadata index     |

## Writing / blog posts

Blog posts are Markdown files in `content/`. They are loaded at build time by `utils/posts.ts`.

### Frontmatter schema

```yaml
---
title: string # Post title (required)
date: string # ISO date YYYY-MM-DD (required)
description: string # One-line summary for listings and OG tags (required)
tags: string[] # Topic tags (optional)
---
```

The slug is the filename without the `.md` extension. Slugs must be stable — changing a filename breaks existing URLs.

## Key TypeScript types

Canonical types are colocated with their data files. These are the main shapes:

```ts
type Experience = {
  company: string;
  role: string;
  period: string;
  description: string;
  tags?: string[];
};

type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
};
```

All types are inferred from their data files — there is no separate `types/` directory.
