# Positioning

The editorial contract for every public surface: this site, the GitHub profile, and LinkedIn. When
copy on one surface changes, check it against this file first. When a fact here changes, change it
here in the same PR.

## Canonical identity

**Headline:** Senior Software Engineer | React, TypeScript, Next.js, Node.js, PostgreSQL | Frontend
Architecture

It is a professional headline, not an employment title. Historical titles stay as they were.

In site code, the headline is `PROFESSIONAL_HEADLINE` and its dot-separated form is `TAGLINE`, both
in `data/site.ts`. `PERSON_SCHEMA_JOB_TITLE` is `Senior Software Engineer`.

## Target positions

In priority order:

1. Senior Software Engineer (React/TypeScript/Node.js)
2. Senior Full Stack Engineer, frontend-focused
3. Senior Frontend Engineer
4. Frontend Platform / Design Systems Engineer
5. Senior Product Engineer

Full-time and contract, in Canada.

## Two kinds of experience

Keep these apart in every sentence. Neither is dressed up as the other.

- **Professional experience:** production frontend engineering with other engineers. Architecture
  decisions, technical standards, mentoring, performance, testing, shipping.
- **Independent full-stack experience:** products I own across frontend, backend, database,
  background jobs, and delivery. LedgerGuard and TallyFolio.

## Approved timeline

| Period              | Organization                   | Title (exact)                                | Kind         |
| ------------------- | ------------------------------ | -------------------------------------------- | ------------ |
| Feb 2026 – Present  | LedgerGuard                    | Senior Product Engineer, independent product | Independent  |
| Jan 2024 – Jan 2026 | AlwaysGeeky Games              | Senior Frontend Engineer                     | Professional |
| Jul 2022 – Aug 2023 | Emplifi                        | Senior Frontend Engineer                     | Professional |
| Mar 2018 – May 2022 | ControlTech                    | Frontend Engineer                            | Professional |
| 2015 – 2017         | Rayvarz Software Engineering   | UI/UX Designer & Frontend Developer          | Professional |
| 2015 – 2022         | Independent freelance projects | Freelance web developer (Vue.js, Nuxt.js)    | Freelance    |

The site shows years only (`data/experience.ts`); LinkedIn shows months. TallyFolio is an
independent product (development began June 2026) and is not listed as employment.

## Approved claims and their evidence

| Claim                                                                   | Evidence                                                                               |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 9+ years building production web applications, mostly frontend          | Timeline above, 2015 onward                                                            |
| Owned a React/TypeScript component library across four product surfaces | AlwaysGeeky case study                                                                 |
| Design docs, adoption support, mentoring through pairing and review     | AlwaysGeeky case study                                                                 |
| About 80% less unnecessary re-rendering and chart-update paint work     | Emplifi, profiled on the mobile-webview path on lower-powered devices. Owner-confirmed |
| Mentored one to two engineers through Emplifi's formal program          | Emplifi experience entry                                                               |
| LedgerGuard built end to end by one engineer                            | LedgerGuard repository history                                                         |
| LedgerGuard: Next.js, Fastify, PostgreSQL, Redis/BullMQ, Python worker  | LedgerGuard repository                                                                 |
| LedgerGuard: Textract is the OCR fallback; OpenAI does extraction       | LedgerGuard worker                                                                     |
| TallyFolio: integer minor units, RLS per user, pgTAP database tests     | TallyFolio repository                                                                  |

**The 80% figure** is always stated with its scope: unnecessary re-renders and chart-update paint
cost, on lower-powered devices, measured on the mobile-webview path. Never as an overall product,
page-load, or performance number.

**Held back:** the LedgerGuard 90% unit-test coverage figure (`data/projectsPublication.ts`).
LedgerGuard has no enforced coverage report, so no coverage figure is published.

## Capabilities and limits

Four areas, not equal in depth. The homepage states the depth of each.

- **Frontend engineering** (primary specialization): React, TypeScript, Next.js, component
  architecture, accessibility, performance, state management, design systems.
- **Full-stack product development** (independent products, plus API contract work at ControlTech):
  Node.js, Fastify, API development, PostgreSQL, Supabase, authentication, Redis/BullMQ, Python
  workers.
- **Engineering quality:** testing, code review, CI/CD, observability, Git workflows,
  security-conscious implementation, release verification.
- **Technical leadership** (individual contributor): architecture decisions, design docs,
  engineering standards, code review, mentoring, adoption of shared systems.

Do not claim:

- Full-stack _employment_, or nine years of full-stack work.
- People management, team sizes, or direct reports.
- Kubernetes, container orchestration, or multi-cloud expertise. LedgerGuard runs on Railway and
  Vercel with no Dockerfiles.
- AWS beyond what is used: Textract OCR in LedgerGuard.
- Bank integrations in TallyFolio. It has none.
- Customers, revenue, traffic, SLAs, or metrics that are not in the table above.
- Skills that only an AI tool exercised. If it can't be explained in an interview, it isn't listed.

## Who owns which copy

| Surface                   | Source of truth                                         | Applied by         |
| ------------------------- | ------------------------------------------------------- | ------------------ |
| Homepage, portfolio, SEO  | `data/*.ts`, rendered by `features/` and `app/`         | PR to this repo    |
| `llms.txt`, JSON-LD       | Built from `data/` by `utils/llms.ts` and `components/` | PR to this repo    |
| GitHub profile README     | `README.md` in this repo                                | PR to this repo    |
| GitHub bio, company, pins | This file (below)                                       | Owner, GitHub UI   |
| LinkedIn                  | [`linkedin-copy.md`](linkedin-copy.md)                  | Owner, LinkedIn UI |

GitHub profile fields:

- **Bio:** Senior Software Engineer | React, TypeScript, Next.js, Node.js, PostgreSQL | Montreal,
  Canada
- **Company:** empty. Not "Freelance".
- **Pins:** the four developer tools (agent-readiness-action, agent-context-doctor,
  agent-readiness-kit, agent-pr-reviewer-lite). The product repositories are private, so the
  portfolio carries that evidence instead.

## Rules for future edits

1. Change copy in `data/`, not in JSX.
2. A new number needs a source in the table above, added in the same PR.
3. Say which kind of experience a sentence is about. "At AlwaysGeeky" or "independently", never an
   unqualified "I built the backend".
4. Keep employer titles and dates exactly as in the timeline.
5. AI tooling supports the story; it never leads the homepage or replaces employment history.
6. Plain, specific language. No "passionate", "visionary", "world-class", "expert", "thought
   leader".
7. Never publish private repository code, customer data, credentials, internal hostnames, or the
   screenshots listed in `docs/decisions/open.md`.
