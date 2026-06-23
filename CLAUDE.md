# CLAUDE.md

This file gives Claude Code project-specific instructions for `alipajand/alipajand`.

## Project identity

This repository powers Ali Pajand's personal portfolio site.

Primary goal: make the site work as a senior-level hiring and credibility surface for a design-minded Senior Frontend / Product Engineer.

Core positioning:

- Senior Product Engineer / Senior Frontend Engineer
- Frontend architecture, React, Next.js, TypeScript
- Design systems, accessibility, visual polish, interaction quality
- AI product workflows and developer experience
- Workflow-heavy SaaS, dashboards, async states, data-heavy UI

The site should help recruiters and hiring managers quickly understand:

1. Ali is available for senior frontend/product engineering opportunities.
2. Ali can own ambiguous product work from UX direction through production implementation.
3. Ali has credible depth in React/Next.js/TypeScript, design systems, AI-assisted interfaces, dashboards, accessibility, and DX.
4. Portfolio work is not just visual output; it shows product decisions, engineering tradeoffs, systems thinking, and shipped behavior.

## Current stack

Use the repository as the source of truth, but expect this baseline:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Markdown/content-driven writing or case study pages where applicable
- Jest / Testing Library
- ESLint
- Prettier
- pnpm

## Commands

Before finishing meaningful changes, run the smallest relevant validation set first, then broader checks when the change touches shared code.

Common commands:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format:check
```

Use `pnpm` only. Do not introduce npm, yarn, or bun lockfiles.

## Branch and workflow

- Work on `develop` unless explicitly told otherwise.
- Keep commits focused and easy to review.
- Prefer small, precise changes over broad rewrites.
- Do not rewrite unrelated pages or components while fixing one page.
- Do not silently change resume facts, dates, project claims, links, or public positioning.
- Do not add fictional metrics, company impact numbers, customers, revenue, or team sizes.
- If evidence is weak, improve structure and wording instead of inventing proof.

## Product/content direction

### Homepage

The homepage should make Ali's positioning obvious in the first screen:

- Senior frontend/product engineer
- React / Next.js / TypeScript
- Design systems
- AI product workflows
- Accessibility / performance / DX
- Clear CTA to portfolio and contact

Avoid vague lines like "I build digital experiences" unless immediately supported by concrete senior-engineering evidence.

### Portfolio

The `/portfolio` page should be a clean index of case studies, not a heavy visual gallery.

Preferred direction:

- List case studies with concise summaries.
- Keep the page lightweight and scannable.
- Do not require large images on the index page unless they add real clarity.
- Each major project should have or link to a dedicated case study page.

Priority case studies:

1. LedgerGuard
2. AlwaysGeeky Games
3. Emplifi
4. ControlTech
5. Agent Tooling / Open Source
6. MapBylaw, if relevant and strong enough

Case studies should explain:

- Problem / context
- Ali's role
- Constraints
- UX/product decisions
- Frontend architecture decisions
- Design system or component decisions
- AI/data/async state handling where relevant
- Accessibility, performance, testing, or DX work
- Outcome or evidence, without inventing unsupported metrics

### Writing

The writing section should reinforce senior judgment, not read like generic blog filler.

Good topics:

- How Ali uses AI tools in real engineering work
- AI-assisted development without outsourcing judgment
- Design systems as product infrastructure
- Async states and human-in-the-loop AI UX
- Frontend architecture for workflow-heavy SaaS
- Accessibility as product quality
- Developer experience and pre-merge quality checks

When adding writing, keep it practical, direct, and based on Ali's actual work.

### Open source

Open-source work should support the AI/DX positioning.

Important projects to surface:

- `agent-context-doctor`
- `agent-pr-reviewer-lite`
- `agent-readiness-kit/action`

Position them as practical developer-experience tools for safer AI-assisted coding and review workflows.

### Engineering principles

This page should sound like an experienced engineer's operating model.

Emphasize:

- Product clarity before code volume
- Strong defaults and simple systems
- Accessible interfaces
- Explicit async/error/empty states
- Design systems as reusable product infrastructure
- AI as acceleration, not authority
- Tests and CI as guardrails

## Style rules

Use direct, senior, human language.

Prefer:

- Specific nouns and verbs
- Concrete product and engineering evidence
- Scannable sections
- Clear hierarchy
- Short paragraphs
- Practical claims

Avoid:

- Generic portfolio clichés
- Overly poetic copy
- Overloaded hero sections
- Fake metrics
- Excessive animation
- Design-only positioning that hides engineering depth
- Engineering-only positioning that hides product/design strength
- Claims that Ali managed teams unless the source content says so

## UI rules

- Keep layouts responsive and polished on mobile and desktop.
- Preserve accessibility: semantic HTML, keyboard states, focus states, color contrast, reduced-motion behavior where applicable.
- Keep typography consistent.
- Avoid adding heavy dependencies for simple UI changes.
- Prefer existing components and design tokens before adding new primitives.
- Make screenshots/images optional support, not required for understanding the portfolio.
- Avoid visual complexity on recruiter-facing index pages.

## Implementation rules

- Read nearby files before changing structure.
- Preserve existing routing conventions.
- Prefer server components unless client interactivity is actually needed.
- Keep client components small and intentional.
- Do not introduce unnecessary global state.
- Do not add new packages without a clear reason.
- Do not remove SEO metadata, analytics, accessibility affordances, or structured content without replacing them properly.
- Keep content easy to edit later.

## Validation expectations

For content-only changes:

```bash
pnpm lint
pnpm typecheck
```

For component/layout changes:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

For route, metadata, build, dependency, or config changes:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If a command fails, report:

- The exact command
- The failure summary
- Whether the failure appears related to the change
- What was fixed or what remains unresolved

## How to work with Ali

Ali usually wants the assistant to make the product/content decisions and give Claude or Cursor tightly scoped execution tasks.

When implementing:

- Do not make broad product strategy decisions silently.
- Do not expand scope just because the codebase has nearby issues.
- Do not replace precise content with generic copy.
- Do not ask Ali to decide details that can be resolved from the stated direction.
- Do ask when a change would affect positioning, factual claims, public contact details, or project scope.

When summarizing work, include:

- What changed
- Why it changed
- Files touched
- Validation run
- Any follow-up risks

## Public facts to keep consistent

- Name: Ali Pajand
- Location: Montreal, Canada
- Site: alipajand.com
- Positioning: Senior Product Engineer / Senior Frontend Engineer
- Experience: 9+ years
- Core technologies: React, Next.js, TypeScript, design systems, accessibility, dashboards, AI product workflows, developer experience
- Recent work includes LedgerGuard, AlwaysGeeky Games, Emplifi, ControlTech, and AI/DX open-source tooling

Do not publish private personal details beyond what already appears in the public site or resume-style content.
