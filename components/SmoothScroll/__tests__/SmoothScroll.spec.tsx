import { render, screen } from "@testing-library/react";

import { SmoothScroll } from "components/SmoothScroll/SmoothScroll";

jest.mock("utils/gsap", () => {
  const ticker = {
    add: jest.fn(),
    remove: jest.fn(),
    lagSmoothing: jest.fn(),
  };

  return {
    __esModule: true,
    gsap: {
      ticker,
    },
    ScrollTrigger: {
      update: jest.fn(),
    },
    prefersReducedMotion: jest.fn(() => false),
    registerGSAPPlugins: jest.fn(),
  };
});

jest.mock("lenis", () => {
  return function MockLenis(
    this: { on: jest.Mock; raf: jest.Mock; destroy: jest.Mock },
    _options: unknown
  ) {
    this.on = jest.fn();
    this.raf = jest.fn();
    this.destroy = jest.fn();
  };
});

describe("SmoothScroll", () => {
  it("renders children", () => {
    render(
      <SmoothScroll>
        <div>Content</div>
      </SmoothScroll>
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("skips initialization when reduced motion is preferred", () => {
    const { prefersReducedMotion } = jest.requireMock("utils/gsap") as {
      prefersReducedMotion: jest.Mock;
    };

    prefersReducedMotion.mockReturnValueOnce(true);

    render(
      <SmoothScroll>
        <div>Content</div>
      </SmoothScroll>
    );
  });
});
