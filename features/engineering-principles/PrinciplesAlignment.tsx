"use client";

import { useRef } from "react";

import styles from "features/engineering-principles/EngineeringPrinciplesHero.module.css";
import { engineeringPrinciplesSettledLabel } from "data/engineeringPrinciples";
import { clamp, fitCanvas, INK, LINE, LINE_RGB, tokenFontFamily } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";

interface PrinciplesAlignmentProps {
  titles: readonly string[];
}

const pad = (index: number) => String(index + 1).padStart(2, "0");
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const PrinciplesAlignment = ({ titles }: PrinciplesAlignmentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ element, reducedMotion, idleMotion }) => {
    const canvasEl = element.querySelector("canvas");
    const readoutEl = element.querySelector<HTMLElement>("[data-readout]");
    const hero = element.parentElement;
    if (!canvasEl || !readoutEl || !hero) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const readout: HTMLElement = readoutEl;
    const heroBox: HTMLElement = hero;
    const mono = tokenFontFamily("--font-mono", "ui-monospace, monospace");
    const pointer = { x: -1, y: -1 };
    let time = 0;
    let shown = -1;

    const progress = () => {
      if (reducedMotion) return 1;
      const box = heroBox.getBoundingClientRect();
      const vh = window.innerHeight;
      return clamp((-box.top + vh * 0.75) / (box.height + vh * 0.25), 0, 1);
    };

    function draw() {
      const surface = fitCanvas(canvas);
      if (!surface) return;
      const { ctx, w, h } = surface;
      ctx.clearRect(0, 0, w, h);
      const prog = progress();
      const narrow = w < 520;
      const n = titles.length;
      const top = 34;
      const bottom = 64;
      const gap = (h - top - bottom) / (n - 1);
      const labelW = narrow ? 34 : Math.min(w * 0.42, 300);
      const x0 = 16;
      const x1 = w - 16;
      let settled = 0;
      for (let i = 0; i < n; i++) {
        const k = ease(clamp(prog * 1.7 - i * 0.07, 0, 1));
        if (k > 0.98) settled++;
        const yT = top + i * gap;
        const seed = i * 1.7;
        ctx.beginPath();
        for (let x = x0; x <= x1; x += 6) {
          const u = (x - x0) / (x1 - x0);
          const amp = Math.min(gap * 1.6, 60);
          const tangle =
            (Math.sin(u * 7 + seed + time * 0.0006) * 0.6 +
              Math.sin(u * 17 - seed * 2 + time * 0.0009) * 0.25 +
              ((4.5 - i) / 4.5) * 0.9 * Math.sin(u * 3.1 + seed)) *
            amp;
          let y = yT + tangle * (1 - k);
          if (pointer.x >= 0) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            y += Math.exp(-(dx * dx + dy * dy) / 1800) * 14 * (dy >= 0 ? 1 : -1);
          }
          if (x === x0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${LINE_RGB},${0.25 + k * 0.6})`;
        ctx.lineWidth = k > 0.98 ? 1.4 : 1;
        ctx.stroke();
        if (k > 0.6) {
          const alpha = (k - 0.6) / 0.4;
          ctx.font = `500 12px ${mono}`;
          ctx.textBaseline = "middle";
          let text = narrow ? pad(i) : `${pad(i)}  ${titles[i]}`;
          while (ctx.measureText(text).width > labelW - 16 && text.length > 6) {
            text = `${text.slice(0, -2).trimEnd()}…`;
          }
          const tw = ctx.measureText(text).width + 16;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = k > 0.98 ? LINE : INK;
          ctx.fillRect(x0 + 8, yT - 11, tw, 22);
          ctx.strokeStyle = `rgba(${LINE_RGB},.6)`;
          ctx.strokeRect(x0 + 8.5, yT - 10.5, tw - 1, 21);
          ctx.fillStyle = k > 0.98 ? INK : LINE;
          ctx.fillText(text, x0 + 16, yT + 1);
          ctx.globalAlpha = 1;
        }
      }
      if (settled !== shown) {
        shown = settled;
        readout.textContent = engineeringPrinciplesSettledLabel(settled, n);
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
      if (!idleMotion) draw();
    };
    const onPointerLeave = () => {
      pointer.x = -1;
      pointer.y = -1;
      if (!idleMotion) draw();
    };
    if (!reducedMotion) {
      element.addEventListener("pointermove", onPointerMove);
      element.addEventListener("pointerleave", onPointerLeave);
    }
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) draw();
    });

    return {
      onResize: draw,
      onFrame: idleMotion
        ? (frame) => {
            time = frame.time;
            draw();
          }
        : undefined,
      onScroll: reducedMotion || idleMotion ? undefined : draw,
      destroy: () => {
        live = false;
        element.removeEventListener("pointermove", onPointerMove);
        element.removeEventListener("pointerleave", onPointerLeave);
      },
    };
  });

  return (
    <div ref={ref} className={styles.align} aria-hidden="true">
      <canvas />
      <div className={styles.readout} data-readout="">
        {engineeringPrinciplesSettledLabel(0, titles.length)}
      </div>
    </div>
  );
};
