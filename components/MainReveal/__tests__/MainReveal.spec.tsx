import { render, screen } from "@testing-library/react";

import { MainReveal } from "components/MainReveal/MainReveal";

jest.mock("utils/gsap", () => {
  const fromTo = jest.fn();
  return {
    __esModule: true,
    gsap: {
      fromTo,
      ticker: {
        add: jest.fn(),
        remove: jest.fn(),
        lagSmoothing: jest.fn(),
      },
    },
    prefersReducedMotion: jest.fn(() => false),
  };
});

describe("MainReveal", () => {
  it("renders children", () => {
    render(
      <MainReveal>
        <span>Child content</span>
      </MainReveal>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders wrapper with min-h-screen class", () => {
    const { container } = render(
      <MainReveal>
        <div />
      </MainReveal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("min-h-screen");
  });

  it("does not animate when prefersReducedMotion is true", () => {
    const { prefersReducedMotion, gsap } = jest.requireMock("utils/gsap") as {
      prefersReducedMotion: jest.Mock;
      gsap: { fromTo: jest.Mock };
    };

    prefersReducedMotion.mockReturnValueOnce(true);

    const { container } = render(
      <MainReveal>
        <div>Content</div>
      </MainReveal>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(gsap.fromTo).not.toHaveBeenCalled();
  });
});
