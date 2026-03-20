import { render } from "@testing-library/react";

import { HeroBackground } from "components/Hero/HeroBackground";

const mockSnakeOrder: [number, number][] = [
  [0, 0],
  [0, 1],
  [1, 0],
];

jest.mock("components/Hero/hooks/useGridOutlineAnimation", () => {
  const actual = jest.requireActual("components/Hero/hooks/useGridOutlineAnimation");

  return {
    __esModule: true,
    ...actual,
    useGridOutlineAnimation: jest.fn(() => ({
      selectors: {
        svgRef: { current: null },
        snakeOrder: mockSnakeOrder,
      },
    })),
  };
});

jest.mock("components/Hero/GridOutlinePath", () => {
  const GridOutlinePathMock = jest.fn(
    ({ rowIndex, colIndex }: { rowIndex: number; colIndex: number }) => (
      <path data-testid="grid-path" data-row={rowIndex} data-col={colIndex} />
    )
  );

  return {
    __esModule: true,
    GridOutlinePath: GridOutlinePathMock,
  };
});

describe("HeroBackground", () => {
  it("renders an svg with paths for each grid cell in snake order", () => {
    const { container } = render(<HeroBackground />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();

    const paths = container.querySelectorAll("[data-testid='grid-path']");
    expect(paths).toHaveLength(mockSnakeOrder.length);

    mockSnakeOrder.forEach(([row, col]) => {
      expect(
        container.querySelector(`[data-testid='grid-path'][data-row='${row}'][data-col='${col}']`)
      ).not.toBeNull();
    });
  });
});
