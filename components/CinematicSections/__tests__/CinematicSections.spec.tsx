import { render, screen } from "@testing-library/react";

import { CinematicSections } from "components/CinematicSections/CinematicSections";

jest.mock("utils/gsap", () => ({
  gsap: { set: jest.fn(), to: jest.fn() },
  prefersReducedMotion: jest.fn(() => false),
}));

const observe = jest.fn();
const unobserve = jest.fn();
const disconnect = jest.fn();
let observerCallback: IntersectionObserverCallback = () => {};

beforeAll(() => {
  class MockIntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
      observerCallback = callback;
    }
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: MockIntersectionObserver,
  });
  Object.defineProperty(global, "IntersectionObserver", {
    writable: true,
    value: MockIntersectionObserver,
  });
});

describe("CinematicSections", () => {
  beforeEach(() => {
    observe.mockClear();
    unobserve.mockClear();
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

  it("should observe each staged section and reveal it once it intersects", () => {
    const { gsap } = jest.requireMock("utils/gsap") as { gsap: { to: jest.Mock } };
    gsap.to.mockClear();

    render(
      <CinematicSections>
        <section>Only</section>
      </CinematicSections>
    );

    expect(observe).toHaveBeenCalledTimes(1);
    expect(gsap.to).not.toHaveBeenCalled();

    const target = document.querySelector("[data-cine-section]") as HTMLElement;
    observerCallback(
      [{ isIntersecting: true, target } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver
    );

    expect(unobserve).toHaveBeenCalledWith(target);
    expect(gsap.to).toHaveBeenCalledWith(target, expect.objectContaining({ opacity: 1, y: 0 }));
  });

  it("should show sections immediately when reduced motion is preferred", () => {
    const { gsap, prefersReducedMotion } = jest.requireMock("utils/gsap") as {
      gsap: { set: jest.Mock };
      prefersReducedMotion: jest.Mock;
    };
    prefersReducedMotion.mockReturnValueOnce(true);
    gsap.set.mockClear();

    render(
      <CinematicSections>
        <section>Only</section>
      </CinematicSections>
    );

    expect(observe).not.toHaveBeenCalled();
    expect(gsap.set).toHaveBeenCalledWith(expect.anything(), { opacity: 1, y: 0, scale: 1 });
  });
});
