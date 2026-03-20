import { act, renderHook, render } from "@testing-library/react";

import { useNav } from "components/Nav/hooks/useNav";

jest.mock("utils/gsap", () => ({
  prefersReducedMotion: jest.fn(() => false),
}));

jest.mock("gsap", () => ({
  __esModule: true,
  default: {
    set: jest.fn(),
    to: jest.fn(),
    fromTo: jest.fn(),
  },
}));

describe("useNav", () => {
  describe("default values and initial behavior", () => {
    it("should have isScrolled false and isMobileOpen false initially", () => {
      const { result } = renderHook(() => useNav());

      expect(result.current.selectors.isScrolled).toBe(false);
      expect(result.current.selectors.isMobileOpen).toBe(false);
    });

    it("should expose handleToggleMenu and handleCloseMenu actions", () => {
      const { result } = renderHook(() => useNav());

      expect(typeof result.current.actions.handleToggleMenu).toBe("function");
      expect(typeof result.current.actions.handleCloseMenu).toBe("function");
    });
  });

  describe("state updates", () => {
    it("should set isMobileOpen to true when handleToggleMenu is called", () => {
      const { result } = renderHook(() => useNav());

      expect(result.current.selectors.isMobileOpen).toBe(false);

      act(() => {
        result.current.actions.handleToggleMenu();
      });

      expect(result.current.selectors.isMobileOpen).toBe(true);
    });

    it("should set isMobileOpen to false when handleCloseMenu is called", () => {
      const { result } = renderHook(() => useNav());

      act(() => {
        result.current.actions.handleToggleMenu();
      });
      expect(result.current.selectors.isMobileOpen).toBe(true);

      act(() => {
        result.current.actions.handleCloseMenu();
      });
      expect(result.current.selectors.isMobileOpen).toBe(false);
    });

    it("should toggle isMobileOpen when handleToggleMenu is called twice", () => {
      const { result } = renderHook(() => useNav());

      act(() => {
        result.current.actions.handleToggleMenu();
      });
      expect(result.current.selectors.isMobileOpen).toBe(true);

      act(() => {
        result.current.actions.handleToggleMenu();
      });
      expect(result.current.selectors.isMobileOpen).toBe(false);
    });
  });

  it("updates isScrolled based on window scroll position", () => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    const { result } = renderHook(() => useNav());

    expect(result.current.selectors.isScrolled).toBe(false);

    Object.defineProperty(window, "scrollY", { value: 100, writable: true });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.selectors.isScrolled).toBe(true);
  });

  it("animates desktop nav links on mount when links are present", () => {
    const gsap = jest.requireMock("gsap") as {
      default: { set: jest.Mock; to: jest.Mock; fromTo: jest.Mock };
    };

    function TestComponent() {
      const { selectors } = useNav();
      const { navLinksRef } = selectors;

      return (
        <nav>
          <ul ref={navLinksRef}>
            <li>
              <a href="#one">One</a>
            </li>
            <li>
              <a href="#two">Two</a>
            </li>
          </ul>
        </nav>
      );
    }

    render(<TestComponent />);

    expect(gsap.default.set).toHaveBeenCalled();
    expect(gsap.default.to).toHaveBeenCalled();
  });

  it("animates mobile menu when isMobileOpen changes", () => {
    const gsap = jest.requireMock("gsap") as {
      default: { fromTo: jest.Mock; to: jest.Mock };
    };

    function TestComponent() {
      const { selectors, actions } = useNav();
      const { mobileMenuRef } = selectors;

      return (
        <>
          <button type="button" onClick={actions.handleToggleMenu}>
            Toggle
          </button>
          <div ref={mobileMenuRef}>
            <a href="#one">One</a>
          </div>
        </>
      );
    }

    const { getByText } = render(<TestComponent />);

    act(() => {
      getByText("Toggle").click();
    });

    expect(gsap.default.fromTo).toHaveBeenCalled();
    expect(gsap.default.to).toHaveBeenCalled();
  });
});