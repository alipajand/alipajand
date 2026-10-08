export interface OpenSourceTool {
  name: string;
  repositoryUrl: string;
  problem: string;
  capabilities: [string, string, string];
}

export const OPEN_SOURCE_TOOLS_HEADING = "Tooling & Open Source";

export const OPEN_SOURCE_TOOLS_LEDE =
  "Deterministic, local-first tools for AI-assisted development: three CLIs and a GitHub Action that check agent readiness, agent instructions and settings, and risky pull requests, with the final call left to a human reviewer.";

export const OPEN_SOURCE_TOOLS_CTA_LABEL = "Explore all open-source work";
export const OPEN_SOURCE_TOOLS_CTA_HREF = "/open-source";

export const OPEN_SOURCE_TOOL_REPOSITORY_LINK_LABEL = "Repository";

export const OPEN_SOURCE_TOOL_PAGE_LINK_LABEL = "Open source page";

export const openSourceToolRepositoryAriaLabel = (toolName: string): string =>
  `Open ${toolName} repository on GitHub`;

export const OPEN_SOURCE_TOOLS: OpenSourceTool[] = [
  {
    name: "agent-context-doctor",
    repositoryUrl: "https://github.com/alipajand/agent-context-doctor",
    problem:
      "Audits agent instruction files and committed Claude Code and MCP settings for quality and safety problems.",
    capabilities: [
      "Flags placeholders, contradictions, stale commands, broken references, pasted secrets, and hidden Unicode",
      "Catches risky agent settings such as bypassPermissions, hooks that run remote scripts, and unpinned MCP servers",
      "Scores the repository from 0 to 100 and reports to the terminal, SARIF, or pull-request annotations",
    ],
  },
  {
    name: "agent-pr-reviewer-lite",
    repositoryUrl: "https://github.com/alipajand/agent-pr-reviewer-lite",
    problem:
      "Deterministic risk pre-screen that flags the files in a pull request that need human review before merge.",
    capabilities: [
      "Flags auth, billing, migrations, CI, secrets, and agent-permission changes from fixed, readable rules",
      "Reads added lines for skipped tests, lint suppressions, new dependencies, and auto-run agent commands",
      "Names CODEOWNERS from the base branch so a pull request cannot pick its own reviewers",
    ],
  },
  {
    name: "agent-readiness-kit",
    repositoryUrl: "https://github.com/alipajand/agent-readiness-kit",
    problem:
      "Scores how ready a repository is for AI coding agents across 13 categories, from 0 to 100.",
    capabilities: [
      "Checks instruction files, architecture docs, scripts, tests, and safety boundaries",
      "Scaffolds starter files for Cursor, Claude Code, Codex, Copilot, and CI with init, generate, and fix",
      "Gates CI on a minimum score and writes JSON, JUnit, SARIF, Markdown, or HTML reports",
    ],
  },
  {
    name: "agent-readiness-action",
    repositoryUrl: "https://github.com/alipajand/agent-readiness-action",
    problem:
      "GitHub Action that runs agent-readiness-kit and agent-context-doctor on every pull request.",
    capabilities: [
      "Fails below a minimum score or when a pull request lowers the score from the base branch",
      "Bundles both engines at pinned commits, so nothing is downloaded from a registry at run time",
      "Hardened for untrusted pull requests: no workflow-command injection and no writes through symlinks",
    ],
  },
];
