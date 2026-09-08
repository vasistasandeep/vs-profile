"use client";

import { useEffect, useRef, useState } from "react";

import { incidentSteps } from "@/data/games";
import { incidentScore } from "@/lib/games";

/**
 * Incident Commander — an observability triage sim. Each step presents a live
 * incident signal; picking the right action faster scores more (rewarding low
 * simulated MTTR). Scoring is delegated to the pure incidentScore helper.
 */
export function IncidentCommander() {
  const steps = incidentSteps;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  // Wall-clock start of the current step, to reward fast decisions.
  const stepStart = useRef<number>(Date.now());
  const [elapsedMs, setElapsedMs] = useState(0);

  const step = steps[index];
  const answered = selected !== null;
  const correct = answered ? selected === step.correctIndex : false;
  const total = steps.length;

  // Tick a lightweight timer while the current step is unanswered.
  useEffect(() => {
    if (answered || done) return;
    stepStart.current = Date.now();
    setElapsedMs(0);
    const id = window.setInterval(() => {
      setElapsedMs(Date.now() - stepStart.current);
    }, 100);
    return () => window.clearInterval(id);
  }, [index, answered, done]);

  function choose(i: number) {
    if (answered) return;
    const ms = Date.now() - stepStart.current;
    setElapsedMs(ms);
    setSelected(i);
    setScore((prev) => prev + incidentScore(i === step.correctIndex, ms));
  }

  function next() {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex((n) => n + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    return (
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Incident Resolved
        </p>
        <p className="mt-2 font-mono text-4xl font-bold tabular-nums text-fg">
          {score.toLocaleString()} <span className="text-lg text-muted">pts</span>
        </p>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
          Faster, correct triage decisions score higher &mdash; the same
          instinct that keeps real MTTR low.
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-6 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Run another incident
        </button>
      </div>
    );
  }

  const seconds = (elapsedMs / 1000).toFixed(1);

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          Decision {index + 1} / {total}
        </span>
        <span className="flex items-center gap-3">
          {!answered && (
            <span className="font-mono tabular-nums text-red-500" aria-live="off">
              &#9201; {seconds}s
            </span>
          )}
          <span className="font-mono tabular-nums text-fg" aria-live="polite">
            {score.toLocaleString()} pts
          </span>
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-500">
          &#128680; Active Incident
        </p>
        <p className="mt-2 text-sm leading-relaxed text-fg">{step.situation}</p>
      </div>

      <ul className="mt-4 space-y-2" role="group" aria-label="Triage actions">
        {step.options.map((opt, i) => {
          const isChosen = selected === i;
          const isAnswer = i === step.correctIndex;
          const stateClass = !answered
            ? "border-border bg-surface hover:border-accent/50"
            : isAnswer
              ? "border-emerald-500 bg-emerald-500/10 text-fg"
              : isChosen
                ? "border-red-500 bg-red-500/10 text-fg"
                : "border-border bg-surface opacity-60";
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => choose(i)}
                disabled={answered}
                aria-pressed={isChosen}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-default ${stateClass}`}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>

      {answered && (
        <div className="mt-4 rounded-xl border border-border bg-surface2 p-4">
          <p className="text-sm font-semibold text-fg">
            {correct ? "Good call." : "That would cost you."}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {step.rationale}
          </p>
          <button
            type="button"
            onClick={next}
            className="mt-4 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {index + 1 >= total ? "Close incident" : "Next decision"}
          </button>
        </div>
      )}
    </div>
  );
}

export default IncidentCommander;
