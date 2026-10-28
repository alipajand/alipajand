/** @jest-environment node */

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

/**
 * Guards for the screenshots shipped in `public/portfolio-media` and the design artifacts in
 * `docs/design`. The production dashboards were redacted before release, and the design kit
 * copies were regenerated from the redacted files. These tests stop an unredacted copy, or a
 * file derived byte-for-byte from one, from coming back by accident.
 */

const ROOT = join(__dirname, "..", "..");
const DESIGN = join(ROOT, "docs", "design");
const MEDIA = join(ROOT, "public", "portfolio-media");

const sha256 = (data: Buffer) => createHash("sha256").update(data).digest("hex");

const filesUnder = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });

/** SHA-256 of every file in `public/portfolio-media`, as approved on `main`. */
const PORTFOLIO_MEDIA: Record<string, string> = {
  "alwaysgeeky-login.png": "edd769a8da1d188a0a5efd17ca33c0a7cb554542e3b9d830dbc68dca8ce99b73",
  "alwaysgeeky-marketplace.png": "00e2baf7cb8ef834da027574d846f1c5c65e0d3e8c1bdb1e533b44994865d72a",
  "data-flow.png": "f0472dbd3a2ffaa1e9f8bddff0fe4e70dddead3a3a45cac94b24fca197e1cc5b",
  "ledgerguard-dashboard-redacted.png":
    "c0572aa58601911756983eafaebdd78d469c2c0fdd90847dcb4eebbddd75b5a1",
  "ledgerguard-landing.png": "56042712819f7af82044f49ac9171b4019edab55809ffe30f7ae3d3771d03cbe",
  "ledgerguard-login.png": "ff914f968f6b29482c1a3b9673c1d6a069825346e3339d8018bcc4f398cfe01f",
  "mapbylaw-dashboard-redacted.png":
    "f9bf7369181f20dc5b91e796535e245bba3592155d487e48c7bcd2ca227c3d8b",
  "mapbylaw-landing.png": "5744c1fb0e6c8e8152d455a6f7b53d07fbeb38325789b691788233fed899bb37",
  "tallyfolio-dashboard.png": "029eb80ac8d8b375d080300586046eebb7cd138804374fb06c73911ef385aa34",
  "tallyfolio-landing.png": "a5f69787ab75d7e866ee5fd5fe53bf3423c27f0641ea7906758f7f679e723003",
};

/**
 * SHA-256 of images that show the owner's login identity in a dashboard account row. They are
 * still in git history (see docs/decisions/open.md); none may return to the tree.
 */
const UNREDACTED_IMAGES: Record<string, string> = {
  "public/portfolio-media/mapbylaw-dashboard.png (original capture)":
    "36794cbb9bf88a34451475dbef65786b4aa36f11fc729177f1eda3a5059458c5",
  "public/portfolio-media/ledgerguard-dashboard.png (original capture)":
    "65be11b440343f312bf079a2df0d1dba2a80229e43bd69e885ea22ca54adaf37",
  "docs/design/kit/img/mapbylaw-dashboard.jpg (before regeneration)":
    "e1fe16c1abe4da3e9d6045c455c91cbaa4b526a8ef8d264845fe2aa3a919b74f",
  "docs/design/kit/img/ledgerguard-dashboard.jpg (first version)":
    "7b3162fd22fddd075906ff90b0f2324992cc63f9e65c9d25589d4dbb78b382a9",
  "docs/design/implementation/case-studies/mapbylaw-1440-reference.jpg (before redaction)":
    "752b6cc6508aefe748579470efee120e6b6fbad6c7af3703aaf6ee4d188e019d",
  "docs/design/implementation/case-studies/mapbylaw-390-reference.jpg (before redaction)":
    "b97e4752e02ca3e64855e95b00c927259b41b83340ec2d7e6f446cfbcf2c8557",
  "portfolio-redesign artifacts/shared/media/ledgerguard-dashboard-1280.webp (unmerged branch)":
    "b9911c9772c1342fe63fe939a15357ad12bb0763a9bf7a163a4ba5058f02a391",
  "portfolio-redesign artifacts/shared/media/ledgerguard-dashboard-640.webp (unmerged branch)":
    "a3e9efd19714f090c2aaace16f33ad2226332b3c0f5a09e890f4444fb82cc601",
  "portfolio-redesign artifacts/shared/media/mapbylaw-dashboard-1280.webp (unmerged branch)":
    "facfaacd68e99b5155b5b36e08f7dc40e0c9f66de3b1bdff33eea7d6d092952a",
  "portfolio-redesign artifacts/shared/media/mapbylaw-dashboard-640.webp (unmerged branch)":
    "d02f1a4d2838f2b94a5e1c548db5e02bb0b8bcf9899de5dcbc28c7c3f91837eb",
  "portfolio-redesign cinematic-exploration/prototype/media/ledgerguard-dashboard-1600.webp (unmerged branch)":
    "0ef5e23d3b79b00e635a5213a9f1868c8166baa1517644858fc0799a44c7afd2",
  "portfolio-redesign cinematic-exploration/prototype/media/ledgerguard-dashboard-960.webp (unmerged branch)":
    "05425f70df9898ce69f45d27eee7b19c846fc91bb364f9a70a761c6d9a705fbe",
};

