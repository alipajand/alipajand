/** @jest-environment node */

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const LATIN_SLICE: Array<[number, number]> = [
  [0x0000, 0x00ff],
  [0x0131, 0x0131],
  [0x0152, 0x0153],
  [0x02bb, 0x02bc],
  [0x02c6, 0x02c6],
  [0x02da, 0x02da],
  [0x02dc, 0x02dc],
  [0x0304, 0x0304],
  [0x0308, 0x0308],
  [0x0329, 0x0329],
  [0x2000, 0x206f],
  [0x20ac, 0x20ac],
  [0x2122, 0x2122],
  [0x2191, 0x2191],
  [0x2193, 0x2193],
  [0x2212, 0x2212],
  [0x2215, 0x2215],
  [0xfeff, 0xfeff],
  [0xfffd, 0xfffd],
];

const SYSTEM_FONT_SYMBOLS = new Set(["←", "→", "↗", "↺", "▾", "✓"]);

const ROOT = join(__dirname, "..", "..");
const SOURCE_DIRS = ["app", "components", "content", "data", "features"];
const SOURCE_FILE = /\.(tsx?|md|css)$/;

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "__tests__" ? [] : sourceFiles(path);
    return SOURCE_FILE.test(entry.name) ? [path] : [];
  });

const inLatinSlice = (codePoint: number) =>
  LATIN_SLICE.some(([start, end]) => codePoint >= start && codePoint <= end);

describe("font coverage", () => {
  it("should only use characters the self-hosted Archivo files carry", () => {
    const outside = new Map<string, string>();
    for (const file of SOURCE_DIRS.flatMap((dir) => sourceFiles(join(ROOT, dir)))) {
      // Comments never render: drop block comments and whole-line `//` comments.
      const text = readFileSync(file, "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");
      for (const char of text) {
        const codePoint = char.codePointAt(0) ?? 0;
        if (inLatinSlice(codePoint) || SYSTEM_FONT_SYMBOLS.has(char) || outside.has(char)) continue;
        outside.set(char, relative(ROOT, file));
      }
    }
    expect(Object.fromEntries(outside)).toEqual({});
  });
});
