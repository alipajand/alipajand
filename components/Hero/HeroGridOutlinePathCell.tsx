import { GridOutlinePath } from "components/Hero/GridOutlinePath";
import type { HeroGridConfig } from "components/Hero/hooks/useGridOutlineAnimation";

interface HeroGridOutlinePathCellProps {
  grid: HeroGridConfig;
  rowIndex: number;
  colIndex: number;
}

export function HeroGridOutlinePathCell({
  grid,
  rowIndex,
  colIndex,
}: HeroGridOutlinePathCellProps) {
  return <GridOutlinePath grid={grid} rowIndex={rowIndex} colIndex={colIndex} />;
}
