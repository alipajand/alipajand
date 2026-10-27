import { expect, type Page, test } from "@playwright/test";

import { settle } from "./support";

/*
 * The enlarged case-study screenshot: it opens centred, the page behind it stays put while it is
 * open and after it closes, and a wide image can be panned by touch and from the keyboard.
 * Phone and tablet sizes are emulated.
 */

const SLUG = "ledgerguard";
const VIEWPORTS = [
  { width: 1440, height: 900, touch: false },
  { width: 1024, height: 768, touch: true },
  { width: 768, height: 1024, touch: true },
  { width: 390, height: 844, touch: true },
  { width: 320, height: 640, touch: true },
] as const;

const pane = (page: Page) => page.locator("dialog[open] div:has(> img)");

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

      // Wheel over the image and over the backdrop: the page behind must not move.
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
        const swipe = (x: number, y: number, xDistance: number, yDistance: number) =>
          cdp.send("Input.synthesizeScrollGesture", {
            x,
            y,
            xDistance,
            yDistance,
            gestureSourceType: "touch",
            speed: 800,
          });

        await swipe(box.x + box.width * 0.7, box.y + box.height / 2, -200, 0);
        if (wide) {
          await expect
            .poll(() => pane(page).evaluate((element) => element.scrollLeft))
            .toBeGreaterThan(0);
        }
        // Vertical swipes on the image and on the backdrop leave the page where it was.
        await swipe(box.x + box.width / 2, box.y + box.height / 2, 0, -400);
        await swipe(viewport.width / 2, Math.max(4, box.y / 2), 0, -400);
        await page.waitForTimeout(300);
        expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
      });
    }
  });
}
