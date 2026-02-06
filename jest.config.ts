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
  },
};

export default createJestConfig(config);
