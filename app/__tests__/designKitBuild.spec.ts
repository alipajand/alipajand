/** @jest-environment node */

import { existsSync, readFileSync, statSync } from "node:fs";
import { builtinModules } from "node:module";
import { dirname, join, resolve } from "node:path";

const ROOT = join(__dirname, "..", "..");
const BUILD = join(ROOT, "docs", "design", "kit", "build.mjs");

const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8"));
const DECLARED = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
]);
const PATHS: Record<string, string[]> = JSON.parse(
  readFileSync(join(ROOT, "tsconfig.json"), "utf-8")
).compilerOptions.paths;
const ALIASES = Object.entries(PATHS).map(([alias, [target]]) => [
  alias.replace(/\*$/, ""),
  join(ROOT, target.replace(/\*$/, "")),
]);

const IMPORT = /^\s*(?:import|export)\s+(type\s+)?[^"';]*?from\s+["']([^"']+)["']/gm;
const FROM_ROOT = /fromRoot\(\s*["']([^"']+)["']\s*\)/g;

const resolveFile = (base: string) =>
  [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts")].find(
    (path) => existsSync(path) && statSync(path).isFile()
  );

const packageName = (specifier: string) =>
  specifier
    .split("/")
    .slice(0, specifier.startsWith("@") ? 2 : 1)
    .join("/");

const relativeToRoot = (path: string) => path.slice(ROOT.length + 1);

const walkBuildImports = () => {
  const packages = new Map<string, string>();
  const unresolved: string[] = [];
  const seen = new Set<string>();
  const queue = [BUILD];
  for (const [, path] of readFileSync(BUILD, "utf-8").matchAll(FROM_ROOT)) {
    const file = resolveFile(join(ROOT, path));
    if (file) queue.push(file);
    else unresolved.push(`${path} (from docs/design/kit/build.mjs)`);
  }
  while (queue.length) {
    const file = queue.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const [, typeOnly, specifier] of readFileSync(file, "utf-8").matchAll(IMPORT)) {
      if (typeOnly) continue;
      const alias = ALIASES.find(([prefix]) => specifier.startsWith(prefix));
      if (specifier.startsWith(".") || alias) {
        const base = alias
          ? join(alias[1], specifier.slice(alias[0].length))
          : resolve(dirname(file), specifier);
        const target = resolveFile(base);
        if (target) queue.push(target);
        else unresolved.push(`${specifier} (from ${relativeToRoot(file)})`);
      } else if (!specifier.startsWith("node:") && !builtinModules.includes(specifier)) {
        packages.set(packageName(specifier), relativeToRoot(file));
      }
    }
  }
  return { packages, unresolved, files: seen.size };
};

describe("design kit build", () => {
  const { packages, unresolved, files } = walkBuildImports();

  it("follows the build's imports into the site data", () => {
    expect(files).toBeGreaterThan(5);
    expect(packages.has("marked")).toBe(true);
  });

  it("only imports packages that package.json declares", () => {
    const undeclared = [...packages]
      .filter(([name]) => !DECLARED.has(name))
      .map(([name, from]) => `${name} (from ${from})`);
    expect(undeclared).toEqual([]);
  });

  it("resolves every relative and tsconfig-path import to a file", () => {
    expect(unresolved).toEqual([]);
  });
});
