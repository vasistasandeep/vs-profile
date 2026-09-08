"use client";

import { useMemo, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { motion } from "framer-motion";

import { computeCost } from "@/lib/costModel";
import type { SamplingStrategy } from "@/types/content";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp, useMotionSafe } from "@/components/ui/motion";

/**
 * CostCalculator — the Interactive Telemetry & Sampling Cost Calculator (Req 6).
 *
 * The most logic-heavy widget on the page. It owns two pieces of React state —
 * a Peak Concurrency slider value and the selected Sampling Strategy — and
 * derives *every* displayed number from the pure {@link computeCost} model via
 * `useMemo`. There are no hardcoded outputs; changing an input recomputes all
 * outputs synchronously (well under the 200ms budget) (Req 6.3, 6.4, 6.7).
 *
 * Controls:
 * - Peak Concurrency: Radix {@link Slider} bounded to `[5M, 30M]` in `1M`
 *   steps, with an `aria-valuetext` describing the users value (Req 6.1, 17.2).
 * - Sampling Strategy: single-select, non-empty Radix {@link ToggleGroup} with
 *   exactly two options — "Standard 100% Ingestion" (default) and the
 *   tail-based option (Req 6.2).
 *
 * The slider min/max enforce range at the UI layer, and the pure model clamps
 * any out-of-range input at the compute layer, so the calculator can never
 * display an out-of-range-derived value (Req 6.8).
 *
 * The "99.9% MTTR fidelity preserved" statement (driven by
 * `result.mttrFidelityPercent`) is always rendered regardless of inputs
 * (Req 6.6).
 *
 * This widget is a standalone titled block. It intentionally does NOT set a
 * top-level `id` (e.g. it does not claim `id="architecture"`); page composition
 * owns section anchors and placement.
 */

const MIN_CONCURRENCY = 5_000_000;
const MAX_CONCURRENCY = 30_000_000;
const STEP_CONCURRENCY = 1_000_000;

/** Compact whole-number formatter (e.g. 30,000,000). */
const numberFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** USD currency formatter with no cents (e.g. $1,234,567). */
const usdFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Compact "N.NM users" formatter for the plain-English takeaway line. */
function millions(value: number): string {
  return `${(value / 1_000_000).toFixed(0)}M`;
}

/**
 * The model assumptions, surfaced verbatim in the "How this works" note so the
 * numbers are never a black box. These mirror the constants in lib/costModel.ts.
 */
const ASSUMPTIONS = [
  "Each concurrent viewer emits ~5 telemetry spans/sec across instrumented hops.",
  "Costs are normalized over ~40 peak live-event hours per month (not 24x7).",
  "Blended APM ingest price of ~$0.65 per million spans.",
  "Tail-based sampling keeps 100% of error traces + 1% of healthy traces.",
];

/** Human-friendly "users" label for the slider aria-valuetext (Req 6.1, 17.2). */
function describeUsers(value: number): string {
  return `${numberFmt.format(value)} peak concurrent users`;
}

