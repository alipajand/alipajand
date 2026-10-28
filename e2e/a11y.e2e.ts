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

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const DISABLED_RULES: string[] = [];

interface KnownFinding {
  id: string;
  rule: string;
  within: string;
  reason: string;
  owner: string;
  seenIn: string[];
}

const KNOWN_FINDINGS: KnownFinding[] = [];

type BrowserName = "chromium" | "webkit";
const BROWSERS: readonly BrowserName[] = ["chromium", "webkit"];

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
  openPage: async ({ browser, webkit, baseURL }, provide, testInfo) => {
    const contexts: { context: BrowserContext; traced: boolean }[] = [];
    await provide(async (name, options) => {
      const target = name === "webkit" ? await webkit() : browser;
      const context = await target.newContext({
        baseURL,
        locale: "en-US",
        timezoneId: "UTC",
        ...options,
      });
      const traced = name === "webkit";
      if (traced) await context.tracing.start({ screenshots: true, snapshots: true });
      contexts.push({ context, traced });
      return context.newPage();
    });
    const failed = testInfo.status !== testInfo.expectedStatus;
    for (const [index, { context, traced }] of contexts.entries()) {
      if (traced) {
        await context.tracing
          .stop(failed ? { path: testInfo.outputPath(`webkit-trace-${index}.zip`) } : undefined)
          .catch(() => undefined);
      }
      await context.close();
    }
  },
});

const coveredByFinding = async (
  page: Page,
  violation: { id: string; targets: string[] },
  findings: readonly KnownFinding[]
): Promise<string | null> => {
  const finding = findings.find((entry) => entry.rule === violation.id);
  if (!finding) return null;
  const covered = await page.evaluate(
    ({ targets, within }) =>
      targets.every((target) => document.querySelector(target)?.closest(within) != null),
    { targets: violation.targets, within: finding.within }
  );
  return covered ? finding.id : null;
};

const scan = async (
  page: Page,
  label: string,
  browserName: BrowserName,
  findings: readonly KnownFinding[] = KNOWN_FINDINGS
) => {
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
    const finding = await coveredByFinding(page, violation, findings);
    if (finding) known.push({ id: violation.id, finding });
    else unlisted.push(violation);
  }
  const stale = findings
    .filter(
      (finding) =>
        finding.seenIn.includes(label) && !known.some((entry) => entry.finding === finding.id)
    )
    .map((finding) => `${finding.id} no longer reproduces here: remove it from seenIn`);
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

    test("the exception guard fails on every impact and on a stale finding", async ({
      openPage,
    }) => {
      const page = await openPage(browserName, { viewport: { width: 1440, height: 900 } });
      await page.goto("/now");
      await settle(page);
      await page.evaluate(() => {
        const probe = document.createElement("div");
        probe.id = "guard-probe";
        probe.innerHTML = [
          '<img src="/favicon.ico" width="16" height="16">',
          '<p style="color:#262624;background:#0f0f0e">Low contrast</p>',
          '<div role="directory">Deprecated role</div>',
        ].join("");
        document.getElementById("main-content")!.append(probe);
        document.documentElement.setAttributeNS(
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          "fr"
        );
      });
      const label = "guard__probe";
      const bare = await scan(page, label, browserName, []);
      expect(
        bare.unlisted.map((violation) => `${violation.id}:${violation.impact}`).sort()
      ).toEqual([
        "aria-deprecated-role:minor",
        "color-contrast:serious",
        "html-xml-lang-mismatch:moderate",
        "image-alt:critical",
      ]);

      const covering: KnownFinding = {
        id: "GUARD-1",
        rule: "aria-deprecated-role",
        within: "#guard-probe",
        reason: "self-test",
        owner: "a11y",
        seenIn: [label],
      };
      const elsewhere: KnownFinding = { ...covering, id: "GUARD-2", within: "header" };
      const stale: KnownFinding = { ...covering, id: "GUARD-3", rule: "region", seenIn: [label] };

      const covered = await scan(page, label, browserName, [covering]);
      expect(covered.unlisted.map((violation) => violation.id)).not.toContain(
        "aria-deprecated-role"
      );
      expect(covered.stale).toEqual([]);

      const wrongPlace = await scan(page, label, browserName, [elsewhere]);
      expect(wrongPlace.unlisted.map((violation) => violation.id)).toContain(
        "aria-deprecated-role"
      );
      expect(wrongPlace.stale).toEqual([
        "GUARD-2 no longer reproduces here: remove it from seenIn",
      ]);

      const gone = await scan(page, label, browserName, [stale]);
      expect(gone.stale).toEqual(["GUARD-3 no longer reproduces here: remove it from seenIn"]);
    });

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
