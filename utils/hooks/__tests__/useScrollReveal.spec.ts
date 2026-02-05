import { renderHook } from "@testing-library/react";

import { useScrollReveal } from "utils/hooks/useScrollReveal";

jest.mock("gsap", () => ({
  set: jest.fn(),
  timeline: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
  })),
}));

describe("useScrollReveal", () => {
  describe("default values and initial behavior", () => {
    it("should return selectors with sectionRef", () => {
      const { result } = renderHook(() => useScrollReveal());

      expect(result.current.selectors).toBeDefined();
      expect(result.current.selectors.sectionRef).toBeDefined();
      expect(result.current.selectors.sectionRef.current).toBeNull();
    });

    it("should return sectionRef that is a ref object", () => {
      const { result } = renderHook(() => useScrollReveal());

      expect(result.current.selectors.sectionRef).toHaveProperty("current");
      expect(typeof result.current.selectors.sectionRef).toBe("object");
    });
  });

  describe("with options", () => {
    it("should accept options object and still return correct shape", () => {
      const { result } = renderHook(() => useScrollReveal({ y: 32, stagger: 0.08, once: true }));

      expect(result.current.selectors.sectionRef).toBeDefined();
    });
  });
});
