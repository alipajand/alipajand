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
      "Custom Model Context Protocol server that runs lint, type checks, and tests inside the editor. Reviewers get faster feedback; PRs are cleaner before they’re opened. A concrete example of AI-driven DX that improves velocity without replacing human judgment.",
    videoUrl: undefined,
    videoLabel: "See MCP in action (add your video link)",
  },
  {
    id: "ai-dx",
    title: "AI-driven code review & velocity",
    description:
      "Tooling and workflows that use AI to automate repetitive checks (format, types, tests) so the team can focus on architecture, readability, and product decisions. Proves you can ship “fast, reliable” by making the pipeline itself fast and reliable.",
    videoUrl: undefined,
    videoLabel: undefined,
  },
];
