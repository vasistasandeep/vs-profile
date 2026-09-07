// data/evolution.ts
//
// Platform_Evolution (Before vs After) data (Req 4.1-4.7).
// Six evolution items with exact titles and before/after detail strings.
// Each `after` string contains the required technical references (Req 4.2-4.7).

import type { EvolutionItem } from "@/types/content";

export const evolutionItems: EvolutionItem[] = [
  {
    id: "monolith-to-microservices",
    title: "Monolith to Cloud-Native Microservices",
    before:
      "A single monolithic application where playback, listing, subscription, and cross-device resume shared one deployment, coupling release cycles and blast radius.",
    after:
      "Decoupled into cloud-native microservices communicating over gRPC and Kafka, isolating the Playback, Listing, Subscription, and XDR domains for independent scaling and deployment.",
  },
  {
    id: "proprietary-bolt-cms",
    title: "Proprietary Bolt CMS",
    before:
      "A third-party vendor CMS imposing licensing costs, vendor lock-in, and slow, inflexible publishing workflows.",
    after:
      "A proprietary Bolt CMS replacing vendor lock-in, delivering a 40% publishing latency reduction and multi-million OPEX savings.",
  },
  {
    id: "gdfo-graceful-degradation",
    title: "GDFO Graceful Degradation and Fallback Operations",
    before:
      "During traffic surges, a 3-minute autoscaling provisioning lag left the platform exposed to cascading failures and full outages.",
    after:
      "Graceful Degradation and Fallback Operations governed by Architecture Control Committee policies, using Envoy and Resilience4j circuit breakers to shed non-critical features during surges and eliminate the 3-minute autoscaling provisioning lag.",
  },
  {
    id: "multi-region-global-footprint",
    title: "Multi-Region Global Footprint",
    before:
      "A single-region deployment that could not satisfy data residency requirements or serve global audiences with low latency.",
    after:
      "A multi-region global footprint with regional data isolation enabling EU/GDPR, US, and Japan launches.",
  },
  {
    id: "ssai-dai-ad-monetization",
    title: "SSAI/DAI Ad Monetization",
    before:
      "Client-side ad insertion vulnerable to ad blockers, stitching failures, and buffering that eroded ad revenue and viewer experience.",
    after:
      "Server-side ad insertion (SSAI/DAI) with real-time SCTE-35 marker detection, protecting ad revenue and eliminating buffering.",
  },
  {
    id: "unified-observability",
    title: "Unified Observability",
    before:
      "Fragmented, siloed logging and metrics with no distributed tracing, leaving incidents hard to diagnose and slow to resolve.",
    after:
      "Unified observability built on OpenTelemetry pipelines with tail-based sampling, reducing MTTR while optimizing telemetry cost.",
  },
];
