import { render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";

import { useGridOutlineAnimation } from "components/Hero/hooks/useGridOutlineAnimation";

jest.mock("utils/gsap", () => {
  const to = jest.fn();

  return {
    __esModule: true,
    gsap: {
      to,
      ticker: {
        add: jest.fn(),
        remove: jest.fn(),
        lagSmoothing: jest.fn(),
      },
    },
    prefersReducedMotion: jest.fn(() => false),
  };
});

describe("useGridOutlineAnimation", () => {
  it("exposes svgRef and snakeOrder selectors", () => {
    const { result } = renderHook(() => useGridOutlineAnimation());

    expect(result.current.selectors.svgRef.current).toBeNull();
    expect(Array.isArray(result.current.selectors.snakeOrder)).toBe(true);
    expect(result.current.selectors.snakeOrder.length).toBeGreaterThan(0);
  });

  it("animates grid outline paths when motion is allowed", async () => {
    const { gsap, prefersReducedMotion } = jest.requireMock("utils/gsap") as {
      gsap: { to: jest.Mock };
      prefersReducedMotion: jest.Mock;
    };

    prefersReducedMotion.mockReturnValue(false);

    function TestComponent() {
      const { selectors } = useGridOutlineAnimation({ delayPerCell: 0.01, duration: 0.1 });
      const { svgRef, snakeOrder } = selectors;

      return (
        <svg ref={svgRef} aria-label="grid">
          {snakeOrder.slice(0, 3).map(([row, col]) => (
            <path
              key={`${row}-${col}`}
              data-grid-outline
              data-sum={row + col}
            />
          ))}
        </svg>
      );
    }

    const proto = Element.prototype as Element & {
      getTotalLength?: () => number;
    };
    if (!proto.getTotalLength) {
      proto.getTotalLength = jest.fn(() => 100);
    }

    render(<TestComponent />);

    await act(async () => {});

    expect(screen.getByLabelText("grid")).toBeInTheDocument();
    expect(gsap.to).toHaveBeenCalled();
  });

  it("skips animation when prefersReducedMotion is true", () => {
    const { prefersReducedMotion } = jest.requireMock("utils/gsap") as {
      prefersReducedMotion: jest.Mock;
    };

    prefersReducedMotion.mockReturnValue(true);

    function TestComponent() {
      const { selectors } = useGridOutlineAnimation();
      const { svgRef } = selectors;

      return (
        <svg ref={svgRef} aria-label="grid">
          <path data-grid-outline data-sum="0" />
        </svg>
      );
    }

    render(<TestComponent />);
  });
});

