"use client";

import { useRef } from "react";

import styles from "components/hairline/ChapterRail/ChapterRail.module.css";
import { clamp } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";

export interface Chapter {
  id: string;
  label: string;
}

interface ChapterRailProps {
  chapters: readonly Chapter[];
  label: string;
}

const pad = (index: number) => String(index + 1).padStart(2, "0");

/**
 * Sticky table of contents across the top of a case study. The chapter under the top third of the
 * screen is marked current and scrolled into view in the rail; a hairline shows overall progress.
 * Without JavaScript it is a plain list of in-page links.
 */
export const ChapterRail = ({ chapters, label }: ChapterRailProps) => {
  const ref = useRef<HTMLElement>(null);

  useMotion(
    ref,
    ({ element, reducedMotion }) => {
      const list = element.querySelector("ol");
      const links = Array.from(element.querySelectorAll<HTMLAnchorElement>("a"));
      const sections = chapters.map((chapter) => document.getElementById(chapter.id));
      // A full-bleed band that belongs to a chapter (such as its flow diagram) counts as that chapter.
      const bands = chapters.map((chapter) =>
        document.querySelector<HTMLElement>(`[data-chapter-for="${chapter.id}"]`)
      );
      const first = sections[0];
      const last = sections[sections.length - 1];
      if (!list || !first || !last) return;
      let current = -1;

      return {
        onScroll: ({ y, vh, max }) => {
          let next = 0;
          sections.forEach((section, index) => {
            if (section && section.getBoundingClientRect().top < vh * 0.3) next = index;
          });
          bands.forEach((band, index) => {
            if (!band) return;
            const box = band.getBoundingClientRect();
            if (box.top < vh * 0.3 && box.bottom > vh * 0.3) next = index;
          });
          if (y >= max - 4) next = chapters.length - 1;
          if (next !== current) {
            current = next;
            links.forEach((link, index) => {
              if (index === current) link.setAttribute("aria-current", "true");
              else link.removeAttribute("aria-current");
            });
            const link = links[current];
            list.scrollTo({
              left: link.offsetLeft - list.clientWidth / 2 + link.offsetWidth / 2,
              behavior: reducedMotion ? "auto" : "smooth",
            });
          }
          const start = first.getBoundingClientRect().top + y;
          const end = last.getBoundingClientRect().bottom + y;
          const progress = clamp((y + vh * 0.3 - start) / Math.max(end - start, 1), 0, 1);
          element.style.setProperty("--p", progress.toFixed(4));
        },
        destroy: () => {
          links.forEach((link) => link.removeAttribute("aria-current"));
          element.style.removeProperty("--p");
        },
      };
    },
    { alwaysActive: true }
  );

  return (
    <nav ref={ref} className={styles.rail} aria-label={label}>
      <ol>
        {chapters.map((chapter, index) => (
          <li key={chapter.id}>
            <a href={`#${chapter.id}`}>
              <span className={styles.index}>{pad(index)}</span>
              {chapter.label}
            </a>
          </li>
        ))}
      </ol>
      <span className={styles.progress} aria-hidden="true" />
    </nav>
  );
};
