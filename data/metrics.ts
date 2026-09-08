// data/metrics.ts
//
// Metric_Strip data for the Hero_Section (Req 2.4).
// Five metrics with exact labels and target values. Counters animate from
// zero to target over a duration in the 1000..2500ms range (Req 2.5).

import type { Metric } from "@/types/content";

export const metrics: Metric[] = [
  {
    id: "years-technical-leadership",
    label: "Years Technology Leadership",
    target: 14,
    suffix: "+",
    decimals: 0,
    durationMs: 1200,
  },
  {
    id: "peak-concurrent-viewers",
    label: "Peak Concurrent Users",
    target: 30,
    suffix: "M+",
    decimals: 0,
    durationMs: 1800,
  },
  {
    id: "requests-per-second",
    label: "Peak Requests / Sec (live events)",
    target: 250,
    suffix: "K",
    decimals: 0,
    durationMs: 2000,
  },
  {
    id: "system-availability",
    label: "System Availability",
    target: 99.99,
    suffix: "%",
    decimals: 2,
    durationMs: 2200,
  },
  {
    id: "publishing-latency-reduction",
    label: "Publishing Latency Reduction",
    target: 40,
    suffix: "%",
    decimals: 0,
    durationMs: 1500,
  },
];
