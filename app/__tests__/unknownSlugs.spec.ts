/** @jest-environment node */

jest.mock("marked", () =>
  jest.requireActual(
    jest
      .requireActual<typeof import("path")>("path")
      .join(process.cwd(), "node_modules/marked/lib/marked.umd.js")
  )
);

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

import { notFound } from "next/navigation";

import * as portfolioPage from "../portfolio/[slug]/page";
import * as writingImage from "../writing/[slug]/opengraph-image";
import * as writingPage from "../writing/[slug]/page";

describe("dynamic segments", () => {
  it.each([
    ["/writing/[slug]", writingPage],
    ["/writing/[slug]/opengraph-image", writingImage],
    ["/portfolio/[slug]", portfolioPage],
  ])("%s should only render the slugs it generates", (_route, route) => {
    expect(route.dynamicParams).toBe(false);
  });

  it("should answer an unknown writing OG image with notFound instead of a generic card", async () => {
    await expect(
      writingImage.default({ params: Promise.resolve({ slug: "does-not-exist" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});
