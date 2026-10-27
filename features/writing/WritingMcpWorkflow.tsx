import { FlowBand } from "components/hairline/FlowBand/FlowBand";
import {
  MCP_WORKFLOW_DIAGRAM_CHECKS_LABEL,
  MCP_WORKFLOW_DIAGRAM_CHECKS_SUBLABEL_CI,
  MCP_WORKFLOW_DIAGRAM_CHECKS_SUBLABEL_OUTPUT,
  MCP_WORKFLOW_DIAGRAM_EDITOR_LABEL,
  MCP_WORKFLOW_DIAGRAM_EDITOR_SUBLABEL,
  MCP_WORKFLOW_DIAGRAM_FEEDBACK_LABEL,
  MCP_WORKFLOW_DIAGRAM_SERVER_LABEL,
  MCP_WORKFLOW_DIAGRAM_SERVER_SUBLABEL,
  MCP_WORKFLOW_DIAGRAM_TITLE,
} from "data/diagrams";
import { WRITING_POST_MCP_FIGCAPTION, writingDiagramBandLabel } from "data/writing";
import type { FlowDiagramSpec } from "utils/diagramBlocks";

/** The editor → MCP server → checks loop as a three-step flow with a feedback line. */
export const mcpWorkflowFlow = (caption?: string): FlowDiagramSpec => ({
  type: "flow",
  title: MCP_WORKFLOW_DIAGRAM_TITLE,
  steps: [
    { label: MCP_WORKFLOW_DIAGRAM_EDITOR_LABEL, detail: MCP_WORKFLOW_DIAGRAM_EDITOR_SUBLABEL },
    { label: MCP_WORKFLOW_DIAGRAM_SERVER_LABEL, detail: MCP_WORKFLOW_DIAGRAM_SERVER_SUBLABEL },
    {
      label: MCP_WORKFLOW_DIAGRAM_CHECKS_LABEL,
      detail: `${MCP_WORKFLOW_DIAGRAM_CHECKS_SUBLABEL_CI} · ${MCP_WORKFLOW_DIAGRAM_CHECKS_SUBLABEL_OUTPUT}`,
    },
  ],
  loop: MCP_WORKFLOW_DIAGRAM_FEEDBACK_LABEL,
  caption: caption ?? WRITING_POST_MCP_FIGCAPTION,
});

/** The `mcp-workflow` diagram block, drawn as a hairline flow in place of the old SVG figure. */
export const WritingMcpWorkflow = ({
  caption,
  sectionId,
}: {
  caption?: string;
  sectionId: string;
}) => {
  const { type: _type, ...spec } = mcpWorkflowFlow(caption);
  void _type;
  return <FlowBand chapterId={sectionId} label={writingDiagramBandLabel(spec.title)} {...spec} />;
};
