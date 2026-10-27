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
 * evidence. Rule exceptions: none.
 */

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const DISABLED_RULES: string[] = [];

const scan = async (page: Page, label: string) => {
  const results = await new AxeBuilder({ page })
    .withTags(TAGS)
    .disableRules(DISABLED_RULES)
    .analyze();
  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.length,
    targets: violation.nodes.slice(0, 3).map((node) => node.target.join(" ")),
  }));
  record(`axe__${label}`, { label, violations: summary });
  return summary.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical"
  );
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
