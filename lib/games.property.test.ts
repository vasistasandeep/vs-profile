// Feature: executive-portfolio-site, Arcade games — pure logic properties.
//
// Property-based tests for the deterministic game logic in lib/games.ts.

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  triviaPoints,
  nextStreak,
  incidentScore,
  riceScore,
  optimalOrder,
  orderingAccuracy,
  prioritizationScore,
  type Feature,
} from "@/lib/games";

describe("Trivia scoring", () => {
  it("wrong answers always score 0 and reset the streak", () => {
    fc.assert(
      fc.property(fc.integer({ min: -5, max: 100 }), (streak) => {
        expect(triviaPoints(false, streak)).toBe(0);
        expect(nextStreak(false, streak)).toBe(0);
      }),
      { numRuns: 100 },
    );
  });

  it("correct answers score >= 100 and are non-decreasing in streak", () => {
    fc.assert(
      fc.property(fc.nat({ max: 50 }), (streak) => {
        const p = triviaPoints(true, streak);
        expect(p).toBeGreaterThanOrEqual(100);
        // Higher prior streak never scores less.
        expect(triviaPoints(true, streak + 1)).toBeGreaterThanOrEqual(p);
      }),
      { numRuns: 100 },
    );
  });

  it("a correct answer increments the streak by exactly 1", () => {
    fc.assert(
      fc.property(fc.nat({ max: 100 }), (streak) => {
        expect(nextStreak(true, streak)).toBe(streak + 1);
      }),
      { numRuns: 100 },
    );
  });
});

describe("Incident scoring", () => {
  it("wrong decisions always score 0", () => {
    fc.assert(
      fc.property(fc.double({ min: 0, max: 60000, noNaN: true }), (ms) => {
        expect(incidentScore(false, ms)).toBe(0);
      }),
      { numRuns: 100 },
    );
  });

  it("correct decisions never score below the floor and decay with time", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 100000, noNaN: true }),
        (ms) => {
          const s = incidentScore(true, ms);
          expect(s).toBeGreaterThanOrEqual(50); // default floor
          // A faster (smaller) elapsed time never scores worse.
          const faster = incidentScore(true, ms / 2);
          expect(faster).toBeGreaterThanOrEqual(s);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// A generator of well-formed features (effort > 0 so RICE is finite).
const featureArb: fc.Arbitrary<Feature> = fc.record({
  id: fc.string({ minLength: 1 }),
  name: fc.string(),
  reach: fc.nat({ max: 100000 }),
  impact: fc.constantFrom(0.25, 0.5, 1, 2, 3),
  confidence: fc.double({ min: 0, max: 1, noNaN: true }),
  effort: fc.double({ min: 0.5, max: 24, noNaN: true }),
});

// A list of features with unique ids (so ordering is well-defined).
const uniqueFeaturesArb = fc
  .uniqueArray(featureArb, {
    minLength: 1,
    maxLength: 8,
    selector: (f) => f.id,
  });

describe("Prioritization (RICE)", () => {
  it("riceScore is non-negative and 0 when effort <= 0", () => {
    fc.assert(
      fc.property(featureArb, (f) => {
        expect(riceScore(f)).toBeGreaterThanOrEqual(0);
        expect(riceScore({ ...f, effort: 0 })).toBe(0);
        expect(riceScore({ ...f, effort: -3 })).toBe(0);
      }),
      { numRuns: 100 },
    );
  });

  it("optimalOrder is a permutation sorted by descending RICE", () => {
    fc.assert(
      fc.property(uniqueFeaturesArb, (features) => {
        const order = optimalOrder(features);
        // Permutation: same set of ids, same length.
        expect(order.length).toBe(features.length);
        expect(new Set(order)).toEqual(new Set(features.map((f) => f.id)));
        // Descending RICE along the order.
        const byId = new Map(features.map((f) => [f.id, f]));
        for (let i = 0; i + 1 < order.length; i++) {
          const a = riceScore(byId.get(order[i])!);
          const b = riceScore(byId.get(order[i + 1])!);
          expect(a).toBeGreaterThanOrEqual(b);
        }
      }),
      { numRuns: 100 },
    );
  });

  it("orderingAccuracy is 1 for the optimal order and in [0,1] for any order", () => {
    fc.assert(
      fc.property(uniqueFeaturesArb, (features) => {
        const optimal = optimalOrder(features);
        expect(orderingAccuracy(optimal, optimal)).toBe(1);

        // A reversed order is still within [0, 1].
        const reversed = [...optimal].reverse();
        const acc = orderingAccuracy(reversed, optimal);
        expect(acc).toBeGreaterThanOrEqual(0);
        expect(acc).toBeLessThanOrEqual(1);

        // prioritizationScore tracks accuracy and stays in [0, 1000].
        const score = prioritizationScore(reversed, optimal);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1000);
      }),
      { numRuns: 100 },
    );
  });
});
