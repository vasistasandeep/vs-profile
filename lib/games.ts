// lib/games.ts
//
// Pure, DOM-free game logic for the Arcade section. All scoring / evaluation
// lives here as deterministic functions so it can be property-tested in
// isolation (mirrors the pattern in components/ui/state.ts). No React, no I/O.

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type GameDomain =
  | "Program Management"
  | "Product Management"
  | "Observability";

// ---------------------------------------------------------------------------
// 1) Trivia Blitz — multiple-choice quiz with a streak multiplier.
// ---------------------------------------------------------------------------

export interface TriviaQuestion {
  id: string;
  domain: GameDomain;
  prompt: string;
  options: string[];
  /** Index into `options` of the correct answer. */
  answerIndex: number;
  /** Short explanation shown after answering. */
  explanation: string;
}

/**
 * Whether the chosen option is correct for a question.
 * Out-of-range choices are simply incorrect (never throws).
 */
export function isTriviaCorrect(
  question: TriviaQuestion,
  choiceIndex: number,
): boolean {
  return choiceIndex === question.answerIndex;
}

/**
 * Points awarded for one trivia answer.
 *
 * Correct answers earn a base of 100 points scaled by a streak multiplier:
 * the Nth consecutive correct answer (1-indexed via `priorStreak`) earns
 * 100 * (1 + priorStreak * 0.25), rounded. Wrong answers earn 0.
 *
 * `priorStreak` is the number of correct answers immediately before this one
 * (0 for the first correct answer). Negative streaks are treated as 0.
 */
export function triviaPoints(correct: boolean, priorStreak: number): number {
  if (!correct) return 0;
  const streak = Math.max(0, Math.floor(priorStreak));
  return Math.round(100 * (1 + streak * 0.25));
}

/**
 * Advance the streak counter: increment on a correct answer, reset to 0 on a
 * wrong one. Pure and total.
 */
export function nextStreak(correct: boolean, priorStreak: number): number {
  if (!correct) return 0;
  return Math.max(0, Math.floor(priorStreak)) + 1;
}

// ---------------------------------------------------------------------------
// 2) Incident Commander — pick the correct triage step; scored on speed.
// ---------------------------------------------------------------------------

export interface IncidentStep {
  id: string;
  /** The scenario / current signal presented to the player. */
  situation: string;
  options: string[];
  /** Index of the correct triage action. */
  correctIndex: number;
  /** Why the correct action is right (post-answer coaching). */
  rationale: string;
}

/**
 * Score a single incident decision.
 *
 * A correct decision earns points that decay with elapsed time to reward fast,
 * confident triage (lower simulated MTTR): score = round(max(floor, base - elapsedMs * rate)).
 * Wrong decisions earn 0. Defaults: base 500, rate 0.1/ms, floor 50.
 */
export function incidentScore(
  correct: boolean,
  elapsedMs: number,
  opts: { base?: number; ratePerMs?: number; floor?: number } = {},
): number {
  if (!correct) return 0;
  const base = opts.base ?? 500;
  const rate = opts.ratePerMs ?? 0.1;
  const floor = opts.floor ?? 50;
  const elapsed = Math.max(0, elapsedMs);
  return Math.round(Math.max(floor, base - elapsed * rate));
}

// ---------------------------------------------------------------------------
// 3) Prioritization Poker — rank features; scored vs. the optimal RICE order.
// ---------------------------------------------------------------------------

export interface Feature {
  id: string;
  name: string;
  reach: number;      // people impacted per quarter
  impact: number;     // 0.25 | 0.5 | 1 | 2 | 3
  confidence: number; // 0..1
  effort: number;     // person-months (> 0)
}

/** RICE score = (reach * impact * confidence) / effort. Effort <= 0 -> 0. */
export function riceScore(f: Feature): number {
  if (f.effort <= 0) return 0;
  return (f.reach * f.impact * f.confidence) / f.effort;
}

/**
 * The optimal ordering of feature ids: descending RICE score. Ties break by
 * id for determinism. Pure — does not mutate the input.
 */
export function optimalOrder(features: readonly Feature[]): string[] {
  return [...features]
    .sort((a, b) => {
      const diff = riceScore(b) - riceScore(a);
      if (diff !== 0) return diff;
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    })
    .map((f) => f.id);
}

/**
 * Accuracy of a player's ordering vs. the optimal RICE ordering, as a value in
 * [0, 1]. Uses normalized pairwise concordance (fraction of feature pairs whose
 * relative order matches the optimal order) so partial credit is smooth.
 *
 * A single-item (or empty) list is trivially perfect (1). If the player's order
 * is not a permutation of the optimal ids, only shared ids are scored; unknown
 * ids are ignored.
 */
export function orderingAccuracy(
  playerOrder: readonly string[],
  optimal: readonly string[],
): number {
  const optimalRank = new Map<string, number>();
  optimal.forEach((id, i) => optimalRank.set(id, i));

  // Only consider ids present in the optimal ranking.
  const order = playerOrder.filter((id) => optimalRank.has(id));
  const n = order.length;
  if (n < 2) return 1;

  let concordant = 0;
  let total = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      total += 1;
      const ri = optimalRank.get(order[i])!;
      const rj = optimalRank.get(order[j])!;
      // Player placed order[i] before order[j]; concordant if optimal agrees.
      if (ri < rj) concordant += 1;
    }
  }
  return total === 0 ? 1 : concordant / total;
}

/** Whole-number score (0..1000) for a prioritization round. */
export function prioritizationScore(
  playerOrder: readonly string[],
  optimal: readonly string[],
): number {
  return Math.round(orderingAccuracy(playerOrder, optimal) * 1000);
}
