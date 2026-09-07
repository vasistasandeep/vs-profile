// Feature: executive-portfolio-site, Property 2
//
// Property 2: Ingested spans per second is state derived and monotonic
//
// For any concurrency value, the standard-strategy `spansPerSecond` equals
// `clamp(concurrency) * SPANS_PER_USER_PER_SECOND`, and `spansPerSecond` is a
// monotonic non-decreasing function of concurrency for a fixed strategy.
//
// Validates: Requirements 6.3, 6.7

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  computeCost,
  clamp,
  SPANS_PER_USER_PER_SECOND,
} from "@/lib/costModel";
import type { SamplingStrategy } from "@/types/content";

// Model clamp bounds (Req 6.8). Kept local so the test derives the expected
// spans/sec independently of the model's internal computation.
const MIN_CONCURRENCY = 5_000_000;
const MAX_CONCURRENCY = 30_000_000;

// Generate concurrency values spanning below-range, in-range, and above-range
// so the derivation and monotonicity checks exercise the clamp boundaries.
const concurrencyArb = fc.oneof(
  fc.double({
    min: 0,
    max: MAX_CONCURRENCY * 2,
    noNaN: true,
    noDefaultInfinity: true,
  }),
  fc.integer({ min: 0, max: MAX_CONCURRENCY * 2 }),
);

const strategyArb: fc.Arbitrary<SamplingStrategy> = fc.constantFrom(
  "standard",
  "tail",
);

describe("Property 2: Ingested spans per second is state derived and monotonic", () => {
  it("derives standard spansPerSecond as clamp(concurrency) * SPANS_PER_USER_PER_SECOND (Req 6.3)", () => {
    fc.assert(
      fc.property(concurrencyArb, (concurrency) => {
        const result = computeCost({ concurrency, sampling: "standard" });
        const expected =
          clamp(concurrency, MIN_CONCURRENCY, MAX_CONCURRENCY) *
          SPANS_PER_USER_PER_SECOND;

        expect(result.spansPerSecond).toBe(expected);
      }),
      { numRuns: 100 },
    );
  });

  it("is non-decreasing in concurrency for a fixed strategy (Req 6.7)", () => {
    fc.assert(
      fc.property(
        // Generate ordered pairs a <= b so monotonicity can be asserted directly.
        fc
          .tuple(concurrencyArb, concurrencyArb)
          .map(([x, y]) => (x <= y ? [x, y] : [y, x]) as [number, number]),
        strategyArb,
        ([a, b], sampling) => {
          const lower = computeCost({ concurrency: a, sampling });
          const higher = computeCost({ concurrency: b, sampling });

          expect(lower.spansPerSecond).toBeLessThanOrEqual(
            higher.spansPerSecond,
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});
