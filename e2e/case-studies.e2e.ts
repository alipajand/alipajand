import { expect, test, type Page } from "@playwright/test";

import { horizontalOverflow, scrollThrough, settle, VIEWPORTS } from "./support";

/** Every dedicated case study, in portfolio order. */
const CASE_STUDIES = [
  "ledgerguard",
  "alwaysgeeky",
  "emplifi",
  "agent-tooling",
  "tallyfolio",
  "controltech",
  "mapbylaw",
] as const;

/** Case studies that open on a tilted hero screenshot; the rest set their facts beside the intro. */
const WITH_HERO: ReadonlySet<string> = new Set([
  "ledgerguard",
  "alwaysgeeky",
  "tallyfolio",
  "mapbylaw",
]);

const BASELINE_VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
] as const;

const collectConsoleProblems = (page: Page) => {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") problems.push(message.text());
  });
  page.on("pageerror", (error) => problems.push(error.message));
  return problems;
};

/** Lazy screenshots load once scrolled near; wait until every one outside the lightboxes has. */
const loadImages = async (page: Page) => {
  await scrollThrough(page);
  await page.waitForFunction(() =>
    Array.from(document.images)
      .filter((image) => !image.closest("dialog"))
      .every((image) => image.complete && image.naturalWidth > 0)
  );
};

const countFrames = (page: Page) =>
  page.addInitScript(() => {
    const original = window.requestAnimationFrame.bind(window);
    (window as unknown as { __frames: number }).__frames = 0;
    window.requestAnimationFrame = (callback) => {
      (window as unknown as { __frames: number }).__frames += 1;
      return original(callback);
    };
  });

const framesIn = async (page: Page, ms: number) => {
  const read = () => page.evaluate(() => (window as unknown as { __frames: number }).__frames);
  const before = await read();
  await page.waitForTimeout(ms);
  return (await read()) - before;
};

for (const slug of CASE_STUDIES) {
  const path = `/portfolio/${slug}`;

  test.describe(path, () => {
    test("renders without console errors or hydration warnings", async ({ page }) => {
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
      await expect(page.getByRole("navigation", { name: "Case studies" })).toBeVisible();
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
      await page.addInitScript(() => window.localStorage.setItem("motion-paused", "1"));
      await countFrames(page);
      await page.goto(path);
      await settle(page);
      await scrollThrough(page);
      await page.waitForTimeout(1500);
      expect(await framesIn(page, 1000)).toBe(0);
    });

    test("runs idle frames only while the hero screenshot is on screen", async ({ page }) => {
      await countFrames(page);
      await page.goto(path);
      await settle(page);
      if (WITH_HERO.has(slug)) expect(await framesIn(page, 500)).toBeGreaterThan(0);
      else expect(await framesIn(page, 1000)).toBe(0);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(1500);
      expect(await framesIn(page, 1000)).toBe(0);
    });

    test("leaves motion at rest under reduced motion", async ({ browser }) => {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto(path);
      await settle(page);
      await page.mouse.wheel(0, 900);
      await page.waitForTimeout(400);
      const state = await page.evaluate(() => ({
        words: Array.from(document.querySelectorAll<HTMLElement>("[data-word]")).map(
          (word) => word.style.transform
        ),
        hero: document.querySelector<HTMLElement>("#intro figure > div")?.style.transform ?? "",
        pendingSteps: document.querySelectorAll("[data-chapter-for] li:not([data-done])").length,
      }));
      expect(state.words.every((value) => value === "")).toBe(true);
      expect(state.hero).toBe("");
      expect(state.pendingSteps).toBe(0);
      await context.close();
    });

    test("keeps content, screenshots and navigation usable without JavaScript", async ({
      browser,
    }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("#intro")).toBeVisible();
      await expect(page.locator("#context")).toBeVisible();
      if (WITH_HERO.has(slug))
        await expect(page.locator("#intro figure img").first()).toBeVisible();
      const rail = page.getByRole("navigation", { name: /^Table of contents for / });
      expect(await rail.getByRole("link").count()).toBeGreaterThan(3);
      await expect(page.getByRole("navigation", { name: "Case studies" })).toBeVisible();
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
      expect(anchors.length).toBeGreaterThan(0);
      for (const anchor of new Set(anchors)) {
        await expect(page.locator(anchor), anchor).toHaveCount(1);
      }
    });

    test("moves to a chapter from the rail with the keyboard", async ({ page }) => {
      await page.goto(path);
      await settle(page);
      const rail = page.getByRole("navigation", { name: /^Table of contents for / });
      const last = rail.getByRole("link").last();
      const target = (await last.getAttribute("href"))!;
      await last.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(new RegExp(`${target}$`));
      await expect(page.locator(target)).toBeInViewport();
    });

    test("opens live links in a new tab and reaches them from the keyboard", async ({ page }) => {
      await page.goto(path);
      const external = page.locator('main a[href^="http"]');
      const count = await external.count();
      for (let index = 0; index < count; index += 1) {
        const link = external.nth(index);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", "noopener noreferrer");
        await expect(link).toHaveAttribute("aria-label", /opens in new tab/);
        await link.focus();
        await expect(link).toBeFocused();
      }
    });

    for (const viewport of BASELINE_VIEWPORTS) {
      test(`matches its baseline at ${viewport.width}x${viewport.height}`, async ({ browser }) => {
        const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
        const page = await context.newPage();
        await page.goto(path);
        await settle(page);
        await loadImages(page);
        await settle(page);
        await expect(page).toHaveScreenshot(`${slug}-${viewport.width}x${viewport.height}.png`, {
          fullPage: true,
        });
        await context.close();
      });
    }
  });
}

test.describe("screenshot lightbox", () => {
  test("opens from the keyboard, closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/portfolio/ledgerguard");
    await settle(page);
    const opener = page.getByRole("button", { name: "Enlarge: Dashboard" });
    await opener.scrollIntoViewIfNeeded();
    await opener.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Dashboard" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("img")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test("closes from its close button and returns focus", async ({ page }) => {
    await page.goto("/portfolio/mapbylaw");
    await settle(page);
    const opener = page.getByRole("button", { name: /^Enlarge: / }).first();
    await opener.scrollIntoViewIfNeeded();
    await opener.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });
});

test.describe("case-study pager", () => {
  test("walks every case study in portfolio order", async ({ page }) => {
    for (const [index, slug] of CASE_STUDIES.entries()) {
      await page.goto(`/portfolio/${slug}`);
      const pager = page.getByRole("navigation", { name: "Case studies" });
      const hrefs = await pager
        .getByRole("link")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
      const next = CASE_STUDIES[index + 1];
      expect(hrefs).toEqual(["/portfolio", ...(next ? [`/portfolio/${next}`] : [])]);
    }
  });
});
