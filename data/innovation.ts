export interface InnovationItem {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoLabel?: string;
}

export const INNOVATION_ITEMS: InnovationItem[] = [
  {
    id: "mcp-cursor",
    title: "MCP server for Cursor",
    description:
      "Built a custom Model Context Protocol server that runs lint, type checks, and tests inside the editor—giving reviewers faster feedback and cleaner PRs. Demonstrates senior-level AI-driven DX that improves velocity without replacing human judgment.",
    videoUrl: undefined,
    videoLabel: "See MCP in action (add your video link)",
  },
  {
    id: "ai-dx",
    title: "AI-driven code review & velocity",
    description:
      "Designed tooling and workflows that use AI to automate repetitive checks (format, types, tests) so the team focuses on architecture, readability, and product decisions—shipping fast and reliable by making the pipeline itself fast and reliable.",
    videoUrl: undefined,
    videoLabel: undefined,
  },
];
