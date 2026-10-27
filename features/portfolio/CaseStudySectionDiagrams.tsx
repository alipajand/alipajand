import { CompareDiagram } from "components/hairline/CompareDiagram/CompareDiagram";
import { LayersDiagram } from "components/hairline/LayersDiagram/LayersDiagram";
import type { CaseSectionModel } from "utils/caseStudySections";

/** Layers and compare diagrams set as ruled rows at the end of their section. */
export const CaseStudySectionDiagrams = ({
  diagrams,
}: {
  diagrams: CaseSectionModel["diagrams"];
}) =>
  diagrams.map((spec) => (
    <div key={spec.title}>
      {spec.type === "layers" ? (
        <LayersDiagram title={spec.title} caption={spec.caption} layers={spec.layers} />
      ) : (
        <CompareDiagram title={spec.title} caption={spec.caption} columns={spec.columns} />
      )}
    </div>
  ));
