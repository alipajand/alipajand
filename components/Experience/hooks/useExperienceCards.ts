"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import gsap from "gsap";

const CARD_SELECTOR = "[data-experience-card]";

export interface UseExperienceCardsOptions {
  y?: number;
  duration?: number;
  ease?: string;
  threshold?: number;
  rootMargin?: string;
}

export interface ExperienceCardsSelectors {
  cardsRef: RefObject<HTMLUListElement | null>;
}

export interface ExperienceCardsHook {
  selectors: ExperienceCardsSelectors;
}

export function useExperienceCards(
  options: UseExperienceCardsOptions = {}
): ExperienceCardsHook {
  const cardsRef = useRef<HTMLUListElement>(null);

  const {
    y = 32,
    duration = 0.6,
    ease = "power3.out",
    threshold = 0.2,
    rootMargin = "0px 0px -40px 0px",
  } = options;

  useEffect(() => {
    const list = cardsRef.current;
    if (!list) return;

    const cards = list.querySelectorAll<HTMLElement>(CARD_SELECTOR);
    gsap.set(cards, { opacity: 0, y });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration,
            ease,
          });
          observer.unobserve(el);
        });
      },
      { threshold, rootMargin }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [y, duration, ease, threshold, rootMargin]);

  return {
    selectors: { cardsRef },
  };
}
