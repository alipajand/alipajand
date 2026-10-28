import fs from "node:fs";
import path from "node:path";

import type { Page } from "@playwright/test";

/*
 * Optional evidence output for the responsive gate. Set RESPONSIVE_EVIDENCE=<dir> to write
 * per-check JSON, top-of-page JPEG captures and scroll videos; e2e/responsive-sheet.mjs turns them
 * into contact sheets. Without the variable the checks run exactly the same and write nothing.
 */
export const EVIDENCE_DIR = process.env.RESPONSIVE_EVIDENCE;

export const record = (name: string, data: unknown): void => {
  if (!EVIDENCE_DIR) return;
  const dir = path.join(EVIDENCE_DIR, "data");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify(data, null, 2));
};

export const capture = async (page: Page, name: string): Promise<void> => {
  if (!EVIDENCE_DIR) return;
  const dir = path.join(EVIDENCE_DIR, "shots");
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${name}.jpg`), type: "jpeg", quality: 70 });
};

export const videoDir = (): string | undefined =>
  EVIDENCE_DIR ? path.join(EVIDENCE_DIR, "videos") : undefined;

export const stubVercelScripts = (page: Page) =>
  page.route("**/_vercel/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/javascript", body: "" })
  );
