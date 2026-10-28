import { useSyncExternalStore } from "react";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const getQuery = (): MediaQueryList | null =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(REDUCED_MOTION_QUERY)
    : null;

export const prefersReducedMotion = (): boolean => getQuery()?.matches ?? false;

export const subscribeReducedMotion = (listener: (reduce: boolean) => void): (() => void) => {
  const query = getQuery();
  if (!query) return () => {};
  const onChange = (event: MediaQueryListEvent) => listener(event.matches);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export const useReducedMotion = (): boolean =>
  useSyncExternalStore(
    (onStoreChange) => subscribeReducedMotion(onStoreChange),
    prefersReducedMotion,
    () => false
  );
