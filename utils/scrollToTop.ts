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
