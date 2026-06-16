export interface OpenSourceProject {
  title: string;
  repositoryUrl: string;
  summary: string;
  checklistLabel: string;
  checklistItems: string[];
  contribution: string;
}

export interface OpenSourcePrinciple {
  title: string;
  body: string;
}

export const OPEN_SOURCE_META_TITLE = "Open-Source Engineering Tools — Ali Pajand";
export const OPEN_SOURCE_META_DESCRIPTION =
  "Open-source tools and experiments for code review, agent context quality, frontend reliability, and developer experience.";

export const OPEN_SOURCE_HEADER_OVERLINE = "Open source";
export const OPEN_SOURCE_HEADER_HEADING =
  "Deterministic guardrails for AI-assisted software engineering";
export const OPEN_SOURCE_HEADER_LEDE =
  "A family of open-source TypeScript tools for making coding-agent workflows safer, more explainable, and easier to operate in real repositories.";
export const OPEN_SOURCE_HEADER_INTRO =
  "The common problem is not whether coding agents can generate code. It is whether a repository gives them clear instructions, valid commands, safe boundaries, useful feedback, and reliable CI checks. These tools address that workflow from repository setup through pull-request review.";

export const OPEN_SOURCE_TOOLKIT_HEADING = "The toolkit";
export const OPEN_SOURCE_TOOLKIT_LEDE =
  "Each project focuses on a different failure point in agent-assisted development while sharing the same design principles: deterministic checks, explainable output, CI-friendly behavior, and no hidden model judgment.";

export const OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  {
    title: "Agent Readiness Kit",
    repositoryUrl: "https://github.com/alipajand/agent-readiness-kit",
    summary:
      "Audits whether a repository is ready for coding agents such as Cursor, Codex, Claude Code, and GitHub Copilot.",
    checklistLabel: "What it checks",
    checklistItems: [
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
    title: "Agent Context Doctor",
    repositoryUrl: "https://github.com/alipajand/agent-context-doctor",
    summary:
      "Audits AGENTS.md, CLAUDE.md, Cursor rules, Copilot instructions, and prompt documents for quality, safety, contradictions, and repository alignment.",
    checklistLabel: "What it checks",
    checklistItems: [
      "Contradictory instructions",
      "Generic placeholder sections",
      "Missing or invalid commands",
      "Unsafe skip-tests guidance",
      "Overlong context files",
      "Missing forbidden-change boundaries",
      "Missing final-report requirements",
    ],
    contribution:
      "Designed deterministic rules, severity reporting, CLI UX, configuration, test coverage, documentation, and CI-friendly exit behavior.",
  },
  {
    title: "Agent PR Reviewer Lite",
    repositoryUrl: "https://github.com/alipajand/agent-pr-reviewer-lite",
    summary:
      "Reviews pull requests and local Git diffs for risky agent-generated changes using deterministic rules instead of opaque AI review.",
    checklistLabel: "What it checks",
    checklistItems: [
      "Authentication and authorization changes",
      "Billing and pricing changes",
      "Security-sensitive files",
      "Database migrations",
      "Routes, environment variables, and dependencies",
      "Missing or weakened tests",
    ],
    contribution:
      "Owned the risk model, CLI interface, diff analysis, output formats, test suite, CI behavior, and repository documentation.",
  },
  {
    title: "Agent Readiness Action",
    repositoryUrl: "https://github.com/alipajand/agent-readiness-action",
    summary:
      "Runs Agent Readiness Kit audits inside GitHub Actions so repository-readiness checks become part of normal CI.",
    checklistLabel: "What it provides",
    checklistItems: [
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
  "Each project includes documentation, examples, validation behavior, and implementation details for teams experimenting with AI-assisted development.";
export const OPEN_SOURCE_CTA_PRIMARY_LABEL = "View GitHub profile";
export const OPEN_SOURCE_CTA_PRIMARY_HREF = "https://github.com/alipajand";
export const OPEN_SOURCE_CTA_SECONDARY_LABEL = "Read my writing";
export const OPEN_SOURCE_CTA_SECONDARY_HREF = "/writing";
