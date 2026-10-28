import { render, screen, within } from "@testing-library/react";
import type { ReactElement } from "react";

import PostPage, { generateMetadata } from "../writing/[slug]/page";
import { getPublishedPosts } from "utils/posts";
import { installMatchMedia, installObservers } from "utils/motion/testEnvironment";

jest.mock("marked", () =>
  jest.requireActual(
    jest
      .requireActual<typeof import("path")>("path")
      .join(process.cwd(), "node_modules/marked/lib/marked.umd.js")
  )
);

jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const PREVIEW = "preparing-integrations-for-anthropic-and-cursor-directories";

jest.mock("utils/posts", () => {
  const actual = jest.requireActual<typeof import("utils/posts")>("utils/posts");
  const { isRoutable } =
    jest.requireActual<typeof import("utils/publication")>("utils/publication");
  return {
    ...actual,
    getRoutablePost: (slug: string, now: Date) => {
      const post = actual.getPostBySlug(slug);
      if (!post) return null;
      const served = slug === PREVIEW ? { ...post, preview: true as const } : post;
      return isRoutable(served, now) ? served : null;
    },
  };
});

const BEFORE = new Date("2026-10-27T16:00:00Z");
const AFTER = new Date("2026-10-29T16:00:00Z");

const params = { params: Promise.resolve({ slug: PREVIEW }) };

const jsonLdTypes = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map(
    (script) => JSON.parse(script.textContent ?? "{}")["@type"]
  );

beforeEach(() => {
  jest.useFakeTimers({ doNotFake: ["requestAnimationFrame", "cancelAnimationFrame"] });
  installMatchMedia(false);
  installObservers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("a preview before its date", () => {
  beforeEach(() => jest.setSystemTime(BEFORE));

  it("should be served with noindex metadata", async () => {
    const meta = await generateMetadata(params);
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it("should render without Article or Breadcrumb JSON-LD and stay out of More writing", async () => {
    const { container } = render((await PostPage(params)) as ReactElement);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(jsonLdTypes(container)).toEqual([]);
    const more = screen.getByRole("region", { name: "More writing" });
    expect(within(more).queryByRole("link", { current: "page" })).toBeNull();
    expect(getPublishedPosts(BEFORE).some((post) => post.slug === PREVIEW)).toBe(false);
  });
});

describe("the same post after its date", () => {
  beforeEach(() => jest.setSystemTime(AFTER));

  it("should be indexable and carry its structured data", async () => {
    const meta = await generateMetadata(params);
    expect(meta.robots).toBeUndefined();
    const { container } = render((await PostPage(params)) as ReactElement);
    expect(jsonLdTypes(container)).toEqual(expect.arrayContaining(["Article", "BreadcrumbList"]));
  });
});
