export type OpenSourceProjectStatus =
  | "Stable"
  | "Active development"
  | "Experimental"
  | "Maintained"
  | "Archived";

export interface OpenSourceProject {
  title: string;
  repositoryUrl: string;
  summary: string;
  status: OpenSourceProjectStatus;
  format: string;
  testedCapabilitiesLabel: string;
  testedCapabilities: string[];
  contribution: string;
  exampleCommand?: string;
  exampleInput?: string;
  exampleOutput?: string;
  featured?: boolean;
}

export interface OpenSourcePrinciple {
  title: string;
  body: string;
}

export const OPEN_SOURCE_META_TITLE = "Open-Source Engineering Tools | Ali Pajand";
export const OPEN_SOURCE_META_DESCRIPTION =
  "Open-source tools and experiments for code review, agent context quality, frontend reliability, and developer experience.";

export const OPEN_SOURCE_HEADER_OVERLINE = "Open source";
export const OPEN_SOURCE_HEADER_HEADING =
  "Deterministic guardrails for AI-assisted software engineering";
export const OPEN_SOURCE_HEADER_LEDE =
  "I feature the two most complete tools first: one for risky pull-request review, and one for auditing agent instructions before code generation starts.";
export const OPEN_SOURCE_HEADER_INTRO =
  "These repositories focus on concrete engineering controls: deterministic checks, repository-specific guidance, explainable output, and tested CLI behavior. They are presented with examples and capability boundaries rather than GitHub vanity metrics.";

export const OPEN_SOURCE_FEATURED_HEADING = "Featured tools";
export const OPEN_SOURCE_FEATURED_LEDE =
  "These are the first two tools to evaluate because they address the most common failure points in coding-agent workflows: unsafe code review gaps and low-quality agent context.";

export const OPEN_SOURCE_SUPPORTING_HEADING = "Supporting tools";
export const OPEN_SOURCE_SUPPORTING_LEDE =
  "These supporting repositories extend the same workflow into repository readiness and CI enforcement.";

export const OPEN_SOURCE_STATUS_LABEL = "Status";
export const OPEN_SOURCE_FORMAT_LABEL = "Format";
export const OPEN_SOURCE_EXAMPLE_COMMAND_LABEL = "Command";
export const OPEN_SOURCE_EXAMPLE_INPUT_LABEL = "Fixture input";
export const OPEN_SOURCE_EXAMPLE_OUTPUT_LABEL = "CLI output";
export const OPEN_SOURCE_EXAMPLE_DISCLAIMER =
  "Simplified for readability; exact CLI output depends on configuration and repository state.";

export const OPEN_SOURCE_CONTRIBUTION_LABEL = "Contribution";

export const OPEN_SOURCE_REPOSITORY_LINK_LABEL = "Repository";

export const openSourceRepositoryAriaLabel = (projectTitle: string): string =>
  `Open ${projectTitle} repository on GitHub`;

