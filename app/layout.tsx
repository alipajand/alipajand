import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Education } from "components/Education/Education";
import { CANONICAL_URL, HERO_SUB, KEYWORDS, SITE_NAME, TAGLINE } from "data/site";
import { PropsWithChildren } from "react";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: CANONICAL_URL,
    siteName: SITE_NAME,
    title: TAGLINE,
    description: HERO_SUB,
    images: [{ url: "/icon.png", alt: TAGLINE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TAGLINE,
    description: HERO_SUB,
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: CANONICAL_URL,
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistSans.className} antialiased bg-background text-foreground`}
      >
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <section className="px-6 sm:px-10 lg:px-20 border-t border-border py-8">
          <div className="max-w-3xl">
            <Education />
          </div>
        </section>
      </body>
    </html>
  );
}
