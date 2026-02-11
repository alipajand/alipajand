"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { gsap, registerGSAPPlugins, ScrollTrigger } from "utils/gsap";

const CARD_SELECTOR = "[data-experience-card]";

export interface UseExperienceCardsOptions {
  y?: number;
  duration?: number;
  ease?: string;
  start?: string;
}

export interface ExperienceCardsSelectors {
  cardsRef: RefObject<HTMLUListElement | null>;
}

export interface ExperienceCardsHook {
  selectors: ExperienceCardsSelectors;
}

export function useExperienceCards(options: UseExperienceCardsOptions = {}): ExperienceCardsHook {
  const cardsRef = useRef<HTMLUListElement>(null);

  const { y = 36, duration = 0.65, ease = "power3.out", start = "top 88%" } = options;

  useEffect(() => {
    registerGSAPPlugins();
    const list = cardsRef.current;
    if (!list) return;

    const cards = list.querySelectorAll<HTMLElement>(CARD_SELECTOR);
    gsap.set(cards, { opacity: 0, y });

    const triggers: ScrollTrigger[] = [];
    cards.forEach((card) => {
      const st = ScrollTrigger.create({
        trigger: card,
        start,
        once: true,
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration,
            ease,
          });
        },
      });
      triggers.push(st);
    });

    return () => triggers.forEach((st) => st.kill());
  }, [y, duration, ease, start]);

  return {
    selectors: { cardsRef },
  };
}
