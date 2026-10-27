import * as fs from "fs";
import { getAllPosts, getPostBySlug, getPostMarkdown } from "utils/posts";

jest.mock("marked", () => ({
  marked: { parse: (content: string) => `<p>${content}</p>`, use: jest.fn() },
}));

jest.mock("fs", () => {
  const actual = jest.requireActual("fs");
  return { ...actual, readFileSync: jest.fn(actual.readFileSync) };
});

describe("utils/posts slug handling", () => {
  afterEach(() => {
    jest.mocked(fs.readFileSync).mockClear();
  });

  it.each([
    "../../README",
    "..%2F..%2FREADME",
    "../posts/agent-readiness-doctor",
    "/etc/hosts",
    "agent-readiness-doctor/../../../README",
    "Agent-Readiness-Doctor",
    "agent_readiness",
    "",
    "-leading",
    "trailing-",
  ])("should not read a file for the slug %j", (slug) => {
    expect(getPostBySlug(slug)).toBeNull();
    expect(getPostMarkdown(slug)).toBeNull();
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });

  it("should still load every published slug", () => {
    const slugs = getAllPosts().map((post) => post.slug);
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      expect(getPostBySlug(slug)?.slug).toBe(slug);
    }
  });
});
