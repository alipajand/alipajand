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
      "I built an MCP server that runs lint, types, and tests inside the editor. Reviewers get faster feedback and PRs stay clean. It's one way I use AI to speed things up without replacing human review.",
    videoUrl: undefined,
    videoLabel: "See MCP in action (add your video link)",
  },
  {
    id: "ai-dx",
    title: "AI in the pipeline",
    description:
      "I use AI to handle the boring checks (format, types, tests) so we can focus on design, readability, and product. Fast pipeline, fast iteration.",
    videoUrl: undefined,
    videoLabel: undefined,
  },
];
