// app/layout.tsx
//
// Root layout (React Server Component). Owns global metadata / OpenGraph /
// Twitter card (Req 15.1), embeds JSON-LD Person + ProfilePage structured
// data (Req 15.2), loads the sans font via next/font exposing the
// `--font-sans` CSS variable consumed by tailwind.config.ts (Req 16.2, 16.3),
// applies the clean token-based background, wires the light/dark theme with a
// no-flash init script, and frames the page with the fixed Navbar and Footer.

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site } from "@/data/site";

import "./globals.css";

// Inter via next/font exposing `--font-sans` so tailwind's
// fontFamily.sans (`var(--font-sans)`) resolves reliably (Req 16.2, 16.3).
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const siteUrl = site.jsonLd.url || "https://vasistasandeep.in";

export const metadata: Metadata = {
  title: site.og.title,
  description: site.og.description,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: site.og.title,
    description: site.og.description,
    siteName: site.og.siteName,
    url: siteUrl,
    type: site.og.type as "website",
    images: [
      {
        url: site.og.imagePath,
        width: 1200,
        height: 630,
        alt: site.og.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.og.title,
    description: site.og.description,
    images: [site.og.imagePath],
  },
};

// JSON-LD structured data: a @graph pairing a Person node with a ProfilePage
// whose mainEntity references that Person (Req 15.2). Sourced from
// data/site.ts (SiteMeta.jsonLd).
const personId = `${siteUrl}#person`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: site.jsonLd.personName,
      url: site.jsonLd.url,
      // Absolute URL to the professional headshot for rich results (Req 15.2).
      image: new URL(site.portrait.src, siteUrl).toString(),
      jobTitle: site.jsonLd.jobTitle,
      sameAs: site.jsonLd.sameAs,
      knowsAbout: site.jsonLd.knowsAbout,
    },
    {
      "@type": "ProfilePage",
      url: site.jsonLd.url,
      name: site.og.title,
      mainEntity: { "@id": personId },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* No-flash theme init: before first paint, apply the persisted theme
            (default LIGHT when unset) by toggling the `dark` class on
            <html>. Runs synchronously so there is no light→dark flicker. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-muted antialiased">
        {/* JSON-LD Person + ProfilePage structured data (Req 15.2) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        {/* Offset for the fixed 72px navbar (Req 1.1). */}
        <div className="pt-[72px]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
