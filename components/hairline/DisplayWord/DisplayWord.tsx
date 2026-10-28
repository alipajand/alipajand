"use client";

import { type CSSProperties, useRef } from "react";

import { Spark } from "components/hairline/Icons/Icons";
import styles from "components/hairline/DisplayWord/DisplayWord.module.css";
import { clamp } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";

export type DisplayWordMotion = "scroll" | "center";

interface DisplayWordProps {
  words: readonly [string, string];
  variant?: "hero" | "index";
  as?: "h1" | "p";
  motion?: DisplayWordMotion;
  reach?: number;
  pulse?: boolean;
}

export const DisplayWord = ({
  words,
  variant = "hero",
  as: Tag = "p",
  motion = "scroll",
  reach = 0.42,
  pulse = false,
}: DisplayWordProps) => {
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);

  useMotion(ref, ({ element, reducedMotion }) => {
    if (reducedMotion) return;
    const spacer = element.querySelector<HTMLElement>("[data-spacer='outer']");
    const [first, second] = Array.from(element.querySelectorAll<HTMLElement>("[data-word]"));
    const star = element.querySelector<SVGElement>("[data-star]");
    if (!spacer || !first || !second || !star) return;

    let free = 0;
    const measure = () => {
      free = reach > 0 ? spacer.getBoundingClientRect().width / reach : 0;
    };
    return {
      onResize: measure,
      onScroll: ({ y, vh, vel }) => {
        let closed: number;
        if (motion === "center") {
          const box = element.getBoundingClientRect();
          closed = clamp(Math.abs(box.top + box.height / 2 - vh / 2) / (vh / 2), 0, 1);
        } else {
          closed = 1 - clamp(y / (vh * 0.6), 0, 1);
        }
        const offset = (1 - closed) * free * reach;
        first.style.transform = `translateX(${(-offset).toFixed(1)}px)`;
        second.style.transform = `translateX(${offset.toFixed(1)}px)`;
        const scale = pulse ? ` scale(${(1 + Math.min(Math.abs(vel), 40) * 0.02).toFixed(3)})` : "";
        star.style.transform = `rotate(${(y * 0.35).toFixed(1)}deg)${scale}`;
      },
      destroy: () => {
        first.style.transform = "";
        second.style.transform = "";
        star.style.transform = "";
      },
    };
  });

  const style = { "--reach": reach } as CSSProperties;

  return (
    <Tag ref={ref} className={`${styles.display} ${styles[variant]}`} style={style}>
      <span className={styles.srOnly}>{words.join(" ")}</span>
      <span className={styles.outer} data-spacer="outer" aria-hidden="true" />
      <span className={styles.word} data-word aria-hidden="true">
        {words[0]}
      </span>
      <span className={styles.inner} aria-hidden="true" />
      <Spark className={styles.star} data-star="" />
      <span className={styles.inner} aria-hidden="true" />
      <span className={styles.word} data-word aria-hidden="true">
        {words[1]}
      </span>
      <span className={styles.outer} aria-hidden="true" />
    </Tag>
  );
};
