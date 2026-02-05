import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ali Pajand — Senior Frontend Developer",
  description:
    "Senior Frontend Developer specializing in React, TypeScript, Next.js and high-performance UI. Design systems, GSAP animations, and scalable web experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistSans.className} antialiased bg-background text-foreground`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
