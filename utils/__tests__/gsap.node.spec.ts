/**
 * Node environment: window is undefined. Covers prefersReducedMotion early return.
 * @jest-environment node
 */

jest.mock("gsap", () => ({ registerPlugin: jest.fn() }));
jest.mock("gsap/ScrollTrigger", () => ({ __esModule: true, default: {} }));

import { prefersReducedMotion } from "utils/gsap";

describe("utils/gsap (node)", () => {
  it("prefersReducedMotion returns false when window is undefined", () => {
    expect(prefersReducedMotion()).toBe(false);
  });
});
