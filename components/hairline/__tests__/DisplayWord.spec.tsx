import { render, screen } from "@testing-library/react";

import { DisplayWord } from "components/hairline/DisplayWord/DisplayWord";
import { installMatchMedia, installObservers } from "utils/motion/testEnvironment";

beforeEach(() => {
  installMatchMedia(false);
  installObservers();
});

describe("DisplayWord", () => {
  it("should read as one phrase while the split words stay decorative", () => {
    render(<DisplayWord words={["Selected", "Work"]} variant="index" />);
    const word = screen.getByText("Selected Work");
    expect(word.closest("p")).toBeInTheDocument();
    for (const piece of screen.getAllByText(/^(Selected|Work)$/)) {
      expect(piece).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("should render as the page heading when asked", () => {
    render(<DisplayWord words={["Ali", "Pajand"]} as="h1" />);
    expect(screen.getByRole("heading", { level: 1, name: "Ali Pajand" })).toBeInTheDocument();
  });

  it("should leave the words at rest under reduced motion", () => {
    installMatchMedia(true);
    const { container } = render(<DisplayWord words={["Ali", "Pajand"]} />);
    container.querySelectorAll<HTMLElement>("[data-word]").forEach((word) => {
      expect(word.style.transform).toBe("");
    });
  });
});
