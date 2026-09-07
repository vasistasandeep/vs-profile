// data/site.ts
//
// Site-wide metadata: identity, contact channels, resume path, footer
// attribution, OpenGraph preview block, and JSON-LD Person/ProfilePage
// structured data. All values are pre-populated for zero-config deploy
// (Req 1.4, 11.1, 12.1, 13.2, 15.1, 15.2, 20.1).

import type { SiteMeta } from "@/types/content";

const linkedInUrl = "https://www.linkedin.com/in/vasistasandeep/";
const siteUrl = "https://vasistasandeep.in";

export const site: SiteMeta = {
  name: "Vasista Sandeep",
  monogram: "Vasista Sandeep",
  domain: "vasistasandeep.in",
  linkedInUrl,
  primaryEmail: "contact@vasistasandeep.in",
  fallbackEmail: "vasista.sandeep@gmail.com",
  // Public, non-secret Formspree form URL (live form ID mrpgyepg). The Contact
  // form POSTs submissions here. A Formspree form URL is public and contains
  // no secret, so it is safe to commit.
  formspreeEndpoint: "https://formspree.io/f/mrpgyepg",
  // Placeholder PDF committed at public/Vasista_Sandeep_Resume.pdf so the
  // ResumeButton HEAD availability check succeeds; replace with the real resume.
  resumePath: "/Vasista_Sandeep_Resume.pdf",
  // Professional headshot used as the Hero avatar and the JSON-LD Person.image.
  // Save a square (>= 400x400), professionally cropped photo at this path.
  portrait: {
    src: "/vasista-headshot.jpg",
    alt: "Vasista Sandeep Srinivasa, Platform Product Leader",
  },
  footerText:
    "© 2026 Vasista Sandeep Srinivasa • vasistasandeep.in • Built with Next.js, Tailwind & OpenTelemetry Mental Models.",
  og: {
    title: "Vasista Sandeep | Platform & Technical Product Leadership",
    description:
      "14+ years architecting distributed platforms, OTT media supply chains, and enterprise transformations across 30M+ peak concurrent users.",
    // Placeholder PNG committed at public/og-image.png. Replace with the real
    // OpenGraph preview asset sized 1200×630 before deploy.
    imagePath: "/og-image.png",
    siteName: "Vasista Sandeep",
    type: "website",
  },
  jsonLd: {
    personName: "Vasista Sandeep Srinivasa",
    url: siteUrl,
    jobTitle: "Platform & Technical Product Leader",
    sameAs: [linkedInUrl],
    knowsAbout: [
      "Distributed Systems",
      "OTT Streaming Architecture",
      "OpenTelemetry",
      "Server-Side Ad Insertion (SSAI)",
      "Graceful Degradation & Fallback Operations (GDFO)",
      "High-Concurrency Platforms",
    ],
  },
};
