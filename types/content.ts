// types/content.ts
//
// Centralized typed content model for the executive portfolio site.
// All content is defined here (interfaces) and in `data/*.ts` (typed data).
// Components are presentational and import data; this satisfies pre-population
// (Req 20.1) and keeps exact required strings in one place (Req 14.1).

export interface NavLink { label: string; targetId: string; }

export interface Metric {
  id: string;
  label: string;      // e.g. "Peak Concurrent Viewers"
  target: number;     // e.g. 30
  prefix?: string;    // e.g. "$"
  suffix?: string;    // e.g. "M+", "%", "+", "K"
  decimals?: number;  // e.g. 2 for 99.99
  durationMs?: number; // 1000..2500 (Req 2.5)
}

export interface EventCategory {
  id: string;
  title: string;              // Cricket | Football | ...
  events: string[];           // event names
  note: string;               // scale note
  glow?: "emerald" | "cyan";
}

export interface EvolutionItem {
  id: string;
  title: string;
  before: string;             // Before-state detail
  after: string;              // After-state detail (contains required tech references)
}

export interface ArchitectureTab {
  id: string;
  label: string;              // System Design Patterns | Observability & Telemetry (MELT) | Video Streaming QoE
  items: string[];
}

export interface ManifestoCard { id: string; title: string; principle: string; }

export interface CaseStudy {
  id: string;
  title: string;
  summary: string;            // shown on the trigger card
  body: string[];             // expanded paragraphs shown in drawer
}

export interface Credential { id: string; name: string; }

export interface Testimonial {
  id: string;
  title: string;              // executive title (attribution)
  quote: string;
  linkedInUrl: string;        // placeholder link
  initials: string;           // profile badge
}

export interface LabItem {
  id: string;
  title: string;
  descriptor: string;
  kind: "ai-workflow" | "fullstack" | "other"; // ensures Req 22.2 coverage
}

export interface FlowLayer {
  id: string;
  order: number;              // 1..4 (Req 21.6)
  label: string;              // Client & Edge | API Gateway & SSAI Proxy | ...
  elements: string[];
}

export interface SiteMeta {
  name: string;               // Vasista Sandeep
  monogram: string;
  domain: string;             // vasistasandeep.in
  linkedInUrl: string;
  primaryEmail: string;       // contact@vasistasandeep.in
  fallbackEmail: string;      // vasista.sandeep@gmail.com
  formspreeEndpoint: string;
  resumePath: string;         // /Vasista_Sandeep_Resume.pdf
  portrait: {                 // Professional headshot (Hero avatar + JSON-LD image)
    src: string;              // /vasista-headshot.jpg (square, >= 400x400)
    alt: string;
  };
  footerText: string;
  og: {
    title: string;
    description: string;
    imagePath: string;        // /og-image.png (1200x630)
    siteName: string;         // Vasista Sandeep
    type: string;             // website
  };
  jsonLd: {                   // Person + ProfilePage structured data (Req 15.2)
    personName: string;       // Vasista Sandeep Srinivasa
    url: string;              // https://vasistasandeep.in
    jobTitle: string;         // Platform & Technical Product Leader
    sameAs: string[];         // [linkedInUrl]
    knowsAbout: string[];
  };
}

// Cost calculator model types (lib/costModel.ts)
export type SamplingStrategy = "standard" | "tail";

export interface CostInput { concurrency: number; sampling: SamplingStrategy; }

export interface CostResult {
  concurrency: number;        // clamped concurrency actually used
  spansPerSecond: number;     // ingested spans/sec
  monthlyCostUsd: number;     // estimated APM cost for current strategy
  baselineCostUsd: number;    // standard-ingestion cost at same concurrency
  savingsUsd: number;         // baseline - current (0 for standard)
  savingsPercent: number;     // 0 for standard; 78..82 for tail
  mttrFidelityPercent: 99.9;  // constant (Req 6.6)
}

// Contact form (lib/validation.ts)
export type ContactField = "name" | "email" | "organization" | "message";
export interface ContactValues { name: string; email: string; organization: string; message: string; }
export type ContactErrors = Partial<Record<ContactField, string>>;
