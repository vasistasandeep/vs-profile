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

// ---------------------------------------------------------------------------
// 4) Error Budget Balancer — allocate a quarter's error budget across periods.
// ---------------------------------------------------------------------------

/**
 * Maximum budget units a single period can burn when shipping at full (1.0)
 * aggressiveness. With 3 periods this means a maximum possible burn of
 * 3 * MAX_BURN_PER_PERIOD units across the quarter.
 */
export const MAX_BURN_PER_PERIOD = 45;

/** Default quarterly error budget (normalized units). */
export const DEFAULT_ERROR_BUDGET = 100;

export interface ErrorBudgetResult {
  /** Whole-number score in [0, 1000]. */
  score: number;
  /** Percentage (0..100+) of the budget consumed by the chosen plan. */
  budgetUsedPct: number;
  /** Whether the plan stayed within the available budget. */
  withinBudget: boolean;
}

/** Clamp a number into [0, 1]; non-finite values become 0. */
function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

/**
 * Score an error-budget allocation.
 *
 * `aggressiveness` is an array of ship-aggressiveness values in [0, 1], one per
 * period. Each period burns `aggressiveness_i * MAX_BURN_PER_PERIOD` budget
 * units. Higher aggressiveness earns more "velocity"; the score rewards
 * maximizing velocity WITHOUT exhausting the budget.
 *
 * - If consumed <= budget: base score = round(avgVelocity * 1000), where
 *   avgVelocity = sum(aggressiveness) / periods (so score is naturally in
 *   [0, 1000]). A small efficiency bonus applies when the plan uses more than
 *   80% of the budget (rewarding tight, deliberate spend), capped at 1000.
 * - If consumed > budget: the score decays sharply, multiplied by
 *   max(0, 1 - overshootFraction) where overshootFraction is the fraction over
 *   budget. A large overshoot drives the score to 0.
 *
 * Pure and total: inputs are clamped to [0, 1]; an empty plan scores 0.
 */
export function errorBudgetScore(
  aggressiveness: readonly number[],
  opts: { budget?: number; maxBurnPerPeriod?: number } = {},
): ErrorBudgetResult {
  const periods = aggressiveness.length;
  const budget = opts.budget ?? DEFAULT_ERROR_BUDGET;
  const maxBurn = opts.maxBurnPerPeriod ?? MAX_BURN_PER_PERIOD;

  if (periods === 0 || budget <= 0) {
    return { score: 0, budgetUsedPct: 0, withinBudget: true };
  }

  const clamped = aggressiveness.map(clamp01);
  const velocitySum = clamped.reduce((a, b) => a + b, 0);
  const consumed = velocitySum * maxBurn;
  const budgetUsedPct = (consumed / budget) * 100;
  const withinBudget = consumed <= budget;

  if (!withinBudget) {
    // Overshoot fraction relative to the budget; sharp decay toward 0.
    const overshoot = (consumed - budget) / budget;
    const avgVelocity = velocitySum / periods;
    const base = avgVelocity * 1000;
    const penalized = base * Math.max(0, 1 - overshoot);
    return {
      score: Math.max(0, Math.round(penalized)),
      budgetUsedPct,
      withinBudget: false,
    };
  }

  const avgVelocity = velocitySum / periods;
  let score = avgVelocity * 1000;
  // Efficiency bonus for tight spend (>80% of budget) without blowing it.
  if (budgetUsedPct > 80) {
    score *= 1.05;
  }
  return {
    score: Math.min(1000, Math.round(score)),
    budgetUsedPct,
    withinBudget: true,
  };
}

// ---------------------------------------------------------------------------
// 5) Sprint Capacity Planner — knapsack-flavored backlog selection.
// ---------------------------------------------------------------------------

export interface WorkItem {
  id: string;
  name: string;
  /** Story points the item consumes from sprint capacity (>= 0). */
  points: number;
  /** Business value delivered if selected (>= 0). */
  value: number;
}

/** Total story points of the selected items. Unknown ids are ignored. */
export function selectedPoints(
  items: readonly WorkItem[],
  selectedIds: readonly string[],
): number {
  const chosen = new Set(selectedIds);
  return items.reduce(
    (sum, it) => (chosen.has(it.id) ? sum + Math.max(0, it.points) : sum),
    0,
  );
}

/** Total business value of the selected items. Unknown ids are ignored. */
export function selectedValue(
  items: readonly WorkItem[],
  selectedIds: readonly string[],
): number {
  const chosen = new Set(selectedIds);
  return items.reduce(
    (sum, it) => (chosen.has(it.id) ? sum + Math.max(0, it.value) : sum),
    0,
  );
}

/** Whether the selection fits within the sprint capacity (points <= capacity). */
export function isWithinCapacity(
  items: readonly WorkItem[],
  selectedIds: readonly string[],
  capacity: number,
): boolean {
  return selectedPoints(items, selectedIds) <= capacity;
}

/**
 * Maximum achievable value that fits within capacity (0/1 knapsack).
 *
 * Deterministic DP over integer points. Item points are floored to
 * non-negative integers and capacity floored to a non-negative integer; with
 * the small backlog sizes used here (~6-8 items) this is trivial. Returns 0 for
 * an empty backlog or non-positive capacity.
 */
export function optimalValue(
  items: readonly WorkItem[],
  capacity: number,
): number {
  const cap = Math.max(0, Math.floor(capacity));
  if (cap === 0 || items.length === 0) return 0;

  // dp[c] = best value achievable using capacity exactly up to c.
  const dp = new Array<number>(cap + 1).fill(0);
  for (const it of items) {
    const p = Math.max(0, Math.floor(it.points));
    const v = Math.max(0, it.value);
    if (p === 0) {
      // Zero-point items are always worth taking; add their value everywhere.
      for (let c = 0; c <= cap; c++) dp[c] += v;
      continue;
    }
    if (p > cap) continue;
    for (let c = cap; c >= p; c--) {
      const candidate = dp[c - p] + v;
      if (candidate > dp[c]) dp[c] = candidate;
    }
  }
  return dp[cap];
}

/**
 * Score a sprint plan in [0, 1000].
 *
 * If the selection exceeds capacity, the plan is invalid and scores 0.
 * Otherwise the score is round(selectedValue / optimalValue * 1000), so a
 * plan matching the optimal value scores 1000. Guards divide-by-zero: an
 * optimal value of 0 returns 0.
 */
export function capacityScore(
  items: readonly WorkItem[],
  selectedIds: readonly string[],
  capacity: number,
): number {
  if (!isWithinCapacity(items, selectedIds, capacity)) return 0;
  const optimal = optimalValue(items, capacity);
  if (optimal <= 0) return 0;
  const value = selectedValue(items, selectedIds);
  const score = Math.round((value / optimal) * 1000);
  return Math.max(0, Math.min(1000, score));
}
