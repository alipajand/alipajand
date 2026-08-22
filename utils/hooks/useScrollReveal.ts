"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { cinematicReveal, cinematicTitleReveal } from "utils/cinematic";

export interface UseScrollRevealOptions {
  y?: number;
  scale?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  rootMargin?: string;
}

export interface ScrollRevealSelectors {
  sectionRef: RefObject<HTMLElement | null>;
}

export interface ScrollRevealHook {
  selectors: ScrollRevealSelectors;
}

const REVEAL_SELECTOR = "[data-reveal]";
const TITLE_SELECTOR = "[data-cine-title]";

export const useScrollReveal = (options: UseScrollRevealOptions = {}): ScrollRevealHook => {
  const sectionRef = useRef<HTMLElement>(null);
  const { y, scale, duration, stagger, delay, rootMargin } = options;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const children = Array.from(el.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    const titles = Array.from(el.querySelectorAll<HTMLElement>(TITLE_SELECTOR));

    const stopReveal = cinematicReveal(children, {
      y,
      scale,
      duration,
      stagger,
      delay,
      rootMargin,
    });
    const stopTitles = cinematicTitleReveal(titles, { rootMargin });

    return () => {
      stopReveal();
      stopTitles();
    };
  }, [y, scale, duration, stagger, delay, rootMargin]);

  return {
    selectors: { sectionRef },
  };
};
