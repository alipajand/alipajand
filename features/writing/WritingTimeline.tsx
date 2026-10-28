"use client";

import { useRef } from "react";

import styles from "features/writing/WritingIndexHero.module.css";
import {
  hasTopic,
  pad,
  type TimelineRange,
  timelinePosition,
  type TopicLane,
  type WritingListPost,
} from "features/writing/writingModel";
import { formatShortDate } from "utils/date";
import { clamp, fitCanvas, LINE, LINE_RGB, tokenFontFamily } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";

type TimelinePost = Pick<WritingListPost, "slug" | "title" | "date" | "tags">;

interface WritingTimelineProps {
  /** Oldest first. */
  posts: readonly TimelinePost[];
  lanes: readonly TopicLane[];
  range: TimelineRange;
}

const MUTE = "rgba(163,163,156,1)";

/** "Oct 28" for the readout. */
const shortMonthDay = (date: string) => formatShortDate(date).replace(/,\s*\d{4}$/, "");

export const timelineReadout = (posts: readonly TimelinePost[], index: number): string => {
  const post = posts[index];
  if (!post) return "";
  return `${pad(index)} / ${posts.length} · ${shortMonthDay(post.date)}`;
};

/**
 * Every post on a timeline, one row per topic. Scrolling past the hero walks the cursor from the
 * oldest post to the newest; the pointer takes over while it is over the plot. Unlit marks drift by
 * a pixel while idle motion is allowed. With reduced motion it is one still frame on the newest post.
 * The canvas is decorative; the readout under it names the lit post.
 */
