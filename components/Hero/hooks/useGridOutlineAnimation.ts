"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion } from "utils/gsap";

export const GAP = 0;
export const PADDING = 48;
export const SQUARE_SIZE = 60;

export const VIEWBOX_WIDTH = 1200;
export const VIEWBOX_HEIGHT = 800;
const GRID_WIDTH = VIEWBOX_WIDTH - 2 * PADDING;
const GRID_HEIGHT = VIEWBOX_HEIGHT - 2 * PADDING;
export const CELL_TOTAL = SQUARE_SIZE + GAP;

export const GRID_COLS = Math.floor(GRID_WIDTH / CELL_TOTAL);
export const GRID_ROWS = Math.floor(GRID_HEIGHT / CELL_TOTAL);

const TOTAL_GRID_W = GRID_COLS * CELL_TOTAL;
const TOTAL_GRID_H = GRID_ROWS * CELL_TOTAL;
export const START_X = (VIEWBOX_WIDTH - TOTAL_GRID_W) / 2;
export const START_Y = (VIEWBOX_HEIGHT - TOTAL_GRID_H) / 2;

export interface HeroGridConfig {
  startX: number;
  startY: number;
  cellTotal: number;
  squareSize: number;
  gridRows: number;
  gridCols: number;
}

export const HERO_GRID_CONFIG: HeroGridConfig = {
  startX: START_X,
  startY: START_Y,
  cellTotal: CELL_TOTAL,
  squareSize: SQUARE_SIZE,
  gridRows: GRID_ROWS,
  gridCols: GRID_COLS,
};

const SNAKE_ORDER: [number, number][] = (() => {
  const order: [number, number][] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    const cols = Array.from({ length: GRID_COLS }, (_, i) => i);
    const ordered = row % 2 === 0 ? cols : [...cols].reverse();
    ordered.forEach((col) => order.push([row, col]));
  }
  return order;
})();

export interface UseGridOutlineAnimationOptions {
  delayPerCell?: number;
  duration?: number;
}

export interface GridOutlineAnimationSelectors {
  svgRef: RefObject<SVGSVGElement | null>;
  snakeOrder: [number, number][];
}

export interface GridOutlineAnimationHook {
  selectors: GridOutlineAnimationSelectors;
}

export function useGridOutlineAnimation(
  options: UseGridOutlineAnimationOptions = {}
): GridOutlineAnimationHook {
  const svgRef = useRef<SVGSVGElement>(null);
  const { delayPerCell = 0.015, duration = 0.35 } = options;

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion() || !svgRef.current) return;

    const svg = svgRef.current;
    const paths = svg.querySelectorAll<SVGPathElement>("path[data-grid-outline]");

    const maxSum = GRID_ROWS + GRID_COLS - 2;
    const maxDelay = (GRID_ROWS * GRID_COLS - 1) * delayPerCell;

    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      const sum = Number(path.getAttribute("data-sum")) ?? 0;
      const delay = maxSum > 0 ? ((maxSum - sum) / maxSum) * maxDelay : 0;

      gsap.to(path, {
        delay,
        strokeDashoffset: 0,
        duration,
        ease: "power2.out",
      });
    });
  }, [delayPerCell, duration]);

  return {
    selectors: {
      svgRef,
      snakeOrder: SNAKE_ORDER,
    },
  };
}
