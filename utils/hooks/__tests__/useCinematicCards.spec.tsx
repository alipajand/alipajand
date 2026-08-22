import { render } from "@testing-library/react";
import type React from "react";

import { useCinematicCards } from "utils/hooks/useCinematicCards";
import * as gsapUtils from "utils/gsap";

jest.mock("utils/gsap", () => ({
  __esModule: true,
  gsap: { set: jest.fn() },
  prefersReducedMotion: jest.fn(() => false),
}));

const Harness = () => {
  const {
    selectors: { containerRef },
  } = useCinematicCards({ travel: 40 });

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>}>
      <article data-cine-card>one</article>
      <article data-cine-card>two</article>
    </div>
  );
};

describe("useCinematicCards", () => {
  beforeEach(() => {
    jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(false);
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 1;
    });
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should give each card its own drift, alternating direction by lane", () => {
    const { container } = render(<Harness />);
    const [first, second] = Array.from(container.querySelectorAll<HTMLElement>("[data-cine-card]"));

    expect(first.style.getPropertyValue("--cine-card-y")).not.toBe("");
    expect(second.style.getPropertyValue("--cine-card-y")).not.toBe("");
    expect(first.style.getPropertyValue("--cine-card-y")).not.toBe(
      second.style.getPropertyValue("--cine-card-y")
    );
  });

  it("should not touch cards when reduced motion is preferred", () => {
    jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(true);

    const { container } = render(<Harness />);
    const first = container.querySelector<HTMLElement>("[data-cine-card]");

    expect(first?.style.getPropertyValue("--cine-card-y")).toBe("");
  });
});
