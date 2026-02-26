import { gsap, prefersReducedMotion, registerGSAPPlugins } from "utils/gsap";

jest.mock("gsap", () => ({
  __esModule: true,
  default: {
    registerPlugin: jest.fn(),
  },
}));

type MutableMatchMediaWindow = Window & {
  matchMedia?: ((query: string) => MediaQueryList) | undefined;
};

const mutableWindow = window as MutableMatchMediaWindow;

describe("utils/gsap", () => {
  const originalMatchMedia = mutableWindow.matchMedia;

  afterEach(() => {
    mutableWindow.matchMedia = originalMatchMedia;
    jest.clearAllMocks();
  });

  it("registerGSAPPlugins registers ScrollTrigger only once", () => {
    const mockGsap = gsap as unknown as { registerPlugin: jest.Mock };

    registerGSAPPlugins();
    registerGSAPPlugins();

    expect(mockGsap.registerPlugin).toHaveBeenCalledTimes(1);
  });

  it("prefersReducedMotion returns false when matchMedia is not a function", () => {
    mutableWindow.matchMedia = undefined;

    const result = prefersReducedMotion();
    expect(result).toBe(false);
  });

  it("prefersReducedMotion returns matchMedia result when available", () => {
    mutableWindow.matchMedia = jest
      .fn()
      .mockReturnValue({ matches: true } as MediaQueryList);
    expect(prefersReducedMotion()).toBe(true);

    mutableWindow.matchMedia = jest
      .fn()
      .mockReturnValue({ matches: false } as MediaQueryList);
    expect(prefersReducedMotion()).toBe(false);
  });
});
