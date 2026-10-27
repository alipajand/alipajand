"use client";

import { type ReactNode, useRef } from "react";

import styles from "features/portfolio/PortfolioBand.module.css";
import { PORTFOLIO_STACK_WORDS } from "data/portfolioIndex";
import { clamp } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";

/**
 * The rotated stack words beside the band intro. They slide and straighten as the band crosses the
 * screen; without JavaScript or with reduced motion they hold the artifact's resting angle.
 */
export const StackWords = ({ children }: { children?: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ element, reducedMotion }) => {
    const inner = element.firstElementChild as HTMLElement | null;
    if (reducedMotion || !inner) return;
    return {
      onScroll: ({ vh }) => {
        const box = element.getBoundingClientRect();
        const t = clamp((vh / 2 - (box.top + box.height / 2)) / vh, -1, 1);
        inner.style.setProperty("--px", `${(t * -160).toFixed(1)}px`);
        inner.style.setProperty("--rot", `${(-14 + t * 8).toFixed(2)}deg`);
      },
      destroy: () => {
        inner.style.removeProperty("--px");
        inner.style.removeProperty("--rot");
      },
    };
  });

  return (
    <div ref={ref} className={styles.stack}>
      <div className={styles.stackInner} aria-hidden="true">
        {PORTFOLIO_STACK_WORDS.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </div>
      {children}
    </div>
  );
};