const DATA_URI = /data:image\/[a-z0-9.+-]+;base64,([A-Za-z0-9+/=\s]+)/gi;
const TEXT_FILE = /\.(html?|md|css|js|mjs|json|svg)$/i;

/** Every file under docs/design, plus every base64 image embedded in a text file there. */
const designPayloads = (): Array<{ where: string; hash: string }> =>
  filesUnder(DESIGN).flatMap((path) => {
    const where = relative(ROOT, path);
    const data = readFileSync(path);
    const own = { where, hash: sha256(data) };
    if (!TEXT_FILE.test(path)) return [own];
    const embedded = [...data.toString("utf-8").matchAll(DATA_URI)].map((match, index) => ({
      where: `${where} (data URI #${index})`,
      hash: sha256(Buffer.from(match[1].replace(/\s/g, ""), "base64")),
    }));
    return [own, ...embedded];
  });

describe("public/portfolio-media", () => {
  it("holds exactly the approved files, byte for byte", () => {
    const actual = Object.fromEntries(
      readdirSync(MEDIA)
        .filter((name) => statSync(join(MEDIA, name)).isFile())
        .sort()
        .map((name) => [name, sha256(readFileSync(join(MEDIA, name)))])
    );
    expect(actual).toEqual(PORTFOLIO_MEDIA);
  });
});

describe("docs/design assets", () => {
  it("contains none of the known unredacted dashboard images, as files or data URIs", () => {
    const known = new Map(Object.entries(UNREDACTED_IMAGES).map(([label, hash]) => [hash, label]));
    const payloads = designPayloads();
    expect(payloads.some((p) => p.where.includes("data URI"))).toBe(true);
    const leaks = payloads
      .filter(({ hash }) => known.has(hash))
      .map(({ where, hash }) => `${where} matches ${known.get(hash)}`);
    expect(leaks).toEqual([]);
  });

  it("embeds the same bytes in the case pages as the kit images they come from", () => {
    const kitImages = new Map(
      readdirSync(join(DESIGN, "kit", "img")).map((name) => [
        sha256(readFileSync(join(DESIGN, "kit", "img", name))),
        name,
      ])
    );
    const page = readFileSync(join(DESIGN, "pages", "case-mapbylaw.html"), "utf-8");
    const embedded = [...page.matchAll(DATA_URI)].map((match) =>
      sha256(Buffer.from(match[1].replace(/\s/g, ""), "base64"))
    );
    expect(embedded.map((hash) => kitImages.get(hash))).toEqual([
      "mapbylaw-landing.jpg",
      "mapbylaw-dashboard.jpg",
    ]);
  });
});

describe("docs/design pages", () => {
  const PAGES = join(DESIGN, "pages");
  const ATTRIBUTE = /\b(?:src|href)\s*=\s*(["'])(.*?)\1/gi;
  /** External, in-page, generated (template or build placeholder) and inline references. */
  const NOT_A_FILE = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\$\{|@@)|\$\{/i;

  const pages = readdirSync(PAGES)
    .filter((name) => name.endsWith(".html"))
    .sort();

  it("finds the design pages", () => {
    expect(pages.length).toBeGreaterThanOrEqual(16);
  });

  it.each(pages)("%s only links to local files that exist", (name) => {
    const html = readFileSync(join(PAGES, name), "utf-8");
    const missing = [...html.matchAll(ATTRIBUTE)]
      .map((match) => match[2].trim())
      .filter((value) => value !== "" && !NOT_A_FILE.test(value))
      .map((value) => value.split(/[?#]/)[0])
      .filter((value) => {
        // A root-relative path only works where the site's public/ folder is served.
        const target = value.startsWith("/")
          ? join(ROOT, "public", decodeURI(value))
          : resolve(dirname(join(PAGES, name)), decodeURI(value));
        return !existsSync(target);
      });
    expect(missing).toEqual([]);
  });
});
