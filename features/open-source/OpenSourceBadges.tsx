"use client";

import { useRef } from "react";

import styles from "features/open-source/OpenSourceTechnology.module.css";
import { OPEN_SOURCE_TECHNOLOGY_HEADING } from "data/openSourcePage";
import { useMotion } from "utils/motion/useMotion";

const pad = (index: number) => String(index + 1).padStart(2, "0");

interface OpenSourceBadgesProps {
  badges: readonly string[];
}

export const OpenSourceBadges = ({ badges }: OpenSourceBadgesProps) => {
  const ref = useRef<HTMLUListElement>(null);

  useMotion(ref, ({ element, reducedMotion }) => {
    if (reducedMotion) return;
    const cells = Array.from(element.children);
    const light = (lit: number) =>
      cells.forEach((cell, index) => cell.toggleAttribute("data-on", index === lit));
    return {
      onScroll: ({ vh }) => {
        const box = element.getBoundingClientRect();
        const t = (vh - box.top) / (vh + box.height);
        light(t > 0 && t < 1 ? Math.floor(t * cells.length) : -1);
      },
      onActiveChange: (active) => {
        if (!active) light(-1);
      },
      destroy: () => light(-1),
    };
  });

  return (
    <ul ref={ref} className={styles.badges} aria-label={OPEN_SOURCE_TECHNOLOGY_HEADING}>
      {badges.map((badge, index) => (
        <li key={badge}>
          <span className={styles.badgeNumber} aria-hidden="true">
            {pad(index)}
          </span>
          {badge}
        </li>
      ))}
    </ul>
  );
};
