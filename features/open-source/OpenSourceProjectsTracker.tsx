"use client";

import { type ReactNode, useRef } from "react";

import { useMotion } from "utils/motion/useMotion";

interface OpenSourceProjectsTrackerProps {
  children: ReactNode;
}

/**
 * Lights the project crossing the upper 40% of the screen and its index row (`data-on`), and marks
 * that index link with `aria-current="location"`. The index links stay plain in-page anchors, so they
 * work without JavaScript; with reduced motion nothing is lit.
 */
export const OpenSourceProjectsTracker = ({ children }: OpenSourceProjectsTrackerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ element, reducedMotion }) => {
    if (reducedMotion) return;
    const projects = Array.from(element.querySelectorAll<HTMLElement>("[data-project]"));
    const links = Array.from(element.querySelectorAll<HTMLElement>("[data-index-link]"));
    let current = -2;
    const light = (index: number) => {
      if (index === current) return;
      current = index;
      projects.forEach((project, i) => project.toggleAttribute("data-on", i === index));
      links.forEach((link, i) => {
        link.toggleAttribute("data-on", i === index);
        if (i === index) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    return {
      onScroll: ({ vh }) => {
        let index = -1;
        projects.forEach((project, i) => {
          const box = project.getBoundingClientRect();
          if (box.top < vh * 0.4 && box.bottom > vh * 0.4) index = i;
        });
        light(index);
      },
      destroy: () => light(-1),
    };
  });

  return <div ref={ref}>{children}</div>;
};
