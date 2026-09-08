// data/navigation.ts
//
// The navbar links in exact left-to-right order with their target section IDs.
// Section `id`s must match these `targetId`s so smooth-scroll anchors resolve
// (Req 1.4, 1.6). The Governance, Endorsements, and Arcade sections remain on
// the page and scrollable, but are omitted from the top nav to keep it uncrowded.

import type { NavLink } from "@/types/content";

export const navLinks: NavLink[] = [
  { label: "Overview", targetId: "#overview" },
  { label: "Experience", targetId: "#experience" },
  { label: "Scale", targetId: "#tournaments" },
  { label: "Architecture", targetId: "#architecture" },
  { label: "Case Studies", targetId: "#case-studies" },
  { label: "Projects", targetId: "#projects" },
  { label: "Education", targetId: "#education" },
  { label: "Certifications", targetId: "#certifications" },
  { label: "Contact", targetId: "#contact" },
];
