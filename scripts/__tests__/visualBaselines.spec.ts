/**
 * @jest-environment node
 */
import { execFileSync } from "child_process";
import { readdirSync } from "fs";
import { join, relative, sep } from "path";

const ROOT = process.cwd();
const SCREENSHOTS = join(ROOT, "e2e", "__screenshots__");
const PLATFORMS = ["darwin", "linux"] as const;

interface ListedTest {
  annotations: { type: string; description?: string }[];
}
interface ListedSpec {
  title: string;
  file: string;
  tags: string[];
  tests: ListedTest[];
}
interface ListedSuite {
  specs?: ListedSpec[];
  suites?: ListedSuite[];
}

const listTests = (): ListedSpec[] => {
  const cli = require.resolve("@playwright/test/cli");
  const env: NodeJS.ProcessEnv = { ...process.env, CI: "" };
  delete env.JEST_WORKER_ID;
  let output: string;
  try {
    output = execFileSync(process.execPath, [cli, "test", "--list", "--reporter=json"], {
      cwd: ROOT,
      encoding: "utf8",
      env,
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (error) {
    output = String((error as { stdout?: string }).stdout ?? "");
  }
  const report = JSON.parse(output) as {
    suites: ListedSuite[];
    errors: { message?: string }[];
  };
  if (report.errors.length > 0) {
    throw new Error(`playwright test --list failed:\n${report.errors[0].message ?? ""}`);
  }
  const specs: ListedSpec[] = [];
  const walk = (suite: ListedSuite) => {
    suite.specs?.forEach((spec) => specs.push(spec));
    suite.suites?.forEach(walk);
  };
  report.suites.forEach(walk);
  return specs;
};

const filesUnder = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? filesUnder(join(dir, entry.name))
      : [relative(SCREENSHOTS, join(dir, entry.name)).split(sep).join("/")]
  );

describe("visual baseline inventory", () => {
  const specs = listTests();
  const visual = specs.filter((spec) => spec.tags.includes("visual"));
  const declared = specs.flatMap((spec) =>
    spec.tests.flatMap((test) =>
      test.annotations
        .filter((annotation) => annotation.type === "baseline")
        .map((annotation) => ({ spec, name: annotation.description ?? "" }))
    )
  );

  it("lists the screenshot tests", () => {
    expect(visual.length).toBeGreaterThan(0);
  });

  it("gives every @visual test exactly one baseline and no other test any", () => {
    const problems = specs.flatMap((spec) => {
      const count = spec.tests.flatMap((test) =>
        test.annotations.filter((annotation) => annotation.type === "baseline")
      ).length;
      const isVisual = spec.tags.includes("visual");
      if (isVisual && count !== spec.tests.length)
        return [`${spec.file} › ${spec.title}: @visual without exactly one baseline`];
      if (!isVisual && count > 0) return [`${spec.file} › ${spec.title}: baseline without @visual`];
      return [];
    });
    expect(problems).toEqual([]);
  });

  it("names each baseline once per spec file", () => {
    const keys = declared.map(({ spec, name }) => `${spec.file}/${name}`);
    expect(keys.filter((key, index) => keys.indexOf(key) !== index)).toEqual([]);
  });

  const expected = declared
    .flatMap(({ spec, name }) =>
      PLATFORMS.map((platform) => `${spec.file}/${name.replace(/\.png$/, "")}-${platform}.png`)
    )
    .sort();
  const present = filesUnder(SCREENSHOTS).sort();

  it("has a reviewed baseline for every route, viewport and platform", () => {
    expect(expected.filter((file) => !present.includes(file))).toEqual([]);
  });

  it("has no baseline that no test compares", () => {
    expect(present.filter((file) => !expected.includes(file))).toEqual([]);
  });
});
