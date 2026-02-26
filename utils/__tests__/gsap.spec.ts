import { gsap, prefersReducedMotion, registerGSAPPlugins } from "utils/gsap";

jest.mock("gsap", () => ({
  __esModule: true,
  default: {
    registerPlugin: jest.fn(),
  },
}));

describe("utils/gsap", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      value: originalMatchMedia,
      writable: true,
      configurable: true,
    });
    jest.clearAllMocks();
  });

  it("registerGSAPPlugins registers ScrollTrigger only once", () => {
    const mockGsap = gsap as unknown as { registerPlugin: jest.Mock };

    registerGSAPPlugins();
    registerGSAPPlugins();

    expect(mockGsap.registerPlugin).toHaveBeenCalledTimes(1);
  });

  it("prefersReducedMotion returns false when matchMedia is not a function", () => {
    Object.defineProperty(window, "matchMedia", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const result = prefersReducedMotion();
    expect(result).toBe(false);
  });

  it("prefersReducedMotion returns matchMedia result when available", () => {
    Object.defineProperty(window, "matchMedia", {
      value: jest.fn().mockReturnValue({ matches: true } as MediaQueryList),
      writable: true,
      configurable: true,
    });
    expect(prefersReducedMotion()).toBe(true);

    Object.defineProperty(window, "matchMedia", {
      value: jest.fn().mockReturnValue({ matches: false } as MediaQueryList),
      writable: true,
      configurable: true,
    });
    expect(prefersReducedMotion()).toBe(false);
  });
});
