import { expect, test, type Page } from "@playwright/test";

import {
  expectBaseline,
  horizontalOverflow,
  scrollThrough,
  settle,
  VIEWPORTS,
  visualBaseline,
} from "./support";

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

/**
 * Section anchors from before the case studies took the design kit's ids (#241), as
 * `<project>-<key>`, and the chapter each one now lands on. Interface evidence exists only on the
 * case studies with screenshots.
 */
const LEGACY_SECTION_ANCHORS = {
  context: "context",
  problem: "problem",
  role: "role",
  built: "built",
  "technical-decisions": "technical-decisions",
  "ux-decisions": "ux",
  evidence: "evidence",
  outcome: "outcome",
  improve: "improve",
  related: "related",
} as const;

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

    test("opens live links in the same tab and reaches them from the keyboard", async ({
      page,
    }) => {
      await page.goto(path);
      const external = page.locator('main a[href^="http"]');
      const count = await external.count();
      for (let index = 0; index < count; index += 1) {
        const link = external.nth(index);
        await expect(link).not.toHaveAttribute("target", /.+/);
        await expect(link).toHaveAttribute("rel", "noreferrer");
        await expect(link).not.toHaveAttribute("aria-label", /new tab/);
        await link.focus();
        await expect(link).toBeFocused();
      }
    });

    for (const viewport of BASELINE_VIEWPORTS) {
      test(
        `matches its baseline at ${viewport.width}x${viewport.height}`,
        visualBaseline(`${slug}-${viewport.width}x${viewport.height}`),
        async ({ browser }) => {
          const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
          const page = await context.newPage();
          await page.goto(path);
          await settle(page);
          await loadImages(page);
          await settle(page);
          await expectBaseline(page, { fullPage: true });
          await context.close();
        }
      );
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

test.describe("anchors from before the kit's ids", () => {
  for (const slug of CASE_STUDIES) {
    test(`${slug}: every old section anchor lands on its chapter without JavaScript`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      const path = `/portfolio/${slug}`;
      await page.goto(path);
      for (const [key, chapter] of Object.entries(LEGACY_SECTION_ANCHORS)) {
        if (key === "evidence" && !WITH_HERO.has(slug)) continue;
        const marker = page.locator(`#${slug}-${key}`);
        await expect(marker, `#${slug}-${key}`).toHaveCount(1);
        expect(await marker.evaluate((element) => element.closest("section")?.id)).toBe(chapter);
      }
      await expect(page.locator(`#${slug}-heading`)).toHaveCount(1);

      // A deep link to an old anchor puts its chapter where the new anchor would.
      await page.goto(`${path}#${slug}-ux-decisions`);
      const ux = page.locator("#ux");
      await expect(ux).toBeInViewport();
      const top = await ux.evaluate((element) => element.getBoundingClientRect().top);
      expect(Math.abs(top - 50)).toBeLessThanOrEqual(2);
      await context.close();
    });
  }

  test("an old anchor also resolves with JavaScript and the rail follows it", async ({ page }) => {
    for (const slug of CASE_STUDIES) {
      await page.goto(`/portfolio/${slug}#${slug}-technical-decisions`);
      await settle(page);
      await expect(page.locator("#technical-decisions")).toBeInViewport();
      const rail = page.getByRole("navigation", { name: /^Table of contents for / });
      await expect(rail.locator('a[aria-current="true"]')).toHaveAttribute(
        "href",
        "#technical-decisions"
      );
    }
  });
});

