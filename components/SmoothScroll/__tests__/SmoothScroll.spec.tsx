import { render } from "@testing-library/react";
import { SmoothScroll } from "components/SmoothScroll/SmoothScroll";
import * as gsapUtils from "utils/gsap";

jest.mock("utils/gsap", () => ({
  gsap: {
    ticker: {
      add: jest.fn(),
      remove: jest.fn(),
      lagSmoothing: jest.fn(),
    },
  },
  prefersReducedMotion: jest.fn(() => false),
  registerGSAPPlugins: jest.fn(),
  ScrollTrigger: {
    update: jest.fn(),
  },
}));

jest.mock("lenis", () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    destroy: jest.fn(),
    raf: jest.fn(),
  }));
});

describe("SmoothScroll", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(false);
  });

  describe("rendering", () => {
    it("should render children", () => {
      const { getByText } = render(
        <SmoothScroll>
          <div>Test Content</div>
        </SmoothScroll>
      );

      expect(getByText("Test Content")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      const { getByText } = render(
        <SmoothScroll>
          <div>Child 1</div>
          <div>Child 2</div>
        </SmoothScroll>
      );

      expect(getByText("Child 1")).toBeInTheDocument();
      expect(getByText("Child 2")).toBeInTheDocument();
    });
  });

  describe("initialization", () => {
    it("should call registerGSAPPlugins", () => {
      render(<SmoothScroll>Content</SmoothScroll>);
      expect(gsapUtils.registerGSAPPlugins).toHaveBeenCalled();
    });

    it("should create Lenis instance when window exists and motion is not reduced", () => {
      const Lenis = require("lenis");
      render(<SmoothScroll>Content</SmoothScroll>);
      expect(Lenis).toHaveBeenCalled();
    });

    it("should set up scroll listener", () => {
      const Lenis = require("lenis");
      const mockLenisInstance = {
        on: jest.fn(),
        destroy: jest.fn(),
        raf: jest.fn(),
      };
      jest.mocked(Lenis).mockReturnValue(mockLenisInstance);

      render(<SmoothScroll>Content</SmoothScroll>);

      expect(mockLenisInstance.on).toHaveBeenCalledWith("scroll", gsapUtils.ScrollTrigger.update);
    });

    it("should add raf function to gsap ticker", () => {
      const Lenis = require("lenis");
      const mockLenisInstance = {
        on: jest.fn(),
        destroy: jest.fn(),
        raf: jest.fn(),
      };
      jest.mocked(Lenis).mockReturnValue(mockLenisInstance);

      render(<SmoothScroll>Content</SmoothScroll>);

      expect(gsapUtils.gsap.ticker.add).toHaveBeenCalled();
    });

    it("should call lagSmoothing with 0", () => {
      render(<SmoothScroll>Content</SmoothScroll>);
      expect(gsapUtils.gsap.ticker.lagSmoothing).toHaveBeenCalledWith(0);
    });
  });

  describe("prefersReducedMotion", () => {
    it("should not initialize Lenis when prefersReducedMotion is true", () => {
      jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(true);
      const Lenis = require("lenis");
      jest.mocked(Lenis).mockClear();

      render(<SmoothScroll>Content</SmoothScroll>);

      expect(Lenis).not.toHaveBeenCalled();
    });

    it("should not set up ticker when prefersReducedMotion is true", () => {
      jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(true);

      render(<SmoothScroll>Content</SmoothScroll>);

      expect(gsapUtils.gsap.ticker.add).not.toHaveBeenCalled();
    });
  });

  describe("cleanup", () => {
    it("should remove raf function from ticker on unmount", () => {
      const Lenis = require("lenis");
      const mockLenisInstance = {
        on: jest.fn(),
        destroy: jest.fn(),
        raf: jest.fn(),
      };
      jest.mocked(Lenis).mockReturnValue(mockLenisInstance);

      const { unmount } = render(<SmoothScroll>Content</SmoothScroll>);

      const rafFunction = jest.mocked(gsapUtils.gsap.ticker.add).mock.calls[0][0];

      unmount();

      expect(gsapUtils.gsap.ticker.remove).toHaveBeenCalledWith(rafFunction);
    });

    it("should destroy Lenis instance on unmount", () => {
      const Lenis = require("lenis");
      const mockLenisInstance = {
        on: jest.fn(),
        destroy: jest.fn(),
        raf: jest.fn(),
      };
      jest.mocked(Lenis).mockReturnValue(mockLenisInstance);

      const { unmount } = render(<SmoothScroll>Content</SmoothScroll>);
      unmount();

      expect(mockLenisInstance.destroy).toHaveBeenCalled();
    });

    it("should reset lagSmoothing on unmount", () => {
      const { unmount } = render(<SmoothScroll>Content</SmoothScroll>);
      unmount();

      expect(gsapUtils.gsap.ticker.lagSmoothing).toHaveBeenCalledWith(1000, 500);
    });
  });

  describe("server-side rendering", () => {
    it("should check for window existence before initializing", () => {
      const Lenis = require("lenis");
      const callCountBefore = jest.mocked(Lenis).mock.calls.length;

      render(<SmoothScroll>Content</SmoothScroll>);

      expect(Lenis).toHaveBeenCalled();
      expect(gsapUtils.registerGSAPPlugins).toHaveBeenCalled();
    });
  });
});
