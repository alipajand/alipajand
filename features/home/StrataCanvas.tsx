"use client";

import { useRef } from "react";

import styles from "features/home/HomeHero.module.css";
import { HOME_STRATA_LAYERS } from "data/homepage";
import {
  clamp,
  fitCanvas,
  INK,
  LINE,
  LINE_RGB,
  MUTE_INK,
  MUTE_RGB,
  tokenFontFamily,
} from "utils/motion/canvas";
import { createEasedPointer } from "utils/motion/easedPointer";
import { useMotion } from "utils/motion/useMotion";

const REST_POINTER = 0.62;
const pad = (index: number) => String(index + 1).padStart(2, "0");

export const StrataCanvas = () => {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ element, reducedMotion }) => {
    const canvasEl = element.querySelector("canvas");
    const readoutEl = element.querySelector<HTMLElement>("[data-readout]");
    const hero = element.parentElement;
    if (!canvasEl || !readoutEl || !hero) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const readout: HTMLElement = readoutEl;

    const mono = tokenFontFamily("--font-mono", "ui-monospace, monospace");
    const sans = tokenFontFamily("--font-sans", "Arial, sans-serif");
    let scrollY = window.scrollY;

    const depth = () => {
      if (reducedMotion) return 0.97;
      const box = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      return clamp(0.08 + (-box.top + vh * 0.25) / (box.height + vh * 0.1), 0.08, 0.97);
    };

    function draw() {
      const surface = fitCanvas(canvas);
      if (!surface) return;
      const { ctx, w, h } = surface;
      ctx.clearRect(0, 0, w, h);
      const narrow = w < 520;
      const n = HOME_STRATA_LAYERS.length;
      const bandH = h / n;
      const px = w * pointer.x;
      const tipY = 8 + depth() * (h - 22);
      const active = clamp(Math.floor(tipY / bandH), 0, n - 1);

      HOME_STRATA_LAYERS.forEach((layer, i) => {
        const top = i * bandH;
        const on = i === active;
        const reached = tipY >= top;
        const lines = 4 + i * 2;
        const amp = 3 + i * 2.2;
        const freq = 0.006 + i * 0.0018;
        const drift = scrollY * (0.35 - i * 0.06);
        for (let j = 0; j < lines; j++) {
          const base = top + ((j + 0.5) * bandH) / lines;
          ctx.beginPath();
          for (let x = 0; x <= w + 8; x += 8) {
            const dx = x - px;
            // Layers part around the probe as it passes through them.
            const part = reached
              ? Math.exp(-(dx * dx) / (2 * 26 * 26)) *
                Math.max(0, 1 - Math.abs(base - tipY) / (bandH * 1.2)) *
                14 *
                Math.sign(base - tipY || 1)
              : 0;
            const y = base + Math.sin((x + drift) * freq + j * 0.9) * amp + part;
            if (x) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
          }
          ctx.strokeStyle = `rgba(${LINE_RGB},${on ? 0.85 : reached ? 0.42 : 0.2})`;
          ctx.lineWidth = on && j === 0 ? 1.4 : 1;
          ctx.stroke();
        }
        if (i) {
          ctx.strokeStyle = `rgba(${LINE_RGB},.55)`;
          ctx.beginPath();
          ctx.moveTo(0, top + 0.5);
          ctx.lineTo(w, top + 0.5);
          ctx.stroke();
        }
        // Label on a solid chip so it reads over the lines.
        const title = `[${pad(i)}] ${layer.name.toUpperCase()}`;
        ctx.textBaseline = "top";
        ctx.font = `400 13px ${sans}`;
        const stackWidth = narrow ? 0 : ctx.measureText(layer.stack).width;
        ctx.font = `500 12px ${mono}`;
        const chipW = Math.max(ctx.measureText(title).width, stackWidth) + 20;
        const chipH = narrow ? 28 : 46;
        ctx.fillStyle = on ? LINE : INK;
        ctx.fillRect(14, top + 12, chipW, chipH);
        ctx.strokeStyle = `rgba(${LINE_RGB},${on ? 1 : 0.45})`;
        ctx.strokeRect(14.5, top + 12.5, chipW - 1, chipH - 1);
        ctx.fillStyle = on ? INK : `rgba(${LINE_RGB},${reached ? 1 : 0.6})`;
        ctx.fillText(title, 24, top + 20);
        if (!narrow) {
          ctx.font = `400 13px ${sans}`;
          ctx.fillStyle = on ? MUTE_INK : `rgb(${MUTE_RGB})`;
          ctx.fillText(layer.stack, 24, top + 37);
        }
      });

      // The probe: a line from the surface to the current depth, with a tip and depth ticks.
      ctx.strokeStyle = `rgba(${LINE_RGB},1)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, tipY);
      ctx.stroke();
      ctx.fillStyle = `rgba(${LINE_RGB},.16)`;
      ctx.beginPath();
      ctx.arc(px, tipY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = LINE;
      ctx.beginPath();
      ctx.moveTo(px, tipY + 8);
      ctx.lineTo(px - 6, tipY - 2);
      ctx.lineTo(px + 6, tipY - 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = `rgba(${LINE_RGB},.8)`;
      ctx.lineWidth = 1;
      for (let y = 20; y < tipY - 10; y += 20) {
        ctx.beginPath();
        ctx.moveTo(px - 4, y);
        ctx.lineTo(px + 4, y);
        ctx.stroke();
      }

      readout.textContent = `Depth ${pad(active)} / ${pad(n - 1)} · ${HOME_STRATA_LAYERS[active].name}`;
    }

    // The probe eases toward the pointer over a few frames, then stops.
    const pointer = createEasedPointer(draw, { x: REST_POINTER });
    const onPointerMove = (event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      pointer.follow(clamp((event.clientX - box.left) / box.width, 0.3, 0.92));
    };
    const onPointerLeave = () => pointer.follow(REST_POINTER);
    if (!reducedMotion) {
      element.addEventListener("pointermove", onPointerMove);
      element.addEventListener("pointerleave", onPointerLeave);
    }
    let fontsSettled = true;
    document.fonts?.ready.then(() => {
      if (fontsSettled) draw();
    });

    return {
      onResize: draw,
      onScroll: reducedMotion
        ? undefined
        : (frame) => {
            scrollY = frame.y;
            draw();
          },
      destroy: () => {
        fontsSettled = false;
        pointer.stop();
        element.removeEventListener("pointermove", onPointerMove);
        element.removeEventListener("pointerleave", onPointerLeave);
      },
    };
  });

  return (
    <div ref={ref} className={styles.strata} aria-hidden="true">
      <canvas />
      <div className={styles.readout} data-readout>
        {`Depth 01 / ${pad(HOME_STRATA_LAYERS.length - 1)} · ${HOME_STRATA_LAYERS[0].name}`}
      </div>
    </div>
  );
};
