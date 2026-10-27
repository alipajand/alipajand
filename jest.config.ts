import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^data/(.*)$": "<rootDir>/data/$1",
    "^components/(.*)$": "<rootDir>/components/$1",
    "^features/(.*)$": "<rootDir>/features/$1",
    "^utils/(.*)$": "<rootDir>/utils/$1",
    "^lib/(.*)$": "<rootDir>/lib/$1",
  },
  collectCoverageFrom: ["!**/node_modules/**"],
  coverageThreshold: {
    global: {
      statements: 97,
      branches: 85,
      functions: 90,
      lines: 97,
    },
  },
};

/**
 * ESM-only packages under `sanitize-html` (used by the build-time post sanitiser). `next/jest`
 * leaves all of `node_modules` untransformed, so these are let through to its SWC transform.
 */
const ESM_PACKAGES = [
  "htmlparser2",
  "domhandler",
  "domutils",
  "dom-serializer",
  "domelementtype",
  "entities",
];

const jestConfig = async (): Promise<Config> => {
  const resolved = await createJestConfig(config)();
  return {
    ...resolved,
    transformIgnorePatterns: [
      `/node_modules/(?!(?:\\.pnpm/)?(?:${ESM_PACKAGES.join("|")})[@/])`,
      "^.+\\.module\\.(css|sass|scss)$",
    ],
  };
};

export default jestConfig;
