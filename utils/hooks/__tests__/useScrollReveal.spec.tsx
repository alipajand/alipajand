import { render, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import * as gsapUtils from "utils/gsap";

jest.mock("utils/gsap", () => ({
  gsap: { set: jest.fn(), to: jest.fn() },
  prefersReducedMotion: jest.fn(() => false),
  registerGSAPPlugins: jest.fn(),
  ScrollTrigger: { create: jest.fn(() => ({ kill: jest.fn() })) },
}));

function Wrapper({
  children,
  options = {},
}: {
  children?: ReactNode;
  options?: Parameters<typeof useScrollReveal>[0];
}) {
  const { selectors } = useScrollReveal(options);
  return (
    <div ref={selectors.sectionRef as React.RefObject<HTMLDivElement>}>
      <span data-reveal>one</span>
      <span data-reveal>two</span>
      {children}
    </div>
  );
}

describe("useScrollReveal", () => {
  beforeEach(() => {
    jest.mocked(gsapUtils.gsap.set).mockClear();
    jest.mocked(gsapUtils.gsap.to).mockClear();
    jest.mocked(gsapUtils.ScrollTrigger.create).mockClear();
    jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(false);
  });

  describe("default values and initial behavior", () => {
    it("should return selectors with sectionRef", () => {
      const { result } = renderHook(() => useScrollReveal());

      expect(result.current.selectors).toBeDefined();
      expect(result.current.selectors.sectionRef).toBeDefined();
      expect(result.current.selectors.sectionRef.current).toBeNull();
    });

    it("should return sectionRef that is a ref object", () => {
      const { result } = renderHook(() => useScrollReveal());

      expect(result.current.selectors.sectionRef).toHaveProperty("current");
      expect(typeof result.current.selectors.sectionRef).toBe("object");
    });
  });

  describe("with options", () => {
    it("should accept options object and still return correct shape", () => {
      const { result } = renderHook(() => useScrollReveal({ y: 32, stagger: 0.08, once: true }));

      expect(result.current.selectors.sectionRef).toBeDefined();
    });
  });

  describe("effect with mounted element", () => {
    it("calls gsap.set and ScrollTrigger.create when section has data-reveal children", () => {
      render(<Wrapper />);
      expect(gsapUtils.gsap.set).toHaveBeenCalled();
      expect(gsapUtils.ScrollTrigger.create).toHaveBeenCalled();
    });

    it("calls cleanup on unmount", () => {
      const killMock = jest.fn();
      jest
        .mocked(gsapUtils.ScrollTrigger.create)
        .mockImplementation(() => ({ kill: killMock }) as unknown as ReturnType<typeof gsapUtils.ScrollTrigger.create>);
      const { unmount } = render(<Wrapper />);
      unmount();
      expect(killMock).toHaveBeenCalled();
    });

    it("uses stagger when multiple children have data-reveal", () => {
      render(<Wrapper options={{ stagger: 0.08 }} />);
      const createCallArgs = jest.mocked(gsapUtils.ScrollTrigger.create).mock.calls[0];
      const createCall = createCallArgs[0] as { onEnter?: () => void };
      expect(createCall.onEnter).toBeDefined();
      createCall.onEnter?.();
      expect(gsapUtils.gsap.to).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ stagger: 0.08 })
      );
    });
  });

  describe("prefersReducedMotion", () => {
    it("sets opacity 1 and y 0 when prefersReducedMotion is true", () => {
      jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(true);
      render(<Wrapper />);
      expect(gsapUtils.gsap.set).toHaveBeenCalledWith(expect.anything(), { opacity: 1, y: 0 });
      expect(gsapUtils.ScrollTrigger.create).not.toHaveBeenCalled();
    });
  });

  describe("no data-reveal children", () => {
    function EmptyWrapper() {
      const { selectors } = useScrollReveal();
      return (
        <div ref={selectors.sectionRef as React.RefObject<HTMLDivElement>}>no reveal</div>
      );
    }
    it("does not call ScrollTrigger.create when section has no data-reveal", () => {
      jest.mocked(gsapUtils.ScrollTrigger.create).mockClear();
      render(<EmptyWrapper />);
      expect(gsapUtils.ScrollTrigger.create).not.toHaveBeenCalled();
    });
  });
});
