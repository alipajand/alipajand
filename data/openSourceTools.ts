export interface OpenSourceTool {
  name: string;
  repositoryUrl: string;
  problem: string;
  capabilities: [string, string, string];
}

export const OPEN_SOURCE_TOOLS_HEADING = "Tooling & Open Source";

export const OPEN_SOURCE_TOOLS_LEDE =
  "Repository audits across CLIs, CI, MCP, and editor skills and plugins, alongside my Agent Readiness Doctor contribution to the GitBot Library. The audit engines use deterministic rules; host clients have their own data handling.";

export const OPEN_SOURCE_TOOLS_CTA_LABEL = "Explore all open-source work";
export const OPEN_SOURCE_TOOLS_CTA_HREF = "/open-source";

export const OPEN_SOURCE_TOOL_REPOSITORY_LINK_LABEL = "Repository";

export const OPEN_SOURCE_TOOL_PAGE_LINK_LABEL = "Open source page";

export const openSourceToolRepositoryAriaLabel = (toolName: string): string =>
  `Open ${toolName} repository on GitHub`;

export const OPEN_SOURCE_TOOLS: OpenSourceTool[] = [
  {
    name: "Agent Readiness MCP",
    repositoryUrl:
      "https://github.com/alipajand/agent-readiness-action/tree/main/integrations/mcp-package",
    problem:
      "Repository readiness and context audits through a local MCP server, published as @alipajand/agent-readiness-mcp 0.1.2.",
    capabilities: [
      "Published on npm and in the official MCP Registry",
      "Three tools for readiness, context findings, and paginated reports; requires Node.js 22.13+ (23.5+ on Node.js 23)",
      "Read-only, offline scanner with no repository script execution; host clients may send reports to their model provider",
    ],
  },
  {
    name: "Agent Readiness skill and plugins",
    repositoryUrl:
      "https://github.com/alipajand/agent-readiness-action/tree/main/plugins/agent-readiness",
    problem:
      "Integration release 0.1.2 brings the audit engines to a portable skill and Claude Code and Cursor plugins.",
    capabilities: [
      "Skill and Claude Code plugin install directly from GitHub; requires Node.js 22.12+",
      "Named audit commands tested in headless Claude Code and the local Cursor plugin, including denied execution",
      "Official plugin directory and Cursor Marketplace submissions remain under review in the October 14 publishing record",
    ],
  },
  {
    name: "GitBot Agent Readiness Doctor",
    repositoryUrl: "https://github.com/gitbot-hq/Library/tree/main/bots/agent-readiness-doctor",
    problem: "A GitBot Library contribution for keeping repository instructions useful.",
    capabilities: [
      "Available through GitBot’s in-app Marketplace",
      "Connects instruction audits to a reviewable maintenance workflow",
      "Published as open source under the MIT license",
    ],
  },
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
      "GitHub Action v1.2.0 runs agent-readiness-kit and agent-context-doctor on pull requests; published in the Actions Marketplace with the v1 tag.",
    capabilities: [
      "Fails below a minimum score or when a pull request lowers the score from the base branch",
      "Bundles both engines at pinned commits, so nothing is downloaded from a registry at run time",
      "Hardened for untrusted pull requests: no workflow-command injection and no writes through symlinks",
    ],
  },
];
