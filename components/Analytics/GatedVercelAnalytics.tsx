"use client";

import { Analytics } from "@vercel/analytics/next";

export function GatedVercelAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return <Analytics />;
}
