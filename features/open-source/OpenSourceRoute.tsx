"use client";

import { useRef } from "react";

import styles from "features/open-source/OpenSourceHero.module.css";
import {
  OPEN_SOURCE_ROUTE_COLUMNS,
  OPEN_SOURCE_ROUTE_NODES,
  OPEN_SOURCE_ROUTE_NOTE,
  OPEN_SOURCE_ROUTE_SURFACES,
  type OpenSourceRouteNode,
  type OpenSourceRouteNodeKey,
  openSourceRouteReadout,
} from "data/openSourcePage";
import {
  clamp,
  fitCanvas,
  INK,
  LINE,
  LINE_RGB,
  MUTE_RGB,
  tokenFontFamily,
} from "utils/motion/canvas";
import { createEasedPointer, type EasedPointer } from "utils/motion/easedPointer";
import { useMotion } from "utils/motion/useMotion";

type Edge = readonly [OpenSourceRouteNodeKey, OpenSourceRouteNodeKey];

const EDGES: readonly Edge[] = [
  ["repo", "ark"],
  ["repo", "acd"],
  ["diff", "apr"],
  ["apr", "review"],
  ...(["action", "mcp", "skill", "gitbot"] as const).flatMap((surface): Edge[] => [
    ["ark", surface],
    ["acd", surface],
  ]),
];

const NODE_ENTRIES = Object.entries(OPEN_SOURCE_ROUTE_NODES) as [
  OpenSourceRouteNodeKey,
  OpenSourceRouteNode,
][];

interface PlacedNode extends OpenSourceRouteNode {
  x: number;
  y: number;
  w: number;
  h: number;
  showFiles: boolean;
}

interface Layout {
  fs: number;
  useShort: boolean;
  xs: number[];
  nodes: Record<OpenSourceRouteNodeKey, PlacedNode>;
  top: number;
  slotH: number;
  w: number;
  h: number;
}

const bezier = (a: PlacedNode, b: PlacedNode, t: number): [number, number] => {
  const x0 = a.x + a.w;
  const y0 = a.y + a.h / 2;
  const x3 = b.x;
  const y3 = b.y + b.h / 2;
  const mx = (x3 - x0) * 0.5;
  const u = 1 - t;
  return [
    u * u * u * x0 + 3 * u * u * t * (x0 + mx) + 3 * u * t * t * (x3 - mx) + t * t * t * x3,
    u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y3 + t * t * t * y3,
  ];
};

