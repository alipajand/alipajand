"use client";

import { useRef } from "react";

import { BandChevron } from "components/hairline/Icons/Icons";
import styles from "components/hairline/Band/BandChevrons.module.css";
import { clamp } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";

interface BandChevronsProps {
  count: number;
  /** `row` spans a band under its content; `cell` fills a grid cell beside a band heading. */
  layout?: "row" | "cell";
  /** Fraction of the viewport height over which every chevron lights. */
  reach?: number;
}

/**
 * The chevron row in a bone band. Chevrons light one by one as the row scrolls into view. Without
 * JavaScript or with reduced motion they all stay lit.
 */
export const BandChevrons = ({ count, layout = "row", reach = 0.75 }: BandChevronsProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(
    ref,
    ({ element, reducedMotion }) => {
      const chevrons = Array.from(element.children);
      if (reducedMotion) return;
      return {
        onScroll: ({ vh }) => {
          const top = element.getBoundingClientRect().top;
          const lit = Math.round(clamp((vh - top) / (vh * reach), 0, 1) * chevrons.length);
          chevrons.forEach((chevron, index) => chevron.toggleAttribute("data-off", index >= lit));
        },
        destroy: () => chevrons.forEach((chevron) => chevron.removeAttribute("data-off")),
      };
    },
    { rootMargin: "0px 0px 25% 0px" }
  );

  return (
    <div ref={ref} className={layout === "cell" ? styles.cell : styles.row} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <BandChevron key={index} />
      ))}
    </div>
  );
};
