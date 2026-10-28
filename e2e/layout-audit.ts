import type { Page } from "@playwright/test";

export interface ShellTarget {
  target: string;
  width: number;
  height: number;
  covered: boolean;
}

export interface LayoutReport {
  docOverflow: number;
  edgeOverflow: string[];
  clippedText: string[];
  displayWordClipped: string[];
  smallTargets: { target: string; width: number; height: number }[];
  shellTargets: ShellTarget[];
  images: { src: string; broken: boolean; crop: number; spills: boolean }[];
}

export const auditLayout = (page: Page): Promise<LayoutReport> =>
  page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const describe = (element: Element) => {
      const id = element.id ? `#${element.id}` : "";
      const cls =
        typeof element.className === "string" && element.className
          ? `.${element.className.trim().split(/\s+/)[0]}`
          : "";
      const text = (element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 32);
      return `${element.tagName.toLowerCase()}${id}${cls}${text ? ` "${text}"` : ""}`;
    };
    const isVisible = (element: Element) => {
      const style = getComputedStyle(element);
      if (style.visibility === "hidden" || style.display === "none") return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 1 && rect.height > 1;
    };
    const clips = (element: Element) => {
      const style = getComputedStyle(element);
      return /(hidden|clip|auto|scroll)/.test(style.overflowX);
    };
    const insideClipper = (element: Element) => {
      for (let node = element.parentElement; node; node = node.parentElement) {
        if (node === document.body || node === document.documentElement) return false;
        if (clips(node)) return true;
      }
      return false;
    };

    const all = Array.from(document.body.querySelectorAll("*"));

    const edgeOverflow = all
      .filter((element) => {
        if (!isVisible(element) || insideClipper(element)) return false;
        const rect = element.getBoundingClientRect();
        return rect.right > vw + 1 || rect.left < -1;
      })
      .map(describe);

    // Text cut off inside a box that hides overflow. Tickers and the display line clip on purpose.
    const clippedText = all
      .filter((element) => {
        if (!isVisible(element) || !clips(element)) return false;
        // Tickers, the display line and decorative rules clip on purpose.
        if (element.closest("[class*='ticker'], [class*='display'], [aria-hidden='true']")) {
          return false;
        }
        const hasText = Array.from(element.childNodes).some(
          (child) => child.nodeType === Node.TEXT_NODE && child.textContent?.trim()
        );
        return hasText && element.scrollWidth > element.clientWidth + 1;
      })
      .map(describe);

    const displayWordClipped: string[] = [];
    for (const word of Array.from(document.querySelectorAll<HTMLElement>("[data-word]"))) {
      const box = word.parentElement!.getBoundingClientRect();
      const rect = word.getBoundingClientRect();
      if (rect.left < box.left - 1 || rect.right > box.right + 1)
        displayWordClipped.push(describe(word));
    }

    const interactive = all.filter(
      (element) =>
        element.matches(
          "a[href], button, input:not([type='hidden']), select, textarea, summary, [role='button'], [tabindex]:not([tabindex='-1'])"
        ) &&
        isVisible(element) &&
        !element.closest("[aria-hidden='true']")
    );
    const rects = interactive.map((element) => element.getBoundingClientRect());
    const isInline = (element: Element) => {
      if (getComputedStyle(element).display !== "inline") return false;
      const parent = element.parentElement;
      if (!parent) return false;
      return Array.from(parent.childNodes).some(
        (child) =>
          child !== element && child.nodeType === Node.TEXT_NODE && child.textContent?.trim()
      );
    };
    const smallTargets: LayoutReport["smallTargets"] = [];
    interactive.forEach((element, index) => {
      const rect = rects[index];
      if ((rect.width >= 24 && rect.height >= 24) || isInline(element)) return;
      // WCAG 2.5.8 spacing exception: a 24px circle on the target's centre touches no other target.
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const crowded = rects.some((other, otherIndex) => {
        if (otherIndex === index) return false;
        const nx = Math.max(other.left, Math.min(cx, other.right));
        const ny = Math.max(other.top, Math.min(cy, other.bottom));
        return Math.hypot(cx - nx, cy - ny) < 12;
      });
      if (crowded) {
        smallTargets.push({
          target: describe(element),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    });

    // The shell's hit areas, probed with elementFromPoint so pseudo-element tap padding counts.
    const hitSize = (element: Element) => {
      element.scrollIntoView({ block: "center", inline: "nearest" });
      const rect = element.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const hits = (x: number, y: number) => {
        const hit = document.elementFromPoint(x, y);
        return Boolean(hit && (hit === element || element.contains(hit)));
      };
      const reach = (dx: number, dy: number) => {
        let step = 0;
        while (step < 60 && hits(cx + dx * (step + 1), cy + dy * (step + 1))) step += 1;
        return step;
      };
      return {
        width: reach(-1, 0) + reach(1, 0) + 1,
        height: reach(0, -1) + reach(0, 1) + 1,
        covered: !hits(cx, cy),
      };
    };
    const shellTargets = interactive
      .filter((element) =>
        element.closest(
          "header:has(> nav[aria-label='Primary']), footer[aria-label]:not(main footer)"
        )
      )
      .map((element) => ({ target: describe(element), ...hitSize(element) }));
    window.scrollTo(0, 0);

    const images = Array.from(document.images)
      .filter((image) => isVisible(image))
      .map((image) => {
        const rect = image.getBoundingClientRect();
        const style = getComputedStyle(image);
        let crop = 0;
        if (style.objectFit === "cover" && image.naturalWidth && image.naturalHeight) {
          const natural = image.naturalWidth / image.naturalHeight;
          const box = rect.width / rect.height;
          crop = 1 - Math.min(natural / box, box / natural);
        }
        const parent = image.parentElement!.getBoundingClientRect();
        return {
          src: (image.currentSrc || image.src).replace(location.origin, "").slice(0, 80),
          broken: image.complete && image.naturalWidth === 0,
          crop: Number(crop.toFixed(3)),
          spills: rect.right > parent.right + 1 || rect.left < parent.left - 1,
        };
      });

    return {
      docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      edgeOverflow: edgeOverflow.slice(0, 12),
      clippedText: clippedText.slice(0, 12),
      displayWordClipped,
      smallTargets,
      shellTargets,
      images,
    };
  });
