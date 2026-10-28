import { type CDPSession, expect, type Page, test } from "@playwright/test";

import { settle } from "./support";

const SLUG = "ledgerguard";
const VIEWPORTS = [
  { width: 1440, height: 900, touch: false },
  { width: 1024, height: 768, touch: true },
  { width: 768, height: 1024, touch: true },
  { width: 390, height: 844, touch: true },
  { width: 844, height: 390, touch: true },
  { width: 320, height: 640, touch: true },
] as const;

const pane = (page: Page) => page.locator("dialog[open] div:has(> img)");

const swipe = async (
  cdp: CDPSession,
  x: number,
  y: number,
  xDistance: number,
  yDistance: number
) => {
  const steps = 20;
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let step = 1; step <= steps; step += 1) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x + (xDistance * step) / steps, y: y + (yDistance * step) / steps }],
    });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
};

const openShot = async (page: Page, touch: boolean) => {
  const opener = page.locator("button[aria-haspopup='dialog']").nth(1);
  await opener.scrollIntoViewIfNeeded();
  if (touch) await opener.tap();
  else await opener.click();
  await expect(page.locator("dialog[open]")).toBeVisible();
  return opener;
};

for (const viewport of VIEWPORTS) {
  test.describe(`screenshot dialog at ${viewport.width}x${viewport.height}`, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: viewport.touch,
      isMobile: viewport.width < 768,
    });

    test("opens centred and keeps the page behind it still", async ({ page }) => {
      await page.goto(`/portfolio/${SLUG}`);
      await settle(page);
      const opener = await openShot(page, viewport.touch);
      const scrollY = await page.evaluate(() => window.scrollY);

      const gaps = await page.locator("dialog[open]").evaluate((dialog) => {
        const box = dialog.getBoundingClientRect();
        return {
          left: box.left,
          right: document.documentElement.clientWidth - box.right,
          top: box.top,
          bottom: window.innerHeight - box.bottom,
        };
      });
      expect(Math.abs(gaps.left - gaps.right), JSON.stringify(gaps)).toBeLessThanOrEqual(1);
      expect(Math.abs(gaps.top - gaps.bottom), JSON.stringify(gaps)).toBeLessThanOrEqual(1);
      expect(gaps.left).toBeGreaterThan(0);

      await page.mouse.move(viewport.width / 2, viewport.height / 2);
      await page.mouse.wheel(0, 600);
      await page.mouse.move(viewport.width - 2, viewport.height - 2);
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(300);
      expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);

      await page.keyboard.press("Escape");
      await expect(page.locator("dialog[open]")).toHaveCount(0);
      await expect(opener).toBeFocused();
      expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    });

    test("lets the keyboard reach and pan the image", async ({ page }) => {
      await page.goto(`/portfolio/${SLUG}`);
      await settle(page);
      await openShot(page, viewport.touch);
      await expect(page.locator("dialog[open]").getByRole("button")).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(pane(page)).toBeFocused();

      const scrolls = await pane(page).evaluate(
        (element) => element.scrollWidth > element.clientWidth
      );
      if (!scrolls) return;
      for (let index = 0; index < 3; index += 1) await page.keyboard.press("ArrowRight");
      await expect
        .poll(() => pane(page).evaluate((element) => element.scrollLeft))
        .toBeGreaterThan(0);
    });

    if (viewport.touch) {
      test("pans a wide image with a touch swipe without moving the page", async ({
        page,
        context,
      }) => {
        await page.goto(`/portfolio/${SLUG}`);
        await settle(page);
        await openShot(page, true);
        const scrollY = await page.evaluate(() => window.scrollY);
        const box = (await pane(page).boundingBox())!;
        const wide = await pane(page).evaluate(
          (element) => element.scrollWidth > element.clientWidth
        );
        const cdp = await context.newCDPSession(page);

        await swipe(cdp, box.x + box.width * 0.7, box.y + box.height / 2, -200, 0);
        if (wide) {
          await expect
            .poll(() => pane(page).evaluate((element) => element.scrollLeft))
            .toBeGreaterThan(0);
        }
        await swipe(cdp, box.x + box.width / 2, box.y + box.height / 2, 0, -400);
        await swipe(cdp, viewport.width / 2, Math.max(4, box.y / 2), 0, -400);
        await page.waitForTimeout(300);
        expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
      });

      test("scrolls an image taller than the screen with a vertical swipe on the image", async ({
        page,
        context,
      }) => {
        await page.goto(`/portfolio/${SLUG}`);
        await settle(page);
        await openShot(page, true);
        const dialog = page.locator("dialog[open]");
        const overflow = await dialog.evaluate((el) => el.scrollHeight - el.clientHeight);
        test.skip(overflow <= 0, "The image fits on this screen");

        const scrollY = await page.evaluate(() => window.scrollY);
        const box = (await pane(page).boundingBox())!;
        const frame = (await dialog.boundingBox())!;
        const visibleBottom = Math.min(box.y + box.height, frame.y + frame.height);
        const cdp = await context.newCDPSession(page);
        const startY = box.y + (visibleBottom - box.y) * 0.75;
        await swipe(cdp, box.x + box.width / 2, startY, 0, -(startY - box.y - 8));
        await expect.poll(() => dialog.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
        expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
      });
    }
  });
}
