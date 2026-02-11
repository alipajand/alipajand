import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^data/(.*)$": "<rootDir>/data/$1",
    "^utils/(.*)$": "<rootDir>/utils/$1",
    "^components/(.*)$": "<rootDir>/components/$1",
    "^lib/(.*)$": "<rootDir>/lib/$1",
  },
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "lib/**/*.ts",
    "utils/**/*.ts",
    "!**/*.spec.{ts,tsx}",
    "!**/__tests__/**",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      statements: 97,
      branches: 85,
      functions: 90,
      lines: 97,
    },
  },
};

export default createJestConfig(config);
