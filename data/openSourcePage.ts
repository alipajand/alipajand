export interface OpenSourceArticle {
  title: string;
  href: string;
}

export interface OpenSourceExternalReference {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  linkAriaLabel: string;
}

export interface OpenSourceProject {
  title: string;
  repositoryUrl: string;
  summary: string;
  version?: string;
  releasedOn: string;
  format: string;
  install: string;
  testedCapabilitiesLabel: string;
  testedCapabilities: string[];
  contribution: string;
  articles?: OpenSourceArticle[];
  externalReferences?: OpenSourceExternalReference[];
}

export interface OpenSourcePrinciple {
  title: string;
  body: string;
}

export const OPEN_SOURCE_META_TITLE =
  "Open Source & Developer Tooling — Ali Pajand · Senior Software Engineer";
export const OPEN_SOURCE_META_DESCRIPTION =
  "Open-source CLIs, a GitHub Action, MCP server, skill, plugins, and a GitBot contribution for repository readiness, instruction audits, and pull-request review.";

export const OPEN_SOURCE_HEADER_OVERLINE = "Open source";
export const OPEN_SOURCE_HEADER_HEADING = "Open Source & Tooling";
export const OPEN_SOURCE_HEADER_LEDE =
  "I build open-source tools for repository readiness and code review, and contributed Agent Readiness Doctor to the GitBot Library.";
export const OPEN_SOURCE_HEADER_INTRO =
  "The audit engines use deterministic checks without LLM scoring. The integration scanner is read-only and offline; a host client may send reports or files it reads to its model provider. The GitBot contribution adds a review workflow for instruction maintenance.";

export const OPEN_SOURCE_PROJECTS_HEADING = "Projects";
export const OPEN_SOURCE_PROJECTS_LEDE =
  "Three CLIs, a GitHub Action, an MCP server, a portable skill and plugins, plus a contribution to the GitBot Library. The same readiness and context engines serve CI and editor workflows.";

export const OPEN_SOURCE_RELEASE_LABEL = "Latest release";

export const OPEN_SOURCE_INSTALL_LABEL = "Install";

export const OPEN_SOURCE_INSTALL_NOTE =
  "Install the three standalone CLIs from their GitHub release tags; unscoped npm packages sharing their names are unrelated. The MCP server is published as @alipajand/agent-readiness-mcp. The skill and Claude Code plugin install from GitHub; the GitBot bot installs through its Marketplace. Release and directory status follows the October 14, 2026 publishing record.";
export const OPEN_SOURCE_FORMAT_LABEL = "Format";

export const OPEN_SOURCE_CONTRIBUTION_LABEL = "What it demonstrates";

export const OPEN_SOURCE_REPOSITORY_LINK_LABEL = "Repository";

export const OPEN_SOURCE_ARTICLES_LABEL = "Related writing";

export const OPEN_SOURCE_EXTERNAL_REFERENCES_LABEL = "External reference";

const ARTICLE_INSTRUCTION_FILES: OpenSourceArticle = {
  title: "Agent instruction files are code. Lint them like code.",
  href: "/writing/agent-instructions-are-code",
};

