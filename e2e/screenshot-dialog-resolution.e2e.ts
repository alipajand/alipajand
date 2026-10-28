import { expect, test } from "@playwright/test";

import { settle } from "./support";

const VIEWPORTS = [
  { width: 320, height: 640, scale: 2 },
  { width: 390, height: 844, scale: 3 },
  { width: 844, height: 390, scale: 3 },
  { width: 820, height: 1180, scale: 2 },
  { width: 1440, height: 900, scale: 2 },
] as const;

for (const viewport of VIEWPORTS) {
  test.describe(`enlarged screenshot at ${viewport.width}x${viewport.height}@${viewport.scale}`, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.scale,
      hasTouch: viewport.width < 1280,
      isMobile: viewport.width < 768 || viewport.height < 500,
    });

    test("loads an image as sharp as the size it is shown at", async ({ page }) => {
      await page.goto("/portfolio/ledgerguard");
      await settle(page);
      const opener = page.locator("button[aria-haspopup='dialog']").first();
      await opener.scrollIntoViewIfNeeded();
      await opener.click();
      const image = page.locator("dialog[open] img");
      await expect(image).toBeVisible();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete)).toBe(true);

      const { needed, loaded } = await image.evaluate((img: HTMLImageElement) => ({
        needed: Math.round(img.getBoundingClientRect().width * window.devicePixelRatio),
        loaded: Number(new URL(img.currentSrc).searchParams.get("w")),
      }));
      expect(loaded, `loaded ${loaded}w for ${needed} device px`).toBeGreaterThanOrEqual(needed);
    });
  });
}
