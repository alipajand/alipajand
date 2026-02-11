"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion, registerGSAPPlugins, ScrollTrigger } from "utils/gsap";

const CARD_SELECTOR = "[data-innovation-card]";

export interface UseInnovationRevealSelectors {
  sectionRef: RefObject<HTMLElement | null>;
  listRef: RefObject<HTMLUListElement | null>;
}

export function useInnovationReveal(): { selectors: UseInnovationRevealSelectors } {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    registerGSAPPlugins();
    const list = listRef.current;
    const section = sectionRef.current;
    if (!list || !section) return;

    const cards = list.querySelectorAll<HTMLElement>(CARD_SELECTOR);
    const headings = section.querySelectorAll<HTMLElement>("[data-reveal]");

    if (prefersReducedMotion()) {
      gsap.set([...cards, ...headings], { opacity: 1, y: 0 });
      return;
    }

    gsap.set(cards, { opacity: 0, y: 40 });
    gsap.set(headings, { opacity: 0, y: 24 });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 82%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(headings, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 });
        tl.to(
          cards,
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" },
          "-=0.25"
        );
      },
    });

    return () => st.kill();
  }, []);

  return {
    selectors: { sectionRef, listRef },
  };
}
