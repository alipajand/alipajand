import { renderHook } from "@testing-library/react";

import { useHero } from "components/Hero/hooks/useHero";

jest.mock("gsap", () => ({
  set: jest.fn(),
  to: jest.fn().mockReturnValue({}),
  fromTo: jest.fn().mockReturnValue({}),
  timeline: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    to: jest.fn().mockReturnThis(),
  })),
}));

describe("useHero", () => {
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
});
