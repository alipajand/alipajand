export interface OpenSourceArticle {
  title: string;
  href: string;
}

export interface OpenSourceProject {
  title: string;
  repositoryUrl: string;
  summary: string;
  /** Latest tagged release, without the leading "v". */
  version: string;
  releasedOn: string;
  format: string;
  /** Install command or workflow line for the latest release. */
  install: string;
  testedCapabilitiesLabel: string;
  testedCapabilities: string[];
  contribution: string;
  articles?: OpenSourceArticle[];
}

export interface OpenSourcePrinciple {
  title: string;
  body: string;
}

export const OPEN_SOURCE_META_TITLE =
  "Open Source & Developer Tooling — Ali Pajand · Staff Frontend Engineer";
export const OPEN_SOURCE_META_DESCRIPTION =
  "Deterministic, local-first TypeScript tools and a GitHub Action for AI-agent readiness, agent instruction and settings audits, and risky pull-request triage. No LLM calls.";

export const OPEN_SOURCE_HEADER_OVERLINE = "Open source";
export const OPEN_SOURCE_HEADER_HEADING = "Open Source & Tooling";
export const OPEN_SOURCE_HEADER_LEDE =
  "I build small, deterministic tools that make AI-assisted coding and review safer: they check the context agents read, the settings agents run with, and the pull requests agents open.";
export const OPEN_SOURCE_HEADER_INTRO =
  "They run locally or in CI, make no LLM calls, and are built to complement human review, not replace it.";

export const OPEN_SOURCE_PROJECTS_HEADING = "Projects";
export const OPEN_SOURCE_PROJECTS_LEDE =
  "Three CLIs and the GitHub Action that runs two of them in CI. Each one checks a single gap in an AI-assisted workflow and leaves the decision with a human reviewer.";

export const OPEN_SOURCE_RELEASE_LABEL = "Latest release";

export const OPEN_SOURCE_INSTALL_LABEL = "Install";

export const OPEN_SOURCE_INSTALL_NOTE =
  "None of these tools are published to npm, and the npm packages that share their names belong to unrelated projects. Install from the GitHub release tags shown on each card.";
export const OPEN_SOURCE_FORMAT_LABEL = "Format";

export const OPEN_SOURCE_CONTRIBUTION_LABEL = "What it demonstrates";

export const OPEN_SOURCE_REPOSITORY_LINK_LABEL = "Repository";

export const OPEN_SOURCE_ARTICLES_LABEL = "Related writing";

const ARTICLE_INSTRUCTION_FILES: OpenSourceArticle = {
  title: "Agent instruction files are code. Lint them like code.",
  href: "/writing/agent-instructions-are-code",
};

const ARTICLE_REVIEW_TRIAGE: OpenSourceArticle = {
  title: "Which agent-written changes does a human need to read?",
  href: "/writing/deterministic-review-triage-for-agent-prs",
};

const ARTICLE_UNTRUSTED_PRS: OpenSourceArticle = {
  title: "Building CI tools for pull requests you don't trust",
  href: "/writing/ci-tools-for-untrusted-pull-requests",
};

export const openSourceRepositoryAriaLabel = (projectTitle: string): string =>
  `Open ${projectTitle} repository on GitHub`;

export const openSourceReleaseLabel = (project: OpenSourceProject): string =>
  `v${project.version} · ${project.releasedOn}`;

