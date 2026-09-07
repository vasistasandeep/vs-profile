// Feature: executive-portfolio-site, Property 3
//
// Property 3: Tail based sampling savings stay within the target band
//
// For any concurrency value (including out-of-range values that are clamped),
// computeCost({ concurrency, sampling: "tail" }).savingsPercent is
// greater than or equal to 78 and less than or equal to 82.
//
// Validates: Requirements 6.5

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { computeCost } from "@/lib/costModel";

describe("Property 3: Tail based sampling savings stay within the target band", () => {
  it("keeps savingsPercent within [78, 82] for any real-number concurrency (Req 6.5)", () => {
    // Cover the full real line, including values far below the 5M lower bound
    // and far above the 30M upper bound so the clamping path is exercised.
    fc.assert(
      fc.property(
        fc.double({
          min: -1_000_000_000,
          max: 1_000_000_000,
          noNaN: true,
        }),
        (concurrency: number) => {
          const { savingsPercent } = computeCost({ concurrency, sampling: "tail" });
          return savingsPercent >= 78 && savingsPercent <= 82;
        },
      ),
      { numRuns: 100 },
    );
  });

  it("keeps savingsPercent within [78, 82] for any integer concurrency incl. out-of-range (Req 6.5)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -50_000_000, max: 100_000_000 }),
        (concurrency: number) => {
          const { savingsPercent } = computeCost({ concurrency, sampling: "tail" });
          return savingsPercent >= 78 && savingsPercent <= 82;
        },
      ),
      { numRuns: 100 },
    );
  });
});
