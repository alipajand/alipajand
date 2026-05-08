export interface InnovationItem {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoLabel?: string;
}

export const INNOVATION_SECTION_HEADING = "DX tooling & experiments";

export const INNOVATION_SECTION_INTRO =
  "Automation I run in the editor and in CI for earlier feedback, smaller reviews, and the same standards as the rest of my work.";

export const INNOVATION_VIDEO_LINK_DEFAULT = "Watch demo";

export const INNOVATION_ITEMS: InnovationItem[] = [
  {
    id: "mcp-cursor",
    title: "MCP server for Cursor",
    description:
      "Custom MCP integration so lint, types, and tests run inside Cursor. Issues show up before you open a PR, with the same checks as CI and a faster loop for the author.",
  },
  {
    id: "ci-checks",
    title: "Checks in GitHub Actions",
    description:
      "Format, types, and tests in the pipeline so regressions are caught before merge. Pairs with editor-side tooling: two layers of the same quality bar.",
  },
];
