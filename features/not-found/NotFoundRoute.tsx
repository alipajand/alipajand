"use client";

import { useRef } from "react";

import styles from "features/not-found/NotFoundRoute.module.css";
import { NOT_FOUND_ROUTE_LABEL } from "data/notFound";
import { clamp, fitCanvas, LINE, LINE_RGB, tokenFontFamily } from "utils/motion/canvas";
import { createEasedPointer } from "utils/motion/easedPointer";
import { useMotion } from "utils/motion/useMotion";

const SCRAMBLE_LEAD = 6;
const SCRAMBLE_STEP_MS = 45;

interface NotFoundRouteProps {
  code: string;
}

export const NotFoundRoute = ({ code }: NotFoundRouteProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ element, reducedMotion, idleMotion }) => {
    const canvasEl = element.querySelector("canvas");
    const codeEl = element.querySelector<HTMLElement>("[data-code]");
    if (!canvasEl || !codeEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const codeText: HTMLElement = codeEl;
    const mono = tokenFontFamily("--font-mono", "ui-monospace, monospace");
    const label = NOT_FOUND_ROUTE_LABEL.toUpperCase();

    function draw() {
      const surface = fitCanvas(canvas);
      if (!surface) return;
      const { ctx, w, h } = surface;
      ctx.clearRect(0, 0, w, h);
      const y = h / 2;
      const gap = Math.min(140, w * 0.18);
      const cx = pointer.x * w;
      ctx.strokeStyle = `rgba(${LINE_RGB},.85)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(24, y);
      ctx.lineTo(cx - gap / 2, y);
      ctx.moveTo(cx + gap / 2, y);
      ctx.lineTo(w - 24, y);
      ctx.stroke();
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = `rgba(${LINE_RGB},.35)`;
      ctx.beginPath();
      ctx.moveTo(cx - gap / 2, y);
      ctx.lineTo(cx + gap / 2, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = LINE;
      ctx.strokeStyle = `rgba(${LINE_RGB},.85)`;
      [24, cx - gap / 2, cx + gap / 2, w - 24].forEach((x, index) => {
        const open = index === 1 || index === 2;
        ctx.beginPath();
        ctx.arc(x, y, open ? 4 : 3, 0, Math.PI * 2);
        if (open) ctx.stroke();
        else ctx.fill();
      });
      ctx.font = `11px ${mono}`;
      ctx.textAlign = "center";
      ctx.fillStyle = `rgba(${LINE_RGB},.6)`;
      ctx.fillText(label, cx, y - 16);
    }

    const pointer = createEasedPointer(draw, { x: 0.5, smoothing: 0.08 });
    const onPointerMove = (event: PointerEvent) =>
      pointer.follow(clamp(event.clientX / window.innerWidth, 0.1, 0.9));

    // The digits scramble once on arrival, then settle left to right.
    let step = 0;
    let timer = 0;
    const scramble = () => {
      step += 1;
      codeText.textContent = [...code]
        .map((digit, index) =>
          step > SCRAMBLE_LEAD + index * 4 ? digit : String(Math.floor(Math.random() * 10))
        )
        .join("");
      if (step <= SCRAMBLE_LEAD + code.length * 4) {
        timer = window.setTimeout(scramble, SCRAMBLE_STEP_MS);
      }
    };
    if (!reducedMotion) window.addEventListener("pointermove", onPointerMove);
    if (idleMotion) timer = window.setTimeout(scramble, SCRAMBLE_STEP_MS);
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) draw();
    });

    return {
      onResize: draw,
      destroy: () => {
        live = false;
        window.clearTimeout(timer);
        codeText.textContent = code;
        pointer.stop();
        window.removeEventListener("pointermove", onPointerMove);
      },
    };
  });

  return (
    <div ref={ref} className={styles.code} aria-hidden="true">
      <b data-code="">{code}</b>
      <canvas />
    </div>
  );
};
