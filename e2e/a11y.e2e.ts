import AxeBuilder from "@axe-core/playwright";
import {
  type Browser,
  type BrowserContext,
  type BrowserContextOptions,
  expect,
  type Page,
  test as base,
} from "@playwright/test";

import { record } from "./evidence";
import { AUDIT_ROUTES, settle } from "./support";

/*
 * Automated accessibility checks with axe-core (WCAG 2.0–2.2 A and AA rules) on every route at a
 * phone and a desktop width, and on the interactive states: open menu, open dialog, open contents,
 * filtered list and form errors. Every check runs in Chromium and in Playwright WebKit (not Safari).
 *
 * Every violation fails, whatever its impact, unless an open finding below covers it. No rule is
 * disabled. Each finding names one rule, the elements it covers, why it is open and who owns it,
 * and the scans where it must still appear: when its fix lands those scans fail until the entry
 * goes, so an exception cannot outlive its defect. axe's "needs review" results are recorded with
 * the evidence but do not fail.
 */

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const DISABLED_RULES: string[] = [];

interface KnownFinding {
  id: string;
  rule: string;
  /** Matches the flagged element (or an ancestor) in the page. */
  within: string;
  reason: string;
  owner: string;
  /** Scan labels where the finding still reproduces. */
  seenIn: string[];
}

const KNOWN_FINDINGS: KnownFinding[] = [
  {
    id: "RG-A2",
    rule: "scrollable-region-focusable",
    within: "pre, dialog [class*='dialogImage']",
    reason:
      "Wide post code blocks and the enlarged screenshot scroll sideways but cannot take keyboard focus outside Chromium.",
    owner: "Post code blocks: features/writing/proseHtml.ts (#273). Screenshot: ScreenshotFrame.",
    seenIn: [
      "post-agent-instructions-are-code__390",
      "post-mapbylaw-ai-recommendations__390",
      "state__dialog-open",
    ],
  },
];

type BrowserName = "chromium" | "webkit";
const BROWSERS: readonly BrowserName[] = ["chromium", "webkit"];

/** A page in Chromium (the configured browser) or Playwright WebKit, launched once per worker. */
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

/** The finding that covers every flagged element of a violation, if one does. */
const coveredByFinding = async (
  page: Page,
  violation: { id: string; targets: string[] }
): Promise<string | null> => {
  const finding = KNOWN_FINDINGS.find((entry) => entry.rule === violation.id);
  if (!finding) return null;
  const covered = await page.evaluate(
    ({ targets, within }) =>
      targets.every((target) => document.querySelector(target)?.closest(within) != null),
    { targets: violation.targets, within: finding.within }
  );
  return covered ? finding.id : null;
};

/**
 * Runs axe and returns what must be empty: violations no finding covers, and findings listed for
 * this scan that no longer reproduce.
 */
const scan = async (page: Page, label: string, browserName: BrowserName) => {
  // Colours caught mid-transition after a click are not the colours a reader sees. A click can
  // scroll the page, and scroll scenes only change state on the next frames, so let those frames
  // run before collecting the transitions to wait for.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      )
  );
  await page.evaluate(() =>
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
  const results = await new AxeBuilder({ page })
    .withTags(TAGS)
    .disableRules(DISABLED_RULES)
    .analyze();
  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.length,
    targets: violation.nodes.map((node) => node.target.join(" ")),
  }));
  const unlisted: typeof summary = [];
  const known: { id: string; finding: string }[] = [];
  for (const violation of summary) {
    const finding = await coveredByFinding(page, violation);
    if (finding) known.push({ id: violation.id, finding });
    else unlisted.push(violation);
  }
  const stale = KNOWN_FINDINGS.filter(
    (finding) =>
      finding.seenIn.includes(label) && !known.some((entry) => entry.finding === finding.id)
  ).map((finding) => `${finding.id} no longer reproduces here: remove it from seenIn`);
  record(`axe__${browserName}__${label}`, {
    label,
    browserName,
    violations: summary,
    knownFindings: known,
    needsReview: results.incomplete.map((rule) => ({ id: rule.id, nodes: rule.nodes.length })),
  });
  return { unlisted, stale };
};

const CLEAN = { unlisted: [], stale: [] };

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
];

const AUDIT_PATHS = new Set(AUDIT_ROUTES.map((route) => route.path));

