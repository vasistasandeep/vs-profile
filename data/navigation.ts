// data/navigation.ts
//
// The seven navbar links in exact left-to-right order with their target
// section IDs. Section `id`s must match these `targetId`s so smooth-scroll
// anchors resolve (Req 1.4, 1.6).

import type { NavLink } from "@/types/content";

export const navLinks: NavLink[] = [
  { label: "Overview", targetId: "#overview" },
  { label: "Scale & Tournaments", targetId: "#tournaments" },
  { label: "Architecture", targetId: "#architecture" },
  { label: "Case Studies", targetId: "#case-studies" },
  { label: "Governance", targetId: "#governance" },
  { label: "Endorsements", targetId: "#endorsements" },
  { label: "Contact", targetId: "#contact" },
];
