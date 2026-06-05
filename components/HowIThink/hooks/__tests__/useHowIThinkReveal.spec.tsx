import { render, renderHook } from "@testing-library/react";

import { useHowIThinkReveal } from "components/HowIThink/hooks/useHowIThinkReveal";

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

function getMock(): GsapMock {
  return jest.requireMock("utils/gsap") as GsapMock;
}

function Harness() {
  const {
    selectors: { sectionRef },
  } = useHowIThinkReveal();

  return (
    <section ref={sectionRef}>
      <h2 data-howitink-heading>Heading</h2>
      <p data-howitink-lede>Lede</p>
      <ul>
        <li data-howitink-card>Card 1</li>
        <li data-howitink-card>Card 2</li>
      </ul>
    </section>
  );
}

describe("useHowIThinkReveal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a sectionRef", () => {
    const { result } = renderHook(() => useHowIThinkReveal());
    expect(result.current.selectors.sectionRef).toBeDefined();
    expect(result.current.selectors.sectionRef.current).toBeNull();
  });

  it("sets elements visible without a ScrollTrigger when reduced motion is preferred", () => {
    const mock = getMock();
    mock.prefersReducedMotion.mockReturnValueOnce(true);

    render(<Harness />);

    expect(mock.gsap.set).toHaveBeenCalled();
    expect(mock.ScrollTrigger.create).not.toHaveBeenCalled();
  });

  it("creates a ScrollTrigger and animates on enter when motion is allowed", () => {
    const mock = getMock();
    mock.prefersReducedMotion.mockReturnValue(false);

    render(<Harness />);

    expect(mock.ScrollTrigger.create).toHaveBeenCalled();
    const config = mock.ScrollTrigger.create.mock.calls[0][0];
    config.onEnter();

    expect(mock.gsap.timeline).toHaveBeenCalled();
  });
});
