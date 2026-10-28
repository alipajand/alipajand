"use client";

import { useRef } from "react";

import {
  DiagramCaption,
  diagramFigureClass,
  DiagramHead,
  padIndex,
} from "components/hairline/Diagram/Diagram";
import styles from "components/hairline/LayersDiagram/LayersDiagram.module.css";
import { clamp } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";
import type { LayersDiagramSpec } from "utils/diagramBlocks";

export const LayersDiagram = ({ title, caption, layers }: Omit<LayersDiagramSpec, "type">) => {
  const ref = useRef<HTMLOListElement>(null);

  useMotion(ref, ({ element, reducedMotion }) => {
    if (reducedMotion) return;
    const items = Array.from(element.children);
    const light = (on: number) =>
      items.forEach((item, index) => item.toggleAttribute("data-on", index === on));
    return {
      onScroll: ({ vh }) => {
        const box = element.getBoundingClientRect();
        const progress = clamp((vh * 0.75 - box.top) / (box.height + vh * 0.2), 0, 0.999);
        light(box.top < vh && box.bottom > 0 ? Math.floor(progress * items.length) : -1);
      },
      onActiveChange: (active) => {
        if (!active) light(-1);
      },
      destroy: () => light(-1),
    };
  });

  return (
    <figure className={diagramFigureClass}>
      <DiagramHead title={title} />
      <ol ref={ref} className={styles.layers}>
        {layers.map((layer, index) => (
          <li key={layer.label}>
            <span className={styles.index}>{padIndex(index)}</span>
            <b>{layer.label}</b>
            {layer.detail ? <span className={styles.detail}>{layer.detail}</span> : null}
          </li>
        ))}
      </ol>
      <DiagramCaption caption={caption} />
    </figure>
  );
};
