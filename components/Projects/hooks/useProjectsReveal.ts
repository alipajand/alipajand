"use client";

import type { RefObject } from "react";
import { useEffect, useMemo, useRef } from "react";

import { PORTFOLIO_CASE_STUDY_ORDER, type Project, PROJECTS } from "data/projects";
import { gsap, prefersReducedMotion, registerGSAPPlugins, ScrollTrigger } from "utils/gsap";

const CARD_SELECTOR = "[data-project-card]";

const projectOrder = new Map<string, number>(
  PORTFOLIO_CASE_STUDY_ORDER.map((id, index) => [id, index])
);

export interface UseProjectsRevealSelectors {
  sectionRef: RefObject<HTMLElement | null>;
  orderedProjects: Project[];
}

export const useProjectsReveal = (): {
  selectors: UseProjectsRevealSelectors;
} => {
  const sectionRef = useRef<HTMLElement>(null);
  const orderedProjects = useMemo(
    () =>
      [...PROJECTS].sort(
        (a, b) =>
          (projectOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
          (projectOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER)
      ),
    []
  );

  useEffect(() => {
    registerGSAPPlugins();

    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>(CARD_SELECTOR);
    const heading = section.querySelector<HTMLElement>("[data-reveal]");
    const sub = section.querySelectorAll<HTMLElement>("[data-reveal]")?.[1];
    if (prefersReducedMotion()) {
      gsap.set([...cards, heading, sub].filter(Boolean), { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set(cards, { opacity: 0, y: 56, scale: 0.98 });
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
            duration: 0.65,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.2"
        );
      },
    });

    return () => stSection.kill();
  }, []);

  return {
    selectors: { sectionRef, orderedProjects },
  };
};
