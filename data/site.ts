// data/site.ts
//
// Site-wide metadata: identity, contact channels, resume path, footer
// attribution, OpenGraph preview block, and JSON-LD Person/ProfilePage
// structured data. Content is aligned to the resume as the source of truth.

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
  resumePath: "/Vasista_Sandeep_Resume.pdf",
  // Professional headshot used as the Hero avatar and the JSON-LD Person.image.
  portrait: {
    src: "/vasista-headshot.jpg",
    alt: "Vasista Sandeep, AVP Program Management (Tech & Product)",
  },
  footerText:
    "© 2026 Vasista Sandeep • vasistasandeep.in • Program & Product leadership for high-scale consumer platforms.",
  og: {
    title: "Vasista Sandeep | Program & Product Leadership",
    description:
      "Executive technology leader and Six Sigma Black Belt with 14+ years scaling consumer platforms across OTT, FinTech, and Retail — from SonyLIV (30M+ users) to Walmart and Intel.",
    imagePath: "/og-image.png",
    siteName: "Vasista Sandeep",
    type: "website",
  },
  jsonLd: {
    personName: "Vasista Sandeep",
    url: siteUrl,
    jobTitle: "AVP, Program Management (Tech & Product)",
    sameAs: [linkedInUrl],
    knowsAbout: [
      "Program Management",
      "Product Strategy",
      "Portfolio & Budget Governance",
      "OTT / Streaming Platforms",
      "FinTech & Retail Commerce",
      "High-Availability Distributed Systems",
      "GenAI Integration",
      "Lean Six Sigma (Black Belt)",
    ],
  },
};
