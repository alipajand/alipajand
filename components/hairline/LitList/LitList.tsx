"use client";

import { type ReactNode, useRef } from "react";

import styles from "components/hairline/LitList/LitList.module.css";
import { useMotion } from "utils/motion/useMotion";

interface LitListProps {
  children: ReactNode;
  className?: string;
  /** Fraction of the viewport height a row's centre may sit from the middle and still light. */
  window?: number;
}

/**
 * An ordered list whose row nearest the middle of the screen is lit (`data-lit`). Rows style their
 * own lit state. Nothing is lit without JavaScript or with reduced motion.
 */
export const LitList = ({ children, className, window: litWindow = 0.3 }: LitListProps) => {
  const ref = useRef<HTMLOListElement>(null);

  useMotion(ref, ({ element, reducedMotion }) => {
    if (reducedMotion) return;
    const rows = Array.from(element.children);
    const light = (lit: Element | null) =>
      rows.forEach((row) => row.toggleAttribute("data-lit", row === lit));
    return {
      onScroll: ({ vh }) => {
        let best: Element | null = null;
        let bestDistance = Infinity;
        rows.forEach((row) => {
          const box = row.getBoundingClientRect();
          const distance = Math.abs(box.top + box.height / 2 - vh / 2);
          if (box.bottom > 0 && box.top < vh && distance < bestDistance) {
            best = row;
            bestDistance = distance;
          }
        });
        light(bestDistance < vh * litWindow ? best : null);
      },
      onActiveChange: (active) => {
        if (!active) light(null);
      },
      destroy: () => light(null),
    };
  });

  return (
    <ol ref={ref} className={className ? `${styles.list} ${className}` : styles.list}>
      {children}
    </ol>
  );
};
