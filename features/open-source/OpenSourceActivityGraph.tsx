"use client";

import { type PointerEvent, useEffect, useRef, useState } from "react";

import styles from "features/open-source/OpenSourceActivity.module.css";
import {
  OPEN_SOURCE_ACTIVITY_GITHUB_HREF,
  OPEN_SOURCE_ACTIVITY_GITHUB_LABEL,
  OPEN_SOURCE_ACTIVITY_GRAPH_LABEL,
  OPEN_SOURCE_ACTIVITY_LEGEND,
} from "data/openSourcePage";
import { CALENDAR_CELL, type CalendarLayout } from "utils/contributions";
import { clamp } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";

interface OpenSourceActivityGraphProps {
  calendar: CalendarLayout;
  summary: string;
  restLabel: string;
}

export const OpenSourceActivityGraph = ({
  calendar,
  summary,
  restLabel,
}: OpenSourceActivityGraphProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [readout, setReadout] = useState(restLabel);
  const labels = calendar.weeks.flat().map((cell) => cell.label);

  useEffect(() => {
    const scroller = ref.current;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  }, []);

  useMotion(ref, ({ element, reducedMotion }) => {
    if (reducedMotion) return;
    const weeks = Array.from(element.querySelectorAll("[data-week]"));
    return {
      onScroll: ({ vh }) => {
        const top = element.getBoundingClientRect().top;
        const lit = Math.round(clamp((vh - top) / (vh * 0.55), 0, 1) * weeks.length);
        weeks.forEach((week, index) => week.toggleAttribute("data-off", index >= lit));
      },
      destroy: () => weeks.forEach((week) => week.removeAttribute("data-off")),
    };
  });

  const onPointerOver = (event: PointerEvent<HTMLDivElement>) => {
    const index = (event.target as Element).getAttribute?.("data-i");
    setReadout(index == null ? restLabel : (labels[Number(index)] ?? restLabel));
  };

  return (
    <>
      <div
        ref={ref}
        className={styles.graph}
        role="region"
        aria-label={OPEN_SOURCE_ACTIVITY_GRAPH_LABEL}
        tabIndex={0}
        onPointerOver={onPointerOver}
        onPointerLeave={() => setReadout(restLabel)}
      >
        <svg viewBox={`0 0 ${calendar.width} ${calendar.height}`} role="img" aria-label={summary}>
          {calendar.months.map((month) => (
            <text key={`${month.label}-${month.x}`} x={month.x} y={10}>
              {month.label}
            </text>
          ))}
          {calendar.weekdays.map((day) => (
            <text key={day.label} x={0} y={day.y}>
              {day.label}
            </text>
          ))}
          {calendar.weeks.map((week, weekIndex) => (
            <g key={weekIndex} className={styles.week} data-week="">
              {week.map((cell) => (
                <rect
                  key={cell.index}
                  className={styles[`l${cell.level}`]}
                  data-i={cell.index}
                  x={cell.x}
                  y={cell.y}
                  width={CALENDAR_CELL}
                  height={CALENDAR_CELL}
                />
              ))}
            </g>
          ))}
        </svg>
      </div>
      <div className={styles.foot}>
        <span className={styles.readout}>{readout}</span>
        <span className={styles.legend} aria-hidden="true">
          <b>{OPEN_SOURCE_ACTIVITY_LEGEND.less}</b>
          {[0, 1, 2, 3, 4].map((level) => (
            <i key={level} data-l={level} />
          ))}
          <b>{OPEN_SOURCE_ACTIVITY_LEGEND.more}</b>
        </span>
        <a className={styles.github} href={OPEN_SOURCE_ACTIVITY_GITHUB_HREF}>
          {OPEN_SOURCE_ACTIVITY_GITHUB_LABEL}
        </a>
      </div>
    </>
  );
};
