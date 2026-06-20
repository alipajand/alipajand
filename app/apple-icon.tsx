import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 800,
        color: "#fafafa",
        fontWidth: "bold",
        fontFamily:
          "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
        letterSpacing: "-0.05em",
      }}
    >
      AP
    </div>,
    { ...size }
  );
}
