import { render, renderHook } from "@testing-library/react";

import { useExperienceCards } from "components/Experience/hooks/useExperienceCards";
import * as utilsGsap from "utils/gsap";

jest.mock("gsap", () => ({
  set: jest.fn(),
  to: jest.fn(),
}));

jest.mock("utils/gsap", () => ({
  gsap: { set: jest.fn(), to: jest.fn() },
  registerGSAPPlugins: jest.fn(),
  ScrollTrigger: {
    create: jest.fn(() => ({ kill: jest.fn() })),
  },
}));

function CardsWrapper({ options = {} }: { options?: Parameters<typeof useExperienceCards>[0] }) {
  const { selectors } = useExperienceCards(options);
  return (
    <ul ref={selectors.cardsRef}>
      <li data-experience-card>Card 1</li>
      <li data-experience-card>Card 2</li>
    </ul>
  );
}

describe("useExperienceCards", () => {
  beforeEach(() => {
    jest.mocked(utilsGsap.ScrollTrigger.create).mockClear();
  });

  describe("default values and initial behavior", () => {
    it("should return selectors with cardsRef", () => {
      const { result } = renderHook(() => useExperienceCards());

      expect(result.current.selectors).toBeDefined();
      expect(result.current.selectors.cardsRef).toBeDefined();
      expect(result.current.selectors.cardsRef.current).toBeNull();
    });

    it("should accept options and still return correct shape", () => {
      const { result } = renderHook(() => useExperienceCards({ y: 40, duration: 0.8 }));

      expect(result.current.selectors.cardsRef).toBeDefined();
    });
  });

  describe("effect with mounted list", () => {
    it("calls gsap.set and ScrollTrigger.create per card", () => {
      render(<CardsWrapper />);
      expect(utilsGsap.gsap.set).toHaveBeenCalled();
      expect(utilsGsap.ScrollTrigger.create).toHaveBeenCalledTimes(2);
    });

    it("calls cleanup on unmount", () => {
      const killMock = jest.fn();
      jest
        .mocked(utilsGsap.ScrollTrigger.create)
        .mockImplementation(
          () => ({ kill: killMock }) as unknown as ReturnType<typeof utilsGsap.ScrollTrigger.create>
        );
      const { unmount } = render(<CardsWrapper />);
      unmount();
      expect(killMock).toHaveBeenCalledTimes(2);
    });

    it("onEnter animates card", () => {
      render(<CardsWrapper options={{ duration: 0.5, ease: "power2.out" }} />);
      const firstCall = jest.mocked(utilsGsap.ScrollTrigger.create).mock.calls[0];
      const firstCreate = firstCall[0] as { onEnter?: () => void };
      firstCreate.onEnter?.();
      expect(utilsGsap.gsap.to).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ duration: 0.5, ease: "power2.out" })
      );
    });
  });
});
