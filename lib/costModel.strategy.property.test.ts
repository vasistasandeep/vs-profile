// Feature: executive-portfolio-site, Property 4
//
// Property 4: Sampling strategy determines savings semantics and computation
// is deterministic.
//
// For any input, computeCost is deterministic (equal inputs produce equal
// outputs), and:
//   - when sampling === "standard", savingsPercent === 0 && savingsUsd === 0;
//   - when sampling === "tail", savingsPercent is in [78, 82] and
//     savingsUsd > 0 whenever baselineCostUsd > 0.
//
// Validates: Requirements 6.7, 6.4

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { computeCost } from "@/lib/costModel";
import type { SamplingStrategy } from "@/types/content";

const samplingArb: fc.Arbitrary<SamplingStrategy> = fc.constantFrom(
  "standard",
  "tail",
);

// Cover the full real line, including values far below the 5M lower bound and
// far above the 30M upper bound so the clamping path is exercised alongside
// the in-range values.
const concurrencyArb: fc.Arbitrary<number> = fc.double({
  min: -1_000_000_000,
  max: 1_000_000_000,
  noNaN: true,
});

describe("Property 4: Sampling strategy determines savings semantics and computation is deterministic", () => {
  it("is deterministic — equal inputs produce equal outputs (Req 6.7, 6.4)", () => {
    fc.assert(
      fc.property(concurrencyArb, samplingArb, (concurrency, sampling) => {
        const first = computeCost({ concurrency, sampling });
        const second = computeCost({ concurrency, sampling });
        expect(second).toEqual(first);
      }),
      { numRuns: 100 },
    );
  });

  it('yields zero savings when sampling === "standard" (Req 6.7, 6.4)', () => {
    fc.assert(
      fc.property(concurrencyArb, (concurrency) => {
        const { savingsPercent, savingsUsd } = computeCost({
          concurrency,
          sampling: "standard",
        });
        return savingsPercent === 0 && savingsUsd === 0;
      }),
      { numRuns: 100 },
    );
  });

  it('keeps savingsPercent in [78, 82] and yields positive savings when baseline > 0 for sampling === "tail" (Req 6.7, 6.4)', () => {
    fc.assert(
      fc.property(concurrencyArb, (concurrency) => {
        const { savingsPercent, savingsUsd, baselineCostUsd } = computeCost({
          concurrency,
          sampling: "tail",
        });

        const percentInBand = savingsPercent >= 78 && savingsPercent <= 82;
        const savingsPositiveWhenBaselinePositive =
          baselineCostUsd > 0 ? savingsUsd > 0 : true;

        return percentInBand && savingsPositiveWhenBaselinePositive;
      }),
      { numRuns: 100 },
    );
  });
});
