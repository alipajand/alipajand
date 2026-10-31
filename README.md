# Ali Pajand

Senior Software Engineer | React · TypeScript · Next.js · Node.js · PostgreSQL

I'm a software engineer based in Montreal, Canada, with 9+ years building production web applications. My strongest background is frontend architecture, React, TypeScript, Next.js, and design systems. I also build full-stack products independently, including Node.js APIs, PostgreSQL data models, authentication, and asynchronous processing.

## Engineering experience

- **AlwaysGeeky Games:** Owned a React/TypeScript component library shared across four product surfaces, with architecture documentation, accessibility standards, mentoring, and CI quality checks.
- **Emplifi:** Built enterprise analytics interfaces with React, TypeScript, and D3.js, including performance optimization for constrained mobile webviews.
- **LedgerGuard:** Independently developed a contract-intelligence application across Next.js, Fastify, PostgreSQL, and queue-backed document processing.

## Selected work

- [LedgerGuard](https://alipajand.com/portfolio/ledgerguard) — Independent full-stack product development
- [AlwaysGeeky Games](https://alipajand.com/portfolio/alwaysgeeky) — Shared frontend architecture and engineering standards
- [Emplifi](https://alipajand.com/portfolio/emplifi) — Enterprise analytics and performance engineering
- [TallyFolio](https://alipajand.com/portfolio/tallyfolio) — Personal finance product engineering

## Developer tools

TypeScript CLIs and a GitHub Action I build and maintain as developer-experience engineering: deterministic checks for repositories that use AI coding agents, with no LLM in the loop.

- [**agent-context-doctor**](https://github.com/alipajand/agent-context-doctor): audits `AGENTS.md`, `CLAUDE.md`, Cursor and Copilot rules, and committed Claude Code and MCP settings for contradictions, stale commands, secrets, and risky permissions
- [**agent-pr-reviewer-lite**](https://github.com/alipajand/agent-pr-reviewer-lite): deterministic pre-screen that flags the files in a pull request that need human review before merge
- [**agent-readiness-kit**](https://github.com/alipajand/agent-readiness-kit): scores how ready a repository is for AI coding agents across 13 categories and scaffolds the missing files
- [**agent-readiness-action**](https://github.com/alipajand/agent-readiness-action): GitHub Action that runs agent-readiness-kit and agent-context-doctor on pull requests; its integrations work was [selected for the XERJ Corpus Hub](https://hub.xerj.org/contributors/alipajand) as an attributed reference

More in the [agent tooling case study](https://alipajand.com/portfolio/agent-tooling) and on [/open-source](https://alipajand.com/open-source).

## Links

- Website: [alipajand.com](https://alipajand.com)
- Portfolio: [alipajand.com/portfolio](https://alipajand.com/portfolio)
- LinkedIn: [linkedin.com/in/alipajand](https://www.linkedin.com/in/alipajand/)

## About this repo

This repo is the source for [alipajand.com](https://alipajand.com): Next.js App Router, React, TypeScript, and Tailwind CSS, with Markdown-driven writing and case studies, deployed on Vercel.

```bash
pnpm install
pnpm dev
```

Checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`. Architecture, route and data notes are in [`docs/`](docs/).
