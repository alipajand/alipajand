export interface OpenSourceTool {
  name: string;
  repositoryUrl: string;
  description: string;
  tags: string[];
}

export const OPEN_SOURCE_TOOLS_HEADING = "Open-source tools for AI-assisted engineering";

export const OPEN_SOURCE_TOOLS_LEDE =
  "I build deterministic tooling around AI coding workflows: repository readiness, agent instructions, pull-request risk, and CI enforcement. These projects focus on making agent-assisted development safer, more explainable, and easier to operate in real teams.";

export const OPEN_SOURCE_TOOLS_CTA_LABEL = "View open-source work";
export const OPEN_SOURCE_TOOLS_CTA_HREF = "/open-source";

export const OPEN_SOURCE_TOOLS: OpenSourceTool[] = [
  {
    name: "Agent Readiness Kit",
    repositoryUrl: "https://github.com/alipajand/agent-readiness-kit",
    description:
      "Audits whether a repository has the context, commands, boundaries, and validation paths coding agents need to work safely.",
    tags: ["Repository readiness", "CLI", "TypeScript"],
  },
  {
    name: "Agent Context Doctor",
    repositoryUrl: "https://github.com/alipajand/agent-context-doctor",
    description:
      "Reviews AGENTS.md, CLAUDE.md, Cursor rules, Copilot instructions, and prompt documents for contradictions, unsafe guidance, missing commands, and stale context.",
    tags: ["Agent instructions", "Static analysis", "TypeScript"],
  },
  {
    name: "Agent PR Reviewer Lite",
    repositoryUrl: "https://github.com/alipajand/agent-pr-reviewer-lite",
    description:
      "A deterministic CLI and CI tool that inspects pull requests or local diffs for risky agent-generated changes across security-sensitive and product-critical areas.",
    tags: ["Pull-request risk", "CI", "TypeScript"],
  },
  {
    name: "Agent Readiness Action",
    repositoryUrl: "https://github.com/alipajand/agent-readiness-action",
    description:
      "A GitHub Action wrapper that runs repository-readiness audits directly in CI and reports failures before agent workflows reach production.",
    tags: ["GitHub Actions", "CI enforcement", "Automation"],
  },
];
