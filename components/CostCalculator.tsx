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
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
          Cost Modeling
        </p>
        <h3 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
          Telemetry &amp; Sampling Cost Calculator
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          Adjust peak concurrency and sampling strategy to see the quantified
          impact of tail-based intelligent sampling on observability spend.
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
                  className="text-sm font-medium text-slate-200"
                >
                  Peak Concurrency
                </label>
                <span className="font-mono text-lg font-semibold tabular-nums text-emerald-300">
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
                <Slider.Track className="relative h-1.5 w-full grow rounded-full bg-white/10">
                  <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                </Slider.Track>
                <Slider.Thumb
                  className="block h-5 w-5 rounded-full border border-emerald-300 bg-slate-950 shadow-glow-emerald outline-none transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400/70"
                  aria-label="Peak concurrency in users"
                  aria-valuetext={describeUsers(concurrency)}
                />
              </Slider.Root>

              <div className="mt-2 flex justify-between text-xs tabular-nums text-slate-500">
                <span>{numberFmt.format(MIN_CONCURRENCY)}</span>
                <span>{numberFmt.format(MAX_CONCURRENCY)}</span>
              </div>
            </div>

            {/* Sampling strategy toggle (Req 6.2) */}
            <div>
              <p
                id="sampling-label"
                className="text-sm font-medium text-slate-200"
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
                  className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-slate-300 outline-none transition-colors hover:border-white/20 focus-visible:ring-2 focus-visible:ring-emerald-400/60 data-[state=on]:border-emerald-400 data-[state=on]:bg-emerald-400/10 data-[state=on]:text-emerald-200"
                >
                  Standard 100% Ingestion
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="tail"
                  className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-slate-300 outline-none transition-colors hover:border-white/20 focus-visible:ring-2 focus-visible:ring-emerald-400/60 data-[state=on]:border-emerald-400 data-[state=on]:bg-emerald-400/10 data-[state=on]:text-emerald-200"
                >
                  Tail-Based Intelligent Sampling (100% errors / 1% healthy)
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>
          </div>

          {/* --- Outputs (all derived from `result`, Req 6.3/6.4/6.7) --- */}
          <div className="flex flex-col gap-4" aria-live="polite">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Ingested Spans Per Second
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-white">
                {numberFmt.format(result.spansPerSecond)}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Estimated Monthly APM Cost Savings
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-2xl font-semibold tabular-nums text-emerald-300">
                  {usdFmt.format(result.savingsUsd)}
                </span>
                <span className="font-mono text-lg font-medium tabular-nums text-cyan-300">
                  {result.savingsPercent}% saved
                </span>
              </div>
              <p className="mt-2 text-xs tabular-nums text-slate-500">
                {usdFmt.format(result.monthlyCostUsd)} of{" "}
                {usdFmt.format(result.baselineCostUsd)} baseline
              </p>
            </div>

            {/* Always-visible MTTR fidelity statement (Req 6.6) */}
            <p className="mt-auto text-sm font-medium text-slate-300">
              <span className="text-emerald-300">
                {result.mttrFidelityPercent}% MTTR fidelity preserved
              </span>{" "}
              across every concurrency and sampling combination.
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default CostCalculator;
