"use client";

import { GridOutlinePath } from "components/Hero/GridOutlinePath";
import {
  HERO_GRID_CONFIG,
  useGridOutlineAnimation,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
} from "components/Hero/hooks/useGridOutlineAnimation";

export function HeroBackground() {
  const {
    selectors: { snakeOrder, svgRef },
  } = useGridOutlineAnimation();

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {snakeOrder.map(([rowIndex, colIndex]) => (
        <GridOutlinePath
          key={`${rowIndex}-${colIndex}`}
          grid={HERO_GRID_CONFIG}
          rowIndex={rowIndex}
          colIndex={colIndex}
        />
      ))}
    </svg>
  );
}
