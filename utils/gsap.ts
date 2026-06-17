"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export const registerGSAPPlugins = (): void => {
  if (typeof window === "undefined" || registered) return;
  if (typeof gsap.registerPlugin !== "function") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
};

export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export { gsap, ScrollTrigger };
