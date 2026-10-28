"use client";

import { useRef } from "react";

import styles from "features/portfolio/PortfolioHero.module.css";
import { PORTFOLIO_HERO_LAYERS, type PortfolioHeroLayerKind } from "data/portfolioIndex";
import {
  clamp,
  fitCanvas,
  INK,
  INK_2,
  LINE_RGB,
  MUTE_RGB,
  tokenFontFamily,
} from "utils/motion/canvas";
import { createEasedPointer } from "utils/motion/easedPointer";
import { useMotion } from "utils/motion/useMotion";

type Point = readonly [number, number];
interface Plate {
  kind: PortfolioHeroLayerKind;
  name: string;
  stack: string;
  cy: number;
  dx: number;
}

const pad = (index: number) => String(index + 1).padStart(2, "0");
const CORNERS: readonly Point[] = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
];

export const PlatesField = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useMotion(ref, ({ element: canvas, reducedMotion }) => {
    const hero = canvas.parentElement;
    const copy = hero?.querySelector<HTMLElement>("[data-hero-copy]");
    if (!hero || !copy) return;
    const copyBox: HTMLElement = copy;

    const mono = tokenFontFamily("--font-mono", "ui-monospace, monospace");
    const sans = tokenFontFamily("--font-sans", "Arial, sans-serif");
    let scrollY = reducedMotion ? 0 : window.scrollY;

    function draw() {
      const surface = fitCanvas(canvas);
      if (!surface) return;
      const { ctx, w, h } = surface;
      ctx.clearRect(0, 0, w, h);
      const narrow = w < 760;
      const p = clamp(scrollY / Math.max(h, 1), 0, 1.2);

      // Faint backdrop rules.
      ctx.strokeStyle = `rgba(${LINE_RGB},.07)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 12; x < w; x += 24) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
      }
      ctx.stroke();

      const copyW = narrow ? 0 : copyBox.offsetWidth;
      const top = narrow ? copyBox.offsetHeight : 0;
      const areaW = w - copyW;
      const areaH = h - top;

      // Measure the label column, then size the stack to fit beside it.
      const nameFont = `500 ${narrow ? 11 : 12}px ${mono}`;
      const stackFont = `400 12px ${sans}`;
      const title = (index: number, name: string) =>
        narrow ? name.toUpperCase() : `[${pad(index)}] ${name.toUpperCase()}`;
      ctx.font = nameFont;
      let labelW = Math.max(
        ...PORTFOLIO_HERO_LAYERS.map((layer, i) => ctx.measureText(title(i, layer.name)).width)
      );
      if (!narrow) {
        ctx.font = stackFont;
        labelW = Math.max(
          labelW,
          ...PORTFOLIO_HERO_LAYERS.map((l) => ctx.measureText(l.stack).width)
        );
      }
      const lead = narrow ? 14 : 28;
      const S = clamp((areaW - labelW - lead - 48) / 3.7, 34, narrow ? 60 : 118);
      const gap =
        (narrow ? clamp(areaH * 0.1, 30, 40) : clamp(areaH * 0.085, 44, 70)) * (1 + p * 0.85);
      const blockW = 3.46 * S + lead + labelW;
      const cx = copyW + Math.max(16, (areaW - blockW) / 2) + 1.73 * S + pointer.x * 24;
      const cyMid = top + areaH * 0.5 + pointer.y * 16 - p * gap * 0.6;
      const th = p * 0.55 + pointer.x * 0.35;
      const ct = Math.cos(th);
      const st = Math.sin(th);
      const plates: Plate[] = PORTFOLIO_HERO_LAYERS.map((layer, i) => ({
        ...layer,
        cy: cyMid + (i - 2.5) * gap,
        dx: (i - 2.5) * p * 14,
      }));

      const iso = (pl: Plate, x: number, z: number, lift = 0): Point => {
        const xr = x * ct - z * st;
        const zr = x * st + z * ct;
        return [cx + pl.dx + (xr - zr) * 0.866, pl.cy + (xr + zr) * 0.5 + lift];
      };
      const poly = (pl: Plate, lift = 0) => {
        ctx.beginPath();
        CORNERS.forEach(([x, z], k) => {
          const [X, Y] = iso(pl, x * S, z * S, lift);
          if (k) ctx.lineTo(X, Y);
          else ctx.moveTo(X, Y);
        });
        ctx.closePath();
      };
      const seg = (pl: Plate, x1: number, z1: number, x2: number, z2: number) => {
        ctx.moveTo(...iso(pl, x1, z1));
        ctx.lineTo(...iso(pl, x2, z2));
      };
      const rect = (pl: Plate, x1: number, z1: number, x2: number, z2: number) => {
        seg(pl, x1, z1, x2, z1);
        seg(pl, x2, z1, x2, z2);
        seg(pl, x2, z2, x1, z2);
        seg(pl, x1, z2, x1, z1);
      };
      const ring = (pl: Plate, x: number, z: number, r: number) => {
        ctx.moveTo(...iso(pl, x + r, z));
        for (let k = 1; k <= 36; k++) {
          const a = (k / 36) * Math.PI * 2;
          ctx.lineTo(...iso(pl, x + Math.cos(a) * r, z + Math.sin(a) * r));
        }
      };

      // Each plate carries a line drawing of what that layer is.
      const pattern = (pl: Plate) => {
        const k = S / 100;
        ctx.beginPath();
        if (pl.kind === "arch") {
          ctx.setLineDash([4, 4]);
          rect(pl, -70 * k, -60 * k, -15 * k, -20 * k);
          rect(pl, 15 * k, -60 * k, 70 * k, -20 * k);
          rect(pl, -30 * k, 20 * k, 30 * k, 65 * k);
          seg(pl, -42 * k, -20 * k, -10 * k, 20 * k);
          seg(pl, 42 * k, -20 * k, 10 * k, 20 * k);
        } else if (pl.kind === "ui") {
          rect(pl, -78 * k, -78 * k, 78 * k, -56 * k);
          rect(pl, -78 * k, -46 * k, -40 * k, 78 * k);
          for (let r = 0; r < 2; r++)
            for (let c = 0; c < 2; c++)
              rect(pl, (-30 + c * 55) * k, (-46 + r * 64) * k, (18 + c * 55) * k, (8 + r * 64) * k);
        } else if (pl.kind === "ds") {
          for (let r = 0; r < 4; r++)
            for (let c = 0; c < 4; c++) {
              const x = (-60 + c * 40) * k;
              const z = (-60 + r * 40) * k;
              if ((r + c) % 2) rect(pl, x - 11 * k, z - 11 * k, x + 11 * k, z + 11 * k);
              else ring(pl, x, z, 12 * k);
            }
        } else if (pl.kind === "api") {
          const nodes: Point[] = [
            [-62, -50],
            [62, -50],
            [-62, 50],
            [62, 50],
            [0, -72],
            [0, 72],
          ];
          nodes.forEach(([x, z]) => {
            seg(pl, 0, 0, x * k, z * k);
            ring(pl, x * k, z * k, 9 * k);
          });
          ring(pl, 0, 0, 18 * k);
        } else if (pl.kind === "data") {
          rect(pl, -78 * k, -78 * k, 30 * k, 78 * k);
          for (let r = 1; r < 6; r++)
            seg(pl, -78 * k, (-78 + r * 26) * k, 30 * k, (-78 + r * 26) * k);
          seg(pl, -40 * k, -78 * k, -40 * k, 78 * k);
          for (let q = 0; q < 4; q++)
            rect(pl, 46 * k, (-70 + q * 38) * k, 78 * k, (-44 + q * 38) * k);
        } else {
          [26, 50, 74].forEach((r) => ring(pl, 0, 0, r * k));
          seg(pl, -14 * k, 0, -3 * k, 12 * k);
          seg(pl, -3 * k, 12 * k, 18 * k, -14 * k);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      };

      // The signal sits on the stack and scroll pushes it toward production.
      const sig = ((p * 1.4) % 1) * (plates.length - 1);
      const active = Math.round(sig);

      // Lower plates first so upper plates sit in front.
      for (let i = plates.length - 1; i >= 0; i--) {
        const pl = plates[i];
        const on = i === active;
        const thick = narrow ? 4 : 6;
        ctx.strokeStyle = `rgba(${LINE_RGB},${on ? 0.7 : 0.3})`;
        ctx.lineWidth = 1;
        poly(pl, thick);
        ctx.fillStyle = INK;
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        CORNERS.forEach(([x, z]) => {
          const [X, Y] = iso(pl, x * S, z * S);
          ctx.moveTo(X, Y);
          ctx.lineTo(X, Y + thick);
        });
        ctx.stroke();
        poly(pl);
        ctx.fillStyle = on ? INK_2 : INK;
        ctx.fill();
        ctx.strokeStyle = `rgba(${LINE_RGB},${on ? 1 : 0.6})`;
        ctx.lineWidth = on ? 1.4 : 1;
        ctx.stroke();
        ctx.strokeStyle = `rgba(${LINE_RGB},${on ? 0.95 : 0.35})`;
        ctx.lineWidth = 1;
        pattern(pl);
      }

      // The thread from first call to production, and the signal on it.
      ctx.strokeStyle = `rgba(${LINE_RGB},.55)`;
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      plates.forEach((pl, i) => {
        const [X, Y] = iso(pl, 0, 0);
        if (i) ctx.lineTo(X, Y);
        else ctx.moveTo(X, Y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      const from = plates[Math.floor(sig)];
      const to = plates[Math.min(Math.floor(sig) + 1, plates.length - 1)];
      const f = sig % 1;
      const [ax, ay] = iso(from, 0, 0);
      const [bx, by] = iso(to, 0, 0);
      const sx = ax + (bx - ax) * f;
      const sy = ay + (by - ay) * f;
      ctx.fillStyle = `rgba(${LINE_RGB},.18)`;
      ctx.beginPath();
      ctx.arc(sx, sy, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${LINE_RGB},1)`;
      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Labels in an aligned column to the right of the stack.
      const rightOf = (pl: Plate): Point =>
        CORNERS.map(([x, z]) => iso(pl, x * S, z * S)).reduce((m, c) => (c[0] > m[0] ? c : m));
      const colX = Math.min(
        Math.max(...plates.map((pl) => rightOf(pl)[0])) + lead,
        w - labelW - 12
      );
      plates.forEach((pl, i) => {
        const on = i === active;
        const [rx, ry] = rightOf(pl);
        ctx.strokeStyle = `rgba(${LINE_RGB},${on ? 0.9 : 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rx + 4, ry);
        ctx.lineTo(colX - 6, ry);
        ctx.stroke();
        ctx.fillStyle = `rgba(${LINE_RGB},${on ? 1 : 0.62})`;
        ctx.font = nameFont;
        ctx.textBaseline = "middle";
        ctx.fillText(title(i, pl.name), colX, ry - (narrow ? 0 : 7));
        if (!narrow) {
          ctx.fillStyle = `rgba(${MUTE_RGB},${on ? 1 : 0.7})`;
          ctx.font = stackFont;
          ctx.fillText(pl.stack, colX, ry + 10);
        }
      });
    }

    const pointer = createEasedPointer(draw, { smoothing: 0.06 });
    const onPointerMove = (event: PointerEvent) => {
      const box = hero.getBoundingClientRect();
      pointer.follow(
        (event.clientX - box.left) / box.width - 0.5,
        (event.clientY - box.top) / box.height - 0.5
      );
    };
    const onPointerLeave = () => pointer.follow(0, 0);
    if (!reducedMotion) {
      hero.addEventListener("pointermove", onPointerMove);
      hero.addEventListener("pointerleave", onPointerLeave);
    }
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) draw();
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
        live = false;
        pointer.stop();
        hero.removeEventListener("pointermove", onPointerMove);
        hero.removeEventListener("pointerleave", onPointerLeave);
      },
    };
  });

  return <canvas ref={ref} className={styles.field} aria-hidden="true" />;
};
