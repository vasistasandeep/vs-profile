// data/testimonials.ts
//
// Leadership Endorsements & Peer Validation content (Req 10).
// Three testimonial cards attributed to the exact executive titles (Req 10.1),
// each with an endorsement quote (Req 10.2), a LinkedIn placeholder link
// (Req 10.3), and initials for the profile badge (Req 10.2).
// Pre-populated for deploy readiness (Req 20.1).

import type { Testimonial } from "@/types/content";

export const testimonials: Testimonial[] = [
  {
    id: "vp-engineering-cloud",
    title: "VP of Engineering & Cloud Infrastructure",
    quote:
      "Vasista is the rare architect who treats resilience as a product. He drove our graceful-degradation strategy and multi-region rollout, and our tournament peaks stopped being firefights. When 250K RPS hit, the platform simply held.",
    linkedInUrl: "https://www.linkedin.com/in/placeholder-vp-engineering/",
    initials: "VP",
  },
  {
    id: "head-of-product-growth",
    title: "Head of Product & Growth",
    quote:
      "He speaks fluent product and platform. Replacing our vendor CMS with Bolt cut publishing latency by 40% and unblocked our global launches. Vasista turns deep systems work into measurable business outcomes leadership can act on.",
    linkedInUrl: "https://www.linkedin.com/in/placeholder-head-of-product/",
    initials: "HP",
  },
  {
    id: "global-delivery-director",
    title: "Global Delivery Director",
    quote:
      "Across regions and vendors, Vasista set the engineering governance that let us scale predictably. Error budgets and observability-first delivery became the norm, and MTTR dropped while velocity stayed high. A trusted executive partner.",
    linkedInUrl: "https://www.linkedin.com/in/placeholder-delivery-director/",
    initials: "GD",
  },
];

export default testimonials;
