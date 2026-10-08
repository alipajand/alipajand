# Ali Pajand

Staff Frontend Engineer, frontend architecture, design systems, and full-stack product work

I've spent 9+ years building production products in React, TypeScript, and Next.js. I focus on frontend architecture, design systems, and complex SaaS workflows, and I also build the Node.js/Fastify APIs, PostgreSQL models, and background jobs behind them.

**Available for senior frontend, full-stack, and product engineering roles.**

[alipajand.com](https://alipajand.com) · [Portfolio](https://alipajand.com/portfolio) · [LinkedIn](https://www.linkedin.com/in/alipajand/) · [Book a call](https://calendly.com/alipajand/intro)

## What I work on

- **Frontend architecture:** component APIs, rendering performance, and async, error, and empty states in data-heavy UI
- **Design systems:** shared component libraries, Storybook, accessibility defaults, and the conventions that keep them consistent
- **Full-stack delivery:** Node.js/Fastify APIs, PostgreSQL, auth, queue-backed background workers, and CI/CD
- **AI product workflows:** interfaces where model output stays unconfirmed until a person has reviewed it
- **Developer experience:** code review standards, CI quality gates, and tools for safer AI-assisted coding

## Case studies

| Project                                                          | What it shows                                                                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [LedgerGuard](https://alipajand.com/portfolio/ledgerguard)       | Multi-tenant AI contract intelligence SaaS, built end to end: Next.js, Fastify, PostgreSQL, document pipeline |
| [AlwaysGeeky Games](https://alipajand.com/portfolio/alwaysgeeky) | Shared React/TypeScript component library across four product surfaces, with CI gates and accessibility rules |
| [Emplifi](https://alipajand.com/portfolio/emplifi)               | D3.js enterprise analytics, including an 80% cut in unnecessary re-renders and chart paint work in webviews   |
| [Agent tooling](https://alipajand.com/portfolio/agent-tooling)   | Deterministic TypeScript CLIs and a GitHub Action for AI-assisted development                                 |
| [TallyFolio](https://alipajand.com/portfolio/tallyfolio)         | Privacy-first personal finance PWA with deterministic money math and CSV import review                        |
| [ControlTech](https://alipajand.com/portfolio/controltech)       | Four years of taking early-stage SaaS products and PWAs from MVP to production                                |

## Open source

Local-first developer tools that make AI-assisted coding and review safer. No LLM in the loop.

- [**agent-context-doctor**](https://github.com/alipajand/agent-context-doctor): audits `AGENTS.md`, `CLAUDE.md`, Cursor and Copilot rules, and committed Claude Code and MCP settings for contradictions, stale commands, secrets, and risky permissions
- [**agent-pr-reviewer-lite**](https://github.com/alipajand/agent-pr-reviewer-lite): deterministic pre-screen that flags the files in a pull request that need human review before merge
- [**agent-readiness-kit**](https://github.com/alipajand/agent-readiness-kit): scores how ready a repository is for AI coding agents across 13 categories and scaffolds the missing files
- [**agent-readiness-action**](https://github.com/alipajand/agent-readiness-action): GitHub Action that runs agent-readiness-kit and agent-context-doctor on pull requests

## Writing

- [How I use AI in my frontend engineering workflow](https://alipajand.com/writing/how-i-use-ai-in-my-frontend-engineering-workflow)
- [How I approach senior frontend architecture](https://alipajand.com/writing/how-i-approach-senior-frontend-architecture)
- [The quiet failure mode in contract AI](https://alipajand.com/writing/ledgerguard-truth-between-extraction-and-finance)
- [Design systems that stick](https://alipajand.com/writing/design-systems-that-stick)

More in [/writing](https://alipajand.com/writing) and [engineering principles](https://alipajand.com/engineering-principles).

## About this repo

This repo is the source for [alipajand.com](https://alipajand.com): Next.js App Router, React, TypeScript, and Tailwind CSS, with Markdown-driven writing and case studies, deployed on Vercel.

```bash
pnpm install
pnpm dev
```

Checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`. Architecture and route notes are in [`docs/`](docs/).
