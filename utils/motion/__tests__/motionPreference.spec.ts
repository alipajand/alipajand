import {
  isMotionPaused,
  resetMotionPreferenceForTests,
  setMotionPaused,
  subscribeMotionPaused,
} from "utils/motion/motionPreference";

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-motion-paused");
  resetMotionPreferenceForTests();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const reload = () => {
  document.documentElement.removeAttribute("data-motion-paused");
  resetMotionPreferenceForTests();
};

describe("motionPreference", () => {
  it("should default to running", () => {
    expect(isMotionPaused()).toBe(false);
    expect(document.documentElement).not.toHaveAttribute("data-motion-paused");
  });

  it("should persist the pause across reloads", () => {
    setMotionPaused(true);
    reload();
    expect(isMotionPaused()).toBe(true);
    expect(document.documentElement).toHaveAttribute("data-motion-paused");

    setMotionPaused(false);
    reload();
    expect(isMotionPaused()).toBe(false);
  });

  it("should still apply to the open page when storage throws", () => {
    const blocked = () => {
      throw new Error("SecurityError");
    };
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(blocked);
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(blocked);
    jest.spyOn(Storage.prototype, "removeItem").mockImplementation(blocked);

    expect(isMotionPaused()).toBe(false);
    expect(() => setMotionPaused(true)).not.toThrow();
    expect(isMotionPaused()).toBe(true);
    expect(document.documentElement).toHaveAttribute("data-motion-paused");
    expect(() => setMotionPaused(false)).not.toThrow();
    expect(isMotionPaused()).toBe(false);
  });

  it("should pick up a choice made in another tab", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeMotionPaused(listener);
    expect(isMotionPaused()).toBe(false);

    window.localStorage.setItem("motion-paused", "1");
    window.dispatchEvent(new StorageEvent("storage", { key: "motion-paused", newValue: "1" }));
    expect(isMotionPaused()).toBe(true);
    expect(document.documentElement).toHaveAttribute("data-motion-paused");
    expect(listener).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new StorageEvent("storage", { key: "unrelated" }));
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it("should re-read the choice when restored from the back/forward cache", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeMotionPaused(listener);
    expect(isMotionPaused()).toBe(false);

    window.localStorage.setItem("motion-paused", "1");
    const restored = new Event("pageshow") as PageTransitionEvent;
    Object.defineProperty(restored, "persisted", { value: true });
    window.dispatchEvent(restored);
    expect(isMotionPaused()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    window.localStorage.removeItem("motion-paused");
    window.dispatchEvent(restored);
    expect(isMotionPaused()).toBe(true);
  });
});
