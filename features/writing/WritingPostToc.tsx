"use client";

import { type MouseEvent, useRef } from "react";

import styles from "features/writing/WritingPostToc.module.css";
import { pad } from "features/writing/writingModel";
import { clamp } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";
import type { PostHeading } from "utils/headings";

interface WritingPostTocProps {
  headings: readonly PostHeading[];
  label: string;
  eyebrow: string;
  variant?: "reader" | "launch";
}

const READ_LINE = 0.35;

const focusHeading = (event: MouseEvent<HTMLAnchorElement>) => {
  const id = event.currentTarget.hash.slice(1);
  const heading = id ? document.getElementById(id) : null;
  if (!heading) return;
  window.requestAnimationFrame(() => {
    if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  });
};

export const tocNumbers = (headings: readonly PostHeading[]): string[] =>
  headings.reduce<{ count: number; labels: string[] }>(
    ({ count, labels }, heading) =>
      heading.level === 2
        ? { count: count + 1, labels: [...labels, pad(count)] }
        : { count, labels: [...labels, ""] },
    { count: 0, labels: [] }
  ).labels;

const TocList = ({ headings }: { headings: readonly PostHeading[] }) => {
  const numbers = tocNumbers(headings);
  return (
    <ol className={styles.list}>
      {headings.map((heading, index) => (
        <li key={heading.id} className={heading.level === 3 ? styles.sub : undefined}>
          <a href={`#${heading.id}`} data-toc-link="" onClick={focusHeading}>
            <span className={styles.index}>{numbers[index]}</span>
            <span>{heading.text}</span>
          </a>
        </li>
      ))}
    </ol>
  );
};

export const WritingPostToc = ({
  headings,
  label,
  eyebrow,
  variant = "reader",
}: WritingPostTocProps) => {
  const ref = useRef<HTMLElement>(null);

  useMotion(
    ref,
    ({ element, reducedMotion }) => {
      const prose = document.querySelector<HTMLElement>("[data-prose]");
      const targets = headings.map((heading) => document.getElementById(heading.id));
      const groups = Array.from(element.querySelectorAll("ol")).map((list) =>
        Array.from(list.querySelectorAll<HTMLAnchorElement>("[data-toc-link]"))
      );
      if (!prose || targets.some((target) => !target)) return;
      const showProgress = variant === "reader" && !reducedMotion;
      let current = -2;

      const mark = (next: number) => {
        if (next === current) return;
        current = next;
        groups.forEach((links) =>
          links.forEach((link, index) => {
            if (index === next) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          })
        );
      };

      return {
        onScroll: ({ vh }) => {
          const line = vh * READ_LINE;
          const tops = targets.map((target) => target!.getBoundingClientRect().top);
          // The launch layout always lights a section while it animates, as its artifact does.
          let next = variant === "launch" && !reducedMotion ? 0 : -1;
          tops.forEach((top, index) => {
            if (top < line) next = index;
          });
          mark(next);
          if (!showProgress) return;
          const end = prose.getBoundingClientRect().bottom;
          groups.forEach((links) =>
            links.forEach((link, index) => {
              const top = tops[index];
              const bottom = tops[index + 1] ?? end;
              const progress = clamp((line - top) / Math.max(1, bottom - top), 0, 1);
              link.style.setProperty("--p", progress.toFixed(3));
            })
          );
        },
        destroy: () => {
          mark(-1);
          groups.flat().forEach((link) => link.style.removeProperty("--p"));
        },
      };
    },
    { alwaysActive: true }
  );

  if (headings.length === 0) return null;

  return (
    <aside ref={ref} className={`${styles.toc} ${styles[variant]}`} aria-label={label}>
      <div className={styles.stick}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <TocList headings={headings} />
        {variant === "launch" ? (
          <details className={styles.fold}>
            <summary>{eyebrow}</summary>
            <TocList headings={headings} />
          </details>
        ) : null}
      </div>
    </aside>
  );
};
