import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { SITE_NAME } from "data/site";
import { getAllPosts, getPostBySlug } from "utils/posts";

/** Only the generated slugs exist; any other slug is a 404 that is neither rendered nor cached. */
export const dynamicParams = false;

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export default async function WritingPostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#000000",
        padding: 72,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
        <div
          style={{
            display: "flex",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#a3a3a3",
          }}
        >
          Article
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            maxHeight: 280,
          }}
        >
          <span>{truncate(post.title, 120)}</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#737373",
            lineHeight: 1.45,
            maxWidth: 1000,
          }}
        >
          <span>{truncate(post.excerpt, 220)}</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #262626",
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex", fontSize: 22, color: "#a3a3a3", fontWeight: 500 }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            border: "1px solid #262626",
            color: "#fafafa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.05em",
          }}
        >
          AP
        </div>
      </div>
    </div>,
    { ...size }
  );
}
