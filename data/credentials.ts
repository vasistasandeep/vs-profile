// data/credentials.ts
//
// Credentials & Governance bar content (Req 9).
// Nine certifications with exact required names (Req 9.1).
// Pre-populated for deploy readiness (Req 20.1).

import type { Credential } from "@/types/content";

export const credentials: Credential[] = [
  { id: "pmp", name: "PMP®" },
  { id: "lssbb", name: "KPMG Lean Six Sigma Black Belt (LSSBB)" },
  { id: "lssgb", name: "Lean Six Sigma Green Belt" },
  { id: "csm", name: "Certified ScrumMaster (CSM®)" },
  { id: "cspo", name: "Certified Scrum Product Owner (CSPO®)" },
  { id: "safe-devops", name: "SAFe® 5 DevOps Practitioner" },
  { id: "itil", name: "ITIL® Certified" },
  { id: "mba-ebusiness", name: "Executive Education MBA in E-Business" },
  { id: "pg-big-data", name: "PG in Big Data Analytics" },
];

export default credentials;