const ARTICLE_DIRECTORY_PREPARATION: OpenSourceArticle = {
  title: "How to prepare integrations for the Anthropic and Cursor directories",
  href: "/writing/preparing-integrations-for-anthropic-and-cursor-directories",
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
  project.version ? `v${project.version} · ${project.releasedOn}` : project.releasedOn;

export const OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  {
    title: "Agent Readiness MCP",
    repositoryUrl:
      "https://github.com/alipajand/agent-readiness-action/tree/main/integrations/mcp-package",
    summary:
      "A local stdio MCP server that exposes repository readiness and agent-context audits to an editor or other MCP host. Published on npm and in the official MCP Registry.",
    version: "0.1.2",
    releasedOn: "October 13, 2026 · integrations release",
    format: "MCP server · Node.js 22.13+ (23.5+ on Node.js 23)",
    install: "npx -y @alipajand/agent-readiness-mcp@0.1.2 --root /path/to/projects",
    testedCapabilitiesLabel: "Why it matters",
    testedCapabilities: [
      "Exposes audit_repository, audit_agent_context, and get_audit_report, with structured findings, engine commits, and paginated reports.",
      "The scanner writes nothing, runs no repository scripts, and makes no network requests. Workers have read access confined to the selected directory and their own script.",
      "Credential masking is pattern-based and applies to scanner output only; paths remain visible. The host client may send results and files it reads to its model provider.",
      "Verified with the MCP SDK, Inspector, and signed-in headless Claude Code. MCP in Cursor and Windows remain untested.",
      "The October 14 publishing record also lists mcpserver.dev and MCPRush; MCPRush auto-indexed the package and its ownership claim awaits review. Glama remains submitted, awaiting review.",
    ],
    contribution:
      "I made the same pinned audit engines available through MCP, with bounded workers and structured reports instead of model-generated scores.",
    articles: [ARTICLE_DIRECTORY_PREPARATION, ARTICLE_INSTRUCTION_FILES, ARTICLE_UNTRUSTED_PRS],
  },
  {
    title: "Agent Readiness skill and plugins",
    repositoryUrl:
      "https://github.com/alipajand/agent-readiness-action/tree/main/plugins/agent-readiness",
    summary:
      "A portable agent-readiness-audit skill and plugins for Claude Code and Cursor, using the same bundled audit engines as the MCP server.",
    version: "0.1.2",
    releasedOn: "October 13, 2026 · integrations release",
    format: "Agent Skill · Claude Code and Cursor plugins · Node.js 22.12+",
    install:
      "npx skills add alipajand/agent-readiness-action --skill agent-readiness-audit\n\nclaude plugin marketplace add alipajand/agent-readiness-action\nclaude plugin install agent-readiness@agent-readiness",
    testedCapabilitiesLabel: "Why it matters",
    testedCapabilities: [
      "The skill and Claude Code plugin install directly from the public repository. The plugin adds no hooks, MCP servers, or executables to PATH.",
      "Invoke /agent-readiness:audit in Claude Code or the agent-readiness-audit command in Cursor. Named invocation is the tested path; plain-language discovery is not verified as reliable.",
      "Signed-in headless Claude Code and the local Cursor plugin were tested, including denied execution. If the scanner cannot run, the loaded command must report that no audit ran and give no scores.",
      "As recorded October 14, the official plugin directory submission is scanning and the Cursor Marketplace submission awaits review. Local Cursor installation is tested; marketplace approval is not claimed.",
    ],
    contribution:
      "I packaged deterministic audits for existing editor workflows while keeping scanner behavior separate from the host client's data handling.",
    articles: [ARTICLE_DIRECTORY_PREPARATION, ARTICLE_INSTRUCTION_FILES, ARTICLE_UNTRUSTED_PRS],
  },
  {
    title: "Agent Readiness Doctor",
    repositoryUrl: "https://github.com/gitbot-hq/Library/tree/main/bots/agent-readiness-doctor",
    summary:
      "My open-source contribution to the GitBot Library, available in its in-app Marketplace.",
    releasedOn: "Added to the Library · October 12, 2026",
    format: "GitBot bot · MIT license",
    install: "GitBot → Marketplace → Agent Readiness Doctor → Install",
    testedCapabilitiesLabel: "Why it matters",
    testedCapabilities: [
      "Checks repository instructions against the code.",
      "Proposes fixes for review before editing.",
      "Uses agent-context-doctor and agent-readiness-kit when available.",
    ],
    contribution:
      "I contributed a repeatable workflow for maintaining the instructions developers rely on between refactors.",
    articles: [
      {
        title: "Keeping repository instructions useful with Agent Readiness Doctor",
        href: "/writing/agent-readiness-doctor",
      },
    ],
  },
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
    version: "1.2.0",
    releasedOn: "October 12, 2026",
    format: "GitHub Action",
    install: "uses: alipajand/agent-readiness-action@v1",
    testedCapabilitiesLabel: "Why it matters",
    testedCapabilities: [
      "Fails the build below a minimum score or when a pull request lowers the score from the base branch, writes a Markdown report, and can post a summary comment.",
      "Published in the GitHub Actions Marketplace as v1.2.0, with the v1 tag pointing to it. Both engines are bundled at pinned commits; no registry downloads at run time or LLM scoring.",
      "Built for pull requests you don’t trust: file names cannot inject workflow commands, reports are never written through symlinks, and only the action’s own comment is ever updated.",
    ],
    contribution:
      "I design CI tooling on the assumption that the repository it runs on may be hostile, because on a pull request it can be.",
    articles: [ARTICLE_UNTRUSTED_PRS, ARTICLE_INSTRUCTION_FILES],
    externalReferences: [
      {
        title: "Selected for the XERJ Corpus Hub",
        body: "Agent Readiness integration work was selected as an attributed open-source reference for AI-assisted software development.",
        href: "https://hub.xerj.org/contributors/alipajand",
        linkLabel: "View contributor profile",
        linkAriaLabel: "View contributor profile on the XERJ Corpus Hub",
      },
    ],
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
  "MCP server",
  "Agent Skills",
  "Editor plugins",
  "GitHub Actions",
  "SARIF / code scanning",
  "Claude Code & MCP settings",
  "CI/CD",
  "Static analysis",
  "Developer experience",
] as const;

