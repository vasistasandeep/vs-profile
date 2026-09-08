"use client";

import { useMemo, useState } from "react";

import { sprintBacklog, sprintCapacity } from "@/data/games";
import {
  capacityScore,
  isWithinCapacity,
  optimalValue,
  selectedPoints,
  selectedValue,
} from "@/lib/games";

/**
 * Sprint Capacity Planner — a knapsack-flavored program puzzle. The player
 * toggles backlog items to maximize delivered value without exceeding a fixed
 * sprint capacity. Scoring is delegated to the pure capacityScore helper, which
 * compares the selection against the optimal 0/1 knapsack value.
 */
export function SprintCapacityPlanner() {
  const items = sprintBacklog;
  const capacity = sprintCapacity;

  const [selected, setSelected] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);

  const points = useMemo(
    () => selectedPoints(items, selected),
    [items, selected],
  );
  const value = useMemo(
    () => selectedValue(items, selected),
    [items, selected],
  );
  const within = isWithinCapacity(items, selected, capacity);
  const optimal = useMemo(() => optimalValue(items, capacity), [items, capacity]);
  const score = revealed ? capacityScore(items, selected, capacity) : 0;

  const usedPct = Math.min(100, Math.round((points / capacity) * 100));

  function toggle(id: string) {
    if (revealed) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function reset() {
    setSelected([]);
    setRevealed(false);
  }

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        You have a fixed sprint capacity of{" "}
        <span className="font-medium text-fg">{capacity} points</span>. Pick the
        backlog items that maximize delivered value without going over. Then
        score your plan against the optimal selection.
      </p>

      {/* Capacity meter */}
      <div className="mt-6 rounded-xl border border-border bg-surface2 p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium uppercase tracking-wider text-muted">
            Capacity used
          </span>
          <span
            className={`font-mono tabular-nums ${
              within ? "text-fg" : "text-red-500"
            }`}
          >
            {points} / {capacity} pts
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface">
          <div
            className={`h-full rounded-full ${within ? "bg-accent" : "bg-red-500"}`}
            style={{ width: `${usedPct}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="font-medium uppercase tracking-wider text-muted">
            Selected value
          </span>
          <span className="font-mono tabular-nums text-accent2">{value}</span>
        </div>
        {!within && (
          <p className="mt-2 text-xs font-medium text-red-500">
            Over capacity &mdash; trim the plan to score.
          </p>
        )}
      </div>

      {/* Backlog checklist */}
      <ul className="mt-4 space-y-2" role="group" aria-label="Sprint backlog">
        {items.map((it) => {
          const isSelected = selected.includes(it.id);
          return (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => toggle(it.id)}
                disabled={revealed}
                aria-pressed={isSelected}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-default ${
                  isSelected
                    ? "border-accent/60 bg-accent/5"
                    : "border-border bg-surface hover:border-accent/40"
                }`}
              >
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-fg">
                  {it.name}
                </span>
                <span className="flex items-center gap-3 font-mono text-xs tabular-nums text-muted">
                  <span>{it.points} pts</span>
                  <span className="text-accent2">value {it.value}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Score my sprint
        </button>
      ) : (
        <div className="mt-5">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-accent">
                Sprint Score
              </p>
              <p
                className="font-mono text-3xl font-bold tabular-nums text-fg"
                aria-live="polite"
              >
                {score.toLocaleString()}
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
            {within
              ? `You delivered ${value} of a possible ${optimal} value within capacity. The best fit is the knapsack a strong PM converges on under a hard constraint.`
              : "This plan exceeds capacity, so it scores zero. Real sprints don't stretch; unfit work slips to the next one."}
          </p>
        </div>
      )}
    </div>
  );
}

export default SprintCapacityPlanner;
