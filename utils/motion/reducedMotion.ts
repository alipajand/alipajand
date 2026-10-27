import { useSyncExternalStore } from "react";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const getQuery = (): MediaQueryList | null =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(REDUCED_MOTION_QUERY)
    : null;

export const prefersReducedMotion = (): boolean => getQuery()?.matches ?? false;

/** Calls `listener` whenever the operating-system motion setting changes. */
export const subscribeReducedMotion = (listener: (reduce: boolean) => void): (() => void) => {
  const query = getQuery();
  if (!query) return () => {};
  const onChange = (event: MediaQueryListEvent) => listener(event.matches);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * Live reduced-motion preference. The server snapshot is `false`, so motion islands render their
 * still state in markup and only start moving after hydration confirms the preference.
 */
export const useReducedMotion = (): boolean =>
  useSyncExternalStore(
    (onStoreChange) => subscribeReducedMotion(onStoreChange),
    prefersReducedMotion,
    () => false
  );
