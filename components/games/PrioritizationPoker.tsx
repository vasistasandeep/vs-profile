"use client";

import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

import { priorityFeatures } from "@/data/games";
import {
  optimalOrder,
  prioritizationScore,
  riceScore,
  type Feature,
} from "@/lib/games";

/**
 * Prioritization Poker — rank product features by perceived value, then reveal
 * how your ordering compares to the optimal RICE ranking. Reordering uses
 * accessible move-up / move-down controls (keyboard-friendly, no drag-drop
 * dependency). Scoring is delegated to the pure prioritizationScore helper.
 */
export function PrioritizationPoker() {
  const features = priorityFeatures;
  // Player order holds feature ids; seeded in the data's declared order.
  const [order, setOrder] = useState<string[]>(() => features.map((f) => f.id));
  const [revealed, setRevealed] = useState(false);

  const byId = useMemo(
    () => new Map<string, Feature>(features.map((f) => [f.id, f])),
    [features],
  );
  const optimal = useMemo(() => optimalOrder(features), [features]);
  const score = revealed ? prioritizationScore(order, optimal) : 0;

  function move(i: number, dir: -1 | 1) {
    if (revealed) return;
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    setOrder((prev) => {
      const nextOrder = [...prev];
      [nextOrder[i], nextOrder[j]] = [nextOrder[j], nextOrder[i]];
      return nextOrder;
    });
  }

  function restart() {
    setOrder(features.map((f) => f.id));
    setRevealed(false);
  }

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        Rank these features from highest to lowest priority. When you&apos;re
        ready, reveal how your call compares to the optimal{" "}
        <span className="font-medium text-fg">RICE</span> ranking
        (Reach &times; Impact &times; Confidence / Effort).
      </p>

      <ol className="mt-4 space-y-2">
        {order.map((id, i) => {
          const f = byId.get(id)!;
          const optimalRank = optimal.indexOf(id);
          const misplaced = revealed && optimalRank !== i;
          return (
            <li
              key={id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                revealed
                  ? misplaced
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-emerald-500/50 bg-emerald-500/5"
                  : "border-border bg-surface"
              }`}
            >
              <span className="font-mono text-sm tabular-nums text-muted">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">{f.name}</p>
                {revealed && (
                  <p className="mt-0.5 text-xs text-muted">
                    RICE {Math.round(riceScore(f)).toLocaleString()} &middot;
                    optimal rank #{optimalRank + 1}
                  </p>
                )}
              </div>
              {!revealed && (
                <span className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Move ${f.name} up`}
                    className="rounded p-1 text-muted transition-colors hover:text-fg disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
                  >
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === order.length - 1}
                    aria-label={`Move ${f.name} down`}
                    className="rounded p-1 text-muted transition-colors hover:text-fg disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Reveal RICE ranking
        </button>
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-accent">
              Match Score
            </p>
            <p className="font-mono text-3xl font-bold tabular-nums text-fg" aria-live="polite">
              {score.toLocaleString()}
              <span className="text-base text-muted"> / 1000</span>
            </p>
          </div>
          <button
            type="button"
            onClick={restart}
            className="rounded-full border border-border bg-surface px-5 py-2 text-sm font-semibold text-fg transition-colors hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

export default PrioritizationPoker;
