import { render } from "@testing-library/react";
import type React from "react";
import { useSelectedWorkReveal } from "components/SelectedWorkGallery/hooks/useSelectedWorkReveal";
import * as gsapUtils from "utils/gsap";

jest.mock("utils/gsap", () => ({
  gsap: {
    set: jest.fn(),
    timeline: jest.fn(() => ({
      to: jest.fn().mockReturnThis(),
    })),
  },
  prefersReducedMotion: jest.fn(() => false),
  registerGSAPPlugins: jest.fn(),
  ScrollTrigger: {
    create: jest.fn(() => ({ kill: jest.fn() })),
  },
}));

function TestComponent() {
  const { selectors } = useSelectedWorkReveal();
  return (
    <section ref={selectors.sectionRef as React.RefObject<HTMLElement>}>
      <h2 data-reveal>Heading</h2>
      <p data-reveal>Subheading</p>
      <div ref={selectors.listRef as React.RefObject<HTMLDivElement>}>
        <div data-selected-work-card>Card 1</div>
        <div data-selected-work-card>Card 2</div>
      </div>
    </section>
  );
}

describe("useSelectedWorkReveal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(false);
  });

  describe("initial state", () => {
    it("should return selectors with sectionRef and listRef", () => {
      const { container } = render(<TestComponent />);
      expect(container.querySelector("section")).toBeInTheDocument();
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("should call registerGSAPPlugins", () => {
      render(<TestComponent />);
      expect(gsapUtils.registerGSAPPlugins).toHaveBeenCalled();
    });
  });

  describe("animation setup", () => {
    it("should set initial styles for cards, heading, and sub", () => {
      render(<TestComponent />);

      expect(gsapUtils.gsap.set).toHaveBeenCalled();
      const setCalls = jest.mocked(gsapUtils.gsap.set).mock.calls;

      expect(setCalls.some((call) => call[1]?.opacity === 0)).toBe(true);
      expect(setCalls.some((call) => call[1]?.y === 48)).toBe(true);
    });

    it("should create ScrollTrigger with correct config", () => {
      render(<TestComponent />);

      expect(gsapUtils.ScrollTrigger.create).toHaveBeenCalledWith(
        expect.objectContaining({
          trigger: expect.anything(),
          start: "top 82%",
          once: true,
          onEnter: expect.any(Function),
        })
      );
    });

    it("should animate elements on scroll trigger", () => {
      const timelineMock = {
        to: jest.fn().mockReturnThis(),
      };
      jest
        .mocked(gsapUtils.gsap.timeline)
        .mockReturnValue(timelineMock as ReturnType<typeof gsapUtils.gsap.timeline>);

      render(<TestComponent />);

      const createCall = jest.mocked(gsapUtils.ScrollTrigger.create).mock.calls[0][0] as {
        onEnter?: () => void;
      };
      expect(createCall.onEnter).toBeDefined();

      createCall.onEnter?.();

      expect(gsapUtils.gsap.timeline).toHaveBeenCalled();
      expect(timelineMock.to).toHaveBeenCalled();
    });
  });

  describe("prefersReducedMotion", () => {
    it("should set opacity 1 and y 0 when prefersReducedMotion is true", () => {
      jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(true);

      render(<TestComponent />);

      const setCalls = jest.mocked(gsapUtils.gsap.set).mock.calls;
      const reducedMotionCall = setCalls.find(
        (call) => call[1]?.opacity === 1 && call[1]?.y === 0
      );

      expect(reducedMotionCall).toBeDefined();
      expect(gsapUtils.ScrollTrigger.create).not.toHaveBeenCalled();
    });
  });

  describe("cleanup", () => {
    it("should call kill on ScrollTrigger when component unmounts", () => {
      const killMock = jest.fn();
      jest.mocked(gsapUtils.ScrollTrigger.create).mockReturnValue({
        kill: killMock,
      } as ReturnType<typeof gsapUtils.ScrollTrigger.create>);

      const { unmount } = render(<TestComponent />);
      unmount();

      expect(killMock).toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle missing heading", () => {
      function ComponentWithoutHeading() {
        const { selectors } = useSelectedWorkReveal();
        return (
          <section ref={selectors.sectionRef as React.RefObject<HTMLElement>}>
            <div ref={selectors.listRef as React.RefObject<HTMLDivElement>}>
              <div data-selected-work-card>Card 1</div>
            </div>
          </section>
        );
      }

      render(<ComponentWithoutHeading />);
      expect(gsapUtils.ScrollTrigger.create).toHaveBeenCalled();
    });

    it("should handle missing sub", () => {
      function ComponentWithoutSub() {
        const { selectors } = useSelectedWorkReveal();
        return (
          <section ref={selectors.sectionRef as React.RefObject<HTMLElement>}>
            <h2 data-reveal>Heading</h2>
            <div ref={selectors.listRef as React.RefObject<HTMLDivElement>}>
              <div data-selected-work-card>Card 1</div>
            </div>
          </section>
        );
      }

      render(<ComponentWithoutSub />);
      expect(gsapUtils.ScrollTrigger.create).toHaveBeenCalled();
    });

    it("should handle missing listRef", () => {
      function ComponentWithoutList() {
        const { selectors } = useSelectedWorkReveal();
        return (
          <section ref={selectors.sectionRef as React.RefObject<HTMLElement>}>
            <h2 data-reveal>Heading</h2>
          </section>
        );
      }

      render(<ComponentWithoutList />);
      expect(gsapUtils.ScrollTrigger.create).not.toHaveBeenCalled();
    });

    it("should handle missing sectionRef", () => {
      function ComponentWithoutSection() {
        const { selectors } = useSelectedWorkReveal();
        return (
          <div ref={selectors.listRef as React.RefObject<HTMLDivElement>}>
            <div data-selected-work-card>Card 1</div>
          </div>
        );
      }

      render(<ComponentWithoutSection />);
      expect(gsapUtils.ScrollTrigger.create).not.toHaveBeenCalled();
    });
  });
});
