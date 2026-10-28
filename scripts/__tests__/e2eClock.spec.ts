/** @jest-environment node */

import { readFileSync } from "fs";
import { join } from "path";

const read = (file: string) => readFileSync(join(process.cwd(), file), "utf8");

describe("e2e clock", () => {
  it("should build with the same instant the server runs at", () => {
    const serverNow = read("playwright.config.ts").match(/const SERVER_NOW = "([^"]+)";/)?.[1];
    const scripts = JSON.parse(read("package.json")).scripts as Record<string, string>;
    expect(serverNow).toBeTruthy();
    expect(scripts["build:e2e"]).toContain(`E2E_NOW=${serverNow} `);
    expect(scripts["build:e2e"]).toContain("--require=./e2e/fixed-clock.cjs");
  });

  it("should use that build in every e2e job", () => {
    const builds = [...read(".github/workflows/e2e.yml").matchAll(/run: pnpm (build\S*)/g)];
    expect(builds.length).toBeGreaterThan(0);
    for (const [, script] of builds) expect(script).toBe("build:e2e");
  });
});
