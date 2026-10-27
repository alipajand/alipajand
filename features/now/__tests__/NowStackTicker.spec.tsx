import { act, render } from "@testing-library/react";

import { NowStackTicker } from "features/now/NowStackTicker";
import { resetMotionPreferenceForTests, setMotionPaused } from "utils/motion/motionPreference";
import {
  installManualFrames,
  installMatchMedia,
  installObservers,
} from "utils/motion/testEnvironment";

const ITEMS = ["TypeScript", "React", "Next.js"];

let frames: ReturnType<typeof installManualFrames>;
let clock = 0;

beforeEach(() => {
  window.localStorage.clear();
  resetMotionPreferenceForTests();
  installMatchMedia(false);
  installObservers();
  // Without a ResizeObserver, useMotion measures once at setup, so the run has a width to wrap at.
  Object.assign(window, { ResizeObserver: undefined });
  jest.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(2000);
  clock = 0;
  jest.spyOn(performance, "now").mockImplementation(() => (clock += 1000 / 60));
  frames = installManualFrames();
});

afterEach(() => {
  jest.restoreAllMocks();
  act(() => setMotionPaused(false));
});

const advance = (count: number) =>
  act(() => {
    for (let i = 0; i < count; i++) frames.flush();
  });

const offset = (track: HTMLElement) => {
  const match = track.style.transform.match(/translate3d\((-?[\d.]+)px/);
  return match ? Number(match[1]) : 0;
};

describe("NowStackTicker", () => {
  it("should keep its position when automatic motion is paused and resumed", () => {
    const { container } = render(<NowStackTicker items={ITEMS} />);
    const track = container.firstElementChild?.firstElementChild as HTMLElement;

    advance(20);
    const drifted = offset(track);
    expect(drifted).toBeLessThan(0);

    act(() => setMotionPaused(true));
    expect(offset(track)).toBe(drifted);
    advance(20);
    expect(offset(track)).toBe(drifted);

    act(() => setMotionPaused(false));
    expect(offset(track)).toBe(drifted);
    advance(20);
    expect(offset(track)).toBeLessThan(drifted);
  });

  it("should clear the transform under reduced motion so the names wrap in place", () => {
    const media = installMatchMedia(false);
    const { container } = render(<NowStackTicker items={ITEMS} />);
    const track = container.firstElementChild?.firstElementChild as HTMLElement;

    advance(20);
    expect(offset(track)).toBeLessThan(0);

    act(() => media.setMatches(true));
    expect(track.style.transform).toBe("");
  });
});
