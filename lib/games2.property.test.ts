// Feature: executive-portfolio-site, Arcade games (Error Budget Balancer &
// Sprint Capacity Planner) — pure logic properties.
//
// Property-based + example tests for the deterministic logic added in
// lib/games.ts for games 4 and 5.

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  errorBudgetScore,
  MAX_BURN_PER_PERIOD,
  DEFAULT_ERROR_BUDGET,
  selectedPoints,
  selectedValue,
  isWithinCapacity,
  optimalValue,
  capacityScore,
  type WorkItem,
} from "@/lib/games";

// ---------------------------------------------------------------------------
// Error Budget Balancer
// ---------------------------------------------------------------------------

const aggressivenessArb = fc.array(
  fc.double({ min: 0, max: 1, noNaN: true }),
  { minLength: 1, maxLength: 3 },
);

describe("Error Budget Balancer scoring", () => {
  it("score is always in [0, 1000] for any clamped input", () => {
    fc.assert(
      fc.property(aggressivenessArb, (agg) => {
        const { score } = errorBudgetScore(agg);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1000);
      }),
      { numRuns: 100 },
    );
  });

  it("out-of-range inputs are clamped (never throws, stays in bounds)", () => {
    fc.assert(
      fc.property(
        fc.array(fc.double({ min: -5, max: 5, noNaN: true }), {
          minLength: 1,
          maxLength: 3,
        }),
        (agg) => {
          const r = errorBudgetScore(agg);
          expect(r.score).toBeGreaterThanOrEqual(0);
          expect(r.score).toBeLessThanOrEqual(1000);
          expect(r.budgetUsedPct).toBeGreaterThanOrEqual(0);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("within budget: raising one period's aggressiveness never lowers the score", () => {
    // Use a small, always-within-budget base so bumping one lever keeps us
    // under budget and monotonically increases velocity (thus score).
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 0.3, noNaN: true }),
        fc.double({ min: 0, max: 0.2, noNaN: true }),
        (base, bump) => {
          const low = errorBudgetScore([base, base, base]);
          const high = errorBudgetScore([base + bump, base, base]);
          // Both remain within budget by construction (max 0.5*45*3 = 67.5 < 100).
          expect(low.withinBudget).toBe(true);
          expect(high.withinBudget).toBe(true);
          expect(high.score).toBeGreaterThanOrEqual(low.score);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("blowing the budget is penalized vs. a within-budget plan of equal velocity shape", () => {
    // Max aggressiveness across 3 periods burns 3*45 = 135 > 100 budget.
    const blown = errorBudgetScore([1, 1, 1]);
    expect(blown.withinBudget).toBe(false);
    // A conservative plan stays within budget and should not score 0.
    const safe = errorBudgetScore([0.3, 0.3, 0.3]);
    expect(safe.withinBudget).toBe(true);
    expect(safe.score).toBeGreaterThan(0);
    // The blown plan is heavily penalized relative to its raw velocity.
    expect(blown.score).toBeLessThan(1000);
  });

  it("empty plan or non-positive budget scores 0 and is within budget", () => {
    expect(errorBudgetScore([])).toEqual({
      score: 0,
      budgetUsedPct: 0,
      withinBudget: true,
    });
    expect(errorBudgetScore([0.5, 0.5], { budget: 0 }).score).toBe(0);
  });

  it("budgetUsedPct reflects consumed / budget", () => {
    // Single period at full aggressiveness burns MAX_BURN_PER_PERIOD units.
    const r = errorBudgetScore([1], { budget: DEFAULT_ERROR_BUDGET });
    expect(r.budgetUsedPct).toBeCloseTo(
      (MAX_BURN_PER_PERIOD / DEFAULT_ERROR_BUDGET) * 100,
      5,
    );
  });
});

// ---------------------------------------------------------------------------
// Sprint Capacity Planner
// ---------------------------------------------------------------------------

const workItemArb: fc.Arbitrary<WorkItem> = fc.record({
  id: fc.string({ minLength: 1 }),
  name: fc.string(),
  points: fc.nat({ max: 10 }),
  value: fc.nat({ max: 20 }),
});

const backlogArb = fc.uniqueArray(workItemArb, {
  minLength: 1,
  maxLength: 8,
  selector: (i) => i.id,
});

describe("Sprint Capacity Planner", () => {
  it("selectedPoints and selectedValue are additive over the selection", () => {
    fc.assert(
      fc.property(backlogArb, (items) => {
        const ids = items.map((i) => i.id);
        const totalPoints = items.reduce((s, i) => s + i.points, 0);
        const totalValue = items.reduce((s, i) => s + i.value, 0);
        expect(selectedPoints(items, ids)).toBe(totalPoints);
        expect(selectedValue(items, ids)).toBe(totalValue);
        // Empty selection is 0.
        expect(selectedPoints(items, [])).toBe(0);
        expect(selectedValue(items, [])).toBe(0);
      }),
      { numRuns: 100 },
    );
  });

  it("isWithinCapacity respects the boundary (points == capacity is within)", () => {
    fc.assert(
      fc.property(backlogArb, (items) => {
        const ids = items.map((i) => i.id);
        const pts = selectedPoints(items, ids);
        expect(isWithinCapacity(items, ids, pts)).toBe(true);
        if (pts > 0) {
          expect(isWithinCapacity(items, ids, pts - 1)).toBe(false);
        }
      }),
      { numRuns: 100 },
    );
  });

  it("optimalValue >= any feasible selection's value", () => {
    fc.assert(
      fc.property(
        backlogArb,
        fc.nat({ max: 40 }),
        fc.array(fc.nat({ max: 7 }), { maxLength: 8 }),
        (items, capacity, picks) => {
          // Build a selection from index picks (unique via Set).
          const chosen = Array.from(
            new Set(picks.map((p) => items[p % items.length]?.id).filter(Boolean)),
          ) as string[];
          const opt = optimalValue(items, capacity);
          if (isWithinCapacity(items, chosen, capacity)) {
            expect(opt).toBeGreaterThanOrEqual(selectedValue(items, chosen));
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it("capacityScore is in [0, 1000] and 0 when over capacity", () => {
    fc.assert(
      fc.property(
        backlogArb,
        fc.nat({ max: 40 }),
        fc.array(fc.nat({ max: 7 }), { maxLength: 8 }),
        (items, capacity, picks) => {
          const chosen = Array.from(
            new Set(picks.map((p) => items[p % items.length]?.id).filter(Boolean)),
          ) as string[];
          const score = capacityScore(items, chosen, capacity);
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(1000);
          if (!isWithinCapacity(items, chosen, capacity)) {
            expect(score).toBe(0);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it("an optimal selection scores 1000 (example: known knapsack)", () => {
    const items: WorkItem[] = [
      { id: "a", name: "A", points: 4, value: 10 },
      { id: "b", name: "B", points: 3, value: 7 },
      { id: "c", name: "C", points: 5, value: 6 },
    ];
    // Capacity 7: best is A+B (7 pts, value 17). Optimal value = 17.
    expect(optimalValue(items, 7)).toBe(17);
    expect(capacityScore(items, ["a", "b"], 7)).toBe(1000);
    // Over capacity scores 0.
    expect(capacityScore(items, ["a", "b", "c"], 7)).toBe(0);
    // Empty optimal (capacity 0) scores 0.
    expect(capacityScore(items, [], 0)).toBe(0);
  });
});
