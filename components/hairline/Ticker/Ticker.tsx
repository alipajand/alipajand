"use client";

import { Fragment, useRef } from "react";

import { Ring, Spark } from "components/hairline/Icons/Icons";
import styles from "components/hairline/Ticker/Ticker.module.css";
import { useMotion } from "utils/motion/useMotion";

interface TickerProps {
  items: readonly string[];
  /** Mark drawn before every second item. */
  icon: "ring" | "spark";
  /** 1 moves left as the page scrolls down, -1 moves right. */
  direction?: 1 | -1;
  /**
   * Accessible name for the phrase list. Without it the ticker is decorative and hidden from
   * assistive technology.
   */
  label?: string;
}

const Mark = ({ icon }: { icon: TickerProps["icon"] }) =>
  icon === "ring" ? <Ring className={styles.icon} /> : <Spark className={styles.icon} />;

interface RunProps extends Pick<TickerProps, "items" | "icon" | "label"> {
  hidden?: boolean;
}

const Run = ({ items, icon, label, hidden }: RunProps) => (
  <ul className={styles.run} aria-label={label} aria-hidden={hidden || undefined}>
    {items.map((item, index) => (
      <Fragment key={item}>
        <li className={styles.item}>
          {index % 2 === 1 ? <Mark icon={icon} /> : null}
          {item}
        </li>
        <li className={styles.sep} aria-hidden="true">
          {"///"}
        </li>
      </Fragment>
    ))}
  </ul>
);

/**
 * A single-line band of phrases that slides with scroll velocity. It only moves while the page is
 * scrolling, so it never animates on its own and needs no pause control. With reduced motion the
 * duplicate run is removed and the phrases wrap in place.
 */
export const Ticker = ({ items, icon, direction = 1, label }: TickerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ element, reducedMotion }) => {
    if (reducedMotion) return;
    const track = element.firstElementChild as HTMLElement | null;
    if (!track) return;
    let x = 0;
    let half = 0;
    return {
      onResize: () => {
        half = track.scrollWidth / 2;
      },
      onScroll: ({ vel }) => {
        if (!half || vel === 0) return;
        x -= Math.abs(vel) * 0.35 * direction * (vel < 0 ? -1 : 1);
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      },
      destroy: () => {
        track.style.transform = "";
      },
    };
  });

  return (
    <div ref={ref} className={styles.ticker} aria-hidden={label ? undefined : true}>
      <div className={styles.track}>
        <Run items={items} icon={icon} label={label} />
        <Run items={items} icon={icon} hidden />
      </div>
    </div>
  );
};
