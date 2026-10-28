import { useSyncExternalStore } from "react";

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
  } catch {}
  reflect(value);
  notify();
};

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

export const useMotionPaused = (): boolean =>
  useSyncExternalStore(subscribeMotionPaused, isMotionPaused, () => false);

export const resetMotionPreferenceForTests = (): void => {
  paused = null;
  listeners.clear();
  window.removeEventListener("storage", onStorage);
  window.removeEventListener("pageshow", onPageShow);
};
