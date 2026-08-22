import { render, renderHook } from "@testing-library/react";

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
    prefersReducedMotion: jest.fn(() => false),
  };
});

describe("useTestimonialsReveal", () => {
  it("should return sectionRef and listRef", () => {
    const { result } = renderHook(() => useTestimonialsReveal());
    expect(result.current.selectors.sectionRef).toBeDefined();
    expect(result.current.selectors.listRef).toBeDefined();
    expect(result.current.selectors.sectionRef.current).toBeNull();
    expect(result.current.selectors.listRef.current).toBeNull();
  });

  it("should set elements directly when reduced motion is preferred", () => {
    const { gsap, prefersReducedMotion } = jest.requireMock("utils/gsap") as {
      gsap: { set: jest.Mock; timeline: jest.Mock };
      prefersReducedMotion: jest.Mock;
    };

    prefersReducedMotion.mockReturnValueOnce(true);

    const TestComponent = () => {
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
    };

    render(<TestComponent />);

    expect(gsap.set).toHaveBeenCalled();
    expect(gsap.timeline).not.toHaveBeenCalled();
  });

  it("should run the reveal timeline once the section enters frame", () => {
    const { gsap, prefersReducedMotion } = jest.requireMock("utils/gsap") as {
      gsap: { timeline: jest.Mock };
      prefersReducedMotion: jest.Mock;
    };

    prefersReducedMotion.mockReturnValue(false);

    const TestComponent = () => {
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
    };

    render(<TestComponent />);

    expect(gsap.timeline).toHaveBeenCalled();
  });
});
