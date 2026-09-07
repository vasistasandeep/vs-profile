// Feature: executive-portfolio-site, Property 15
//
// Property 15: Labs dataset covers required kinds with complete fields
//
// For any valid build of the labs dataset, it contains at least one item with
// kind === "ai-workflow" and at least one with kind === "fullstack", and every
// item has a non-empty title and non-empty descriptor.
//
// Validates: Requirements 22.2, 22.3

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { labs } from "@/data/labs";
import type { LabItem } from "@/types/content";

const isNonEmpty = (value: string): boolean =>
  typeof value === "string" && value.trim().length > 0;

describe("Property 15: Labs dataset covers required kinds with complete fields", () => {
  it("has at least one ai-workflow item and at least one fullstack item (Req 22.2)", () => {
    // Aggregate kind-coverage over the fixed dataset.
    expect(labs.some((item) => item.kind === "ai-workflow")).toBe(true);
    expect(labs.some((item) => item.kind === "fullstack")).toBe(true);
  });

  it("has a non-empty title and descriptor for every sampled item (Req 22.3)", () => {
    // The dataset is fixed, so sample items from the array with fast-check and
    // assert the per-item completeness invariant across many runs.
    expect(labs.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(fc.constantFrom(...labs), (item: LabItem) => {
        return isNonEmpty(item.title) && isNonEmpty(item.descriptor);
      }),
      { numRuns: 100 },
    );
  });
});
