"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { onScrollFrame, viewportProgress } from "utils/cinematic";
import { prefersReducedMotion } from "utils/gsap";

export interface CinematicCardsSelectors {
  containerRef: RefObject<HTMLElement | null>;
}

export interface UseCinematicCardsOptions {
  travel?: number;

  depth?: number;
}

const CARD_SELECTOR = "[data-cine-card]";

export const useCinematicCards = (
  options: UseCinematicCardsOptions = {}
): { selectors: CinematicCardsSelectors } => {
  const containerRef = useRef<HTMLElement>(null);
  const { travel = 26, depth = 0.012 } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined" || prefersReducedMotion()) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>(CARD_SELECTOR));
    if (cards.length === 0) return;

    return onScrollFrame(() => {
      cards.forEach((card, index) => {
        const progress = viewportProgress(card);

        const lane = index % 2 === 0 ? 1 : -1;
        const centered = progress - 0.5;
        const y = -centered * travel * lane;
        const scale = 1 - Math.abs(centered) * depth;

        card.style.setProperty("--cine-card-y", `${y.toFixed(2)}px`);
        card.style.setProperty("--cine-card-scale", scale.toFixed(4));
      });
    });
  }, [travel, depth]);

  return { selectors: { containerRef } };
};
