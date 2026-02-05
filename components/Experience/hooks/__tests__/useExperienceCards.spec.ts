import { renderHook } from "@testing-library/react";

import { useExperienceCards } from "components/Experience/hooks/useExperienceCards";

jest.mock("gsap", () => ({
  set: jest.fn(),
  to: jest.fn().mockReturnValue({}),
}));

describe("useExperienceCards", () => {
  describe("default values and initial behavior", () => {
    it("should return selectors with cardsRef", () => {
      const { result } = renderHook(() => useExperienceCards());

      expect(result.current.selectors).toBeDefined();
      expect(result.current.selectors.cardsRef).toBeDefined();
      expect(result.current.selectors.cardsRef.current).toBeNull();
    });

    it("should accept options and still return correct shape", () => {
      const { result } = renderHook(() =>
        useExperienceCards({ y: 40, duration: 0.8, threshold: 0.3 })
      );

      expect(result.current.selectors.cardsRef).toBeDefined();
    });
  });
});
