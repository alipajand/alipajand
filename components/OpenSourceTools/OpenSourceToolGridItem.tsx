import { OpenSourceToolCard } from "components/OpenSourceTools/OpenSourceToolCard";
import type { OpenSourceTool } from "data/openSourceTools";

interface OpenSourceToolGridItemProps {
  tool: OpenSourceTool;
}

export const OpenSourceToolGridItem = ({ tool }: OpenSourceToolGridItemProps) => {
  return (
    <li data-open-source-tool-card data-reveal data-cine-card className="cine-card h-full">
      <OpenSourceToolCard tool={tool} />
    </li>
  );
};
