/** @jest-environment node */

/*
 * Publication is decided when a route renders, so a scheduled post goes live without a deploy only
 * because every route that reads it is re-rendered on the same schedule. A route left out would
 * keep showing the old state while the others moved on.
 */

import { readdirSync, readFileSync } from "fs";
import path from "path";

const APP_DIR = path.join(process.cwd(), "app");
const READS_PUBLICATION = /from "utils\/(posts|clock)"/;
const REVALIDATE = /^export const revalidate = (\d+);$/m;

function routeFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "__tests__" ? [] : routeFiles(full);
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
  });
}

const surfaces = routeFiles(APP_DIR)
  .filter((file) => READS_PUBLICATION.test(readFileSync(file, "utf8")))
  .map((file) => path.relative(APP_DIR, file))
  .sort();

describe("publication refresh", () => {
  it("should find every route that reads publication state", () => {
    expect(surfaces).toEqual([
      "feed.xml/route.ts",
      "llms-full.txt/route.ts",
      "llms.txt/route.ts",
      "page.tsx",
      "sitemap.ts",
      "writing/[slug]/opengraph-image.tsx",
      "writing/[slug]/page.tsx",
      "writing/page.tsx",
    ]);
  });

  it.each(surfaces)("%s should re-render hourly", (file) => {
    const source = readFileSync(path.join(APP_DIR, file), "utf8");

    expect(source.match(REVALIDATE)?.[1]).toBe("3600");
  });
});
