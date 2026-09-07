// lib/costModel.ts
//
// Pure cost-calculator model for the executive portfolio site (Req 6).
// Maps peak concurrency -> ingested spans/sec -> estimated monthly APM cost ->
// tail-based sampling savings. All logic lives in `computeCost` (no React, no I/O).
//
// The model is peak-event-normalized: rather than assuming the platform sustains
// its live-match peak concurrency 24x7 (which would inflate figures unrealistically),
// it normalizes concurrency across ~40 peak live-event hours per month.

import type { CostInput, CostResult } from "@/types/content";

// --- Model constants -------------------------------------------------------

/** Average spans emitted per concurrent user per second (~5 instrumented hops). */
export const SPANS_PER_USER_PER_SECOND = 5;

/** Blended APM ingest price per 1M spans (illustrative constant), in USD. */
export const COST_PER_MILLION_SPANS_USD = 0.65;

/** Peak live-event hours normalized per month. */
export const PEAK_EVENT_HOURS_PER_MONTH = 40;

/** Peak seconds billed per month = PEAK_EVENT_HOURS_PER_MONTH * 3600. */
export const SECONDS_PER_PEAK_MONTH = PEAK_EVENT_HOURS_PER_MONTH * 3600; // 144_000

/** 1% of traces are errors, retained at 100% under tail-based sampling. */
export const ERROR_TRACE_RATIO = 0.01;

/** 1% of healthy traces retained under tail-based sampling. */
export const TAIL_HEALTHY_SAMPLE_RATE = 0.01;

/** Constant MTTR fidelity preserved across all inputs (Req 6.6). */
export const MTTR_FIDELITY = 99.9;

/** Peak-concurrency slider bounds (Req 6.8). */
const MIN_CONCURRENCY = 5_000_000;
const MAX_CONCURRENCY = 30_000_000;

// --- Helpers ---------------------------------------------------------------

/**
 * Clamp `value` to the inclusive range `[min, max]`.
 * Idempotent: clamping an already-clamped value yields the same value.
 */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// --- Model -----------------------------------------------------------------

/**
 * Compute the estimated APM cost and tail-based-sampling savings for a given
 * peak concurrency and sampling strategy. Pure and deterministic.
 */
export function computeCost(input: CostInput): CostResult {
  // 1. Clamp concurrency to the supported slider range (Req 6.8).
  const concurrency = clamp(input.concurrency, MIN_CONCURRENCY, MAX_CONCURRENCY);

  // 2. Baseline spans/sec at 100% ingestion.
  const baselineSpansPerSec = concurrency * SPANS_PER_USER_PER_SECOND;

  // 3. Baseline monthly spans and cost.
  const baselineMonthlySpans = baselineSpansPerSec * SECONDS_PER_PEAK_MONTH;
  const baselineCostUsd = Math.round(
    (baselineMonthlySpans / 1_000_000) * COST_PER_MILLION_SPANS_USD
  );

  if (input.sampling === "standard") {
    // 4. Standard 100% ingestion: no savings.
    return {
      concurrency,
      spansPerSecond: baselineSpansPerSec,
      monthlyCostUsd: baselineCostUsd,
      baselineCostUsd,
      savingsUsd: 0,
      savingsPercent: 0,
      mttrFidelityPercent: MTTR_FIDELITY,
    };
  }

  // 5. Tail-based sampling.
  const retainedFraction =
    ERROR_TRACE_RATIO * 1.0 + (1 - ERROR_TRACE_RATIO) * TAIL_HEALTHY_SAMPLE_RATE; // 0.0199

  const spansPerSecond = Math.round(baselineSpansPerSec * retainedFraction);

  const normalized =
    (concurrency - MIN_CONCURRENCY) / (MAX_CONCURRENCY - MIN_CONCURRENCY); // [0, 1]
  const savingsPercent = Math.round(78 + normalized * 4); // deterministic, [78, 82]

  const monthlyCostUsd = Math.round(baselineCostUsd * (1 - savingsPercent / 100));
  const savingsUsd = baselineCostUsd - monthlyCostUsd;

  return {
    concurrency,
    spansPerSecond,
    monthlyCostUsd,
    baselineCostUsd,
    savingsUsd,
    savingsPercent,
    mttrFidelityPercent: MTTR_FIDELITY,
  };
}
