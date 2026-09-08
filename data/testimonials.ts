// data/testimonials.ts
//
// "What people I've worked with say" content (Req 10).
// Three reflections attributed by ROLE ONLY (Req 10.1) — no fabricated names or
// personal profile links, so nothing reads as an impersonation of a real,
// identifiable person. Each has a short quote (Req 10.2) and initials for the
// role badge (Req 10.2). The `linkedInUrl` field is retained on the type for
// backward compatibility but is intentionally no longer rendered.
// Pre-populated for deploy readiness (Req 20.1).

import type { Testimonial } from "@/types/content";

export const testimonials: Testimonial[] = [
  {
    id: "vp-engineering-cloud",
    title: "VP of Engineering & Cloud Infrastructure",
    quote:
      "What I remember most is how calm our tournament peaks became. He treated resilience like a product, kept the whole team aligned on graceful degradation and the multi-region plan, and when 250K RPS finally hit, the platform simply held.",
    linkedInUrl: "https://www.linkedin.com/in/placeholder-vp-engineering/",
    initials: "VP",
  },
  {
    id: "head-of-product-growth",
    title: "Head of Product & Growth",
    quote:
      "He speaks product and platform in the same breath. Backing the move to build Bolt cut our publishing latency by 40% and unblocked global launches, and he always framed the deep systems work in outcomes the rest of us could act on.",
    linkedInUrl: "https://www.linkedin.com/in/placeholder-head-of-product/",
    initials: "HP",
  },
  {
    id: "global-delivery-director",
    title: "Global Delivery Director",
    quote:
      "Working across regions and vendors, he gave us governance that let us scale without drama. Error budgets and observability-first delivery became second nature, MTTR dropped, and velocity held steady. Genuinely a partner you want in the room.",
    linkedInUrl: "https://www.linkedin.com/in/placeholder-delivery-director/",
    initials: "GD",
  },
];

export default testimonials;
