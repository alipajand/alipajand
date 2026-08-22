"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { revealOnce } from "utils/cinematic";
import { gsap, prefersReducedMotion } from "utils/gsap";
import { DUR, EASE, STAGGER } from "utils/motion";

const CARD_SELECTOR = "[data-testimonial-card]";

export interface UseTestimonialsRevealSelectors {
  sectionRef: RefObject<HTMLElement | null>;
  listRef: RefObject<HTMLUListElement | null>;
}

export const useTestimonialsReveal = (): {
  selectors: UseTestimonialsRevealSelectors;
} => {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const section = sectionRef.current;
    if (!list || !section) return;

    const cards = Array.from(list.querySelectorAll<HTMLElement>(CARD_SELECTOR));
    const headings = Array.from(section.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (prefersReducedMotion()) {
      gsap.set([...cards, ...headings], { opacity: 1, x: 0, y: 0 });
      return;
    }

    gsap.set(cards, { opacity: 0, x: -24 });
    gsap.set(headings, { opacity: 0, y: 24 });

    return revealOnce(
      [section],
      () => {
        const tl = gsap.timeline({ defaults: { ease: EASE.smooth } });
        tl.to(headings, { opacity: 1, y: 0, duration: DUR.sm, stagger: STAGGER.tight });
        tl.to(cards, { opacity: 1, x: 0, duration: DUR.md, stagger: STAGGER.loose }, `-=${DUR.xs}`);
      },
      { rootMargin: "0px 0px -18% 0px" }
    );
  }, []);

  return {
    selectors: { sectionRef, listRef },
  };
};
