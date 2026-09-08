// data/caseStudies.ts
//
// In-Depth Case Studies content. Each study has a `summary` shown on the
// trigger card and `body` paragraphs shown in the slide-over drawer. Framed as
// program/product leadership (directing teams, owning roadmaps and outcomes)
// rather than personal authorship of implementations.

import type { CaseStudy } from "@/types/content";

export const caseStudies: CaseStudy[] = [
  {
    id: "personalization-engines",
    title: "Personalization at Scale",
    summary:
      "Drove the personalization program - Spotlight, Binge tray, recommendation trays and tray ranking - lifting watch-time across the platform.",
    body: [
      "Personalization was the single biggest lever on engagement, so I owned the program end to end: aligning product, data science, and engineering around a shared roadmap for the surfaces that shape what every viewer sees first.",
      "The work spanned the high-visibility surfaces - Spotlight, the Binge tray, the recommendation trays, and the tray-ranking logic that orders them - each requiring tight cross-team integration between the reco/ML teams and the playback and listing services.",
      "By sequencing experiments, holding the teams to clear success metrics, and protecting the roadmap from thrash, the program delivered a measurable watch-time uplift while keeping the experience fast and personalized for 30M+ users.",
    ],
  },
  {
    id: "load-testing-250k-rps",
    title: "Load Testing & Live-Event Readiness (250K RPS)",
    summary:
      "Governed load-testing and tournament readiness, sustaining 99.99% availability as traffic surged from near-idle to 250K RPS in under a minute.",
    body: [
      "Marquee cricket and football tournaments drove traffic from near-idle to 250K RPS in under 60 seconds. Reactive autoscaling alone could not keep up with a roughly 3-minute provisioning lag, so the first surge always risked hitting an under-provisioned fleet.",
      "I governed the load-testing and readiness program ahead of each event: defining the load profiles that mirrored real tournament spikes, aligning engineering and SRE on capacity plans, runbooks, and go/no-go criteria, and pre-warming multi-cluster caches for the hot listing, playback, and continue-watching paths.",
      "The teams layered in graceful-degradation controls to shed non-critical features during peak surges, protecting the core playback path while capacity caught up. Directing this Team of Teams held availability at 99.99% through peak concurrency.",
    ],
  },
  {
    id: "mweb-platform-revamp",
    title: "Mobile Web & Platform Revamp",
    summary:
      "Steered the mWeb and platform revamp, optimizing rendering performance and unlocking new ad-inventory monetization.",
    body: [
      "The mobile-web experience and the underlying platform had accumulated years of drag on rendering performance and monetization flexibility. I steered the revamp as a cross-functional program with clear performance and revenue goals.",
      "On the experience side, the teams reworked rendering paths and page composition so mobile-web load and interactivity improved materially - critical for a market where mweb is a primary entry point.",
      "The platform changes also unlocked new ad-inventory placements and formats, turning a performance initiative into a revenue one, with delivery sequenced so neither goal blocked the other.",
    ],
  },
  {
    id: "vertical-shorts",
    title: "Vertical Shorts",
    summary:
      "Led the launch of the vertical Shorts video experience, opening a new engagement surface and monetization stream.",
    body: [
      "Short-form vertical video had become table stakes for engagement, and I led the initiative to bring a Shorts experience to the platform as a first-class surface rather than a bolt-on.",
      "The program coordinated product, playback, and content-operations teams to define the format, the feed mechanics, and the creation/ingestion path, while keeping the architecture aligned with the wider streaming backend.",
      "Shorts opened a new, highly-engaging surface for viewers and a fresh ad-inventory stream for the business, delivered without destabilizing the core long-form experience.",
    ],
  },
  {
    id: "bolt-cms-global-expansion",
    title: "Bolt CMS & Global Expansion",
    summary:
      "A build-versus-buy decision to replace vendor lock-in with the proprietary Bolt CMS: 40% publishing-latency reduction and GDPR, US, and Japan compliance.",
    body: [
      "The incumbent vendor CMS created lock-in, throttled publishing throughput, and could not satisfy the data-residency demands of new markets. I led the rigorous build-versus-buy decision and made the call to build the proprietary Bolt CMS.",
      "Managing the multi-million-dollar budget and delivery, I steered Bolt from roadmap to launch: it cut publishing latency by 40% and removed the recurring OPEX tied to the vendor platform, while giving editorial teams a workflow tuned to live-event operations.",
      "I directed the cross-functional squads (Legal, InfoSec, Engineering) that made global expansion possible, with regional data isolation for GDPR in the EU alongside the US and Japan launches, keeping each market compliant without forking the product.",
    ],
  },
  {
    id: "vendor-integration-compliance",
    title: "Vendor & Third-Party Integration (GDPR / US)",
    summary:
      "Ran the integration program with vendors and third parties, shipping GDPR-compliant EU and US releases with data isolation built in.",
    body: [
      "Expanding into new territories meant integrating a web of vendors and third-party services - identity, payments, ad-tech, and analytics - each with its own data-handling implications.",
      "I ran the integration program as the bridge between Legal, InfoSec, and Engineering, defining how PII and subscription state were isolated per region so partners could be onboarded without compromising compliance.",
      "The result was a set of GDPR-compliant EU releases alongside the US rollout, with data-residency boundaries enforced at the gateway layer and a repeatable playbook for adding future partners and markets.",
    ],
  },
  {
    id: "org-program-streamlining",
    title: "Streamlining Programs Across the Organisation",
    summary:
      "Built the Team-of-Teams operating model and streamlined delivery programs across the organisation, improving predictability and flow.",
    body: [
      "As the portfolio grew, delivery was spread across many squads with inconsistent cadences, unclear ownership, and competing priorities. I took on the organizational heavy lifting to bring order to it.",
      "I established a Team-of-Teams structure with shared governance - clear accountability, aligned roadmaps, error-budget-aware prioritization, and executive reporting that gave leadership a single, honest view of delivery health.",
      "Streamlining the programs this way improved predictability and flow across the organisation, reduced cross-team thrash, and let leadership make trade-offs with data rather than opinion.",
    ],
  },
  {
    id: "walmart-post-payment-audit",
    title: "Post-Payment Audit Program (Walmart)",
    summary:
      "Led the engineering roadmap for Walmart Post-Payment Audit, partnering with Staff Engineers on real-time anomaly detection that recovered multi-millions annually.",
    body: [
      "Financial discrepancies were surfacing days after the fact through batch reconciliation, by which point revenue leakage had already compounded across high-volume transaction flows.",
      "I led the engineering roadmap for the Post-Payment Audit system, partnering with Staff Engineers to redesign the data pipelines for automated anomaly detection so transactions were scored as they occurred rather than in overnight batches.",
      "Governing delivery across the squads while championing DevOps and CI/CD practices closed the detection window from days to seconds. Catching leakage as it happened recovered multi-millions annually and turned the audit function into a real-time control.",
    ],
  },
];

export default caseStudies;
