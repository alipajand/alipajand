import { GeistMono } from "geist/font/mono";
import { Archivo } from "next/font/google";

/**
 * Archivo carries display and text. The variable width axis (62–125) gives the wide uppercase
 * display cuts (font-stretch 112–125%); italics are used by tickers and pull quotes.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

/** Geist Mono for labels, indexes and chips, self-hosted from the existing geist package. */
export const geistMono = GeistMono;
