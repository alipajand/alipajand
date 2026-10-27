import { act, render, screen, within } from "@testing-library/react";

import NotFound, { metadata } from "../../../app/not-found";
import {
  NOT_FOUND_CODE,
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_KEYBOARD_TIP,
  NOT_FOUND_TITLE,
  NOT_FOUND_WAYS,
  NOT_FOUND_WAYS_ARIA_LABEL,
} from "data/notFound";
import { setMotionPaused, resetMotionPreferenceForTests } from "utils/motion/motionPreference";
import { installMatchMedia, installObservers } from "utils/motion/testEnvironment";

beforeEach(() => {
  installMatchMedia(false);
  installObservers();
  jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
  resetMotionPreferenceForTests();
});

describe("NotFound", () => {
  it("should move focus into the main region so keyboard users start beside the links", () => {
    render(<NotFound />);

    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(main).toHaveFocus();
    expect(main).toHaveAccessibleName(NOT_FOUND_TITLE);
  });

  it("should explain the error and offer ways back", () => {
    render(<NotFound />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: NOT_FOUND_TITLE })).toBeInTheDocument();
    expect(screen.getByText(NOT_FOUND_DESCRIPTION)).toBeInTheDocument();
    expect(screen.getByText(NOT_FOUND_KEYBOARD_TIP)).toBeInTheDocument();
    const ways = screen.getByRole("navigation", { name: NOT_FOUND_WAYS_ARIA_LABEL });
    NOT_FOUND_WAYS.forEach((way) => {
      const link = within(ways).getByRole("link", { name: new RegExp(way.label) });
      expect(link).toHaveAttribute("href", way.href);
      link.focus();
      expect(link).toHaveFocus();
    });
  });

  it("should scramble the status code once and settle on it", () => {
    jest.useFakeTimers();
    const { container } = render(<NotFound />);

    const code = container.querySelector("[data-code]") as HTMLElement;
    expect(code.closest("[aria-hidden='true']")).not.toBeNull();
    act(() => {
      jest.advanceTimersByTime(45 * 3);
    });
    expect(code.textContent).toHaveLength(NOT_FOUND_CODE.length);
    act(() => {
      jest.advanceTimersByTime(45 * 40);
    });
    expect(code.textContent).toBe(NOT_FOUND_CODE);
  });

  it("should keep the code still when motion is paused or reduced", () => {
    jest.useFakeTimers();
    setMotionPaused(true);
    const paused = render(<NotFound />);
    const randomSpy = jest.spyOn(Math, "random");
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(paused.container.querySelector("[data-code]")?.textContent).toBe(NOT_FOUND_CODE);
    expect(randomSpy).not.toHaveBeenCalled();
    paused.unmount();

    setMotionPaused(false);
    installMatchMedia(true);
    const reduced = render(<NotFound />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(reduced.container.querySelector("[data-code]")?.textContent).toBe(NOT_FOUND_CODE);
    expect(randomSpy).not.toHaveBeenCalled();
  });
});

describe("app/not-found metadata", () => {
  it("should stay out of the index without claiming another page's URL", () => {
    expect(metadata.title).toBe(NOT_FOUND_TITLE);
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.openGraph).toEqual(
      expect.objectContaining({ title: NOT_FOUND_TITLE, description: NOT_FOUND_DESCRIPTION })
    );
    expect(metadata.openGraph).not.toHaveProperty("url");
  });
});
