"use client";

import { useMemo, useState } from "react";

import { errorBudgetConfig } from "@/data/games";
import { errorBudgetScore, MAX_BURN_PER_PERIOD } from "@/lib/games";

/**
 * Error Budget Balancer — a program/SRE allocation puzzle. The player spreads a
 * quarter's error budget across three months by choosing how aggressively to
 * ship each month. Scoring is delegated to the pure errorBudgetScore helper:
 * maximize velocity without exhausting the budget.
 */
export function ErrorBudgetBalancer() {
  const { periods, budget, intro, withinBudgetCoaching, overBudgetCoaching } =
    errorBudgetConfig;

  // Ship-aggressiveness per period as a 0..100 integer (slider units).
  const [levels, setLevels] = useState<number[]>(() => periods.map(() => 40));
  const [locked, setLocked] = useState(false);

  const aggressiveness = useMemo(() => levels.map((l) => l / 100), [levels]);
  const result = useMemo(
    () => errorBudgetScore(aggressiveness, { budget }),
    [aggressiveness, budget],
  );

  const usedPct = Math.min(100, Math.round(result.budgetUsedPct));
  const velocity = Math.round(aggressiveness.reduce((a, b) => a + b, 0) * 100);

  function setLevel(i: number, val: number) {
    if (locked) return;
    setLevels((prev) => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  }

  function reset() {
    setLevels(periods.map(() => 40));
    setLocked(false);
  }

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">{intro}</p>

      <div className="mt-6 space-y-5">
        {periods.map((label, i) => {
          const inputId = `ebb-slider-${i}`;
          return (
            <div key={label}>
              <div className="flex items-center justify-between">
                <label
                  htmlFor={inputId}
                  className="text-sm font-medium text-fg"
                >
                  {label}
                </label>
                <span className="font-mono text-xs tabular-nums text-muted">
                  {levels[i]}% ship
                </span>
              </div>
              <input
                id={inputId}
                type="range"
                min={0}
                max={100}
                step={5}
                value={levels[i]}
                disabled={locked}
                onChange={(e) => setLevel(i, Number(e.target.value))}
                aria-label={`Ship aggressiveness for ${label}`}
                className="mt-2 w-full accent-emerald-500 disabled:opacity-60"
              />
            </div>
          );
        })}
      </div>

      {/* Live budget + velocity readout */}
      <div className="mt-6 space-y-3 rounded-xl border border-border bg-surface2 p-4">
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium uppercase tracking-wider text-muted">
              Error budget used
            </span>
            <span
              className={`font-mono tabular-nums ${
                result.withinBudget ? "text-fg" : "text-red-500"
              }`}
            >
              {Math.round(result.budgetUsedPct)}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface">
            <div
              className={`h-full rounded-full ${
                result.withinBudget ? "bg-accent" : "bg-red-500"
              }`}
              style={{ width: `${usedPct}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium uppercase tracking-wider text-muted">
            Velocity
          </span>
          <span className="font-mono tabular-nums text-accent2">
            {velocity}
          </span>
        </div>
      </div>

      {!locked ? (
        <button
          type="button"
          onClick={() => setLocked(true)}
          className="mt-5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Lock in quarter
        </button>
      ) : (
        <div className="mt-5">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-accent">
                Quarter Score
              </p>
              <p
                className="font-mono text-3xl font-bold tabular-nums text-fg"
                aria-live="polite"
              >
                {result.score.toLocaleString()}
                <span className="text-base text-muted"> / 1000</span>
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-border bg-surface px-5 py-2 text-sm font-semibold text-fg transition-colors hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Replan
            </button>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            {result.withinBudget ? withinBudgetCoaching : overBudgetCoaching}
          </p>
        </div>
      )}
    </div>
  );
}

export default ErrorBudgetBalancer;
