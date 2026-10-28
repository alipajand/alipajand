import { resolve } from "path";

import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3456);
const CI = Boolean(process.env.CI);

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

const SERVER_NOW = "2026-10-28T16:00:00.000Z";

export default defineConfig({
  testDir: "e2e",
  testMatch: "**/*.e2e.ts",
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFileName}/{arg}-{platform}{ext}",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? 4 : undefined,
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
