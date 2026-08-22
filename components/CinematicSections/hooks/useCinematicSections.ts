"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion } from "utils/gsap";
import { DUR, EASE } from "utils/motion";

export interface CinematicSectionsSelectors {
  containerRef: RefObject<HTMLDivElement | null>;
}

export interface CinematicSectionsHook {
  selectors: CinematicSectionsSelectors;
}

const REVEAL_MARGIN = "0px 0px -18% 0px";

/**
 * Gives each section below the hero a single cinematic entrance:
 * it rises into frame with a shallow camera push as it enters the viewport.
 * Uses IntersectionObserver so reveals stay correct even when layout
 * settles after hydration.
 */
export const useCinematicSections = (): CinematicSectionsHook => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = Array.from(container.querySelectorAll<HTMLElement>("[data-cine-section]"));
    if (sections.length === 0) return;

    const show = () => gsap.set(sections, { opacity: 1, y: 0, scale: 1 });

    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined" ||
      prefersReducedMotion()
    ) {
      show();
      return;
    }

    gsap.set(sections, { opacity: 0, y: 56, scale: 0.985 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: DUR.lg,
            ease: EASE.smooth,
            overwrite: "auto",
          });
        });
      },
      { rootMargin: REVEAL_MARGIN, threshold: 0.08 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return { selectors: { containerRef } };
};
