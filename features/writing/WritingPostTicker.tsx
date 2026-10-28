"use client";

import { Fragment, useRef } from "react";

import { Spark } from "components/hairline/Icons/Icons";
import tickerStyles from "components/hairline/Ticker/Ticker.module.css";
import { useMotion } from "utils/motion/useMotion";

const DRIFT = 0.45;
const VELOCITY_SHARE = 0.35;

const Run = ({ items, hidden }: { items: readonly string[]; hidden?: boolean }) => (
  <div className={tickerStyles.run} aria-hidden={hidden || undefined}>
    {items.map((item, index) => (
      <Fragment key={`${item}-${index}`}>
        <span>{item}</span>
        <Spark className={tickerStyles.icon} />
      </Fragment>
    ))}
  </div>
);

export const WritingPostTicker = ({ items }: { items: readonly string[] }) => {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ element, reducedMotion, idleMotion }) => {
    if (reducedMotion) return;
    const track = element.firstElementChild as HTMLElement | null;
    if (!track) return;
    let x = 0;
    let half = 0;
    let vel = 0;
    const move = (distance: number) => {
      if (!half) return;
      x -= distance;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    };
    return {
      onResize: () => {
        half = track.scrollWidth / 2;
      },
      onScroll: (frame) => {
        vel = frame.vel;
        if (!idleMotion && vel !== 0) move(Math.abs(vel) * VELOCITY_SHARE * (vel < -0.5 ? -1 : 1));
      },
      onFrame: idleMotion
        ? (frame) =>
            move(
              (DRIFT + Math.abs(frame.vel) * VELOCITY_SHARE) *
                (frame.vel < -0.5 ? -1 : 1) *
                frame.step
            )
        : undefined,
      destroy: () => {
        track.style.transform = "";
      },
    };
  });

  return (
    <div ref={ref} className={tickerStyles.ticker} aria-hidden="true">
      <div className={tickerStyles.track}>
        <Run items={items} />
        <Run items={items} hidden />
      </div>
    </div>
  );
};
