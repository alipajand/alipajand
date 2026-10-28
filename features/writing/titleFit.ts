import type { CSSProperties } from "react";

/*
 * Display titles never break inside a word. The design measures each title in the browser and
 * shrinks it when its longest word would overflow; here the same limit is worked out on the server
 * from the display face's glyph widths, so the title renders at its final size with no script and
 * no layout shift. Widths are in em for Archivo ExtraBold set in capitals.
 */
const GLYPHS = {
  // font-stretch 112%, the reader title.
  reader: {
    A: 0.836,
    B: 0.826,
    C: 0.843,
    D: 0.841,
    E: 0.778,
    F: 0.716,
    G: 0.91,
    H: 0.884,
    I: 0.35,
    J: 0.68,
    K: 0.857,
    L: 0.686,
    M: 1.026,
    N: 0.883,
    O: 0.907,
    P: 0.776,
    Q: 0.907,
    R: 0.838,
    S: 0.779,
    T: 0.758,
    U: 0.872,
    V: 0.813,
    W: 1.091,
    X: 0.834,
    Y: 0.821,
    Z: 0.766,
    "0": 0.702,
    "1": 0.663,
    "2": 0.701,
    "3": 0.704,
    "4": 0.7,
    "5": 0.704,
    "6": 0.705,
    "7": 0.665,
    "8": 0.711,
    "9": 0.705,
    ".": 0.333,
    ",": 0.333,
    ":": 0.339,
    ";": 0.342,
    "!": 0.335,
    "?": 0.661,
    "'": 0.271,
    '"': 0.496,
    "’": 0.292,
    "-": 0.373,
    "–": 0.56,
    "—": 1.12,
    "(": 0.373,
    ")": 0.373,
    "&": 0.905,
    "/": 0.305,
    "+": 0.691,
    "#": 0.689,
    "@": 1.124,
    "%": 1.055,
    "*": 0.419,
    _: 0.592,
  },
  // font-stretch 125% with -0.01em tracking, the launch title.
  launch: {
    A: 0.923,
    B: 0.904,
    C: 0.932,
    D: 0.923,
    E: 0.853,
    F: 0.789,
    G: 1.002,
    H: 0.979,
    I: 0.363,
    J: 0.724,
    K: 0.941,
    L: 0.744,
    M: 1.138,
    N: 0.978,
    O: 1.003,
    P: 0.851,
    Q: 1.003,
    R: 0.922,
    S: 0.857,
    T: 0.838,
    U: 0.958,
    V: 0.894,
    W: 1.203,
    X: 0.93,
    Y: 0.908,
    Z: 0.847,
    "0": 0.776,
    "1": 0.693,
    "2": 0.773,
    "3": 0.779,
    "4": 0.771,
    "5": 0.779,
    "6": 0.781,
    "7": 0.707,
    "8": 0.793,
    "9": 0.781,
    ".": 0.34,
    ",": 0.34,
    ":": 0.334,
    ";": 0.34,
    "!": 0.348,
    "?": 0.705,
    "'": 0.268,
    '"': 0.512,
    "’": 0.295,
    "-": 0.406,
    "–": 0.615,
    "—": 1.24,
    "(": 0.361,
    ")": 0.361,
    "&": 0.991,
    "/": 0.298,
    "+": 0.726,
    "#": 0.747,
    "@": 1.243,
    "%": 1.122,
    "*": 0.421,
    _: 0.645,
  },
} as const;

export type TitleFace = keyof typeof GLYPHS;

const UNKNOWN = 1.1;
const SAFETY = 1.005;

export const longestWordEm = (title: string, face: TitleFace): number => {
  const glyphs: Record<string, number> = GLYPHS[face];
  const runs = title.toUpperCase().split(/\s+|(?<=[-–—])/);
  const widths = runs.map((run) =>
    Array.from(run).reduce((sum, char) => sum + (glyphs[char] ?? UNKNOWN), 0)
  );
  return Math.max(1, ...widths) * SAFETY;
};

export const titleFitStyle = (title: string, face: TitleFace): CSSProperties =>
  ({ "--fit-em": longestWordEm(title, face).toFixed(3) }) as CSSProperties;