for (const browserName of BROWSERS) {
  test.describe(`axe in ${browserName}`, () => {
    for (const route of AUDIT_ROUTES) {
      for (const viewport of VIEWPORTS) {
        test(`${route.name} has no axe violations at ${viewport.width}px`, async ({ openPage }) => {
          const page = await openPage(browserName, { viewport });
          await page.goto(route.path);
          await settle(page);
          expect(await scan(page, `${route.name}__${viewport.width}`, browserName)).toEqual(CLEAN);
        });
      }
    }

    for (const viewport of VIEWPORTS) {
      test(`every other sitemap route has no axe violations at ${viewport.width}px`, async ({
        openPage,
        request,
      }) => {
        test.setTimeout(180_000);
        const sitemap = await (await request.get("/sitemap.xml")).text();
        const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
          .map((match) => new URL(match[1]).pathname)
          .filter((path) => !AUDIT_PATHS.has(path));
        expect(paths.length).toBeGreaterThan(0);
        const page = await openPage(browserName, { viewport });
        const results: Record<string, Awaited<ReturnType<typeof scan>>> = {};
        for (const path of paths) {
          await page.goto(path);
          await settle(page);
          const result = await scan(
            page,
            `sitemap${path.replace(/\//g, "_")}__${viewport.width}`,
            browserName
          );
          if (result.unlisted.length || result.stale.length) results[path] = result;
        }
        expect(results).toEqual({});
      });
    }

    test.describe("interactive states", () => {
      const viewport = { width: 390, height: 844 };

      test("open site menu", async ({ openPage }) => {
        const page = await openPage(browserName, { viewport });
        await page.goto("/");
        await settle(page);
        await page.getByRole("button", { name: "Open menu" }).click();
        expect(await scan(page, "state__menu-open", browserName)).toEqual(CLEAN);
      });

      test("open screenshot dialog", async ({ openPage }) => {
        const page = await openPage(browserName, { viewport });
        await page.goto("/portfolio/ledgerguard");
        await settle(page);
        const opener = page.locator("button[aria-haspopup='dialog']").first();
        await opener.scrollIntoViewIfNeeded();
        await opener.click();
        await expect(page.locator("dialog[open]")).toBeVisible();
        expect(await scan(page, "state__dialog-open", browserName)).toEqual(CLEAN);
      });

      test("open launch contents", async ({ openPage }) => {
        const page = await openPage(browserName, { viewport });
        await page.goto("/writing/agent-readiness-doctor");
        await settle(page);
        const summary = page.locator("details:has([data-toc-link]) summary");
        await summary.click();
        expect(await scan(page, "state__contents-open", browserName)).toEqual(CLEAN);
      });

      test("filtered writing list", async ({ openPage }) => {
        const page = await openPage(browserName, { viewport });
        await page.goto("/writing");
        await settle(page);
        await page
          .getByRole("group", { name: "Filter by topic" })
          .getByRole("button")
          .nth(1)
          .click();
        expect(await scan(page, "state__filtered", browserName)).toEqual(CLEAN);
      });

      test("contact form with errors", async ({ openPage }) => {
        const page = await openPage(browserName, { viewport });
        await page.goto("/");
        await settle(page);
        await page.getByRole("button", { name: /send message/i }).click();
        await expect(page.getByRole("link", { name: "Enter your name" })).toBeVisible();
        expect(await scan(page, "state__form-errors", browserName)).toEqual(CLEAN);
      });
    });

    // RG-A3 (#264): the error summary links were 15px tall on a 21px pitch.
    for (const width of [320, 390, 1440]) {
      test(`contact error summary links are 24px targets at ${width}px`, async ({ openPage }) => {
        const page = await openPage(browserName, { viewport: { width, height: 900 } });
        await page.goto("/");
        await settle(page);
        await page.getByRole("button", { name: /send message/i }).click();
        const links = page.locator("[role='alert'] li a");
        await expect(links).toHaveCount(3);
        await links.first().scrollIntoViewIfNeeded();
        const boxes = await links.evaluateAll((elements) =>
          elements.map((element) => {
            const box = element.getBoundingClientRect();
            return { top: box.top, height: box.height };
          })
        );
        for (const [index, box] of boxes.entries()) {
          expect(box.height, `link ${index + 1} height`).toBeGreaterThanOrEqual(24);
          if (index > 0) {
            expect(
              box.top - boxes[index - 1].top,
              `pitch before link ${index + 1}`
            ).toBeGreaterThanOrEqual(24);
          }
        }
        const results = await new AxeBuilder({ page })
          .include("[role='alert']:has(li a)")
          .withRules(["target-size"])
          .analyze();
        expect(results.violations).toEqual([]);
        expect(results.passes.map((rule) => rule.id)).toContain("target-size");
      });
    }
  });
}
