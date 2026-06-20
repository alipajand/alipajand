export interface OpenSourceTool {
  name: string;
  repositoryUrl: string;
  problem: string;
  capabilities: [string, string, string];
}

export const OPEN_SOURCE_TOOLS_HEADING = "Tooling & Open Source";

export const OPEN_SOURCE_TOOLS_LEDE =
  "I build small tooling projects to explore how frontend teams can work better with AI agents and automated review feedback.";

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
      "Checks whether an AI coding agent has enough context, constraints, and instructions before implementation.",
    capabilities: [
      "Audits instruction files for missing repository context and weak constraints",
      "Flags contradictory guidance, risky instructions, and stale command references",
      "Helps treat context quality as an engineering input instead of an afterthought",
    ],
  },
  {
    name: "agent-pr-reviewer-lite",
    repositoryUrl: "https://github.com/alipajand/agent-pr-reviewer-lite",
    problem: "Lightweight PR review assistant focused on structured feedback and risk detection.",
    capabilities: [
      "Reviews diffs with deterministic rules instead of generic summary feedback",
      "Categorizes risky changes so reviewers can act on specific issues quickly",
      "Explores code review as a system for actionable, structured feedback",
    ],
  },
  {
    name: "agent-readiness-kit",
    repositoryUrl: "https://github.com/alipajand/agent-readiness-kit",
    problem:
      "Evaluates whether a frontend codebase or workflow is ready for agent-assisted development.",
    capabilities: [
      "Checks whether conventions, documentation, and tooling support agent-assisted work",
      "Highlights missing boundaries, validation paths, and repository guidance",
      "Frames developer experience as a product problem, not only a configuration task",
    ],
  },
];
