"use client";

import { useRef } from "react";

import { Spark } from "components/hairline/Icons/Icons";
import styles from "features/engineering-principles/EngineeringPrinciplesDisplay.module.css";
import { ENGINEERING_PRINCIPLES_TITLE_ID } from "data/engineeringPrinciples";
import { clamp } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";

interface EngineeringPrinciplesDisplayProps {
  lines: readonly [string, string];
}

export const EngineeringPrinciplesDisplay = ({ lines }: EngineeringPrinciplesDisplayProps) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useMotion(ref, ({ element, reducedMotion }) => {
    if (reducedMotion) return;
    const [first, second] = Array.from(element.querySelectorAll<HTMLElement>("[data-line]"));
    const star = element.querySelector<SVGElement>("[data-star]");
    if (!first || !second || !star) return;
    let room = 0;
    const measure = () => {
      const style = getComputedStyle(element);
      room = element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    };
    return {
      onResize: measure,
      onScroll: ({ y, vh }) => {
        const parted = clamp(y / (vh * 0.6), 0, 1);
        const free = (line: HTMLElement) => Math.max(0, room - line.offsetWidth) * 0.5 * parted;
        first.style.transform = `translateX(${(-free(first)).toFixed(1)}px)`;
        second.style.transform = `translateX(${free(second).toFixed(1)}px)`;
        star.style.transform = `rotate(${(y * 0.35).toFixed(1)}deg)`;
      },
      destroy: () => {
        first.style.transform = "";
        second.style.transform = "";
        star.style.transform = "";
      },
    };
  });

  return (
    <h1 ref={ref} id={ENGINEERING_PRINCIPLES_TITLE_ID} className={styles.display}>
      <span className={styles.line} data-line="">
        {lines[0]}
      </span>{" "}
      <span className={styles.line} data-line="">
        <Spark className={styles.star} data-star="" />
        {lines[1]}
      </span>
    </h1>
  );
};
