// Feature: executive-portfolio-site, Property 5
//
// Property 5: MTTR fidelity is constant across all inputs
//
// For any concurrency value (including out-of-range values that are clamped)
// and for any sampling strategy ("standard" | "tail"),
// computeCost(...).mttrFidelityPercent === 99.9.
//
// Validates: Requirements 6.6

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { computeCost } from "@/lib/costModel";
import type { SamplingStrategy } from "@/types/content";

describe("Property 5: MTTR fidelity is constant across all inputs", () => {
  it("returns mttrFidelityPercent === 99.9 for any concurrency and any strategy (Req 6.6)", () => {
    // Cover the full real line, including values far below the 5M lower bound
    // and far above the 30M upper bound so the clamping path is exercised,
    // combined with both sampling strategies.
    fc.assert(
      fc.property(
        fc.double({
          min: -1_000_000_000,
          max: 1_000_000_000,
          noNaN: true,
        }),
        fc.constantFrom<SamplingStrategy>("standard", "tail"),
        (concurrency: number, sampling: SamplingStrategy) => {
          const { mttrFidelityPercent } = computeCost({ concurrency, sampling });
          return mttrFidelityPercent === 99.9;
        },
      ),
      { numRuns: 100 },
    );
  });
});
