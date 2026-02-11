"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion, registerGSAPPlugins, ScrollTrigger } from "utils/gsap";

const CARD_SELECTOR = "[data-selected-work-card]";

export interface UseSelectedWorkRevealSelectors {
  sectionRef: RefObject<HTMLElement | null>;
  listRef: RefObject<HTMLDivElement | null>;
}

export function useSelectedWorkReveal(): { selectors: UseSelectedWorkRevealSelectors } {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAPPlugins();
    const list = listRef.current;
    const section = sectionRef.current;
    if (!list || !section) return;

    const cards = list.querySelectorAll<HTMLElement>(CARD_SELECTOR);
    const heading = section.querySelector<HTMLElement>("[data-reveal]");
    const sub = section.querySelectorAll<HTMLElement>("[data-reveal]")?.[1];

    if (prefersReducedMotion()) {
      gsap.set([...cards, heading, sub].filter(Boolean), { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set(cards, { opacity: 0, y: 48, scale: 0.98 });
    if (heading) gsap.set(heading, { opacity: 0, y: 32 });
    if (sub) gsap.set(sub, { opacity: 0, y: 24 });

    const stSection = ScrollTrigger.create({
      trigger: section,
      start: "top 82%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (heading) tl.to(heading, { opacity: 1, y: 0, duration: 0.6 });
        if (sub) tl.to(sub, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35");
        tl.to(
          cards,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=0.2"
        );
      },
    });

    return () => stSection.kill();
  }, []);

  return {
    selectors: { sectionRef, listRef },
  };
}
