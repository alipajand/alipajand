import { expect, type Page, test } from "@playwright/test";

import { settle } from "./support";

/*
 * Tap areas of the shell controls on emulated touch screens: the header name, the primary links
 * (one row, the menu below 521px, and the wrapped no-script rows), "Book a call", the footer
 * channels and the motion control. Each tap area includes any transparent ::after expansion.
 *
 * Every area must be at least 44x44 CSS px, except "Book a call": the CTA cell splits its 56px into
 * the "Open to roles" line and the link, so the link is 28px tall. That passes WCAG 2.5.8 (24px)
 * and growing it is an open design decision, so it is held to 24px here. No two areas may overlap,
 * and each one must actually receive taps across its whole box.
 */

const WIDTHS = [320, 375, 390, 768, 1024] as const;
const MIN = 44;
const BOOK_CALL_MIN = 24;

interface Area {
  label: string;
  group: string;
  box: { left: number; top: number; right: number; bottom: number };
  /** Hit tests at the four edges of the box, 1px inside, plus the centre. */
  receivesTaps: boolean;
}

/** Collects the visible shell controls and their tap areas, in page coordinates. */
const tapAreas = (page: Page): Promise<Area[]> =>
  page.evaluate(() => {
    const visible = (element: Element | null): element is HTMLElement =>
      element instanceof HTMLElement && element.getClientRects().length > 0;
    const targets: Array<[string, HTMLElement]> = [];
    const add = (group: string, element: Element | null) => {
      if (visible(element)) targets.push([group, element]);
    };
    add("name", document.querySelector("header > a"));
    document.querySelectorAll("header nav a").forEach((link) => add("link", link));
    add("menu", document.querySelector("header button[aria-controls='site-menu']"));
    document.querySelectorAll("#site-menu a").forEach((link) => add("menu link", link));
    add("book", document.querySelector("header a[target='_blank']"));
    document.querySelectorAll("footer ul a").forEach((link) => add("channel", link));
    add("motion", document.querySelector("footer button[data-motion-control]"));

    return targets.map(([group, element]) => {
      element.scrollIntoView({ block: "center" });
      const rect = element.getBoundingClientRect();
      let { left, top, right, bottom } = rect;
      // A transparent, absolutely positioned ::after widens the tap area without moving pixels.
      const after = getComputedStyle(element, "::after");
      if (after.content !== "none" && after.position === "absolute") {
        const px = (value: string) => (value.endsWith("px") ? parseFloat(value) : 0);
        left = Math.min(left, rect.left + px(after.left));
        top = Math.min(top, rect.top + px(after.top));
        right = Math.max(right, rect.right - px(after.right));
        bottom = Math.max(bottom, rect.bottom - px(after.bottom));
      }
      const hits = (x: number, y: number) => {
        const hit = document.elementFromPoint(x, y);
        return Boolean(hit && (hit === element || element.contains(hit)));
      };
      const cx = (left + right) / 2;
      const cy = (top + bottom) / 2;
      const receivesTaps = [
        [cx, cy],
        [left + 1, cy],
        [right - 1, cy],
        [cx, top + 1],
        [cx, bottom - 1],
      ].every(([x, y]) => hits(x, y));
      const label = (element.getAttribute("aria-label") ?? element.innerText).split("\n")[0];
      return {
        label: label.trim(),
        group,
        box: { left, top: top + window.scrollY, right, bottom: bottom + window.scrollY },
        receivesTaps,
      };
    });
  });

const check = (areas: Area[]) => {
  expect(areas.length).toBeGreaterThan(0);
  for (const area of areas) {
    const width = area.box.right - area.box.left;
    const height = area.box.bottom - area.box.top;
    const min = area.group === "book" ? BOOK_CALL_MIN : MIN;
    const name = `${area.group} "${area.label}" ${width.toFixed(1)}x${height.toFixed(1)}`;
    expect(width, name).toBeGreaterThanOrEqual(MIN);
    expect(height, name).toBeGreaterThanOrEqual(min - 0.5);
    expect(area.receivesTaps, `${name} receives taps across its box`).toBe(true);
  }
  // Rounding can make neighbours share a sub-pixel edge; anything more is an overlap.
  const overlaps: string[] = [];
  areas.forEach((a, i) =>
    areas.slice(i + 1).forEach((b) => {
      const x = Math.min(a.box.right, b.box.right) - Math.max(a.box.left, b.box.left);
      const y = Math.min(a.box.bottom, b.box.bottom) - Math.max(a.box.top, b.box.top);
      if (x > 0.5 && y > 0.5)
        overlaps.push(`${a.label} / ${b.label}: ${x.toFixed(1)}x${y.toFixed(1)}`);
    })
  );
  expect(overlaps).toEqual([]);
};

for (const width of WIDTHS) {
  test.describe(`shell tap areas at ${width}px`, () => {
    test.use({ viewport: { width, height: 800 }, hasTouch: true, isMobile: width < 768 });

    test("are large enough and do not overlap", async ({ page }) => {
      await page.goto("/");
      await settle(page);
      check(await tapAreas(page));
    });

    if (width <= 520) {
      test("stay large enough with the menu open", async ({ page }) => {
        await page.goto("/");
        await settle(page);
        await page.getByRole("button", { name: "Open menu" }).tap();
        await expect(page.locator("#site-menu")).toBeVisible();
        const areas = await tapAreas(page);
        expect(areas.filter((area) => area.group === "menu link")).toHaveLength(5);
        check(areas);
      });

      test.describe("without scripting", () => {
        test.use({ javaScriptEnabled: false });

        test("keep the wrapped link rows large enough and apart", async ({ page }) => {
          await page.goto("/");
          await page.waitForLoadState("networkidle");
          const areas = await tapAreas(page);
          expect(areas.filter((area) => area.group === "link")).toHaveLength(5);
          check(areas);
        });
      });
    }
  });
}
