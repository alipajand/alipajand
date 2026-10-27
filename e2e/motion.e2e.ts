import path from "node:path";

import { expect, type Page, test } from "@playwright/test";

import { record, stubVercelScripts, videoDir } from "./evidence";
import { AUDIT_ROUTES, FAMILY_ROUTES, settle } from "./support";

/*
 * Motion and performance in emulated Chromium: scroll-linked motion plays and settles, automatic
 * motion stops with the footer control and with reduced motion, and Core Web Vitals measured
 * locally (no network or CPU throttling, so they are a floor, not field data).
 */

const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1440, height: 900 };
const SIZES = [PHONE, DESKTOP] as const;

const runningAnimations = (page: Page) =>
  page.evaluate(
    () => document.getAnimations().filter((animation) => animation.playState === "running").length
  );

/** Inline styles of every element that scripts animate, keyed by position in the document. */
const inlineStyles = (page: Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("[style]")).map(
      (element) => `${element.tagName}.${element.className}|${element.getAttribute("style")}`
    )
  );

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

for (const route of FAMILY_ROUTES) {
  test.describe(`motion ${route.name}`, () => {
    for (const size of SIZES) {
      test(`plays scroll-linked motion, then idles once paused at ${size.width}px`, async ({
        page,
      }) => {
        await stubVercelScripts(page);
        await countFrames(page);
        await page.setViewportSize(size);
        await page.goto(route.path);
        await settle(page);

        const before = await inlineStyles(page);
        await page.mouse.wheel(0, size.height);
        await page.waitForTimeout(400);
        const after = await inlineStyles(page);
        const moved = after.filter((style) => !before.includes(style));
        const progress = await page
          .locator("header [class*='progress']")
          .evaluate((element) => (element as HTMLElement).style.getPropertyValue("--p"));
        expect(Number(progress), "scroll progress line follows the page").toBeGreaterThan(0);

        // Automatic motion runs until the footer control pauses it.
        const runningBefore = await runningAnimations(page);
        expect(runningBefore, "the status dot blinks").toBeGreaterThan(0);
        const pause = page.getByRole("button", { name: "Pause automatic motion" });
        await pause.scrollIntoViewIfNeeded();
        await pause.click();
        await expect(page.locator("html")).toHaveAttribute("data-motion-paused", "");
        await page.waitForTimeout(600);
        expect(await runningAnimations(page), "CSS animations after pausing").toBe(0);
        expect(await framesIn(page, 1000), "animation frames after pausing").toBe(0);

        // Scroll-linked motion keeps answering the visitor while automatic motion is paused.
        const pausedBefore = await inlineStyles(page);
        await page.mouse.wheel(0, -size.height);
        await page.waitForTimeout(400);
        const pausedAfter = await inlineStyles(page);
        expect(pausedAfter).not.toEqual(pausedBefore);

        await page.getByRole("button", { name: "Resume automatic motion" }).click();
        await expect(page.locator("html")).not.toHaveAttribute("data-motion-paused", "");
        expect(await runningAnimations(page)).toBeGreaterThan(0);

        record(`motion__${route.name}__${size.width}`, {
          route: route.path,
          viewport: size,
          scrollLinkedChanges: moved.length,
          runningAnimationsBeforePause: runningBefore,
        });
        // Leave the choice as found for other tests in this browser.
        await page.evaluate(() => window.localStorage.removeItem("motion-paused"));
      });
    }

    test("stays at rest and says motion is off under reduced motion", async ({ browser }) => {
      const context = await browser.newContext({ reducedMotion: "reduce", viewport: PHONE });
      const page = await context.newPage();
      await countFrames(page);
      await page.goto(route.path);
      await settle(page);
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(400);
      const moved = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll<HTMLElement>(
            "[data-word], [data-star], [data-line], [class*='track']"
          )
        )
          .filter((element) => element.style.transform !== "")
          .map((element) => element.className || element.tagName)
      );
      expect(moved).toEqual([]);
      expect(await runningAnimations(page)).toBe(0);
      expect(await framesIn(page, 1000)).toBe(0);
      await expect(page.getByText("Automatic motion off")).toBeVisible();
      await context.close();
    });
  });
}

