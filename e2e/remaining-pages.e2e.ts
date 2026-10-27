import { expect, type Page, test } from "@playwright/test";

import { horizontalOverflow, scrollThrough, settle, VIEWPORTS, VISUAL } from "./support";

/*
 * Browser checks and visual baselines for the open-source, engineering-principles, now and 404
 * routes. The 404 is reached through an unknown path so it is served with its real status.
 */
const ROUTES = [
  { name: "open-source", path: "/open-source", status: 200 },
  { name: "engineering-principles", path: "/engineering-principles", status: 200 },
  { name: "now", path: "/now", status: 200 },
  { name: "not-found", path: "/this-page-does-not-exist", status: 404 },
] as const;

const BASELINE_VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
] as const;

const stubVercelScripts = (page: Page) =>
  // Vercel serves its analytics scripts only on its own hosting.
  page.route("**/_vercel/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/javascript", body: "" })
  );

const collectConsoleProblems = (page: Page) => {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() !== "error" && message.type() !== "warning") return;
    // The 404 document itself is reported as a failed resource load.
    if (message.text().includes("status of 404")) return;
    problems.push(message.text());
  });
  page.on("pageerror", (error) => problems.push(error.message));
  return problems;
};

/** Pauses idle motion the way the footer control does, before any script runs. */
const pauseMotion = (page: Page) =>
  page.addInitScript(() => {
    try {
      window.localStorage.setItem("motion-paused", "1");
    } catch {
      // Storage may be unavailable; the check below would then fail loudly.
    }
  });

for (const { name, path, status } of ROUTES) {
  test.describe(name, () => {
    test(`responds with ${status}`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(status);
    });

    test("renders without console errors or hydration warnings", async ({ page }) => {
      await stubVercelScripts(page);
      const problems = collectConsoleProblems(page);
      await page.goto(path);
      await settle(page);
      await scrollThrough(page);
      expect(problems).toEqual([]);
    });

    test("has exactly one h1 and one main landmark", async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main#main-content[tabindex='-1']")).toHaveCount(1);
    });

    for (const viewport of VIEWPORTS) {
      test(`never scrolls sideways at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        await settle(page);
        expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
        await scrollThrough(page);
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

    test("goes idle after scrolling once motion is paused", async ({ page }) => {
      await pauseMotion(page);
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
      await expect(page.locator("html")).toHaveAttribute("data-motion-paused", "");
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
      const moved = await page.evaluate(
        () =>
          Array.from(
            document.querySelectorAll<HTMLElement>("[data-word], [data-line], [data-star]")
          ).filter((element) => element.style.transform !== "").length
      );
      expect(moved).toBe(0);
      await expect(page.locator("[data-on], [data-off], [data-lit]")).toHaveCount(0);
      await context.close();
    });

    test("keeps its content readable without JavaScript", async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("main#main-content")).not.toBeEmpty();
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

test.describe("not-found focus", () => {
  test("moves focus into the main region so Tab reaches the ways back", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await settle(page);
    await expect(page.locator("main#main-content")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("navigation", { name: "Ways back" }).getByRole("link").first()
    ).toBeFocused();
  });
});

test.describe("open-source keyboard", () => {
  test("reaches the project index, install commands and copy buttons from the keyboard", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/open-source");
    await settle(page);
    const firstIndexLink = page
      .getByRole("navigation", { name: "Projects on this page" })
      .getByRole("link")
      .first();
    await firstIndexLink.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#p-agent-readiness-mcp$/);

    const copy = page.getByRole("button", { name: "Copy the Agent Readiness MCP install command" });
    await copy.focus();
    await page.keyboard.press("Enter");
    await expect(copy).toHaveText(/Copied|Selected/);
    await expect(
      page.getByRole("status").filter({ hasText: "Agent Readiness MCP install command" })
    ).toHaveCount(1);

    const graph = page.getByRole("region", { name: "Contribution calendar, scrollable" });
    await graph.focus();
    await expect(graph).toBeFocused();
  });
});

test.describe("remaining pages visual baselines", VISUAL, () => {
  test.use({ reducedMotion: "reduce" });

  for (const { name, path } of ROUTES) {
    for (const viewport of BASELINE_VIEWPORTS) {
      test(`${name} matches its baseline at ${viewport.width}x${viewport.height}`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        await settle(page);
        await expect(page).toHaveScreenshot(`${name}-${viewport.width}x${viewport.height}.png`, {
          fullPage: true,
          // The week ruler follows the visitor's calendar week; everything else is fixed.
          mask: [page.locator("[data-label]").locator("..")],
        });
      });
    }
  }
});
