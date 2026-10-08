type LenisController = {
  scrollTo: (target: number, options?: { immediate?: boolean }) => void;
};

let lenis: LenisController | null = null;

export const registerLenis = (instance: LenisController | null): void => {
  lenis = instance;
};

export const scrollToTop = (): void => {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
};

/** Clears the fixed nav when jumping to an in-page target. */
export const SCROLL_TARGET_OFFSET = 96;

export const scrollToElement = (element: HTMLElement): void => {
  const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_TARGET_OFFSET;

  if (lenis) {
    lenis.scrollTo(top);
    return;
  }

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  window.scrollTo({ top, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
};
