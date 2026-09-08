// scripts/resume.data.mjs
//
// Single source of truth for the downloadable Profile PDF, rendered into
// public/Vasista_Sandeep_Resume.pdf by scripts/generate-resume.mjs. Content is
// aligned to the real resume. Edit here, then run `npm run generate:profile`.

export const resume = {
  name: "Vasista Sandeep S",
  title: "AVP, Program Management (Tech & Product)",
  location: "Bengaluru, India",
  email: "vasista.sandeep@gmail.com",
  phone: "+91 99869 88057",
  linkedIn: "linkedin.com/in/vasistasandeep",
  linkedInUrl: "https://www.linkedin.com/in/vasistasandeep/",
  website: "vasistasandeep.in",
  websiteUrl: "https://vasistasandeep.in",

  summary:
    "Executive technology leader and Six Sigma Black Belt with 14+ years scaling massive consumer platforms, engineering portfolios, and cross-functional organizations. Expert in bridging product strategy with engineering execution for high-volume streaming and commerce platforms (30M+ users). Proven track record of building 'Team of Teams' structures, managing multi-million-dollar roadmaps, and driving architectural transformations across OTT, Finance, and Retail. Passionate about leveraging GenAI and modern data stacks to drive business innovation.",

  competencies: [
    {
      label: "Group Leadership",
      items:
        "Portfolio Management, Resource Planning, Budget Governance, Executive Reporting, Vendor Management, Cross-Functional Governance.",
    },
    {
      label: "Domain Expertise",
      items:
        "OTT / Streaming (SonyLIV), FinTech & Retail Commerce (Walmart), Personalization Engines, Identity Management (SSO), Data Privacy (GDPR).",
    },
    {
      label: "Technical Strategy",
      items:
        "Microservices Architecture, High-Availability Distributed Systems (99.99%), Cloud Architecture (AWS/Azure), GenAI Integrations, Load Testing Strategy.",
    },
    {
      label: "Tools",
      items: "Jira, BigPicture, Confluence, Python, SQL, Power BI, Tableau.",
    },
  ],

  experience: [
    {
      company: "Sony Pictures Networks India",
      role: "AVP, Program Management (Tech & Product)",
      dates: "Mar 2026 - Present",
      bullets: [
        {
          lead: "Organizational Leadership & Scale:",
          text:
            "Direct the executive engineering portfolio and a cross-functional 'Team of Teams' to sustain 99.99% system availability during extreme live-traffic events (250K RPS) on the global SonyLIV OTT platform (30M+ concurrent users).",
        },
        {
          lead: "Personalization Strategy:",
          text:
            "Spearhead the technical strategy and scaling of personalization engines, driving complex cross-team integrations to deliver highly tailored end-user experiences.",
        },
        {
          lead: "Cross-Functional Governance:",
          text:
            "Act as the central bridge between Product and Engineering leadership, ensuring technical delivery aligns with overarching business priorities.",
        },
      ],
    },
    {
      company: "Sony Pictures Networks India",
      role: "Lead Program Manager (Tech & Product)",
      dates: "May 2021 - Mar 2026",
      bullets: [
        {
          lead: "Strategic OPEX & Build vs. Buy:",
          text:
            "Managed the multi-million-dollar budget and delivery for 'Bolt' (proprietary CMS), replacing legacy vendors to achieve a 40% reduction in publishing latency and major operational savings.",
        },
        {
          lead: "Data Governance & Scale:",
          text:
            "Led cross-functional squads (Legal, InfoSec, Engineering) to define technical roadmaps for US/Europe expansion, implementing robust GDPR/PII compliance frameworks.",
        },
        {
          lead: "Innovation Strategy:",
          text:
            "Steered the 'Mobile Web Revamp' and 'Shorts' video initiatives, driving decisions that optimized rendering performance and increased ad-inventory monetization.",
        },
        {
          lead: "Architectural Modernization:",
          text:
            "Drove the modularization of a legacy monolithic backend, decoupling and scaling dedicated microservices for Playback, Listing, and User Subscription Management.",
        },
      ],
    },
    {
      company: "Walmart Global Tech",
      role: "Technical Program Manager",
      dates: "Dec 2019 - May 2021",
      bullets: [
        {
          lead: "FinTech Architecture & Operational Excellence:",
          text:
            "Led the engineering roadmap for the 'Post Payment Audit' system, partnering with Staff Engineers to redesign data pipelines for automated anomaly detection while championing DevOps/CI-CD practices - recovering multi-millions annually.",
        },
        {
          lead: "Retail Commerce & Platform Optimization:",
          text:
            "Governed cross-functional delivery of in-store financial service platforms, minimizing transaction latency, accelerating release cycles, and elevating the Point-of-Sale (POS) experience.",
        },
      ],
    },
    {
      company: "Conduent Inc.",
      role: "Business Process Manager",
      dates: "Mar 2019 - Dec 2019",
      bullets: [
        {
          lead: "AI/ML Strategy:",
          text:
            "Spearheaded development of NLP-based machine-learning models for customer sentiment analysis, enabling data-driven strategies to reduce churn.",
        },
        {
          lead: "Data Visualization:",
          text:
            "Delivered executive dashboards (Power BI) visualizing revenue trends and operational efficiency, directly informing quarterly business reviews (QBRs).",
        },
      ],
    },
    {
      company: "Intel Corporation",
      role: "Senior Business Analyst",
      dates: "Jul 2016 - Mar 2019",
      bullets: [
        {
          lead: "Platform Integration:",
          text:
            "Managed vendor relationships and delivered an integration platform handling 10,000+ daily transactions, generating $10M in business value.",
        },
        {
          lead: "Big Data Analytics:",
          text:
            "Led data-analysis initiatives using Impala and Hive, applying predictive modeling to optimize supply-chain decisions.",
        },
      ],
    },
    {
      company: "Early Career",
      role: "Business Analyst - Odessa Technologies; Accenture",
      dates: "Jul 2012 - Jun 2016",
      bullets: [
        {
          lead: "",
          text:
            "Business analysis and delivery across enterprise software programs at Odessa Technologies (2015-2016) and Accenture (2012-2015).",
        },
      ],
    },
  ],

  education: [
    "MBA in E-Business - Annamalai University (2022)",
    "PG in Big Data Analytics - Illinois Institute of Technology (2018)",
    "B.E. in Electronics & Instrumentation - Visvesvaraya Technological University (2012)",
  ],

  credentials: [
    "PMP Certified (PMP#-3195092)",
    "Lean Six Sigma Black Belt, KPMG (DL122024138)",
    "Lean Six Sigma Green Belt, KPMG (BG122014272)",
    "SAFe 5 DevOps Practitioner (86530983-9427)",
    "Certified ScrumMaster - CSM (000594368)",
    "Certified Scrum Product Owner - CSPO (000594368)",
    "ITIL Certified & Practitioner (GR750213195VS)",
  ],
};

export default resume;
