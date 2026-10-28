"use client";

import { useRef } from "react";

import styles from "features/portfolio/OperatingModelScene.module.css";
import {
  PORTFOLIO_SCENE_EYEBROW,
  PORTFOLIO_SCENE_HEADING,
  PORTFOLIO_SCENE_STEPS,
} from "data/portfolioIndex";
import { clamp, fitCanvas, LINE_RGB } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";

const LAT = 16;
const LON = 44;
const DEPTH_ALPHA = [0.14, 0.3, 0.55, 0.9];
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const pad = (index: number) => String(index + 1).padStart(2, "0");

const foldLabel = (fold: number) => `fold ${String(Math.round(fold * 100)).padStart(3, "0")}%`;

/** The step lit for scroll progress `t`. */
const activeStep = (t: number) => (t < 0.34 ? 0 : t < 0.67 ? 1 : 2);

/**
 * A sticky scene: a flat grid of parts folds into a sphere while the section scrolls past, and the
 * three steps light in turn. Without JavaScript or with reduced motion the section is one
 * screen-height still frame, fully folded, with every step shown.
 */
export const OperatingModelScene = () => {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ element, reducedMotion }) => {
    const canvas = element.querySelector("canvas");
    const readout = element.querySelector<HTMLElement>("[data-readout]");
    const bar = element.querySelector<HTMLElement>("[data-bar]");
    const steps = Array.from(element.querySelectorAll<HTMLElement>("[data-step]"));
    if (!canvas || !readout || !bar) return;

    const progress = () => {
      if (reducedMotion) return 1;
      const box = element.getBoundingClientRect();
      return clamp(-box.top / Math.max(box.height - window.innerHeight, 1), 0, 1);
    };

    const draw = () => {
      const surface = fitCanvas(canvas);
      if (!surface) return;
      const { ctx, w, h } = surface;
      ctx.clearRect(0, 0, w, h);
      const t = progress();
      const e = easeInOutCubic(t);
      const f = Math.min(Math.max(w * 0.42, h * 0.62), w * 1.05);
      const camZ = 4.2;
      const rotY = e * Math.PI * 1.25;
      const tilt = 0.68 - e * 0.5;
      const radius = 1.35;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(tilt);
      const sinX = Math.sin(tilt);
      const cy0 = h * ((w < 760 ? 0.45 : 0.5) + (1 - e) * 0.06);

      const points: [number, number, number][][] = [];
      for (let i = 0; i <= LAT; i++) {
        const row: [number, number, number][] = [];
        const phi = -Math.PI / 2 + (Math.PI * i) / LAT;
        for (let j = 0; j <= LON; j++) {
          const th = (Math.PI * 2 * j) / LON;
          const sx = radius * Math.cos(phi) * Math.sin(th);
          const sy = radius * Math.sin(phi);
          const sz = radius * Math.cos(phi) * Math.cos(th);
          const px = (j / LON - 0.5) * 7.6;
          const py = 0.75;
          const pz = (i / LAT - 0.5) * 5;
          const x = px + (sx - px) * e;
          const y = py + (sy - py) * e;
          const z = pz + (sz - pz) * e;
          const x1 = x * cosY + z * sinY;
          const z1 = -x * sinY + z * cosY;
          const y2 = y * cosX - z1 * sinX;
          const z2 = y * sinX + z1 * cosX;
          const s = f / (camZ - z2);
          row.push([w / 2 + x1 * s, cy0 + y2 * s, z2]);
        }
        points.push(row);
      }

      // Bucket segments by depth so nearer lines draw brighter.
      const buckets = DEPTH_ALPHA.map(() => new Path2D());
      const segment = (a: [number, number, number], b: [number, number, number]) => {
        const k = clamp(Math.floor((((a[2] + b[2]) / 2 + 2.2) / 4.4) * 4), 0, 3);
        buckets[k].moveTo(a[0], a[1]);
        buckets[k].lineTo(b[0], b[1]);
      };
      for (let i = 0; i <= LAT; i++)
        for (let j = 0; j < LON; j++) segment(points[i][j], points[i][j + 1]);
      for (let j = 0; j <= LON; j++)
        for (let i = 0; i < LAT; i++) segment(points[i][j], points[i + 1][j]);
      buckets.forEach((path, k) => {
        ctx.strokeStyle = `rgba(${LINE_RGB},${DEPTH_ALPHA[k]})`;
        ctx.lineWidth = k === 3 ? 1.2 : 1;
        ctx.stroke(path);
      });

      readout.textContent = foldLabel(e);
      bar.style.setProperty("--t", t.toFixed(3));
      const active = activeStep(t);
      steps.forEach((step, index) =>
        step.toggleAttribute("data-on", reducedMotion || index === active)
      );
    };

    // CSS already reserves the runway where it can tell that scripts run; this marks it for the rest.
    if (!reducedMotion) element.setAttribute("data-ready", "");

    return {
      onResize: draw,
      onScroll: reducedMotion ? undefined : draw,
      destroy: () => {
        element.removeAttribute("data-ready");
        steps.forEach((step) => step.removeAttribute("data-on"));
        bar.style.removeProperty("--t");
      },
    };
  });

  return (
    <section ref={ref} className={styles.scene} aria-labelledby="operating-model-heading">
      <div className={styles.stage}>
        <canvas className={styles.canvas} aria-hidden="true" />
        <span className={styles.bar} data-bar aria-hidden="true" />
        <div className={styles.head}>
          <span>{PORTFOLIO_SCENE_EYEBROW}</span>
          <span data-readout aria-hidden="true">
            {foldLabel(1)}
          </span>
        </div>
        <h2 id="operating-model-heading" className={styles.title}>
          {PORTFOLIO_SCENE_HEADING}
        </h2>
        <ol className={styles.steps}>
          {PORTFOLIO_SCENE_STEPS.map((step, index) => (
            <li key={step.label} className={styles.step} data-step>
              <span className={styles.stepLabel}>
                [ {pad(index)} ] {step.label}
              </span>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
