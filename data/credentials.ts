// data/credentials.ts
//
// Credentials & Governance content (Req 9), corrected to the resume as the
// source of truth. Seven real certifications with exact names.
//
// `credentials` (Credential[]) is retained for backward compatibility with the
// existing Credentials component + tests, now carrying resume-accurate names.
// `credentialDetails` (CredentialDetail[]) adds the issuer + credential id for
// each certification and is rendered by the Education component.

import type { Credential, CredentialDetail } from "@/types/content";

export const credentials: Credential[] = [
  { id: "pmp", name: "PMP Certified" },
  { id: "lssbb", name: "Lean Six Sigma Black Belt" },
  { id: "lssgb", name: "Lean Six Sigma Green Belt" },
  { id: "safe-devops", name: "SAFe 5 DevOps Practitioner" },
  { id: "csm", name: "Certified ScrumMaster (CSM)" },
  { id: "cspo", name: "Certified Scrum Product Owner (CSPO)" },
  { id: "itil", name: "ITIL Certified & Practitioner" },
];

export const credentialDetails: CredentialDetail[] = [
  { id: "pmp", name: "PMP Certified", credentialId: "PMP#-3195092", issuer: "PMI" },
  {
    id: "lssbb",
    name: "Lean Six Sigma Black Belt",
    credentialId: "DL122024138",
    issuer: "KPMG",
  },
  {
    id: "lssgb",
    name: "Lean Six Sigma Green Belt",
    credentialId: "BG122014272",
    issuer: "KPMG",
  },
  {
    id: "safe-devops",
    name: "SAFe 5 DevOps Practitioner",
    credentialId: "86530983-9427",
  },
  {
    id: "csm",
    name: "Certified ScrumMaster (CSM)",
    credentialId: "000594368",
  },
  {
    id: "cspo",
    name: "Certified Scrum Product Owner (CSPO)",
    credentialId: "000594368",
  },
  {
    id: "itil",
    name: "ITIL Certified & Practitioner",
    credentialId: "GR750213195VS",
  },
];

export default credentials;
