import { resolve } from "path";

import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3456);
const CI = Boolean(process.env.CI);

/**
 * CI compares screenshots and never writes them: `updateSnapshots` is "none" there, and a CI run
 * that passes `--update-snapshots`/`-u` stops here. The one exception is the manual
 * update-visual-baselines job, which sets E2E_RENDER_BASELINES and uploads its renders for review.
 */
const updateFlagIndex = process.argv.findIndex(
  (arg) => arg === "-u" || arg.startsWith("--update-snapshots")
);
if (CI && updateFlagIndex !== -1 && !process.env.E2E_RENDER_BASELINES) {
  const flag = process.argv[updateFlagIndex];
  const value = flag.includes("=") ? flag.split("=")[1] : process.argv[updateFlagIndex + 1];
  if (flag === "-u" || value !== "none") {
    throw new Error("CI never writes visual baselines; render them with update-visual-baselines.");
  }
}

/**
 * The build (`pnpm build:e2e`) and the server both run as of this instant (see e2e/fixed-clock.cjs),
 * so which posts are published, and so the home and writing baselines, do not change when a
 * scheduled post goes live. It sits after the newest post's date, because published pages already
 * link to that post (a scheduled one is covered by the Jest publication tests). Moving it is a
 * content change: update `build:e2e` and re-record the home and writing baselines with it.
 */
const SERVER_NOW = "2026-10-28T16:00:00.000Z";

/**
 * Browser checks for every route, run against a production build (`pnpm build` first).
 * Visual baselines are platform specific (`{platform}` in the path): macOS baselines serve local
 * runs, Linux baselines serve CI once they are reviewed and committed. Screenshot tests carry the
 * `@visual` tag so CI can run them separately from the behavioural checks.
 */
export default defineConfig({
  testDir: "e2e",
  testMatch: "**/*.e2e.ts",
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFileName}/{arg}-{platform}{ext}",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  // GitHub's Linux runners have 4 vCPUs; the default (half of them) left the job at 12 minutes.
  workers: CI ? 4 : undefined,
  // CI never writes a baseline on its own; new ones come from the update-visual-baselines run.
  updateSnapshots: CI ? "none" : "missing",
  reporter: CI ? [["list"], ["github"], ["html", { open: "never" }]] : [["list"]],
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled", caret: "hide" },
  },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    ...devices["Desktop Chrome"],
    locale: "en-US",
    timezoneId: "UTC",
  },
  webServer: {
    command: `pnpm start -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    // A server started by hand does not get the pinned clock; stop it before recording baselines.
    reuseExistingServer: !CI,
    timeout: 120_000,
    env: {
      E2E_NOW: process.env.E2E_NOW ?? SERVER_NOW,
      NODE_OPTIONS: [
        process.env.NODE_OPTIONS,
        `--require=${JSON.stringify(resolve("e2e/fixed-clock.cjs"))}`,
      ]
        .filter(Boolean)
        .join(" "),
    },
  },
});