export const OpenSourceRoute = () => {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ element, reducedMotion, idleMotion }) => {
    const canvasEl = element.querySelector("canvas");
    const readoutEl = element.querySelector<HTMLElement>("[data-readout]");
    const heroEl = element.closest("section");
    if (!canvasEl || !readoutEl || !heroEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const readout: HTMLElement = readoutEl;
    const hero: HTMLElement = heroEl;
    const mono = tokenFontFamily("--font-mono", "ui-monospace, monospace");

    let layout: Layout | null = null;
    let flow = 0;
    let time = 0;
    let active = 0;
    let shown = -1;
    // Smoothed pointer height for the grid drift; idle frames ease it, otherwise an eased pointer does.
    const pointer = { y: 0.5, sy: 0.5 };

    const doLayout = (ctx: CanvasRenderingContext2D, w: number, h: number): Layout => {
      // The largest type size whose three columns fit; short labels when even that fails.
      let fs = 12;
      let useShort = false;
      let widths: number[];
      const measure = () =>
        ([0, 1, 2] as const).map((col) =>
          Math.max(
            ...NODE_ENTRIES.filter(([, node]) => node.col === col).map(([, node]) => {
              ctx.font = `500 ${fs}px ${mono}`;
              return ctx.measureText(useShort ? node.short : node.label).width + fs * 2;
            })
          )
        );
      for (;;) {
        widths = measure();
        if (widths.reduce((a, b) => a + b, 0) + 3 * 28 <= w) break;
        if (fs > 10) {
          fs--;
          continue;
        }
        if (!useShort) {
          useShort = true;
          fs = 12;
          continue;
        }
        break;
      }
      // Tight outer margins so the space goes to the fans between columns.
      const spare = w - widths.reduce((a, b) => a + b, 0);
      const outer = Math.min(20, spare / 6);
      const gap = (spare - outer * 2) / 2;
      const xs = [outer, outer + widths[0] + gap, outer + widths[0] + widths[1] + gap * 2];
      const top = 56;
      const bottom = w < 520 ? 104 : 70;
      const slotH = (h - top - bottom) / 6;
      const boxH = Math.min(34, slotH * 0.62);
      const nodes = {} as Record<OpenSourceRouteNodeKey, PlacedNode>;
      for (const [key, node] of NODE_ENTRIES) {
        const files = node.files ?? [];
        const showFiles = files.length > 0 && !useShort && slotH > 52;
        const bh = showFiles ? boxH + files.length * (fs + 7) + 6 : boxH;
        nodes[key] = {
          ...node,
          x: xs[node.col],
          w: widths[node.col],
          h: bh,
          y: top + (node.slot + 0.5) * slotH - bh / 2,
          showFiles,
        };
      }
      return { fs, useShort, xs, nodes, top, slotH, w, h };
    };

    const heroProgress = () => {
      const box = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      return clamp((-box.top + vh * 0.2) / (box.height + vh * 0.05), 0, 0.999);
    };

    function draw() {
      const surface = fitCanvas(canvas);
      if (!surface) return;
      const { ctx, w, h } = surface;
      if (!layout || layout.w !== w || layout.h !== h) layout = doLayout(ctx, w, h);
      const { fs, useShort, nodes, xs, top, slotH } = layout;
      ctx.clearRect(0, 0, w, h);

      const activeKey = OPEN_SOURCE_ROUTE_SURFACES[active];
      const review = activeKey === "review";
      const litEdge = ([a, b]: Edge) =>
        b === activeKey || (review ? a === "diff" || b === "apr" : a === "repo");

      // Column headers and the dashed lane divider.
      ctx.font = `500 11px ${mono}`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = `rgba(${MUTE_RGB},1)`;
      OPEN_SOURCE_ROUTE_COLUMNS.forEach((column, index) => {
        const text = `[0${index + 1}] ${column.toUpperCase()}`;
        ctx.fillText(text, Math.min(xs[index], w - 8 - ctx.measureText(text).width), 26);
      });
      ctx.strokeStyle = `rgba(${LINE_RGB},.22)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 42.5);
      ctx.lineTo(w, 42.5);
      ctx.stroke();
      const divY = Math.round(top + 4.5 * slotH) + 0.5;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(0, divY);
      ctx.lineTo(w, divY);
      ctx.stroke();
      ctx.setLineDash([]);

      // A faint grid that drifts with the pointer, like a plotter bed.
      ctx.strokeStyle = `rgba(${LINE_RGB},.05)`;
      const offset = (pointer.sy - 0.5) * 24;
      for (let y = 60 + (offset % 24); y < h; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Edges and packets.
      EDGES.forEach((edge, edgeIndex) => {
        const a = nodes[edge[0]];
        const b = nodes[edge[1]];
        const on = litEdge(edge) && (edge[0] !== "repo" || !review);
        ctx.strokeStyle = `rgba(${LINE_RGB},${on ? 0.9 : 0.22})`;
        ctx.lineWidth = on ? 1.4 : 1;
        ctx.beginPath();
        for (let t = 0; t <= 1.0001; t += 0.05) {
          const [x, y] = bezier(a, b, t);
          if (t) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
        ctx.stroke();
        const packets = on ? 3 : 1;
        for (let k = 0; k < packets; k++) {
          const t = (((flow * 0.004 + edgeIndex * 0.137 + k / packets) % 1) + 1) % 1;
          const [x, y] = bezier(a, b, t);
          ctx.fillStyle = `rgba(${LINE_RGB},${on ? 1 : 0.5})`;
          ctx.fillRect(x - 2.5, y - 2.5, 5, 5);
        }
      });

      // Nodes.
      const rowH = Math.min(34, slotH * 0.62);
      for (const [key, node] of Object.entries(nodes) as [OpenSourceRouteNodeKey, PlacedNode][]) {
        const on =
          key === activeKey ||
          (review
            ? key === "diff" || key === "apr"
            : key === "repo" || key === "ark" || key === "acd");
        const solid = key === activeKey;
        ctx.fillStyle = solid ? LINE : INK;
        ctx.fillRect(node.x, node.y, node.w, node.h);
        ctx.strokeStyle = `rgba(${LINE_RGB},${on ? 1 : 0.45})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(node.x + 0.5, node.y + 0.5, node.w - 1, node.h - 1);
        ctx.font = `500 ${fs}px ${mono}`;
        ctx.fillStyle = solid ? INK : `rgba(${LINE_RGB},${on ? 1 : 0.6})`;
        ctx.fillText(useShort ? node.short : node.label, node.x + fs, node.y + rowH / 2);
        if (node.showFiles && node.files) {
          // A scan line steps through the instruction files the engines read.
          const files = node.files;
          const scan = Math.floor(time / 700) % files.length;
          files.forEach((file, index) => {
            const fy = node.y + rowH + index * (fs + 7) + 2;
            if (index === scan) {
              ctx.fillStyle = `rgba(${LINE_RGB},.14)`;
              ctx.fillRect(node.x + 4, fy - 1, node.w - 8, fs + 6);
            }
            ctx.fillStyle = `rgba(${MUTE_RGB},${index === scan ? 1 : 0.8})`;
            ctx.font = `400 ${fs - 1}px ${mono}`;
            ctx.fillText(file, node.x + fs, fy + (fs + 4) / 2);
          });
          ctx.strokeStyle = `rgba(${LINE_RGB},.35)`;
          ctx.beginPath();
          ctx.moveTo(node.x + 4, node.y + rowH + 0.5);
          ctx.lineTo(node.x + node.w - 4, node.y + rowH + 0.5);
          ctx.stroke();
        }
      }

      if (active !== shown) {
        shown = active;
        readout.textContent = openSourceRouteReadout(active);
      }
    }

    const relayout = () => {
      layout = null;
      draw();
    };
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) relayout();
    });

    if (reducedMotion) {
      return {
        onResize: relayout,
        destroy: () => {
          live = false;
        },
      };
    }

    const pointerTarget = (event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      return clamp((event.clientY - box.top) / box.height, 0, 1);
    };
    let eased: EasedPointer | null = null;
    if (!idleMotion) {
      eased = createEasedPointer(
        () => {
          pointer.sy = eased?.y ?? pointer.sy;
          draw();
        },
        { y: 0.5, smoothing: 0.08 }
      );
    }
    const onPointerMove = (event: PointerEvent) => {
      pointer.y = pointerTarget(event);
      eased?.follow(0, pointer.y);
    };
    const onPointerLeave = () => {
      pointer.y = 0.5;
      eased?.follow(0, 0.5);
    };
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerleave", onPointerLeave);

    const surfaceFromScroll = () => Math.floor(heroProgress() * OPEN_SOURCE_ROUTE_SURFACES.length);

    return {
      onResize: relayout,
      onFrame: idleMotion
        ? ({ time: now, vel, step }) => {
            time = now;
            pointer.sy += (pointer.y - pointer.sy) * Math.min(1, 0.08 * step);
            flow += (1 + Math.abs(vel) * 0.6) * step;
            active = surfaceFromScroll();
            draw();
          }
        : undefined,
      onScroll: idleMotion
        ? undefined
        : ({ vel }) => {
            // Paused: packets move only with scroll velocity and the file scan holds still.
            flow += Math.abs(vel) * 0.6;
            active = surfaceFromScroll();
            draw();
          },
      destroy: () => {
        live = false;
        eased?.stop();
        element.removeEventListener("pointermove", onPointerMove);
        element.removeEventListener("pointerleave", onPointerLeave);
      },
    };
  });

  return (
    <div ref={ref} className={styles.route} aria-hidden="true">
      <canvas />
      <div className={styles.readout}>
        <span data-readout="">{openSourceRouteReadout(0)}</span>
        <span>{OPEN_SOURCE_ROUTE_NOTE}</span>
      </div>
    </div>
  );
};
