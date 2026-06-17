import { render, renderHook } from "@testing-library/react";

import { usePageHeader } from "utils/hooks/usePageHeader";

jest.mock("gsap", () => {
  const timeline = jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    kill: jest.fn(),
  }));

  const gsap = { set: jest.fn(), timeline };

  return { __esModule: true, default: gsap, ...gsap };
});

jest.mock("utils/gsap", () => ({
  __esModule: true,
  prefersReducedMotion: jest.fn(() => false),
}));

type GsapMock = {
  set: jest.Mock;
  timeline: jest.Mock;
};

const getGsap = (): GsapMock => {
  return jest.requireMock("gsap") as unknown as GsapMock;
};

const getReducedMotionMock = (): jest.Mock => {
  return (
    jest.requireMock("utils/gsap") as {
      prefersReducedMotion: jest.Mock;
    }
  ).prefersReducedMotion;
};

const Harness = () => {
  const {
    selectors: { headerRef },
  } = usePageHeader();
  return (
    <header ref={headerRef}>
      <span data-header-overline>Overline</span>
      <h1 data-header-title>Title</h1>
      <p data-header-lede>Lede</p>
      <span data-header-back>Back</span>
    </header>
  );
};

describe("usePageHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a headerRef", () => {
    const { result } = renderHook(() => usePageHeader());
    expect(result.current.selectors.headerRef).toBeDefined();
    expect(result.current.selectors.headerRef.current).toBeNull();
  });

  it("should animate the header elements with a timeline when motion is allowed", () => {
    getReducedMotionMock().mockReturnValue(false);
    const gsap = getGsap();

    render(<Harness />);

    expect(gsap.set).toHaveBeenCalled();
    expect(gsap.timeline).toHaveBeenCalled();
  });

  it("should set elements visible without a timeline when reduced motion is preferred", () => {
    getReducedMotionMock().mockReturnValue(true);
    const gsap = getGsap();

    render(<Harness />);

    expect(gsap.set).toHaveBeenCalledWith(expect.anything(), { opacity: 1, y: 0 });
    expect(gsap.timeline).not.toHaveBeenCalled();
  });

  it("should do nothing when the header has no animatable elements", () => {
    getReducedMotionMock().mockReturnValue(false);
    const gsap = getGsap();

    const EmptyHarness = () => {
      const {
        selectors: { headerRef },
      } = usePageHeader();
      return <header ref={headerRef} />;
    };

    render(<EmptyHarness />);

    expect(gsap.set).not.toHaveBeenCalled();
    expect(gsap.timeline).not.toHaveBeenCalled();
  });
});
