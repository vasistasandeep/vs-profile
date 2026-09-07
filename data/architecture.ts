// data/architecture.ts
//
// Architecture_Tabs (Architectural Playbook & Observability Toolkit) data
// (Req 5.1-5.4). Three tabs with exact item lists.

import type { ArchitectureTab } from "@/types/content";

export const architectureTabs: ArchitectureTab[] = [
  {
    id: "system-design-patterns",
    label: "System Design Patterns",
    items: [
      "Circuit Breakers",
      "Token-Bucket Rate Limiting",
      "Database-per-service isolation",
      "Multi-CDN Origin Shielding",
      "Redis pre-warming",
    ],
  },
  {
    id: "observability-telemetry-melt",
    label: "Observability & Telemetry (MELT)",
    items: [
      "OpenTelemetry",
      "Prometheus",
      "Grafana",
      "Datadog",
      "Splunk",
      "ELK",
      "Jaeger tracing",
      "SLO burn-rate alerts",
    ],
  },
  {
    id: "video-streaming-qoe",
    label: "Video Streaming QoE",
    items: [
      "VST",
      "VSFT",
      "VPF",
      "EBVS",
      "DAI/SSAI manifest stitching",
      "Continue Watching / XDR cross-device resume",
    ],
  },
];
