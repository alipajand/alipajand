export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export interface CanvasSurface {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
}

export const fitCanvas = (canvas: HTMLCanvasElement): CanvasSurface | null => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const bw = Math.round(w * dpr);
  const bh = Math.round(h * dpr);
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw;
    canvas.height = bh;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
};

export const tokenFontFamily = (token: "--font-sans" | "--font-mono", fallback: string): string => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return value || fallback;
};

export const LINE_RGB = "236,236,230";
export const INK = "#0f0f0e";
export const INK_2 = "#1b1b19";
export const LINE = "#ecece6";
export const MUTE_RGB = "163,163,156";
export const MUTE_INK = "#4b4b46";