export const OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  {
    title: "Agent PR Reviewer Lite",
    repositoryUrl: "https://github.com/alipajand/agent-pr-reviewer-lite",
    summary:
      "Reviews pull requests and local Git diffs for risky agent-generated changes using deterministic rules instead of opaque AI review.",
    status: "Active development",
    format: "TypeScript CLI",
    testedCapabilitiesLabel: "Tested capabilities",
    testedCapabilities: [
      "Inspects local diffs between two Git refs with deterministic risk rules",
      "Flags auth, billing, security, migration, lockfile, env, and public-route changes",
      "Detects deleted test files and newly added dependencies in package.json diffs",
      "Emits text, JSON, or Markdown reports with configurable fail-on thresholds",
    ],
    contribution:
      "Owned the risk model, CLI interface, diff analysis, output formats, test suite, CI behavior, and repository documentation.",
    exampleCommand: "agent-pr-reviewer-lite --base HEAD~1 --head HEAD",
    exampleInput: `prisma/migrations/20260615_add_billing_table.sql`,
    exampleOutput: `Agent PR Risk: High
Changed risky areas:
- prisma/migrations/20260615_add_billing_table.sql — Database migration changed
- prisma/migrations/20260615_add_billing_table.sql — Pricing or public copy changed
Required human review:
- database migration
- pricing/public copy
CI result:
- fail-on: high
- result: failed`,
    featured: true,
  },
  {
    title: "Agent Context Doctor",
    repositoryUrl: "https://github.com/alipajand/agent-context-doctor",
    summary:
      "Audits AGENTS.md, CLAUDE.md, Cursor rules, Copilot instructions, and prompt documents for quality, safety, contradictions, stale commands, and generic placeholder content.",
    status: "Active development",
    format: "TypeScript CLI",
    testedCapabilitiesLabel: "Tested capabilities",
    testedCapabilities: [
      "Checks AGENTS.md, CLAUDE.md, Cursor rules, and prompt documents",
      "Flags risky instructions such as “skip tests” or “bypass auth”",
      "Detects contradictory testing guidance and missing validation or final-report expectations",
      "Supports JSON and Markdown reports with configurable fail-on thresholds",
    ],
    contribution:
      "Designed deterministic rules, severity reporting, CLI UX, configuration, test coverage, documentation, and CI-friendly exit behavior.",
    exampleCommand: "acd audit",
    exampleInput: `- Run pnpm test before finishing
- Skip tests if the change looks small
- Never edit app/api/contact without approval`,
    exampleOutput: `Agent Context Doctor
──────────────────────────────────────────────────
Repo:    /private/tmp/acd-fixture
Files:   1
Issues:  3 total — 1 high, 0 medium, 2 low
Score:   74 / 100 — needs-work

Context Files:
  ✓ AGENTS.md (agents, 118B)

Issues:
  [high] AGENTS.md:2 — Risky instruction: "skip tests"
    Recommendation: Remove language that lets agents bypass validation, security, or testing. Agents should never skip tests, bypass auth, or commit secrets.
    Evidence: - Skip tests if the change looks small
  [low] AGENTS.md — Instruction references package manager commands but no package.json was found
    Recommendation: Ensure a package.json exists at the repo root so command references can be validated.
  [low] AGENTS.md — No final reporting guidance found
    Recommendation: Add instructions telling the agent what to include in its final report: files changed, commands run, test results, and known limitations.`,
    featured: true,
  },
  {
    title: "Agent Readiness Kit",
    repositoryUrl: "https://github.com/alipajand/agent-readiness-kit",
    summary:
      "Audits whether a repository is ready for coding agents such as Cursor, Codex, Claude Code, and GitHub Copilot.",
    status: "Experimental",
    format: "TypeScript CLI",
    testedCapabilitiesLabel: "What it checks",
    testedCapabilities: [
      "Agent context and instruction files",
      "Documented validation commands",
      "Forbidden-change boundaries",
      "Testing and final-report expectations",
      "Repository structure and agent-facing guidance",
    ],
    contribution:
      "Owned product definition, audit model, CLI behavior, TypeScript implementation, testing strategy, documentation, and release structure.",
  },
  {
    title: "Agent Readiness Action",
    repositoryUrl: "https://github.com/alipajand/agent-readiness-action",
    summary:
      "Runs Agent Readiness Kit audits inside GitHub Actions so repository-readiness checks become part of normal CI.",
    status: "Experimental",
    format: "GitHub Action",
    testedCapabilitiesLabel: "What it provides",
    testedCapabilities: [
      "Reusable GitHub Actions integration",
      "CI-native audit execution",
      "Configurable failure behavior",
      "Repository-level readiness enforcement",
      "Machine-readable and human-readable output",
    ],
    contribution:
      "Owned the GitHub Action interface, workflow integration, configuration surface, documentation, and release packaging.",
  },
];

export const OPEN_SOURCE_SHARED_PRINCIPLES_HEADING = "Shared design principles";

export const OPEN_SOURCE_SHARED_PRINCIPLES: OpenSourcePrinciple[] = [
  {
    title: "Deterministic before probabilistic",
    body: "Repository checks, command validation, file matching, and risk classification should be explainable and reproducible before introducing model-based judgment.",
  },
  {
    title: "Useful in CI",
    body: "Each tool is designed around exit codes, severity thresholds, structured output, and automation-friendly behavior rather than terminal-only demos.",
  },
  {
    title: "Explain the failure",
    body: "A useful guardrail shows what failed, why it matters, and where to fix it instead of returning a generic warning.",
  },
  {
    title: "Support human review",
    body: "The tools automate repeatable checks so engineering attention can stay focused on architecture, product behavior, naming, and trade-offs.",
  },
];

export const OPEN_SOURCE_TECHNOLOGY_HEADING = "Technology and scope";

export const OPEN_SOURCE_TECHNOLOGY_BADGES = [
  "TypeScript",
  "Node.js",
  "CLI design",
  "GitHub Actions",
  "CI/CD",
  "Vitest",
  "Static analysis",
  "Structured JSON output",
  "Markdown reporting",
  "Repository tooling",
  "Developer experience",
] as const;

export const OPEN_SOURCE_CTA_HEADING = "Explore the repositories";
export const OPEN_SOURCE_CTA_BODY =
  "Use the repository links above for direct source access. The broader writing section covers the product and engineering ideas behind these tools without turning the page into a GitHub stats showcase.";
export const OPEN_SOURCE_CTA_PRIMARY_LABEL = "Browse GitHub profile";
export const OPEN_SOURCE_CTA_PRIMARY_HREF = "https://github.com/alipajand";
export const OPEN_SOURCE_CTA_SECONDARY_LABEL = "Read my writing";
export const OPEN_SOURCE_CTA_SECONDARY_HREF = "/writing";
