/** @jest-environment node */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..", "..");

const sha256 = (data: Buffer) => createHash("sha256").update(data).digest("hex");

const EXPOSED_IMAGES: Array<[label: string, hash: string]> = [
  [
    "docs/design/implementation-audit/captures/case-ledgerguard-1440-prod-nojs.jpg (rendered before the LedgerGuard fix in 801b81f)",
    "0bb1c29b8822cd447de897240b2ee72e535ea0075cf7435872452090a6b19f6e",
  ],
  [
    "docs/design/implementation-audit/captures/case-ledgerguard-1440.jpg (rendered before the LedgerGuard fix in 801b81f)",
    "79c4eec733e16979219f0aa01ed8a36dfc5ea42183812e619ce4a0f661a9f79e",
  ],
  [
    "docs/design/implementation-audit/captures/case-ledgerguard-390.jpg (rendered before the LedgerGuard fix in 801b81f)",
    "8a0518db896d4270358a5420c1e54ac0c86f349b3ab163421d968e95a032ad4c",
  ],
  [
    "docs/design/implementation-audit/captures/case-mapbylaw-1440.jpg (rendered before the LedgerGuard fix in 801b81f)",
    "429c06db9d64a0fffcd92c05e99d6f35228a6f5edc44c65b8aad944ede2ea732",
  ],
  [
    "docs/design/implementation-audit/captures/case-mapbylaw-390.jpg (rendered before the LedgerGuard fix in 801b81f)",
    "2bb89c4c8d44bfffd45242cb2c990a7eb1aa3697a7e80bec4013b73c0acbf542",
  ],
  [
    "docs/design/implementation/case-studies/ledgerguard-1440-actual.jpg (rendered before the LedgerGuard fix in 801b81f)",
    "b332af906fd3eb11ebf5111c8537e9af5cda9ab9b41c8f4d53a39550a401e9bf",
  ],
  [
    "docs/design/implementation/case-studies/ledgerguard-1440-fold-ref-actual-diff.png (rendered before the LedgerGuard fix in 801b81f)",
    "517039c71e7d15d62104ac8189e69d16a139df3ce4175b075561a5a539cd0861",
  ],
  [
    "docs/design/implementation/case-studies/ledgerguard-1440-reference.jpg (rendered before the LedgerGuard fix in 801b81f)",
    "99f0f28be0ad07d123ec32f753370aa7b317c02f38f9b3d2a11111b7625528f5",
  ],
  [
    "docs/design/implementation/case-studies/ledgerguard-390-actual.jpg (rendered before the LedgerGuard fix in 801b81f)",
    "bf611b818aca607590fda6e8cf5d4f4e766061d6ad5b5ce72a3b5aa66f6359c4",
  ],
  [
    "docs/design/implementation/case-studies/ledgerguard-390-fold-ref-actual-diff.png (rendered before the LedgerGuard fix in 801b81f)",
    "84e940cf7327356201cb1b724ca8e3cc4420a2f5e99ff7bdba871fb480e66604",
  ],
  [
    "docs/design/implementation/case-studies/ledgerguard-390-reference.jpg (rendered before the LedgerGuard fix in 801b81f)",
    "e78e982510231dfe3233d2213306d471831614a2b30b082ba404fcc9dba34871",
  ],
  [
    "docs/design/implementation/case-studies/mapbylaw-1440-actual.jpg (rendered before the LedgerGuard fix in 801b81f)",
    "0af2c26d5ead1e288f976733ee73d2a419b89e199efc8ac107647e3150a1d51c",
  ],
  [
    "docs/design/implementation/case-studies/mapbylaw-1440-fold-ref-actual-diff.png (rendered before the LedgerGuard fix in 801b81f)",
    "3ff21825bf3f26ade1831992bb5fbdab0b41363516da6c1369b555a0f1ce9dc6",
  ],
  [
    "docs/design/implementation/case-studies/mapbylaw-1440-reference.jpg (before redaction)",
    "752b6cc6508aefe748579470efee120e6b6fbad6c7af3703aaf6ee4d188e019d",
  ],
  [
    "docs/design/implementation/case-studies/mapbylaw-390-actual.jpg (rendered before the LedgerGuard fix in 801b81f)",
    "74ed50d4887c6b5288cf740d4024eb084dea4b33e78bdc629808a7fb67775c3e",
  ],
  [
    "docs/design/implementation/case-studies/mapbylaw-390-fold-ref-actual-diff.png (rendered before the LedgerGuard fix in 801b81f)",
    "1b2d323cb01066080da9b5b2dfdc4726dd643103940fe437cdf0b6dee1b08d08",
  ],
  [
    "docs/design/implementation/case-studies/mapbylaw-390-reference.jpg (before redaction)",
    "b97e4752e02ca3e64855e95b00c927259b41b83340ec2d7e6f446cfbcf2c8557",
  ],
  [
    "docs/design/kit/img/ledgerguard-dashboard.jpg (first version)",
    "7b3162fd22fddd075906ff90b0f2324992cc63f9e65c9d25589d4dbb78b382a9",
  ],
  [
    "docs/design/kit/img/mapbylaw-dashboard.jpg (before regeneration)",
    "e1fe16c1abe4da3e9d6045c455c91cbaa4b526a8ef8d264845fe2aa3a919b74f",
  ],
  [
    "docs/design/kit/img/tallyfolio-dashboard.jpg (unverified financial figures)",
    "88d6016113ac7134c14f472536799c19f078f0a9ae598481bd18cfda5288a25a",
  ],
  [
    "e2e/__screenshots__/case-studies.e2e.ts/ledgerguard-1440x900-darwin.png (rendered before the LedgerGuard fix in 801b81f)",
    "0974efe15b604b84f2a90f83b16b450b7cd22ae6027c621472dd497bf59ef2f6",
  ],
  [
    "e2e/__screenshots__/case-studies.e2e.ts/ledgerguard-390x844-darwin.png (rendered before the LedgerGuard fix in 801b81f)",
    "cb48f7e09e383468e72e93f25363d13e2a3ca6140e35e2993771acecf4364239",
  ],
  [
    "e2e/__screenshots__/case-studies.e2e.ts/mapbylaw-1440x900-darwin.png (rendered before the LedgerGuard fix in 801b81f)",
    "650d9d5f23e390f8f143325956c8e2ce549524718babd4c3640cd85f0c125590",
  ],
  [
    "e2e/__screenshots__/case-studies.e2e.ts/mapbylaw-390x844-darwin.png (rendered before the LedgerGuard fix in 801b81f)",
    "11e779c8d24d3fec02755182439513ffa099b7fb656c0fedd22ff375da6cac49",
  ],
  [
    "e2e/__screenshots__/case-studies.e2e.ts/tallyfolio-1440x900-darwin.png (rendered with the unverified TallyFolio dashboard)",
    "8b26359ec01f3721b0e57a4a58d9c4d261a4c2fde2d63f8ad4cfcc5d254270d4",
  ],
  [
    "e2e/__screenshots__/case-studies.e2e.ts/tallyfolio-1440x900-linux.png (rendered with the unverified TallyFolio dashboard)",
    "f5ca7c577f8fff9647545e749adde3988638cab3a790b1b47a703b43b1a69f1e",
  ],
  [
    "e2e/__screenshots__/case-studies.e2e.ts/tallyfolio-390x844-darwin.png (rendered with the unverified TallyFolio dashboard)",
    "9777c73f07d0be1b84959abf7013b66dd162d9ac075b2ebc5c0692258faebac3",
  ],
  [
    "e2e/__screenshots__/case-studies.e2e.ts/tallyfolio-390x844-linux.png (rendered with the unverified TallyFolio dashboard)",
    "b27206eb9473ba81852ddc6470f3397b8bfab34562282a1b9081218a240697ae",
  ],
  [
    "portfolio-redesign artifacts/shared/media/ledgerguard-dashboard-1280.webp (unmerged branch)",
    "b9911c9772c1342fe63fe939a15357ad12bb0763a9bf7a163a4ba5058f02a391",
  ],
  [
    "portfolio-redesign artifacts/shared/media/ledgerguard-dashboard-640.webp (unmerged branch)",
    "a3e9efd19714f090c2aaace16f33ad2226332b3c0f5a09e890f4444fb82cc601",
  ],
  [
    "portfolio-redesign artifacts/shared/media/mapbylaw-dashboard-1280.webp (unmerged branch)",
    "facfaacd68e99b5155b5b36e08f7dc40e0c9f66de3b1bdff33eea7d6d092952a",
  ],
  [
    "portfolio-redesign artifacts/shared/media/mapbylaw-dashboard-640.webp (unmerged branch)",
    "d02f1a4d2838f2b94a5e1c548db5e02bb0b8bcf9899de5dcbc28c7c3f91837eb",
  ],
  [
    "portfolio-redesign artifacts/shared/media/tallyfolio-dashboard-1280.webp (unmerged branch)",
    "6690967f127fd49c65743e6725f02152d5fb1c03b0bcc30fc5d4908c653b3d0e",
  ],
  [
    "portfolio-redesign artifacts/shared/media/tallyfolio-dashboard-640.webp (unmerged branch)",
    "714c9282ab353d6094fb1ca880d2a78a614ed63c7bc547c585ce916e5fadb86a",
  ],
  [
    "portfolio-redesign cinematic-exploration/prototype/media/ledgerguard-dashboard-1600.webp (unmerged branch)",
    "0ef5e23d3b79b00e635a5213a9f1868c8166baa1517644858fc0799a44c7afd2",
  ],
  [
    "portfolio-redesign cinematic-exploration/prototype/media/ledgerguard-dashboard-960.webp (unmerged branch)",
    "05425f70df9898ce69f45d27eee7b19c846fc91bb364f9a70a761c6d9a705fbe",
  ],
  [
    "public/portfolio-media/ledgerguard-dashboard-redacted.png (first redaction: account row blurred, workspace name left in)",
    "c9403f5776038258cf0e5643ecbfbcb9c9e7a52557139a5effa8b6302c5dbae4",
  ],
  [
    "public/portfolio-media/ledgerguard-dashboard.png (original capture)",
    "65be11b440343f312bf079a2df0d1dba2a80229e43bd69e885ea22ca54adaf37",
  ],
  [
    "public/portfolio-media/mapbylaw-dashboard.png (original capture)",
    "36794cbb9bf88a34451475dbef65786b4aa36f11fc729177f1eda3a5059458c5",
  ],
  [
    "public/portfolio-media/tallyfolio-dashboard.png (unverified financial figures)",
    "029eb80ac8d8b375d080300586046eebb7cd138804374fb06c73911ef385aa34",
  ],
];

