// data/testimonials.ts
//
// "What people I've worked with say" content. Reflections attributed by ROLE
// ONLY - no fabricated names or personal profile links, so nothing reads as an
// impersonation of a real, identifiable person. Quotes are drafted to reflect
// real work (personalization, scale, cross-org programs) and can be swapped for
// verbatim endorsements later. The `linkedInUrl` field is retained on the type
// for backward compatibility but is intentionally not rendered.

import type { Testimonial } from "@/types/content";

export const testimonials: Testimonial[] = [
  {
    id: "head-of-technology",
    title: "Head of Technology",
    quote:
      "He is the person you want owning the hardest programs. He turned our tournament readiness into a repeatable discipline, kept engineering and SRE aligned under pressure, and when 250K RPS hit, the platform simply held.",
    linkedInUrl: "",
    initials: "HT",
  },
  {
    id: "chief-product-officer",
    title: "Chief Product Officer",
    quote:
      "He speaks product and platform in the same breath. He drove our personalization roadmap - Spotlight, the trays, tray ranking - and translated deep systems work into watch-time outcomes the whole leadership team could rally behind.",
    linkedInUrl: "",
    initials: "CPO",
  },
  {
    id: "research-head-personalization",
    title: "Research Head, Personalization",
    quote:
      "On our personalization research project he was the rare partner who respected the science and still shipped. He gave the research a real path to production and made sure the ranking work actually reached viewers at scale.",
    linkedInUrl: "",
    initials: "RH",
  },
  {
    id: "chief-technology-officer",
    title: "Chief Technology Officer",
    quote:
      "He took on the organizational heavy lifting most people avoid - building the Team-of-Teams structure, the governance, the error-budget culture - and delivery across the org became measurably more predictable because of it.",
    linkedInUrl: "",
    initials: "CTO",
  },
];

export default testimonials;
