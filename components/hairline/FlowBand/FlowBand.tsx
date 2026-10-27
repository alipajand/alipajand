"use client";

import { type CSSProperties, useRef } from "react";

import { Band } from "components/hairline/Band/Band";
import { BandChevrons } from "components/hairline/Band/BandChevrons";
import { padIndex } from "components/hairline/Diagram/Diagram";
import styles from "components/hairline/FlowBand/FlowBand.module.css";
import { clamp } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";
import type { FlowDiagramSpec } from "utils/diagramBlocks";

interface FlowBandProps extends Omit<FlowDiagramSpec, "type"> {
  /** The chapter this band follows; the chapter rail treats the band as part of it. */
  chapterId: string;
  /** Accessible name of the band, usually "<chapter> diagram". */
  label: string;
  /** Head label, such as "Diagram · Approach". */
  eyebrow?: string;
}

const MIN_LABEL_SIZE = 14;

/**
 * A long single word can outgrow a flow column. Shrink the step labels together until each fits;
 * the caller only refits when the list's width changes or fonts finish loading.
 */
const fitLabels = (labels: HTMLElement[]) => {
  if (labels.length === 0) return;
  labels.forEach((label) => {
    label.style.fontSize = "";
    label.style.overflowWrap = "normal";
  });
  let size = parseFloat(getComputedStyle(labels[0]).fontSize);
  while (
    size > MIN_LABEL_SIZE &&
    labels.some((label) => label.scrollWidth > label.clientWidth + 1)
  ) {
    size -= 1;
    labels.forEach((label) => (label.style.fontSize = `${size}px`));
  }
  labels.forEach((label) => (label.style.overflowWrap = ""));
};

/**
 * A numbered process on a full-bleed bone band, placed after the chapter it illustrates. Steps
 * stack on narrow screens and become columns once the band is 1000px wide. As the band crosses the
 * screen the current step inverts and passed steps keep a check; reduced motion shows every step
 * as passed.
 */
export const FlowBand = ({
  chapterId,
  label,
  eyebrow = "Diagram",
  title,
  steps,
  loop,
  caption,
}: FlowBandProps) => {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ element, reducedMotion }) => {
    const list = element.querySelector("ol");
    if (!list) return;
    const items = Array.from(list.children);
    const labels = Array.from(list.querySelectorAll<HTMLElement>("b"));
    let fittedWidth = -1;
    const refit = (force = false) => {
      if (!force && list.clientWidth === fittedWidth) return;
      fittedWidth = list.clientWidth;
      fitLabels(labels);
    };
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) refit(true);
    });

    const light = (on: number) =>
      items.forEach((item, index) => {
        item.toggleAttribute("data-on", index === on);
        item.toggleAttribute("data-done", index < on);
      });
    if (reducedMotion) light(items.length);

    return {
      onResize: () => refit(),
      onScroll: reducedMotion
        ? undefined
        : ({ vh }) => {
            const box = element.getBoundingClientRect();
            const progress = clamp((vh * 0.8 - box.top) / (box.height + vh * 0.1), 0, 0.999);
            light(
              box.bottom <= 0
                ? items.length
                : box.top < vh
                  ? Math.floor(progress * items.length)
                  : -1
            );
          },
      destroy: () => {
        cancelled = true;
        light(-1);
        labels.forEach((item) => item.style.removeProperty("font-size"));
      },
    };
  });

  return (
    <Band aria-label={label} data-chapter-for={chapterId}>
      <figure ref={ref} className={styles.figure}>
        <figcaption className={styles.head}>
          <span className={styles.eyebrow}>[ {eyebrow} ]</span>
          <span className={styles.title}>{title}</span>
        </figcaption>
        <ol className={styles.flow} style={{ "--steps": steps.length } as CSSProperties}>
          {steps.map((step, index) => (
            <li key={step.label}>
              <span className={styles.step}>Step {padIndex(index)}</span>
              <b>{step.label}</b>
              {step.detail ? <p>{step.detail}</p> : null}
            </li>
          ))}
        </ol>
        {loop ? (
          <div className={styles.loop}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" />
            </svg>
            <span>{loop}</span>
          </div>
        ) : null}
        {caption ? <p className={styles.caption}>{caption}</p> : null}
      </figure>
      <BandChevrons count={10} />
    </Band>
  );
};
