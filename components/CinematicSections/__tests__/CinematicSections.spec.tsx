import { render, screen } from "@testing-library/react";

import { CinematicSections } from "components/CinematicSections/CinematicSections";
import * as gsapUtils from "utils/gsap";

jest.mock("utils/gsap", () => ({
  __esModule: true,
  gsap: { set: jest.fn(), to: jest.fn() },
  prefersReducedMotion: jest.fn(() => false),
}));

describe("CinematicSections", () => {
  beforeEach(() => {
    jest.mocked(gsapUtils.gsap.set).mockClear();
    jest.mocked(gsapUtils.gsap.to).mockClear();
    jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(false);
  });

  it("should render every child inside a staged wrapper", () => {
    render(
      <CinematicSections>
        <section>First</section>
        <section>Second</section>
      </CinematicSections>
    );

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(document.querySelectorAll("[data-cine-section]")).toHaveLength(2);
  });

  it("should hide each section and reveal it once it enters frame", () => {
    render(
      <CinematicSections>
        <section>Only</section>
      </CinematicSections>
    );

    expect(gsapUtils.gsap.set).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ opacity: 0, y: 56 })
    );
    expect(gsapUtils.gsap.to).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ opacity: 1, y: 0, scale: 1 })
    );
  });

  it("should show sections immediately when reduced motion is preferred", () => {
    jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(true);

    render(
      <CinematicSections>
        <section>Only</section>
      </CinematicSections>
    );

    expect(gsapUtils.gsap.set).toHaveBeenCalledWith(expect.anything(), {
      opacity: 1,
      y: 0,
      scale: 1,
    });
    expect(gsapUtils.gsap.to).not.toHaveBeenCalled();
  });
});
