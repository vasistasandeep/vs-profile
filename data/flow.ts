// data/flow.ts
//
// Architecture_Flow_Diagram data (Req 21.1-21.6).
// Four ordered layers (order 1..4) with "Layer N:" labels and exact elements,
// presented in client-to-persistence sequence order.

import type { FlowLayer } from "@/types/content";

export const flowLayers: FlowLayer[] = [
  {
    id: "client-and-edge",
    order: 1,
    label: "Layer 1: Client & Edge",
    elements: [
      "Player SDKs",
      "Multi-CDN Steering",
      "Token-Bucket Rate Limiting",
    ],
  },
  {
    id: "api-gateway-ssai-proxy",
    order: 2,
    label: "Layer 2: API Gateway & SSAI Proxy",
    elements: [
      "Manifest manipulation",
      "SCTE-35 marker detection",
      "Auth",
    ],
  },
  {
    id: "decoupled-domain-microservices",
    order: 3,
    label: "Layer 3: Decoupled Domain Microservices",
    elements: [
      "Playback",
      "Listing",
      "Subscription",
      "XDR Continue Watching",
    ],
  },
  {
    id: "persistence-and-caching",
    order: 4,
    label: "Layer 4: Persistence & Caching",
    elements: [
      "Multi-cluster Redis pre-warming",
      "Database-per-service",
      "Kafka event bus",
    ],
  },
];
