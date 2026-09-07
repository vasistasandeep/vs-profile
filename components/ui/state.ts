/**
 * Pure, DOM-free state helpers and reducers backing the state-driven UI
 * properties (Correctness Properties 9–13). These functions contain no React
 * or DOM imports so they can be property-tested in isolation, while the thin
 * component wiring (task 12.2) confirms the components use them.
 */

/**
 * Mobile-menu toggle reducer.
 *
 * Backs Property 9 (mobile menu toggle is an involution): applying this an even
 * number of times returns the original state, an odd number of times returns
 * the opposite state.
 *
 * @param open current open/closed state of the mobile menu
 * @returns the negated state
 */
export function toggleMenu(open: boolean): boolean {
  return !open;
}

/** The two views of a platform-evolution item. */
export type EvolutionView = "before" | "after";

/**
 * Evolution before/after toggle helper.
 *
 * Backs Property 10 (platform evolution Before/After toggle is an involution):
 * one activation shows the opposite view, two consecutive activations restore
 * the original view.
 *
 * @param view current view of the evolution item
 * @returns the opposite view
 */
export function toggleView(view: EvolutionView): EvolutionView {
  return view === "before" ? "after" : "before";
}

/**
 * Tab single-selection helper.
 *
 * Backs Property 11 (architecture tabs enforce single-panel mutual exclusion):
 * a panel is visible exactly when its id matches the currently selected tab id,
 * so at most (and, for a valid selected id, exactly) one panel is visible.
 *
 * @param selectedId the id of the currently selected tab
 * @param tabId the id of the tab/panel whose visibility is being queried
 * @returns true iff this tab is the selected one
 */
export function isTabVisible(selectedId: string, tabId: string): boolean {
  return selectedId === tabId;
}

/**
 * Compute visibility for a set of tabs given the selected id.
 *
 * Returns a map from tab id to its visibility. Exactly one entry is `true`
 * when `selectedId` matches one of the tab ids; all others are `false`.
 *
 * @param tabIds the ids of all tabs
 * @param selectedId the id of the currently selected tab
 */
export function selectTab(
  tabIds: readonly string[],
  selectedId: string
): Record<string, boolean> {
  const visibility: Record<string, boolean> = {};
  for (const tabId of tabIds) {
    visibility[tabId] = isTabVisible(selectedId, tabId);
  }
  return visibility;
}

/**
 * Result of advancing the run-once latch.
 *
 * - `hasRun` — the next latch state (always `true` after a trigger).
 * - `shouldAnimate` — whether the animation should fire on this trigger; true
 *   only on the first trigger, false on every subsequent one.
 */
export interface RunOnceResult {
  hasRun: boolean;
  shouldAnimate: boolean;
}

/**
 * Pure run-once reducer.
 *
 * Backs Property 13 (entry and counter animations trigger at most once): given
 * any sequence of enter/exit events, feeding each event through this reducer
 * yields `shouldAnimate === true` at most once (on the first call where
 * `hasRun` is false).
 *
 * @param hasRun whether the animation has already run
 * @returns the next latch state and whether to animate now
 */
export function runOnce(hasRun: boolean): RunOnceResult {
  if (hasRun) {
    return { hasRun: true, shouldAnimate: false };
  }
  return { hasRun: true, shouldAnimate: true };
}

/** A stateful, run-at-most-once latch produced by {@link createRunOnceLatch}. */
export interface RunOnceLatch {
  /**
   * Attempt to fire the latch. Returns true exactly once — on the first call —
   * and false on every subsequent call.
   */
  trigger(): boolean;
  /** Whether the latch has already fired. */
  hasRun(): boolean;
}

/**
 * Factory for a run-once latch built on the pure {@link runOnce} reducer.
 *
 * The latch encapsulates its own `hasRun` state; `trigger()` fires the
 * animation at most once regardless of how many times it is called. This backs
 * Property 13 for imperative call sites that prefer a latch over the reducer.
 */
export function createRunOnceLatch(): RunOnceLatch {
  let hasRun = false;
  return {
    trigger(): boolean {
      const result = runOnce(hasRun);
      hasRun = result.hasRun;
      return result.shouldAnimate;
    },
    hasRun(): boolean {
      return hasRun;
    },
  };
}
