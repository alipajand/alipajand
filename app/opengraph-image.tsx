import { ImageResponse } from "next/og";

import { CANONICAL_URL, HERO_PROOF_ROW, LOCATION, SITE_NAME, TAGLINE } from "data/site";

export const size = { width: 1200, height: 630 };

export default function OpenGraphImage() {
  const photoUrl = `${CANONICAL_URL}/icon.png`;

  const metricsLine = `${HERO_PROOF_ROW[0].value} ${HERO_PROOF_ROW[0].label} · ${HERO_PROOF_ROW[1].value} · ${LOCATION}`;

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
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: "-0.02em",
          }}
        >
          <span>{SITE_NAME}</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#888888",
            fontWeight: 400,
            maxWidth: 700,
          }}
        >
          <span>{TAGLINE.replace(/\s*\|\s*/g, " · ")}</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#666666",
            marginTop: 24,
          }}
        >
          <span>{metricsLine}</span>
        </div>
      </div>
      <img
        src={photoUrl}
        alt={`${SITE_NAME} profile photo`}
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
