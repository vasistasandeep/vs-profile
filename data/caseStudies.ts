// data/caseStudies.ts
//
// Expanded Case Study Drawer content (Req 8).
// Three case studies with exact required titles (Req 8.1). Each has a `summary`
// shown on the trigger card and `body` paragraphs shown in the slide-over drawer,
// covering the required details (Req 8.3-8.5). Pre-populated for deploy
// readiness (Req 20.1).

import type { CaseStudy } from "@/types/content";

export const caseStudies: CaseStudy[] = [
  {
    id: "tournament-concurrency-250k-rps",
    title: "Tournament Concurrency at 250K RPS",
    // Req 8.3
    summary:
      "Absorbing 0-to-250K RPS tournament spikes by mitigating the 3-minute auto-scale lag with Redis pre-warming and GDFO circuit breakers.",
    body: [
      "Marquee cricket and football tournaments drove traffic from near-idle to 250K RPS in under 60 seconds. Reactive autoscaling could not keep up: the roughly 3-minute provisioning lag to bring new capacity online meant the first surge always hit an under-provisioned fleet.",
      "To close the gap we pre-warmed multi-cluster Redis ahead of the toss and match windows, seeding hot listing, playback, and continue-watching keys so cold caches never became the bottleneck at kickoff.",
      "GDFO circuit breakers (Envoy and Resilience4j) shed non-critical features during the surge, protecting the core playback path while capacity caught up. The combination eliminated the exposure created by the 3-minute auto-scale lag and held availability through peak concurrency.",
    ],
  },
  {
    id: "bolt-cms-global-expansion",
    title: "Bolt CMS and Global Expansion",
    // Req 8.4
    summary:
      "A build-versus-buy decision to replace vendor lock-in with the proprietary Bolt CMS: 40% publishing latency reduction and GDPR, US, and Japan compliance.",
    body: [
      "The incumbent vendor CMS created lock-in, throttled our publishing throughput, and could not satisfy the data-residency demands of new markets. We ran a rigorous build-versus-buy evaluation and chose to build the proprietary Bolt CMS.",
      "Bolt cut publishing latency by 40% and removed multi-million-dollar recurring OPEX tied to the vendor platform, while giving editorial teams a workflow tuned to live-event operations.",
      "Region-aware content and metadata pipelines made global expansion possible with regional data isolation for GDPR in the EU alongside the US and Japan launches, keeping each market compliant without forking the product.",
    ],
  },
  {
    id: "walmart-fintech-anomaly-engine",
    title: "Walmart FinTech Anomaly Engine",
    // Req 8.5 — MUST use streaming ML audit pipeline via Kafka event streams
    // wording to detect financial anomalies in real time, recovering millions
    // in revenue leakage.
    summary:
      "A streaming ML audit pipeline that consumes Kafka event streams to detect financial anomalies in real time, recovering millions in revenue leakage.",
    body: [
      "Financial discrepancies were surfacing days after the fact through batch reconciliation, by which point revenue leakage had already compounded across high-volume transaction flows.",
      "We built a streaming ML audit pipeline that consumes Kafka event streams to score transactions as they occur, detecting financial anomalies in real time rather than in overnight batches.",
      "Anomalies are flagged and routed the moment they appear, closing the detection window from days to seconds. Catching leakage as it happened recovered millions in revenue leakage and turned the audit function into a real-time control.",
    ],
  },
];

export default caseStudies;
