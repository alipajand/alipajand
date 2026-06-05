"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion, registerGSAPPlugins, ScrollTrigger } from "utils/gsap";
import { DUR, EASE, STAGGER } from "utils/motion";

export interface HiringFitRevealSelectors {
  sectionRef: RefObject<HTMLElement | null>;
}

export function useHiringFitReveal(): { selectors: HiringFitRevealSelectors } {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGSAPPlugins();
    const section = sectionRef.current;
    if (!section) return;

    const heading = section.querySelector<HTMLElement>("[data-hiring-heading]");
    const lede = section.querySelector<HTMLElement>("[data-hiring-lede]");
    const badges = section.querySelectorAll<HTMLElement>("[data-hiring-badge]");
    const cards = section.querySelectorAll<HTMLElement>("[data-hiring-card]");
    const ctas = section.querySelector<HTMLElement>("[data-hiring-ctas]");

    if (prefersReducedMotion()) {
      const all = [heading, lede, ctas, ...badges, ...cards].filter(Boolean);
      gsap.set(all, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set([heading, lede, ctas].filter(Boolean), { opacity: 0, y: 28 });
    gsap.set([...badges], { opacity: 0, y: 10, scale: 0.88 });
    gsap.set([...cards], { opacity: 0, y: 44 });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 82%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: EASE.smooth } });

        if (heading) tl.to(heading, { opacity: 1, y: 0, duration: DUR.md });
        if (lede) tl.to(lede, { opacity: 1, y: 0, duration: DUR.md }, `-=${DUR.xs}`);

        if (badges.length > 0) {
          tl.to(
            [...badges],
            { opacity: 1, y: 0, scale: 1, duration: DUR.sm, stagger: STAGGER.tight },
            `-=${DUR.sm}`
          );
        }

        if (cards.length > 0) {
          tl.to(
            [...cards],
            { opacity: 1, y: 0, duration: DUR.lg, stagger: STAGGER.normal, ease: EASE.spring },
            `-=${DUR.sm}`
          );
        }

        if (ctas) tl.to(ctas, { opacity: 1, y: 0, duration: DUR.sm }, `-=${DUR.sm}`);
      },
    });

    return () => st.kill();
  }, []);

  return { selectors: { sectionRef } };
}
