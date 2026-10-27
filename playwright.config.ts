import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3456);
const CI = Boolean(process.env.CI);

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
    reuseExistingServer: !CI,
    timeout: 120_000,
  },
});