export const OPEN_SOURCE_ACTIVITY_HEADING = "Contribution activity";

export const OPEN_SOURCE_CTA_HEADING = "Explore the repositories";
export const OPEN_SOURCE_CTA_BODY =
  "Browse the repositories directly for source, usage, and current status. The writing section covers the engineering ideas behind these tools.";
export const OPEN_SOURCE_CTA_PRIMARY_LABEL = "Browse GitHub profile";
export const OPEN_SOURCE_CTA_PRIMARY_HREF = "https://github.com/alipajand";
export const OPEN_SOURCE_CTA_SECONDARY_LABEL = "Read my writing";
export const OPEN_SOURCE_CTA_SECONDARY_HREF = "/writing";

export const OPEN_SOURCE_DISPLAY_WORDS = ["Open", "Source"] as const;

export const openSourceProjectCountLabel = (count: number): string => `${count} projects`;

export const OPEN_SOURCE_HERO_PROJECTS_CTA_LABEL = "See the projects";

export const OPEN_SOURCE_ROUTE_NOTE = "No LLM scoring";

export const OPEN_SOURCE_INSTALL_NOTE_LABEL = "[ Install note ]";

export const OPEN_SOURCE_PROJECTS_INDEX_ARIA_LABEL = "Projects on this page";

export const OPEN_SOURCE_UNVERSIONED_LABEL = "Library";

export const OPEN_SOURCE_COPY_LABEL = "Copy";
export const OPEN_SOURCE_COPIED_LABEL = "Copied";
export const OPEN_SOURCE_SELECTED_LABEL = "Selected";
export const openSourceCopyAriaLabel = (projectTitle: string): string =>
  `Copy the ${projectTitle} install command`;
export const openSourceCopiedAnnouncement = (projectTitle: string): string =>
  `${projectTitle} install command copied`;
export const openSourceSelectedAnnouncement = (projectTitle: string): string =>
  `${projectTitle} install command selected`;
export const openSourceInstallAriaLabel = (projectTitle: string): string =>
  `${projectTitle} install command`;

export const OPEN_SOURCE_TECHNOLOGY_TICKER = [
  "TypeScript",
  "Node.js",
  "CLI design",
  "MCP server",
  "Agent Skills",
  "Editor plugins",
  "GitHub Actions",
  "SARIF / code scanning",
  "Static analysis",
  "Developer experience",
] as const;

export const OPEN_SOURCE_SHARED_PRINCIPLES_NOTE = "[ Shared across every tool ]";

export const OPEN_SOURCE_ACTIVITY_SNAPSHOT_LEDE =
  "A dated snapshot of the GitHub contribution calendar on github.com/alipajand, kept up to date. GitHub counts private contributions there too, so it shows when I was active, not how much open-source work shipped.";
export const OPEN_SOURCE_ACTIVITY_STAT_LABELS = {
  total: "Last year",
  totalUnit: "contributions",
  active: "Active days",
  streak: "Longest streak",
  busiest: "Busiest day",
} as const;
export const OPEN_SOURCE_ACTIVITY_GITHUB_LABEL = "View on GitHub";
export const OPEN_SOURCE_ACTIVITY_GITHUB_HREF = "https://github.com/alipajand";
export const OPEN_SOURCE_ACTIVITY_LEGEND = { less: "Less", more: "More" } as const;
export const OPEN_SOURCE_ACTIVITY_GRAPH_LABEL = "Contribution calendar, scrollable";

