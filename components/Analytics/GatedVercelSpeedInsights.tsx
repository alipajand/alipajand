"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";

export function GatedVercelSpeedInsights() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return <SpeedInsights />;
}
