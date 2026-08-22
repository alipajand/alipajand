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
    prefersReducedMotion: jest.fn(() => false),
  };
});

type GsapMock = {
  gsap: { set: jest.Mock; timeline: jest.Mock };
  prefersReducedMotion: jest.Mock;
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

  it("should return a sectionRef", () => {
    const { result } = renderHook(() => useHiringFitReveal());
    expect(result.current.selectors.sectionRef).toBeDefined();
    expect(result.current.selectors.sectionRef.current).toBeNull();
  });

  it("should set all elements visible without a timeline when reduced motion is preferred", () => {
    const mock = getMock();
    mock.prefersReducedMotion.mockReturnValueOnce(true);

    render(<Harness />);

    expect(mock.gsap.set).toHaveBeenCalledWith(expect.anything(), {
      opacity: 1,
      y: 0,
      scale: 1,
    });
    expect(mock.gsap.timeline).not.toHaveBeenCalled();
  });

  it("should animate heading, badges, cards, and ctas once the section enters frame", () => {
    const mock = getMock();
    mock.prefersReducedMotion.mockReturnValue(false);

    render(<Harness />);

    expect(mock.gsap.timeline).toHaveBeenCalled();
  });
});
