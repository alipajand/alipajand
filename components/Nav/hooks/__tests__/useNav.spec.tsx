import { act, render, renderHook } from "@testing-library/react";

import { useNav } from "components/Nav/hooks/useNav";

describe("useNav", () => {
  describe("default values and initial behavior", () => {
    it("should have isMobileOpen false initially", () => {
      const { result } = renderHook(() => useNav());

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

  it("should close the mobile menu when Escape is pressed", () => {
    const { result } = renderHook(() => useNav());

    act(() => {
      result.current.actions.handleToggleMenu();
    });
    expect(result.current.selectors.isMobileOpen).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(result.current.selectors.isMobileOpen).toBe(false);
  });

  it("should lock body scroll while the mobile menu is open", () => {
    const { result } = renderHook(() => useNav());

    act(() => {
      result.current.actions.handleToggleMenu();
    });
    expect(document.body.style.overflow).toBe("hidden");

    act(() => {
      result.current.actions.handleCloseMenu();
    });
    expect(document.body.style.overflow).toBe("");
  });

  it("should wrap focus from the last mobile link to the menu button on Tab", () => {
    const TestComponent = () => {
      const { selectors, actions } = useNav();
      return (
        <>
          <button type="button" ref={selectors.menuButtonRef} onClick={actions.handleToggleMenu}>
            Toggle
          </button>
          <div ref={selectors.mobileMenuRef}>
            <a href="#one">One</a>
            <a href="#two">Two</a>
          </div>
        </>
      );
    };

    const { getByText } = render(<TestComponent />);

    act(() => {
      getByText("Toggle").click();
    });

    const toggle = getByText("Toggle");
    const last = getByText("Two");
    last.focus();

    const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true });
    const preventDefault = jest.spyOn(event, "preventDefault");

    act(() => {
      document.dispatchEvent(event);
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(toggle);
  });

  it("should wrap focus from the menu button to the last mobile link on Shift+Tab", () => {
    const TestComponent = () => {
      const { selectors, actions } = useNav();
      return (
        <>
          <button type="button" ref={selectors.menuButtonRef} onClick={actions.handleToggleMenu}>
            Toggle
          </button>
          <div ref={selectors.mobileMenuRef}>
            <a href="#one">One</a>
            <a href="#two">Two</a>
          </div>
        </>
      );
    };

    const { getByText } = render(<TestComponent />);

    act(() => {
      getByText("Toggle").click();
    });

    const toggle = getByText("Toggle");
    const last = getByText("Two");
    toggle.focus();

    const event = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true });
    const preventDefault = jest.spyOn(event, "preventDefault");

    act(() => {
      document.dispatchEvent(event);
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(last);
  });

  it("should mark main content and footer inert while the mobile menu is open", () => {
    const main = document.createElement("main");
    main.id = "main-content";
    const footer = document.createElement("footer");
    document.body.append(main, footer);

    const TestComponent = () => {
      const { selectors, actions } = useNav();
      return (
        <button type="button" ref={selectors.menuButtonRef} onClick={actions.handleToggleMenu}>
          Toggle
        </button>
      );
    };

    const { getByText, unmount } = render(<TestComponent />);

    act(() => {
      getByText("Toggle").click();
    });

    expect(main).toHaveAttribute("inert");
    expect(footer).toHaveAttribute("inert");

    act(() => {
      getByText("Toggle").click();
    });

    expect(main).not.toHaveAttribute("inert");
    expect(footer).not.toHaveAttribute("inert");

    unmount();
    main.remove();
    footer.remove();
  });
});
