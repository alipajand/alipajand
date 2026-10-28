type MediaListener = (event: MediaQueryListEvent) => void;

export interface MediaControl {
  setMatches: (matches: boolean) => void;
}

export const installMatchMedia = (initial = false): MediaControl => {
  let matches = initial;
  const listeners = new Set<MediaListener>();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      get matches() {
        return matches;
      },
      media: query,
      onchange: null,
      addEventListener: (_: string, listener: MediaListener) => listeners.add(listener),
      removeEventListener: (_: string, listener: MediaListener) => listeners.delete(listener),
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
  return {
    setMatches: (next) => {
      matches = next;
      listeners.forEach((listener) => listener({ matches: next } as MediaQueryListEvent));
    },
  };
};

export const installObservers = (): void => {
  class Observer {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  Object.assign(window, { IntersectionObserver: Observer, ResizeObserver: Observer });
};

export const installManualFrames = (): { flush: () => number; pending: () => number } => {
  let next = 1;
  const queue = new Map<number, FrameRequestCallback>();
  window.requestAnimationFrame = (callback) => {
    const id = next++;
    queue.set(id, callback);
    return id;
  };
  window.cancelAnimationFrame = (id) => {
    queue.delete(id);
  };
  return {
    flush: () => {
      const callbacks = Array.from(queue.values());
      queue.clear();
      callbacks.forEach((callback) => callback(performance.now()));
      return callbacks.length;
    },
    pending: () => queue.size,
  };
};
