"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";

export const GatedVercelSpeedInsights = () => {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return <SpeedInsights />;
};
