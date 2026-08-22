import { render, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import React from "react";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import * as gsapUtils from "utils/gsap";

jest.mock("utils/gsap", () => ({
  __esModule: true,
  gsap: { set: jest.fn(), to: jest.fn() },
  prefersReducedMotion: jest.fn(() => false),
}));

const Wrapper = ({
  children,
  options = {},
}: {
  children?: ReactNode;
  options?: Parameters<typeof useScrollReveal>[0];
}) => {
  const { selectors } = useScrollReveal(options);
  return (
    <div ref={selectors.sectionRef as React.RefObject<HTMLDivElement>}>
      <span data-reveal>one</span>
      <span data-reveal>two</span>
      {children}
    </div>
  );
};

describe("useScrollReveal", () => {
  beforeEach(() => {
    jest.mocked(gsapUtils.gsap.set).mockClear();
    jest.mocked(gsapUtils.gsap.to).mockClear();
    jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(false);
  });

  describe("default values and initial behavior", () => {
    it("should return selectors with sectionRef", () => {
      const { result } = renderHook(() => useScrollReveal());

      expect(result.current.selectors.sectionRef).toBeDefined();
      expect(result.current.selectors.sectionRef.current).toBeNull();
    });
  });

  describe("effect with mounted element", () => {
    it("should hide then reveal every data-reveal child as it enters frame", () => {
      render(<Wrapper />);

      expect(gsapUtils.gsap.set).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(HTMLElement)]),
        expect.objectContaining({ opacity: 0 })
      );
      expect(gsapUtils.gsap.to).toHaveBeenCalledTimes(2);
      expect(gsapUtils.gsap.to).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ opacity: 1, y: 0, scale: 1 })
      );
    });

    it("should stagger elements that enter frame in the same beat", () => {
      render(<Wrapper options={{ stagger: 0.2 }} />);

      const delays = jest
        .mocked(gsapUtils.gsap.to)
        .mock.calls.map((call) => (call[1] as { delay: number }).delay);

      expect(delays).toEqual([0, 0.2]);
    });

    it("should use the custom travel distance", () => {
      render(<Wrapper options={{ y: 100 }} />);

      expect(gsapUtils.gsap.set).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ y: 100 })
      );
    });

    it("should use the custom duration and delay", () => {
      render(<Wrapper options={{ duration: 1.5, delay: 0.5 }} />);

      expect(gsapUtils.gsap.to).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ duration: 1.5, delay: 0.5 })
      );
    });

    it("should reveal data-cine-title headings word by word", () => {
      const TitleWrapper = () => {
        const { selectors } = useScrollReveal();
        return (
          <div ref={selectors.sectionRef as React.RefObject<HTMLDivElement>}>
            <h2 data-cine-title>Selected Work</h2>
          </div>
        );
      };

      const { container } = render(<TitleWrapper />);

      expect(container.querySelectorAll("[data-cine-word]")).toHaveLength(2);
      expect(container.querySelector("h2")).toHaveTextContent("Selected Work");
      expect(gsapUtils.gsap.to).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ yPercent: 0 })
      );
    });
  });

  describe("prefersReducedMotion", () => {
    it("should show every child immediately without animating", () => {
      jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(true);

      render(<Wrapper />);

      expect(gsapUtils.gsap.set).toHaveBeenCalledWith(expect.anything(), {
        opacity: 1,
        y: 0,
        scale: 1,
      });
      expect(gsapUtils.gsap.to).not.toHaveBeenCalled();
    });
  });

  describe("no data-reveal children", () => {
    it("should do nothing when the section has no staged elements", () => {
      const EmptyWrapper = () => {
        const { selectors } = useScrollReveal();
        return <div ref={selectors.sectionRef as React.RefObject<HTMLDivElement>}>no reveal</div>;
      };

      render(<EmptyWrapper />);

      expect(gsapUtils.gsap.set).not.toHaveBeenCalled();
      expect(gsapUtils.gsap.to).not.toHaveBeenCalled();
    });
  });
});
