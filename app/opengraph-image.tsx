import { ImageResponse } from "next/og";

import {
  CANONICAL_URL,
  HERO_METRICS,
  LOCATION,
  SITE_NAME,
  TAGLINE,
} from "data/site";

export const size = { width: 1200, height: 630 };

export default function OpenGraphImage() {
  const photoUrl = `${CANONICAL_URL}/icon.png`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#000000",
        padding: 80,
        gap: 64,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: "-0.02em",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#888888",
            fontWeight: 400,
            maxWidth: 700,
          }}
        >
          {TAGLINE.replace(/\s*\|\s*/g, " · ")}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#666666",
            marginTop: 24,
          }}
        >
          {HERO_METRICS[0].value} years · React, TypeScript, Node.js · {LOCATION}
        </div>
      </div>
      <img
        src={photoUrl}
        alt=""
        width={280}
        height={280}
        style={{
          width: 280,
          height: 280,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    </div>,
    { ...size }
  );
}
