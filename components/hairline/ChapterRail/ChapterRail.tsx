"use client";

import { useRef } from "react";

import styles from "components/hairline/ChapterRail/ChapterRail.module.css";
import { clamp } from "utils/motion/canvas";
import { requestScrollFrame } from "utils/motion/scrollScheduler";
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

const VISITOR_SCROLL_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

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

      // Set by a jump, cleared by the visitor's own scrolling.
      let jumped = true;
      const onJump = () => {
        jumped = true;
        requestScrollFrame();
      };
      const onVisitorScroll = () => {
        jumped = false;
      };
      const onClick = (event: MouseEvent) => {
        const link = (event.target as Element | null)?.closest?.("a[href^='#']");
        if (link) onJump();
      };

      const jumpedChapter = (y: number, vh: number, max: number) => {
        if (!jumped || !window.location.hash) return -1;
        let target: HTMLElement | null = null;
        try {
          target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        } catch {
          return -1;
        }
        if (!target) return -1;
        const index = sections.findIndex((section) => section?.contains(target));
        if (index === -1) return -1;
        const top = target.getBoundingClientRect().top;
        const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        const atTarget = Math.abs(top - margin) <= 2;
        const bottomedOut = y >= max - 4 && top > margin && top < vh;
        return atTarget || bottomedOut ? index : -1;
      };

      window.addEventListener("hashchange", onJump);
      document.addEventListener("click", onClick);
      VISITOR_SCROLL_EVENTS.forEach((type) =>
        window.addEventListener(type, onVisitorScroll, { passive: true })
      );

      return {
        onScroll: ({ y, vh, max }) => {
          let next = jumpedChapter(y, vh, max);
          if (next === -1) {
            next = 0;
            sections.forEach((section, index) => {
              if (section && section.getBoundingClientRect().top < vh * 0.3) next = index;
            });
            bands.forEach((band, index) => {
              if (!band) return;
              const box = band.getBoundingClientRect();
              if (box.top < vh * 0.3 && box.bottom > vh * 0.3) next = index;
            });
            if (y >= max - 4) next = chapters.length - 1;
          }
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
          window.removeEventListener("hashchange", onJump);
          document.removeEventListener("click", onClick);
          VISITOR_SCROLL_EVENTS.forEach((type) =>
            window.removeEventListener(type, onVisitorScroll)
          );
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
