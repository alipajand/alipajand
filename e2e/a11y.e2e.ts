import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

import { record } from "./evidence";
import { AUDIT_ROUTES, settle } from "./support";

/*
 * Automated accessibility checks with axe-core (WCAG 2.0–2.2 A and AA rules) on every audited
 * route at a phone and a desktop width, and on the interactive states: open menu, open dialog,
 * open contents, filtered list and form errors.
 *
 * Only serious and critical violations fail. Moderate and minor ones are recorded with the
 * evidence. No rule is disabled. The only exceptions are the open findings below: each names one
 * rule and the elements it covers, is recorded in every run, and goes when its fix lands.
 */

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const DISABLED_RULES: string[] = [];

interface KnownFinding {
  id: string;
  rule: string;
  /** Matches the flagged element (or an ancestor) in the page. */
  within: string;
  note: string;
}

const KNOWN_FINDINGS: KnownFinding[] = [
  {
    id: "RG-A1",
    rule: "color-contrast",
    within: "[data-step]",
    note: "Scroll scenes dim the steps that are not current to 38% opacity (portfolio operating model, ARD launch steps). Needs a design decision.",
  },
  {
    id: "RG-A2",
    rule: "scrollable-region-focusable",
    within: "dialog [class*='dialogImage']",
    note: "The enlarged screenshot scrolls but cannot take keyboard focus outside Chromium. Owned with the screenshot dialog (ScreenshotFrame); code blocks and tables are covered by e2e/scroll-regions.e2e.ts.",
  },
  {
    id: "RG-A3",
    rule: "target-size",
    within: "[role='alert'] li",
    note: "Contact error summary links are 15px tall on a 21px pitch, so their 24px circles overlap.",
  },
];

/** True when every flagged element of a violation is covered by an open finding. */
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

const scan = async (page: Page, label: string) => {
  // Colours caught mid-transition after a click are not the colours a reader sees.
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
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
  const failing: typeof summary = [];
  const known: { id: string; finding: string }[] = [];
  for (const violation of summary) {
    if (violation.impact !== "serious" && violation.impact !== "critical") continue;
    const finding = await coveredByFinding(page, violation);
    if (finding) known.push({ id: violation.id, finding });
    else failing.push(violation);
  }
  record(`axe__${label}`, { label, violations: summary, knownFindings: known });
  return failing;
};

for (const route of AUDIT_ROUTES) {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    test(`${route.name} has no serious axe violations at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(route.path);
      await settle(page);
      expect(await scan(page, `${route.name}__${viewport.width}`)).toEqual([]);
    });
  }
}

test.describe("interactive states", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("open site menu", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    await page.getByRole("button", { name: "Open menu" }).click();
    expect(await scan(page, "state__menu-open")).toEqual([]);
  });

  test("open screenshot dialog", async ({ page }) => {
    await page.goto("/portfolio/ledgerguard");
    await settle(page);
    const opener = page.locator("button[aria-haspopup='dialog']").first();
    await opener.scrollIntoViewIfNeeded();
    await opener.click();
    await expect(page.locator("dialog[open]")).toBeVisible();
    expect(await scan(page, "state__dialog-open")).toEqual([]);
  });

  test("open launch contents", async ({ page }) => {
    await page.goto("/writing/agent-readiness-doctor");
    await settle(page);
    const summary = page.locator("details:has([data-toc-link]) summary");
    await summary.click();
    expect(await scan(page, "state__contents-open")).toEqual([]);
  });

  test("filtered writing list", async ({ page }) => {
    await page.goto("/writing");
    await settle(page);
    await page.getByRole("group", { name: "Filter by topic" }).getByRole("button").nth(1).click();
    expect(await scan(page, "state__filtered")).toEqual([]);
  });

  test("contact form with errors", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByRole("link", { name: "Enter your name" })).toBeVisible();
    expect(await scan(page, "state__form-errors")).toEqual([]);
  });
});
