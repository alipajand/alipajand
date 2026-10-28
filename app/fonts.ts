import localFont from "next/font/local";

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
