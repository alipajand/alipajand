"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "utils/gsap";

const SQUARE_SIZE = 60;
const GAP = 0;
const PADDING = 48;

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 800;
const GRID_WIDTH = VIEWBOX_WIDTH - 2 * PADDING;
const GRID_HEIGHT = VIEWBOX_HEIGHT - 2 * PADDING;
const CELL_TOTAL = SQUARE_SIZE + GAP;

const GRID_COLS = Math.floor(GRID_WIDTH / CELL_TOTAL);
const GRID_ROWS = Math.floor(GRID_HEIGHT / CELL_TOTAL);

const TOTAL_GRID_W = GRID_COLS * CELL_TOTAL;
const TOTAL_GRID_H = GRID_ROWS * CELL_TOTAL;
const START_X = (VIEWBOX_WIDTH - TOTAL_GRID_W) / 2;
const START_Y = (VIEWBOX_HEIGHT - TOTAL_GRID_H) / 2;

export function HeroBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion() || !svgRef.current) return;

    const svg = svgRef.current;
    const paths = svg.querySelectorAll<SVGPathElement>("path[data-grid-outline]");

    const maxSum = GRID_ROWS + GRID_COLS - 2;
    const maxDelay = (GRID_ROWS * GRID_COLS - 1) * 0.015;

    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      const sum = Number(path.getAttribute("data-sum")) ?? 0;
      const delay = maxSum > 0 ? ((maxSum - sum) / maxSum) * maxDelay : 0;

      gsap.to(path, {
        delay,
        strokeDashoffset: 0,
        duration: 0.35,
        ease: "power2.out",
      });
    });
  }, []);

  const snakeOrder: [number, number][] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    const cols = Array.from({ length: GRID_COLS }, (_, i) => i);
    const ordered = row % 2 === 0 ? cols : [...cols].reverse();
    ordered.forEach((col) => snakeOrder.push([row, col]));
  }

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {snakeOrder.map(([rowIndex, colIndex]) => {
        const x = START_X + colIndex * CELL_TOTAL;
        const y = START_Y + rowIndex * CELL_TOTAL;
        const w = SQUARE_SIZE;
        const sum = rowIndex + colIndex;
        const maxSum = GRID_ROWS + GRID_COLS - 2;
        const opacity = maxSum > 0 ? 0.02 + (sum / maxSum) * 0.06 : 0.02;
        const pathD = `M ${x} ${y} L ${x + w} ${y} M ${x + w} ${y} L ${x + w} ${y + w} M ${x + w} ${y + w} L ${x} ${y + w} M ${x} ${y + w} L ${x} ${y}`;

        return (
          <path
            key={`${rowIndex}-${colIndex}`}
            data-grid-outline
            data-sum={sum}
            d={pathD}
            fill="none"
            stroke={`rgba(255, 255, 255, ${opacity})`}
            strokeWidth="1"
            strokeLinejoin="miter"
            vectorEffect="non-scaling-stroke"
            style={{
              strokeDasharray: 9999,
              strokeDashoffset: 9999,
            }}
          />
        );
      })}
    </svg>
  );
}
