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
import { settle } from "./support";

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

const ROUTES = [
  "/",
  "/portfolio",
  "/portfolio/ledgerguard",
  "/writing",
  "/writing/agent-readiness-doctor",
  "/writing/agent-instructions-are-code",
  "/writing/how-i-would-build-a-real-time-backgammon-platform",
  "/open-source",
  "/engineering-principles",
  "/now",
  "/this-page-does-not-exist",
];

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
];

const PER_KIND = 2;

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

const frames = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      )
  );

interface Candidate {
  target: string;
  reason: string;
}

const candidates = async (page: Page): Promise<Candidate[]> => {
  const results = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
  const review = (results.incomplete[0]?.nodes ?? []).map((node) => ({
    target: node.target.join(" "),
    reason: String(
      (node.any[0]?.data as { messageKey?: string } | undefined)?.messageKey ?? "unknown"
    ),
  }));
  return page.evaluate(
    ({ review, perKind }) => {
      const picked: Candidate[] = [];
      const seen = new Map<string, number>();
      const add = (element: Element, reason: string) => {
        if (element.hasAttribute("data-px")) return;
        const kind = `${reason}|${element.classList[0] ?? element.tagName}`;
        const count = seen.get(kind) ?? 0;
        if (count >= perKind) return;
        seen.set(kind, count + 1);
        const index = String(picked.length);
        element.setAttribute("data-px", index);
        picked.push({ target: `[data-px="${index}"]`, reason });
      };
      for (const node of review) {
        const element = document.querySelector(node.target);
        if (element) add(element, node.reason);
      }
      const canvases = Array.from(document.querySelectorAll("canvas")).filter(
        (canvas) => canvas.getClientRects().length > 0
      );
      for (const canvas of canvases) {
        const area = canvas.getBoundingClientRect();
        for (const element of Array.from(document.querySelectorAll("body *"))) {
          const ownText = Array.from(element.childNodes).some(
            (child) => child.nodeType === Node.TEXT_NODE && child.textContent?.trim()
          );
          if (!ownText || element.closest("script, style, noscript")) continue;
          const box = element.getBoundingClientRect();
          const overlaps =
            box.width > 0 &&
            box.left < area.right &&
            box.right > area.left &&
            box.top < area.bottom &&
            box.bottom > area.top;
          if (
            overlaps &&
            canvas.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING
          )
            add(element, "canvas");
        }
      }
      return picked;
    },
    { review, perKind: PER_KIND }
  );
};

interface Measured {
  target: string;
  reason: string;
  text: string;
  ratio: number | null;
  threshold: number;
  glyphPixels: number;
}

