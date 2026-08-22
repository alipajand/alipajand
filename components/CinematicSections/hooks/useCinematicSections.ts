"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { cinematicReveal } from "utils/cinematic";
import { DUR } from "utils/motion";

export interface CinematicSectionsSelectors {
  containerRef: RefObject<HTMLDivElement | null>;
}

export interface CinematicSectionsHook {
  selectors: CinematicSectionsSelectors;
}

const SECTION_SELECTOR = "[data-cine-section]";

export const useCinematicSections = (): CinematicSectionsHook => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = Array.from(container.querySelectorAll<HTMLElement>(SECTION_SELECTOR));

    return cinematicReveal(sections, {
      y: 56,
      scale: 0.985,
      duration: DUR.lg,
      rootMargin: "0px 0px -18% 0px",
      threshold: 0.08,
    });
  }, []);

  return { selectors: { containerRef } };
};
