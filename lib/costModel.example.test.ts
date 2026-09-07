// lib/costModel.example.test.ts
//
// Example / unit tests for the pure cost-calculator model (task 12.1).
// Asserts exact numeric boundary values at the min (5M) and max (30M) peak
// concurrency under BOTH sampling strategies, covering spans/sec, cost,
// savings, and the always-constant 99.9% MTTR fidelity statement.
//
// Validates: Requirements 6.1, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8

import { describe, expect, it } from "vitest";
import { computeCost } from "@/lib/costModel";

const MIN_CONCURRENCY = 5_000_000;
const MAX_CONCURRENCY = 30_000_000;

describe("computeCost — boundary example cases (task 12.1)", () => {
  describe("Standard 100% ingestion", () => {
    it("min (5M) yields full-ingestion spans/sec, cost, and zero savings", () => {
      const result = computeCost({
        concurrency: MIN_CONCURRENCY,
        sampling: "standard",
      });

      expect(result.concurrency).toBe(MIN_CONCURRENCY);
      // 5M users * 5 spans/user/sec.
      expect(result.spansPerSecond).toBe(25_000_000);
      // round((25M * 144_000 / 1M) * 0.65) = 2,340,000
      expect(result.baselineCostUsd).toBe(2_340_000);
      expect(result.monthlyCostUsd).toBe(2_340_000);
      expect(result.savingsUsd).toBe(0);
      expect(result.savingsPercent).toBe(0);
      // Always-present 99.9% MTTR fidelity statement (Req 6.6).
      expect(result.mttrFidelityPercent).toBe(99.9);
    });

    it("max (30M) yields full-ingestion spans/sec, cost, and zero savings", () => {
      const result = computeCost({
        concurrency: MAX_CONCURRENCY,
        sampling: "standard",
      });

      expect(result.concurrency).toBe(MAX_CONCURRENCY);
      expect(result.spansPerSecond).toBe(150_000_000);
      // round((150M * 144_000 / 1M) * 0.65) = 14,040,000
      expect(result.baselineCostUsd).toBe(14_040_000);
      expect(result.monthlyCostUsd).toBe(14_040_000);
      expect(result.savingsUsd).toBe(0);
      expect(result.savingsPercent).toBe(0);
      expect(result.mttrFidelityPercent).toBe(99.9);
    });
  });

  describe("Tail-based intelligent sampling", () => {
    it("min (5M) yields reduced spans/sec, 78% savings, and preserved MTTR", () => {
      const result = computeCost({
        concurrency: MIN_CONCURRENCY,
        sampling: "tail",
      });

      expect(result.concurrency).toBe(MIN_CONCURRENCY);
      // round(25M * 0.0199) = 497,500
      expect(result.spansPerSecond).toBe(497_500);
      expect(result.baselineCostUsd).toBe(2_340_000);
      // normalized = 0 -> savingsPercent = 78 (lower band, Req 6.5)
      expect(result.savingsPercent).toBe(78);
      // round(2,340,000 * (1 - 0.78)) = 514,800
      expect(result.monthlyCostUsd).toBe(514_800);
      expect(result.savingsUsd).toBe(1_825_200);
      expect(result.mttrFidelityPercent).toBe(99.9);
    });

    it("max (30M) yields reduced spans/sec, 82% savings, and preserved MTTR", () => {
      const result = computeCost({
        concurrency: MAX_CONCURRENCY,
        sampling: "tail",
      });

      expect(result.concurrency).toBe(MAX_CONCURRENCY);
      // round(150M * 0.0199) = 2,985,000
      expect(result.spansPerSecond).toBe(2_985_000);
      expect(result.baselineCostUsd).toBe(14_040_000);
      // normalized = 1 -> savingsPercent = 82 (upper band, Req 6.5)
      expect(result.savingsPercent).toBe(82);
      // round(14,040,000 * (1 - 0.82)) = 2,527,200
      expect(result.monthlyCostUsd).toBe(2_527_200);
      expect(result.savingsUsd).toBe(11_512_800);
      expect(result.mttrFidelityPercent).toBe(99.9);
    });
  });

  describe("clamping at the compute layer (Req 6.8)", () => {
    it("clamps below-min concurrency up to the 5M lower bound", () => {
      const result = computeCost({ concurrency: 1_000, sampling: "standard" });
      expect(result.concurrency).toBe(MIN_CONCURRENCY);
      expect(result.spansPerSecond).toBe(25_000_000);
    });

    it("clamps above-max concurrency down to the 30M upper bound", () => {
      const result = computeCost({
        concurrency: 999_000_000,
        sampling: "tail",
      });
      expect(result.concurrency).toBe(MAX_CONCURRENCY);
      expect(result.savingsPercent).toBe(82);
    });
  });
});
