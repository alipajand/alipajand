const DEFAULT_MAX_ATTEMPTS = 30;

export const scrollToHashElement = (
  hash: string,
  maxAttempts = DEFAULT_MAX_ATTEMPTS
): (() => void) => {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!id) return () => {};

  let attempts = 0;
  let frameId = 0;
  let cancelled = false;

  const tryScroll = () => {
    if (cancelled) return;

    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ block: "start" });
      return;
    }

    if (attempts < maxAttempts) {
      attempts += 1;
      frameId = window.requestAnimationFrame(tryScroll);
    }
  };

  frameId = window.requestAnimationFrame(tryScroll);

  return () => {
    cancelled = true;
    window.cancelAnimationFrame(frameId);
  };
};
