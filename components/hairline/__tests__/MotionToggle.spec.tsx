import { act, fireEvent, render, screen } from "@testing-library/react";

import { MotionToggle } from "components/hairline/MotionToggle/MotionToggle";
import { MOTION_PAUSE_LABEL, MOTION_REDUCED_LABEL, MOTION_RESUME_LABEL } from "data/pageChrome";
import { resetMotionPreferenceForTests } from "utils/motion/motionPreference";
import { installMatchMedia, type MediaControl } from "utils/motion/testEnvironment";

let media: MediaControl;

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-motion-paused");
  resetMotionPreferenceForTests();
  media = installMatchMedia(false);
});

afterEach(() => {
  jest.restoreAllMocks();
});

/** The text a sighted visitor reads: everything in the button except aria-hidden parts. */
const visibleText = (element: HTMLElement) =>
  Array.from(element.querySelectorAll<HTMLElement>(":scope > :not([aria-hidden]) > *"))
    .filter((node) => !node.closest("[aria-hidden]"))
    .map((node) => node.textContent)
    .join("");

describe("MotionToggle", () => {
  it("should name the action it performs and flip the label, without aria-pressed", () => {
    render(<MotionToggle />);
    const button = screen.getByRole("button", { name: MOTION_PAUSE_LABEL });
    expect(button).not.toHaveAttribute("aria-pressed");
    expect(visibleText(button)).toBe(MOTION_PAUSE_LABEL);

    fireEvent.click(button);
    expect(button).toHaveAccessibleName(MOTION_RESUME_LABEL);
    expect(visibleText(button)).toBe(MOTION_RESUME_LABEL);
    expect(button).not.toHaveAttribute("aria-pressed");
    expect(document.documentElement).toHaveAttribute("data-motion-paused");
    expect(window.localStorage.getItem("motion-paused")).toBe("1");

    fireEvent.click(button);
    expect(button).toHaveAccessibleName(MOTION_PAUSE_LABEL);
    expect(document.documentElement).not.toHaveAttribute("data-motion-paused");
    expect(window.localStorage.getItem("motion-paused")).toBeNull();
  });

  it("should offer to resume when the visitor paused motion earlier", () => {
    window.localStorage.setItem("motion-paused", "1");
    render(<MotionToggle />);
    expect(screen.getByRole("button", { name: MOTION_RESUME_LABEL })).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("data-motion-paused");
  });

  it("should keep working for the open page when storage throws", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<MotionToggle />);
    const button = screen.getByRole("button", { name: MOTION_PAUSE_LABEL });
    fireEvent.click(button);
    expect(button).toHaveAccessibleName(MOTION_RESUME_LABEL);
    expect(document.documentElement).toHaveAttribute("data-motion-paused");
    fireEvent.click(button);
    expect(button).toHaveAccessibleName(MOTION_PAUSE_LABEL);
  });

  it("should show a status instead of a button under reduced motion, live", () => {
    window.localStorage.setItem("motion-paused", "1");
    media = installMatchMedia(true);
    render(<MotionToggle />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText(MOTION_REDUCED_LABEL)).toBeInTheDocument();

    // The system setting is turned off while the page is open: the stored pause comes back.
    act(() => media.setMatches(false));
    expect(screen.getByRole("button", { name: MOTION_RESUME_LABEL })).toBeInTheDocument();

    act(() => media.setMatches(true));
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText(MOTION_REDUCED_LABEL)).toBeInTheDocument();
    // The visitor's own choice is kept for later.
    expect(window.localStorage.getItem("motion-paused")).toBe("1");
  });
});
