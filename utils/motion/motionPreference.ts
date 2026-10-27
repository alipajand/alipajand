import { useSyncExternalStore } from "react";

/**
 * The visitor's "Pause motion" choice. It stops idle, time-based motion site-wide (drifting tickers,
 * canvas drift, the status blink) while scroll- and pointer-driven motion keeps working. It is
 * remembered per browser and mirrored on <html data-motion-paused> for CSS animations.
 */

const STORAGE_KEY = "motion-paused";
export const MOTION_PAUSED_ATTRIBUTE = "data-motion-paused";

const listeners = new Set<() => void>();
let paused: boolean | null = null;

const readStored = (): boolean => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

const reflect = (value: boolean) => {
  document.documentElement.toggleAttribute(MOTION_PAUSED_ATTRIBUTE, value);
};

export const isMotionPaused = (): boolean => {
  if (typeof window === "undefined") return false;
  if (paused === null) {
    paused = readStored();
    reflect(paused);
  }
  return paused;
};

export const setMotionPaused = (value: boolean): void => {
  paused = value;
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, "1");
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the choice still applies now.
  }
  reflect(value);
  listeners.forEach((listener) => listener());
};

export const subscribeMotionPaused = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Live pause preference. The server snapshot is `false`, matching the markup's default. */
export const useMotionPaused = (): boolean =>
  useSyncExternalStore(subscribeMotionPaused, isMotionPaused, () => false);

/** Forgets the cached value. Only tests call this. */
export const resetMotionPreferenceForTests = (): void => {
  paused = null;
  listeners.clear();
};
