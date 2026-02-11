import { render, renderHook } from "@testing-library/react";
import gsap from "gsap";
import type React from "react";

import { useHero } from "components/Hero/hooks/useHero";
import * as utilsGsap from "utils/gsap";

jest.mock("gsap", () => ({
  set: jest.fn(),
  to: jest.fn(),
  timeline: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    to: jest.fn().mockReturnThis(),
  })),
}));

jest.mock("utils/gsap", () => ({
  prefersReducedMotion: jest.fn(() => false),
}));

describe("useHero", () => {
  beforeEach(() => {
    jest.mocked(gsap.set).mockClear();
    jest.mocked(gsap.to).mockClear();
    jest.mocked(gsap.timeline).mockClear();
  });

  describe("default values and initial behavior", () => {
    it("should return selectors with all refs", () => {
      const { result } = renderHook(() => useHero());

      expect(result.current.selectors).toBeDefined();
      expect(result.current.selectors.containerRef).toBeDefined();
      expect(result.current.selectors.nameCharsRef).toBeDefined();
      expect(result.current.selectors.line2Ref).toBeDefined();
      expect(result.current.selectors.subRef).toBeDefined();
      expect(result.current.selectors.ctaRef).toBeDefined();
      expect(result.current.selectors.scrollIndicatorRef).toBeDefined();
    });

    it("should have refs with current null initially", () => {
      const { result } = renderHook(() => useHero());

      expect(result.current.selectors.containerRef.current).toBeNull();
      expect(result.current.selectors.nameCharsRef.current).toBeNull();
    });
  });

  describe("effect with mounted refs", () => {
    it("calls gsap when refs are attached", () => {
      function HeroWrapper() {
        const { selectors } = useHero();
        return (
          <div ref={selectors.containerRef as React.RefObject<HTMLDivElement>}>
            <span ref={selectors.nameCharsRef}>
              <span data-char>A</span>
            </span>
            <span ref={selectors.line2Ref}>Tagline</span>
            <p ref={selectors.subRef}>Sub</p>
            <div ref={selectors.ctaRef}>
              <a href="#a">Link</a>
            </div>
            <div ref={selectors.metricsRef}>
              <div data-metric>1</div>
            </div>
            <p ref={selectors.locationRef}>Location</p>
            <div ref={selectors.scrollIndicatorRef}>↓</div>
          </div>
        );
      }
      render(<HeroWrapper />);
      expect(gsap.set).toHaveBeenCalled();
      expect(gsap.timeline).toHaveBeenCalled();
      expect(gsap.to).toHaveBeenCalled();
    });

    it("sets opacity 1 when prefersReducedMotion is true", () => {
      jest.mocked(utilsGsap.prefersReducedMotion).mockReturnValue(true);
      function HeroWrapper() {
        const { selectors } = useHero();
        return (
          <div ref={selectors.containerRef as React.RefObject<HTMLDivElement>}>
            <span ref={selectors.nameCharsRef}>
              <span data-char>A</span>
            </span>
            <span ref={selectors.line2Ref}>Tagline</span>
            <p ref={selectors.subRef}>Sub</p>
            <div ref={selectors.ctaRef} />
            <div ref={selectors.metricsRef}>
              <div data-metric>1</div>
            </div>
            <p ref={selectors.locationRef}>Location</p>
            <div ref={selectors.scrollIndicatorRef}>↓</div>
          </div>
        );
      }
      render(<HeroWrapper />);
      expect(gsap.set).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ opacity: 1, y: 0 })
      );
    });
  });
});
