import { render, renderHook } from "@testing-library/react";

import { useHiringFitReveal } from "components/HiringFit/hooks/useHiringFitReveal";

jest.mock("utils/gsap", () => {
  const to = jest.fn().mockReturnThis();
  const timeline = jest.fn(() => ({ to }));

  return {
    __esModule: true,
    gsap: {
      set: jest.fn(),
      timeline,
    },
    ScrollTrigger: {
      create: jest.fn(() => ({ kill: jest.fn() })),
    },
    prefersReducedMotion: jest.fn(() => false),
    registerGSAPPlugins: jest.fn(),
  };
});

type GsapMock = {
  gsap: { set: jest.Mock; timeline: jest.Mock };
  prefersReducedMotion: jest.Mock;
  ScrollTrigger: { create: jest.Mock };
};

const getMock = (): GsapMock => {
  return jest.requireMock("utils/gsap") as GsapMock;
};

const Harness = () => {
  const {
    selectors: { sectionRef },
  } = useHiringFitReveal();
  return (
    <section ref={sectionRef}>
      <h2 data-hiring-heading>Heading</h2>
      <p data-hiring-lede>Lede</p>
      <span data-hiring-badge>Badge 1</span>
      <span data-hiring-badge>Badge 2</span>
      <article data-hiring-card>Card 1</article>
      <article data-hiring-card>Card 2</article>
      <div data-hiring-ctas>CTAs</div>
    </section>
  );
};

describe("useHiringFitReveal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a sectionRef", () => {
    const { result } = renderHook(() => useHiringFitReveal());
    expect(result.current.selectors.sectionRef).toBeDefined();
    expect(result.current.selectors.sectionRef.current).toBeNull();
  });

  it("sets all elements visible without a ScrollTrigger when reduced motion is preferred", () => {
    const mock = getMock();
    mock.prefersReducedMotion.mockReturnValueOnce(true);

    render(<Harness />);

    expect(mock.gsap.set).toHaveBeenCalled();
    expect(mock.ScrollTrigger.create).not.toHaveBeenCalled();
  });

  it("animates heading, badges, cards, and ctas on enter when motion is allowed", () => {
    const mock = getMock();
    mock.prefersReducedMotion.mockReturnValue(false);

    render(<Harness />);

    expect(mock.ScrollTrigger.create).toHaveBeenCalled();
    const config = mock.ScrollTrigger.create.mock.calls[0][0];
    config.onEnter();

    expect(mock.gsap.timeline).toHaveBeenCalled();
  });
});