const measure = async (page: Page, candidate: Candidate): Promise<Measured | null> => {
  await page.locator(candidate.target).evaluate((element) => {
    element.scrollIntoView({ block: "center", inline: "nearest" });
  });
  await frames(page);
  await finishTransitions(page);
  const info = await page.locator(candidate.target).evaluate((element) => {
    const rects: DOMRect[] = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.parentElement !== element || !node.textContent?.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      rects.push(...Array.from(range.getClientRects()));
    }
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    let [left, top, right, bottom] = [Infinity, Infinity, -Infinity, -Infinity];
    for (const rect of rects) {
      if (!rect.width || !rect.height) continue;
      left = Math.min(left, rect.left);
      top = Math.min(top, rect.top);
      right = Math.max(right, rect.right);
      bottom = Math.max(bottom, rect.bottom);
    }
    left = Math.max(0, Math.floor(left));
    top = Math.max(0, Math.floor(top));
    right = Math.min(vw, Math.ceil(right));
    bottom = Math.min(vh, Math.ceil(bottom));
    const style = getComputedStyle(element);
    const parse = (value: string) => (value.match(/[\d.]+/g) ?? ["0", "0", "0", "0"]).map(Number);
    let colour = parse(element instanceof SVGElement ? style.fill : style.color);
    if ((colour[3] ?? 1) === 0 && parseFloat(style.webkitTextStrokeWidth) > 0) {
      colour = parse(style.webkitTextStrokeColor);
    }
    let opacity = 1;
    for (let node: Element | null = element; node; node = node.parentElement) {
      opacity *= Number(getComputedStyle(node).opacity);
    }
    const size = parseFloat(style.fontSize);
    return {
      clip: { x: left, y: top, width: right - left, height: bottom - top },
      colour: [colour[0], colour[1], colour[2], (colour[3] ?? 1) * opacity],
      large: size >= 24 || (Number(style.fontWeight) >= 700 && size >= 18.66),
      text: (element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 50),
    };
  });
  if (info.clip.width < 2 || info.clip.height < 2) return null;
  const withText = await page.screenshot({ clip: info.clip });
  await page.locator(candidate.target).evaluate((element) => {
    element.setAttribute("data-px-hide", "");
    const style = document.createElement("style");
    style.id = "px-hide";
    style.textContent = `[data-px-hide] { color: transparent !important;
      -webkit-text-fill-color: transparent !important; -webkit-text-stroke-color: transparent !important;
      text-shadow: none !important; fill: transparent !important; stroke: transparent !important;
      text-decoration-color: transparent !important; }`;
    document.head.append(style);
  });
  await frames(page);
  const backdrop = await page.screenshot({ clip: info.clip });
  await page.locator(candidate.target).evaluate((element) => {
    element.removeAttribute("data-px-hide");
    document.getElementById("px-hide")?.remove();
  });
  const threshold = info.large ? 3 : 4.5;
  const result = await page.evaluate(
    async ({ a, b, colour }) => {
      const pixels = async (base64: string) => {
        const blob = await (await fetch(`data:image/png;base64,${base64}`)).blob();
        const bitmap = await createImageBitmap(blob);
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const context = canvas.getContext("2d")!;
        context.drawImage(bitmap, 0, 0);
        return context.getImageData(0, 0, bitmap.width, bitmap.height);
      };
      const shown = await pixels(a);
      const behind = await pixels(b);
      const { width, height } = behind;
      const channel = (value: number) => {
        const v = value / 255;
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      const luminance = (r: number, g: number, bl: number) =>
        0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(bl);
      const glyph = new Uint8Array(width * height);
      for (let i = 0; i < width * height; i += 1) {
        const o = i * 4;
        const change =
          Math.abs(shown.data[o] - behind.data[o]) +
          Math.abs(shown.data[o + 1] - behind.data[o + 1]) +
          Math.abs(shown.data[o + 2] - behind.data[o + 2]);
        if (change > 40) glyph[i] = 1;
      }
      const ratios: number[] = [];
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          let near = false;
          for (let dy = -1; dy <= 1 && !near; dy += 1)
            for (let dx = -1; dx <= 1 && !near; dx += 1) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && ny >= 0 && nx < width && ny < height && glyph[ny * width + nx])
                near = true;
            }
          if (!near) continue;
          const o = (y * width + x) * 4;
          const [r, g, bl] = [behind.data[o], behind.data[o + 1], behind.data[o + 2]];
          const alpha = colour[3];
          const fg = luminance(
            colour[0] * alpha + r * (1 - alpha),
            colour[1] * alpha + g * (1 - alpha),
            colour[2] * alpha + bl * (1 - alpha)
          );
          const bg = luminance(r, g, bl);
          ratios.push((Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05));
        }
      }
      ratios.sort((x, y) => x - y);
      const p5 = ratios.length ? ratios[Math.floor(ratios.length * 0.05)] : null;
      return { ratio: p5 === null ? null : Math.round(p5 * 100) / 100, glyphPixels: ratios.length };
    },
    { a: withText.toString("base64"), b: backdrop.toString("base64"), colour: info.colour }
  );
  return { ...candidate, text: info.text, threshold, ...result };
};

for (const browserName of ["chromium", "webkit"] as const) {
  test.describe(`contrast from pixels in ${browserName}`, () => {
    for (const viewport of VIEWPORTS) {
      for (const path of ROUTES) {
        test(`text axe cannot judge on ${path} reaches AA at ${viewport.width}px`, async ({
          openPage,
        }) => {
          test.setTimeout(120_000);
          const page = await openPage(browserName, { viewport, deviceScaleFactor: 2 });
          await page.goto(path);
          await settle(page);
          await page.mouse.move(1, 1);
          await finishTransitions(page);
          const list = await candidates(page);
          const measured: Measured[] = [];
          for (const candidate of list) {
            const result = await measure(page, candidate);
            if (result) measured.push(result);
          }
          record(
            `contrast-pixels__${browserName}__${viewport.width}__${path.replace(/\//g, "_")}`,
            {
              path,
              browserName,
              viewport,
              measured,
            }
          );
          const below = measured
            .filter((entry) => entry.ratio !== null && entry.ratio < entry.threshold)
            .map(
              (entry) => `${entry.reason} "${entry.text}" ${entry.ratio}:1 < ${entry.threshold}:1`
            );
          expect(below).toEqual([]);
        });
      }
    }
  });
}
