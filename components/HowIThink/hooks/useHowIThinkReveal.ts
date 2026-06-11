"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion, registerGSAPPlugins, ScrollTrigger } from "utils/gsap";
import { DUR, EASE, STAGGER } from "utils/motion";

export interface HowIThinkRevealSelectors {
  sectionRef: RefObject<HTMLElement | null>;
}

export function useHowIThinkReveal(): { selectors: HowIThinkRevealSelectors } {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGSAPPlugins();
    const section = sectionRef.current;
    if (!section) return;

    const heading = section.querySelector<HTMLElement>("[data-howitink-heading]");
    const lede = section.querySelector<HTMLElement>("[data-howitink-lede]");
    const cards = section.querySelectorAll<HTMLElement>("[data-howitink-card]");

    if (prefersReducedMotion()) {
      const all = [heading, lede, ...cards].filter(Boolean);
      gsap.set(all, { opacity: 1, y: 0 });
      return;
    }

    gsap.set([heading, lede].filter(Boolean), { opacity: 0, y: 28 });

    gsap.set([...cards], { opacity: 0, y: 48, rotationX: 8, transformPerspective: 600 });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: EASE.smooth } });

        if (heading) tl.to(heading, { opacity: 1, y: 0, duration: DUR.md });
        if (lede) tl.to(lede, { opacity: 1, y: 0, duration: DUR.md }, `-=${DUR.xs}`);

        if (cards.length > 0) {
          tl.to(
            [...cards],
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              duration: DUR.lg,
              stagger: STAGGER.normal,
              ease: EASE.spring,
            },
            `-=${DUR.sm}`
          );
        }
      },
    });

    return () => st.kill();
  }, []);

  return { selectors: { sectionRef } };
}
