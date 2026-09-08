"use client";

import { useMemo, useState } from "react";

import { triviaQuestions } from "@/data/games";
import { isTriviaCorrect, triviaPoints, nextStreak } from "@/lib/games";

/**
 * Trivia Blitz — a multiple-choice quiz across Program Management, Product
 * Management, and Observability. Correct answers build a streak multiplier.
 * All scoring is delegated to the pure helpers in lib/games.ts.
 */
export function TriviaBlitz() {
  const questions = triviaQuestions;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[index];
  const answered = selected !== null;
  const correct = answered ? isTriviaCorrect(q, selected) : false;
  const total = questions.length;

  const bestPossible = useMemo(() => {
    // Max achievable score across a perfect streak, for context.
    let s = 0;
    for (let i = 0; i < total; i++) s += triviaPoints(true, i);
    return s;
  }, [total]);

  function choose(i: number) {
    if (answered) return;
    const isRight = isTriviaCorrect(q, i);
    setSelected(i);
    setScore((prev) => prev + triviaPoints(isRight, streak));
    setStreak((prev) => nextStreak(isRight, prev));
  }

  function next() {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setDone(false);
  }

  if (done) {
    return (
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Final Score
        </p>
        <p className="mt-2 font-mono text-4xl font-bold tabular-nums text-fg">
          {score.toLocaleString()}
          <span className="text-lg text-muted"> / {bestPossible.toLocaleString()}</span>
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-6 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Play again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Status bar */}
      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          Question {index + 1} / {total}
        </span>
        <span className="flex items-center gap-3">
          <span aria-label={`Current streak ${streak}`}>
            &#128293; Streak {streak}
          </span>
          <span className="font-mono tabular-nums text-fg" aria-live="polite">
            {score.toLocaleString()} pts
          </span>
        </span>
      </div>

      <span className="mt-4 inline-block rounded-full border border-border bg-surface2 px-2.5 py-0.5 text-xs font-medium text-muted">
        {q.domain}
      </span>

      <h4 className="mt-3 text-lg font-semibold text-fg">{q.prompt}</h4>

      <ul className="mt-4 space-y-2" role="group" aria-label="Answer choices">
        {q.options.map((opt, i) => {
          const isChosen = selected === i;
          const isAnswer = i === q.answerIndex;
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
            {correct ? "Correct!" : "Not quite."}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {q.explanation}
          </p>
          <button
            type="button"
            onClick={next}
            className="mt-4 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {index + 1 >= total ? "See results" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}

export default TriviaBlitz;
