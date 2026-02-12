"use client";

import type { HeroGridConfig } from "components/Hero/hooks/useGridOutlineAnimation";

export interface GridOutlinePathProps {
  grid: HeroGridConfig;
  rowIndex: number;
  colIndex: number;
}

export function GridOutlinePath({ grid, rowIndex, colIndex }: GridOutlinePathProps) {
  const { startX, startY, cellTotal, squareSize, gridRows, gridCols } = grid;
  const x = startX + colIndex * cellTotal;
  const y = startY + rowIndex * cellTotal;
  const w = squareSize;
  const sum = rowIndex + colIndex;
  const maxSum = gridRows + gridCols - 2;
  const opacity = maxSum > 0 ? 0.02 + (sum / maxSum) * 0.06 : 0.02;
  const pathD = `M ${x} ${y} L ${x + w} ${y} M ${x + w} ${y} L ${x + w} ${y + w} M ${x + w} ${y + w} L ${x} ${y + w} M ${x} ${y + w} L ${x} ${y}`;

  return (
    <path
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
}
