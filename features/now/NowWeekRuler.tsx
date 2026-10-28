"use client";

import { type CSSProperties, useRef } from "react";

import styles from "features/now/NowWeekRuler.module.css";
import { NOW_RULER_LABEL, NOW_RULER_STEP } from "data/now";
import { clamp, fitCanvas, LINE_RGB, tokenFontFamily } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";
import { WEEKS_IN_RULER } from "utils/week";

const QUARTER_TICK = 46;
const MONTH_TICK = 26;
const WEEK_TICK = 14;
const BELOW_BASE = 8;

export const rulerTickHeight = (i: number): number =>
  i % 13 === 0 ? QUARTER_TICK : i % 4.33 < 1 ? MONTH_TICK : WEEK_TICK;

const TICKS = Array.from({ length: WEEKS_IN_RULER + 1 }, (_, i) => i);
const QUARTERS = [0, 1, 2, 3];

const StaticRuler = ({ week }: { week: number }) => (
  <div className={styles.static} data-static-ruler="">
    <svg
      className={styles.ticks}
      viewBox={`0 0 ${WEEKS_IN_RULER} ${QUARTER_TICK + BELOW_BASE}`}
      preserveAspectRatio="none"
      focusable="false"
    >
      {TICKS.map((i) => (
        <line
          key={i}
          x1={i}
          x2={i}
          y1={QUARTER_TICK}
          y2={QUARTER_TICK - rulerTickHeight(i)}
          strokeOpacity={i < week ? 0.9 : 0.32}
        />
      ))}
      <line
        x1={0}
        x2={WEEKS_IN_RULER}
        y1={QUARTER_TICK + 0.5}
        y2={QUARTER_TICK + 0.5}
        strokeOpacity={0.5}
      />
    </svg>
    <span className={styles.cursor} />
    {QUARTERS.map((quarter) => (
      <span
        key={quarter}
        className={styles.quarter}
        style={{ "--quarter": quarter } as CSSProperties}
      >
        Q{quarter + 1}
      </span>
    ))}
  </div>
);

export const NowWeekRuler = () => {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ element, reducedMotion }) => {
    const canvasEl = element.querySelector("canvas");
    const labelEl = element.querySelector<HTMLElement>("[data-label]");
    if (!canvasEl || !labelEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const label: HTMLElement = labelEl;
    const mono = tokenFontFamily("--font-mono", "ui-monospace, monospace");
    const week = NOW_RULER_STEP;
    let shift = 0;

    function draw() {
      const surface = fitCanvas(canvas);
      if (!surface) return;
      const { ctx, w, h } = surface;
      ctx.clearRect(0, 0, w, h);
      const left = 24;
      const right = w - 24;
      const step = (right - left) / WEEKS_IN_RULER;
      const base = h - 26;
      ctx.font = `11px ${mono}`;
      ctx.textAlign = "center";
      for (let i = 0; i <= WEEKS_IN_RULER; i++) {
        const x = left + i * step + shift * step;
        ctx.strokeStyle = `rgba(${LINE_RGB},${i < week ? 0.9 : 0.32})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, base);
        ctx.lineTo(x, base - rulerTickHeight(i));
        ctx.stroke();
        if (i % 13 === 0 && i < WEEKS_IN_RULER) {
          ctx.fillStyle = `rgba(${LINE_RGB},.6)`;
          ctx.fillText(`Q${i / 13 + 1}`, x + step * 6.5, base + 18);
        }
      }
      ctx.strokeStyle = `rgba(${LINE_RGB},.5)`;
      ctx.beginPath();
      ctx.moveTo(left, base + 0.5);
      ctx.lineTo(right, base + 0.5);
      ctx.stroke();
      const cx = left + (week - 0.5) * step + shift * step;
      ctx.strokeStyle = `rgb(${LINE_RGB})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, 44);
      ctx.lineTo(cx, base + BELOW_BASE);
      ctx.stroke();
      const half = Math.min(label.offsetWidth / 2, w / 2);
      label.style.left = `${clamp(cx, half, w - half)}px`;
      element.setAttribute("data-drawn", "");
    }

    let live = true;
    document.fonts?.ready.then(() => {
      if (live) draw();
    });

    return {
      onResize: draw,
      onScroll: reducedMotion
        ? undefined
        : ({ y }) => {
            shift = Math.sin(y / 320) * 0.35;
            draw();
          },
      destroy: () => {
        live = false;
        label.style.left = "";
      },
    };
  });

  const style = {
    "--week": NOW_RULER_STEP,
    "--label-chars": NOW_RULER_LABEL.length,
  } as CSSProperties;

  return (
    <div ref={ref} className={styles.ruler} style={style} aria-hidden="true">
      <canvas />
      <StaticRuler week={NOW_RULER_STEP} />
      <span className={styles.rulerLabel} data-label="">
        {NOW_RULER_LABEL}
      </span>
    </div>
  );
};
