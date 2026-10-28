import AxeBuilder from "@axe-core/playwright";
import {
  type Browser,
  type BrowserContext,
  type BrowserContextOptions,
  expect,
  type Locator,
  type Page,
  test as base,
} from "@playwright/test";

import { settle } from "./support";

/*
 * RG-A1: the scroll scenes' step lists keep WCAG AA text contrast in every state. Each step is made
 * current in turn by scrolling, then axe's `color-contrast` rule runs on the step list once the
 * transition has finished. The portfolio scene is also checked halfway through its transition, and
 * every scene again under reduced motion. Runs in Chromium and in Playwright WebKit (not Safari).
 */

type BrowserName = "chromium" | "webkit";

const test = base.extend<
  { openPage: (name: BrowserName, options?: BrowserContextOptions) => Promise<Page> },
  { webkit: () => Promise<Browser> }
>({
  webkit: [
    async ({ playwright }, provide) => {
      let launched: Promise<Browser> | undefined;
      await provide(() => (launched ??= playwright.webkit.launch()));
      if (launched) await (await launched).close();
    },
    { scope: "worker" },
  ],
  openPage: async ({ browser, webkit, baseURL }, provide) => {
    const contexts: BrowserContext[] = [];
    await provide(async (name, options) => {
      const target = name === "webkit" ? await webkit() : browser;
      const context = await target.newContext({
        baseURL,
        locale: "en-US",
        timezoneId: "UTC",
        ...options,
      });
      contexts.push(context);
      return context.newPage();
    });
    for (const context of contexts) await context.close();
  },
});

interface Scene {
  name: string;
  path: string;
  section: string;
  stops: [number, number, number];
  current: (section: Locator, index: number) => Promise<void>;
}

const SCENES: Scene[] = [
  {
    name: "portfolio operating model",
    path: "/portfolio",
    section: "section[aria-labelledby='operating-model-heading']",
    stops: [0.15, 0.5, 0.85],
    current: async (section, index) => {
      const steps = section.locator("[data-step]");
      for (let other = 0; other < 3; other++) {
        if (other === index) await expect(steps.nth(other)).toHaveAttribute("data-on", "");
        else await expect(steps.nth(other)).not.toHaveAttribute("data-on", /.*/);
      }
    },
  },
  {
    name: "Agent Readiness Doctor launch",
    path: "/writing/agent-readiness-doctor",
    section: "section[data-step]",
    stops: [0.15, 0.47, 0.85],
    current: (section, index) => expect(section).toHaveAttribute("data-step", String(index + 1)),
  },
];

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];

const scrollTo = (section: Locator, progress: number) =>
  section.evaluate((element, t) => {
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + t * ((element as HTMLElement).offsetHeight - window.innerHeight));
  }, progress);

const finishTransitions = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.playState === "running" &&
            animation.effect?.getTiming().iterations !== Infinity
        )
        .map((animation) => animation.finished.catch(() => undefined))
    )
  );

const contrast = async (page: Page, scene: Scene) => {
  const results = await new AxeBuilder({ page })
    .include(`${scene.section} ol`)
    .withRules(["color-contrast"])
    .analyze();
  const nodes = (list: typeof results.violations) =>
    list.flatMap((rule) =>
      rule.nodes.map((node) => ({
        target: node.target.join(" "),
        ratio: (node.any[0]?.data as { contrastRatio?: number } | undefined)?.contrastRatio,
      }))
    );
  return { failing: nodes(results.violations), unjudged: nodes(results.incomplete) };
};

for (const browserName of ["chromium", "webkit"] as const) {
  for (const scene of SCENES) {
    for (const viewport of VIEWPORTS) {
      test(`${scene.name} steps keep AA contrast in every state at ${viewport.width}px in ${browserName}`, async ({
        openPage,
      }) => {
        const page = await openPage(browserName, { viewport });
        await page.goto(scene.path);
        await settle(page);
        const section = page.locator(scene.section);
        await expect(section).toHaveAttribute("data-ready", "");
        for (const [index, stop] of scene.stops.entries()) {
          await scrollTo(section, stop);
          await scene.current(section, index);
          await finishTransitions(page);
          expect(await contrast(page, scene), `step ${index + 1} current`).toEqual({
            failing: [],
            unjudged: [],
          });
        }
      });

      test(`${scene.name} steps keep AA contrast under reduced motion at ${viewport.width}px in ${browserName}`, async ({
        openPage,
      }) => {
        const page = await openPage(browserName, { viewport, reducedMotion: "reduce" });
        await page.goto(scene.path);
        await settle(page);
        const section = page.locator(scene.section);
        await section.scrollIntoViewIfNeeded();
        await expect(section).not.toHaveAttribute("data-ready", /.*/);
        expect(await contrast(page, scene)).toEqual({ failing: [], unjudged: [] });
      });
    }
  }

  test(`portfolio operating model steps keep AA contrast halfway through a change in ${browserName}`, async ({
    openPage,
  }) => {
    const scene = SCENES[0];
    const page = await openPage(browserName, { viewport: { width: 1440, height: 900 } });
    await page.goto(scene.path);
    await settle(page);
    const section = page.locator(scene.section);
    await scrollTo(section, scene.stops[0]);
    await scene.current(section, 0);
    await finishTransitions(page);
    await scrollTo(section, scene.stops[1]);
    await scene.current(section, 1);
    // Freeze every running transition at its midpoint, where the two states blend most.
    const frozen = await page.evaluate(
      () =>
        document.getAnimations().filter((animation) => {
          if (animation.playState !== "running") return false;
          const duration = Number(animation.effect?.getTiming().duration ?? 0);
          animation.pause();
          animation.currentTime = duration / 2;
          return true;
        }).length
    );
    expect(frozen).toBeGreaterThan(0);
    expect(await contrast(page, scene)).toEqual({ failing: [], unjudged: [] });
  });
}