export const OPEN_SOURCE_CTA_EYEBROW = "[ Source ]";
export const OPEN_SOURCE_CTA_LINKS_LABEL = "Next";
export const OPEN_SOURCE_CTA_WRITING_HINT = "alipajand.com/writing";
export const OPEN_SOURCE_CTA_CONTACT_LABEL = "Get in touch";
export const OPEN_SOURCE_CTA_CONTACT_HINT = "Contact";
export const OPEN_SOURCE_CTA_CONTACT_HREF = "/#contact";

export const OPEN_SOURCE_TITLE_ID = "page-title";
export const OPEN_SOURCE_PROJECTS_ID = "projects";

export const OPEN_SOURCE_TOOL_TICKER = [
  "agent-context-doctor",
  "agent-pr-reviewer-lite",
  "agent-readiness-kit",
  "agent-readiness-action",
  "Agent Readiness MCP",
  "Agent Readiness Doctor",
] as const;

export const openSourceProjectSlug = (title: string): string =>
  `p-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

export const openSourceIndexVersionLabel = (project: OpenSourceProject): string =>
  project.version ? `v${project.version}` : OPEN_SOURCE_UNVERSIONED_LABEL;

export const openSourceInstallIsSteps = (project: OpenSourceProject): boolean =>
  project.install.includes("→");
export const openSourceInstallIsYaml = (project: OpenSourceProject): boolean =>
  project.install.startsWith("uses:");

export type OpenSourceRouteNodeKey =
  "repo" | "diff" | "ark" | "acd" | "apr" | "action" | "mcp" | "skill" | "gitbot" | "review";

export interface OpenSourceRouteNode {
  col: 0 | 1 | 2;
  slot: number;
  label: string;
  short: string;
  full?: string;
  files?: readonly string[];
}

export const OPEN_SOURCE_ROUTE_COLUMNS = ["Input", "Engine", "Surface"] as const;

export const OPEN_SOURCE_ROUTE_NODES: Record<OpenSourceRouteNodeKey, OpenSourceRouteNode> = {
  repo: {
    col: 0,
    slot: 1.5,
    label: "Repository",
    short: "Repo",
    files: ["AGENTS.md", "CLAUDE.md", ".cursor/rules", ".mcp.json"],
  },
  diff: { col: 0, slot: 5, label: "Pull request diff", short: "PR diff" },
  ark: { col: 1, slot: 1, label: "agent-readiness-kit", short: "ark" },
  acd: { col: 1, slot: 2, label: "agent-context-doctor", short: "acd" },
  apr: { col: 1, slot: 5, label: "agent-pr-reviewer-lite", short: "pr-reviewer" },
  action: {
    col: 2,
    slot: 0,
    label: "GitHub Action",
    short: "Action",
    full: "agent-readiness-action",
  },
  mcp: { col: 2, slot: 1, label: "MCP server", short: "MCP", full: "Agent Readiness MCP" },
  skill: { col: 2, slot: 2, label: "Skill + plugins", short: "Skill", full: "Skill and plugins" },
  gitbot: { col: 2, slot: 3, label: "GitBot bot", short: "GitBot", full: "Agent Readiness Doctor" },
  review: {
    col: 2,
    slot: 5,
    label: "Files to review",
    short: "Review",
    full: "agent-pr-reviewer-lite",
  },
};

export const OPEN_SOURCE_ROUTE_SURFACES: readonly OpenSourceRouteNodeKey[] = [
  "action",
  "mcp",
  "skill",
  "gitbot",
  "review",
];

const pad2 = (value: number) => String(value).padStart(2, "0");

export const openSourceRouteReadout = (active: number): string => {
  const surface = OPEN_SOURCE_ROUTE_NODES[OPEN_SOURCE_ROUTE_SURFACES[active]];
  return `${pad2(active + 1)} / ${pad2(OPEN_SOURCE_ROUTE_SURFACES.length)} · ${surface.full ?? surface.label}`;
};

export const openSourceActivitySnapshotLabel = (day: string): string => `[ Snapshot · ${day} ]`;
export const openSourceActivityDaysLabel = (days: number): string => `of ${days}`;
export const openSourceActivityStreakUnit = (days: number): string => (days === 1 ? "day" : "days");
export const openSourceActivitySummary = (total: string, first: string, last: string): string =>
  `${total} on GitHub between ${first} and ${last}`;
export const openSourceActivityTableCaption = (first: string, last: string): string =>
  `Contributions per month, ${first} to ${last}`;
export const OPEN_SOURCE_ACTIVITY_TABLE_HEADERS = {
  month: "Month",
  total: "Contributions",
} as const;
