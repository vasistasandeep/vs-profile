// data/experience.ts
//
// Career timeline (source of truth: resume). Five company groups in
// most-recent-first order, each grouping one or more roles with achievement
// highlights. Consumed by components/Experience.tsx.

import type { ExperienceGroup } from "@/types/content";

export const experience: ExperienceGroup[] = [
  {
    id: "sony-pictures-networks-india",
    company: "Sony Pictures Networks India",
    domain: "OTT / Streaming",
    roles: [
      {
        id: "spn-avp-program-management",
        role: "AVP, Program Management (Tech & Product)",
        period: "Mar 2026 – Present",
        summary:
          "Governing strategic delivery and the technical roadmap for the global SonyLIV OTT platform, serving 30M+ concurrent users.",
        highlights: [
          {
            lead: "Organizational Leadership & Scale:",
            text: "Direct the executive engineering portfolio and a cross-functional 'Team of Teams' to sustain 99.99% system availability during extreme live-traffic events (250K RPS).",
          },
          {
            lead: "Personalization Strategy:",
            text: "Spearhead the technical strategy and scaling of personalization engines, driving complex cross-team integrations to deliver highly tailored end-user experiences.",
          },
          {
            lead: "Cross-Functional Governance:",
            text: "Act as the central bridge between Product and Engineering leadership, ensuring technical delivery aligns with overarching business priorities.",
          },
        ],
      },
      {
        id: "spn-lead-program-manager",
        role: "Lead Program Manager (Tech & Product)",
        period: "May 2021 – Mar 2026",
        highlights: [
          {
            lead: "Strategic OPEX & Build vs. Buy:",
            text: "Managed the multi-million-dollar budget and delivery for 'Bolt' (proprietary CMS), replacing legacy vendors to achieve a 40% reduction in publishing latency and major operational savings.",
          },
          {
            lead: "Data Governance & Scale:",
            text: "Led cross-functional squads (Legal, InfoSec, Engineering) to define technical roadmaps for US/Europe expansion, implementing robust GDPR/PII compliance frameworks.",
          },
          {
            lead: "Innovation Strategy:",
            text: "Steered the 'Mobile Web Revamp' and 'Shorts' video initiatives, driving decisions that optimized rendering performance and increased ad-inventory monetization.",
          },
          {
            lead: "Architectural Modernization:",
            text: "Drove the modularization of a legacy monolithic backend, decoupling and scaling dedicated microservices for Playback, Listing, and User Subscription Management.",
          },
        ],
      },
    ],
  },
  {
    id: "walmart-global-tech",
    company: "Walmart Global Tech",
    domain: "FinTech / Retail",
    roles: [
      {
        id: "walmart-tpm",
        role: "Technical Program Manager",
        period: "Dec 2019 – May 2021",
        highlights: [
          {
            lead: "FinTech Architecture & Operational Excellence:",
            text: "Led the engineering roadmap for the 'Post Payment Audit' system, partnering with Staff Engineers to redesign data pipelines for automated anomaly detection while championing DevOps/CI-CD practices — recovering multi-millions annually.",
          },
          {
            lead: "Retail Commerce & Platform Optimization:",
            text: "Governed cross-functional delivery of in-store financial service platforms, minimizing transaction latency, accelerating release cycles, and elevating the Point-of-Sale (POS) experience.",
          },
        ],
      },
    ],
  },
  {
    id: "conduent-inc",
    company: "Conduent Inc.",
    domain: "AI / Analytics",
    roles: [
      {
        id: "conduent-business-process-manager",
        role: "Business Process Manager",
        period: "Mar 2019 – Dec 2019",
        highlights: [
          {
            lead: "AI/ML Strategy:",
            text: "Spearheaded development of NLP-based machine-learning models for customer sentiment analysis, enabling data-driven strategies to reduce churn.",
          },
          {
            lead: "Data Visualization:",
            text: "Delivered executive dashboards (Power BI) visualizing revenue trends and operational efficiency, directly informing quarterly business reviews (QBRs).",
          },
        ],
      },
    ],
  },
  {
    id: "intel-corporation",
    company: "Intel Corporation",
    domain: "Data / Platforms",
    roles: [
      {
        id: "intel-senior-business-analyst",
        role: "Senior Business Analyst",
        period: "Jul 2016 – Mar 2019",
        highlights: [
          {
            lead: "Platform Integration:",
            text: "Managed vendor relationships and delivered an integration platform handling 10,000+ daily transactions, generating $10M in business value.",
          },
          {
            lead: "Big Data Analytics:",
            text: "Led data-analysis initiatives using Impala and Hive, applying predictive modeling to optimize supply-chain decisions.",
          },
        ],
      },
    ],
  },
  {
    id: "early-career",
    company: "Early Career",
    domain: "Business Analysis",
    roles: [
      {
        id: "early-odessa-technologies",
        role: "Business Analyst — Odessa Technologies",
        period: "Nov 2015 – Jun 2016",
        highlights: [
          { lead: "", text: "Business analysis for enterprise software delivery." },
        ],
      },
      {
        id: "early-accenture",
        role: "Business Analyst — Accenture",
        period: "Jul 2012 – Nov 2015",
        highlights: [
          {
            lead: "",
            text: "Business analysis and delivery across enterprise programs.",
          },
        ],
      },
    ],
  },
];

export default experience;
