import { prefersReducedMotion } from "utils/gsap";

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

  it("should return false when matchMedia is not a function for prefersReducedMotion", () => {
    Object.defineProperty(window, "matchMedia", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const result = prefersReducedMotion();
    expect(result).toBe(false);
  });

  it("should return matchMedia result when available for prefersReducedMotion", () => {
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
