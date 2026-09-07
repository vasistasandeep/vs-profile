// data/manifesto.ts
//
// Platform Leadership Manifesto content (Req 7).
// Four cards with exact required titles (Req 7.1) and the principle text
// for each (Req 7.2-7.5). Pre-populated for deploy readiness (Req 20.1).

import type { ManifestoCard } from "@/types/content";

export const manifesto: ManifestoCard[] = [
  {
    id: "telemetry-precedes-features",
    title: "Telemetry Precedes Features",
    // Req 7.2
    principle:
      "No service ships without OpenTelemetry instrumentation, SLIs, and SLO alert routing. Observability is a launch requirement, not a follow-up ticket.",
  },
  {
    id: "graceful-degradation-over-total-outage",
    title: "Graceful Degradation Over Total Outage",
    // Req 7.3
    principle:
      "Survivability is engineered at the edge. Non-critical dependencies fail safely so the core experience stays available under surge and partial failure.",
  },
  {
    id: "error-budgets-dictate-velocity",
    title: "Error Budgets Dictate Velocity",
    // Req 7.4
    principle:
      "The balance of tech debt versus feature delivery is governed by SLO thresholds. Error budgets, not opinions, decide when we ship and when we harden.",
  },
  {
    id: "multi-region-by-design",
    title: "Multi-Region by Design",
    // Req 7.5
    principle:
      "Data residency for GDPR/PII and localization are baseline requirements. Regions are a first-class design input, never a late retrofit.",
  },
];

export default manifesto;
