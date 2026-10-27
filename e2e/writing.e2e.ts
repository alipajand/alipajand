import { readdirSync } from "fs";
import { join } from "path";

import { expect, type Page, test } from "@playwright/test";

import { horizontalOverflow, scrollThrough, settle, VIEWPORTS, VISUAL_TAG } from "./support";

const SLUGS = readdirSync(join(process.cwd(), "content", "posts"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => file.replace(/\.md$/, ""))
  .sort();

const ROUTES = [
  { name: "writing", path: "/writing" },
  ...SLUGS.map((slug) => ({ name: slug, path: `/writing/${slug}` })),
];

/** Visual baselines: the index, the launch post and three articles covering every diagram type. */
const VISUAL = [
  "writing",
  "agent-readiness-doctor",
  "agent-instructions-are-code",
  "why-i-automate-code-review-with-mcp",
  "how-i-would-build-a-real-time-backgammon-platform",
];

const collectConsoleProblems = (page: Page) => {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") problems.push(message.text());
  });
  page.on("pageerror", (error) => problems.push(error.message));
  return problems;
};

const stubVercel = (page: Page) =>
  page.route("**/_vercel/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/javascript", body: "" })
  );

for (const { name, path } of ROUTES) {
  test.describe(`writing: ${name}`, () => {
    test("renders without console errors or hydration warnings", async ({ page }) => {
      await stubVercel(page);
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

    test("goes idle once scrolling stops when motion is paused", async ({ page }) => {
      // Idle drift (timeline wobble, ticker drift) runs until the visitor pauses motion; with it
      // paused, nothing may keep requesting frames after the page comes to rest.
      await page.addInitScript(() => {
        window.localStorage.setItem("motion-paused", "1");
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

    test("stays at rest under reduced motion", async ({ browser }) => {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto(path);
      await settle(page);
      await page.mouse.wheel(0, 900);
      await page.waitForTimeout(400);
      const moved = await page.evaluate(
        () =>
          Array.from(
            document.querySelectorAll<HTMLElement>("[data-word], main [aria-hidden] > div")
          ).filter((element) => element.style.transform !== "").length
      );
      expect(moved).toBe(0);
      const scene = page.locator("section[data-step]");
      if (await scene.count()) {
        await expect(scene).toHaveAttribute("data-step", "3");
        await expect(scene).not.toHaveAttribute("data-ready", /.*/);
      }
      const progress = await page.evaluate(
        () =>
          Array.from(document.querySelectorAll<HTMLElement>("[data-toc-link]")).filter(
            (link) => link.style.getPropertyValue("--p") !== ""
          ).length
      );
      expect(progress).toBe(0);
      await context.close();
    });

    test("keeps its content and links usable without JavaScript", async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      if (name === "writing") {
        await expect(page.locator("#posts article")).toHaveCount(SLUGS.length);
      } else {
        await expect(page.locator("[data-prose] p").first()).toBeVisible();
        const toc = page.locator("[data-toc-link]");
        if (await toc.count()) {
          const href = await toc.first().getAttribute("href");
          await expect(page.locator(`[id="${href!.slice(1)}"]`)).toHaveCount(1);
        }
      }
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
        await expect(page.locator(`[id="${anchor.slice(1)}"]`), anchor).toHaveCount(1);
      }
    });
  });
}

test.describe("writing: contents keyboard", () => {
  test("moves focus to the chosen section and marks it current", async ({ page }) => {
    await page.goto("/writing/agent-instructions-are-code");
    await settle(page);
    const toc = page.getByRole("complementary", { name: "Table of contents" });
    const link = toc.getByRole("link").nth(2);
    const href = (await link.getAttribute("href"))!;
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.locator(`[id="${href.slice(1)}"]`)).toBeFocused();
    await expect(link).toHaveAttribute("aria-current", "location");
    await page.keyboard.press("Tab");
    const focusedInsideArticle = await page.evaluate(
      () => document.activeElement?.closest("[data-prose]") !== null
    );
    expect(focusedInsideArticle).toBe(true);
  });

  test("filters the index with the keyboard", async ({ page }) => {
    await page.goto("/writing");
    await settle(page);
    const group = page.getByRole("group", { name: "Filter by topic" });
    const chip = group.getByRole("button").nth(1);
    await chip.focus();
    await page.keyboard.press("Space");
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    const shown = await page.locator("#posts article").count();
    expect(shown).toBeLessThan(SLUGS.length);
    await expect(group.getByRole("status")).toContainText(`${shown} of ${SLUGS.length}`);
  });
});

test.describe("writing: visual baselines", VISUAL_TAG, () => {
  test.use({ reducedMotion: "reduce" });

  for (const name of VISUAL) {
    const path = name === "writing" ? "/writing" : `/writing/${name}`;
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      test(`${name} matches its baseline at ${viewport.width}x${viewport.height}`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        await settle(page);
        await expect(page).toHaveScreenshot(
          `writing-${name}-${viewport.width}x${viewport.height}.png`,
          { fullPage: true }
        );
      });
    }
  }
});
