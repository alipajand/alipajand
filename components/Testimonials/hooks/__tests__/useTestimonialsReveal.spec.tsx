import { renderHook, render } from "@testing-library/react";

import { useTestimonialsReveal } from "components/Testimonials/hooks/useTestimonialsReveal";

jest.mock("utils/gsap", () => {
  const set = jest.fn();
  const timeline = jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
  }));

  return {
    __esModule: true,
    gsap: {
      set,
      timeline,
    },
    ScrollTrigger: {
      create: jest.fn(() => ({ kill: jest.fn() })),
    },
    prefersReducedMotion: jest.fn(() => false),
    registerGSAPPlugins: jest.fn(),
  };
});

describe("useTestimonialsReveal", () => {
  it("returns sectionRef and listRef", () => {
    const { result } = renderHook(() => useTestimonialsReveal());
    expect(result.current.selectors.sectionRef).toBeDefined();
    expect(result.current.selectors.listRef).toBeDefined();
    expect(result.current.selectors.sectionRef.current).toBeNull();
    expect(result.current.selectors.listRef.current).toBeNull();
  });

  it("sets elements directly when reduced motion is preferred", () => {
    const { gsap, prefersReducedMotion, ScrollTrigger } = jest.requireMock("utils/gsap") as {
      gsap: { set: jest.Mock };
      prefersReducedMotion: jest.Mock;
      ScrollTrigger: { create: jest.Mock };
    };

    prefersReducedMotion.mockReturnValueOnce(true);

    function TestComponent() {
      const { selectors } = useTestimonialsReveal();
      const { sectionRef, listRef } = selectors;

      return (
        <section ref={sectionRef}>
          <h2 data-reveal>Heading</h2>
          <p data-reveal>Subheading</p>
          <ul ref={listRef}>
            <li data-testimonial-card>Card 1</li>
            <li data-testimonial-card>Card 2</li>
          </ul>
        </section>
      );
    }

    render(<TestComponent />);

    expect(gsap.set).toHaveBeenCalled();
    expect(ScrollTrigger.create).not.toHaveBeenCalled();
  });

  it("creates ScrollTrigger and timeline when motion is allowed", () => {
    const { gsap, prefersReducedMotion, ScrollTrigger } = jest.requireMock("utils/gsap") as {
      gsap: { timeline: jest.Mock };
      prefersReducedMotion: jest.Mock;
      ScrollTrigger: { create: jest.Mock };
    };

    prefersReducedMotion.mockReturnValue(false);

    function TestComponent() {
      const { selectors } = useTestimonialsReveal();
      const { sectionRef, listRef } = selectors;

      return (
        <section ref={sectionRef}>
          <h2 data-reveal>Heading</h2>
          <p data-reveal>Subheading</p>
          <ul ref={listRef}>
            <li data-testimonial-card>Card 1</li>
            <li data-testimonial-card>Card 2</li>
          </ul>
        </section>
      );
    }

    render(<TestComponent />);

    expect(ScrollTrigger.create).toHaveBeenCalled();

    const config = (ScrollTrigger.create as jest.Mock).mock.calls[0][0];
    if (typeof config.onEnter === "function") {
      config.onEnter();
    }

    expect(gsap.timeline).toHaveBeenCalled();
  });
});