export const WritingTimeline = ({ posts, lanes, range }: WritingTimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const last = posts.length - 1;

  useMotion(ref, ({ element: box, reducedMotion, idleMotion }) => {
    const canvas = box.querySelector("canvas");
    const readDate = box.querySelector<HTMLElement>("[data-read-date]");
    const readTitle = box.querySelector<HTMLElement>("[data-read-title]");
    const hero = box.parentElement;
    if (!canvas || !readDate || !readTitle || !hero || posts.length === 0 || lanes.length === 0)
      return;
    const heroBox: HTMLElement = hero;
    const mono = tokenFontFamily("--font-mono", "ui-monospace, monospace");

    let hoverX: number | null = null;
    let cursor = 0;
    let current = -1;
    let time = 0;
    let step = 1;
    let ease = idleMotion;

    const heroProgress = () => {
      if (reducedMotion) return 1;
      const r = heroBox.getBoundingClientRect();
      return clamp((-r.top + innerHeight * 0.3) / (r.height + innerHeight * 0.2), 0, 1);
    };

    const draw = () => {
      const surface = fitCanvas(canvas);
      if (!surface) return;
      const { ctx, w, h } = surface;
      const prog = heroProgress();
      ctx.clearRect(0, 0, w, h);
      const narrow = w < 520;
      const laneFont = `500 ${narrow ? 10 : 12}px ${mono}`;
      ctx.font = laneFont;
      const longest = Math.max(
        ...lanes.map((lane) => ctx.measureText(lane.label.toUpperCase()).width)
      );
      const left = Math.min(narrow ? 110 : w * 0.34, longest + 30);
      const right = 18;
      const top = 30;
      const bottom = 92;
      const laneH = (h - top - bottom) / lanes.length;
      const X = (date: string) => left + timelinePosition(date, range) * (w - left - right);
      const Y = (index: number) => top + (index + 0.5) * laneH;

      // Month grid.
      ctx.font = `500 11px ${mono}`;
      ctx.textBaseline = "top";
      for (let m = 0; m < range.months; m++) {
        const date = new Date(range.start);
        date.setUTCMonth(date.getUTCMonth() + m);
        const x = X(date.toISOString().slice(0, 10));
        ctx.strokeStyle = `rgba(${LINE_RGB},.1)`;
        ctx.beginPath();
        ctx.moveTo(x + 0.5, top - 10);
        ctx.lineTo(x + 0.5, h - bottom + 8);
        ctx.stroke();
        if (!narrow || m % 3 === 0) {
          ctx.fillStyle = MUTE;
          date.setUTCDate(15);
          ctx.fillText(
            date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase(),
            x + 4,
            h - bottom + 14
          );
        }
      }

      // The lit post: the pointer wins, otherwise the scroll position.
      let idx: number;
      if (hoverX !== null && hoverX > left) {
        let best = 0;
        let bestDistance = Infinity;
        posts.forEach((post, index) => {
          const distance = Math.abs(X(post.date) - hoverX!);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = index;
          }
        });
        idx = best;
      } else {
        idx = Math.round(prog * last);
      }
      const target = X(posts[idx].date);
      cursor = ease ? cursor + (target - cursor) * 0.15 * step : target;
      if (!cursor) cursor = target;

      // Lanes.
      lanes.forEach((lane, index) => {
        const y = Y(index);
        const on = hasTopic(posts[idx], lane.key);
        ctx.strokeStyle = `rgba(${LINE_RGB},${on ? 0.5 : 0.2})`;
        ctx.beginPath();
        ctx.moveTo(left - 6, y + 0.5);
        ctx.lineTo(w - right, y + 0.5);
        ctx.stroke();
        ctx.font = laneFont;
        ctx.textBaseline = "middle";
        ctx.fillStyle = on ? LINE : MUTE;
        let text = lane.label.toUpperCase();
        while (ctx.measureText(text).width > left - 20 && text.length > 3)
          text = `${text.slice(0, -2)}…`;
        ctx.fillText(text, 12, y);
      });

      // Posts: a stem across the lanes each covers and a mark on each lane.
      posts.forEach((post, index) => {
        const x = X(post.date);
        const lit = index === idx;
        const ys = lanes.flatMap((lane, li) => (hasTopic(post, lane.key) ? [Y(li)] : []));
        if (!ys.length) return;
        const wob = lit ? 0 : Math.sin(time * 0.0012 + index) * 1.2;
        ctx.strokeStyle = `rgba(${LINE_RGB},${lit ? 1 : 0.35})`;
        ctx.lineWidth = lit ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(x + wob, Math.min(...ys));
        ctx.lineTo(x + wob, Math.max(...ys));
        ctx.stroke();
        ys.forEach((y) => {
          const r = lit ? 5.5 : 3.5;
          ctx.fillStyle = lit ? LINE : `rgba(${LINE_RGB},.7)`;
          ctx.fillRect(x + wob - r, y - r, r * 2, r * 2);
        });
      });

      // Cursor.
      ctx.strokeStyle = `rgba(${LINE_RGB},.9)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cursor + 0.5, top - 14);
      ctx.lineTo(cursor + 0.5, h - bottom + 8);
      ctx.stroke();
      ctx.fillStyle = LINE;
      ctx.beginPath();
      ctx.moveTo(cursor - 5, top - 18);
      ctx.lineTo(cursor + 5, top - 18);
      ctx.lineTo(cursor, top - 10);
      ctx.closePath();
      ctx.fill();

      if (idx !== current) {
        current = idx;
        readDate.textContent = timelineReadout(posts, idx);
        readTitle.textContent = posts[idx].title;
      }
    };

    if (reducedMotion) {
      ease = false;
      return { onResize: draw };
    }

    const onMove = (event: PointerEvent) => {
      hoverX = event.clientX - box.getBoundingClientRect().left;
      if (!idleMotion) draw();
    };
    const onLeave = () => {
      hoverX = null;
      if (!idleMotion) draw();
    };
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);

    return {
      onResize: draw,
      onScroll: idleMotion ? undefined : draw,
      onFrame: idleMotion
        ? (frame) => {
            time = frame.time;
            step = frame.step;
            draw();
          }
        : undefined,
      destroy: () => {
        box.removeEventListener("pointermove", onMove);
        box.removeEventListener("pointerleave", onLeave);
      },
    };
  });

  return (
    <div ref={ref} className={styles.time} aria-hidden="true">
      <canvas />
      <div className={styles.readout}>
        <span data-read-date="">{timelineReadout(posts, last)}</span>
        <span data-read-title="">{posts[last]?.title}</span>
      </div>
    </div>
  );
};
