"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import gsap from "gsap";
import { prefersReducedMotion } from "utils/gsap";
import { DUR, EASE } from "utils/motion";

export interface PageHeaderSelectors {
  headerRef: RefObject<HTMLElement | null>;
}

/**
 * Animates interior page headers (Portfolio, Now, Engineering Principles).
 * Targets elements with data-header-* attributes inside the header element.
 *
 * Usage: attach `headerRef` to <header>, then add data attributes:
 *   data-header-overline  → small overline label
 *   data-header-title     → h1
 *   data-header-lede      → paragraph
 *   data-header-back      → back link
 */
export function usePageHeader(): { selectors: PageHeaderSelectors } {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const overline = header.querySelector<HTMLElement>("[data-header-overline]");
    const title = header.querySelector<HTMLElement>("[data-header-title]");
    const lede = header.querySelector<HTMLElement>("[data-header-lede]");
    const back = header.querySelector<HTMLElement>("[data-header-back]");

    const elements = [overline, title, lede, back].filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(elements, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(elements, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ delay: 0.05, defaults: { ease: EASE.smooth } });
    tl.to(elements, { opacity: 1, y: 0, duration: DUR.md, stagger: 0.09 });

    return () => {
      tl.kill();
    };
  }, []);

  return { selectors: { headerRef } };
}
