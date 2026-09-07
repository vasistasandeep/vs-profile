// Feature: executive-portfolio-site, Property 1
//
// Property 1: Peak concurrency clamping is bounded and idempotent
//
// For any real number x supplied as peak concurrency,
// computeCost({ concurrency: x, sampling }).concurrency is always within
// [5_000_000, 30_000_000]; equals 5_000_000 when x < 5_000_000, equals
// 30_000_000 when x > 30_000_000, equals x when already in range; and
// clamping the clamped value yields the same value (idempotence).
//
// Validates: Requirements 6.8

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { computeCost } from "@/lib/costModel";
import type { SamplingStrategy } from "@/types/content";

const MIN_CONCURRENCY = 5_000_000;
const MAX_CONCURRENCY = 30_000_000;

const samplingArb: fc.Arbitrary<SamplingStrategy> = fc.constantFrom(
  "standard",
  "tail",
);

// Generator over the full real input space, biased to include out-of-range
// values (well below MIN, well above MAX) and in-range/boundary values.
const concurrencyArb: fc.Arbitrary<number> = fc.oneof(
  // Arbitrary finite doubles across a very wide range (includes out-of-range).
  fc.double({
    min: -1e9,
    max: 1e9,
    noNaN: true,
    noDefaultInfinity: true,
  }),
  // Integers spanning below MIN, within range, and above MAX.
  fc.integer({ min: -100_000_000, max: 100_000_000 }),
);

describe("Property 1: Peak concurrency clamping is bounded and idempotent", () => {
  it("keeps concurrency within [5M, 30M] and clamps correctly for any real x (Req 6.8)", () => {
    fc.assert(
      fc.property(concurrencyArb, samplingArb, (x, sampling) => {
        const { concurrency } = computeCost({ concurrency: x, sampling });

        // Bounded within the inclusive slider range.
        expect(concurrency).toBeGreaterThanOrEqual(MIN_CONCURRENCY);
        expect(concurrency).toBeLessThanOrEqual(MAX_CONCURRENCY);

        // Correct piecewise clamping.
        if (x < MIN_CONCURRENCY) {
          expect(concurrency).toBe(MIN_CONCURRENCY);
        } else if (x > MAX_CONCURRENCY) {
          expect(concurrency).toBe(MAX_CONCURRENCY);
        } else {
          expect(concurrency).toBe(x);
        }
      }),
      { numRuns: 100 },
    );
  });

  it("is idempotent — re-clamping the clamped value yields the same value (Req 6.8)", () => {
    fc.assert(
      fc.property(concurrencyArb, samplingArb, (x, sampling) => {
        const once = computeCost({ concurrency: x, sampling }).concurrency;
        const twice = computeCost({ concurrency: once, sampling }).concurrency;

        expect(twice).toBe(once);
      }),
      { numRuns: 100 },
    );
  });
});
