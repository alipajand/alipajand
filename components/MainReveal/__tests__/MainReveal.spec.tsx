import { render, screen } from "@testing-library/react";

import { MainReveal } from "components/MainReveal/MainReveal";

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

  it("renders the shared main-content focus target", () => {
    const { container } = render(
      <MainReveal>
        <div />
      </MainReveal>
    );
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.tagName).toBe("MAIN");
    expect(wrapper).toHaveAttribute("id", "main-content");
    expect(wrapper).toHaveAttribute("tabindex", "-1");
  });
});