for (const route of FAMILY_ROUTES) {
  for (const size of SIZES) {
    test(`web vitals for ${route.name} at ${size.width}px stay in the good range (local)`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        viewport: size,
        isMobile: size === PHONE,
        hasTouch: size === PHONE,
      });
      const page = await context.newPage();
      await stubVercelScripts(page);
      await page.addInitScript(() => {
        const win = window as unknown as {
          __vitals: { lcp: number; cls: number; inp: number; long: number[] };
        };
        win.__vitals = { lcp: 0, cls: 0, inp: 0, long: [] };
        const observe = (type: string, onEntry: (entry: PerformanceEntry) => void, extra = {}) =>
          new PerformanceObserver((list) => list.getEntries().forEach(onEntry)).observe({
            type,
            buffered: true,
            ...extra,
          } as PerformanceObserverInit);
        observe("largest-contentful-paint", (entry) => {
          win.__vitals.lcp = entry.startTime;
        });
        observe("layout-shift", (entry) => {
          const shift = entry as unknown as { value: number; hadRecentInput: boolean };
          if (!shift.hadRecentInput) win.__vitals.cls += shift.value;
        });
        observe(
          "event",
          (entry) => {
            const event = entry as unknown as { interactionId: number; duration: number };
            if (event.interactionId) win.__vitals.inp = Math.max(win.__vitals.inp, event.duration);
          },
          { durationThreshold: 16 }
        );
        observe("longtask", (entry) => win.__vitals.long.push(Math.round(entry.duration)));
      });
      await page.goto(route.path);
      await settle(page);

      // Scripted interactions for INP: the menu on a phone, the motion control on a desktop.
      if (size === PHONE) {
        await page.getByRole("button", { name: "Open menu" }).tap();
        await page.getByRole("button", { name: "Close menu" }).tap();
      } else {
        const pause = page.getByRole("button", { name: "Pause automatic motion" });
        await pause.scrollIntoViewIfNeeded();
        await pause.click();
        await page.getByRole("button", { name: "Resume automatic motion" }).click();
        await page.evaluate(() => window.scrollTo(0, 0));
      }
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      for (let y = 0; y < 6; y += 1) {
        await page.mouse.wheel(0, size.height * 0.8);
        await page.waitForTimeout(80);
      }
      await page.waitForTimeout(300);
      const vitals = await page.evaluate(
        () =>
          (
            window as unknown as {
              __vitals: { lcp: number; cls: number; inp: number; long: number[] };
            }
          ).__vitals
      );
      record(`vitals__${route.name}__${size.width}`, {
        route: route.path,
        viewport: size,
        lcp: Math.round(vitals.lcp),
        cls: Number(vitals.cls.toFixed(4)),
        // The event timing API reports nothing under 16ms; 0 here means "under 16ms".
        inp: Math.round(vitals.inp),
        longTasks: vitals.long,
      });
      expect(vitals.lcp, "LCP").toBeGreaterThan(0);
      expect(vitals.lcp, "LCP").toBeLessThan(2500);
      expect(vitals.cls, "CLS").toBeLessThan(0.1);
      expect(vitals.inp, "INP").toBeLessThan(200);
      // Headless CPU timing is noisy; only a long freeze fails.
      expect(vitals.long.filter((duration) => duration >= 250)).toEqual([]);
      await context.close();
    });
  }
}

const RECORDED = ["home", "case-ledgerguard", "post-agent-instructions-are-code", "open-source"];

test.describe("scroll recordings", () => {
  for (const route of AUDIT_ROUTES.filter((candidate) => RECORDED.includes(candidate.name))) {
    for (const size of SIZES) {
      test(`${route.name} scrolls top to bottom at ${size.width}px without errors or freezes`, async ({
        browser,
      }) => {
        test.slow();
        const dir = videoDir();
        const videoSize =
          size === DESKTOP
            ? { width: 960, height: 600 }
            : { width: size.width, height: size.height };
        const context = await browser.newContext({
          viewport: size,
          isMobile: size === PHONE,
          hasTouch: size === PHONE,
          ...(dir ? { recordVideo: { dir, size: videoSize } } : {}),
        });
        const page = await context.newPage();
        await stubVercelScripts(page);
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.addInitScript(() => {
          const win = window as unknown as { __long: number[] };
          win.__long = [];
          new PerformanceObserver((list) =>
            list.getEntries().forEach((entry) => win.__long.push(Math.round(entry.duration)))
          ).observe({ type: "longtask" });
        });
        await page.goto(route.path);
        await settle(page);
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        const step = Math.round(size.height / 3);
        for (let y = 0; y < height; y += step) {
          await page.mouse.wheel(0, step);
          await page.waitForTimeout(90);
        }
        await page.waitForTimeout(500);
        const long = await page.evaluate(() => (window as unknown as { __long: number[] }).__long);
        const video = page.video();
        await context.close();
        if (dir && video) {
          await video.saveAs(path.join(dir, `${route.name}__${size.width}.webm`));
          await video.delete();
        }
        record(`scroll__${route.name}__${size.width}`, {
          route: route.path,
          viewport: size,
          pageHeight: height,
          longTasks: long,
        });
        expect(errors).toEqual([]);
        expect(long.filter((duration) => duration >= 250)).toEqual([]);
      });
    }
  }
});
