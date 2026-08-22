"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { cinematicReveal } from "utils/cinematic";
import type { CinematicRevealOptions } from "utils/cinematic";

export interface UseAutoRevealOptions extends CinematicRevealOptions {
  selector?: string;
}

export interface AutoRevealSelectors {
  containerRef: RefObject<HTMLElement | null>;
}

export const useAutoReveal = (
  options: UseAutoRevealOptions = {}
): { selectors: AutoRevealSelectors } => {
  const containerRef = useRef<HTMLElement>(null);
  const { selector = ":scope > *", y, scale, duration, stagger, delay, rootMargin } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const blocks = Array.from(container.querySelectorAll<HTMLElement>(selector));

    return cinematicReveal(blocks, { y, scale, duration, stagger, delay, rootMargin });
  }, [selector, y, scale, duration, stagger, delay, rootMargin]);

  return { selectors: { containerRef } };
};