export function CostCalculator() {
  const variants = useMotionSafe(fadeUp);

  const [concurrency, setConcurrency] = useState<number>(MAX_CONCURRENCY);
  const [sampling, setSampling] = useState<SamplingStrategy>("standard");

  // Every displayed value is derived here — no hardcoded outputs (Req 6.7).
  const result = useMemo(
    () => computeCost({ concurrency, sampling }),
    [concurrency, sampling],
  );

  return (
    <motion.div
      className="scroll-mt-24"
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Cost Modeling
        </p>
        <h3 className="mt-2 text-3xl font-semibold text-fg sm:text-4xl">
          Telemetry &amp; Sampling Cost Calculator
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          A worked example of the cost lever behind full-stack observability.
          Drag the slider to set peak viewer concurrency, switch the sampling
          strategy, and watch the estimated monthly telemetry bill respond in
          real time. Every figure below is computed from the assumptions noted
          under the calculator&mdash;nothing is hard-coded.
        </p>
      </header>

      <GlassCard className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* --- Inputs -------------------------------------------------- */}
          <div className="flex flex-col gap-8">
            {/* Peak Concurrency slider (Req 6.1) */}
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <label
                  id="concurrency-label"
                  htmlFor="concurrency-slider"
                  className="text-sm font-medium text-fg"
                >
                  Peak Concurrency
                </label>
                <span className="font-mono text-lg font-semibold tabular-nums text-accent">
                  {numberFmt.format(result.concurrency)}
                </span>
              </div>

              <Slider.Root
                id="concurrency-slider"
                className="relative mt-4 flex h-5 w-full touch-none select-none items-center"
                min={MIN_CONCURRENCY}
                max={MAX_CONCURRENCY}
                step={STEP_CONCURRENCY}
                value={[concurrency]}
                onValueChange={(values) => setConcurrency(values[0])}
                aria-labelledby="concurrency-label"
              >
                <Slider.Track className="relative h-2.5 w-full grow rounded-full bg-surface2 ring-1 ring-inset ring-border">
                  <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-accent to-accent2" />
                </Slider.Track>
                <Slider.Thumb
                  className="block h-6 w-6 cursor-grab rounded-full border-2 border-white bg-emerald-500 outline-none ring-2 ring-emerald-500/30 transition-transform hover:scale-110 active:cursor-grabbing focus-visible:ring-4 focus-visible:ring-accent/50"
                  aria-label="Peak concurrency in users"
                  aria-valuetext={describeUsers(concurrency)}
                />
              </Slider.Root>

              <div className="mt-2 flex justify-between text-xs tabular-nums text-muted">
                <span>{numberFmt.format(MIN_CONCURRENCY)}</span>
                <span>{numberFmt.format(MAX_CONCURRENCY)}</span>
              </div>
            </div>

            {/* Sampling strategy toggle (Req 6.2) */}
            <div>
              <p
                id="sampling-label"
                className="text-sm font-medium text-fg"
              >
                Sampling Strategy
              </p>
              <ToggleGroup.Root
                type="single"
                value={sampling}
                onValueChange={(value) => {
                  // Non-empty: ignore attempts to deselect the active option.
                  if (value === "standard" || value === "tail") {
                    setSampling(value);
                  }
                }}
                aria-labelledby="sampling-label"
                className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                <ToggleGroup.Item
                  value="standard"
                  className="rounded-xl border border-border bg-surface2 px-4 py-3 text-left text-sm text-muted outline-none transition-colors hover:border-accent/40 focus-visible:ring-2 focus-visible:ring-accent/60 data-[state=on]:border-accent data-[state=on]:bg-accent/10 data-[state=on]:text-accent"
                >
                  Standard 100% Ingestion
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="tail"
                  className="rounded-xl border border-border bg-surface2 px-4 py-3 text-left text-sm text-muted outline-none transition-colors hover:border-accent/40 focus-visible:ring-2 focus-visible:ring-accent/60 data-[state=on]:border-accent data-[state=on]:bg-accent/10 data-[state=on]:text-accent"
                >
                  Tail-Based Intelligent Sampling (100% errors / 1% healthy)
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>
          </div>

          {/* --- Outputs (all derived from `result`, Req 6.3/6.4/6.7) --- */}
          <div className="flex flex-col gap-4" aria-live="polite">
            <div className="rounded-xl border border-border bg-surface2 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Telemetry Ingested
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-fg">
                {numberFmt.format(result.spansPerSecond)}
                <span className="ml-1 text-sm font-normal text-muted">
                  spans / sec
                </span>
              </p>
              <p className="mt-1 text-xs text-muted">
                Volume of trace data your APM vendor bills for.
              </p>
            </div>

            <div className="rounded-xl border border-accent/25 bg-accent/[0.06] p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Estimated Monthly Telemetry Cost
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-2xl font-semibold tabular-nums text-fg">
                  {usdFmt.format(result.monthlyCostUsd)}
                </span>
                {result.savingsUsd > 0 && (
                  <span className="font-mono text-sm font-medium tabular-nums text-accent">
                    &darr; {usdFmt.format(result.savingsUsd)} ({result.savingsPercent}%) vs. standard
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs tabular-nums text-muted">
                Baseline at 100% ingestion: {usdFmt.format(result.baselineCostUsd)} / month
              </p>
            </div>

            {/* Plain-English takeaway — recomputed live so the point lands
                without the reader having to interpret the raw numbers. */}
            <p className="text-sm leading-relaxed text-muted">
              {result.savingsUsd > 0 ? (
                <>
                  At {millions(result.concurrency)} peak viewers, tail-based
                  sampling trims the telemetry bill by roughly{" "}
                  <span className="font-semibold text-accent">
                    {usdFmt.format(result.savingsUsd)}/month
                  </span>{" "}
                  &mdash; while still preserving{" "}
                  <span className="font-semibold text-accent">
                    {result.mttrFidelityPercent}% MTTR fidelity
                  </span>{" "}
                  (every error trace is kept, so incident debugging is unaffected).
                </>
              ) : (
                <>
                  Standard 100% ingestion captures everything but is the most
                  expensive option. Switch to tail-based sampling to see the
                  savings while keeping{" "}
                  <span className="font-semibold text-accent">
                    {result.mttrFidelityPercent}% MTTR fidelity
                  </span>
                  .
                </>
              )}
            </p>
          </div>
        </div>

        {/* "How this works" note — states the model assumptions in plain
            English so the figures are transparent, not a black box. */}
        <div className="mt-6 rounded-xl border border-border bg-surface2 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-fg">
            How this estimate works
          </p>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-muted">
            {ASSUMPTIONS.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true" className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent/70" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs italic leading-relaxed text-muted">
            Figures are illustrative order-of-magnitude estimates to demonstrate
            the observability cost/latency trade-off &mdash; not a vendor quote.
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default CostCalculator;
