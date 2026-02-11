import gsap from "gsap";

import { prefersReducedMotion, registerGSAPPlugins } from "utils/gsap";

jest.mock("gsap", () => ({
  registerPlugin: jest.fn(),
}));

jest.mock("gsap/ScrollTrigger", () => ({ __esModule: true, default: {} }));

describe("utils/gsap", () => {
  describe("registerGSAPPlugins", () => {
    it("registers ScrollTrigger when window exists and registerPlugin is function", () => {
      registerGSAPPlugins();
      expect(gsap.registerPlugin).toHaveBeenCalled();
    });

    it("does not call registerPlugin again when already registered", () => {
      const count = jest.mocked(gsap.registerPlugin).mock.calls.length;
      registerGSAPPlugins();
      expect(jest.mocked(gsap.registerPlugin).mock.calls.length).toBe(count);
    });
  });

  describe("prefersReducedMotion", () => {
    const originalMatchMedia = window.matchMedia;

    afterEach(() => {
      Object.defineProperty(window, "matchMedia", {
        value: originalMatchMedia,
        writable: true,
      });
    });

    it("returns false when matchMedia is not a function", () => {
      Object.defineProperty(window, "matchMedia", { value: undefined, writable: true });
      expect(prefersReducedMotion()).toBe(false);
    });

    it("returns true when matchMedia returns matches true", () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: true });
      expect(prefersReducedMotion()).toBe(true);
    });

    it("returns false when matchMedia returns matches false", () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: false });
      expect(prefersReducedMotion()).toBe(false);
    });
  });
});
