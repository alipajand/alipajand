import { useSyncExternalStore } from "react";

/**
 * The visitor's "Pause automatic motion" choice. It stops motion that runs on its own: the
 * status-dot blink (CSS, through <html data-motion-paused>) and any `useMotion` island's `onFrame`
 * loop. Scroll-linked and pointer-driven motion keeps working, because it only moves in response to
 * the visitor. The choice is remembered per browser; if storage is unavailable it still applies to
 * the open page. Reduced motion is separate and always wins; see `useMotion`.
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

const notify = () => listeners.forEach((listener) => listener());

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
  notify();
};

/** Picks up a choice made in another tab, or while this page sat in the back/forward cache. */
const resync = () => {
  const stored = readStored();
  if (stored === paused) return;
  paused = stored;
  reflect(stored);
  notify();
};

const onStorage = (event: StorageEvent) => {
  if (event.key === STORAGE_KEY || event.key === null) resync();
};

const onPageShow = (event: PageTransitionEvent) => {
  if (event.persisted) resync();
};

export const subscribeMotionPaused = (listener: () => void): (() => void) => {
  if (listeners.size === 0) {
    window.addEventListener("storage", onStorage);
    window.addEventListener("pageshow", onPageShow);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pageshow", onPageShow);
    }
  };
};

/** Live pause preference. The server snapshot is `false`, matching the markup's default. */
export const useMotionPaused = (): boolean =>
  useSyncExternalStore(subscribeMotionPaused, isMotionPaused, () => false);

/** Forgets the cached value. Only tests call this. */
export const resetMotionPreferenceForTests = (): void => {
  paused = null;
  listeners.clear();
  window.removeEventListener("storage", onStorage);
  window.removeEventListener("pageshow", onPageShow);
};