const IMAGE_FILE = /\.(png|jpe?g|webp|avif|gif|bmp|ico|tiff?)$/i;
const TEXT_FILE = /\.(html?|md|mdx|css|js|mjs|cjs|ts|tsx|json|svg|txt|xml|ya?ml)$/i;
const DATA_URI = /data:image\/[a-z0-9.+-]+;base64,([A-Za-z0-9+/=\s]+)/gi;

const trackedFiles = (): string[] =>
  execFileSync("git", ["ls-files", "-z"], { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 })
    .toString("utf-8")
    .split("\0")
    .filter(Boolean);

const payloads = (files: string[]): Array<{ where: string; hash: string }> =>
  files.flatMap((path) => {
    const data = readFileSync(join(ROOT, path));
    const own = { where: path, hash: sha256(data) };
    if (!TEXT_FILE.test(path)) return [own];
    const embedded = [...data.toString("utf-8").matchAll(DATA_URI)].map((match, index) => ({
      where: `${path} (data URI #${index})`,
      hash: sha256(Buffer.from(match[1].replace(/\s/g, ""), "base64")),
    }));
    return [own, ...embedded];
  });

describe("tracked images", () => {
  const files = trackedFiles();

  it("lists the tracked images, visual baselines included", () => {
    const images = files.filter((path) => IMAGE_FILE.test(path));
    expect(images.some((path) => path.startsWith("public/portfolio-media/"))).toBe(true);
    expect(images.some((path) => path.startsWith("e2e/__screenshots__/"))).toBe(true);
    expect(images.some((path) => path.startsWith("docs/design/"))).toBe(true);
  });

  it("has no duplicate entries in the exposed list", () => {
    const hashes = EXPOSED_IMAGES.map(([, hash]) => hash);
    expect(new Set(hashes).size).toBe(hashes.length);
    for (const hash of hashes) expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("contains none of the exposed images, as files or data URIs, under any path", () => {
    const exposed = new Map(EXPOSED_IMAGES.map(([label, hash]) => [hash, label]));
    const leaks = payloads(files)
      .filter(({ hash }) => exposed.has(hash))
      .map(({ where, hash }) => `${where} matches ${exposed.get(hash)}`);
    expect(leaks).toEqual([]);
  });
});
