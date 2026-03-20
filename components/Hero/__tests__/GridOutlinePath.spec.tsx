import { render } from "@testing-library/react";

import { GridOutlinePath } from "components/Hero/GridOutlinePath";
import type { HeroGridConfig } from "components/Hero/hooks/useGridOutlineAnimation";

describe("GridOutlinePath", () => {
  const baseGrid: HeroGridConfig = {
    startX: 10,
    startY: 20,
    cellTotal: 50,
    squareSize: 40,
    gridRows: 3,
    gridCols: 3,
  };

  it("computes correct path coordinates and attributes for a cell", () => {
    const { container } = render(
      <svg>
        <GridOutlinePath grid={baseGrid} rowIndex={1} colIndex={2} />
      </svg>
    );

    const path = container.querySelector("path[data-grid-outline]");
    expect(path).not.toBeNull();
    expect(path).toHaveAttribute("data-sum", "3");

    const expectedX = baseGrid.startX + 2 * baseGrid.cellTotal;
    const expectedY = baseGrid.startY + baseGrid.cellTotal;
    const w = baseGrid.squareSize;
    const expectedD = `M ${expectedX} ${expectedY} L ${expectedX + w} ${expectedY} M ${expectedX + w} ${expectedY} L ${expectedX + w} ${expectedY + w} M ${expectedX + w} ${expectedY + w} L ${expectedX} ${expectedY + w} M ${expectedX} ${expectedY + w} L ${expectedX} ${expectedY}`;

    expect(path).toHaveAttribute("d", expectedD);

    const maxSum = baseGrid.gridRows + baseGrid.gridCols - 2;
    const opacity = 0.02 + (3 / maxSum) * 0.06;
    expect(path).toHaveAttribute("stroke", `rgba(255, 255, 255, ${opacity})`);
  });

  it("falls back to minimum opacity when grid has a single cell", () => {
    const singleCellGrid: HeroGridConfig = {
      ...baseGrid,
      gridRows: 1,
      gridCols: 1,
    };

    const { container } = render(
      <svg>
        <GridOutlinePath grid={singleCellGrid} rowIndex={0} colIndex={0} />
      </svg>
    );

    const path = container.querySelector("path[data-grid-outline]");
    expect(path).not.toBeNull();
    expect(path).toHaveAttribute("stroke", "rgba(255, 255, 255, 0.02)");
  });
});
