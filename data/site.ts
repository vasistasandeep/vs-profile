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
  primaryEmail: "vasista.sandeep@gmail.com",
  fallbackEmail: "vasista.sandeep@gmail.com",
  // Public, non-secret Formspree form URL (live form ID mrpgyepg). The Contact
  // form POSTs submissions here. A Formspree form URL is public and contains
  // no secret, so it is safe to commit.
  formspreeEndpoint: "https://formspree.io/f/mrpgyepg",
  resumePath: "/Vasista_Sandeep_Profile.pdf",
  // Professional headshot used as the Hero avatar and the JSON-LD Person.image.
  portrait: {
    src: "/vasista-headshot.png",
    alt: "Vasista Sandeep, AVP Program Management (Tech & Product)",
  },
  footerText:
    "© 2026 Vasista Sandeep • vasistasandeep.in • Building platforms that stay fast when the whole crowd shows up at once.",
  og: {
    title: "Vasista Sandeep — Platform & Product Leader",
    description:
      "I'm Vasista Sandeep, a program and product leader with 14+ years and a Six Sigma Black Belt, building consumer platforms that scale calmly to 30M+ users across OTT, FinTech, and Retail. Here's how I think about platforms, teams, and the moments they get tested.",
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
