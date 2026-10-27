import localFont from "next/font/local";

/**
 * Archivo carries display and text. The width axis gives the wide uppercase display cuts
 * (font-stretch 112–125%); italics are used by tickers, pull quotes and Markdown emphasis.
 *
 * The files are the Latin slices Google Fonts serves, trimmed by `scripts/build-fonts.py` to the
 * axis ranges the design draws: the upright keeps wdth 100–125 (nothing is set narrower than 100%)
 * and the italic is pinned at wdth 100. Every weight stays available on both.
 *
 * The metric-matched Arial shown until Archivo arrives is declared in globals.css with the values
 * next/font/google generated, so the swap moves text exactly as it did before self-hosting.
 */
export const archivo = localFont({
  src: [
    { path: "./fonts/Archivo-Latin.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/Archivo-Italic-Latin.woff2", weight: "100 900", style: "italic" },
  ],
  declarations: [{ prop: "font-stretch", value: "100% 125%" }],
  display: "swap",
  variable: "--font-archivo",
  adjustFontFallback: false,
  fallback: ["Archivo Fallback"],
});

/**
 * Geist Mono for labels, indexes, chips and code: the geist package's variable file cut to Latin
 * plus the arrow, maths, box-drawing and shape blocks (see `scripts/build-fonts.py`).
 */
export const geistMono = localFont({
  src: "./fonts/GeistMono-Latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-geist-mono",
  adjustFontFallback: false,
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Roboto Mono",
    "Menlo",
    "Monaco",
    "Liberation Mono",
    "DejaVu Sans Mono",
    "Courier New",
    "monospace",
  ],
});