export const OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  {
    title: "agent-context-doctor",
    repositoryUrl: "https://github.com/alipajand/agent-context-doctor",
    summary:
      "Audits the files that steer AI coding agents: AGENTS.md, CLAUDE.md, Cursor and Copilot rules, and committed Claude Code and MCP settings. Reports each problem with a severity and scores the repository from 0 to 100.",
    version: "1.0.0",
    releasedOn: "September 2026",
    format: "TypeScript CLI (acd)",
    install: "npm install -g github:alipajand/agent-context-doctor#v1.0.0",
    testedCapabilitiesLabel: "Why it matters",
    testedCapabilities: [
      "Agents follow their instruction files literally. A stray “skip tests if they’re slow,” a TODO placeholder, or two files that contradict each other quietly steer the agent toward bad changes.",
      "Committed agent settings run on every contributor’s machine. A bypassPermissions default, a hook that pipes a download into a shell, or an unpinned MCP server is reported as high severity.",
      "Also catches stale commands, broken file references, pasted secrets (redacted in the report), and hidden Unicode that can smuggle instructions past reviewers.",
      "Outputs terminal, JSON, Markdown, SARIF for code scanning, or pull-request annotations, with baselines and score or severity gates for CI.",
    ],
    contribution:
      "I treat agent instructions and agent settings as code: reviewed, linted, and gated in CI like anything else that changes behavior.",
    articles: [ARTICLE_INSTRUCTION_FILES, ARTICLE_UNTRUSTED_PRS],
  },
  {
    title: "agent-pr-reviewer-lite",
    repositoryUrl: "https://github.com/alipajand/agent-pr-reviewer-lite",
    summary:
      "A deterministic risk pre-screen for pull requests. It reads the git diff and flags the files that deserve human review before merge: authentication, billing, migrations, CI pipelines, committed secrets, and agent permissions.",
    version: "1.0.0",
    releasedOn: "September 2026",
    format: "TypeScript CLI",
    install: "pnpm add -D github:alipajand/agent-pr-reviewer-lite#v1.0.0",
    testedCapabilitiesLabel: "Why it matters",
    testedCapabilities: [
      "Agent-written pull requests touch many files. An offline pre-screen that runs in about 100 ms tells reviewers, or an LLM reviewer, where attention is actually needed.",
      "It reads added lines too: skipped or focused tests, new lint suppressions, new dependencies, and agent commands that run shell without asking.",
      "Each finding names its CODEOWNERS, read from the base branch, and the config can be read from a trusted ref, so a pull request cannot change the rules that review it.",
      "Outputs text, Markdown, JSON, SARIF, JUnit, or pull-request annotations, and exits non-zero at a configurable risk level.",
    ],
    contribution:
      "It is deliberately not an AI reviewer: fixed, readable rules, conservative by design, and identical output for identical input.",
    articles: [ARTICLE_REVIEW_TRIAGE, ARTICLE_UNTRUSTED_PRS],
  },
  {
    title: "agent-readiness-kit",
    repositoryUrl: "https://github.com/alipajand/agent-readiness-kit",
    summary:
      "Scores how ready a repository is for AI coding agents, from 0 to 100 across 13 categories: instruction files, architecture docs, scripts, tests, safety boundaries, and more.",
    version: "1.0.0",
    releasedOn: "September 2026",
    format: "TypeScript CLI (ark)",
    install: "npm install -g github:alipajand/agent-readiness-kit#v1.0.0",
    testedCapabilitiesLabel: "Why it matters",
    testedCapabilities: [
      "Teams often adopt AI-assisted development before their conventions, documentation, and validation paths can carry it. The score makes those gaps concrete.",
      "ark init, ark generate, and ark fix scaffold starter files for Cursor, Claude Code, Codex, Copilot, and CI, including least-privilege Claude Code settings that pre-approve nothing.",
      "Writes JSON, JUnit, SARIF, Markdown, or HTML reports, keeps a score history, and gates CI with a minimum score.",
    ],
    contribution:
      "I treat developer experience as a product problem: the score explains itself, and the fix is one command away.",
    articles: [ARTICLE_UNTRUSTED_PRS],
  },
  {
    title: "agent-readiness-action",
    repositoryUrl: "https://github.com/alipajand/agent-readiness-action",
    summary:
      "A GitHub Action that runs agent-readiness-kit and agent-context-doctor in CI. It scores the repository, checks its instruction files and agent settings, and reports the result on pull requests.",
    version: "1.0.1",
    releasedOn: "September 2026",
    format: "GitHub Action",
    install: "uses: alipajand/agent-readiness-action@v1",
    testedCapabilitiesLabel: "Why it matters",
    testedCapabilities: [
      "Fails the build below a minimum score or when a pull request lowers the score from the base branch, writes a Markdown report, and can post a summary comment.",
      "Both engines are bundled at pinned commits, so nothing is downloaded from a package registry at run time. No telemetry and no LLM calls.",
      "Built for pull requests you don’t trust: file names cannot inject workflow commands, reports are never written through symlinks, and only the action’s own comment is ever updated.",
    ],
    contribution:
      "I design CI tooling on the assumption that the repository it runs on may be hostile, because on a pull request it can be.",
    articles: [ARTICLE_UNTRUSTED_PRS, ARTICLE_INSTRUCTION_FILES],
  },
];

export const OPEN_SOURCE_SHARED_PRINCIPLES_HEADING = "Working principles";

export const OPEN_SOURCE_SHARED_PRINCIPLES: OpenSourcePrinciple[] = [
  {
    title: "Context is part of the system",
    body: "Agent output quality depends heavily on the instructions, constraints, and repository guidance that exist before implementation starts.",
  },
  {
    title: "Feedback should be actionable",
    body: "Review tools are most useful when they produce categorized output that tells people what changed, why it matters, and where to look.",
  },
  {
    title: "Developer experience is product work",
    body: "Teams adopt tools more successfully when the workflow feels coherent and the friction is reduced intentionally.",
  },
];

export const OPEN_SOURCE_TECHNOLOGY_HEADING = "Technology and scope";

export const OPEN_SOURCE_TECHNOLOGY_BADGES = [
  "TypeScript",
  "Node.js",
  "CLI design",
  "GitHub Actions",
  "SARIF / code scanning",
  "Claude Code & MCP settings",
  "CI/CD",
  "Static analysis",
  "Developer experience",
] as const;

export const OPEN_SOURCE_CTA_HEADING = "Explore the repositories";
export const OPEN_SOURCE_CTA_BODY =
  "Browse the repositories directly for source, usage, and current status. The writing section covers the engineering ideas behind these tools.";
export const OPEN_SOURCE_CTA_PRIMARY_LABEL = "Browse GitHub profile";
export const OPEN_SOURCE_CTA_PRIMARY_HREF = "https://github.com/alipajand";
export const OPEN_SOURCE_CTA_SECONDARY_LABEL = "Read my writing";
export const OPEN_SOURCE_CTA_SECONDARY_HREF = "/writing";
