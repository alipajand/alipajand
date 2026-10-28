import { CompareDiagram } from "components/hairline/CompareDiagram/CompareDiagram";
import { FlowBand } from "components/hairline/FlowBand/FlowBand";
import { LayersDiagram } from "components/hairline/LayersDiagram/LayersDiagram";
import styles from "features/writing/WritingPostDiagram.module.css";
import { WritingMcpWorkflow } from "features/writing/WritingMcpWorkflow";
import { writingDiagramBandLabel } from "data/writing";
import type { DiagramSpec } from "utils/diagramBlocks";

interface WritingPostDiagramProps {
  spec: DiagramSpec;
  sectionId: string;
}

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
