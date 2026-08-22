"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { splitElementWords } from "utils/cinematic";
import { gsap, prefersReducedMotion } from "utils/gsap";
import { CINE, DUR, EASE } from "utils/motion";

export interface PageHeaderSelectors {
  headerRef: RefObject<HTMLElement | null>;
}

export const usePageHeader = (): {
  selectors: PageHeaderSelectors;
} => {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const overline = header.querySelector<HTMLElement>("[data-header-overline]");
    const title = header.querySelector<HTMLElement>("[data-header-title]");
    const lede = header.querySelector<HTMLElement>("[data-header-lede]");
    const back = header.querySelector<HTMLElement>("[data-header-back]");
    const meta = Array.from(header.querySelectorAll<HTMLElement>("[data-header-meta]"));

    const supporting = [overline, lede, back, ...meta].filter(Boolean) as HTMLElement[];
    if (supporting.length === 0 && !title) return;

    if (prefersReducedMotion()) {
      gsap.set([...supporting, title].filter(Boolean), { opacity: 1, y: 0 });
      gsap.set(header, { opacity: 1, scale: 1, filter: "none" });
      return;
    }

    const words = splitElementWords(title);

    header.classList.add("cine-stage");
    gsap.set(header, { opacity: 0, scale: 1.03, filter: "blur(10px)" });
    gsap.set(supporting, { opacity: 0, y: 22 });
    if (title) gsap.set(title, { opacity: 1, y: 0 });
    if (words.length > 0) gsap.set(words, { opacity: 0, yPercent: 115 });

    const tl = gsap.timeline({ delay: 0.05, defaults: { ease: EASE.smooth } });

    tl.to(header, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: DUR.xl,
      ease: CINE.easeCamera,
    });

    if (words.length > 0) {
      tl.to(
        words,
        {
          opacity: 1,
          yPercent: 0,
          duration: CINE.duration.mask,
          stagger: CINE.stagger.words,
          ease: EASE.snap,
        },
        0.2
      );
    }

    tl.to(supporting, { opacity: 1, y: 0, duration: DUR.md, stagger: 0.09 }, 0.45);

    return () => {
      tl.kill();
    };
  }, []);

  return { selectors: { headerRef } };
};
