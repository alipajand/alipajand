import { ImageResponse } from "next/og";

export function renderMonogramIcon(px: number, { rounded = true } = {}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
        borderRadius: rounded ? Math.round(px * 0.22) : 0,
        fontSize: Math.round(px * 0.46),
        fontWeight: 800,
        color: "#fafafa",
        fontFamily:
          "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
        letterSpacing: "-0.05em",
      }}
    >
      AP
    </div>,
    { width: px, height: px }
  );
}
