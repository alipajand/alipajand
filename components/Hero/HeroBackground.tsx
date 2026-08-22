"use client";

import { HeroGridOutlinePathCell } from "components/Hero/HeroGridOutlinePathCell";
import {
  HERO_GRID_CONFIG,
  useGridOutlineAnimation,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
} from "components/Hero/hooks/useGridOutlineAnimation";

export const HeroBackground = () => {
  const {
    selectors: { snakeOrder, svgRef },
  } = useGridOutlineAnimation();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div data-hero-parallax="grid" className="absolute inset-0 will-change-transform">
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {snakeOrder.map(([rowIndex, colIndex]) => (
            <HeroGridOutlinePathCell
              key={`${rowIndex}-${colIndex}`}
              grid={HERO_GRID_CONFIG}
              rowIndex={rowIndex}
              colIndex={colIndex}
            />
          ))}
        </svg>
      </div>
      <div data-hero-parallax="sweep" className="cine-sweep" />
      <div data-hero-parallax="vignette" className="cine-vignette" />
      <div className="cine-grain" />
    </div>
  );
};
