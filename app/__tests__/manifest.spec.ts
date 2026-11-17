/** @jest-environment node */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { size as iconSize } from "../icon";

const ROOT = join(__dirname, "..", "..");

interface ManifestIcon {
  src: string;
  sizes: string;
}

const manifest = JSON.parse(readFileSync(join(ROOT, "public", "manifest.json"), "utf8")) as {
  icons: ManifestIcon[];
};

const servedBy = (src: string): string[] => {
  if (src === "/icon") return [join(ROOT, "app", "icon.tsx")];
  if (src === "/apple-icon") return [join(ROOT, "app", "apple-icon.tsx")];
  return [join(ROOT, "public", src), join(ROOT, "app", src, "route.ts")];
};

describe("public/manifest.json", () => {
  it.each(manifest.icons.map((icon) => [icon.src, icon]))(
    "should serve the %s icon from a file or route",
    (src) => {
      expect(servedBy(src).some((path) => existsSync(path))).toBe(true);
    }
  );

  it("should declare an icon of at least 512px", () => {
    const widths = manifest.icons.map((icon) => Number(icon.sizes.split("x")[0]));
    expect(Math.max(...widths)).toBeGreaterThanOrEqual(512);
  });

  it("should keep the /icon entry in step with app/icon.tsx", () => {
    const entry = manifest.icons.find((icon) => icon.src === "/icon");
    expect(entry?.sizes).toBe(`${iconSize.width}x${iconSize.height}`);
  });
});
