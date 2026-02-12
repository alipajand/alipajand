import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { CANONICAL_URL, HERO_SUB, KEYWORDS, SITE_NAME, TAGLINE } from "data/site";
import { PropsWithChildren } from "react";
import { ResourceHints } from "components/ResourceHints/ResourceHints";
import { SmoothScroll } from "components/SmoothScroll/SmoothScroll";
import { StructuredData } from "components/StructuredData/StructuredData";
import { Analytics } from "components/Analytics/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  title: {
    default: TAGLINE,
    template: `%s | ${SITE_NAME}`,
  },
  description: HERO_SUB,
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME, url: CANONICAL_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: CANONICAL_URL,
    siteName: SITE_NAME,
    title: TAGLINE,
    description: HERO_SUB,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: TAGLINE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TAGLINE,
    description: HERO_SUB,
    images: ["/opengraph-image"],
    creator: `@${SITE_NAME.toLowerCase().replace(/\s+/g, "")}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: CANONICAL_URL,
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  other: {
    "theme-color": "#000000",
    "color-scheme": "dark",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#000000",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistSans.className} antialiased bg-background text-foreground`}
      >
        <Analytics />
        <ResourceHints />
        <StructuredData />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
