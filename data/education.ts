// data/education.ts
//
// Education entries (source of truth: resume). Consumed by
// components/Education.tsx.

import type { EducationItem } from "@/types/content";

export const education: EducationItem[] = [
  {
    id: "mba-ebusiness",
    degree: "MBA in E-Business",
    institution: "Annamalai University",
    year: "2022",
  },
  {
    id: "pg-big-data-analytics",
    degree: "Post-Graduation in Big Data Analytics",
    institution: "Illinois Institute of Technology",
    year: "2018",
  },
  {
    id: "be-electronics-instrumentation",
    degree: "B.E. in Electronics & Instrumentation",
    institution: "Visvesvaraya Technological University",
    year: "2012",
  },
];

export default education;
