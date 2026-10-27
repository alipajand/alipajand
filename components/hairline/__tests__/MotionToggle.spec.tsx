import { fireEvent, render, screen } from "@testing-library/react";

import { MotionToggle } from "components/hairline/MotionToggle/MotionToggle";
import { MOTION_TOGGLE_LABEL } from "data/pageChrome";
import { resetMotionPreferenceForTests } from "utils/motion/motionPreference";

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-motion-paused");
  resetMotionPreferenceForTests();
});

describe("MotionToggle", () => {
  it("should toggle the site-wide pause and remember it", () => {
    render(<MotionToggle />);
    const button = screen.getByRole("button", { name: MOTION_TOGGLE_LABEL });
    expect(button).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement).toHaveAttribute("data-motion-paused");
    expect(window.localStorage.getItem("motion-paused")).toBe("1");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(window.localStorage.getItem("motion-paused")).toBeNull();
  });

  it("should start pressed when the visitor paused motion earlier", () => {
    window.localStorage.setItem("motion-paused", "1");
    render(<MotionToggle />);
    expect(screen.getByRole("button", { name: MOTION_TOGGLE_LABEL })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
