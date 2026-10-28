import { type Browser, expect, test } from "@playwright/test";

import { horizontalOverflow, settle } from "./support";

const WIDTHS = [
  { width: 1440, height: 900, canvasHeight: 132 },
  { width: 390, height: 844, canvasHeight: 110 },
] as const;

const rulerBox = async (browser: Browser, javaScriptEnabled: boolean, width: number) => {
  const context = await browser.newContext({ javaScriptEnabled, viewport: { width, height: 900 } });
  const page = await context.newPage();
  await page.goto("/now");
  if (javaScriptEnabled) await settle(page);
  const box = await page.locator("[data-static-ruler]").locator("..").boundingBox();
  await context.close();
  return box;
};

for (const { width, height, canvasHeight } of WIDTHS) {
  test.describe(`now week ruler at ${width}px`, () => {
    test("shows the 52 steps and the cursor without JavaScript", async ({ browser }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width, height },
      });
      const page = await context.newPage();
      await page.goto("/now");
      const ruler = page.locator("[data-static-ruler]");
      await expect(ruler).toBeVisible();
      await expect(ruler.locator("..")).toHaveAttribute("aria-hidden", "true");
      await expect(ruler.locator("line")).toHaveCount(54);
      await expect(ruler).toContainText("Q1Q2Q3Q4");

      const box = (await ruler.locator("..").boundingBox())!;
      expect(Math.round(box.height)).toBe(canvasHeight + 1);
      const svg = (await ruler.locator("svg").boundingBox())!;
      expect(svg.x - box.x).toBeCloseTo(24, 0);
      expect(svg.width).toBeCloseTo(box.width - 48, 0);
      const cursor = (await ruler.locator("span").first().boundingBox())!;
      expect(cursor.width).toBeCloseTo(2, 0);
      expect(cursor.x).toBeGreaterThan(svg.x);
      expect(cursor.x + cursor.width).toBeLessThan(svg.x + svg.width);
      await expect(page.locator("[data-label]")).toBeVisible();
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      await context.close();
    });

    test("hands over to the canvas without a second ruler or a shift", async ({
      browser,
      page,
    }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/now");
      await settle(page);
      const host = page.locator("[data-static-ruler]").locator("..");
      await expect(host).toHaveAttribute("data-drawn", "");
      await expect(page.locator("[data-static-ruler]")).toBeHidden();
      await expect(host.locator("canvas")).toBeVisible();

      const withJs = await rulerBox(browser, true, width);
      const withoutJs = await rulerBox(browser, false, width);
      expect({ width: withJs?.width, height: withJs?.height }).toEqual({
        width: withoutJs?.width,
        height: withoutJs?.height,
      });
    });
  });
}

test("the ruler swap adds no layout shift", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { __shifts: number }).__shifts = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as Array<{ value: number }>) {
        (window as unknown as { __shifts: number }).__shifts += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("/now");
  await settle(page);
  await expect(page.locator("[data-static-ruler]").locator("..")).toHaveAttribute("data-drawn", "");
  const shifts = await page.evaluate(() => (window as unknown as { __shifts: number }).__shifts);
  expect(shifts).toBe(0);
});
