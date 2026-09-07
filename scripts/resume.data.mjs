// scripts/resume.data.mjs
//
// Single source of truth for the resume content rendered into
// public/Vasista_Sandeep_Resume.pdf by scripts/generate-resume.mjs.
// Phrasing is intentionally verbatim to the approved copy — edit here, then
// re-run `npm run generate:resume` to regenerate the PDF.

export const resume = {
  name: "Vasista Sandeep Srinivasa",
  title: "Platform Product Leader & Technical Program Manager",
  location: "Bengaluru, India",
  email: "contact@vasistasandeep.in",
  linkedIn: "linkedin.com/in/vasistasandeep",
  linkedInUrl: "https://www.linkedin.com/in/vasistasandeep/",
  website: "vasistasandeep.in",
  websiteUrl: "https://vasistasandeep.in",

  summary:
    "Platform Product Leader and Technical Program Manager with 14+ years of experience engineering resilience and scale for global distributed systems. Specialized in OTT media supply chains, high-concurrency live streaming (30M+ users at 250K RPS), and full-stack observability. Proven track record of originating platform strategy, decoupling legacy monoliths, and establishing architectural governance (GDFO) to ensure 99.99% uptime during global sports events.",

  competencies: [
    {
      label: "Platform & Architecture",
      items:
        "Distributed Systems, Microservices, Server-Side Ad Insertion (SSAI), Multi-CDN Shielding, GDFO (Graceful Degradation).",
    },
    {
      label: "Observability & Telemetry",
      items:
        "OpenTelemetry (OTel), Datadog, Prometheus, Grafana, Tail-Based Sampling, SLI/SLO Governance, MELT.",
    },
    {
      label: "Product Strategy",
      items:
        "Build vs. Buy Trade-offs, Multi-Region Expansion (GDPR, US, Japan data residency), Cost vs. Latency Optimization.",
    },
  ],

  experience: [
    {
      company: "Sony Pictures Networks India",
      role: "AVP, Program Management (Tech & Product)",
      dates: "",
      bullets: [
        {
          lead: "Originated Platform Modernization:",
          text:
            "Authored the business and technical vision to replace legacy third-party vendors with a proprietary in-house CMS engine ('Bolt'), driving a 40% reduction in content publishing latency and saving multi-millions in OPEX.",
        },
        {
          lead: "Governed High-Concurrency Live Scale (30M+ Users):",
          text:
            "Directed tournament engineering readiness for global events (UEFA, Australian Open, Bilateral Cricket). Sustained 250K RPS surges with 99.99% uptime by enforcing strict token-bucket edge rate limiting and Redis cluster pre-warming.",
        },
        {
          lead: "Established GDFO via Architecture Control Committee:",
          text:
            "Formed the ACC governance framework to manage error budgets. Implemented automated circuit breakers (Envoy/Resilience4j) on non-critical endpoints to guarantee 100% core playback continuity during unpredictable traffic spikes.",
        },
        {
          lead: "Proactive Systemic Risk Discovery:",
          text:
            "Conducted independent telemetry audits ahead of major live events to map unknown vulnerabilities, discovering a 3-minute auto-scaling provisioning lag. Designed Edge-to-Persistence failover policies that completely mitigated this lag, protecting live ad monetization.",
        },
        {
          lead: "Multi-Region Compliance Expansion:",
          text:
            "Architected regional data isolation boundaries at the Gateway layer, enabling the platform's multi-territory rollout across North America, Europe (GDPR), and Japan while strictly isolating PII and subscription state.",
        },
      ],
    },
    {
      company: "Walmart Global Tech",
      role: "",
      dates: "",
      bullets: [
        {
          lead: "FinTech Data Pipeline Re-engineering:",
          text:
            "Led the product roadmap for automated financial audit platforms, transitioning manual post-payment audit processes into real-time streaming ML anomaly detection pipelines.",
        },
        {
          lead: "Revenue Recovery:",
          text:
            "Utilized Kafka event streams and Elasticsearch/Splunk log aggregation to isolate transaction anomalies, recovering millions of dollars in leaked revenue annually.",
        },
        {
          lead: "Executive Influence:",
          text:
            "Presented real-time financial data models and system health trade-offs to executive boards, securing buy-in for continuous tech-debt remediation alongside feature delivery.",
        },
      ],
    },
  ],

  credentials: [
    "MBA in E-Business & PG in Big Data Analytics",
    "Project Management Professional (PMP\u00AE)",
    "Lean Six Sigma Black Belt (LSSBB) & Green Belt (KPMG)",
    "Certified ScrumMaster (CSM\u00AE) & Certified Scrum Product Owner (CSPO\u00AE)",
    "SAFe\u00AE 5 DevOps Practitioner & ITIL\u00AE Certified",
  ],
};

export default resume;
