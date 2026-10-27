import { CompareDiagram } from "components/hairline/CompareDiagram/CompareDiagram";
import { FlowBand } from "components/hairline/FlowBand/FlowBand";
import { LayersDiagram } from "components/hairline/LayersDiagram/LayersDiagram";
import styles from "features/writing/WritingPostDiagram.module.css";
import { WritingMcpWorkflow } from "features/writing/WritingMcpWorkflow";
import { writingDiagramBandLabel } from "data/writing";
import type { DiagramSpec } from "utils/diagramBlocks";

interface WritingPostDiagramProps {
  spec: DiagramSpec;
  /** The section the diagram follows; flows count as part of it for the contents. */
  sectionId: string;
}

/**
 * One ```diagram block inside the article column. Layers and compare use the shared figures as
 * they are. A flow is the shared bone band, held inside the column instead of bleeding to the
 * screen edges.
 */
export const WritingPostDiagram = ({ spec, sectionId }: WritingPostDiagramProps) => {
  switch (spec.type) {
    case "layers": {
      const { type: _type, ...props } = spec;
      void _type;
      return (
        <div className={styles.figure}>
          <LayersDiagram {...props} />
        </div>
      );
    }
    case "compare": {
      const { type: _type, ...props } = spec;
      void _type;
      return (
        <div className={styles.figure}>
          <CompareDiagram {...props} />
        </div>
      );
    }
    case "flow": {
      const { type: _type, ...props } = spec;
      void _type;
      return (
        <div className={styles.flow}>
          <FlowBand chapterId={sectionId} label={writingDiagramBandLabel(spec.title)} {...props} />
        </div>
      );
    }
    case "mcp-workflow":
      return (
        <div className={styles.flow}>
          <WritingMcpWorkflow caption={spec.caption} sectionId={sectionId} />
        </div>
      );
  }
};
