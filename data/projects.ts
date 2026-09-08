// data/projects.ts
//
// Real GitHub projects showcased in the Projects section (case-study styled).
// Each project has a recruiter-friendly `abstract` shown on the card and a
// fuller `body` (2-3 short paragraphs) shown in the details modal. Content is
// kept honest and high-level since these are personal builds. Pre-populated for
// deploy readiness (Req 20.1).

import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    id: "livpulse",
    name: "LivPulse",
    domain: "OTT Observability",
    repoUrl: "https://github.com/vasistasandeep/LivPulse",
    demoUrl: "https://liv-pulse.vercel.app",
    tags: ["OTT", "Observability", "TypeScript", "Dashboards"],
    abstract:
      "A real-time OTT platform health and analytics dashboard surfacing streaming KPIs and system pulse in one view.",
    body: [
      "LivPulse is a dashboard concept for OTT operators that pulls streaming KPIs and system health signals into a single, at-a-glance view. It models the kind of control-room surface an on-call engineer or platform owner would watch during a live event.",
      "The build demonstrates data-modeling for observability, component-driven dashboard layout, and a TypeScript codebase that keeps metric shapes type-safe from source to render.",
      "It reflects a product-minded approach to observability: deciding which signals matter, how to group them, and how to present health so that the story is obvious without digging through raw telemetry.",
    ],
  },
  {
    id: "ott-kpi",
    name: "OTT KPI Benchmarking Engine",
    domain: "OTT Analytics",
    repoUrl: "https://github.com/vasistasandeep/OTT-KPI-Benchmarking-Engine",
    demoUrl: "https://ott-kpi.vercel.app",
    tags: ["OTT", "KPIs", "Benchmarking", "TypeScript"],
    abstract:
      "A benchmarking engine that compares OTT product KPIs against reference bands to spot outliers and opportunities.",
    body: [
      "The OTT KPI Benchmarking Engine takes product and platform KPIs and compares them against reference bands, making it easy to see where a metric is healthy, borderline, or an outlier worth attention.",
      "It demonstrates analytical thinking applied to product management: defining meaningful benchmarks, normalizing inputs, and turning numbers into a clear verdict rather than a raw table.",
      "The TypeScript implementation keeps the scoring logic explicit and testable, which mirrors how a real benchmarking tool would need to stay trustworthy as inputs and thresholds evolve.",
    ],
  },
  {
    id: "openloaniq",
    name: "OpenLoanIQ",
    domain: "FinTech",
    repoUrl: "https://github.com/vasistasandeep/OpenLoanIQ",
    demoUrl: "https://open-loan-iq.vercel.app",
    tags: ["FinTech", "Lending", "Analytics", "TypeScript"],
    abstract:
      "A lending-intelligence prototype that turns raw loan data into clear, decision-ready signals.",
    body: [
      "OpenLoanIQ is a lending-intelligence prototype that ingests loan data and reshapes it into signals a decision-maker can act on, rather than leaving the analysis buried in spreadsheets.",
      "The project shows comfort with a data-heavy FinTech domain: modeling lending concepts, deriving indicators, and presenting them in a way that supports faster, more consistent decisions.",
      "It is a compact demonstration of how domain understanding and clean TypeScript can combine into a tool that adds clarity to an otherwise noisy dataset.",
    ],
  },
  {
    id: "micro-ott",
    name: "micro-ott",
    domain: "Platform Architecture",
    repoUrl: "https://github.com/vasistasandeep/micro-ott",
    demoUrl: "https://microott.vercel.app",
    tags: ["Microservices", "OTT", "Architecture", "TypeScript"],
    abstract:
      "A microservices reference for an OTT backend, modeling decoupled playback, listing, and subscription domains.",
    body: [
      "micro-ott is a reference architecture for an OTT backend, decomposed into decoupled services for playback, listing, and subscription concerns. It illustrates how the domains of a streaming platform can be separated for independent scaling and ownership.",
      "The project demonstrates system-design fluency: service boundaries, inter-service contracts, and the trade-offs that come with a microservices approach in a high-concurrency domain.",
      "Built in TypeScript, it doubles as a teaching artifact for how a large streaming backend can be reasoned about one bounded context at a time.",
    ],
  },
  {
    id: "ottobserve-academy",
    name: "OTTObserve Academy",
    domain: "Observability / Learning",
    repoUrl: "https://github.com/vasistasandeep/ottobserve-academy",
    demoUrl: "https://ottobserve-academy.vercel.app",
    tags: ["Observability", "MELT", "Education", "TypeScript"],
    abstract:
      "An interactive primer that teaches OTT observability concepts (MELT, SLOs, tracing) through hands-on lessons.",
    body: [
      "OTTObserve Academy is an interactive primer that teaches the core ideas of OTT observability, walking through MELT signals, SLOs, and tracing with hands-on lessons rather than dense theory.",
      "It reflects both depth in observability and a genuine interest in enablement: taking concepts that are often gatekept and turning them into an approachable learning path.",
      "The TypeScript build shows how educational content and interactive UI can be combined into a lightweight, self-contained teaching tool.",
    ],
  },
  {
    id: "storyscope",
    name: "StoryScope",
    domain: "Product / Agile",
    repoUrl: "https://github.com/vasistasandeep/StoryScope",
    demoUrl: "https://story-scope-vercel.vercel.app",
    tags: ["Product", "Agile", "Estimation", "Python"],
    abstract:
      "A story-scoping helper that guides teams to a faster, more consistent estimate of user-story size.",
    body: [
      "StoryScope is a helper for scoping user stories, guiding teams toward a faster and more consistent read on story size instead of relying on ad-hoc gut feel.",
      "The project brings product and agile experience into a practical tool, encoding estimation heuristics so that a team can converge more quickly during refinement.",
      "Implemented in Python, it demonstrates a willingness to reach for the right language for the job and to build tooling that directly supports team delivery.",
    ],
  },
  {
    id: "agile-companion",
    name: "Agile Companion",
    domain: "Program / Agile",
    repoUrl: "https://github.com/vasistasandeep/agile-companion",
    demoUrl: "https://agile-companion.vercel.app",
    tags: ["Agile", "Program Management", "Tooling", "TypeScript"],
    abstract:
      "A lightweight companion for agile ceremonies and program cadences, keeping teams aligned with less overhead.",
    body: [
      "Agile Companion is a lightweight tool for agile ceremonies and program cadences, aimed at keeping teams aligned without adding process weight.",
      "It grows directly out of program-management experience: knowing which rituals actually help, and shaping a tool that supports them rather than bureaucratizing them.",
      "The TypeScript codebase keeps the companion small and focused, a reminder that good program tooling should reduce overhead, not create it.",
    ],
  },
  {
    id: "ott-automation",
    name: "OTT Automation Suite",
    domain: "Quality / Automation",
    repoUrl: "https://github.com/vasistasandeep/sonyliv-automation",
    tags: ["Test Automation", "OTT", "Quality", "TypeScript"],
    abstract:
      "A comprehensive OTT test-automation suite (75+ tests) with a web dashboard and cross-browser coverage.",
    body: [
      "The OTT Automation Suite is a comprehensive test-automation project for streaming apps with 75+ tests, a web dashboard for results, and cross-browser coverage to catch regressions across environments.",
      "It demonstrates a quality-first mindset: treating automated tests as a first-class asset, and giving them a dashboard so results are visible and actionable rather than hidden in logs.",
      "Built in TypeScript, the suite shows how automation, reporting, and cross-browser coverage come together into a dependable quality gate for a streaming product.",
    ],
  },
];

export default projects;
