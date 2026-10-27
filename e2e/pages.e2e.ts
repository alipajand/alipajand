import { expect, test } from "@playwright/test";

import { horizontalOverflow, PAGES, scrollThrough, settle, VIEWPORTS } from "./support";

const collectConsoleProblems = (page: import("@playwright/test").Page) => {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") problems.push(message.text());
  });
  page.on("pageerror", (error) => problems.push(error.message));
  return problems;
};

for (const { name, path } of PAGES) {
  test.describe(name, () => {
    test("renders without console errors or hydration warnings", async ({ page }) => {
      // Vercel serves its analytics scripts only on its own hosting.
      await page.route("**/_vercel/**", (route) =>
        route.fulfill({ status: 200, contentType: "text/javascript", body: "" })
      );
      const problems = collectConsoleProblems(page);
      await page.goto(path);
      await settle(page);
      await scrollThrough(page);
      expect(problems).toEqual([]);
    });

    test("has exactly one h1 and a labelled main landmark", async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main#main-content")).toHaveCount(1);
      await expect(page.getByRole("navigation", { name: "Primary" }).first()).toBeVisible();
    });

    for (const viewport of VIEWPORTS) {
      test(`never scrolls sideways at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        await settle(page);
        expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      });
    }

    test("keeps cumulative layout shift under 0.05 through a full scroll", async ({ page }) => {
      await page.addInitScript(() => {
        (window as unknown as { __cls: number }).__cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as unknown as Array<{
            value: number;
            hadRecentInput: boolean;
          }>) {
            if (!entry.hadRecentInput)
              (window as unknown as { __cls: number }).__cls += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto(path);
      await settle(page);
      await scrollThrough(page);
      const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
      expect(cls).toBeLessThan(0.05);
    });

    test("goes idle once scrolling stops (no unconditional animation loop)", async ({ page }) => {
      await page.addInitScript(() => {
        const original = window.requestAnimationFrame.bind(window);
        (window as unknown as { __frames: number }).__frames = 0;
        window.requestAnimationFrame = (callback) => {
          (window as unknown as { __frames: number }).__frames += 1;
          return original(callback);
        };
      });
      await page.goto(path);
      await settle(page);
      await scrollThrough(page);
      await page.waitForTimeout(1500);
      const before = await page.evaluate(
        () => (window as unknown as { __frames: number }).__frames
      );
      await page.waitForTimeout(1000);
      const after = await page.evaluate(() => (window as unknown as { __frames: number }).__frames);
      expect(after - before).toBe(0);
    });

    test("leaves scroll-driven motion at rest under reduced motion", async ({ browser }) => {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto(path);
      await settle(page);
      await page.mouse.wheel(0, 900);
      await page.waitForTimeout(400);
      const transforms = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLElement>("[data-word]")).map(
          (word) => word.style.transform
        )
      );
      expect(transforms.every((value) => value === "")).toBe(true);
      await context.close();
    });

    test("keeps content, navigation and the contact route usable without JavaScript", async ({
      browser,
    }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("#case-studies")).toBeVisible();
      await expect(page.locator("#contact")).toBeVisible();
      const primary = page.getByRole("navigation", { name: "Primary" }).first();
      await expect(primary.getByRole("link")).toHaveCount(5);
      await context.close();
    });

    test("shows the primary links and direct channels on a phone without JavaScript", async ({
      browser,
    }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width: 390, height: 844 },
      });
      const page = await context.newPage();
      await page.goto(path);
      // The disclosure button needs script, so the links stay out in the header instead.
      await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
      const primary = page.getByRole("navigation", { name: "Primary" }).first();
      for (const link of await primary.getByRole("link").all()) await expect(link).toBeVisible();
      const channels = page.getByRole("list", { name: "Direct links" });
      for (const link of await channels.getByRole("link").all()) await expect(link).toBeVisible();
      expect(await horizontalOverflow(page)).toBe(0);
      await context.close();
    });

    test("links only to pages and anchors that exist", async ({ page, request }) => {
      await page.goto(path);
      const hrefs = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]")).map(
          (a) => a.getAttribute("href") ?? ""
        )
      );
      const internal = [...new Set(hrefs.filter((href) => href.startsWith("/")))];
      for (const href of internal) {
        const [pathname, hash] = href.split("#");
        const response = await request.get(pathname || path);
        expect(response.status(), href).toBeLessThan(400);
        if (hash) expect(await response.text(), `${href} anchor`).toContain(`id="${hash}"`);
      }
      const anchors = hrefs.filter((href) => href.startsWith("#") && href.length > 1);
      for (const anchor of new Set(anchors)) {
        await expect(page.locator(anchor), anchor).toHaveCount(1);
      }
    });
  });
}

test.describe("site menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens from the keyboard, closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/portfolio");
    await settle(page);
    const button = page.getByRole("button", { name: "Open menu" });
    await button.focus();
    await page.keyboard.press("Enter");
    const panel = page.locator("#site-menu");
    await expect(panel).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    await page.keyboard.press("Tab");
    await expect(panel.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });
});

test.describe("contact form", () => {
  test("posts the same payload to /api/contact and announces success", async ({ page }) => {
    let payload: unknown = null;
    await page.route("**/api/contact", async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await page.goto("/");
    await page.locator("#contact-name").fill("Jane Doe");
    await page.locator("#contact-email").fill("jane@example.com");
    await page.locator("#contact-company").fill("Example Co");
    await page.locator("#contact-message").fill("Hello there");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByRole("status")).not.toBeEmpty();
    expect(payload).toEqual({
      name: "Jane Doe",
      email: "jane@example.com",
      message: expect.stringContaining("Hello there"),
    });
  });

  test("links each validation error to its field", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /send message/i }).click();
    const summaryLink = page.getByRole("link", { name: "Enter your name" });
    await expect(summaryLink).toBeVisible();
    await summaryLink.click();
    await expect(page.locator("#contact-name")).toBeFocused();
  });
});
