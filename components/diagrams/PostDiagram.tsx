import { CompareDiagram } from "components/diagrams/CompareDiagram";
import { FlowDiagram } from "components/diagrams/FlowDiagram";
import { LayersDiagram } from "components/diagrams/LayersDiagram";
import { McpWorkflowDiagram } from "components/diagrams/McpWorkflowDiagram";
import { WRITING_POST_MCP_FIGCAPTION } from "data/writing";
import type { DiagramSpec } from "utils/diagramBlocks";

export const PostDiagram = ({ spec }: { spec: DiagramSpec }) => {
  switch (spec.type) {
    case "flow":
      return <FlowDiagram spec={spec} />;
    case "layers":
      return <LayersDiagram spec={spec} />;
    case "compare":
      return <CompareDiagram spec={spec} />;
    case "mcp-workflow":
      return (
        <figure className="not-prose my-10 space-y-2">
          <McpWorkflowDiagram />
          <figcaption className="text-muted text-sm leading-snug">
            {spec.caption ?? WRITING_POST_MCP_FIGCAPTION}
          </figcaption>
        </figure>
      );
  }
};
