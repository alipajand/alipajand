import { act, renderHook } from "@testing-library/react";

import { useNav } from "components/Nav/hooks/useNav";

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
});
