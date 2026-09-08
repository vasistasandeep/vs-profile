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
    title: "Governing Live-Event Readiness at Scale",
    // Req 8.3 — reframed to program/product leadership: directing the
    // engineering portfolio and readiness for 250K RPS live events, not
    // personal authorship of the resilience implementation.
    summary:
      "Directed the engineering readiness portfolio for marquee tournaments, sustaining 99.99% availability as traffic surged to 250K RPS.",
    body: [
      "Marquee cricket and football tournaments drove traffic from near-idle to 250K RPS in under 60 seconds. Reactive autoscaling alone could not keep up: the roughly 3-minute provisioning lag to bring new capacity online meant the first surge always risked hitting an under-provisioned fleet.",
      "I governed the cross-functional readiness program ahead of each event, aligning engineering, SRE, and product on capacity plans, runbooks, and go/no-go criteria. The teams pre-warmed multi-cluster caches for hot listing, playback, and continue-watching paths so cold caches never became the bottleneck at kickoff.",
      "As part of that readiness posture, the teams implemented graceful-degradation controls to shed non-critical features during peak surges, protecting the core playback path while capacity caught up. Directing this 'Team of Teams' held availability at 99.99% through peak concurrency and closed the exposure created by the auto-scale lag.",
    ],
  },
  {
    id: "bolt-cms-global-expansion",
    title: "Bolt CMS and Global Expansion",
    // Req 8.4
    summary:
      "A build-versus-buy decision to replace vendor lock-in with the proprietary Bolt CMS: 40% publishing latency reduction and GDPR, US, and Japan compliance.",
    body: [
      "The incumbent vendor CMS created lock-in, throttled publishing throughput, and could not satisfy the data-residency demands of new markets. I led the rigorous build-versus-buy decision and made the call to build the proprietary Bolt CMS.",
      "Managing the multi-million-dollar budget and delivery, I steered Bolt from roadmap to launch: it cut publishing latency by 40% and removed the recurring OPEX tied to the vendor platform, while giving editorial teams a workflow tuned to live-event operations.",
      "I directed the cross-functional squads (Legal, InfoSec, Engineering) that made global expansion possible, with regional data isolation for GDPR in the EU alongside the US and Japan launches, keeping each market compliant without forking the product.",
    ],
  },
  {
    id: "walmart-fintech-anomaly-engine",
    title: "Leading the Post-Payment Audit Program",
    // Req 8.5 — reframed to program leadership: led the engineering roadmap and
    // partnered with Staff Engineers on the anomaly-detection pipeline, rather
    // than claiming personal authorship of the ML pipeline.
    summary:
      "Led the engineering roadmap for the Post-Payment Audit system, partnering with Staff Engineers to redesign data pipelines for automated anomaly detection.",
    body: [
      "Financial discrepancies were surfacing days after the fact through batch reconciliation, by which point revenue leakage had already compounded across high-volume transaction flows.",
      "I led the engineering roadmap for the Post-Payment Audit system, partnering with Staff Engineers to redesign the data pipelines for automated anomaly detection so that transactions were scored as they occurred rather than in overnight batches.",
      "Governing delivery across the squads while championing DevOps and CI/CD practices closed the detection window from days to seconds. Catching leakage as it happened recovered multi-millions annually and turned the audit function into a real-time control.",
    ],
  },
];

export default caseStudies;
