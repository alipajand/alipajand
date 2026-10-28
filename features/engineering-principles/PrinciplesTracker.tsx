"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { useMotion } from "utils/motion/useMotion";

interface PrinciplesTrackerProps {
  children: ReactNode;
}

export const PrinciplesTracker = ({ children }: PrinciplesTrackerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // On the narrowest phones a long word ("deterministic") can outgrow the heading column beside the
  // numeral. Like the artifact's title fit, shrink just that heading until its longest word fits.
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const headings = Array.from(root.querySelectorAll<HTMLElement>("[data-principle] h2"));
    const fit = () =>
      headings.forEach((heading) => {
        heading.style.removeProperty("font-size");
        heading.style.overflowWrap = "normal";
        const room = heading.clientWidth;
        const used = heading.scrollWidth;
        heading.style.overflowWrap = "";
        if (room > 0 && used > room + 0.5) {
          const size = parseFloat(getComputedStyle(heading).fontSize) * (room / used) * 0.97;
          heading.style.fontSize = `${size.toFixed(1)}px`;
        }
      });
    let width = root.clientWidth;
    const observer = new ResizeObserver(() => {
      if (root.clientWidth === width) return;
      width = root.clientWidth;
      fit();
    });
    observer.observe(root);
    fit();
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) fit();
    });
    return () => {
      live = false;
      observer.disconnect();
    };
  }, []);

  useMotion(ref, ({ element, reducedMotion }) => {
    if (reducedMotion) return;
    const sections = Array.from(element.querySelectorAll<HTMLElement>("[data-principle]"));
    const links = Array.from(element.querySelectorAll<HTMLElement>("[data-index-link]"));
    let current = -2;
    const light = (index: number) => {
      if (index === current) return;
      current = index;
      sections.forEach((section, i) => section.toggleAttribute("data-on", i === index));
      links.forEach((link, i) => {
        link.toggleAttribute("data-on", i === index);
        if (i === index) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    return {
      onScroll: ({ vh }) => {
        let index = -1;
        sections.forEach((section, i) => {
          const box = section.getBoundingClientRect();
          if (box.top < vh * 0.4 && box.bottom > vh * 0.4) index = i;
        });
        light(index);
      },
      destroy: () => light(-1),
    };
  });

  return <div ref={ref}>{children}</div>;
};
