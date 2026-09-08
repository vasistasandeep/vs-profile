// data/projects.example.test.ts
//
// Example checks for the Projects data model. Each project must carry the
// essentials a recruiter-facing card and details modal rely on: a name, an
// abstract, a GitHub repo URL, and at least one tag. Optional demo URLs, when
// present, must be absolute https links.

import { describe, it, expect } from "vitest";

import { projects } from "@/data/projects";

describe("data/projects", () => {
  it("has at least one project", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("gives every project a unique id", () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const project of projects) {
    describe(`project: ${project.id}`, () => {
      it("has a non-empty name and abstract", () => {
        expect(project.name.trim().length).toBeGreaterThan(0);
        expect(project.abstract.trim().length).toBeGreaterThan(0);
      });

      it("has a GitHub repo URL", () => {
        expect(project.repoUrl.trim().length).toBeGreaterThan(0);
        expect(project.repoUrl.startsWith("https://github.com/")).toBe(true);
      });

      it("has at least one tag", () => {
        expect(project.tags.length).toBeGreaterThanOrEqual(1);
      });

      it("has at least one body paragraph", () => {
        expect(project.body.length).toBeGreaterThanOrEqual(1);
      });

      it("uses an absolute https demo URL when present", () => {
        if (project.demoUrl) {
          expect(project.demoUrl.startsWith("https://")).toBe(true);
        }
      });
    });
  }
});
