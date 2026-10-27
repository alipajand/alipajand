"use client";

import { type CSSProperties, useRef } from "react";

import styles from "features/now/NowWeekRuler.module.css";
import { nowWeekLabel } from "data/now";
import { clamp, fitCanvas, LINE_RGB, tokenFontFamily } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";
import { WEEKS_IN_RULER, weekOfYear } from "utils/week";

interface NowWeekRulerProps {
  /** The year shown in the display line. */
  year: number;
  /** The week at render time; the island recomputes it from the visitor's clock. */
  initialWeek: number;
}

/**
 * A ruler of the year's 52 weeks with a cursor on the current week. Weeks already passed are drawn
 * solid. The ruler drifts a little with scroll. Without JavaScript the label still sits over this
 * week, positioned in CSS.
 */
export const NowWeekRuler = ({ year, initialWeek }: NowWeekRulerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ element, reducedMotion }) => {
    const canvasEl = element.querySelector("canvas");
    const labelEl = element.querySelector<HTMLElement>("[data-label]");
    if (!canvasEl || !labelEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const label: HTMLElement = labelEl;
    const mono = tokenFontFamily("--font-mono", "ui-monospace, monospace");
    const now = new Date();
    const week = now.getFullYear() === year ? weekOfYear(now) : initialWeek;
    label.textContent = nowWeekLabel(week);
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
        const month = i % 4.33 < 1;
        ctx.strokeStyle = `rgba(${LINE_RGB},${i < week ? 0.9 : 0.32})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, base);
        ctx.lineTo(x, base - (i % 13 === 0 ? 46 : month ? 26 : 14));
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
      ctx.lineTo(cx, base + 8);
      ctx.stroke();
      label.style.left = `${clamp(cx, 70, w - 70)}px`;
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

  const style = { "--week": initialWeek } as CSSProperties;

  return (
    <div ref={ref} className={styles.ruler} style={style} aria-hidden="true">
      <canvas />
      <span className={styles.rulerLabel} data-label="">
        {nowWeekLabel(initialWeek)}
      </span>
    </div>
  );
};
