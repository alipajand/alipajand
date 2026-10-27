"use client";

import { useRef } from "react";

import { Spark } from "components/hairline/Icons/Icons";
import styles from "features/now/NowStack.module.css";
import { useMotion } from "utils/motion/useMotion";

interface NowStackTickerProps {
  items: readonly string[];
}

const Run = ({ items, hidden }: { items: readonly string[]; hidden?: boolean }) => (
  <div className={styles.tickerRun} data-duplicate={hidden ? "" : undefined}>
    {items.map((item) => (
      <span key={item} className={styles.tickerItem}>
        <span>{item}</span>
        <Spark className={styles.tickerMark} />
      </span>
    ))}
  </div>
);

/**
 * The stack set in display type on the bone band. It drifts on its own and speeds up with scroll
 * velocity, as in the artifact; when motion is paused it moves only while scrolling, and with reduced
 * motion the duplicate run is dropped and the names wrap in place. Decorative: the same tools are
 * listed as text below it.
 */
export const NowStackTicker = ({ items }: NowStackTickerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ element, reducedMotion, idleMotion }) => {
    if (reducedMotion) return;
    const track = element.firstElementChild as HTMLElement | null;
    if (!track) return;
    let x = 0;
    let half = 0;
    const move = (delta: number) => {
      if (!half) return;
      x -= delta;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    };
    return {
      onResize: () => {
        half = track.scrollWidth / 2;
      },
      // Artifact: x -= (0.45 + |vel| * .35) * dir, reversed while scrolling up.
      onFrame: idleMotion
        ? ({ vel, step }) => move((0.45 + Math.abs(vel) * 0.35) * (vel < -0.5 ? -1 : 1) * step)
        : undefined,
      onScroll: idleMotion
        ? undefined
        : ({ vel }) => {
            if (vel !== 0) move(Math.abs(vel) * 0.35 * (vel < 0 ? -1 : 1));
          },
      destroy: () => {
        track.style.transform = "";
      },
    };
  });

  return (
    <div ref={ref} className={styles.ticker} aria-hidden="true">
      <div className={styles.tickerTrack}>
        <Run items={items} />
        <Run items={items} hidden />
      </div>
    </div>
  );
};
