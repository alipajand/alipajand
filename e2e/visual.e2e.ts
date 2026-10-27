import { test } from "@playwright/test";

import { expectBaseline, PAGES, settle, VIEWPORTS, visualBaseline } from "./support";

/*
 * Full-page baselines at every required viewport. Reduced motion keeps scroll-driven islands at
 * their rest state, so the captures are deterministic.
 */
test.use({ reducedMotion: "reduce" });

for (const { name, path } of PAGES) {
  for (const viewport of VIEWPORTS) {
    test(
      `${name} matches its baseline at ${viewport.width}x${viewport.height}`,
      visualBaseline(`${name}-${viewport.width}x${viewport.height}`),
      async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        await settle(page);
        await expectBaseline(page, { fullPage: true });
      }
    );
  }

  test(
    `${name} matches its no-JavaScript baseline`,
    visualBaseline(`${name}-nojs-1440x900`),
    async ({ browser }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width: 1440, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await expectBaseline(page, { fullPage: true });
      await context.close();
    }
  );
}
