export const scrollToTop = (): void => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
};

/** Clears the fixed nav when jumping to an in-page target. */
export const SCROLL_TARGET_OFFSET = 96;

export const scrollToElement = (element: HTMLElement): void => {
  const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_TARGET_OFFSET;
  window.scrollTo({ top, left: 0, behavior: "auto" });
};