test.describe("screenshot dialog on every case study with screenshots", () => {
  for (const slug of WITH_HERO) {
    test(`${slug}: takes focus, closes on Escape and the backdrop, and returns focus`, async ({
      page,
    }) => {
      await page.goto(`/portfolio/${slug}`);
      await settle(page);
      const openers = page.getByRole("button", { name: /^Enlarge: / });
      const count = await openers.count();
      expect(count).toBeGreaterThan(1);
      for (let index = 0; index < count; index += 1) {
        const opener = openers.nth(index);
        const name = (await opener.getAttribute("aria-label"))!.replace(/^Enlarge: /, "");
        const dialog = page.getByRole("dialog", { name });

        await opener.scrollIntoViewIfNeeded();
        await opener.focus();
        await page.keyboard.press("Enter");
        await expect(dialog).toBeVisible();
        expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(
          true
        );
        await page.keyboard.press("Escape");
        await expect(dialog).toBeHidden();
        await expect(opener).toBeFocused();

        await opener.click();
        await expect(dialog).toBeVisible();
        // The backdrop is whatever the viewport shows outside the dialog box.
        const box = (await dialog.boundingBox())!;
        const viewport = page.viewportSize()!;
        const backdrop = { x: viewport.width - 4, y: viewport.height - 4 };
        expect(backdrop.x > box.x + box.width || backdrop.y > box.y + box.height).toBe(true);
        await page.mouse.click(backdrop.x, backdrop.y);
        await expect(dialog).toBeHidden();
        await expect(opener).toBeFocused();
      }
    });
  }
});

test.describe("chapter jumps and browser history", () => {
  for (const slug of CASE_STUDIES) {
    test(`${slug}: Back and Forward step through the chapters jumped to`, async ({ page }) => {
      const path = `/portfolio/${slug}`;
      await page.goto(path);
      await settle(page);
      const rail = page.getByRole("navigation", { name: /^Table of contents for / });
      const current = rail.locator('a[aria-current="true"]');
      const at = async (hash: string) => {
        await expect(page).toHaveURL(new RegExp(`${path}${hash}$`));
        await expect(page.locator(hash)).toBeInViewport();
        await expect(current).toHaveAttribute("href", hash);
      };

      await rail.locator('a[href="#role"]').focus();
      await page.keyboard.press("Enter");
      await at("#role");
      await rail.locator('a[href="#outcome"]').focus();
      await page.keyboard.press("Enter");
      await at("#outcome");

      await page.goBack();
      await at("#role");
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await page.goForward();
      await at("#role");
      await page.goForward();
      await at("#outcome");
    });
  }

  /*
   * After a jump the rail marks the chapter jumped to, even one too short to reach the marking line
   * (the top third) or one the page bottoms out before (the last chapters). It follows the visitor's
   * own scrolling again afterwards.
   */
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    test(`the rail marks every chapter jumped to, and Back and Forward, at ${viewport.width}px`, async ({
      page,
    }) => {
      // Every chapter of all seven case studies, three times over.
      test.setTimeout(120_000);
      await page.setViewportSize(viewport);
      for (const slug of CASE_STUDIES) {
        const path = `/portfolio/${slug}`;
        await page.goto(path);
        await settle(page);
        const rail = page.getByRole("navigation", { name: /^Table of contents for / });
        const current = rail.locator('a[aria-current="true"]');
        const hashes = await rail
          .locator("a[href^='#']")
          .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));

        for (const hash of hashes) {
          await rail.locator(`a[href="${hash}"]`).click();
          await expect(page).toHaveURL(new RegExp(`${path}${hash}$`));
          await expect(current, `${slug}: jump to ${hash}`).toHaveAttribute("href", hash);
        }
        for (const hash of hashes.slice(0, -1).reverse()) {
          await page.goBack();
          await expect(page).toHaveURL(new RegExp(`${path}${hash}$`));
          await expect(current, `${slug}: Back to ${hash}`).toHaveAttribute("href", hash);
        }
        for (const hash of hashes.slice(1)) {
          await page.goForward();
          await expect(page).toHaveURL(new RegExp(`${path}${hash}$`));
          await expect(current, `${slug}: Forward to ${hash}`).toHaveAttribute("href", hash);
        }

        // The visitor's own scrolling takes over again.
        await page.mouse.wheel(0, -100_000);
        await expect(current, `${slug}: scrolled to the top`).toHaveAttribute("href", hashes[0]);
        await page.mouse.wheel(0, 100_000);
        await expect(current, `${slug}: scrolled to the end`).toHaveAttribute(
          "href",
          hashes.at(-1)!
        );
      }
    });
  }
});
