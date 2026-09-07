// data/labs.ts
//
// Labs & Builder Mindset showcase content (Req 22).
// A compact micro-grid of active generative AI and modern platform prototypes
// (Req 22.1). Includes at least one "ai-workflow" item (AI-automated workflow
// pipeline) and at least one "fullstack" item (full-stack React/Node/Redis
// build) (Req 22.2). Every item has a non-empty title and short descriptor
// (Req 22.3). Pre-populated for deploy readiness (Req 20.1).

import type { LabItem } from "@/types/content";

export const labs: LabItem[] = [
  {
    id: "ai-incident-triage-pipeline",
    title: "AI Incident Triage Pipeline",
    descriptor:
      "An AI-automated workflow that ingests alerts and traces, clusters signals with an LLM, and drafts a ranked root-cause hypothesis with a suggested runbook.",
    kind: "ai-workflow",
  },
  {
    id: "gen-ai-release-notes-agent",
    title: "Release Notes Agent",
    descriptor:
      "A generative-AI workflow that reads merged PRs and commit history, then produces structured, audience-aware release notes on every tagged deploy.",
    kind: "ai-workflow",
  },
  {
    id: "realtime-leaderboard-stack",
    title: "Real-Time Leaderboard Stack",
    descriptor:
      "A full-stack React/Node/Redis build streaming live scores over WebSockets, using Redis sorted sets for sub-millisecond ranking under burst load.",
    kind: "fullstack",
  },
  {
    id: "edge-feature-flag-console",
    title: "Edge Feature-Flag Console",
    descriptor:
      "A full-stack React/Node/Redis prototype for edge-evaluated feature flags with a live admin console and Redis-backed targeting rules.",
    kind: "fullstack",
  },
];

export default labs;
