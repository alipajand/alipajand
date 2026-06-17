export interface OpenSourceTool {
  name: string;
  repositoryUrl: string;
  problem: string;
  capabilities: [string, string, string];
}

export const OPEN_SOURCE_TOOLS_HEADING = "Open-source tools";

export const OPEN_SOURCE_TOOLS_LEDE =
  "Two focused tools from my open-source work on safer, more explainable engineering workflows.";

export const OPEN_SOURCE_TOOLS_CTA_LABEL = "Explore all open-source work";
export const OPEN_SOURCE_TOOLS_CTA_HREF = "/open-source";

export const OPEN_SOURCE_TOOL_REPOSITORY_LINK_LABEL = "Repository";

export const OPEN_SOURCE_TOOL_PAGE_LINK_LABEL = "Open source page";

export const openSourceToolRepositoryAriaLabel = (toolName: string): string =>
  `Open ${toolName} repository on GitHub`;

export const OPEN_SOURCE_TOOLS: OpenSourceTool[] = [
  {
    name: "agent-pr-reviewer-lite",
    repositoryUrl: "https://github.com/alipajand/agent-pr-reviewer-lite",
    problem:
      "Catches risky pull-request changes in security-sensitive and product-critical areas before human review starts.",
    capabilities: [
      "Inspects local diffs and pull requests with deterministic rules",
      "Flags risky route, env, dependency, migration, and security-sensitive changes",
      "Detects deleted test files and newly added dependencies in changed diffs",
    ],
  },
  {
    name: "agent-context-doctor",
    repositoryUrl: "https://github.com/alipajand/agent-context-doctor",
    problem:
      "Audits agent instruction files for contradictions, stale guidance, and missing repository context.",
    capabilities: [
      "Checks AGENTS.md, CLAUDE.md, Cursor rules, and prompt documents",
      "Flags risky instructions, contradictory guidance, and missing validation expectations",
      "Reports missing boundaries, validation paths, and final-report expectations",
    ],
  },
];
